'use client'
import React, { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import Sidebar from '../../components/Sidebar'
import { ChatBubbleIcon, PlusIcon, TrashIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser, SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useStorageUrl } from '@/convex/useStorageUrl'
import { Id } from '@/convex/_generated/dataModel'

// StorageImage component
const StorageImage = ({ 
  storageId, 
  alt = "", 
  width, 
  height, 
  className = "",
  onRemove,
}: { 
  storageId: string, 
  alt?: string, 
  width: number, 
  height: number, 
  className?: string,
  onRemove?: () => void,
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
    <div className="relative">
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
      {onRemove && (
        <button 
          onClick={onRemove}
          className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-colors"
        >
          <TrashIcon className="w-4 h-4 text-white" />
        </button>
      )}
    </div>
  );
};

// File upload component
const FileUploader = ({ 
  onFileSelect, 
  accept = "image/*", 
  className = "" 
}: { 
  onFileSelect: (file: File) => void, 
  accept?: string, 
  className?: string 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div 
      className={`border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col items-center justify-center ${className}`}
      onClick={() => fileInputRef.current?.click()}
    >
      <PlusIcon className="w-8 h-8 text-gray-400 mb-2" />
      <p className="text-sm text-gray-500">Upload file</p>
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
          }
        }} 
        accept={accept}
      />
    </div>
  );
};

