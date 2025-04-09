'use client'
import React from 'react'
import Image from 'next/image'
import { useAvatarProfile } from '../hooks/useAvatarProfile'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Helper function to get icon color
const getIconColor = (color: string) => {
  const colors = {
    red: "fill-red-500",
    orange: "fill-orange-500",
    amber: "fill-amber-500",
    yellow: "fill-yellow-500",
    lime: "fill-lime-500",
    green: "fill-green-500",
    emerald: "fill-emerald-500",
    teal: "fill-teal-500",
    cyan: "fill-cyan-500",
    sky: "fill-sky-500",
    blue: "fill-blue-500",
    indigo: "fill-indigo-500",
    violet: "fill-violet-500",
    purple: "fill-purple-500",
    fuchsia: "fill-fuchsia-500",
    pink: "fill-pink-500",
    rose: "fill-rose-500",
    slate: "fill-slate-500",
    gray: "fill-gray-500",
    zinc: "fill-zinc-500",
    neutral: "fill-neutral-500",
    stone: "fill-stone-500"
  };
  return colors[color as keyof typeof colors] || "fill-gray-500";
};

const MembersPage = () => {
  const { allProfiles, isAllProfilesLoading } = useAvatarProfile();
  const router = useRouter();

  // Show loading state while profiles are loading
  if (isAllProfilesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-black min-h-screen text-white py-6">
      <div className="px-4 md:px-6 w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="text-gray-400">Connect with our community members</p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allProfiles && allProfiles.map((profile) => (
            <div 
              key={profile._id} 
              className="bg-black border border-gray-800 rounded-lg p-4 hover:border-gray-600 transition-colors cursor-pointer"
              onClick={() => router.push(`/profile/user/${profile.userId}`)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Image 
                  src={profile.personalInfo.image}
                  alt={`${profile.personalInfo.name} Profile Picture`}
                  width={50}
                  height={50}
                  className="rounded-full border-2 border-gray-700"
                />
                <div>
                  <h3 className="font-bold">{profile.personalInfo.name}</h3>
                  <p className="text-sm text-gray-400">{profile.personalInfo.location}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {profile.experience.slice(0, 3).map((exp, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <svg width="10" height="10" viewBox="0 0 10 10" className={`flex-shrink-0 mt-1 ${getIconColor(exp.icon)}`}>
                      <polygon points="5,1 9,9 1,9" />
                    </svg>
                    <p className="text-xs text-gray-300 line-clamp-1">{exp.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-800 flex justify-end">
                <Link href="#" className="text-xs text-white bg-gray-800 px-3 py-1 rounded-full hover:bg-gray-700 transition-colors">
                  Connect
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MembersPage

