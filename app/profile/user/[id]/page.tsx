'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useAvatarProfile } from '@/app/hooks/useAvatarProfile'
import { useAuth } from "@clerk/nextjs";
import { type AvatarProfile } from '@/app/types/avatarProfile';
import { useRouter } from 'next/navigation'
import EditProfileButton from '@/app/components/EditProfileButton'
// Assuming Sidebar might be needed later or can be removed if not part of the new design
// import Sidebar from '../components/Sidebar' 

// Helper function to get icon color
const getIconColor = (color: string) => {
  const colors = {
    // Primary Colors
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
    
    // Grayscale
    slate: "fill-slate-500",
    gray: "fill-gray-500",
    zinc: "fill-zinc-500",
    neutral: "fill-neutral-500",
    stone: "fill-stone-500"
  };
  return colors[color as keyof typeof colors] || "fill-gray-500";
};

// Helper function to get project border color
const getProjectBorderColor = (color: string) => {
  const colors = {
    // Primary Colors
    red: "border-t-red-500",
    orange: "border-t-orange-500",
    amber: "border-t-amber-500",
    yellow: "border-t-yellow-500",
    lime: "border-t-lime-500",
    green: "border-t-green-500",
    emerald: "border-t-emerald-500",
    teal: "border-t-teal-500",
    cyan: "border-t-cyan-500",
    sky: "border-t-sky-500",
    blue: "border-t-blue-500",
    indigo: "border-t-indigo-500",
    violet: "border-t-violet-500",
    purple: "border-t-purple-500",
    fuchsia: "border-t-fuchsia-500",
    pink: "border-t-pink-500",
    rose: "border-t-rose-500",
    
    // Grayscale
    slate: "border-t-slate-500",
    gray: "border-t-gray-500",
    zinc: "border-t-zinc-500",
    neutral: "border-t-neutral-500",
    stone: "border-t-stone-500"
  };
  return colors[color as keyof typeof colors] || "border-t-gray-500";
};