const Page = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  // Get user profile data
  const userProfile = useQuery(api.users.getUserProfile, { 
    userId: user?.id || '' 
  });
  
  // Mutations
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const updateUserProfile = useMutation(api.users.updateUserProfile);
  
  // Profile image handling
  const profileImageUrl = useStorageUrl(userProfile?.profilePictureId || null);
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<{
    firstName: string;
    username: string;
    age: string;
    occupation: string;
    about: string;
    experience: string;
    interests: string[];
    links: { url: string; title?: string }[];
    newInterest: string;
    newLinkUrl: string;
    newLinkTitle: string;
    profilePictureId: string | null;
    galleryImageIds: string[];
    bookImageIds: string[];
    project: {
      logoUrl: string;
      headline: string;
      subheadline: string;
      link: string;
    };
  }>({
    firstName: '',
    username: '',
    age: '',
    occupation: '',
    about: '',
    experience: '',
    interests: [],
    links: [],
    newInterest: '',
    newLinkUrl: '',
    newLinkTitle: '',
    profilePictureId: null,
    galleryImageIds: [],
    bookImageIds: [],
    project: {
      logoUrl: '',
      headline: '',
      subheadline: '',
      link: '',
    },
  });
  
  // Initialize form data from user profile
  React.useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        username: userProfile.username || '',
        age: userProfile.age || '',
        occupation: userProfile.occupation || '',
        about: userProfile.about || '',
        experience: userProfile.experience || '',
        interests: userProfile.interests || [],
        links: userProfile.links || [],
        newInterest: '',
        newLinkUrl: '',
        newLinkTitle: '',
        profilePictureId: userProfile.profilePictureId || null,
        galleryImageIds: userProfile.galleryImageIds || [],
        bookImageIds: userProfile.bookImageIds || [],
        project: (typeof userProfile.project === 'object' && userProfile.project) ? userProfile.project : {
          logoUrl: '',
          headline: '',
          subheadline: '',
          link: '',
        },
      });
    }
  }, [userProfile]);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Add new interest
  const addInterest = () => {
    if (formData.newInterest.trim()) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, prev.newInterest.trim()],
        newInterest: ''
      }));
    }
  };
  
  // Remove interest
  const removeInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };
  
  // Add new link
  const addLink = () => {
    if (formData.newLinkUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, { 
          url: prev.newLinkUrl.trim(),
          title: prev.newLinkTitle.trim() || prev.newLinkUrl.trim()
        }],
        newLinkUrl: '',
        newLinkTitle: ''
      }));
    }
  };
  
  // Remove link
  const removeLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };
  
  // Upload file and get storage ID
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      const { storageId } = await result.json();
      return storageId;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };
  
  // Handle profile picture upload
  const handleProfilePictureUpload = async (file: File) => {
    setIsUploading(true);
    const storageId = await uploadFile(file);
    if (storageId) {
      setFormData(prev => ({ ...prev, profilePictureId: storageId }));
    }
    setIsUploading(false);
  };
  
  // Handle gallery image upload
  const handleGalleryImageUpload = async (file: File) => {
    if (formData.galleryImageIds.length >= 9) {
      alert("You can only upload up to 9 gallery images.");
      return;
    }
    
    setIsUploading(true);
    const storageId = await uploadFile(file);
    if (storageId) {
      setFormData(prev => ({ 
        ...prev, 
        galleryImageIds: [...prev.galleryImageIds, storageId]
      }));
    }
    setIsUploading(false);
  };
  
  // Handle book image upload
  const handleBookImageUpload = async (file: File) => {
    if (formData.bookImageIds.length >= 5) {
      alert("You can only upload up to 5 book images.");
      return;
    }
    
    setIsUploading(true);
    const storageId = await uploadFile(file);
    if (storageId) {
      setFormData(prev => ({ 
        ...prev, 
        bookImageIds: [...prev.bookImageIds, storageId]
      }));
    }
    setIsUploading(false);
  };
  
  // Remove gallery image
  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryImageIds: prev.galleryImageIds.filter((_, i) => i !== index)
    }));
  };
  
  // Remove book image
  const removeBookImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      bookImageIds: prev.bookImageIds.filter((_, i) => i !== index)
    }));
  };
  
  // Add project logo upload handler
  const handleProjectLogoUpload = async (file: File) => {
    setIsUploading(true);
    const storageId = await uploadFile(file);
    if (storageId) {
      setFormData(prev => ({
        ...prev,
        project: {
          ...prev.project,
          logoUrl: storageId
        }
      }));
    }
    setIsUploading(false);
  };
  
  // Save profile
  const saveProfile = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      await updateUserProfile({
        firstName: formData.firstName,
        username: formData.username,
        age: formData.age,
        occupation: formData.occupation,
        about: formData.about,
        experience: formData.experience,
        interests: formData.interests,
        links: formData.links.map(link => ({
          ...link,
          type: "website" // Add a default type for each link
        })),
        profilePictureId: formData.profilePictureId || undefined,
        galleryImageIds: formData.galleryImageIds,
        bookImageIds: formData.bookImageIds,
        project: formData.project,
      });
      router.push('/profilev2');
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("There was an error saving your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Loading state
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

  // Sign in prompt
  if (!user) {
    return (
      <div className="flex bg-white min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6 flex flex-col items-center justify-center gap-4">
          <p className="text-lg text-gray-600">Please sign in to edit your profile</p>
          <SignInButton mode="modal">
            <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 p-6 w-full text-black">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => router.push('/profilev2')}
              className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={saveProfile}
              disabled={isSaving}
              className={`bg-black text-white px-6 py-2 rounded-full transition-colors flex items-center gap-2 
                ${isSaving ? 'bg-gray-500 cursor-not-allowed' : 'hover:bg-gray-800'}`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
              {!isSaving && <CheckIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Basic info and about */}
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Profile Picture</h2>
              <div className="flex items-center gap-4">
                {formData.profilePictureId ? (
                  <div className="relative w-[100px] h-[100px]">
                    <StorageImage 
                      storageId={formData.profilePictureId}
                      alt="Profile" 
                      width={100} 
                      height={100} 
                      className="rounded-full object-cover w-full h-full"
                      onRemove={() => setFormData(prev => ({ ...prev, profilePictureId: null }))}
                    />
                  </div>
                ) : (
                  <div className="w-[100px] h-[100px] bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xl text-gray-500">
                      {(formData.firstName || '?')[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                <FileUploader 
                  onFileSelect={handleProfilePictureUpload}
                  className="w-[150px] h-[100px]"
                />
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Username"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Age</label>
                    <input
                      type="text"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Your age"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Occupation</label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Your occupation"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">About Me</h2>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black min-h-[120px]"
                placeholder="Tell us about yourself"
              />
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Experience</h2>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black min-h-[120px]"
                placeholder="Share your experience"
              />
            </div>
          </div>
          
          {/* Right column - Interests, Links, Gallery, Books */}
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Interests</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.interests.map((interest, index) => {
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
                    <div key={index} className={`group px-4 py-2 ${colorClass} rounded-full text-sm flex items-center`}>
                      {interest}
                      <button 
                        onClick={() => removeInterest(index)}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Cross2Icon className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="newInterest"
                  value={formData.newInterest}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Add a new interest"
                  onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                />
                <button
                  onClick={addInterest}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Links</h2>
              <div className="space-y-2 mb-3">
                {formData.links.map((link, index) => (
                  <div key={index} className="flex items-center">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex-1 truncate"
                    >
                      {link.title || link.url}
                    </a>
                    <button 
                      onClick={() => removeLink(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  name="newLinkTitle"
                  value={formData.newLinkTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Link title (optional)"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="newLinkUrl"
                    value={formData.newLinkUrl}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="https://example.com"
                    onKeyPress={(e) => e.key === 'Enter' && addLink()}
                  />
                  <button
                    onClick={addLink}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Gallery Images (up to 9)</h2>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {formData.galleryImageIds.map((imageId, index) => (
                  <StorageImage 
                    key={index}
                    storageId={imageId}
                    alt="Gallery Image" 
                    width={200} 
                    height={200} 
                    className="w-full aspect-square object-cover rounded-lg"
                    onRemove={() => removeGalleryImage(index)}
                  />
                ))}
                {formData.galleryImageIds.length < 9 && (
                  <FileUploader 
                    onFileSelect={handleGalleryImageUpload} 
                    className="w-full aspect-square"
                  />
                )}
              </div>
              <p className="text-sm text-gray-500">
                {formData.galleryImageIds.length}/9 images
              </p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Favorite Books (up to 5)</h2>
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {formData.bookImageIds.map((bookId, index) => (
                  <StorageImage 
                    key={index}
                    storageId={bookId}
                    alt="Book" 
                    width={70} 
                    height={100} 
                    className="object-cover rounded min-w-[70px] h-[100px]"
                    onRemove={() => removeBookImage(index)}
                  />
                ))}
                {formData.bookImageIds.length < 5 && (
                  <FileUploader 
                    onFileSelect={handleBookImageUpload} 
                    className="min-w-[70px] h-[100px]"
                  />
                )}
              </div>
              <p className="text-sm text-gray-500">
                {formData.bookImageIds.length}/5 books
              </p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Project</h2>
              <div className="space-y-4 p-5 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Project Logo</label>
                  <div className="flex items-center gap-4">
                    {formData.project.logoUrl ? (
                      <div className="relative w-[100px] h-[100px]">
                        <StorageImage 
                          storageId={formData.project.logoUrl}
                          alt="Project Logo" 
                          width={100} 
                          height={100} 
                          className="rounded-lg object-contain w-full h-full bg-gray-50"
                          onRemove={() => setFormData(prev => ({
                            ...prev,
                            project: {
                              ...prev.project,
                              logoUrl: ''
                            }
                          }))}
                        />
                      </div>
                    ) : (
                      <div className="w-[100px] h-[100px] bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">No logo</span>
                      </div>
                    )}
                    <FileUploader 
                      onFileSelect={handleProjectLogoUpload}
                      className="w-[150px] h-[100px]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Headline</label>
                  <input
                    type="text"
                    name="projectHeadline"
                    value={formData.project.headline}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      project: {
                        ...prev.project,
                        headline: e.target.value
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Building a better internet"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Subheadline</label>
                  <input
                    type="text"
                    name="projectSubheadline"
                    value={formData.project.subheadline}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      project: {
                        ...prev.project,
                        subheadline: e.target.value
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Creating digital products that empower humans"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Project Link</label>
                  <input
                    type="text"
                    name="projectLink"
                    value={formData.project.link}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      project: {
                        ...prev.project,
                        link: e.target.value
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="https://yourproject.com"
                  />
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Preview</h3>
                  <div className="flex items-center bg-white text-black rounded-lg p-4 border border-gray-200">
                    <div className="mr-3 w-16 h-16 flex-shrink-0">
                      {formData.project.logoUrl ? (
                        <StorageImage
                          storageId={formData.project.logoUrl}
                          alt="Project Logo"
                          width={64}
                          height={64}
                          className="rounded-md object-contain"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No logo</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-black text-xl">
                        {formData.project.headline || "Your Project"}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {formData.project.subheadline || "Your project description will appear here"}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;