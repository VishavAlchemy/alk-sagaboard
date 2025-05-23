'use client'
import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useAuth } from '@clerk/nextjs'
import Image from 'next/image'
import { Gloria_Hallelujah } from 'next/font/google'
import { useSearchParams } from 'next/navigation'
import { useStorageUrl } from '../../convex/useStorageUrl'
import { Id } from '../../convex/_generated/dataModel'

const gloria = Gloria_Hallelujah({
  weight: '400',
  subsets: ['latin'],
})

// Define proper types for our conversation and message
interface ConversationWithUser {
  _id: Id<"conversations">;
  participantIds: string[];
  lastMessageAt: number;
  lastMessage?: string;
  type?: string;
  createdAt: number;
  otherUser: any;
}

const ChatMessage = ({ message, isOwn }: { message: any, isOwn: boolean }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`${isOwn ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-300'} rounded-2xl px-4 py-2 max-w-[70%]`}>
      <p>{message.content}</p>
      <span className="text-xs text-gray-400">
        {new Date(message.createdAt).toLocaleTimeString()}
      </span>
    </div>
  </div>
)

// Separate component for profile image to properly handle hooks
const ProfileImage = ({ imageSource, name }: { imageSource: string, name: string }) => {
  const storageUrl = useStorageUrl(imageSource);
  const finalImageUrl = !imageSource ? '/default-avatar.svg' :
    imageSource.startsWith('http') || imageSource.startsWith('/') 
      ? imageSource 
      : storageUrl;

  return (
    <div className="relative w-10 h-10">
      <Image
        src={finalImageUrl || '/default-avatar.svg'}
        alt={name}
        fill
        className="rounded-full object-cover"
        sizes="(max-width: 40px) 100vw, 40px"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/default-avatar.svg';
        }}
      />
    </div>
  );
};

// Separate component for conversation item to properly handle hooks
const ConversationItem = ({ 
  conversation, 
  isSelected, 
  onClick 
}: { 
  conversation: ConversationWithUser, 
  isSelected: boolean,
  onClick: () => void
}) => {
  const avatarProfile = useQuery(api.avatarProfiles.get, { 
    userId: conversation.otherUser?.clerkId || '' 
  });

  if (!avatarProfile) {
    return (
      <div
        onClick={onClick}
        className={`p-4 cursor-pointer hover:bg-gray-900 ${
          isSelected ? 'bg-gray-900' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm text-gray-500">
              {(conversation.otherUser?.firstName || '?')[0]?.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold truncate text-white">
              {`${conversation.otherUser?.firstName} ${conversation.otherUser?.lastName}`}
            </h3>
            <p className="text-sm text-gray-400 truncate max-w-[180px]">
              {conversation.lastMessage || "No messages yet"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer hover:bg-gray-900 ${
        isSelected ? 'bg-gray-900' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <ProfileImage 
          imageSource={avatarProfile.personalInfo.image}
          name={avatarProfile.personalInfo.name}
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold truncate text-white">
            {avatarProfile.personalInfo.name}
          </h3>
          <p className="text-sm text-gray-400 truncate max-w-[180px]">
            {conversation.lastMessage || "No messages yet"}
          </p>
        </div>
      </div>
    </div>
  );
};

// Separate component for chat header to properly handle hooks
const ChatHeader = ({ user }: { user: any }) => {
  const avatarProfile = useQuery(api.avatarProfiles.get, { 
    userId: user?.clerkId || '' 
  });

  return (
    <div className="p-4 border-b border-gray-800">
      <div className="flex items-center gap-3">
        {avatarProfile ? (
          <>
            <ProfileImage 
              imageSource={avatarProfile.personalInfo.image}
              name={avatarProfile.personalInfo.name}
            />
            <div>
              <h2 className="font-semibold text-white">
                {avatarProfile.personalInfo.name}
              </h2>
              <p className="text-sm text-gray-400">
                {avatarProfile.personalInfo.role}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm text-gray-500">
                {(user?.firstName || '?')[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-white">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-gray-400">Member</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex bg-black min-h-screen">
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading messages...</div>
    </div>
  </div>
)

const MessagesContent = () => {
  const { userId } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithUser | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Get search params to handle direct navigation
  const searchParams = useSearchParams()
  const conversationIdFromUrl = searchParams.get('id')

  const conversations = useQuery(api.messages.getUserConversations, { userId: userId || '' })
  const messages = useQuery(api.messages.getMessages, 
    selectedConversation ? { conversationId: selectedConversation._id } : 'skip'
  )
  const sendMessage = useMutation(api.messages.sendMessage)
  const markMessagesAsRead = useMutation(api.messages.markMessagesAsRead)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Set the selected conversation when redirected with a conversation ID
  useEffect(() => {
    if (conversationIdFromUrl && conversations) {
      const conversation = conversations.find(conv => conv._id === conversationIdFromUrl)
      if (conversation) {
        setSelectedConversation(conversation)
      }
    }
  }, [conversationIdFromUrl, conversations])

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation && userId) {
      markMessagesAsRead({ 
        conversationId: selectedConversation._id,
        userId: userId
      })
    }
  }, [selectedConversation, userId, markMessagesAsRead])

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    await sendMessage({
      content: newMessage,
      receiverId: selectedConversation.otherUser?.clerkId || '',
      senderId: userId || '',
      conversationId: selectedConversation._id
    })
    setNewMessage('')
  }

  return (
    <div className="flex bg-black h-[calc(100vh-64px)]"> {/* Adjusted height for navbar */}
      
      {/* Conversations List */}
      <div className="w-[280px] border-r border-gray-800 flex flex-col h-full">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-white font-semibold">Messages</h2>
        </div>
        <div className="overflow-y-auto flex-1">
          {conversations && conversations.length > 0 ? (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                isSelected={selectedConversation?._id === conversation._id}
                onClick={() => setSelectedConversation(conversation)}
              />
            ))
          ) : (
            <div className="p-4 text-gray-400 text-center">
              <p className="mb-2">No conversations yet</p>
              <a href="/members" className="text-blue-400 hover:underline">
                Connect with buidlers, designers, engineers, etc.
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {selectedConversation ? (
          <>
            <ChatHeader user={selectedConversation.otherUser} />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages && messages.length > 0 ? (
                <>
                  {messages.map((message) => (
                    <ChatMessage
                      key={message._id}
                      message={message}
                      isOwn={message.senderId === userId}
                    />
                  ))}
                </>
              ) : (
                <div className="flex justify-center items-center h-full text-gray-400">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-800">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-full focus:outline-none focus:border-gray-600 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="mb-2">Select a conversation to start messaging</p>
              {conversations && conversations.length === 0 && (
                <a href="/members" className="text-blue-400 hover:underline">
                  Or connect with buidlers, designers, engineers, etc.
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const Page = () => {
  return (
    <Suspense fallback={<LoadingState />}>
      <MessagesContent />
    </Suspense>
  )
}

export default Page