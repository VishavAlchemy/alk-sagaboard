'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAvatarProfile } from '../../hooks/useAvatarProfile'
import { useAuth } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useStorageUrl } from '@/convex/useStorageUrl'

// Helper function to get icon color - same as profile page
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

// Color options with bg classes for visual selection
const colorOptions = [
  { name: 'red', class: 'bg-red-500' },
  { name: 'orange', class: 'bg-orange-500' },
  { name: 'amber', class: 'bg-amber-500' },
  { name: 'yellow', class: 'bg-yellow-500' },
  { name: 'lime', class: 'bg-lime-500' },
  { name: 'green', class: 'bg-green-500' },
  { name: 'emerald', class: 'bg-emerald-500' },
  { name: 'teal', class: 'bg-teal-500' },
  { name: 'cyan', class: 'bg-cyan-500' },
  { name: 'sky', class: 'bg-sky-500' },
  { name: 'blue', class: 'bg-blue-500' },
  { name: 'indigo', class: 'bg-indigo-500' },
  { name: 'violet', class: 'bg-violet-500' },
  { name: 'purple', class: 'bg-purple-500' },
  { name: 'fuchsia', class: 'bg-fuchsia-500' },
  { name: 'pink', class: 'bg-pink-500' },
  { name: 'rose', class: 'bg-rose-500' }
];

