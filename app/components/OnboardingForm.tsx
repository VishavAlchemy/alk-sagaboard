'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '@clerk/nextjs';
import ImageUploader from './ImageUploader';

// Available archetype options
const ARCHETYPES = [
  'Nurturer', 'Visionary', 'Teacher', 'Adventurer', 'Designer', 
  'Founder', 'Builder', 'Artist', 'Warrior'
];

// Available interest options
const INTERESTS = [
  'Entrepreneurship', 'Art', 'Music', 'Marketing', 'Technology', 
  'Internet Companies', 'Space', 'Spirituality', 'Meditation', 
  'Programming', 'Dancing', 'Design', 'Reading', 'Writing', 
  'Science', 'Biology', 'Neuroscience', 'Chemistry'
];

// Social link types
const SOCIAL_LINK_TYPES = [
  'github', 'substack', 'website', 'product', 'instagram', 'x', 'youtube'
];

const OnboardingForm: React.FC = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const checkUsernameResult = useQuery(api.users.isUsernameAvailable, { username: '' });
  const updateOnboarding = useMutation(api.users.updateOnboardingData);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    age: '',
    username: '',
    archetypes: [] as string[],
    aboutMe: '',
    experience: '',
    interests: [] as string[],
    galleryImages: Array(9).fill(''),
    favoriteBooks: Array(5).fill({ coverUrl: '', title: '' }),
    project: {
      logoUrl: '',
      headline: '',
      subheadline: '',
      link: ''
    },
    links: [] as { type: string; url: string; title?: string }[]
  });
  
  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Username availability check
  useEffect(() => {
    if (formData.username.length > 0) {
      const timer = setTimeout(async () => {
        try {
          // Create a new query specifically for the entered username
          const result = await useQuery(api.users.isUsernameAvailable, { 
            username: formData.username 
          });
          setIsUsernameAvailable(!!result);
        } catch (error) {
          console.error("Error checking username:", error);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [formData.username]);
  
  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      // If name field is being updated, also update firstName
      if (name === 'name') {
        return {
          ...prev,
          [name]: value,
          firstName: value
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle selection of archetypes
  const handleArchetypeToggle = (archetype: string) => {
    setFormData(prev => {
      const current = [...prev.archetypes];
      
      if (current.includes(archetype)) {
        return { ...prev, archetypes: current.filter(a => a !== archetype) };
      } else if (current.length < 3) {
        return { ...prev, archetypes: [...current, archetype] };
      }
      
      return prev;
    });
    
    // Clear error when selection changes
    if (errors.archetypes) {
      setErrors(prev => ({ ...prev, archetypes: '' }));
    }
  };
  
  // Handle selection of interests
  const handleInterestToggle = (interest: string) => {
    setFormData(prev => {
      const current = [...prev.interests];
      
      if (current.includes(interest)) {
        return { ...prev, interests: current.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...current, interest] };
      }
    });
  };
  
  // Handle gallery image upload
  const handleGalleryImageUpload = async (index: number, file: File) => {
    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Upload the file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) {
        throw new Error('Failed to upload image');
      }
      
      // Get the storage ID
      const { storageId } = await result.json();
      
      // Update form data with the storage ID
      setFormData(prev => {
        const updatedGallery = [...prev.galleryImages];
        updatedGallery[index] = storageId;
        return { ...prev, galleryImages: updatedGallery };
      });
    } catch (error) {
      console.error('Error uploading gallery image:', error);
      setErrors(prev => ({ ...prev, galleryImages: 'Failed to upload image' }));
    }
  };
  
  // Handle book cover upload
  const handleBookCoverUpload = async (index: number, file: File) => {
    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Upload the file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) {
        throw new Error('Failed to upload image');
      }
      
      // Get the storage ID
      const { storageId } = await result.json();
      
      // Update form data with the storage ID
      setFormData(prev => {
        const updatedBooks = [...prev.favoriteBooks];
        updatedBooks[index] = { ...updatedBooks[index], coverUrl: storageId };
        return { ...prev, favoriteBooks: updatedBooks };
      });
    } catch (error) {
      console.error('Error uploading book cover:', error);
      setErrors(prev => ({ ...prev, favoriteBooks: 'Failed to upload image' }));
    }
  };
  
  // Handle project logo upload
  const handleProjectLogoUpload = async (file: File) => {
    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Upload the file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) {
        throw new Error('Failed to upload image');
      }
      
      // Get the storage ID
      const { storageId } = await result.json();
      
      // Update form data with the storage ID
      setFormData(prev => ({
        ...prev,
        project: {
          ...prev.project,
          logoUrl: storageId
        }
      }));
    } catch (error) {
      console.error('Error uploading project logo:', error);
      setErrors(prev => ({ ...prev, projectLogo: 'Failed to upload image' }));
    }
  };
  
  // Handle book title change
  const handleBookTitleChange = (index: number, title: string) => {
    setFormData(prev => {
      const updatedBooks = [...prev.favoriteBooks];
      updatedBooks[index] = { ...updatedBooks[index], title };
      return { ...prev, favoriteBooks: updatedBooks };
    });
  };
  
  // Handle project data changes
  const handleProjectChange = (field: keyof typeof formData.project, value: string) => {
    setFormData(prev => ({
      ...prev,
      project: {
        ...prev.project,
        [field]: value
      }
    }));
  };
  
  // Add a new social link
  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { type: SOCIAL_LINK_TYPES[0], url: '', title: '' }]
    }));
  };
  
  // Update an existing social link
  const updateSocialLink = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updatedLinks = [...prev.links];
      updatedLinks[index] = { ...updatedLinks[index], [field]: value };
      return { ...prev, links: updatedLinks };
    });
  };
  
  // Remove a social link
  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };
  
  // Validate the current step
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 1: // Basic info
        if (!formData.name.trim()) {
          newErrors.name = 'Name is required';
        }
        
        if (!formData.age) {
          newErrors.age = 'Age is required';
        } else if (isNaN(Number(formData.age)) || Number(formData.age) < 13) {
          newErrors.age = 'Please enter a valid age (13+)';
        }
        
        if (!formData.username.trim()) {
          newErrors.username = 'Username is required';
        } else if (!isUsernameAvailable) {
          newErrors.username = 'This username is already taken';
        }
        break;
        
      case 2: // Archetypes and description
        if (formData.archetypes.length !== 3) {
          newErrors.archetypes = 'Please select exactly 3 archetypes';
        }
        
        if (!formData.aboutMe.trim() || formData.aboutMe.length < 100) {
          newErrors.aboutMe = 'About me should be at least 100 characters';
        }
        
        if (!formData.experience.trim() || formData.experience.length < 50) {
          newErrors.experience = 'Experience should be at least 50 characters';
        }
        break;
        
      case 3: // Interests
        if (formData.interests.length === 0) {
          newErrors.interests = 'Please select at least one interest';
        }
        break;
        
      case 4: // Gallery
        const filledImages = formData.galleryImages.filter(url => url !== '');
        if (filledImages.length !== 9) {
          newErrors.galleryImages = 'Please upload all 9 images';
        }
        break;
        
      case 5: // Books
        const filledBooks = formData.favoriteBooks.filter(book => book.coverUrl !== '');
        if (filledBooks.length < 3) {
          newErrors.favoriteBooks = 'Please upload at least 3 book covers';
        }
        break;
        
      case 6: // Project
        if (!formData.project.logoUrl) {
          newErrors.projectLogo = 'Project logo is required';
        }
        if (!formData.project.headline.trim()) {
          newErrors.projectHeadline = 'Headline is required';
        }
        if (!formData.project.subheadline.trim()) {
          newErrors.projectSubheadline = 'Subheadline is required';
        }
        if (!formData.project.link.trim()) {
          newErrors.projectLink = 'Project link is required';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setErrors({ general: 'Authentication error. Please sign in again.' });
      return;
    }
    
    if (validateCurrentStep()) {
      setIsSubmitting(true);
      
      try {
        // Clean up book covers and gallery images
        const cleanedFavoriteBooks = formData.favoriteBooks
          .filter(book => book.coverUrl !== '')
          .slice(0, 5);
          
        const cleanedGalleryImages = formData.galleryImages
          .filter(url => url !== '')
          .slice(0, 9);
        
        // Submit the data
        await updateOnboarding({
          clerkId: userId,
          firstName: formData.firstName || formData.name, // Use firstName or fallback to name
          username: formData.username,
          age: Number(formData.age),
          archetypes: formData.archetypes,
          aboutMe: formData.aboutMe,
          experience: formData.experience,
          interests: formData.interests,
          galleryImages: cleanedGalleryImages,
          favoriteBooks: cleanedFavoriteBooks,
          project: formData.project,
          links: formData.links,
        });
        
        // Redirect to profile
        router.push(`/profile/${formData.username}`);
      } catch (error) {
        console.error('Error updating profile:', error);
        setErrors({ 
          general: 'There was an error saving your profile. Please try again.' 
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Form steps UI
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="13"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
                placeholder="Your age"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  @
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
                  placeholder="your-username"
                />
              </div>
              {!isUsernameAvailable && formData.username && (
                <p className="mt-1 text-sm text-red-600">
                  This username is already taken
                </p>
              )}
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Select 3 Archetypes</h3>
              <p className="text-sm text-gray-500 mb-3">
                Choose 3 archetypes that best represent you
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                {ARCHETYPES.map(archetype => (
                  <button
                    key={archetype}
                    type="button"
                    onClick={() => handleArchetypeToggle(archetype)}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors
                      ${formData.archetypes.includes(archetype)
                        ? 'bg-black text-white border-2 border-black'
                        : 'bg-gray-100 text-black hover:bg-gray-200 border-2 border-transparent'
                      }`}
                  >
                    {archetype}
                  </button>
                ))}
              </div>
              
              {errors.archetypes && (
                <p className="mt-2 text-sm text-red-600">{errors.archetypes}</p>
              )}
              
              <p className="mt-2 text-sm text-gray-500">
                Selected: {formData.archetypes.join(', ')}
              </p>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About Me <span className="text-gray-400">(min 100 characters)</span>
              </label>
              <textarea
                name="aboutMe"
                value={formData.aboutMe}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
                placeholder="Tell us about yourself..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.aboutMe.length} / 100+ characters
              </p>
              {errors.aboutMe && (
                <p className="mt-1 text-sm text-red-600">{errors.aboutMe}</p>
              )}
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience <span className="text-gray-400">(min 50 characters)</span>
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
                placeholder="Describe your experience..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.experience.length} / 50+ characters
              </p>
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
              )}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Select Your Interests</h3>
            <p className="text-sm text-gray-500 mb-3">
              Choose all interests that apply to you
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INTERESTS.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`py-2 px-3 rounded-full text-sm font-medium transition-colors
                    ${formData.interests.includes(interest)
                      ? 'bg-black text-white border border-black'
                      : 'bg-gray-100 text-black hover:bg-gray-200 border border-transparent'
                    }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            
            {errors.interests && (
              <p className="mt-2 text-sm text-red-600">{errors.interests}</p>
            )}
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Gallery Images</h3>
            <p className="text-sm text-gray-500 mb-3">
              Upload 9 images for your profile gallery
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              {formData.galleryImages.map((url, index) => (
                <ImageUploader
                  key={index}
                  initialImage={url}
                  onImageChange={(file: File) => handleGalleryImageUpload(index, file)}
                  className="w-full aspect-square"
                  placeholderClassName="bg-gray-100"
                />
              ))}
            </div>
            
            {errors.galleryImages && (
              <p className="mt-2 text-sm text-red-600">{errors.galleryImages}</p>
            )}
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Favorite Books</h3>
            <p className="text-sm text-gray-500 mb-3">
              Upload 3-5 of your favorite book covers
            </p>
            
            <div className="flex gap-4 overflow-x-auto pb-4">
              {formData.favoriteBooks.map((book, index) => (
                <ImageUploader
                  key={index}
                  initialImage={book.coverUrl}
                  onImageChange={(file: File) => handleBookCoverUpload(index, file)}
                  className="min-w-[150px] h-[200px]"
                  placeholderClassName="bg-gray-100"
                />
              ))}
            </div>
            
            {errors.favoriteBooks && (
              <p className="mt-2 text-sm text-red-600">{errors.favoriteBooks}</p>
            )}
          </div>
        );
        
      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Project Information</h3>
            <p className="text-sm text-gray-500 mb-3">
              Share details about your project
            </p>
            
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-24 h-24">
                <ImageUploader
                  initialImage={formData.project.logoUrl}
                  onImageChange={(file: File) => handleProjectLogoUpload(file)}
                  className="w-[200px] h-[200px]"
                  placeholderClassName="bg-gray-100"
                />
              </div>
              
              {errors.projectLogo && (
                <p className="text-sm text-red-600">{errors.projectLogo}</p>
              )}
              
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  placeholder="Project Headline"
                  value={formData.project.headline}
                  onChange={(e) => handleProjectChange('headline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
                {errors.projectHeadline && (
                  <p className="text-sm text-red-600">{errors.projectHeadline}</p>
                )}
                
                <input
                  type="text"
                  placeholder="Project Subheadline"
                  value={formData.project.subheadline}
                  onChange={(e) => handleProjectChange('subheadline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
                {errors.projectSubheadline && (
                  <p className="text-sm text-red-600">{errors.projectSubheadline}</p>
                )}
                
                <input
                  type="url"
                  placeholder="Project Link"
                  value={formData.project.link}
                  onChange={(e) => handleProjectChange('link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
                {errors.projectLink && (
                  <p className="text-sm text-red-600">{errors.projectLink}</p>
                )}
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Social Links</h3>
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="text-sm bg-black hover:bg-gray-800 text-white py-1 px-3 rounded-md"
                >
                  + Add Link
                </button>
              </div>
              
              {formData.links.length === 0 ? (
                <p className="text-sm text-gray-500">Add social links to your profile (optional)</p>
              ) : (
                <div className="space-y-3">
                  {formData.links.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <select
                        value={link.type}
                        onChange={(e) => updateSocialLink(index, 'type', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
                      >
                        {SOCIAL_LINK_TYPES.map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                      
                      <input
                        type="url"
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
                      />
                      
                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="p-2 text-gray-500 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
        
      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-center">Review Your Profile</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-center text-gray-600">
                All your profile information has been collected!
              </p>
              <p className="text-center text-gray-600 mt-2">
                Click "Complete" to save your profile and continue to your dashboard.
              </p>
            </div>
            
            {errors.general && (
              <p className="text-center text-red-600">{errors.general}</p>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Progress indicator 
  const renderProgressBar = () => {
    const totalSteps = 7;
    const progress = (currentStep / totalSteps) * 100;
    
    return (
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">Profile Setup</h2>
      <p className="text-gray-600 mb-6">Fill in your details to create your profile</p>
      
      {renderProgressBar()}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStep()}
        
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-md ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            Back
          </button>
          
          {currentStep < 7 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800'
              } text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50`}
            >
              {isSubmitting ? 'Saving...' : 'Complete'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OnboardingForm; 