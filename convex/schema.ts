import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Basic user info from auth provider
    email: v.string(),
    name: v.string(),
    avatarUrl: v.string(),
    clerkId: v.string(),
    
    // Payment integration
    stripeCustomerId: v.optional(v.string()),
    stripeConnectAccountId: v.optional(v.string()),
    stripeConnectCompleted: v.optional(v.boolean()),
    
    // Onboarding fields
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()), // @username - must be unique
    age: v.optional(v.number()),
    archetypes: v.optional(v.array(v.string())),
    aboutMe: v.optional(v.string()),
    experience: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    
    // Gallery images - array of URLs
    galleryImages: v.optional(v.array(v.string())),
    
    // Favorite books - array of book objects with cover URLs
    favoriteBooks: v.optional(v.array(v.object({
      coverUrl: v.string(),
      title: v.optional(v.string()),
    }))),
    
    // Project info
    project: v.optional(v.object({
      logoUrl: v.string(),
      headline: v.string(),
      subheadline: v.string(),
      link: v.string(),
    })),
    
    // Social/professional links
    links: v.optional(v.array(v.object({
      type: v.string(), // github, website, instagram, etc.
      url: v.string(),
      title: v.optional(v.string()),
    }))),
    
    // Flag to track if onboarding is complete
    onboardingComplete: v.optional(v.boolean()),

    // Add the new image fields
    profilePictureId: v.optional(v.string()),
    galleryImageIds: v.optional(v.array(v.string())),
    bookImageIds: v.optional(v.array(v.string())),
  }).index("by_clerk_id", ["clerkId"])
    .index("by_username", ["username"]),

  messages: defineTable({
    content: v.string(),
    senderId: v.string(),
    receiverId: v.string(),
    conversationId: v.string(),
    createdAt: v.number(),
    read: v.boolean(),
    // Optional: attachments, etc.
  }).index("by_conversation", ["conversationId", "createdAt"]),

  conversations: defineTable({
    participantIds: v.array(v.string()),
    lastMessageAt: v.number(),
    lastMessage: v.optional(v.string()),
    type: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_participants", ["participantIds"]),
}); 