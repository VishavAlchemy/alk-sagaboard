'use client'
import React from 'react'
import Image from 'next/image'
// Assuming Sidebar might be needed later or can be removed if not part of the new design
// import Sidebar from '../components/Sidebar' 

// Data for the profile sections (without Projects, as we'll display it separately)
const profileSections = [
  {
    title: "Experience",
    content: (
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <svg width="12" height="12" viewBox="0 0 10 10" className="flex-shrink-0 mt-1 fill-orange-500">
             <polygon points="5,1 9,9 1,9" />
          </svg>
          <p>Founder: Built eCom brands to 5250+ customers, coached eCom builders.</p>
        </div>
        <div className="flex items-start space-x-2">
          <svg width="12" height="12" viewBox="0 0 10 10" className="flex-shrink-0 mt-1 fill-blue-500">
             <polygon points="5,1 9,9 1,9" />
          </svg>
          <p>Marketer: Ran advertisements for 12+ digital brands 6-7 figures in revenue (Popeyes, Nomnom, etc).</p>
        </div>
        <div className="flex items-start space-x-2">
          <svg width="12" height="12" viewBox="0 0 10 10" className="flex-shrink-0 mt-1 fill-green-500">
             <polygon points="5,1 9,9 1,9" />
          </svg>
          <p>Programmer: Built 10+ webapps & learning to code for last 5 months - To help with focus, meditation, learning.</p>
        </div>
        <div className="flex items-start space-x-2">
          <svg width="12" height="12" viewBox="0 0 10 10" className="flex-shrink-0 mt-1 fill-purple-500">
             <polygon points="5,1 9,9 1,9" />
          </svg>
          <p>Purpose: Exploringn the world of learning, mind & meditation for the last 10 years. Coached 10+ creators on their journey.</p>
        </div>
      </div>
    ),
  },
];

// Separate Skills and About Me for the two-column layout
const skillsSection = {
  title: "Skills",
  content: (
    <>
      <p>Key skills learned:</p>
      <ul className="list-disc list-inside pl-2">
        <li>Fullstack Development (NextJS, Tailwind, Shadcn, etc)</li>
        <li>Design (Figma, Canva - 50+ projects)</li>
        <li>Digiatl Advertising (Google, Facebook, Instagram, etc)</li>
        <li>Purpose Coaching + Community Builder</li>
        <li>Mentorships (7+ figure founders) </li>
        <li>eCom Content Creation</li>
      </ul>
    </>
  ),
};

const aboutMeSection = {
  title: "About Me",
  content: (
    <div className="space-y-2">
      <p>I've been programming for the past 6 months.</p>
      <p>Favorite books:</p>
      <ul className="list-disc list-inside pl-4">
        <li>Alchemist</li>
        <li>Good to Great</li>
        <li>Surrender Experiment</li>
        <li>Jonathan Livingston Seagull</li>
      </ul>
    </div>
  ),
};

// Projects Data (separated)
const projectsData = [
  /* Project Card 1: AW */
  <div key="aw" className="border border-gray-700 p-3 rounded-lg mb-3 transition-colors hover:bg-gray-900 border-t-2 border-t-orange-500 min-h-[8rem]">
    <h3 className="text-base font-semibold mb-1">AW - eCom Animewear Streewear</h3>
    <p className="text-xs text-gray-400 mb-1">- Built from zero to $50kMRR with Tiktok & Meta Ads</p>
    <p className="text-xs text-gray-500 text-right">February 2022 - February 2024</p>
  </div>,

  /* Project Card 2: Alchemy */
  <div key="alchemy" className="border border-gray-700 p-3 rounded-lg mb-3 transition-colors hover:bg-gray-900 border-t-2 border-t-blue-500 min-h-[8rem]">
    <h3 className="text-base font-semibold mb-1">Alchemy - Community Creative Hub</h3>
    <p className="text-xs text-gray-400 mb-1">- Hosted workshops & creative space</p>
    <p className="text-xs text-gray-400 mb-1">- 300 leads & dozens of members</p>
    <p className="text-xs text-gray-500 text-right">April 2024 - September 2024</p>
  </div>,

  /* Project Card 3: NextJS Building */
  <div key="nextjs" className="border border-gray-700 p-3 rounded-lg mb-3 transition-colors hover:bg-gray-900 border-t-2 border-t-green-500 min-h-[8rem]">
    <h3 className="text-base font-semibold mb-1">NextJS Building</h3>
    <p className="text-xs text-gray-400">- Built 5+ Full Stack Apps (focus, learning & social apps)</p>
    <p className="text-xs text-gray-400">- Self-Taught HTML, CSS, JS, React, NextJS, React Native</p>
    <p className="text-xs text-gray-400 mb-1">- Built 3 IOS App with Expo</p>
    <p className="text-xs text-gray-500 text-right">September 2024 - Present</p>
  </div>,

  /* Project Card 4: Vecommerce & J7 */
  <div key="vecom" className="border border-gray-700 p-3 rounded-lg mb-3 transition-colors hover:bg-gray-900 border-t-2 border-t-purple-500 min-h-[8rem]">
    <h3 className="text-base font-semibold mb-1">Vecom & J7</h3>
    <p className="text-xs text-gray-400 mb-1">- DTC Brand Agency, helped 12+ brands with their advertising @Meta, @Tiktok & Google (Nomnom, Popeyes, MXK & more...)</p>
  </div>
];

const ProfilePage = () => {
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
                  src="/profilev1/pp.svg" 
                  alt="Vishav Profile Picture" 
                  width={110}
                  height={110}
                  className="rounded-full border-2 border-gray-700" 
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-1">Vishav</h1>
                <p className="text-gray-400">Brand Builder @SagaCity</p>
                <p className="text-gray-400 mb-3">Laval QC</p>
                <div className="flex items-center space-x-2">
                  <button className="bg-white text-black hover:bg-gray-200 px-5 py-1.5 rounded text-sm">
                    Message
                  </button>
                  <a href="https://website.com" target="_blank" rel="noopener noreferrer" className="bg-transparent hover:bg-gray-800 p-2 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-white">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </a>
                  <a href="https://github.com/username" target="_blank" rel="noopener noreferrer" className="bg-transparent hover:bg-gray-800 p-2 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-white">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </a>
                  <a href="https://twitter.com/username" target="_blank" rel="noopener noreferrer" className="bg-transparent hover:bg-gray-800 p-2 rounded-full transition-colors">
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
                {profileSections[0].content}
              </div>
            </div>
            
            {/* About Me and Skills in Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              {/* About Me Column */}
              <div>
              <h2 className="text-2xl font-semibold">About Me</h2>
                <div className="bg-black rounded-lg p-4 text-sm text-gray-300 h-full">
                  {aboutMeSection.content}
                </div>
              </div>
              
              {/* Skills Column */}
              <div>
              <h2 className="text-2xl font-semibold">Skills</h2>
                <div className="bg-black rounded-lg p-4 text-sm text-gray-300 h-full">
                  {skillsSection.content}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column (2/5 width) */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-3">
              {/* Projects Title */}
              <h2 className="text-2xl font-semibold">Projects</h2>
              
              {/* Triangle Logo as a small icon next to the title */}
             
            </div>
            
            {/* Projects Section - Full height */}
            <div className="bg-black rounded-lg p-4 text-sm text-gray-300">
              {projectsData}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage