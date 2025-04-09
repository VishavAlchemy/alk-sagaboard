'use client'
import React, { useState } from 'react'
import Image from 'next/image'

// Reuse the color helper function from company page
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

// Mock data for the task - in real app, this would come from props or API
const taskData = {
  id: "b1",
  name: "Implement new authentication service",
  department: "Building",
  departmentColor: "orange", // Matching the color from company page
  forRole: "Frontend Developers",
  reward: {
    type: "Fixed Price",  // Can be: "Fixed Price", "Cryptocurrency", "Goodwill", "Equity"
    details: {
      amount: "200",
      currency: "USD",
      description: "Plus gas fees covered"
    }
  },
  description: "Set up and implement a new authentication service to improve security and user management.",
  explanation: "Our current auth system needs upgrading to handle increased user load and provide better security features. This task involves researching, implementing, and testing the new auth service.",
  company: {
    name: "SagaCity",
    image: "/alk-city.svg"
  },
  checklist: [
    { id: 1, text: "Research auth service options", completed: false },
    { id: 2, text: "Create technical specification", completed: false },
    { id: 3, text: "Set up development environment", completed: false },
    { id: 4, text: "Implement basic auth flow", completed: false },
    { id: 5, text: "Add social login providers", completed: false },
    { id: 6, text: "Write tests", completed: false },
    { id: 7, text: "Document the implementation", completed: false },
  ]
};

const TaskPage = () => {
  const [checklist, setChecklist] = useState(taskData.checklist);
  const [submission, setSubmission] = useState('');

  const handleCheckItem = (itemId: number) => {
    setChecklist(checklist.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting task with notes:', submission);
    // Add your submission logic here
  };

  // Triangle SVG component reused from company page
  const Triangle = ({ color, className = "", direction = "right" }: { color: string, className?: string, direction?: "right" | "down" }) => {
    const points = direction === "right" ? "0,0 10,5 0,10" : "0,0 10,0 5,10";
    return (
      <svg width="12" height="12" viewBox="0 0 10 10" className={`flex-shrink-0 ${getIconColor(color)} ${className}`}>
        <polygon points={points} />
      </svg>
    );
  };

  // Helper function to render reward icon based on type
  const RewardIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "Fixed Price":
        return (
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
        );
      case "Cryptocurrency":
        return (
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5.93V6a1 1 0 112 0v4.07a2 2 0 11-2 0z" />
          </svg>
        );
      case "Goodwill":
        return (
          <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        );
      case "Equity":
        return (
          <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Helper function to format reward text
  const formatReward = (reward: typeof taskData.reward) => {
    switch (reward.type) {
      case "Fixed Price":
      case "Cryptocurrency":
        return (
          <>
            <p className={`font-semibold ${reward.type === "Cryptocurrency" ? "text-blue-500" : "text-yellow-500"}`}>
              {reward.details.amount} {reward.details.currency}
            </p>
            {reward.details.description && (
              <span className="text-xs text-gray-500 ml-1">({reward.details.description})</span>
            )}
          </>
        );
      case "Goodwill":
        return (
          <p className="font-semibold text-pink-500">Community Contribution</p>
        );
      case "Equity":
        return (
          <p className="font-semibold text-emerald-500">Partnership Opportunity</p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col bg-black min-h-screen text-white py-6">
      <div className="px-4 md:px-6 w-full max-w-7xl mx-auto">
        {/* Main Content Grid with Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Left Column (3/5 width) */}
          <div className="md:col-span-3">
            {/* Task Header */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{taskData.name}</h1>
              
              {/* Company Info */}
              <div className="flex items-center space-x-3 mb-4 py-4">
                <div className="flex-shrink-0">
                  <Image
                    src={taskData.company.image}
                    alt={taskData.company.name}
                    width={40}
                    height={40}
                    className="rounded-full border border-gray-700"
                  />
                </div>
                <span className="text-sm text-gray-400">{taskData.company.name}</span>
              </div>

              {/* Task Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {/* Department */}
                <div className="flex items-center space-x-2 text-gray-400">
                  <Triangle color={taskData.departmentColor} />
                  <p>{taskData.department}</p>
                </div>

                {/* Role */}
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                  <p className="text-gray-400">For {taskData.forRole}</p>
                </div>

                {/* Reward - Updated Section */}
                <div className="flex items-center space-x-2 ml-auto">
                  <RewardIcon type={taskData.reward.type} />
                  {formatReward(taskData.reward)}
                </div>
              </div>
            </div>

            {/* Task Description */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-3">Description</h2>
              <p className="text-gray-300">{taskData.description}</p>
            </div>

            {/* Task Explanation */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-3">Explanation</h2>
              <p className="text-gray-300">{taskData.explanation}</p>
            </div>

            {/* Task Submission */}
            <div className="bg-black border border-gray-700 rounded-lg p-4">
              <h2 className="text-2xl font-semibold mb-3">Submit Task</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <textarea
                    value={submission}
                    onChange={(e) => setSubmission(e.target.value)}
                    placeholder="Add your notes, links, or comments about the task completion..."
                    className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-black hover:bg-gray-900 text-white px-6 py-2 rounded-lg transition-colors border border-gray-700 hover:border-gray-600"
                  >
                    Submit Task
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column (2/5 width) */}
          <div className="md:col-span-2">
            {/* Checklist - Made to fill available space */}
            <div className="border border-gray-700 rounded-lg p-4 h-full flex flex-col">
              <h2 className="text-2xl font-semibold mb-4">Checklist</h2>
              <div className="flex-grow space-y-3 overflow-y-auto">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <button
                      onClick={() => handleCheckItem(item.id)}
                      className={`flex-shrink-0 w-5 h-5 mt-0.5 border rounded ${
                        item.completed 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-600'
                      }`}
                    >
                      {item.completed && (
                        <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  {checklist.filter(item => item.completed).length} of {checklist.length} completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskPage