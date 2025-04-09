'use client'
import React from 'react'
import Image from 'next/image'
// Assuming Sidebar might be needed later or can be removed if not part of the new design
// import Sidebar from '../components/Sidebar' 

// Company data object containing all profile information
const companyData = {
  companyInfo: {
    name: "SagaCity",
    role: "Building Infrastructure for the New Internet",
    location: "Laval QC",
    image: "/alk-city.svg",
    socialLinks: {
      website: "https://alk-city.vercel.app",
    }
  },
  vision: "To create a digital ecosystem that enables digital collaboration & creativity.",
  mission: "To build the next generation of digital brands & products.",
  principles: [
    "We are lifelong learners",
    "Together we can achieve more than any individual can alone",
    "We empower individuals to create & innovate",
    "We are a community of creators"
  ],
  values: [
    "Creativity",
    "Productivity",
    "Collaboration",
    "Innovation"
  ],
  tasks: {
    Finances: [
      { id: "f1", text: "Develop Q4 budget proposal" },
      { id: "f2", text: "Analyze monthly recurring revenue" },
    ],
    Marketing: [
      { id: "m1", text: "Launch new social media campaign" },
      { id: "m2", text: "Create content calendar for blog" },
    ],
    Design: [
      { id: "d1", text: "Redesign user dashboard UI" },
      { id: "d2", text: "Develop style guide for branding" },
    ],
    Building: [
      { id: "b1", text: "Implement new authentication service" },
      { id: "b2", text: "Refactor database schema" },
      { id: "b3", text: "Deploy staging environment updates" },
    ],
    Research: [
      { id: "r1", text: "Investigate competitor API offerings" },
      { id: "r2", text: "Survey users on feature requests" },
    ],
    Product: [
      { id: "p1", text: "Define roadmap for next quarter" },
      { id: "p2", text: "Write specifications for feature X" },
    ],
    HR: [
      { id: "hr1", text: "Onboard new software engineer" },
      { id: "hr2", text: "Organize team-building event" },
    ],
    "Project Management": [
      { id: "pm1", text: "Update project timelines" },
      { id: "pm2", text: "Facilitate sprint planning meeting" },
    ],
    Others: [
      { id: "o1", text: "Coordinate with legal on compliance" },
    ]
  },
  departmentColors: {
    Finances: "emerald",
    Marketing: "blue",
    Design: "purple",
    Building: "orange",
    Research: "cyan",
    Product: "indigo",
    HR: "pink",
    "Project Management": "amber",
    Others: "gray"
  },
  pillarColors: {
    vision: "orange",
    mission: "blue",
    principles: "purple",
    values: "emerald"
  }
};

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

const CompanyProfilePage = () => {
  // Function to handle task click (placeholder)
  const handleTaskClick = (taskId: string, department: string) => {
    console.log(`Clicked task ${taskId} in department ${department}`);
    // Add navigation or state update logic here
  };

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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4"> {/* Reverted gap */}

          {/* Left Column (3/5 width) */}
          <div className="md:col-span-3">
            {/* Company Info */}
            <div className="flex items-start space-x-4 mb-6"> {/* Added mb-6 back */} 
              <div className="flex-shrink-0">
                <Image
                  src={companyData.companyInfo.image}
                  alt={`${companyData.companyInfo.name} Logo`}
                  width={110}
                  height={110}
                  className="rounded-full border-2 border-gray-700"
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-1">{companyData.companyInfo.name}</h1>
                <p className="text-gray-400">{companyData.companyInfo.role}</p>
                <p className="text-gray-400 mb-3">{companyData.companyInfo.location}</p>
                <div className="flex items-center space-x-2">
                  {/* Removed Message button for now, can be added back */}
                  {companyData.companyInfo.socialLinks.website && (
                     <a href={companyData.companyInfo.socialLinks.website} target="_blank" rel="noopener noreferrer" className="bg-transparent hover:bg-gray-800 p-2 rounded-full transition-colors">
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
            <div className="mb-6"> {/* Added mb-6 */} 
              <h2 className="text-2xl font-semibold mb-3">Tasks by Department</h2>
              <div className="space-y-4">
                {Object.entries(companyData.tasks).map(([department, tasks]) => (
                  <div key={department} className="mb-4"> {/* Added mb-4 */} 
                    <div className="flex items-center space-x-2 mb-1"> {/* Reduced mb */} 
                      <Triangle 
                        color={companyData.departmentColors[department as keyof typeof companyData.departmentColors]} 
                        direction="right"
                      />
                      <h3 className="text-lg font-medium text-gray-300">{department}</h3>
                    </div>
                    {/* Removed background div */}
                    <div className="pl-5 text-sm text-gray-300 space-y-1"> {/* Added padding-left and reduced space-y */}
                      {tasks.map((task) => (
                        // Simple paragraph for tasks, add onClick/styling if needed
                        <p key={task.id} className="cursor-pointer hover:text-white" onClick={() => handleTaskClick(task.id, department)}>
                          - {task.text}
                        </p>
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
            <div className={`border border-gray-700 p-3 rounded-lg mb-3 transition-colors hover:bg-gray-900 border-l-4 ${getProjectBorderColor(companyData.pillarColors.vision).replace('border-t-', 'border-l-')}`}>
              <div className="flex items-center space-x-2 mb-1">
                <Triangle color={companyData.pillarColors.vision} />
                <h3 className="text-base font-semibold">Vision</h3>
              </div>
              <p className="text-xs text-gray-400">{companyData.vision}</p>
            </div>

            {/* Mission Block */}
            <div className={`border border-gray-700 p-3 rounded-lg mb-3 transition-colors hover:bg-gray-900 border-l-4 ${getProjectBorderColor(companyData.pillarColors.mission).replace('border-t-', 'border-l-')}`}>
              <div className="flex items-center space-x-2 mb-1">
                <Triangle color={companyData.pillarColors.mission} />
                <h3 className="text-base font-semibold">Mission</h3>
              </div>
              <p className="text-xs text-gray-400">{companyData.mission}</p>
            </div>

            {/* Principles Block */}
            <div className={`border border-gray-700 p-3 rounded-lg mb-3 transition-colors hover:bg-gray-900 border-l-4 ${getProjectBorderColor(companyData.pillarColors.principles).replace('border-t-', 'border-l-')}`}>
              <div className="flex items-center space-x-2 mb-1">
                <Triangle color={companyData.pillarColors.principles} />
                <h3 className="text-base font-semibold">Principles</h3>
              </div>
              <ul className="list-disc list-inside pl-2 space-y-1 text-xs text-gray-400"> {/* Adjusted list style/padding */} 
                {companyData.principles.map((principle, index) => (
                  <li key={index}>{principle}</li>
                ))}
              </ul>
            </div>

            {/* Values Block */}
            <div className={`border border-gray-700 p-3 rounded-lg mb-3 transition-colors hover:bg-gray-900 border-l-4 ${getProjectBorderColor(companyData.pillarColors.values).replace('border-t-', 'border-l-')}`}>
              <div className="flex items-center space-x-2 mb-1">
                <Triangle color={companyData.pillarColors.values} />
                <h3 className="text-base font-semibold">Values</h3>
              </div>
              <ul className="list-disc list-inside pl-2 space-y-1 text-xs text-gray-400"> {/* Adjusted list style/padding */} 
                {companyData.values.map((value, index) => (
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