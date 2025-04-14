import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { Id } from './_generated/dataModel'

// Get conversations for a user
export const getUserConversations = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Convert to Clerk ID if needed
    let clerkUserId = userId;
    if (!userId.startsWith('user_')) {
      const user = await ctx.db
        .query('users')
        .filter(q => q.eq(q.field('_id'), userId))
        .first();
      
      if (user?.clerkId) {
        clerkUserId = user.clerkId;
      }
    }
    
    // Find conversations with this Clerk ID
    const allConversations = await ctx.db
      .query('conversations')
      .collect();
    
    const conversations = allConversations.filter(
      conv => conv.participantIds.includes(clerkUserId)
    );
    
    // Get user details for each conversation
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conv) => {
        const otherClerkId = conv.participantIds.find(id => id !== clerkUserId);
        
        // Find user by Clerk ID
        const otherUser = await ctx.db
          .query('users')
          .filter(q => q.eq(q.field('clerkId'), otherClerkId))
          .first();
          
        return { ...conv, otherUser };
      })
    );
    
    return conversationsWithUsers;
  }
});

// Get messages for a specific conversation
export const getMessages = query({
  args: { conversationId: v.string() },
  handler: async (ctx, { conversationId }) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_conversation', q => q.eq('conversationId', conversationId))
      .order('asc', 'createdAt')
      .collect();
  }
});

// Send a message
export const sendMessage = mutation({
  args: {
    content: v.string(),
    receiverId: v.string(),
    senderId: v.string(),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, { content, receiverId, senderId, conversationId }) => {
    const now = Date.now();
    
    // Ensure we have Clerk IDs for both sender and receiver
    let clerkReceiverId = receiverId;
    let clerkSenderId = senderId;
    
    // If receiverId is not a Clerk ID (doesn't start with 'user_'), get the Clerk ID
    if (!receiverId.startsWith('user_')) {
      const receiverUser = await ctx.db
        .query('users')
        .filter(q => q.eq(q.field('_id'), receiverId))
        .first();
      
      if (receiverUser?.clerkId) {
        clerkReceiverId = receiverUser.clerkId;
      }
    }
    
    // Similarly for senderId
    if (!senderId.startsWith('user_')) {
      const senderUser = await ctx.db
        .query('users')
        .filter(q => q.eq(q.field('_id'), senderId))
        .first();
      
      if (senderUser?.clerkId) {
        clerkSenderId = senderUser.clerkId;
      }
    }
    
    let actualConversationId = conversationId;
    
    if (!actualConversationId) {
      // Find conversation between these Clerk IDs
      const allConversations = await ctx.db
        .query('conversations')
        .collect();
      
      const conversation = allConversations.find(
        conv => 
          conv.participantIds.includes(clerkSenderId) && 
          conv.participantIds.includes(clerkReceiverId)
      );

      if (conversation) {
        actualConversationId = conversation._id;
        
        await ctx.db.patch(actualConversationId, {
          lastMessage: content,
          lastMessageAt: now
        });
      } else {
        // Create new conversation with Clerk IDs
        actualConversationId = await ctx.db.insert('conversations', {
          participantIds: [clerkSenderId, clerkReceiverId],
          lastMessageAt: now,
          lastMessage: content,
          type: 'direct',
          createdAt: now
        });
      }
    } else {
      await ctx.db.patch(actualConversationId, {
        lastMessage: content,
        lastMessageAt: now
      });
    }

    // Create message with Clerk IDs
    await ctx.db.insert('messages', {
      content,
      senderId: clerkSenderId,
      receiverId: clerkReceiverId,
      conversationId: actualConversationId,
      createdAt: now,
      read: false
    });

    return actualConversationId;
  }
});

export const startConversation = mutation({
  args: { participantId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }
    
    // This is already the Clerk ID
    const clerkUserId = identity.subject
    
    // Ensure participant ID is a Clerk ID
    let clerkParticipantId = args.participantId;
    if (!args.participantId.startsWith('user_')) {
      const participantUser = await ctx.db
        .query('users')
        .filter(q => q.eq(q.field('_id'), args.participantId))
        .first();
      
      if (participantUser?.clerkId) {
        clerkParticipantId = participantUser.clerkId;
      }
    }

    // Find conversation with Clerk IDs
    const allConversations = await ctx.db
      .query('conversations')
      .collect();
    
    const existingConversation = allConversations.find(
      conv => 
        conv.participantIds.includes(clerkUserId) && 
        conv.participantIds.includes(clerkParticipantId)
    );

    if (existingConversation) {
      return existingConversation._id;
    }

    // Create conversation with Clerk IDs
    const now = Date.now();
    const conversationId = await ctx.db.insert('conversations', {
      participantIds: [clerkUserId, clerkParticipantId],
      type: 'direct',
      createdAt: now,
      lastMessageAt: now,
      lastMessage: undefined
    });

    return conversationId;
  }
});

// Get unread messages count for a user
export const getUnreadMessagesCount = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Convert to Clerk ID if needed
    let clerkUserId = userId;
    if (!userId.startsWith('user_')) {
      const user = await ctx.db
        .query('users')
        .filter(q => q.eq(q.field('_id'), userId))
        .first();
      
      if (user?.clerkId) {
        clerkUserId = user.clerkId;
      }
    }
    
    // Get all unread messages where user is the receiver
    const unreadMessages = await ctx.db
      .query('messages')
      .filter(q => 
        q.and(
          q.eq(q.field('receiverId'), clerkUserId),
          q.eq(q.field('read'), false)
        )
      )
      .collect();
    
    return unreadMessages.length;
  }
});