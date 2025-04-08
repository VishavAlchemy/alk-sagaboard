import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Sidebar from '../components/Sidebar'
import CommunityCalendar from '../components/Calendar'

const Page = () => {
  return (
    <div className="flex bg-white min-h-screen">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 p-6 w-full text-black">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Community Calendar</h1>
          <div className="text-sm text-gray-500">
            Plan and organize community events
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-[800px]">
          <CommunityCalendar />
        </div>
      </div>
    </div>
  )
}

export default Page