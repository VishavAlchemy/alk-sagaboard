'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import ImageUpload from "@/app/components/ImageUpload";
import { useStorageUrl } from "@/app/hooks/useStorageUrl";
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

// Department colors mapping
const departmentColors: { [key: string]: string } = {
  Finances: "emerald",
  Marketing: "blue",
  Design: "purple",
  Building: "orange",
  Research: "cyan",
  Product: "indigo",
  HR: "pink",
  "Project Management": "amber",
  Others: "gray"
};

// Pillar colors mapping
const pillarColors = {
  vision: "orange",
  mission: "blue",
  principles: "purple",
  values: "emerald"
};

interface Company {
  _id: Id<"companies">;
  name: string;
  role: string;
  location: string;
  image: string;
  storageId?: string;
  color: string;
  type: string;
  adminId?: string;
  socialLinks: {
    website?: string;
  };
  vision: string;
  mission: string;
  principles: string[];
  values: string[];
  createdAt: number;
  updatedAt: number;
}

interface Task {
  _id: Id<"tasks">;
  companyId: Id<"companies">;
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
  additionalInfo?: string;
  status: string;
  createdAt: number;
  updatedAt: number;
}

const CompanyProfilePage = () => {
  const params = useParams();
  const { user } = useUser();
  const companyId = params.id as Id<"companies">;
  const [showAddTaskModal, setShowAddTaskModal] = React.useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = React.useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = React.useState(false);
  const [selectedTaskToDelete, setSelectedTaskToDelete] = React.useState<{ id: Id<"tasks">, text: string } | null>(null);
  const [editCompanyData, setEditCompanyData] = React.useState({
    name: '',
    role: '',
    location: '',
    image: '',
    storageId: '',
    color: '',
    type: '',
    socialLinks: {
      website: ''
    },
    vision: '',
    mission: '',
    principles: [''],
    values: ['']
  });
  const [newTask, setNewTask] = React.useState({
    category: '',
    text: '',
    forRole: '',
    reward: {
      type: 'points',
      details: {
        amount: '',
        currency: 'USD',
        description: ''
      }
    }
  });

  // Mutations
  const createTask = useMutation(api.companies.createTask);
  const deleteTask = useMutation(api.companies.deleteTask);
  const updateCompany = useMutation(api.companies.updateCompany);

  // Fetch company data
  const company = useQuery(api.companies.getCompany, { companyId }) as Company | null;
  const companyTasks = useQuery(api.companies.getTasks, { companyId }) as Task[] | null;
  const isAdmin = useQuery(api.companies.isCompanyAdmin, { userId: user?.id || "", companyId });
  const companyImageUrl = useStorageUrl(company?.storageId || "");

  // Initialize edit form data when company data is loaded
  React.useEffect(() => {
    if (company) {
      setEditCompanyData({
        name: company.name,
        role: company.role,
        location: company.location,
        image: companyImageUrl || company.image,
        storageId: company.storageId || '',
        color: company.color,
        type: company.type || '',
        socialLinks: {
          website: company.socialLinks?.website || ''
        },
        vision: company.vision,
        mission: company.mission,
        principles: company.principles,
        values: company.values
      });
    }
  }, [company, companyImageUrl]);

  // Loading state
  if (!company || !companyTasks) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  // Organize tasks by category
  const tasksByCategory = companyTasks.reduce((acc: { [key: string]: Task[] }, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {});

  // Triangle SVG component for reuse
  const Triangle = ({ color, className = "", direction = "right" }: { color: string, className?: string, direction?: "right" | "down" }) => {
    const points = direction === "right" ? "0,0 10,5 0,10" : "0,0 10,0 5,10";
    return (
      <svg width="12" height="12" viewBox="0 0 10 10" className={`flex-shrink-0 ${getIconColor(color)} ${className}`}>
        <polygon points={points} />
      </svg>
    );
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTask({
      companyId,
      category: newTask.category,
      name: newTask.text,
      text: newTask.text,
      forRole: newTask.forRole || undefined,
      reward: newTask.reward
    });
    setShowAddTaskModal(false);
    setNewTask({
      category: '',
      text: '',
      forRole: '',
      reward: {
        type: 'points',
        details: {
          amount: '',
          currency: 'USD',
          description: ''
        }
      }
    });
  };

  const handleDeleteTask = async () => {
    if (selectedTaskToDelete) {
      await deleteTask({ taskId: selectedTaskToDelete.id });
      setShowDeleteTaskModal(false);
      setSelectedTaskToDelete(null);
    }
  };

  const handleEditCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Update company
      await updateCompany({
        companyId,
        ...editCompanyData,
        // Only include storageId if it exists
        storageId: editCompanyData.storageId || undefined,
      });
      
      setShowEditCompanyModal(false);
    } catch (error) {
      console.error('Error updating company:', error);
      alert('Failed to update company. Please try again.');
    }
  };

  const handleImageUpload = (storageId: string) => {
    setEditCompanyData(prev => ({
      ...prev,
      storageId,
      // Update the image preview immediately using the company's URL
      image: companyImageUrl || prev.image
    }));
  };

  return (
    <div className="flex flex-col bg-black min-h-screen text-white py-6">
      <div className="px-4 md:px-6 w-full max-w-7xl mx-auto">
        {/* Main Content Grid with Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* Left Column (3/5 width) */}
          <div className="md:col-span-3">
            {/* Company Info with Edit Button */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0">
                <Image
                  src={companyImageUrl || company.image}
                  alt={`${company.name} Logo`}
                  width={110}
                  height={110}
                  className="rounded-full border-2 border-gray-700"
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-1">{company.name}</h1>
                    <p className="text-gray-400">{company.role}</p>
                    <p className="text-gray-400 mb-3">{company.location}</p>
                    <div className="flex items-center space-x-2">
                      {company.socialLinks?.website && (
                        <a href={company.socialLinks.website} target="_blank" rel="noopener noreferrer" className="bg-transparent hover:bg-gray-800 p-2 rounded-full transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-white">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => setShowEditCompanyModal(true)}
                      className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-gray-700"
                    >
                      Edit Company
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tasks Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-semibold">Tasks by Department</h2>
                {isAdmin && (
                  <button
                    onClick={() => setShowAddTaskModal(true)}
                    className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-gray-700"
                  >
                    Add Task
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
                  <div key={category} className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <Triangle 
                        color={departmentColors[category] || "gray"}
                        direction="right"
                      />
                      <h3 className="text-lg font-medium text-gray-300">{category}</h3>
                    </div>
                    <div className="pl-5 text-sm text-gray-300 space-y-1">
                      {categoryTasks.map((task) => (
                        <div 
                          key={task._id}
                          className="group flex items-start justify-between hover:bg-gray-800/30 p-2 rounded-md transition-colors"
                        >
                          <Link 
                            href={`/board/company/task/${task._id}`}
                            className="flex-1"
                          >
                            <p>- {task.text}</p>
                            {task.reward && (
                              <p className="text-xs text-gray-400 ml-2">
                                Reward: {typeof task.reward === 'number' 
                                  ? `${task.reward} points` 
                                  : `${task.reward.details.amount} ${task.reward.details.currency}${task.reward.details.description ? ` (${task.reward.details.description})` : ''}`}
                              </p>
                            )}
                            {task.additionalInfo && (
                              <p className="text-xs text-gray-400 ml-2">{task.additionalInfo}</p>
                            )}
                          </Link>
                          {isAdmin && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedTaskToDelete({ id: task._id, text: task.text });
                                setShowDeleteTaskModal(true);
                              }}
                              className="opacity-0 group-hover:opacity-100 ml-2 p-1.5 hover:bg-gray-800 rounded transition-all border border-gray-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (2/5 width) */}
          <div className="md:col-span-2">
            {/* Title for the right column blocks */}
            <div className="flex items-center mb-3">
              <h2 className="text-2xl font-semibold">Company Pillars</h2>
            </div>

            {/* Vision Block */}
            <div className={`border border-gray-700 p-3 rounded-lg mb-3 transition-colors hover:bg-gray-900 border-l-4 ${getProjectBorderColor(pillarColors.vision).replace('border-t-', 'border-l-')}`}>
              <div className="flex items-center space-x-2 mb-1">
                <Triangle color={pillarColors.vision} />
                <h3 className="text-base font-semibold">Vision</h3>
              </div>
              <p className="text-xs text-gray-400">{company.vision}</p>
            </div>

            {/* Mission Block */}
            <div className={`border border-gray-700 p-3 rounded-lg mb-3 transition-colors hover:bg-gray-900 border-l-4 ${getProjectBorderColor(pillarColors.mission).replace('border-t-', 'border-l-')}`}>
              <div className="flex items-center space-x-2 mb-1">
                <Triangle color={pillarColors.mission} />
                <h3 className="text-base font-semibold">Mission</h3>
              </div>
              <p className="text-xs text-gray-400">{company.mission}</p>
            </div>

            {/* Principles Block */}
            <div className={`border border-gray-700 p-3 rounded-lg mb-3 transition-colors hover:bg-gray-900 border-l-4 ${getProjectBorderColor(pillarColors.principles).replace('border-t-', 'border-l-')}`}>
              <div className="flex items-center space-x-2 mb-1">
                <Triangle color={pillarColors.principles} />
                <h3 className="text-base font-semibold">Principles</h3>
              </div>
              <ul className="list-disc list-inside pl-2 space-y-1 text-xs text-gray-400">
                {company.principles.map((principle, index) => (
                  <li key={index}>{principle}</li>
                ))}
              </ul>
            </div>

            {/* Values Block */}
            <div className={`border border-gray-700 p-3 rounded-lg mb-3 transition-colors hover:bg-gray-900 border-l-4 ${getProjectBorderColor(pillarColors.values).replace('border-t-', 'border-l-')}`}>
              <div className="flex items-center space-x-2 mb-1">
                <Triangle color={pillarColors.values} />
                <h3 className="text-base font-semibold">Values</h3>
              </div>
              <ul className="list-disc list-inside pl-2 space-y-1 text-xs text-gray-400">
                {company.values.map((value, index) => (
                  <li key={index}>{value}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-md w-full">
            <form onSubmit={handleAddTask} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Add New Task</h3>
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    required
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {Object.keys(departmentColors).map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Task Description</label>
                  <textarea
                    required
                    value={newTask.text}
                    onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Role (Optional)</label>
                  <input
                    type="text"
                    value={newTask.forRole}
                    onChange={(e) => setNewTask({ ...newTask, forRole: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Frontend Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Reward Amount</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTask.reward.details.amount}
                      onChange={(e) => setNewTask({
                        ...newTask,
                        reward: {
                          ...newTask.reward,
                          details: { ...newTask.reward.details, amount: e.target.value }
                        }
                      })}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Amount"
                    />
                    <select
                      value={newTask.reward.details.currency}
                      onChange={(e) => setNewTask({
                        ...newTask,
                        reward: {
                          ...newTask.reward,
                          details: { ...newTask.reward.details, currency: e.target.value }
                        }
                      })}
                      className="w-24 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="Points">Points</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Reward Description (Optional)</label>
                  <input
                    type="text"
                    value={newTask.reward.details.description}
                    onChange={(e) => setNewTask({
                      ...newTask,
                      reward: {
                        ...newTask.reward,
                        details: { ...newTask.reward.details, description: e.target.value }
                      }
                    })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Per hour, Fixed price, etc."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-gray-700"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Task Modal */}
      {showDeleteTaskModal && selectedTaskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Delete Task</h3>
                <button
                  onClick={() => setShowDeleteTaskModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              
              <div className="bg-gray-800/50 p-3 rounded-md mb-6">
                <p className="text-gray-300">{selectedTaskToDelete.text}</p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteTaskModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-gray-700"
                >
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {showEditCompanyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleEditCompany} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Edit Company</h3>
                <button
                  type="button"
                  onClick={() => setShowEditCompanyModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Company Logo</label>
                    <div className="w-32 h-32">
                      <ImageUpload
                        currentImageUrl={editCompanyData.image}
                        onImageUpload={handleImageUpload}
                        className="w-full h-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={editCompanyData.name}
                      onChange={(e) => setEditCompanyData({ ...editCompanyData, name: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                    <input
                      type="text"
                      value={editCompanyData.role}
                      onChange={(e) => setEditCompanyData({ ...editCompanyData, role: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={editCompanyData.location}
                      onChange={(e) => setEditCompanyData({ ...editCompanyData, location: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Website</label>
                    <input
                      type="text"
                      value={editCompanyData.socialLinks.website}
                      onChange={(e) => setEditCompanyData({
                        ...editCompanyData,
                        socialLinks: { ...editCompanyData.socialLinks, website: e.target.value }
                      })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Company Pillars */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Vision</label>
                    <textarea
                      value={editCompanyData.vision}
                      onChange={(e) => setEditCompanyData({ ...editCompanyData, vision: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Mission</label>
                    <textarea
                      value={editCompanyData.mission}
                      onChange={(e) => setEditCompanyData({ ...editCompanyData, mission: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Principles</label>
                    {editCompanyData.principles.map((principle, index) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          value={principle}
                          onChange={(e) => {
                            const newPrinciples = [...editCompanyData.principles];
                            newPrinciples[index] = e.target.value;
                            setEditCompanyData({ ...editCompanyData, principles: newPrinciples });
                          }}
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newPrinciples = editCompanyData.principles.filter((_, i) => i !== index);
                            setEditCompanyData({ ...editCompanyData, principles: newPrinciples });
                          }}
                          className="ml-2 p-2 text-gray-400 hover:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setEditCompanyData({
                        ...editCompanyData,
                        principles: [...editCompanyData.principles, '']
                      })}
                      className="mt-2 text-sm text-blue-500 hover:text-blue-400"
                    >
                      + Add Principle
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Values</label>
                    {editCompanyData.values.map((value, index) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => {
                            const newValues = [...editCompanyData.values];
                            newValues[index] = e.target.value;
                            setEditCompanyData({ ...editCompanyData, values: newValues });
                          }}
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newValues = editCompanyData.values.filter((_, i) => i !== index);
                            setEditCompanyData({ ...editCompanyData, values: newValues });
                          }}
                          className="ml-2 p-2 text-gray-400 hover:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setEditCompanyData({
                        ...editCompanyData,
                        values: [...editCompanyData.values, '']
                      })}
                      className="mt-2 text-sm text-blue-500 hover:text-blue-400"
                    >
                      + Add Value
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditCompanyModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-gray-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyProfilePage