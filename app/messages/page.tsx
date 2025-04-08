'use client'
import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useAuth } from '@clerk/nextjs'
import Sidebar from '../components/Sidebar'
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
    <div className={`${isOwn ? 'bg-black text-white' : 'bg-gray-100'} rounded-2xl px-4 py-2 max-w-[70%]`}>
      <p>{message.content}</p>
      <span className="text-xs opacity-70">
        {new Date(message.createdAt).toLocaleTimeString()}
      </span>
    </div>
  </div>
)

// User profile image component
const UserProfileImage = ({ user }: { user: any }) => {
  const imageUrl = useStorageUrl(user?.profilePictureId);
  const [imageError, setImageError] = useState(false);
  
  if (!user?.profilePictureId || !imageUrl || imageError) {
    return (
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
        <span className="text-sm text-gray-500">
          {(user?.name || '?')[0]?.toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-10 h-10">
      <Image
        src={imageUrl}
        alt={user.name || ''}
        fill
        className="rounded-full object-cover"
        onError={() => setImageError(true)}
        sizes="(max-width: 40px) 100vw, 40px"
      />
    </div>
  );
};

const LoadingState = () => (
  <div className="flex bg-white min-h-screen">
    <Sidebar />
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading messages...</div>
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

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    await sendMessage({
      content: newMessage,
      receiverId: selectedConversation.otherUser?._id || '',
      senderId: userId || '',
      conversationId: selectedConversation._id
    })
    setNewMessage('')
  }

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />
      
      {/* Conversations List */}
      <div className="w-[280px] border-r border-gray-200 overflow-y-auto">
        {conversations && conversations.length > 0 ? (
          conversations.map((conversation) => (
            <div
              key={conversation._id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedConversation?._id === conversation._id ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <UserProfileImage user={conversation.otherUser} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate text-black">{conversation.otherUser?.firstName}</h3>
                  <p className="text-sm text-gray-500 truncate max-w-[180px]">
                    {conversation.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-gray-500 text-center">
            <p className="mb-2">No conversations yet</p>
            <a href="/explore" className="text-blue-500 hover:underline">
              Explore users to start chatting
            </a>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col text-black">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <UserProfileImage user={selectedConversation.otherUser} />
                <h2 className="font-semibold text-black">{selectedConversation.otherUser?.firstName} </h2>
              </div>
            </div>

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
                <div className="flex justify-center items-center h-full text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="mb-2">Select a conversation to start messaging</p>
              {conversations && conversations.length === 0 && (
                <a href="/explore" className="text-blue-500 hover:underline">
                  Or explore users to start a new chat
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