'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Geist_Mono } from './fonts'
import AnimatedButton from './AnimatedButton'
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-black border-b border-foreground/10 py-4 sticky top-0 z-50 backdrop-blur-sm ">
      <div className=" md:mx-8 lg:mx-0 flex justify-between items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="/alk-city.svg" 
            alt="Alk City Logo" 
            width={100} 
            height={100} 
            className="h-12 w-12 md:h-15 md:w-20"
            priority
          />
          <span className="text-2xl md:text-3xl font-semibold">SagaCity</span>
        </Link>
        
        <div className={`hidden md:flex items-center space-x-8 ${Geist_Mono.className}`}>

          <Link href="/board" className="text-foreground/80 hover:text-foreground transition-colors">
            Board
          </Link>
          <Link href="/teams" className="text-foreground/80 hover:text-foreground transition-colors">
            Teams
          </Link>
          <Link href="/members" className="text-foreground/80 hover:text-foreground transition-colors">
            Members
          </Link>
          <Link href="/profile" className="text-foreground/80 hover:text-foreground transition-colors">
            Profile
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
            <div className="hidden md:block">
            <Link href="/sign-up">
            <button className="bg-white text-xl text-black px-6 py-3 ">
              Sign Up
            </button>
            </Link>
            </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-foreground"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-foreground/10 py-4 px-4 shadow-lg animate-slideDown">
          <div className="flex flex-col space-y-4 ${Geist_Mono.className}">
            <Link 
              href="/" 
              className="text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/builds" 
              className="text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Builds
            </Link>
            <Link 
              href="/members" 
              className="text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Members
            </Link>
            <Link 
              href="/contact" 
              className="text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <AnimatedButton size="medium" color="white" text="Enter Sagacity"/>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar