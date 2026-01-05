"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TopHeader } from "@/components/top-header"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { useCampaigns } from "@/lib/campaign-store"
import { useApplicationStore } from "@/lib/application-store"
import { useChatStore } from "@/lib/chat-store"
import { checkAdvertiserProfileComplete, getAdvertiserProfileCompletion } from "@/lib/profile-utils"
import { CampaignCreationModal } from "@/components/campaign-creation-modal"
import {
  Check,
  Megaphone,
  Users,
  User,
  ChevronRight,
  Settings,
  HelpCircle,
  FileCheck,
  LogOut,
  TrendingUp,
  Briefcase,
  Edit,
  Trash2,
  Inbox,
  Clock,
} from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

const userData = {
  name: "밍밍 부인",
  avatar: "", // Removed default avatar image
  verified: true,
}

const mockApplications = [
  {
    id: 1,
    applicationStatus: "지원 완료",
    campaignStatus: "진행중",
    campaignStatusColor: "bg-[#7b68ee]",
    title: "서울 강남 뷰티 살롱 체험단 모집",
    advertiser: "뷰티살롱",
    appliedTime: "2시간 전",
    campaignId: 1, // Added campaignId
  },
  {
    id: 2,
    applicationStatus: "지원 완료",
    campaignStatus: "진행중",
    campaignStatusColor: "bg-[#7b68ee]",
    title: "홍대 카페 인플루언서 협업",
    advertiser: "카페오너",
    appliedTime: "1일 전",
    campaignId: 2, // Added campaignId
  },
  {
    id: 3,
    applicationStatus: "다음기회에",
    campaignStatus: "마감",
    campaignStatusColor: "bg-gray-500",
    title: "제주도 호텔 리뷰 이벤트",
    advertiser: "제주호텔",
    appliedTime: "2일 전",
    campaignId: 3, // Added campaignId
  },
  {
    id: 4,
    applicationStatus: "다음기회에",
    campaignStatus: "마감",
    campaignStatusColor: "bg-gray-500",
    title: "부산 맛집 탐방 프로젝트",
    advertiser: "맛집투어",
    appliedTime: "3일 전",
    campaignId: 4, // Added campaignId
  },
]

const statusOptions = [
  { value: "진행중", displayText: "진행중", color: "bg-[#7b68ee] text-white" },
  { value: "마감", displayText: "마감", color: "bg-gray-500 text-white" },
  { value: "비공개 글", displayText: "비공개 글", color: "bg-gray-400 text-white" },
]

const mockApplicantsData: Record<number, any[]> = {
  1: [
    {
      id: 1,
      name: "김뷰티",
      followers: "125K",
      avgLikes: 5.2,
      category: "뷰티·화장품",
      region: "서울",
      price: "50만원",
      avatar: "/korean-beauty-influencer.jpg",
      verified: true,
      trustScore: 4.8,
    },
    {
      id: 2,
      name: "박뷰티",
      followers: "89K",
      avgLikes: 4.5,
      category: "뷰티·화장품",
      region: "부산",
      price: "35만원",
      avatar: "/korean-beauty-influencer-2.jpg",
      verified: true,
      trustScore: 4.6,
    },
    {
      id: 3,
      name: "이뷰티",
      followers: "203K",
      avgLikes: 7.7,
      category: "뷰티·화장품",
      region: "서울",
      price: "80만원",
      avatar: "/korean-beauty-influencer-3.jpg",
      verified: false,
      trustScore: 4.3,
    },
  ],
  2: [
    {
      id: 4,
      name: "최민지",
      followers: "156K",
      avgLikes: 7.0,
      category: "라이프스타일",
      region: "서울",
      price: "60만원",
      avatar: "/korean-fashion-influencer-woman-stylish-outfit.jpg",
      verified: true,
      trustScore: 4.7,
    },
    {
      id: 5,
      name: "정수아",
      followers: "98K",
      avgLikes: 5.2,
      category: "음식·맛집",
      region: "경기",
      price: "45만원",
      avatar: "/korean-food-influencer-woman-cooking-restaurant-re.jpg",
      verified: true,
      trustScore: 4.9,
    },
  ],
  3: [
    {
      id: 6,
      name: "한서연",
      followers: "72K",
      avgLikes: 3.5,
      category: "패션",
      region: "인천",
      price: "40만원",
      avatar: "/korean-street-fashion-influencer-woman-vintage-sty.jpg",
      verified: false,
      trustScore: 4.4,
    },
  ],
  4: [
    {
      id: 7,
      name: "송하늘",
      followers: "134K",
      avgLikes: 5.2,
      category: "여행",
      region: "대구",
      price: "55만원",
      avatar: "/korean-beauty-influencer.jpg",
      verified: true,
      trustScore: 4.5,
    },
    {
      id: 8,
      name: "이지은",
      followers: "189K",
      avgLikes: 8.7,
      category: "여행",
      region: "제주",
      price: "70만원",
      avatar: "/korean-beauty-influencer-2.jpg",
      verified: true,
      trustScore: 4.8,
    },
  ],
  5: [
    {
      id: 9,
      name: "박지훈",
      followers: "215K",
      avgLikes: 8.8,
      category: "IT·테크",
      region: "서울",
      price: "85만원",
      avatar: "/korean-tech-influencer.jpg",
      verified: true,
      trustScore: 4.6,
    },
  ],
  6: [
    {
      id: 10,
      name: "김태희",
      followers: "167K",
      avgLikes: 8.3,
      category: "헬스·피트니스",
      region: "부산",
      price: "65만원",
      avatar: "/korean-fitness-influencer.jpg",
      verified: true,
      trustScore: 4.9,
    },
    {
      id: 11,
      name: "윤서진",
      followers: "143K",
      avgLikes: 6.3,
      category: "헬스·피트니스",
      region: "서울",
      price: "58만원",
      avatar: "/korean-beauty-influencer-3.jpg",
      verified: false,
      trustScore: 4.5,
    },
  ],
  7: [
    {
      id: 2,
      name: "박지민",
      followers: "52K",
      avgLikes: 2.1,
      category: "뷰티·화장품",
      region: "서울시 강남구",
      price: "50만원",
      avatar: "/korean-beauty-influencer-woman-makeup-skincare.jpg",
      verified: true,
      trustScore: 4.7,
    },
    {
      id: 6,
      name: "정민아",
      followers: "63K",
      avgLikes: 3.0,
      category: "뷰티·화장품",
      region: "서울시 압구정",
      price: "60만원",
      avatar: "/korean-beauty-guru-woman-cosmetics-review.jpg",
      verified: true,
      trustScore: 4.8,
    },
    {
      id: 8,
      name: "송하늘",
      followers: "72K",
      avgLikes: 3.1,
      category: "푸드·외식",
      region: "서울시 종로구",
      price: "65만원",
      avatar: "/korean-food-influencer-woman-cooking-restaurant-re.jpg",
      verified: true,
      trustScore: 4.6,
    },
  ],
}

