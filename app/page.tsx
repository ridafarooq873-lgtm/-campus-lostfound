"use client"
import { useState, useEffect } from "react"
import Image from "next/image"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500) // 2.5 seconds
    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <Image 
          src="/logo.png" 
          alt="Campus Lost Found Logo" 
          width={200} 
          height={200}
          priority
          className="animate-pulse"
        />
      </div>
    )
  }

  return (
    // YOUR EXISTING APP CODE GOES HERE
    // The part with "Campus Lost & Found" and the 2 buttons
  )
}
