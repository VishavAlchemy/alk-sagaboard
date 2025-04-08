'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Sidebar from '../components/Sidebar'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser, SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useStorageUrl } from '@/convex/useStorageUrl'

// Add this component for displaying storage images
const StorageImage = ({ 
  storageId, 
  alt = "", 
  width, 
  height, 
  className = "" 
}: { 
  storageId: string, 
  alt?: string, 
  width: number, 
  height: number, 
  className?: string 
}) => {
  const imageUrl = useStorageUrl(storageId);
  
  if (!imageUrl) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} 
           style={{ width, height }}>
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }
  
  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

const Page = () => {
  // Move all hooks to the top and ensure they're called unconditionally
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const userProfile = useQuery(api.users.getUserProfile, { 
    userId: user?.id || '' 
  });
  
  // Use the storage URL hook to get the correct profile picture URL
  const profileImageUrl = useStorageUrl(userProfile?.profilePictureId || null);
  const [imageError, setImageError] = useState(false);
  
  // Show loading state while Clerk loads
  if (!isLoaded) {
    return (
      <div className="flex bg-white min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="animate-pulse text-lg text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  // Show sign in button if no user
  if (!user) {
    return (
      <div className="flex bg-white min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6 flex flex-col items-center justify-center gap-4">
          <p className="text-lg text-gray-600">Please sign in to view your profile</p>
          <SignInButton mode="modal">
            <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  // Extract profile data with blank fallbacks
  const profileData = userProfile ? {
    firstName: userProfile.firstName || '',
    username: userProfile.username || '',
    age: userProfile.age || '',
    occupation: userProfile.occupation || '',
    about: userProfile.about || '',
    experience: userProfile.experience || '',
    interests: userProfile.interests || [],
    links: userProfile.links || [],
  } : {
    firstName: '',
    username: '',
    age: '',
    occupation: '',
    about: '',
    experience: '',
    interests: [],
    links: []
  };

  // Empty arrays if data is missing - use userProfile instead of userData
  const galleryImages = userProfile?.galleryImageIds || [];
  const favoriteBooks = userProfile?.bookImageIds || [];
  const project = userProfile?.project || {
    logoUrl: "",
    headline: "",
    subheadline: "",
    link: "#"
  };

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />
      <div className="flex flex-col md:flex-row flex-1 p-6 w-full text-black">
        <div className="w-full md:w-3/5 pr-6">
          <div className="flex items-start mb-5">
            <div className="mr-4">
              {/* Profile image with proper fallback */}
              {profileImageUrl && !imageError ? (
                <div className="relative w-[100px] h-[100px]">
                  <Image
                    src={profileImageUrl}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                    onError={() => setImageError(true)}
                    sizes="100px"
                  />
                </div>
              ) : (
                <div className="w-[100px] h-[100px] bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl text-gray-500">
                    {(profileData.firstName || '?')[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className='flex justify-between gap-2'>
                <div className="flex flex-row justify-between items-center gap-2">
                  <h1 className="text-3xl font-bold">{profileData.firstName}</h1>
                  {userProfile && <Image src="/profilev1/verified.svg" alt="Space" width={20} height={20} />}
                </div>
                <button className='bg-black text-white px-4 py-2 rounded-full mt-2'>Follow</button>
                <button className='bg-black text-white px-4 py-2 rounded-full mt-2'><ChatBubbleIcon className='w-5 h-5' /></button>
                <Link 
                  href="/profilev2/edit" 
                  className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-full mt-2 border border-gray-300 hover:border-gray-400 transition-all text-sm flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </Link>
              </div>
              <div className='flex flex-row gap-2'></div>
              <p className="text-gray-600 text-sm mt-1">
                {profileData.age && profileData.occupation ? `${profileData.age} - ${profileData.occupation}` : 
                  <span className="animate-pulse">Loading profile info...</span>
                }
              </p>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <span>@{profileData.username}</span>
                <Image src="/flags/canada.svg" alt="Canada" width={20} height={15} className="mx-2" />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">About Me</h2>
            <p className="text-sm mb-3">{profileData.about}</p>
            <h2 className="text-2xl font-bold mb-4">Experience</h2>
            <p className="text-sm mb-3">{profileData.experience}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {profileData.interests.map((interest: string, index: number) => {
              const colorClasses = [
                "bg-orange-100 text-orange-800",
                "bg-green-100 text-green-800",
                "bg-blue-100 text-blue-800",
                "bg-red-100 text-red-800",
                "bg-yellow-100 text-yellow-800",
                "bg-white border border-gray-300 text-gray-800",
                "bg-black border border-gray-300 text-white",
                "bg-purple-100 border border-gray-300 text-purple-800"
              ];
              const colorClass = colorClasses[index % colorClasses.length];
              return (
                <span key={index} className={`px-4 py-2 ${colorClass} rounded-full text-sm`}>
                  {interest}
                </span>
              );
            })}
          </div>

          <div className="mb-8">
            <h3 className="text-lg text-gray-500 mb-2">Links</h3>
            <div className="flex flex-col space-y-2">
              {profileData.links.map((link: { url: string; title?: string }, index: number) => (
                <a 
                  key={index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {link.title || link.url}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/5 mt-6 md:mt-0 ml-auto">
          <div className="mb-4">
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {galleryImages.slice(0, 9).map((imageId: string, index: number) => (
                  <StorageImage 
                    key={index}
                    storageId={imageId}
                    alt="Gallery Image" 
                    width={200} 
                    height={200} 
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 h-[200px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 text-sm">No gallery images yet</p>
              </div>
            )}
          </div>

          <div className="mb-6">
            {favoriteBooks.length > 0 ? (
              <div className="flex overflow-x-auto space-x-2">
                {favoriteBooks.map((bookId: string, index: number) => (
                  <StorageImage 
                    key={index}
                    storageId={bookId}
                    alt="Book" 
                    width={70} 
                    height={100} 
                    className="object-cover rounded min-w-[70px] h-[100px]"
                  />
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center bg-gray-50 h-[100px]">
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-gray-500 text-sm">No favorite books</p>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            {typeof project === 'object' && project.headline ? (
              <div className="flex items-center bg-white text-black rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="mr-3 w-16 h-16 flex-shrink-0">
                  {project.logoUrl ? (
                    <StorageImage
                      storageId={project.logoUrl}
                      alt="Project Logo"
                      width={64}
                      height={64}
                      className="rounded-md object-contain bg-gray-50"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No logo</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-black text-xl">
                    {project.headline}
                  </h3>
                  <p className="text-[10px] text-gray-600 mt-1">
                    {project.subheadline}
                  </p>
                </div>
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center hover:opacity-70 transition-opacity"
                >
                  <span className="text-xl"> →</span>
                </a>
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <p className="text-gray-500">No project added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page