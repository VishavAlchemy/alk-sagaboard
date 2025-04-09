'use client'
import Image from "next/image";
import Navbar from "./components/Navbar";
import { Geist_Mono } from "./components/fonts";
// import { circleData } from "./data/circleData";
// import { worldsData } from "./data/worldsData";
import AnimatedButton from "./components/AnimatedButton";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useAnimationControls } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkIfMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !scrollRef.current) return;
    
    const scrollWidth = scrollRef.current.scrollWidth;
    const clientWidth = scrollRef.current.clientWidth;
    const maxScroll = scrollWidth - clientWidth;
    
    const startAutoScroll = async () => {
      while (isMobile) {
        // Animate to end
        await controls.start({ 
          x: -maxScroll, 
          transition: { duration: 15, ease: "linear" }
        });
        
        // Animate back to start
        await controls.start({ 
          x: 0, 
          transition: { duration: 15, ease: "linear" }
        });
      }
    };
    
    startAutoScroll();
  }, [isMobile, controls]);

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <div className="relative bg-[#151515] overflow-hidden">
      <h4 className={`text-center text-md ${Geist_Mono.className} text-white/90 py-2`}>For Builders, Hackers, Designers, Marketers & Entrepreneurs</h4>
      </div>

      <div className="relative mx-4 md:mx-8 lg:mx-16 my-8 md:my-12 rounded-3xl overflow-hidden">
  
        
        <div className="relative z-10 py-14 md:py-24 px-4 md:px-8 bg-black/30 rounded-3xl">

        <div className="flex justify-center mb-8">
          <Image src="/alk-cities.svg" alt="SagaCity Logo" width={450} height={450} />
        </div>
          <h1 className="text-5xl md:text-6xl font-bold text-center text-white">Find Your Squad, Build & <br /> Scale Digital Infrastructure</h1>
          <p className={`text-xl md:text-2xl mt-4 ${Geist_Mono.className} text-center text-white/90`}>We help connect squads & digital builders into <br />  organizations & projects to build digital infrastructure</p>

        {/*   <div className="flex overflow-x-auto justify-start md:justify-center items-center gap-3 md:gap-5 mt-8 px-2 pb-2 no-scrollbar">
            {circleData.map((circle) => (
              <a key={circle.id} href={circle.href} className="flex-shrink-0">
                <div className="w-10 md:w-16 h-10 md:h-16 rounded-full bg-white/20 overflow-hidden flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Image 
                    src={circle.src} 
                    alt={circle.alt} 
                    width={64} 
                    height={64} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </a>
            ))}
          </div> */}

          <div className="flex flex-row justify-center mt-8 gap-8">
            <Link href="/board">
            <button className="bg-white text-2xl text-black px-6 py-4 ">
              Get to Work
            </button>
            </Link>
            <Link href="/project">
            <button className="bg-white text-2xl text-black px-6 py-4 ">
              Find Talent
            </button>
            </Link>
           

          </div>
          
       {/*    <div className="flex justify-center gap-4 mt-6">
            <AnimatedButton size="small" text="Explore" />
            <AnimatedButton size="medium" text="Learn More" />
          </div> */}
        </div>
        
      </div>

  

      {/* Worlds Section */}
    {/*   <div className="mx-4 md:mx-8 lg:mx-16 my-6 overflow-hidden">
        {isMobile ? (
          <motion.div 
            ref={scrollRef}
            animate={controls}
            className="flex gap-3 md:gap-5 pb-4 no-scrollbar"
          >
            {worldsData.map((world) => (
              <a key={world.id} className="block flex-shrink-0 group">
                <div className="bg-black/5 dark:bg-white/5 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-white/10 w-[180px] sm:w-[220px] md:w-[320px] h-[280px] sm:h-[340px] md:h-[400px]">
                  <div className="relative w-full h-full">
                    <Image 
                      src={world.src}
                      alt={world.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </a>
            ))}
          </motion.div>
        ) : (
          <div className="flex overflow-x-auto gap-3 md:gap-5 pb-4 snap-x snap-mandatory no-scrollbar">
            {worldsData.map((world) => (
              <a key={world.id} className="block flex-shrink-0 snap-center group">
                <div className="bg-black/5 dark:bg-white/5 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-white/10 w-[180px] sm:w-[220px] md:w-[320px] h-[280px] sm:h-[340px] md:h-[400px]">
                  <div className="relative w-full h-full">
                    <Image 
                      src={world.src}
                      alt={world.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div> */}
     {/*  <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer> */}
    </div>
  );
