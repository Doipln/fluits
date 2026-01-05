"use client"

import type React from "react"

import { useEffect, useState } from "react"

export default function InitialLoadingScreen({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if this is the first load in this session
    const hasShownLoading = sessionStorage.getItem("hasShownInitialLoading")

    if (hasShownLoading) {
      // Already shown in this session, don't show again
      setIsLoading(false)
    } else {
      // First load in this session, show for 2 seconds then mark as shown
      const timer = setTimeout(() => {
        setIsLoading(false)
        sessionStorage.setItem("hasShownInitialLoading", "true")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#7b68ee] pointer-events-none z-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-wide">flu it</h1>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