const userDataInitial = {
  name: "밍밍 부인",
  avatar: "", // Removed default avatar image
  verified: true,
}

const initialInfluencerProfileData = {
  name: "",
  avatar: "",
  verified: true,
  category: "뷰티·화장품",
  followers: "125K",
  engagement: "4.2%",
  region: "서울시 강남구",
  trustScore: 4.8,
  hashtags: ["#뷰티", "#스킨케어", "#체험단"],
}

// Mock data for campaign details if needed for chat creation
const mockCampaigns = [
  {
    id: 1,
    title: "서울 강남 뷰티 살롱 체험단 모집",
    category: "뷰티·화장품",
    status: "진행중",
    reward: "50만원",
    thumbnail: "/placeholder.svg",
    applicants: 3,
    recruitCount: 5,
    visitType: "visit",
  },
  {
    id: 2,
    title: "홍대 카페 인플루언서 협업",
    category: "카페·음료",
    status: "진행중",
    reward: "35만원",
    thumbnail: "/placeholder.svg",
    applicants: 2,
    recruitCount: 3,
    visitType: "visit",
  },
  {
    id: 3,
    title: "제주도 호텔 리뷰 이벤트",
    category: "여행",
    status: "마감",
    reward: "80만원",
    thumbnail: "/placeholder.svg",
    applicants: 1,
    recruitCount: 2,
    visitType: "non-visit",
  },
  {
    id: 4,
    title: "부산 맛집 탐방 프로젝트",
    category: "맛집",
    status: "마감",
    reward: "55만원",
    thumbnail: "/placeholder.svg",
    applicants: 2,
    recruitCount: 4,
    visitType: "visit",
  },
]

