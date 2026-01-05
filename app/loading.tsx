"use client"

import { useEffect, useState } from "react"

export default function Loading() {
  const [isVisible, setIsVisible] = useState(true)
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    const animateTimer = setTimeout(() => {
      setShouldAnimate(true)
    }, 100)

    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, 2000)

    return () => {
      clearTimeout(animateTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-[#7b68ee] pointer-events-none z-50 ${
        shouldAnimate ? "animate-out fade-out duration-500" : ""
      }`}
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white tracking-wide">flu it</h1>
      </div>
    </div>
  )
}
