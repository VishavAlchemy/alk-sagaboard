'use client'
import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Sidebar from '../components/Sidebar'
import { ChatBubbleIcon, Pencil1Icon, PlusIcon, CheckIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageUploader from '../components/ImageUploader'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'

// Create an optimized hook for retrieving storage URLs with caching
function useOptimizedStorageUrl(storageId: string | null) {
  // Use memoization to prevent unnecessary re-fetches
  const queryArgs = useMemo(() => ({ storageId: storageId ?? "" }), [storageId]);
  
  // Only fetch when there's a real storageId
  const url = useQuery(
    api.getStorageUrl.default, 
    storageId ? queryArgs : 'skip'
  );
  
  // Cache the URL in state to prevent flickering
  const [cachedUrl, setCachedUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (url) {
      setCachedUrl(url);
    }
  }, [url]);
  
  return storageId ? (cachedUrl || url) : null;
}

// Component interfaces
interface Project {
  logo: File | null;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  url: string;
}

interface Link {
  type: string;
  url: string;
  title?: string;
}

// StorageImage component
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
  const imageUrl = useOptimizedStorageUrl(storageId);
  
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

const OnboardingPage = () => {
  const router = useRouter()
  const { userId } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  
  // Fetch existing user data from Convex
  const userData = useQuery(api.users.getUserProfile, 
    userId ? { userId } : 'skip'
  )
  
  // Fetch profile data from profilev2
  const profileV2Data = useQuery(api.users.getUserProfile,
    userId ? { userId } : 'skip'
  )
  
  // Create a component for profile picture
  const ProfilePictureUploader = () => {
    const profilePictureId = profileV2Data?.profilePictureId || null;
    const imageUrl = useOptimizedStorageUrl(profilePictureId);
    const [isLoading, setIsLoading] = useState(!!profilePictureId);
    
    useEffect(() => {
      if (imageUrl) {
        setIsLoading(false);
      }
    }, [imageUrl]);
    
    // Prevent accidental form submissions
    const handleImageChange = (file: File) => {
      handleProfilePictureChange(file);
    };
    
    // If there's a local preview image, show that first
    if (formData.profilePicturePreview) {
      return (
        <ImageUploader
          initialImage={formData.profilePicturePreview}
          onImageChange={handleImageChange}
          width={100}
          height={100}
          isRounded={true}
        />
      );
    }
    
    // If there's no profile picture ID at all, show the uploader immediately
    if (!profilePictureId) {
      return (
        <ImageUploader
          initialImage={undefined}
          onImageChange={handleImageChange}
          width={100}
          height={100}
          isRounded={true}
        />
      );
    }
    
    // Only show loading if we have an ID but image is still loading
    if (isLoading && profilePictureId) {
      return (
        <div 
          className="w-[100px] h-[100px] bg-gray-200 flex items-center justify-center rounded-full"
        >
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      );
    }
    
    return (
      <ImageUploader
        initialImage={imageUrl || undefined}
        onImageChange={handleImageChange}
        width={100}
        height={100}
        isRounded={true}
      />
    );
  };
  
  // Create a component to handle individual gallery images
  const GalleryImageUploader = ({ index }: { index: number }) => {
    const galleryImageId = profileV2Data?.galleryImageIds?.[index] || null;
    const imageUrl = useOptimizedStorageUrl(galleryImageId);
    const [isLoading, setIsLoading] = useState(!!galleryImageId);
    
    useEffect(() => {
      if (imageUrl) {
        setIsLoading(false);
      }
    }, [imageUrl]);
    
    // Prevent accidental form submissions
    const handleImageChange = (file: File) => {
      handleGalleryImageChange(file, index);
    };
    
    // If there's a local preview image, show that first
    if (formData.galleryPreviews?.[index]) {
      return (
        <ImageUploader
          key={`gallery-preview-${index}`}
          initialImage={formData.galleryPreviews[index]!}
          onImageChange={handleImageChange}
          width={80}
          height={80}
          className="w-full h-24 object-cover"
        />
      );
    }
    
    // If there's no image ID at all, show the uploader immediately
    if (!galleryImageId) {
      return (
        <ImageUploader
          key={`gallery-new-${index}`}
          initialImage={undefined}
          onImageChange={handleImageChange}
          width={80}
          height={80}
          className="w-full h-24 object-cover"
        />
      );
    }
    
    // Only show loading if we have an ID but image is still loading
    if (isLoading && galleryImageId) {
      return (
        <div 
          className="w-full h-24 bg-gray-200 flex items-center justify-center rounded"
        >
          <div className="text-gray-400 text-xs">Loading...</div>
        </div>
      );
    }
    
    return (
      <ImageUploader
        key={`gallery-existing-${index}`}
        initialImage={imageUrl || undefined}
        onImageChange={handleImageChange}
        width={80}
        height={80}
        className="w-full h-24 object-cover"
      />
    );
  };
  
  // Create a component to handle individual book images
  const BookImageUploader = ({ index }: { index: number }) => {
    const bookImageId = profileV2Data?.bookImageIds?.[index] || null;
    const imageUrl = useOptimizedStorageUrl(bookImageId);
    const [isLoading, setIsLoading] = useState(!!bookImageId);
    
    useEffect(() => {
      if (imageUrl) {
        setIsLoading(false);
      }
    }, [imageUrl]);
    
    // Prevent accidental form submissions
    const handleImageChange = (file: File) => {
      handleBookImageChange(file, index);
    };
    
    // If there's a local preview image, show that first
    if (formData.bookPreviews?.[index]) {
      return (
        <ImageUploader
          key={`book-preview-${index}`}
          initialImage={formData.bookPreviews[index]!}
          onImageChange={handleImageChange}
          width={70}
          height={70}
          className="flex-shrink-0"
        />
      );
    }
    
    // If there's no image ID at all, show the uploader immediately
    if (!bookImageId) {
      return (
        <ImageUploader
          key={`book-new-${index}`}
          initialImage={undefined}
          onImageChange={handleImageChange}
          width={70}
          height={70}
          className="flex-shrink-0"
        />
      );
    }
    
    // Only show loading if we have an ID but image is still loading
    if (isLoading && bookImageId) {
      return (
        <div 
          className="flex-shrink-0 w-[70px] h-[70px] bg-gray-200 flex items-center justify-center rounded"
        >
          <div className="text-gray-400 text-xs">Loading...</div>
        </div>
      );
    }
    
    return (
      <ImageUploader
        key={`book-existing-${index}`}
        initialImage={imageUrl || undefined}
        onImageChange={handleImageChange}
        width={70}
        height={70}
        className="flex-shrink-0"
      />
    );
  };
  
  // Mutations to save user data
  const createUser = useMutation(api.users.createUser)
  const updateUser = useMutation(api.users.updateUser)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const uploadFile = useMutation(api.files.uploadFile)
  
  // Initial form state
  const initialFormData = {
    name: 'Name',
    username: '@username',
    age: '',
    archetypes: '',
    country: 'canada',
    about: '',
    experience: '',
    interests: ['Technology'] as string[],
    links: [] as Link[],
    profilePicture: null as File | null,
    profilePictureUrl: '', // Store URL for displaying existing image
    profilePicturePreview: null as string | null, // Store preview URL
    galleryImages: Array(9).fill(null) as (File | null)[],
    galleryImageUrls: Array(9).fill('') as string[], // Store URLs for displaying existing images
    galleryPreviews: Array(9).fill(null) as (string | null)[], // Store preview URLs
    bookImages: Array(5).fill(null) as (File | null)[],
    bookImageUrls: Array(5).fill('') as string[], // Store URLs for displaying existing images
    bookPreviews: Array(5).fill(null) as (string | null)[], // Store preview URLs
    projects: [] as Project[]
  }
  
  const [formData, setFormData] = useState(initialFormData)
  const [hasFetchedData, setHasFetchedData] = useState(false)
  
  const [isEditing, setIsEditing] = useState({
    profile: false,
    about: false,
    experience: false,
    interests: false,
    links: false
  })
  
  const [searchInterest, setSearchInterest] = useState('')
  const [showInterestDropdown, setShowInterestDropdown] = useState(false)
  
  const interestColors = [
    'bg-orange-100 text-orange-800',
    'bg-green-100 text-green-800',
    'bg-blue-100 text-blue-800',
    'bg-red-100 text-red-800',
    'bg-yellow-100 text-yellow-800',
    'bg-white border border-gray-300 text-gray-800',
    'bg-black border border-gray-300 text-white',
    'bg-purple-100 border border-gray-300 text-purple-800',
  ]
  
  // When data loads from profilev2, populate the form
  useEffect(() => {
    if (profileV2Data && !dataLoaded) {
      setFormData(prevData => ({
        ...prevData,
        name: profileV2Data.firstName || profileV2Data.name || prevData.name,
        username: profileV2Data.username || prevData.username,
        age: profileV2Data.age || prevData.age,
        archetypes: profileV2Data.occupation || prevData.archetypes,
        country: profileV2Data.country || prevData.country,
        about: profileV2Data.about || prevData.about,
        experience: profileV2Data.experience || prevData.experience,
        interests: profileV2Data.interests || prevData.interests,
        links: profileV2Data.links || prevData.links,
        profilePictureUrl: profileV2Data.profilePictureId || '',
        galleryImageUrls: profileV2Data.galleryImageIds || Array(9).fill(''),
        bookImageUrls: profileV2Data.bookImageIds || Array(5).fill(''),
        
      }))
      setDataLoaded(true)
      setHasFetchedData(true)
    } else if (userData && !dataLoaded) {
      // Fallback to regular user data if profileV2Data is not available
      setFormData(prevData => ({
        ...prevData,
        name: userData.firstName || userData.name || prevData.name,
        username: userData.username || prevData.username,
        age: userData.age || prevData.age,
        archetypes: userData.occupation || prevData.archetypes,
        country: userData.country || prevData.country,
        about: userData.about || prevData.about,
        experience: userData.experience || prevData.experience,
        interests: userData.interests || prevData.interests,
        links: userData.links || prevData.links,
        // Keep existing image URLs if they exist
        profilePictureUrl: userData.profilePictureId || '',
        galleryImageUrls: userData.galleryImageIds || Array(9).fill(''),
        bookImageUrls: userData.bookImageIds || Array(5).fill(''),
      
      }))
      setDataLoaded(true)
      setHasFetchedData(true)
    }
  }, [profileV2Data, userData, dataLoaded])
  
  // Load form data from localStorage on first render
  useEffect(() => {
    if (userId && !hasFetchedData) {
      const savedData = localStorage.getItem(`onboarding-data-${userId}`)
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          // Only update form data if we don't have backend data yet
          if (!userData) {
            setFormData(prevData => ({
              ...prevData,
              ...parsedData,
              // Don't restore file objects - they can't be serialized properly
              profilePicture: null,
              galleryImages: Array(9).fill(null),
              bookImages: Array(5).fill(null),
              projects: parsedData.projects 
                ? parsedData.projects.map((p: any) => ({ ...p, logo: null }))
                : prevData.projects
            }))
          }
        } catch (error) {
          console.error('Error parsing saved form data:', error)
        }
      }
    }
  }, [userId, hasFetchedData, userData])
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (userId) {
      // Create a safe-to-serialize version of form data
      const serializableData = { 
        ...formData,
        // Set these to null/empty instead of deleting
        profilePicture: null,
        galleryImages: [],
        bookImages: [],
        // Create a version of projects without file objects
        projects: formData.projects.map(project => {
          const { logo, ...rest } = project
          return {
            ...rest,
            logo: null // Keep the property but set to null
          }
        })
      }
      
      localStorage.setItem(`onboarding-data-${userId}`, JSON.stringify(serializableData))
    }
  }, [formData, userId])
  
  // Auto-save form data to Convex periodically
  useEffect(() => {
    if (!userId || !formData.name || saveStatus === 'saving') return
    
    // Commenting out autosave functionality
    /*
    const timer = setTimeout(() => {
      if (formData.name && formData.name !== 'Your Name') {
        setSaveStatus('saving')
        handleSubmit(false).then(() => {
          setSaveStatus('saved')
          
          // Reset saved status after a few seconds
          setTimeout(() => {
            setSaveStatus(null)
          }, 3000)
        })
        .catch(() => {
          setSaveStatus('unsaved')
        })
      }
    }, 3000)
    
    return () => clearTimeout(timer)
    */
  }, [formData, userId])
  
  // Reset save status when form changes
  useEffect(() => {
    if (saveStatus === 'saved') {
      setSaveStatus(null)
    }
  }, [formData])
  
  // Preserve image previews in local storage to prevent loss on refresh
  useEffect(() => {
    if (userId) {
      // Check if we have any pending uploads in local storage
      const savedUploads = localStorage.getItem(`onboarding-uploads-${userId}`)
      if (savedUploads && !formData.profilePicturePreview && !formData.galleryPreviews?.some(preview => preview !== null) && !formData.bookPreviews?.some(preview => preview !== null)) {
        try {
          const parsedUploads = JSON.parse(savedUploads)
          setFormData(prev => ({
            ...prev,
            profilePicturePreview: parsedUploads.profilePicturePreview,
            galleryPreviews: parsedUploads.galleryPreviews || Array(9).fill(null),
            bookPreviews: parsedUploads.bookPreviews || Array(5).fill(null),
          }))
        } catch (error) {
          console.error('Error parsing saved uploads:', error)
        }
      }
    }
  }, [userId])
  
  // Save image previews to local storage whenever they change
  useEffect(() => {
    if (userId) {
      const uploadsToSave = {
        profilePicturePreview: formData.profilePicturePreview,
        galleryPreviews: formData.galleryPreviews,
        bookPreviews: formData.bookPreviews
      }
      
      localStorage.setItem(`onboarding-uploads-${userId}`, JSON.stringify(uploadsToSave))
    }
  }, [formData.profilePicturePreview, formData.galleryPreviews, formData.bookPreviews, userId])
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any object URLs to prevent memory leaks
      if (formData.profilePicturePreview) {
        URL.revokeObjectURL(formData.profilePicturePreview);
      }
      
      formData.galleryPreviews?.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
      
      formData.bookPreviews?.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []);
  
  // Handle any button or key events that might trigger form submission
  const handleFormClick = (e: React.MouseEvent<HTMLFormElement>) => {
    // Prevent any click in the form from submitting it
    if ((e.target as HTMLElement).tagName === 'BUTTON' && 
        !(e.target as HTMLButtonElement).type) {
      e.preventDefault();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent Enter key from submitting the form
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: string) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    })
  }
  
  const toggleEdit = (section: keyof typeof isEditing) => {
    setIsEditing({
      ...isEditing,
      [section]: !isEditing[section]
    })
  }
  
  const addInterest = (interest: string) => {
    if (!formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      })
      setSearchInterest('')
      setShowInterestDropdown(false)
    }
  }
  
  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(item => item !== interest)
    })
  }
  
  const handleSubmit = async (saveAndRedirect = true) => {
    try {
      if (!userId) {
        toast.error("You must be logged in to save your profile")
        return
      }
      
      setIsLoading(true)
      
      // Upload profile picture, gallery images, and book images if they exist
      let profilePictureId = profileV2Data?.profilePictureId || null
      const galleryImageIds = [...(profileV2Data?.galleryImageIds || [])]
      const bookImageIds = [...(profileV2Data?.bookImageIds || [])]
      
      // Helper function to upload a single file to Convex
      const uploadImageToConvex = async (file: File | null) => {
        if (!file) return null
        
        // Generate a URL for uploading the file
        const uploadUrl = await generateUploadUrl()
        
        // Upload the file to the URL
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        })
        
        if (!result.ok) {
          throw new Error(`Failed to upload image: ${result.statusText}`)
        }
        
        // Get the storage ID from the response
        const { storageId } = await result.json()
        
        // Register the file in Convex
        return await uploadFile({ storageId, fileName: file.name })
      }
      
      // Upload profile picture if a new one was selected
      if (formData.profilePicture) {
        const newProfilePictureId = await uploadImageToConvex(formData.profilePicture)
        if (newProfilePictureId) profilePictureId = newProfilePictureId
      }
      
      // Upload gallery images if new ones were selected
      for (let i = 0; i < formData.galleryImages.length; i++) {
        const image = formData.galleryImages[i]
        if (image) {
          const imageId = await uploadImageToConvex(image)
          if (imageId) {
            // Replace existing image at this index or add to the end
            if (i < galleryImageIds.length) {
              galleryImageIds[i] = imageId
            } else {
              galleryImageIds.push(imageId)
            }
          }
        }
      }
      
      // Upload book images if new ones were selected
      for (let i = 0; i < formData.bookImages.length; i++) {
        const image = formData.bookImages[i]
        if (image) {
          const imageId = await uploadImageToConvex(image)
          if (imageId) {
            // Replace existing image at this index or add to the end
            if (i < bookImageIds.length) {
              bookImageIds[i] = imageId
            } else {
              bookImageIds.push(imageId)
            }
          }
        }
      }
      
      // Create a new object without File properties and map fields to match backend expectations
      const profileData = {
        userId,
        firstName: formData.name,
        name: formData.name,
        username: formData.username,
        age: formData.age,
        occupation: formData.archetypes,
        tagline: '',
        currentActivities: '',
        projectsExperience: '',
        country: formData.country,
        about: formData.about,
        experience: formData.experience,
        interests: formData.interests,
        links: formData.links.length > 0 ? formData.links : [{ type: 'website', url: 'https://example.com', title: 'My Website' }],
        projects: formData.projects.map(project => {
          const { logo, ...rest } = project
          return rest
        }),
        profilePictureId: profilePictureId || undefined,
        galleryImageIds,
        bookImageIds
      }
      
      if (userData) {
        // For update, we need to remove userId and add id
        const { userId: _userId, ...updateData } = profileData;
        
        // Update existing user
        await updateUser({ 
          id: userData._id,
          ...updateData
        })
        toast.success(saveAndRedirect ? "Profile updated successfully" : "Progress saved successfully")
      } else {
        // Create new user
        await createUser(profileData)
        toast.success(saveAndRedirect ? "Profile created successfully" : "Progress saved successfully")
      }
      
      // Only redirect if saveAndRedirect is true
      if (saveAndRedirect) {
        router.push('/profile')
      }
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast.error(error.message || "Failed to save profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle profile picture upload with preview
  const handleProfilePictureChange = (file: File) => {
    // Create a preview URL immediately
    const previewUrl = URL.createObjectURL(file);
    
    // Revoke previous URL if it exists to prevent memory leaks
    if (formData.profilePicturePreview) {
      URL.revokeObjectURL(formData.profilePicturePreview);
    }
    
    setFormData(prev => ({
      ...prev,
      profilePicture: file,
      profilePicturePreview: previewUrl
    }));
  }

  // Handle gallery image upload with preview
  const handleGalleryImageChange = (file: File, index: number) => {
    // Create a preview URL immediately
    const previewUrl = URL.createObjectURL(file);
    
    // Revoke previous URL if it exists to prevent memory leaks
    if (formData.galleryPreviews?.[index]) {
      URL.revokeObjectURL(formData.galleryPreviews[index]!);
    }
    
    const updatedGalleryImages = [...formData.galleryImages];
    const updatedGalleryPreviews = [...(formData.galleryPreviews || Array(9).fill(null))];
    
    updatedGalleryImages[index] = file;
    updatedGalleryPreviews[index] = previewUrl;
    
    setFormData(prev => ({
      ...prev,
      galleryImages: updatedGalleryImages,
      galleryPreviews: updatedGalleryPreviews
    }));
  }

  // Handle book image upload with preview
  const handleBookImageChange = (file: File, index: number) => {
    // Create a preview URL immediately
    const previewUrl = URL.createObjectURL(file);
    
    // Revoke previous URL if it exists to prevent memory leaks
    if (formData.bookPreviews?.[index]) {
      URL.revokeObjectURL(formData.bookPreviews[index]!);
    }
    
    const updatedBookImages = [...formData.bookImages];
    const updatedBookPreviews = [...(formData.bookPreviews || Array(5).fill(null))];
    
    updatedBookImages[index] = file;
    updatedBookPreviews[index] = previewUrl;
    
    setFormData(prev => ({
      ...prev,
      bookImages: updatedBookImages,
      bookPreviews: updatedBookPreviews
    }));
  }

  const handleProjectLogoChange = (file: File, index: number) => {
    const updatedProjects = [...formData.projects]
    updatedProjects[index] = {
      ...updatedProjects[index],
      logo: file
    }
    setFormData({
      ...formData,
      projects: updatedProjects
    })
  }

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: string) => {
    const updatedProjects = [...formData.projects]
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: e.target.value
    }
    setFormData({
      ...formData,
      projects: updatedProjects
    })
  }

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        {
          logo: null,
          name: '',
          shortDescription: '',
          detailedDescription: '',
          url: ''
        }
      ]
    })
  }
  
  const predefinedInterests = [
    'Technology', 'Programming', 'Web Development', 'AI', 'Machine Learning',
    'Data Science', 'Blockchain', 'Cryptocurrency', 'UX/UI Design', 'Graphic Design',
    'Photography', 'Videography', 'Music', 'Art', 'Writing',
    'Meditation', 'Spirituality', 'Religion', 'Philosophy', 'History',
    'Reading', 'Fitness', 'Yoga', 'Meditation', 'Travel', 'Health',
    'Food', 'Cooking', 'Baking', 'Coffee', 'Internet Companies', 'Purpose',
    'Startups', 'Venture Capital', 'Artificial Intelligence', 'Blockchain', 'Cryptocurrency',
    'Fashion', 'Gaming', 'Board Games', 'Sports', 'Soccer',
    'Basketball', 'Tennis', 'Golf', 'Swimming', 'Hiking',
    'Nature','Space', 'Design', 'Interior Design', 'Architecture','Technology',
    'Camping', 'Fishing', 'Hunting', 'Gardening', 'Home Improvement',
    'DIY', 'Crafts', 'Volunteering', 'Mental Health', 'Personal Development',
    'Entrepreneurship', 'Marketing', 'Finance', 'Investing', 'Sustainability'
  ]
  
  const filteredInterests = predefinedInterests.filter(
    interest => interest.toLowerCase().includes(searchInterest.toLowerCase()) && 
    !formData.interests.includes(interest)
  )
  
  return (
    <div className="flex bg-white min-h-screen">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content */}
      <form 
        className="flex flex-col flex-1 p-6 w-full text-black"
        onSubmit={(e) => e.preventDefault()}
        onClick={handleFormClick}
        onKeyDown={handleKeyDown}
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <p className="text-gray-600">Fill in your information to personalize your profile</p>
          {!dataLoaded && userId && <p className="text-blue-600 mt-2">Loading your profile data...</p>}
          {saveStatus === 'saving' && <p className="text-yellow-600 mt-2">Auto-saving...</p>}
          {saveStatus === 'saved' && <p className="text-green-600 mt-2">Your progress has been auto-saved</p>}
          {saveStatus === 'unsaved' && <p className="text-red-600 mt-2">Failed to auto-save. Please save manually.</p>}
        </div>
        
        <div className="flex flex-col md:flex-row flex-1 w-full">
          {/* Left Section - Profile Info */}
          <div className="w-full md:w-3/5 pr-6">
            {/* Profile Header */}
            <div className="flex items-start mb-5 relative">
              <div className="mr-4">
                <ProfilePictureUploader />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="relative">
                    {isEditing.profile ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleChange(e, 'name')}
                          className="text-3xl font-bold border-b border-gray-300 focus:outline-none focus:border-black w-full"
                        />
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => handleChange(e, 'username')}
                            className="text-gray-500 text-sm border-b border-gray-300 focus:outline-none focus:border-black"
                          />
                          <select 
                            value={formData.country}
                            onChange={(e) => handleChange(e, 'country')}
                            className="text-sm border rounded p-1"
                          >
                            <option value="canada">Canada</option>
                            <option value="usa">USA</option>
                            <option value="uk">UK</option>
                            {/* Add more countries as needed */}
                          </select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={formData.age}
                            onChange={(e) => handleChange(e, 'age')}
                            placeholder="Age"
                            className="w-16 text-sm border-b border-gray-300 focus:outline-none focus:border-black"
                          />
                          <span>-</span>
                          <input
                            type="text"
                            value={formData.archetypes}
                            onChange={(e) => handleChange(e, 'archetypes')}
                            placeholder="Archetypes"
                            className="flex-1 text-sm border-b border-gray-300 focus:outline-none focus:border-black"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => toggleEdit('profile')}
                          className="mt-2 text-sm bg-black text-white px-3 py-1 rounded-full"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2">
                          <h1 className="text-3xl font-bold">{formData.name}</h1>
                          <button 
                            type="button"
                            onClick={() => toggleEdit('profile')}
                            className="ml-2 text-gray-500 hover:text-black transition-colors"
                            disabled={!dataLoaded}
                          >
                            <Pencil1Icon className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {formData.age ? `${formData.age} - ` : ''}{formData.archetypes || 'Add your archetypes'}
                        </p>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                          <span>{formData.username}</span>
                          <Image src={`/flags/${formData.country}.svg`} alt={formData.country} width={20} height={15} className="mx-2" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      className="bg-black text-white px-4 py-2 rounded-full text-sm">Follow</button>
                    <button 
                      type="button"
                      className="bg-black text-white px-4 py-2 rounded-full text-sm"><ChatBubbleIcon className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* About Me Section */}
            <div className="mb-8 relative">
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold">About Me</h2>
                <button 
                  type="button"
                  onClick={() => toggleEdit('about')}
                  className="ml-2 text-gray-500 hover:text-black transition-colors"
                  disabled={!dataLoaded}
                >
                  <Pencil1Icon className="w-4 h-4" />
                </button>
              </div>
              
              {isEditing.about ? (
                <div className="space-y-3">
                  <textarea
                    value={formData.about}
                    onChange={(e) => handleChange(e, 'about')}
                    placeholder="Share your story, passions, and background..."
                    className="w-full h-32 p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-black"
                  ></textarea>
                  <button 
                    type="button"
                    onClick={() => toggleEdit('about')}
                    className="text-sm bg-black text-white px-3 py-1 rounded-full"
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  {formData.about ? (
                    <p className="text-sm mb-3 whitespace-pre-line">{formData.about}</p>
                  ) : (
                    <p className="text-sm mb-3 text-gray-400 italic">Tell your story, share your passions and background...</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Experience Section */}
            <div className="mb-8 relative">
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold">Experience</h2>
                <button 
                  type="button"
                  onClick={() => toggleEdit('experience')}
                  className="ml-2 text-gray-500 hover:text-black transition-colors"
                  disabled={!dataLoaded}
                >
                  <Pencil1Icon className="w-4 h-4" />
                </button>
              </div>
              
              {isEditing.experience ? (
                <div className="space-y-3">
                  <textarea
                    value={formData.experience}
                    onChange={(e) => handleChange(e, 'experience')}
                    placeholder="Share your professional experience, achievements, etc."
                    className="w-full h-32 p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-black"
                  ></textarea>
                  <button 
                    type="button"
                    onClick={() => toggleEdit('experience')}
                    className="text-sm bg-black text-white px-3 py-1 rounded-full"
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  {formData.experience ? (
                    <p className="text-sm mb-3 whitespace-pre-line">{formData.experience}</p>
                  ) : (
                    <p className="text-sm mb-3 text-gray-400 italic">Share your professional experience, achievements, etc.</p>
                  )}
                </div>
              )}
            </div>

            {/* Interest Tags */}
            <div className="mb-5 relative">
              <div className="flex items-center mb-4">
                <h2 className="text-lg font-bold">Interests</h2>
                <button 
                  type="button"
                  onClick={() => toggleEdit('interests')}
                  className="ml-2 text-gray-500 hover:text-black transition-colors"
                  disabled={!dataLoaded}
                >
                  <Pencil1Icon className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.interests.map((interest, index) => (
                  <span 
                    key={index} 
                    className={`px-4 py-2 rounded-full text-sm flex items-center ${interestColors[index % interestColors.length]}`}
                  >
                    {interest}
                    {isEditing.interests && (
                      <button 
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="ml-1 text-xs font-bold"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
              
              {isEditing.interests && (
                <div className="relative">
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={searchInterest}
                        onChange={(e) => {
                          setSearchInterest(e.target.value)
                          setShowInterestDropdown(true)
                        }}
                        onFocus={() => setShowInterestDropdown(true)}
                        placeholder="Search for interests"
                        className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-black"
                      />
                      {showInterestDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredInterests.length > 0 ? (
                            filteredInterests.map((interest, index) => (
                              <div 
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                                onClick={() => addInterest(interest)}
                              >
                                {interest}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-gray-500 text-sm">No matching interests found</div>
                          )}
                        </div>
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        toggleEdit('interests')
                        setShowInterestDropdown(false)
                      }}
                      className="text-sm bg-black text-white px-3 py-2 rounded-full"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Links Section */}
            <div className="mb-8 relative">
              <div className="flex items-center mb-2">
                <h3 className="text-lg text-gray-500">Links</h3>
                <button 
                  type="button"
                  onClick={() => toggleEdit('links')}
                  className="ml-2 text-gray-500 hover:text-black transition-colors"
                  disabled={!dataLoaded}
                >
                  <Pencil1Icon className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-gray-400 italic text-sm">
                Add your social media, website, or other relevant links
              </div>
            </div>
            
            {/* Save Buttons */}
            <div className="mt-8 flex gap-3">
              <button 
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={isLoading || !dataLoaded}
                className="bg-white border border-black text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors flex items-center"
              >
                Save Progress
              </button>
              <button 
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={isLoading || !dataLoaded}
                className={`${isLoading || !dataLoaded ? 'bg-gray-400' : 'bg-black hover:bg-gray-900'} text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center`}
              >
                {isLoading ? 'Saving...' : 'Complete & Continue'}
                {isLoading && (
                  <svg className="animate-spin -mr-1 ml-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Right Section - Gallery & Projects */}
          <div className="w-full md:w-2/5 mt-6 md:mt-0 ml-auto">
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-3">Upload Your Gallery Images</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {Array(9).fill(null).map((_, index) => (
                  <GalleryImageUploader key={index} index={index} />
                ))}
              </div>
              <p className="text-xs text-gray-500">Upload images that represent you and your work. These will appear in your profile gallery.</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-3">Add Books You've Read</h3>
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {Array(5).fill(null).map((_, index) => (
                  <BookImageUploader key={index} index={index} />
                ))}
              </div>
              <p className="text-xs text-gray-500">Add books that you've read or recommend to others.</p>
            </div>
            
          {/*   <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Projects</h3>
              <p className="text-sm text-gray-500">Your projects will be loaded from your profile data.</p>
            </div> */}
          </div>
        </div>
      </form>
    </div>
  )
}

export default OnboardingPage