export default function ProfilePage() {
  const router = useRouter()
  const { getUserCreatedCampaigns, updateCampaignStatus, deleteCampaign, getCampaignById, campaigns } = useCampaigns()
  const userCampaigns = getUserCreatedCampaigns()
  const { getApplications, removeApplication } = useApplicationStore()
  const applications = getApplications()
  const { getChatsForInfluencer, addChat, chats } = useChatStore()

  const [isInfluencerMode, setIsInfluencerMode] = useState(true)
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [influencerProfileCompletion, setInfluencerProfileCompletion] = useState(0)
  const [isInfluencerProfileComplete, setIsInfluencerProfileComplete] = useState(false)

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const [tempStatus, setTempStatus] = useState("")

  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false)

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState<number | null>(null)

  // Removed proposal modal state
  // const [isProposalModalOpen, setIsProposalModalOpen] = useState(false)
  const [proposalText, setProposalText] = useState("")

  // Removed proposal preview state
  // const [isProposalPreviewOpen, setIsProposalPreviewOpen] = useState(false)

  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false)
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null)
  // Added for applicant modal when campaign is selected
  const [selectedCampaignForApplicants, setSelectedCampaignForApplicants] = useState<number | null>(null)

  const [isPromotionAlertOpen, setIsPromotionAlertOpen] = useState(false)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null)

  const [userAvatar, setUserAvatar] = useState("") // Initialize with empty string instead of userData.avatar
  const [avatarPosition, setAvatarPosition] = useState({ x: 0, y: 0 })
  const [avatarScale, setAvatarScale] = useState(1.0)

  const [username, setUsername] = useState("")
  const [advertiserNickname, setAdvertiserNickname] = useState("")
  const [influencerNickname, setInfluencerNickname] = useState("")
  const [instagramVerificationStatus, setInstagramVerificationStatus] = useState<"idle" | "pending" | "verified">(
    "idle",
  )

  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false)

  const [isRequirePrivateStatusOpen, setIsRequirePrivateStatusOpen] = useState(false)
  const [pendingActionCampaignId, setPendingActionCampaignId] = useState<number | null>(null)
  const [pendingActionType, setPendingActionType] = useState<"edit" | "delete" | null>(null)

  const [influencerProfileData, setInfluencerProfileData] = useState(initialInfluencerProfileData)

  // Added verificationStatus state for influencer profile
  const [verificationStatus, setVerificationStatus] = useState<"none" | "pending" | "approved">("none")

  const handleChatWithApplicant = (applicant: any, e: React.MouseEvent) => {
    e.stopPropagation()

    if (!selectedCampaignId) return

    const campaign = userCampaigns.find((c) => c.id === Number.parseInt(selectedCampaignId))
    if (!campaign) return

    console.log("[v0] Creating chat with applicant:", applicant.name, "for campaign:", campaign.title)

    const newChatId = addChat({
      influencerId: applicant.id,
      influencerName: applicant.name,
      influencerAvatar: applicant.avatar,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      initiatedBy: "advertiser",
    })

    console.log("[v0] Created new chat:", newChatId)
    router.push(`/chat/${newChatId}`)
  }

  const handleApplicantChatClick = (applicant: any, campaignId: number) => {
    console.log("[v0] Profile: Checking for existing chat with applicant:", applicant.name, "campaign:", campaignId)

    const existingChat = chats.find((chat) => chat.influencerId === applicant.id && chat.campaignId === campaignId)

    if (existingChat) {
      console.log("[v0] Profile: Found existing chat ID:", existingChat.id)
      router.push(`/chat/${existingChat.id}`)
      return
    }

    console.log("[v0] Profile: No existing chat found, creating new chat")

    const campaign = getCampaignById(campaignId)

    const newChatId = addChat({
      campaignId: campaignId,
      campaignTitle: campaign?.title || "캠페인",
      campaignCategory: campaign?.category || "기타",
      campaignStatus: campaign?.status || "진행중",
      campaignReward: campaign?.reward || "협의",
      campaignThumbnail: campaign?.thumbnail || "/placeholder.svg",
      influencerId: applicant.id,
      influencerName: applicant.name,
      influencerAvatar: applicant.avatar,
      advertiserId: 1,
      advertiserName: "광고주",
      advertiserAvatar: "/placeholder.svg",
      lastMessage: "채팅을 시작하세요",
      time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      unreadCount: 0,
      isUnread: false,
      isActiveCollaboration: true,
      initiatedBy: "advertiser",
      status: "active",
      messages: [],
    })

    console.log("[v0] Profile: Created chat ID:", newChatId)
    router.push(`/chat/${newChatId}`)
  }

  const calculateInfluencerProfileCompletion = () => {
    let completion = 0
    const avatar = localStorage.getItem("user_avatar")
    const name = localStorage.getItem("username")
    const nickname = localStorage.getItem("influencer_nickname")
    const bio = localStorage.getItem("influencer_bio")
    const instagram = localStorage.getItem("influencer_instagram_id")
    const category = localStorage.getItem("influencer_category")
    const hashtagsStr = localStorage.getItem("influencer_profile_hashtags")
    let hashtags: string[] = []
    try {
      hashtags = hashtagsStr ? JSON.parse(hashtagsStr) : []
    } catch {
      hashtags = []
    }

    const profileData = {
      hasAvatar: avatar !== null && avatar !== "" && avatar !== "null",
      hasName: name !== null && name !== "" && name !== "null",
      hasNickname: nickname !== null && nickname !== "" && nickname !== "null",
      hasBio: bio !== null && bio !== "" && bio !== "null",
      hasInstagram: instagram !== null && instagram !== "" && instagram !== "null",
      hasCategory: category !== null && category !== "" && category !== "null",
      hasHashtags: hashtags.length > 0,
    }

    if (profileData.hasAvatar) completion += 14.29
    if (profileData.hasName) completion += 14.29
    if (profileData.hasNickname) completion += 14.29
    if (profileData.hasBio) completion += 14.29
    if (profileData.hasInstagram) completion += 14.29
    if (profileData.hasCategory) completion += 14.29
    if (profileData.hasHashtags) completion += 14.29

    // Round to nearest integer
    completion = Math.round(completion)

    return completion
  }

  useEffect(() => {
    const influencerMode = localStorage.getItem("influencer_mode") === "true"
    setIsInfluencerMode(influencerMode)

    const savedAvatar = localStorage.getItem("user_avatar")
    const modePrefix = influencerMode ? "influencer" : "advertiser"
    const savedPosX = localStorage.getItem(`${modePrefix}_avatar_position_x`)
    const savedPosY = localStorage.getItem(`${modePrefix}_avatar_position_y`)
    const savedScale = localStorage.getItem(`${modePrefix}_avatar_scale`)
    const savedUsername = localStorage.getItem("username")
    const savedAdvertiserNickname = localStorage.getItem("advertiser_nickname")
    const savedInfluencerNickname = localStorage.getItem("influencer_nickname")
    const savedVerificationStatus = localStorage.getItem("influencer_instagram_verification_status")
    const savedInfluencerVerificationStatus = localStorage.getItem("influencer_verification_status") // New: Get influencer verification status

    console.log("[v0] Profile page loaded")
    console.log("[v0] Influencer mode:", influencerMode)
    console.log("[v0] Saved influencer nickname:", savedInfluencerNickname)

    if (savedAvatar) {
      setUserAvatar(savedAvatar)
    }
    if (savedPosX && savedPosY) {
      setAvatarPosition({ x: Number.parseFloat(savedPosX), y: Number.parseFloat(savedPosY) })
    }
    if (savedScale) {
      setAvatarScale(Number.parseFloat(savedScale))
    }

    if (savedUsername) {
      setUsername(savedUsername)
    }
    if (savedAdvertiserNickname) {
      setAdvertiserNickname(savedAdvertiserNickname)
    }
    if (savedInfluencerNickname) {
      // Added
      setInfluencerNickname(savedInfluencerNickname)
    }
    if (savedVerificationStatus) {
      setInstagramVerificationStatus(savedVerificationStatus as "idle" | "pending" | "verified")
    }
    if (savedInfluencerVerificationStatus) {
      // New: Set influencer verification status
      setVerificationStatus(savedInfluencerVerificationStatus as "none" | "pending" | "approved")
    }

    if (!influencerMode) {
      const completion = getAdvertiserProfileCompletion()
      const isComplete = checkAdvertiserProfileComplete()
      setProfileCompletion(completion)
      setIsProfileComplete(isComplete)
      console.log("[v0] Advertiser profile completion:", completion)
    } else {
      const influencerCompletion = calculateInfluencerProfileCompletion()
      setInfluencerProfileCompletion(influencerCompletion)
      setIsInfluencerProfileComplete(influencerCompletion === 100)
      console.log("[v0] Influencer profile completion:", influencerCompletion)
      console.log("[v0] Is profile complete:", influencerCompletion === 100)

      // CHANGE: Load verification status from localStorage
      const verificationData = localStorage.getItem("influencerVerification")
      if (verificationData) {
        const data = JSON.parse(verificationData)
        if (data.isVerificationSubmitted) {
          // 실제로는 백엔드에서 승인 상태를 확인해야 하지만, 현재는 대기 상태로 설정
          setVerificationStatus("pending")
        }
      }
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      console.log("[v0] Storage changed, recalculating profile completion")
      if (!isInfluencerMode) {
        const completion = getAdvertiserProfileCompletion()
        const isComplete = checkAdvertiserProfileComplete()
        setProfileCompletion(completion)
        setIsProfileComplete(isComplete)
        console.log("[v0] Updated advertiser profile completion:", completion)
      } else {
        const influencerCompletion = calculateInfluencerProfileCompletion()
        setInfluencerProfileCompletion(influencerCompletion)
        setIsInfluencerProfileComplete(influencerCompletion === 100)
        console.log("[v0] Updated influencer profile completion:", influencerCompletion)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [isInfluencerMode])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        if (!isInfluencerMode) {
          const completion = getAdvertiserProfileCompletion()
          const isComplete = checkAdvertiserProfileComplete()
          setProfileCompletion(completion)
          setIsProfileComplete(isComplete)
        } else {
          const influencerCompletion = calculateInfluencerProfileCompletion()
          setInfluencerProfileCompletion(influencerCompletion)
          setIsInfluencerProfileComplete(influencerCompletion === 100)
        }
      }
    }

    const handleFocus = () => {
      if (!isInfluencerMode) {
        const completion = getAdvertiserProfileCompletion()
        const isComplete = checkAdvertiserProfileComplete()
        setProfileCompletion(completion)
        setIsProfileComplete(isComplete)
      } else {
        const influencerCompletion = calculateInfluencerProfileCompletion()
        setInfluencerProfileCompletion(influencerProfileCompletion)
        setIsInfluencerProfileComplete(influencerProfileCompletion === 100)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", handleFocus)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleFocus)
    }
  }, [isInfluencerMode])

  useEffect(() => {
    if (isInfluencerMode) {
      // Removed proposal text loading from local storage
      // const savedProposal = localStorage.getItem("influencer_proposal")
      // if (savedProposal) {
      //   setProposalText(savedProposal)
      // }

      const savedAvatar = localStorage.getItem("user_avatar")
      const savedUsername = localStorage.getItem("username")
      const savedCategory = localStorage.getItem("influencer_category")
      const savedInstagram = localStorage.getItem("influencer_instagram")
      const savedInfluencerNickname = localStorage.getItem("influencer_nickname")
      const savedHashtagsStr = localStorage.getItem("influencer_profile_hashtags")
      const savedInfluencerVerificationStatus = localStorage.getItem("influencer_verification_status") // New: Get influencer verification status

      let savedHashtags: string[] = []
      try {
        savedHashtags = savedHashtagsStr ? JSON.parse(savedHashtagsStr) : []
      } catch {
        savedHashtags = []
      }

      setInfluencerProfileData((prev) => ({
        ...prev,
        name: savedUsername || savedInfluencerNickname || "인플루언서 잇다",
        avatar: savedAvatar || "",
        category: savedCategory || prev.category,
        hashtags: savedHashtags.length > 0 ? savedHashtags : prev.hashtags,
      }))
      if (savedInfluencerVerificationStatus) {
        // New: Set influencer verification status
        setVerificationStatus(savedInfluencerVerificationStatus as "none" | "pending" | "approved")
      }
    }
  }, [isInfluencerMode])

  const handleStatusEdit = (jobId: number, currentStatus: string) => {
    if (currentStatus === "마감") {
      return
    }
    setSelectedJobId(jobId)
    setTempStatus(currentStatus)
    setIsStatusModalOpen(true)
  }

  const handleStatusApply = () => {
    if (tempStatus === "마감") {
      setIsStatusModalOpen(false)
      setIsCloseConfirmOpen(true)
      return
    }

    if (selectedJobId && tempStatus) {
      updateCampaignStatus(selectedJobId, tempStatus as "진행중" | "마감" | "비공개 글")
    }
    setIsStatusModalOpen(false)
    setSelectedJobId(null)
    setTempStatus("")
  }

  const handleCancelClose = () => {
    setIsCloseConfirmOpen(false)
    setIsStatusModalOpen(true)
  }

  const handleConfirmClose = () => {
    if (selectedJobId && tempStatus) {
      updateCampaignStatus(selectedJobId, tempStatus as "진행중" | "마감" | "비공개 글")
    }
    setIsCloseConfirmOpen(false)
    setSelectedJobId(null)
    setTempStatus("")
  }

  const handleEditButtonClick = (campaignId: number) => {
    console.log("[v0] Edit button clicked, campaignId:", campaignId)
    const campaign = getCampaignById(campaignId)
    console.log("[v0] Campaign:", campaign)
    if (campaign?.status !== "비공개 글") {
      console.log("[v0] Status is not private, showing popup")
      setPendingActionCampaignId(campaignId)
      setPendingActionType("edit")
      setIsRequirePrivateStatusOpen(true)
    } else {
      console.log("[v0] Status is private, editing campaign")
      handleEditCampaign(campaignId)
    }
  }

  const handleDeleteButtonClick = (campaignId: number) => {
    console.log("[v0] Delete button clicked, campaignId:", campaignId)
    const campaign = getCampaignById(campaignId)
    console.log("[v0] Campaign:", campaign)
    if (campaign?.status !== "비공개 글" && campaign?.status !== "마감") {
      console.log("[v0] Status is not private, showing popup")
      setPendingActionCampaignId(campaignId)
      setPendingActionType("delete")
      setIsRequirePrivateStatusOpen(true)
    } else {
      console.log("[v0] Status is private or recruitment closed, deleting campaign")
      handleDeleteCampaign(campaignId)
    }
  }

  const handleConfirmPrivateStatus = async () => {
    setIsRequirePrivateStatusOpen(false)
    setPendingActionCampaignId(null)
    setPendingActionType(null)
  }

  const handleDeleteCampaign = (campaignId: number) => {
    setCampaignToDelete(campaignId)
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    if (campaignToDelete) {
      deleteCampaign(campaignToDelete)
    }
    setIsDeleteConfirmOpen(false)
    setCampaignToDelete(null)
  }

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false)
    setCampaignToDelete(null)
  }

  // Removed proposal edit, save, preview, back, and cancel handlers
  // const handleProposalEdit = () => {
  //   router.push("/influencer/proposal/create")
  // }

  // const handleProposalSave = () => {
  //   localStorage.setItem("influencer_proposal", proposalText)
  //   setIsProposalModalOpen(false)
  //   setIsProposalPreviewOpen(false) // Close preview after saving
  // }

  // const handleProposalPreview = () => {
  //   setIsProposalModalOpen(false)
  //   setIsProposalPreviewOpen(true)
  // }

  // const handleBackToProposal = () => {
  //   setIsProposalPreviewOpen(false)
  //   setIsProposalModalOpen(true)
  // }

  // const handleProposalCancel = () => {
  //   setIsProposalModalOpen(false)
  //   setProposalText("") // Clear proposal text on cancel
  // }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "진행중":
        return "bg-[#7b68ee]"
      case "마감":
        return "bg-gray-500"
      case "비공개 글":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case "진행중":
        return "진행중"
      case "마감":
        return "마감"
      case "비공개 글":
        return "비공개 글"
      default:
        return status
    }
  }

  const handleLogout = () => {
    router.push("/")
  }

  const handleApplicantManagement = (campaignId: number) => {
    router.push(`/campaigns/${campaignId}/applicants`)
  }

  const handleEditCampaign = (campaignId: number) => {
    router.push(`/campaigns/${campaignId}/edit`)
  }

  const handleApplicantClick = (applicantId: number) => {
    setIsApplicantModalOpen(false)
    router.push(`/influencers/${applicantId}`)
  }

  const handlePromotionClick = () => {
    setIsPromotionAlertOpen(true)
  }

  const handleDeleteClick = (applicationId: number) => {
    setSelectedApplicationId(applicationId)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedApplicationId) {
      removeApplication(selectedApplicationId)
    }
    setIsDeleteModalOpen(false)
    setSelectedApplicationId(null)
  }

  const isChatAccepted = (campaignId: number) => {
    const chats = getChatsForInfluencer(1) // Assuming influencer ID is 1
    return chats.some(
      (chat) => chat.campaignId === campaignId && (chat.status === "accepted" || chat.status === "active"),
    )
  }

  const handleChatClick = (campaignId: number) => {
    const chats = getChatsForInfluencer(1) // Assuming influencer ID is 1
    const chat = chats.find(
      (chat) => chat.campaignId === campaignId && (chat.status === "accepted" || chat.status === "active"),
    )
    if (chat) {
      router.push(`/chat/${chat.id}`)
    }
  }

  // 캠페인 상태 변경 필수 팝업 핸들러
  const handleRequireStatusClose = () => {
    setIsRequirePrivateStatusOpen(false)
    setPendingActionCampaignId(null)
    setPendingActionType(null)
  }

  const handleRequireStatusConfirm = () => {
    if (pendingActionCampaignId && pendingActionType) {
      updateCampaignStatus(pendingActionCampaignId, "비공개 글")
      setIsRequirePrivateStatusOpen(false)
      if (pendingActionType === "edit") {
        handleEditCampaign(pendingActionCampaignId)
      } else if (pendingActionType === "delete") {
        handleDeleteCampaign(pendingActionCampaignId)
      }
      setPendingActionCampaignId(null)
      setPendingActionType(null)
    }
  }

  // Added handleStatusChange function
  const handleStatusChange = (campaignId: number) => {
    const campaign = getCampaignById(campaignId)
    if (!campaign) return

    setSelectedJobId(campaignId)
    setTempStatus(campaign.status)
    setIsStatusModalOpen(true)
  }

  if (!isInfluencerMode) {
    // ADVERTISER MODE UI
    return (
      <div className="min-h-screen bg-white pb-20">
        <TopHeader title="내 프로필" showSearch={false} showNotifications={true} />

        <main className="px-4 py-6 space-4">
          <Link href="/profile/edit?mode=advertiser">
            <div className="bg-gray-100 rounded-2xl p-3 cursor-pointer hover:bg-gray-200 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full overflow-hidden relative bg-gray-200 flex items-center justify-center">
                    {userAvatar ? (
                      <img
                        src={userAvatar || "/placeholder.svg"}
                        alt={username || "프로필"}
                        className="absolute object-cover"
                        style={{
                          transform: `translate(${avatarPosition.x}px, ${avatarPosition.y}px) scale(${avatarScale})`,
                          transformOrigin: "center",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ) : (
                      <User className="w-7 h-7 text-gray-400" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <h2
                      className={`text-base font-semibold ${
                        (isInfluencerMode ? username : advertiserNickname) ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {isInfluencerMode
                        ? username || "프로필을 완성하세요"
                        : advertiserNickname || "프로필을 완성하세요"}
                    </h2>
                    {instagramVerificationStatus === "verified" && (
                      <div className="w-4 h-4 bg-[#7b68ee] rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </Link>

          {!isProfileComplete && (
            <div className="bg-gray-100 rounded-2xl p-4 mt-6">
              <p className="text-sm text-gray-500 mb-2">프로필을 모두 완성하고 캠페인 활동을 시작해요</p>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#7b68ee] h-full rounded-full transition-all duration-300"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-500">{profileCompletion}%</span>
              </div>
            </div>
          )}

          {/* CAMPAIGN CREATE BUTTON: PROFILE COMPLETION CHECK */}
          <div
            onClick={() => {
              if (!isProfileComplete) {
                alert("프로필을 100% 완성해야 캠페인을 작성할 수 있습니다.")
                return
              }
              setIsCampaignModalOpen(true)
            }}
            className={`rounded-2xl p-2 cursor-pointer transition-colors mt-6 ${
              isProfileComplete ? "bg-[#7b68ee] hover:bg-[#7b68ee]/90" : "bg-[#7b68ee]/30 cursor-not-allowed"
            }`}
          >
            <div className="text-center flex items-center justify-center gap-2">
              <Users className="h-4 w-4 text-white" />
              <span className="text-base font-medium text-white">캠페인 작성하러 가기</span>
            </div>
          </div>
          {/* END CAMPAIGN CREATE BUTTON */}

          <div
            onClick={handlePromotionClick}
            className="bg-gray-100 rounded-2xl p-2 cursor-pointer hover:bg-gray-200 transition-colors mt-3"
          >
            <div className="text-center flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-700" />
              <span className="text-base font-medium text-gray-700">내 캠페인 홍보하기</span>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <h3 className="text-lg font-semibold text-gray-900">캠페인 관리</h3>

            {userCampaigns.length === 0 ? (
              <div className="bg-gray-100 rounded-2xl p-8 text-center">
                <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">작성한 캠페인이 없습니다</p>
              </div>
            ) : (
              <div className="space-y-0">
                {userCampaigns.map((campaign, index) => (
                  <div key={campaign.id}>
                    <div className="border-b border-gray-100" />
                    <div className="py-6 pb-8 relative">
                      {(campaign.status === "진행중" || campaign.status === "비공개 글") && (
                        <div className="absolute top-6 right-0 flex gap-2 z-10">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleEditButtonClick(campaign.id)
                            }}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <Edit className="h-4 w-4 text-gray-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleDeleteButtonClick(campaign.id)
                            }}
                            className="p-2 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                          </button>
                        </div>
                      )}
                      <Link href={`/campaigns/${campaign.id}`} className="block">
                        <div className="flex items-start gap-3">
                          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 self-start">
                            <img
                              src={campaign.thumbnail || "/placeholder.svg"}
                              alt={campaign.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 flex flex-col min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`${getStatusColor(campaign.status)} text-xs px-3 py-1 rounded-full`}>
                                {getStatusDisplayText(campaign.status)}
                              </span>
                            </div>

                            <h4 className="font-semibold text-sm text-black leading-tight mb-1">{campaign.title}</h4>

                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <p className="text-base font-bold text-black">{campaign.reward}</p>
                              </div>
                              {campaign.recruitCount && (
                                <p className="text-sm text-gray-600">
                                  <span className="text-sm text-[#7b68ee] font-semibold">
                                    {campaign.applicants || 0}
                                  </span>
                                  <span className="text-sm">/{campaign.recruitCount}</span>{" "}
                                  <span className="text-xs text-gray-500">명 모집중</span>
                                </p>
                              )}
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <span className="bg-[#7b68ee]/10 text-[#7b68ee] font-medium text-xs px-2 py-1 rounded">
                                  {campaign.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>

                      <div className="flex gap-3 mt-4">
                        {campaign.status === "마감" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteButtonClick(campaign.id)}
                              className="flex-1 text-sm h-10 border-gray-300 hover:border-gray-400 bg-white rounded-lg"
                            >
                              삭제하기
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(campaign.id)}
                              className="flex-1 text-sm h-10 border-gray-300 hover:border-gray-400 bg-white rounded-lg"
                            >
                              상태 변경
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          onClick={() => handleApplicantManagement(campaign.id)}
                          className="flex-1 text-sm h-10 bg-[#7b68ee] hover:bg-[#7b68ee]/90 text-white rounded-lg"
                        >
                          지원자 관리
                        </Button>
                      </div>
                    </div>
                    {index < userCampaigns.length - 1 && <div className="border-b border-gray-100" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mt-8">고객 지원</h3>

          <div className="bg-gray-100 rounded-2xl p-4 mt-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between py-4 rounded-lg px-2 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">설정</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>

              <div className="flex items-center justify-between py-4 rounded-lg px-2 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <Megaphone className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">공지사항</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>

              <div className="flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50 rounded-lg px-2">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">고객센터</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>

              <div className="flex items-center justify-between py-4 rounded-lg px-2 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">이용 약관</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>

              <div
                onClick={handleLogout}
                className="flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50 rounded-lg px-2"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">로그아웃</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </main>

        <Drawer
          key={`status-modal-advertiser-${isStatusModalOpen}`}
          open={isStatusModalOpen}
          onOpenChange={setIsStatusModalOpen}
        >
          <DrawerContent className="rounded-t-3xl">
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="px-4 pt-2 pb-2 space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-3">상태 변경</h3>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTempStatus(option.value)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        tempStatus === option.value
                          ? "bg-[#7b68ee] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option.value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DrawerFooter className="pt-3 pb-6">
              <div className="flex gap-2">
                <DrawerClose asChild>
                  <Button variant="outline" className="flex-[3] bg-transparent h-12">
                    취소
                  </Button>
                </DrawerClose>
                <Button onClick={handleStatusApply} className="flex-[7] bg-[#7b68ee] hover:bg-[#7b68ee]/90 h-12">
                  적용
                </Button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <AlertDialog
          key={`require-private-status-advertiser-${isRequirePrivateStatusOpen}`}
          open={isRequirePrivateStatusOpen}
          onOpenChange={handleRequireStatusClose}
        >
          <AlertDialogContent className="w-[90%] max-w-sm rounded-xl">
            <AlertDialogHeader>
              <VisuallyHidden>
                <AlertDialogTitle>캠페인 상태 변경 필요</AlertDialogTitle>
              </VisuallyHidden>
              <AlertDialogDescription>먼저 캠페인의 상태를 비공개 글로 바꿔주세요.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button onClick={handleConfirmPrivateStatus} className="bg-[#7b68ee] hover:bg-[#7b68ee]/90 text-white">
                확인
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isPromotionAlertOpen} onOpenChange={setIsPromotionAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>알림</AlertDialogTitle>
              <AlertDialogDescription>해당 기능은 아직 준비중이에요</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="bg-[#7b68ee] hover:bg-[#7b68ee]/90">확인</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          key={`close-confirm-advertiser-${isCloseConfirmOpen}`}
          open={isCloseConfirmOpen}
          onOpenChange={setIsCloseConfirmOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>마감 확인</AlertDialogTitle>
              <AlertDialogDescription>
                마감으로 변경하면 다시 수정할 수 없습니다. 정말 마감하시겠습니까?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="outline" onClick={handleCancelClose}>
                취소
              </Button>
              <Button className="bg-[#7b68ee] hover:bg-[#7b68ee]/90" onClick={handleConfirmClose}>
                확인
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          key={`delete-confirm-advertiser-${isDeleteConfirmOpen}`}
          open={isDeleteConfirmOpen}
          onOpenChange={setIsDeleteConfirmOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>캠페인 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                정말로 이 캠페인을 삭제하시겠습니까? 삭제된 캠페인은 복구할 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="outline" onClick={handleCancelDelete}>
                취소
              </Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleConfirmDelete}>
                삭제
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <CampaignCreationModal open={isCampaignModalOpen} onOpenChange={setIsCampaignModalOpen} />
      </div>
    )
  }

  // INFLUENCER MODE UI
  return (
    <div className="min-h-screen bg-white pb-20">
      <TopHeader title="내 프로필" showSearch={false} showNotifications={true} />

      <main className="px-4 py-6 space-4">
        <Link href="/profile/edit?mode=influencer">
          <div className="bg-gray-100 rounded-2xl p-3 cursor-pointer hover:bg-gray-200 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full overflow-hidden relative bg-gray-200 flex items-center justify-center">
                  {userAvatar ? (
                    <div
                      className="absolute left-1/2 top-1/2"
                      style={{
                        width: "320px",
                        height: "256px",
                        transform: `translate(-50%, -50%) scale(${14 / 32})`,
                        transformOrigin: "center",
                      }}
                    >
                      <div
                        className="w-full h-full relative overflow-hidden"
                        style={{
                          transform: `translate(${avatarPosition.x}px, ${avatarPosition.y}px) scale(${avatarScale})`,
                          transformOrigin: "center",
                        }}
                      >
                        <img
                          src={userAvatar || "/placeholder.svg"}
                          alt={username || "프로필"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <User className="w-7 h-7 text-gray-400" />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <h2
                    className={`text-base font-semibold ${
                      (isInfluencerMode ? username : advertiserNickname) ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {isInfluencerMode ? username || "프로필을 완성하세요" : advertiserNickname || "프로필을 완성하세요"}
                  </h2>
                  {instagramVerificationStatus === "verified" && (
                    <div className="w-4 h-4 bg-[#7b68ee] rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </Link>

        {!isInfluencerProfileComplete && (
          <div className="bg-gray-100 rounded-2xl p-4 mt-6">
            <p className="text-sm text-gray-500 mb-2">프로필 정보를 입력하고 협업을 진행해요.</p>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#7b68ee] h-full rounded-full transition-all duration-300"
                style={{ width: `${influencerProfileCompletion}%` }}
              />
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-500">{influencerProfileCompletion}%</span>
            </div>
          </div>
        )}

        <div className="bg-gray-100 rounded-2xl mt-6">
          <div className="grid grid-cols-3 relative">
            <div>
              <button
                onClick={() => router.push("/profile/verification")}
                className="flex flex-col items-center justify-center text-center space-y-2 cursor-pointer py-5 min-w-0 w-full"
              >
                {/* CHANGE: Dynamic icon and text based on verification status */}
                {verificationStatus === "approved" && <Check className="h-5 w-5 text-green-500" />}
                {verificationStatus === "pending" && <Clock className="h-5 w-5 text-yellow-500" />}
                {verificationStatus === "none" && <FileCheck className="h-5 w-5 text-gray-600" />}

                <span className="text-xs font-medium text-gray-700">
                  {verificationStatus === "approved" && "승인완료"}
                  {verificationStatus === "pending" && "승인대기"}
                  {verificationStatus === "none" && "인증하기"}
                </span>
              </button>
              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300"
                style={{ left: `${(1 * 100) / 3}%` }}
              />
            </div>

            <div>
              {/* CHANGE: Removed link to proposal edit, now it's just a button */}
              <button
                onClick={() => router.push("/influencer/proposal/create")}
                className="flex flex-col items-center justify-center text-center space-y-2 cursor-pointer py-5 min-w-0 w-full"
              >
                <FileCheck className="h-5 w-5 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">내 제안서 관리</span>
              </button>
              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300"
                style={{ left: `${(2 * 100) / 3}%` }}
              />
            </div>

            {/* CHANGE: Changed icon from CheckCircle to Inbox for better representation of applications */}
            <Link href="/influencer/applications">
              <div className="flex flex-col items-center justify-center text-center space-y-2 cursor-pointer py-5 min-w-0">
                <Inbox className="h-5 w-5 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">지원 내역</span>
              </div>
            </Link>
          </div>
        </div>

        <div
          onClick={() => {
            if (!isInfluencerProfileComplete) {
              alert("프로필을 100% 완성해야 캠페인에 지원할 수 있습니다.")
              return
            }
            window.location.href = "/campaigns"
          }}
          className={`rounded-2xl p-2 cursor-pointer transition-colors mt-6 ${
            isInfluencerProfileComplete ? "bg-[#7b68ee] hover:bg-[#7b68ee]/90" : "bg-[#7b68ee]/30 cursor-not-allowed"
          }`}
        >
          <div className="text-center flex items-center justify-center gap-2">
            <Briefcase className="h-4 w-4 text-white" />
            <span className="text-base font-medium text-white">캠페인 지원하러 가기</span>
          </div>
        </div>

        <div
          onClick={handlePromotionClick}
          className="bg-gray-100 rounded-2xl p-2 cursor-pointer hover:bg-gray-200 transition-colors mt-3"
        >
          <div className="text-center flex items-center justify-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-700" />
            <span className="text-base font-medium text-gray-700">내 프로필 홍보하기</span>
          </div>
        </div>

        {/* Updates start here */}

        <div className="px-2 mt-8">
          <h3 className="text-lg font-semibold text-gray-900">고객 지원</h3>
        </div>
        {/* Updates end here */}

        <div className="bg-gray-100 rounded-2xl p-4 mt-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between py-4 rounded-lg px-2 opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">설정</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50 rounded-lg px-2">
              <div className="flex items-center gap-3">
                <Megaphone className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">공지사항</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center justify-between py-4 rounded-lg px-2 opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">고객센터</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center justify-between py-4 rounded-lg px-2 opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <FileCheck className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">이용 약관</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>

            <div
              onClick={handleLogout}
              className="flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50 rounded-lg px-2"
            >
              <div className="flex items-center gap-3">
                <LogOut className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">로그아웃</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </main>

      <Drawer
        key={`status-modal-advertiser-${isStatusModalOpen}`}
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
      >
        <DrawerContent className="rounded-t-3xl">
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
          <div className="px-4 pt-2 pb-2 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-3">상태 변경</h3>
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTempStatus(option.value)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      tempStatus === option.value
                        ? "bg-[#7b68ee] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.value}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DrawerFooter className="pt-3 pb-6">
            <div className="flex gap-2">
              <DrawerClose asChild>
                <Button variant="outline" className="flex-[3] bg-transparent h-12">
                  취소
                </Button>
              </DrawerClose>
              <Button onClick={handleStatusApply} className="flex-[7] bg-[#7b68ee] hover:bg-[#7b68ee]/90 h-12">
                적용
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        key={`require-private-status-advertiser-${isRequirePrivateStatusOpen}`}
        open={isRequirePrivateStatusOpen}
        onOpenChange={handleRequireStatusClose}
      >
        <AlertDialogContent className="w-[90%] max-w-sm rounded-xl">
          <AlertDialogHeader>
            <VisuallyHidden>
              <AlertDialogTitle>캠페인 상태 변경 필요</AlertDialogTitle>
            </VisuallyHidden>
            <AlertDialogDescription>먼저 캠페인의 상태를 비공개 글로 바꿔주세요.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleConfirmPrivateStatus} className="bg-[#7b68ee] hover:bg-[#7b68ee]/90 text-white">
              확인
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isPromotionAlertOpen} onOpenChange={setIsPromotionAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>알림</AlertDialogTitle>
            <AlertDialogDescription>해당 기능은 아직 준비중이에요</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-[#7b68ee] hover:bg-[#7b68ee]/90">확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        key={`close-confirm-advertiser-${isCloseConfirmOpen}`}
        open={isCloseConfirmOpen}
        onOpenChange={setIsCloseConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>마감 확인</AlertDialogTitle>
            <AlertDialogDescription>
              마감으로 변경하면 다시 수정할 수 없습니다. 정말 마감하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={handleCancelClose}>
              취소
            </Button>
            <Button className="bg-[#7b68ee] hover:bg-[#7b68ee]/90" onClick={handleConfirmClose}>
              확인
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        key={`delete-confirm-advertiser-${isDeleteConfirmOpen}`}
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>캠페인 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 캠페인을 삭제하시겠습니까? 삭제된 캠페인은 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              취소
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleConfirmDelete}>
              삭제
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Proposal Drawer and Preview Dialog Removed */}
      {/* Proposal edit, save, preview, back, and cancel handlers removed */}
      {/* Users will navigate to the dedicated proposal creation page instead */}

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>지원 취소</AlertDialogTitle>
            <AlertDialogDescription>정말로 이 캠페인 지원을 취소하시겠습니까?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              닫기
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDeleteConfirm}>
              취소하기
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 캠페인 상태 변경 필수 팝업 추가 */}
      <AlertDialog open={isRequirePrivateStatusOpen} onOpenChange={handleRequireStatusClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>캠페인 상태 변경 필요</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>먼저, 캠페인의 상태를 비공개 글로 바꿔주세요.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleConfirmPrivateStatus}>상태를 비공개 글로 변경하고 진행</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
