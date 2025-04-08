'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const page = () => {
    const [timer, setTimer] = useState(60 * 10)
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        if (isActive) {
            const interval = setInterval(() => {
                setTimer(timer - 1)
            }, 1000)
            return () => clearInterval(interval)

            if (timer === 0) {
                setIsActive(false)
                alert('Your meditation is over')
            }
        }
    }, [isActive, timer])

    const handleStart = () => {
        setIsActive(true)
    }

    return (
        <div className='flex flex-col bg-black items-center justify-center h-screen relative'>
            {/* Background Ball */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="ball"></div>
            </div>
            <div className='flex flex-col items-center justify-center z-10'> 
                <Image src="/alk-logo.svg" alt="Canada" width={50} height={50} />
                <h1 className='text-gray-700 text-xs font-bold'>
                    {new Date(timer * 1000).toISOString().substr(14, 5)}
                </h1>
                <button className='text-gray-700 text-xs' onClick={handleStart}>Start</button>
            </div>

            {/* Inline CSS for the ball animation */}
            <style jsx>{`
                .ball {
                    width: 1000px; /* Initial size */
                    height: 1000px; /* Initial size */
                    border-radius: 50%; /* Make it a circle */
                    border: 1px solid white;
                    animation: growShrink 8s infinite; /* Animation duration and infinite loop */
                }

                @keyframes growShrink {
                    0%, 100% {
                        transform: scale(0.2); /* Original size */
                    }
                    50% {
                        transform: scale(0.6); /* Grow to 120% */
                    }
                }
            `}</style>
        </div>
    )
}

export default page