const ProfilePage = () => {
  const params = useParams();
  const { userId, isLoaded: isAuthLoaded } = useAuth();
  const { profile: myProfile, allProfiles, isLoading, isAuthenticated, createProfile } = useAvatarProfile();
  const [profileData, setProfileData] = useState<AvatarProfile | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const router = useRouter();

  // Determine if this is the user's own profile
  useEffect(() => {
    if (params.id && userId) {
      // Check if viewing own profile
      setIsOwnProfile(params.id === userId);
      
      // Find profile by the ID parameter
      if (allProfiles) {
        const foundProfile = allProfiles.find(p => p.userId === params.id);
        setProfileData(foundProfile || null);
      } else if (isOwnProfile && myProfile) {
        setProfileData(myProfile);
      }
    }
  }, [params.id, userId, myProfile, allProfiles, isOwnProfile]);

  // Show loading state while auth or profile is loading
  if (!isAuthLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  // Show sign in prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-400">You need to be signed in to view profiles.</p>
        </div>
      </div>
    );
  }

  // Show profile not found if no profile found for the given ID
  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-400 mb-4">No profile exists for this user.</p>
          {isOwnProfile && (
            <button
              onClick={async () => {
                try {
                  await createProfile({
                    userId: userId || "",
                    profile: {
                      personalInfo: {
                        name: "Your Name",
                        role: "Your Role",
                        location: "Your Location",
                        image: "/profilev1/pp.svg",
                        socialLinks: {
                          website: "https://yourwebsite.com",
                          github: "https://github.com/yourusername",
                          twitter: "https://twitter.com/yourusername"
                        }
                      },
                      experience: [
                        {
                          icon: "orange",
                          text: "Your first experience"
                        }
                      ],
                      skills: [
                        {
                          icon: "blue",
                          text: "Your first skill"
                        }
                      ],
                      aboutMe: {
                        aboutMe: "Tell us about yourself",
                        favoriteBooks: ["Your favorite book"]
                      },
                      projects: [
                        {
                          id: "1",
                          title: "Your First Project",
                          description: ["Project description"],
                          color: "green"
                        }
                      ]
                    }
                  });
                } catch (error) {
                  console.error("Error creating profile:", error);
                }
              }}
              className="bg-white text-black hover:bg-gray-200 px-5 py-2 rounded text-sm"
            >
              Create Profile
            </button>
          )}
        </div>
      </div>
    );
  }

  const profile = profileData;

  return (
    <div className="flex flex-col bg-black min-h-screen text-white py-6">
      <div className="px-4 md:px-6 w-full max-w-7xl mx-auto">
        {/* Main Content Grid with Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          {/* Left Column (3/5 width) */}
          <div className="md:col-span-3">
            {/* Profile Info */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0">
                <Image 
                  src={profile.personalInfo.image}
                  alt={`${profile.personalInfo.name} Profile Picture`}
                  width={110}
                  height={110}
                  className="rounded-full border-2 border-gray-700" 
                />
              </div>
              <div>
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-1">{profile.personalInfo.name}</h1>
                    <p className="text-gray-400">{profile.personalInfo.role}</p>
                    <p className="text-gray-400 mb-3">{profile.personalInfo.location}</p>
                  </div>
                  {isOwnProfile && (
                   <EditProfileButton />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {!isOwnProfile && (
                    <button className="bg-white text-black hover:bg-gray-200 px-5 py-1.5 rounded text-sm">
                      Message
                    </button>
                  )}
                  <a href={profile.personalInfo.socialLinks.website} target="_blank" rel="noopener noreferrer" className="bg-transparent hover:bg-gray-800 p-2 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-white">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </a>
                  <a href={profile.personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" className="bg-transparent hover:bg-gray-800 p-2 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-white">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </a>
                  <a href={profile.personalInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="bg-transparent hover:bg-gray-800 p-2 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-white">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Experience</h2>
              <div className="bg-black rounded-lg p-4 text-sm text-gray-300">
                <div className="space-y-3">
                  {profile.experience.map((exp: { icon: string; text: string }, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <svg width="12" height="12" viewBox="0 0 10 10" className={`flex-shrink-0 mt-1 ${getIconColor(exp.icon)}`}>
                        <polygon points="5,1 9,9 1,9" />
                      </svg>
                      <p>{exp.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* About Me and Skills in Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              {/* Skills Column */}
              <div>
                <h2 className="text-2xl font-semibold">Skills</h2>
                <div className="bg-black rounded-lg p-4 text-sm text-gray-300 h-full">
                  <div className="space-y-2 mt-2">
                    {profile.skills.map((skill: { icon: string; text: string }, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <svg width="12" height="12" viewBox="0 0 10 10" className={`flex-shrink-0 mt-1 ${getIconColor(skill.icon)}`}>
                          <circle cx="5" cy="5" r="4" />
                        </svg>
                        <p>{skill.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* About Me Column */}
              <div>
                <h2 className="text-2xl font-semibold">About Me</h2>
                <div className="bg-black rounded-lg p-4 text-sm text-gray-300 h-full">
                  <div className="space-y-2">
                    <p>{profile.aboutMe.aboutMe}</p>
                    <p>Favorite books:</p>
                    <ul className="list-disc list-inside pl-4">
                      {profile.aboutMe.favoriteBooks.map((book: string, index: number) => (
                        <li key={index}>{book}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column (2/5 width) */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-3">
              {/* Projects Title */}
              <h2 className="text-2xl font-semibold">Work & Education</h2>
            </div>
            
            {/* Projects Section */}
            <div className="bg-black rounded-lg p-4 text-sm text-gray-300">
              {profile.projects.map((project: { id: string; title: string; description: string[] | string; date?: string; color: string }) => (
                <div key={project.id} className={`border border-gray-700 p-3 rounded-lg mb-3 transition-colors hover:bg-gray-900 border-t-2 ${getProjectBorderColor(project.color)} min-h-[8rem]`}>
                  <h3 className="text-base font-semibold mb-1">{project.title}</h3>
                  {Array.isArray(project.description) ? (
                    project.description.map((desc: string, index: number) => (
                      <p key={index} className="text-xs text-gray-400 mb-1">{desc}</p>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 mb-1">{project.description}</p>
                  )}
                  {project.date && (
                    <p className="text-xs text-gray-500 text-right">{project.date}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage