'use client';

import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import Link from 'next/link';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from "@clerk/nextjs";
import ImageUploader from '../components/ImageUploader';
import { PlusIcon } from '@radix-ui/react-icons';

// Define TypeScript interfaces for our data
interface Task {
  _id: Id<"tasks">;
  category: string;
  text: string;
  name?: string;
  forRole?: string;
  reward?: {
    type: string;
    details: {
      amount: string;
      currency: string;
      description?: string;
    }
  } | number;
  description?: string;
  explanation?: string;
  status: string;
  companyId: Id<"companies">;
}

interface Company {
  _id: Id<"companies">;
  name: string;
  role: string;
  location: string;
  image: string;
  storageId?: string;
  color: string;
  vision: string;
  mission: string;
  description?: string;
  socialLinks: {
    website?: string;
  };
}

const BoardPage = () => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [selectedTask, setSelectedTask] = React.useState<{companyId: Id<"companies">, task: Task} | null>(null);
  const [showAddCompanyModal, setShowAddCompanyModal] = React.useState(false);
  const [newCompany, setNewCompany] = React.useState({
    name: '',
    role: '',
    location: '',
    image: '/placeholder.svg',
    storageId: '',
    color: '#4F46E5',
    type: 'Project',
    vision: '',
    mission: '',
    description: '',
    principles: [''],
    values: [''],
    socialLinks: {
      website: ''
    }
  });
  
  const { user } = useUser();
  const createCompany = useMutation(api.companies.createCompany);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const uploadFile = useMutation(api.files.uploadFile);
  
  // Fetch all companies and their tasks
  const data = useQuery(api.companies.getTasksForCompanies);
  const getStorageUrl = useQuery(api.getStorageUrl.default, { 
    storageId: newCompany.storageId || "" 
  });

  // Get all unique storageIds from companies
  const storageIds = React.useMemo(() => {
    if (!data?.companies) return [];
    return [...new Set(data.companies
      .map(company => company.storageId)
      .filter((id): id is string => id !== undefined))];
  }, [data?.companies]);

  // Create a single query for the first storageId (for new company creation)
  const singleStorageUrl = useQuery(api.getStorageUrl.default, { 
    storageId: newCompany.storageId || "" 
  });

  // Create a map of storage URLs for easy lookup
  const companyStorageUrls = React.useMemo(() => {
    const urlMap = new Map<string, string>();
    // For now, we'll use the direct image URLs from the company data
    // This can be enhanced later with proper storage URL handling if needed
    if (data?.companies) {
      data.companies.forEach((company) => {
        if (company.image) {
          urlMap.set(company._id, company.image);
        }
      });
    }
    return urlMap;
  }, [data?.companies]);
  
  // Helper function to get company image URL - simplified to use the image directly
  const getCompanyImageUrl = (company: Company) => {
    // Only return the image if it's not the placeholder
    return company.image !== '/placeholder.svg' ? company.image : '';
  };

  // Helper function to get icon based on task category
  const getTaskIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Building': '🔨',
      'Marketing': '📢',
      'Design': '🎨',
      'Development': '💻',
      'Research': '🔍',
      'default': '❓'
    };
    return icons[category] || icons.default;
  };

  // Format reward display
  const formatReward = (reward: Task['reward']) => {
    if (!reward) return null;
    if (typeof reward === 'number') return `$${reward} USD`;
    return `${reward.details.amount} ${reward.details.currency}`;
  };

  const handleTaskClick = (companyId: Id<"companies">, task: Task) => {
    setSelectedTask({ companyId, task });
  };

  const closeTaskDetails = () => {
    setSelectedTask(null);
  };

  // Helper function to get company type and color
  const getCompanyTypeInfo = (company: Company) => {
    // Determine company type based on role/mission
    const role = company.role.toLowerCase();
    const mission = company.mission?.toLowerCase() || '';
    
    if (role.includes('infrastructure') || mission.includes('infrastructure')) {
      return { type: 'Infrastructure', bgColor: 'bg-blue-950', textColor: 'text-blue-200' };
    }
    if (role.includes('marketplace') || mission.includes('marketplace')) {
      return { type: 'Marketplace', bgColor: 'bg-purple-950', textColor: 'text-purple-200' };
    }
    if (role.includes('ai') || mission.includes('ai')) {
      return { type: 'AI', bgColor: 'bg-green-950', textColor: 'text-green-200' };
    }
    if (role.includes('brand') || mission.includes('brand')) {
      return { type: 'Brand', bgColor: 'bg-orange-950', textColor: 'text-orange-200' };
    }
    // Default type
    return { type: 'Project', bgColor: 'bg-gray-900', textColor: 'text-gray-200' };
  };

  // Function to handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      // 1. Get the upload URL from Convex
      const uploadUrl = await generateUploadUrl();
      
      // 2. Upload the file to the URL
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
      
      if (!result.ok) {
        throw new Error(`Failed to upload image: ${result.statusText}`);
      }
      
      // 3. Get the storageId from the response
      const { storageId } = await result.json();
      
      // 4. Save the storageId in the database
      await uploadFile({ storageId, fileName: file.name });
      
      // 5. Update the local state with the storageId
      setNewCompany(prev => ({
        ...prev,
        storageId
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleImageChange = async (file: File) => {
    // Create a temporary object URL for immediate visual feedback
    const tempUrl = URL.createObjectURL(file);
    setNewCompany(prev => ({ ...prev, image: tempUrl }));
    
    // Start the actual upload process
    await handleImageUpload(file);
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createCompany({
        ...newCompany,
        adminId: user.id,
        principles: newCompany.principles.filter(p => p.trim() !== ''),
        values: newCompany.values.filter(v => v.trim() !== ''),
        // Use the storage URL if available, otherwise use the placeholder
        image: singleStorageUrl || '/placeholder.svg',
      });

      setShowAddCompanyModal(false);
      setNewCompany({
        name: '',
        role: '',
        location: '',
        image: '/placeholder.svg',
        storageId: '',
        color: '#4F46E5',
        type: 'Project',
        vision: '',
        mission: '',
        description: '',
        principles: [''],
        values: [''],
        socialLinks: {
          website: ''
        }
      });
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  // Loading state
  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading companies...</p>
        </div>
      </div>
    );
  }

  const { companies, tasksByCompany } = data;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 md:p-8">
      <div className="mx-auto">
        {/* Header and controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Board</h1>
            <p className="text-gray-400">
              From the intergalactic computer network. <br />
              Enter bounties, grok, GTD, earn equity or cash, gain XP & skills
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-0">
            <button 
              className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition"
              onClick={() => setShowAddCompanyModal(true)}
            >
              Add Company/Project
            </button>
            
            <div className="flex space-x-1 bg-gray-900 p-1 rounded-md">
              <button 
                className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {companies.map((company: Company) => {
              const { type, bgColor, textColor } = getCompanyTypeInfo(company);
              return (
                <Link 
                  key={company._id} 
                  href={`/board/company/${company._id}`}
                  className="group bg-black rounded-lg border border-gray-800 hover:border-gray-600 transition-all duration-200 overflow-hidden block"
                >
                  <div className="relative cursor-pointer p-4">
                    {/* Company Header with Logo and Info */}
                    <div className="flex items-start space-x-4 mb-4">
                      {/* Company Logo */}
                      <div className="relative h-18 w-18 flex-shrink-0 overflow-hidden rounded-md">
                        {getCompanyImageUrl(company) ? (
                          <Image 
                            src={getCompanyImageUrl(company)}
                            alt={`${company.name} logo`}
                            fill
                            className="object-contain p-2 transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Company Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h2 className="font-semibold text-lg group-hover:text-gray-300 transition-colors truncate">
                            {company.name}
                          </h2>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} flex-shrink-0`}>
                            {type}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-1 min-h-[2.5rem]">
                          {company.role.split(' ').slice(0, 4).join(' ')}
                          <br />
                          {company.role.split(' ').slice(4).join(' ')}
                        </p>
                        {company.description && (
                          <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                            {company.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="truncate">{company.location}</span>
                          {company.socialLinks?.website && (
                            <button 
                              className="text-gray-400 hover:text-white transition-colors ml-2 flex-shrink-0"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(company.socialLinks.website, '_blank', 'noopener,noreferrer');
                              }}
                            >
                              Website ↗
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tasks section */}
                    <div className="space-y-2 bg-gray-900/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-400">Active Tasks</span>
                        <span className="text-xs text-gray-600">{(tasksByCompany[company._id] || []).length} total</span>
                      </div>
                      {(tasksByCompany[company._id] || []).slice(0, 3).map((task: Task) => (
                        <button 
                          key={task._id} 
                          className="flex items-center justify-between w-full text-sm bg-black/40 hover:bg-black/60 p-2 rounded transition-colors text-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskClick(company._id, task);
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getTaskIcon(task.category)}</span>
                            <div>
                              <p className="text-gray-300 text-sm">
                                {task.name || task.text}
                              </p>
                              {task.forRole && (
                                <p className="text-gray-500 text-xs">{task.forRole}</p>
                              )}
                            </div>
                          </div>
                        {/*   {task.reward && (
                              <div className="text-gray-400 text-xs font-mono ml-2">
                                {formatReward(task.reward)}
                              </div>
                            )} */}
                        </button>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          // Update list view with similar styling
          <div className="space-y-4">
            {companies.map((company: Company) => {
              const { type, bgColor, textColor } = getCompanyTypeInfo(company);
              return (
                <Link 
                  key={company._id} 
                  href={`/board/company/${company._id}`}
                  className="group bg-black rounded-lg border border-gray-800 hover:border-gray-600 transition-all duration-200 overflow-hidden block"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative h-16 w-16 overflow-hidden">
                          {getCompanyImageUrl(company) ? (
                            <Image 
                              src={getCompanyImageUrl(company)}
                              alt={`${company.name} logo`}
                              fill
                              className="object-contain transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h2 className="font-semibold text-lg group-hover:text-gray-300 transition-colors">
                              {company.name}
                            </h2>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                              {type}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mt-1">{company.role.split(' ').slice(0, 4).join(' ')}</p>
                          <p className="text-gray-400 text-sm mt-1">
                            {company.role.split(' ').slice(4).join(' ')}
                          </p>
                          {company.description && (
                            <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                              {company.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{company.location}</span>
                            {company.socialLinks?.website && (
                              <button 
                                className="text-gray-400 hover:text-white transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  window.open(company.socialLinks.website, '_blank', 'noopener,noreferrer');
                                }}
                              >
                                Website ↗
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tasks section with new design */}
                    <div className="mt-6 space-y-2 bg-gray-900/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-400">Active Tasks</span>
                        <span className="text-xs text-gray-600">{(tasksByCompany[company._id] || []).length} total</span>
                      </div>
                      <div className="grid gap-2">
                        {(tasksByCompany[company._id] || []).slice(0, 3).map((task: Task) => (
                          <button 
                            key={task._id} 
                            className="flex items-center justify-between w-full text-sm bg-black/40 hover:bg-black/60 p-3 rounded transition-colors text-left"
                            onClick={() => handleTaskClick(company._id, task)}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">{getTaskIcon(task.category)}</span>
                              <div>
                                <p className="text-gray-300 text-sm">
                                  {task.name || task.text}
                                </p>
                                {task.forRole && (
                                  <p className="text-gray-500 text-xs">{task.forRole}</p>
                                )}
                              </div>
                            </div>
                            {task.reward && (
                              <div className="text-gray-400 text-xs font-mono">
                                {formatReward(task.reward)}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Task Detail Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTaskIcon(selectedTask.task.category)}</span>
                    <h3 className="text-xl font-bold">{selectedTask.task.name || selectedTask.task.text}</h3>
                  </div>
                  <button 
                    onClick={closeTaskDetails}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedTask.task.description && (
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Description</h4>
                      <p className="text-gray-300">{selectedTask.task.description}</p>
                    </div>
                  )}

                  {selectedTask.task.explanation && (
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Explanation</h4>
                      <p className="text-gray-300">{selectedTask.task.explanation}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <div>
                      {selectedTask.task.forRole && (
                        <p className="text-sm text-gray-400">Role: {selectedTask.task.forRole}</p>
                      )}
                      {selectedTask.task.reward && (
                        <p className="text-sm text-gray-400">
                          Reward: <span className="font-mono">{formatReward(selectedTask.task.reward)}</span>
                        </p>
                      )}
                    </div>
                    <button className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition">
                      Apply for Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Company Modal */}
        {showAddCompanyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-black rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold">Add New Company/Project</h3>
                  <button 
                    onClick={() => setShowAddCompanyModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form className="space-y-6" onSubmit={handleCreateCompany}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div className="flex justify-center mb-4">
                        <ImageUploader
                          initialImage={newCompany.image}
                          onImageChange={handleImageChange}
                          width={120}
                          height={120}
                          className="border-2 border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
                          placeholderClassName="bg-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Company/Project Name</label>
                        <input
                          type="text"
                          value={newCompany.name}
                          onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-700 transition-colors"
                          placeholder="Enter company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Role/Focus</label>
                        <input
                          type="text"
                          value={newCompany.role}
                          onChange={(e) => setNewCompany({ ...newCompany, role: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-700 transition-colors"
                          placeholder="e.g. Building Infrastructure for Web3"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                        <input
                          type="text"
                          value={newCompany.location}
                          onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-700 transition-colors"
                          placeholder="e.g. San Francisco, CA"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea
                          value={newCompany.description}
                          onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-700 transition-colors"
                          rows={3}
                          placeholder="Brief description of your company/project"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Website (Optional)</label>
                        <input
                          type="url"
                          value={newCompany.socialLinks.website}
                          onChange={(e) => setNewCompany({ 
                            ...newCompany, 
                            socialLinks: { ...newCompany.socialLinks, website: e.target.value } 
                          })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-700 transition-colors"
                          placeholder="https://example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Company Type</label>
                        <select
                          value={newCompany.type}
                          onChange={(e) => setNewCompany({ ...newCompany, type: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-700 transition-colors"
                        >
                          <option value="Project">Project</option>
                          <option value="Infrastructure">Infrastructure</option>
                          <option value="Marketplace">Marketplace</option>
                          <option value="AI">AI</option>
                          <option value="Brand">Brand</option>
                        </select>
                      </div>
                    </div>

                    {/* Vision and Mission */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Vision</label>
                        <textarea
                          value={newCompany.vision}
                          onChange={(e) => setNewCompany({ ...newCompany, vision: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-700 transition-colors"
                          rows={3}
                          placeholder="What's your company's vision for the future?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Mission</label>
                        <textarea
                          value={newCompany.mission}
                          onChange={(e) => setNewCompany({ ...newCompany, mission: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-700 transition-colors"
                          rows={3}
                          placeholder="What's your company's mission?"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Principles and Values */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Principles</label>
                      <div className="space-y-2">
                        {newCompany.principles.map((principle, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={principle}
                              onChange={(e) => {
                                const newPrinciples = [...newCompany.principles];
                                newPrinciples[index] = e.target.value;
                                setNewCompany({ ...newCompany, principles: newPrinciples });
                              }}
                              className="flex-1 bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-700 transition-colors"
                              placeholder="Enter a principle"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newPrinciples = newCompany.principles.filter((_, i) => i !== index);
                                setNewCompany({ ...newCompany, principles: newPrinciples });
                              }}
                              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setNewCompany({ 
                            ...newCompany, 
                            principles: [...newCompany.principles, ''] 
                          })}
                          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                        >
                          <PlusIcon className="h-4 w-4" />
                          <span>Add Principle</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Values</label>
                      <div className="space-y-2">
                        {newCompany.values.map((value, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => {
                                const newValues = [...newCompany.values];
                                newValues[index] = e.target.value;
                                setNewCompany({ ...newCompany, values: newValues });
                              }}
                              className="flex-1 bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-700 transition-colors"
                              placeholder="Enter a value"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newValues = newCompany.values.filter((_, i) => i !== index);
                                setNewCompany({ ...newCompany, values: newValues });
                              }}
                              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setNewCompany({ 
                            ...newCompany, 
                            values: [...newCompany.values, ''] 
                          })}
                          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                        >
                          <PlusIcon className="h-4 w-4" />
                          <span>Add Value</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => setShowAddCompanyModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-black text-white hover:bg-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-gray-800 hover:border-gray-700"
                    >
                      Create Company
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardPage;