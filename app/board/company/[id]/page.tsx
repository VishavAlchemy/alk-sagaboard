'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
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

const CompanyProfilePage = () => {
  const params = useParams();
  const companyId = params.id as Id<"companies">;

  // Fetch company data
  const company = useQuery(api.companies.getCompany, { companyId });
  
  // Fetch tasks data
  const tasks = useQuery(api.companies.getTasks, { companyId });

  // Loading state
  if (!company || !tasks) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  // Organize tasks by category
  const tasksByCategory = tasks.reduce((acc: { [key: string]: any[] }, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push({
      id: task._id,
      text: task.text,
      reward: task.reward,
      additionalInfo: task.additionalInfo,
      status: task.status
    });
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

  return (
    <div className="flex flex-col bg-black min-h-screen text-white py-6">
      <div className="px-4 md:px-6 w-full max-w-7xl mx-auto">
        {/* Main Content Grid with Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* Left Column (3/5 width) */}
          <div className="md:col-span-3">
            {/* Company Info */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0">
                <Image
                  src={company.image}
                  alt={`${company.name} Logo`}
                  width={110}
                  height={110}
                  className="rounded-full border-2 border-gray-700"
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-1">{company.name}</h1>
                <p className="text-gray-400">{company.role}</p>
                <p className="text-gray-400 mb-3">{company.location}</p>
                <div className="flex items-center space-x-2">
                  {/* Removed Message button for now, can be added back */}
                  {company.socialLinks?.website && (
                     <a href={company.socialLinks.website} target="_blank" rel="noopener noreferrer" className="bg-transparent hover:bg-gray-800 p-2 rounded-full transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-white">
                         <circle cx="12" cy="12" r="10"></circle>
                         <line x1="2" y1="12" x2="22" y2="12"></line>
                         <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                       </svg>
                     </a>
                  )}
                  {/* Removed GitHub and Twitter Icons */}
                </div>
              </div>
            </div>

            {/* Tasks Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-3">Tasks by Department</h2>
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
                        <Link 
                          href={`/board/company/task/${task.id}`}
                          key={task.id} 
                          className="block cursor-pointer hover:text-white hover:bg-gray-800/30 p-2 rounded-md transition-colors"
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
    </div>
  )
}

export default CompanyProfilePage