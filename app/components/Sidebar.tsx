'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HomeIcon, ReaderIcon, MagnifyingGlassIcon, PersonIcon } from '@radix-ui/react-icons'
import { UserButton } from '@clerk/nextjs'

const Sidebar = () => {
  return (
    <div className="w-[200px] border-r border-gray-200 flex flex-col justify-between p-6">
      <div>
        <div className="mb-10">
          <Image src="/space.svg" alt="Logo" width={65} height={65} />
        </div>
        
        <nav className="space-y-6 text-sm font-medium text-black">
          <Link href="/" className="block hover:bg-gray-100 p-2 rounded-md">Home</Link>
          <Link href="/explore" className="block hover:bg-gray-100 p-2 rounded-md">Explore</Link>
          <Link href="/messages" className="block hover:bg-gray-100 p-2 rounded-md">Messages</Link>
          <Link href="/communities" className="block hover:bg-gray-100 p-2 rounded-md">Communities</Link>
          <Link href="/profilev2" className="block hover:bg-gray-100 p-2 rounded-md">Profile</Link>
        </nav>
      </div>
      
      <div className="mt-auto flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  rootBox: "flex items-center",
                  userButtonTrigger: "focus:shadow-none focus:outline-none"
                }
              }}
            />
          </div>
          
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <div className="h-5 w-5 relative flex flex-col justify-center items-center gap-1">
              <div className="h-0.5 w-full bg-gray-500"></div>
              <div className="h-0.5 w-full bg-gray-500"></div>
              <div className="h-0.5 w-full bg-gray-500"></div>
            </div>
          </button>
        </div>
        
        <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
          <p>© 2023 Space App</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar