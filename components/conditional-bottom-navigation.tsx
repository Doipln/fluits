"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { InfluencerBottomNavigation } from "./influencer-bottom-navigation"
import { AdvertiserBottomNavigation } from "./advertiser-bottom-navigation"

export function ConditionalBottomNavigation() {
  const pathname = usePathname()
  const [isInfluencerMode, setIsInfluencerMode] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const influencerMode = localStorage.getItem("influencer_mode") === "true"
    const loggedIn = localStorage.getItem("is_logged_in") === "true"
    setIsInfluencerMode(influencerMode)
    setIsLoggedIn(loggedIn)
  }, [pathname])

  const isCampaignDetailPage = /^\/campaigns\/\d+$/.test(pathname)
  const isInfluencerDetailPage = /^\/influencers\/\d+$/.test(pathname)
  const isChatDetailPage = /^\/chat\/\d+$/.test(pathname)
  const isLandingPage = pathname === "/"
  const isSignupPage = pathname.startsWith("/signup/")
  const isLoginPage = pathname === "/login"
  const isProfileEditPage = pathname === "/profile/edit"
  const isCampaignCreatePage = pathname === "/campaigns/create"
  const isCampaignCreateAIPage = pathname === "/campaigns/create-ai"
  const isCampaignEditPage = /^\/campaigns\/\d+\/edit$/.test(pathname)
  const isProposalCreatePage = pathname === "/influencer/proposal/create"
  const isTrendingCampaignsPage =
    pathname === "/advertiser/trending-campaigns" || pathname === "/influencer/trending-campaigns"
  const isHotInfluencersPage =
    pathname === "/advertiser/trending-influencers" || pathname === "/influencer/trending-influencers"
  const isNotificationsPage = pathname === "/notifications"
  const isApplicantsPage = /^\/campaigns\/\d+\/applicants$/.test(pathname)
  const isInfluencerApplicationsPage = pathname === "/influencer/applications"
  const isVerificationPage = pathname === "/profile/verification"

  const shouldShow =
    isLoggedIn &&
    !isCampaignDetailPage &&
    !isInfluencerDetailPage &&
    !isChatDetailPage &&
    !isLandingPage &&
    !isSignupPage &&
    !isLoginPage &&
    !isProfileEditPage &&
    !isCampaignCreatePage &&
    !isCampaignCreateAIPage &&
    !isCampaignEditPage &&
    !isProposalCreatePage &&
    !isTrendingCampaignsPage &&
    !isHotInfluencersPage &&
    !isNotificationsPage &&
    !isApplicantsPage &&
    !isInfluencerApplicationsPage &&
    !isVerificationPage

  if (!shouldShow) {
    return null
  }

  return isInfluencerMode ? <InfluencerBottomNavigation /> : <AdvertiserBottomNavigation />
}
