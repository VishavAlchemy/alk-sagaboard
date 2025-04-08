'use client'
import React, { useState, useMemo } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import Sidebar from '../components/Sidebar'
import Image from 'next/image'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { useStorageUrl } from '../../convex/useStorageUrl'
import { useRouter } from 'next/navigation'

const UserProfileImage = ({ user }: { user: any }) => {
  const imageUrl = useStorageUrl(user.profilePictureId);
  const [imageError, setImageError] = useState(false);
  
  if (!user.profilePictureId || !imageUrl || imageError) {
    return (
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
        <span className="text-2xl text-gray-500">
          {(user.name || '?')[0].toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-16 h-16">
      <Image
        src={imageUrl}
        alt={user.name || ''}
        fill
        className="rounded-full object-cover"
        onError={() => setImageError(true)}
        sizes="(max-width: 64px) 100vw, 64px"
      />
    </div>
  );
};

const DiscoverPage = () => {
  const { userId } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  
  // Fetch all users from Convex
  const users = useQuery(api.users.getAllUsers)

  //start Chat
  const startChat = useMutation(api.messages.startConversation)

  // router
  const router = useRouter()

  const handleStartChat = async (targetUserId: string) => {
    try {
      const conversationId = await startChat({ participantId: targetUserId })
      router.push(`/messages?id=${conversationId}`)
    } catch (error) {
      console.error('Error starting chat:', error)
    }
  }

  // Filter users based on search query
  const filteredUsers = useMemo(() => 
    users?.filter(user => 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.archetypes?.join(', ')?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [users, searchQuery]
  )

  // Find the function that handles starting a conversation
  // It might look something like this:
  const handleStartConversation = async (userId: string) => {
    try {
      // Create or get existing conversation
      const conversationId = await startChat({
        participantId: userId
      });
      
      // Redirect to messages with the conversation ID
      router.push(`/messages?id=${conversationId}`);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Discover People</h1>
            <p className="text-gray-600">Connect with other members of the community</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search by name, username, or occupation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-black"
            />
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers?.map((user) => (
              <div key={user._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="relative w-16 h-16 mr-4">
                      <UserProfileImage user={user} />
                    </div>
                    <div>
                      <Link href={`/profile/${user._id}`} className="font-bold text-black text-lg hover:underline">
                        {user.firstName}
                      </Link>
                      <p className="text-gray-600 text-sm">@{user.username}</p>
                      <p className="text-gray-500 text-sm">{user.archetypes?.join(', ')}</p>
                    </div>
                  </div>
                </div>

                {/* Interests */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {user.interests?.slice(0, 3).map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {interest}
                      </span>
                    ))}
                    {(user.interests?.length || 0) > 3 && (
                      <span className="text-gray-500 text-xs">
                        +{user.interests!.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {userId !== user._id && (
                  <div className="flex gap-2">
                    <button className="flex-1 bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors">
                      Follow
                    </button>
                    <button 
                      onClick={() => handleStartChat(user._id)}
                      className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      <ChatBubbleIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Loading State */}
          {!users && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          )}

          {/* Empty State */}
          {users?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DiscoverPage