// Color Picker Component
const ColorPicker = ({ selectedColor, onChange }: { selectedColor: string, onChange: (color: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Find the selected color's class
  const selectedColorClass = colorOptions.find(c => c.name === selectedColor)?.class || 'bg-gray-500';
  
  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className={`w-6 h-6 rounded-full ${selectedColorClass} border border-gray-300`}></div>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 w-56 p-2 bg-gray-800 rounded-md shadow-lg grid grid-cols-6 gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => {
                onChange(color.name);
                setIsOpen(false);
              }}
              className={`w-7 h-7 rounded-full ${color.class} hover:scale-110 transition-transform ${selectedColor === color.name ? 'ring-2 ring-white' : ''}`}
              title={color.name}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

// Simple Icon component for visual representation of selection
const IconWithColor = ({ color }: { color: string }) => {
  const bgColor = colorOptions.find(c => c.name === color)?.class || 'bg-gray-500';
  
  return (
    <div className={`w-6 h-6 rounded-full ${bgColor}`}></div>
  );
};

const ProfileEditPage = () => {
  const router = useRouter()
  const { profile, isLoading, isAuthenticated, updateProfile } = useAvatarProfile()
  const { userId, isLoaded: isAuthLoaded } = useAuth()
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const uploadFile = useMutation(api.files.uploadFile)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      role: '',
      location: '',
      image: '',
      socialLinks: {
        website: '',
        github: '',
        twitter: ''
      }
    },
    experience: [{
      icon: 'orange',
      text: ''
    }],
    skills: [{
      icon: 'blue',
      text: ''
    }],
    aboutMe: {
      aboutMe: '',
      favoriteBooks: ['']
    },
    projects: [{
      id: '1',
      title: '',
      description: [''],
      color: 'green',
      date: ''
    }]
  })

  const imageUrl = useStorageUrl(formData.personalInfo.image || null)

  // Load existing profile data when available
  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        projects: profile.projects.map(project => ({
          ...project,
          date: project.date || ''
        }))
      });
    }
  }, [profile])

  // Loading state
  if (!isAuthLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    )
  }

  // Authentication check
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-400">You need to be signed in to edit your profile.</p>
        </div>
      </div>
    )
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const uploadUrl = await generateUploadUrl()
      
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })

      if (!result.ok) {
        throw new Error('Failed to upload file')
      }

      const { storageId } = await result.json()
      await uploadFile({ storageId, fileName: file.name })
      
      setFormData({
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          image: storageId
        }
      })
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile({
        userId: userId || "",
        profile: formData
      })
      router.push('/profile')
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [section, field] = e.target.name.split('.')
    if (field === 'website' || field === 'github' || field === 'twitter') {
      setFormData({
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          socialLinks: {
            ...formData.personalInfo.socialLinks,
            [field]: e.target.value
          }
        }
      })
    } else {
      setFormData({
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          [field]: e.target.value
        }
      })
    }
  }

  const handleArrayChange = (section: 'experience' | 'skills' | 'projects', index: number, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: (formData[section] as any[]).map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    })
  }

  const addArrayItem = (section: 'experience' | 'skills' | 'projects', template: any) => {
    setFormData({
      ...formData,
      [section]: [...(formData[section] as any[]), template]
    })
  }

  const removeArrayItem = (section: 'experience' | 'skills' | 'projects', index: number) => {
    setFormData({
      ...formData,
      [section]: (formData[section] as any[]).filter((_, i) => i !== index)
    })
  }

  return (
    <div className="flex flex-col bg-black min-h-screen text-white py-6">
      <div className="px-4 md:px-6 w-full max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center">Edit Your Profile</h1>
          <p className="text-gray-400 text-center mt-2">Customize how others see you</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left Column (3/5 width) */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit}>
              {/* Profile Info */}
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
                <div className="flex-shrink-0 relative group">
                  <Image 
                    src={imageUrl || "/profilev1/pp.svg"}
                    alt="Profile Picture"
                    width={110}
                    height={110}
                    className="rounded-full border-2 border-gray-700" 
                  />
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white"></div>
                    ) : (
                      <span className="text-white text-sm font-medium">Change Photo</span>
                    )}
                  </label>
                </div>
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    name="personalInfo.name"
                    value={formData.personalInfo.name}
                    onChange={handlePersonalInfoChange}
                    className="w-full bg-transparent text-3xl md:text-4xl font-bold mb-2 border-b border-transparent hover:border-gray-600 focus:border-gray-400 focus:outline-none"
                    placeholder="Your Name"
                  />
                  <input
                    type="text"
                    name="personalInfo.role"
                    value={formData.personalInfo.role}
                    onChange={handlePersonalInfoChange}
                    className="w-full bg-transparent text-gray-400 text-lg border-b border-transparent hover:border-gray-600 focus:border-gray-400 focus:outline-none"
                    placeholder="Your Role"
                  />
                  <input
                    type="text"
                    name="personalInfo.location"
                    value={formData.personalInfo.location}
                    onChange={handlePersonalInfoChange}
                    className="w-full bg-transparent text-gray-400 mb-3 border-b border-transparent hover:border-gray-600 focus:border-gray-400 focus:outline-none"
                    placeholder="Your Location"
                  />
                  <div className="flex flex-col gap-3 mt-3">
                    <div className="flex items-center space-x-2 p-2 rounded border border-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18" />
                      </svg>
                      <input
                        type="url"
                        name="personalInfo.website"
                        value={formData.personalInfo.socialLinks.website}
                        onChange={handlePersonalInfoChange}
                        className="flex-1 bg-transparent text-gray-300 focus:outline-none"
                        placeholder="Website URL"
                      />
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded border border-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      <input
                        type="url"
                        name="personalInfo.github"
                        value={formData.personalInfo.socialLinks.github}
                        onChange={handlePersonalInfoChange}
                        className="flex-1 bg-transparent text-gray-300 focus:outline-none"
                        placeholder="GitHub URL"
                      />
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded border border-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                      <input
                        type="url"
                        name="personalInfo.twitter"
                        value={formData.personalInfo.socialLinks.twitter}
                        onChange={handlePersonalInfoChange}
                        className="flex-1 bg-transparent text-gray-300 focus:outline-none"
                        placeholder="Twitter URL"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Experience</h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem('experience', { icon: 'orange', text: '' })}
                    className="flex items-center space-x-1 bg-black border border-gray-700 px-3 py-1 rounded hover:bg-gray-900 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Experience</span>
                  </button>
                </div>
                <div className="bg-black rounded-lg p-4 text-sm text-gray-300 border border-gray-700">
                  <div className="space-y-4">
                    {formData.experience.map((exp, index) => (
                      <div key={index} className="flex items-start space-x-3 group">
                        <div className="mt-1">
                          <ColorPicker 
                            selectedColor={exp.icon}
                            onChange={(color) => handleArrayChange('experience', index, 'icon', color)}
                          />
                        </div>
                        <input
                          type="text"
                          value={exp.text}
                          onChange={(e) => handleArrayChange('experience', index, 'text', e.target.value)}
                          className="flex-1 bg-transparent text-gray-300 border-b border-transparent hover:border-gray-600 focus:border-gray-400 focus:outline-none py-1"
                          placeholder="Experience description"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('experience', index)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-gray-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills and About Me Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Skills Column */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Skills</h2>
                    <button
                      type="button"
                      onClick={() => addArrayItem('skills', { icon: 'blue', text: '' })}
                      className="flex items-center space-x-1 bg-black border border-gray-700 px-3 py-1 rounded hover:bg-gray-900 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Add Skill</span>
                    </button>
                  </div>
                  <div className="bg-black rounded-lg p-4 text-sm text-gray-300 border border-gray-700 h-full">
                    <div className="space-y-3">
                      {formData.skills.map((skill, index) => (
                        <div key={index} className="flex items-start space-x-3 group">
                          <div className="mt-1">
                            <ColorPicker 
                              selectedColor={skill.icon}
                              onChange={(color) => handleArrayChange('skills', index, 'icon', color)}
                            />
                          </div>
                          <input
                            type="text"
                            value={skill.text}
                            onChange={(e) => handleArrayChange('skills', index, 'text', e.target.value)}
                            className="flex-1 bg-transparent text-gray-300 border-b border-transparent hover:border-gray-600 focus:border-gray-400 focus:outline-none py-1"
                            placeholder="Skill description"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem('skills', index)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-gray-800"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* About Me Column */}
                <div>
                  <h2 className="text-2xl font-semibold mb-4">About Me</h2>
                  <div className="bg-black rounded-lg p-4 text-sm text-gray-300 border border-gray-700 h-full">
                    <textarea
                      value={formData.aboutMe.aboutMe}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutMe: { ...formData.aboutMe, aboutMe: e.target.value }
                      })}
                      className="w-full bg-transparent text-gray-300 border border-gray-700 p-3 rounded-lg focus:ring-1 focus:ring-gray-500 focus:outline-none resize-none h-32"
                      placeholder="Tell us about yourself"
                    />
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-base font-medium">Favorite Books</label>
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            aboutMe: {
                              ...formData.aboutMe,
                              favoriteBooks: [...formData.aboutMe.favoriteBooks, '']
                            }
                          })}
                          className="flex items-center space-x-1 bg-black border border-gray-700 px-3 py-1 rounded hover:bg-gray-900 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Add Book</span>
                        </button>
                      </div>
                      <div className="space-y-2">
                        {formData.aboutMe.favoriteBooks.map((book, index) => (
                          <div key={index} className="flex items-center space-x-2 group">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <input
                              type="text"
                              value={book}
                              onChange={(e) => {
                                const newBooks = [...formData.aboutMe.favoriteBooks]
                                newBooks[index] = e.target.value
                                setFormData({
                                  ...formData,
                                  aboutMe: { ...formData.aboutMe, favoriteBooks: newBooks }
                                })
                              }}
                              className="flex-1 bg-transparent text-gray-300 border-b border-transparent hover:border-gray-600 focus:border-gray-400 focus:outline-none"
                              placeholder="Book title"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newBooks = formData.aboutMe.favoriteBooks.filter((_, i) => i !== index)
                                setFormData({
                                  ...formData,
                                  aboutMe: { ...formData.aboutMe, favoriteBooks: newBooks }
                                })
                              }}
                              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-gray-800"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button - Fixed at bottom right */}
              <div className="fixed bottom-8 right-8 flex gap-4 z-10">
                <button
                  type="button"
                  onClick={() => router.push('/profile')}
                  className="px-6 py-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-white text-black hover:bg-gray-200 transition-colors"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>

          {/* Right Column (2/5 width) */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Work & Education</h2>
              <button
                type="button"
                onClick={() => addArrayItem('projects', {
                  id: Date.now().toString(),
                  title: '',
                  description: [''],
                  color: 'green',
                  date: ''
                })}
                className="flex items-center space-x-1 bg-black border border-gray-700 px-3 py-1 rounded hover:bg-gray-900 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Project</span>
              </button>
            </div>
            <div className="bg-black rounded-lg p-4 text-sm text-gray-300 border border-gray-700">
              <div className="space-y-5">
                {formData.projects.map((project, index) => (
                  <div key={project.id} className="border border-gray-700 p-4 rounded-lg group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3 flex-1">
                        <ColorPicker 
                          selectedColor={project.color}
                          onChange={(color) => handleArrayChange('projects', index, 'color', color)}
                        />
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)}
                          className="flex-1 bg-transparent text-base font-semibold border-b border-transparent hover:border-gray-600 focus:border-gray-400 focus:outline-none"
                          placeholder="Project Title"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('projects', index)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-gray-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <input
                          type="text"
                          value={project.date || ''}
                          onChange={(e) => handleArrayChange('projects', index, 'date', e.target.value)}
                          className="bg-transparent text-gray-400 text-sm border-b border-transparent hover:border-gray-600 focus:border-gray-400 focus:outline-none"
                          placeholder="Time period (e.g., 2022-2023)"
                        />
                      </div>
                    </div>
                    <div className="space-y-3 mt-4">
                      {project.description.map((desc, descIndex) => (
                        <div key={descIndex} className="flex items-center space-x-2 group/desc">
                          <div className={`w-2 h-2 rounded-full ${colorOptions.find(c => c.name === project.color)?.class || 'bg-gray-500'}`}></div>
                          <input
                            type="text"
                            value={desc}
                            onChange={(e) => {
                              const newDesc = [...project.description]
                              newDesc[descIndex] = e.target.value
                              handleArrayChange('projects', index, 'description', newDesc)
                            }}
                            className="flex-1 bg-transparent text-gray-400 text-sm border-b border-transparent hover:border-gray-600 focus:border-gray-400 focus:outline-none"
                            placeholder="Project description"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (project.description.length > 1) {
                                const newDesc = project.description.filter((_, i) => i !== descIndex)
                                handleArrayChange('projects', index, 'description', newDesc)
                              }
                            }}
                            className="opacity-0 group-hover/desc:opacity-100 text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-gray-800"
                            disabled={project.description.length <= 1}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newDesc = [...project.description, '']
                          handleArrayChange('projects', index, 'description', newDesc)
                        }}
                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-400 mt-2 px-2 py-1 rounded hover:bg-gray-900 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Description</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileEditPage
