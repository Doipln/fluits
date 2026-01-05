"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react" // Added useCallback
import { TopHeader } from "@/components/top-header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation" // Added useSearchParams to read mode from URL
import {
  Camera,
  X,
  Check,
  Search,
  CheckCircle2,
  Circle,
  Eye,
  MapPin,
  Instagram,
  Lock,
  Youtube,
  BookOpen,
  Coffee,
  UtensilsCrossed,
  Shirt,
  Sparkles,
  Heart,
  Plane,
  Calendar,
  Baby,
  PawPrint,
} from "lucide-react" // Added ChevronDown, Globe, Youtube
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card" // Import Card and CardContent

const CONTENT_CATEGORIES = [
  "뷰티·화장품",
  "패션·스타일",
  "푸드·맛집",
  "여행·숙박",
  "라이프스타일",
  "육아·키즈",
  "반려동물",
  "헬스·피트니스",
  "게임·테크",
  "일상·브이로그",
  "기타",
]

const BRAND_CATEGORIES = [
  "카페",
  "음식점",
  "패션/의류",
  "뷰티/화장품",
  "라이프/서비스",
  "여행/숙박",
  "이벤트/축제",
  "키즈/유아",
  "펫/반려동물",
]

const categoryIcons: Record<string, React.ReactNode> = {
  카페: <Coffee className="w-4 h-4" />,
  음식점: <UtensilsCrossed className="w-4 h-4" />,
  "패션/의류": <Shirt className="w-4 h-4" />,
  "뷰티/화장품": <Sparkles className="w-4 h-4" />,
  "라이프/서비스": <Heart className="w-4 h-4" />,
  "여행/숙박": <Plane className="w-4 h-4" />,
  "이벤트/축제": <Calendar className="w-4 h-4" />,
  "키즈/유아": <Baby className="w-4 h-4" />,
  "펫/반려동물": <PawPrint className="w-4 h-4" />,
}

const STORE_TYPES = [
  { id: "offline", label: "오프라인" },
  { id: "online", label: "온라인" },
  { id: "both", label: "둘 다" },
]

const REGIONS: { [key: string]: string[] } = {
  서울시: [
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ],
  경기도: [
    "수원시",
    "성남시",
    "고양시",
    "용인시",
    "부천시",
    "안산시",
    "안양시",
    "남양주시",
    "화성시",
    "평택시",
    "의정부시",
    "시흥시",
    "파주시",
    "김포시",
    "광명시",
    "광주시",
    "군포시",
    "하남시",
    "오산시",
    "양주시",
    "이천시",
    "구리시",
    "안성시",
    "포천시",
    "의왕시",
    "여주시",
    "양평군",
    "동두천시",
    "과천시",
    "가평군",
    "연천군",
  ],
  경상북도: [
    "포항시",
    "경주시",
    "김천시",
    "안동시",
    "구미시",
    "영주시",
    "영천시",
    "상주시",
    "문경시",
    "경산시",
    "군위군",
    "의성군",
    "청송군",
    "영양군",
    "영덕군",
    "청도군",
    "고령군",
    "성주군",
    "칠곡군",
    "예천군",
    "봉화군",
    "울진군",
    "울릉군",
  ],
  경상남도: [
    "창원시",
    "진주시",
    "통영시",
    "사천시",
    "김해시",
    "밀양시",
    "거제시",
    "양산시",
    "의령군",
    "함안군",
    "창녕군",
    "고성군",
    "남해군",
    "하동군",
    "산청군",
    "함양군",
    "거창군",
    "합천군",
  ],
  전라북도: [
    "전주시",
    "군산시",
    "익산시",
    "정읍시",
    "남원시",
    "김제시",
    "완주군",
    "진안군",
    "무주군",
    "장수군",
    "임실군",
    "순창군",
    "고창군",
    "부안군",
  ],
  전라남도: [
    "목포시",
    "여수시",
    "순천시",
    "나주시",
    "광양시",
    "담양군",
    "곡성군",
    "구례군",
    "고흥군",
    "보성군",
    "화순군",
    "장흥군",
    "강진군",
    "해남군",
    "영암군",
    "무안군",
    "함평군",
    "영광군",
    "장성군",
    "완도군",
    "진도군",
    "신안군",
  ],
  충청북도: [
    "청주시",
    "충주시",
    "제천시",
    "보은군",
    "옥천군",
    "영동군",
    "증평군",
    "진천군",
    "괴산군",
    "음성군",
    "단양군",
  ],
  충청남도: [
    "천안시",
    "공주시",
    "보령시",
    "아산시",
    "서산시",
    "논산시",
    "계룡시",
    "당진시",
    "금산군",
    "부여군",
    "서천군",
    "청양군",
    "홍성군",
    "예산군",
    "태안군",
  ],
  강원도: [
    "춘천시",
    "원주시",
    "강릉시",
    "동해시",
    "태백시",
    "속초시",
    "삼척시",
    "홍천군",
    "횡성군",
    "영월군",
    "평창군",
    "정선군",
    "철원군",
    "화천군",
    "양구군",
    "인제군",
    "고성군",
    "양양군",
  ],
  제주도: ["제주시", "서귀포시"],
}

export default function EditProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const portfolioInputRef = useRef<HTMLInputElement>(null)
  const imageAdjustRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const bioTextareaRef = useRef<HTMLTextAreaElement>(null)
  const activityRateTextareaRef = useRef<HTMLTextAreaElement>(null)

  const businessNum1Ref = useRef<HTMLInputElement>(null)
  const businessNum2Ref = useRef<HTMLInputElement>(null)
  const businessNum3Ref = useRef<HTMLInputElement>(null)

  const [isInfluencerMode, setIsInfluencerMode] = useState(true)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewActiveTab, setPreviewActiveTab] = useState("소개")

  const [isAdditionalPlatformsOpen, setIsAdditionalPlatformsOpen] = useState(false)
  const [additionalPlatforms, setAdditionalPlatforms] = useState<Array<{ type: string; url: string }>>([
    { type: "", url: "" }, // Set initial type to empty string for "플랫폼 선택" placeholder
  ])

  const [avatar, setAvatar] = useState("/placeholder.svg?height=400&width=400")
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [portfolioFiles, setPortfolioFiles] = useState<{ url: string; type: string }[]>([])

  const [isAdjustingImage, setIsAdjustingImage] = useState(false)
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [imageScale, setImageScale] = useState(1.0)
  const [savedImagePosition, setSavedImagePosition] = useState({ x: 0, y: 0 })
  const [savedImageScale, setSavedImageScale] = useState(1.0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 }) // Added for tracking drag start position
  const [imageNaturalWidth, setImageNaturalWidth] = useState<number | null>(null) // Added to store natural image width
  const [imageNaturalHeight, setImageNaturalHeight] = useState<number | null>(null) // Added to store natural image height

  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null)
  const [initialScale, setInitialScale] = useState(1.0)
  const [isAvatarChangePopupOpen, setIsAvatarChangePopupOpen] = useState(false)

  // Influencer-specific fields
  const [category, setCategory] = useState("")
  const [rankedCategories, setRankedCategories] = useState<string[]>([])
  const [instagramId, setInstagramId] = useState("")
  const [isInstagramVerified, setIsInstagramVerified] = useState(false)
  const [instagramVerificationStatus, setInstagramVerificationStatus] = useState<"idle" | "pending" | "verified">(
    "idle",
  )
  const [bio, setBio] = useState("")
  const [portfolio, setPortfolio] = useState("")
  const [activityRate, setActivityRate] = useState("")
  const [isActivityRatePrivate, setIsActivityRatePrivate] = useState(false)
  const [broadRegion, setBroadRegion] = useState("")
  const [narrowRegion, setNarrowRegion] = useState("")
  const [career, setCareer] = useState("") // This state is not used in the updates, but kept for existing code.
  const [profileHashtags, setProfileHashtags] = useState<string[]>([])
  const [profileHashtagInput, setProfileHashtagInput] = useState("")
  const [influencerNickname, setInfluencerNickname] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState<string[]>(["instagram"])

  // Advertiser-specific fields
  const [brandCategory, setBrandCategory] = useState("")
  const [storeType, setStoreType] = useState<"online" | "offline" | "both">("offline")
  const [brandName, setBrandName] = useState("")
  const [brandLink, setBrandLink] = useState("") // Added brandLink state
  const [offlineLocation, setOfflineLocation] = useState("")
  const [businessNum1, setBusinessNum1] = useState("") // 3 digits
  const [businessNum2, setBusinessNum2] = useState("") // 2 digits
  const [businessNum3, setBusinessNum3] = useState("") // 5 digits
  const [businessNumberStatus, setBusinessNumberStatus] = useState<"idle" | "success" | "error">("idle")

  // Common fields
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("") // Added email state
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [influencerProgressPercentage, setInfluencerProgressPercentage] = useState(0)

  const [currentUserId, setCurrentUserId] = useState<number>(0) // Initialized to 0, will be set in useEffect

  const [careerEntries, setCareerEntries] = useState<
    Array<{
      title: string
      category: string
      date: string
    }>
  >([])
  const [newCareerEntry, setNewCareerEntry] = useState({
    title: "",
    category: "",
    date: "",
  })
  const [showCareerInput, setShowCareerInput] = useState(false)

  useEffect(() => {
    const adjustHeight = (textarea: HTMLTextAreaElement | null) => {
      if (textarea) {
        textarea.style.height = "auto"
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    }

    adjustHeight(bioTextareaRef.current)
    adjustHeight(activityRateTextareaRef.current)
  }, [bio, activityRate])

  useEffect(() => {
    const modeParam = searchParams.get("mode")
    let mode: string | null = null

    if (modeParam === "advertiser") {
      mode = "false"
      localStorage.setItem("influencer_mode", "false")
    } else if (modeParam === "influencer") {
      mode = "true"
      localStorage.setItem("influencer_mode", "true")
    } else {
      mode = localStorage.getItem("influencer_mode")
    }

    setIsInfluencerMode(mode === "true")
    console.log("[v0] Profile edit page mode:", mode === "true" ? "influencer" : "advertiser")
    // Load saved data
    const savedAvatar = localStorage.getItem("user_avatar")
    const modePrefix = mode === "true" ? "influencer" : "advertiser"
    const savedPositionX = localStorage.getItem(`${modePrefix}_avatar_position_x`)
    const savedPositionY = localStorage.getItem(`${modePrefix}_avatar_position_y`)
    const savedScale = localStorage.getItem(`${modePrefix}_avatar_scale`)

    if (savedAvatar) {
      setPhotoPreview(savedAvatar)
      setAvatar(savedAvatar)
    }

    if (savedPositionX && savedPositionY && savedScale) {
      const position = { x: Number.parseFloat(savedPositionX), y: Number.parseFloat(savedPositionY) }
      const scale = Number.parseFloat(savedScale)
      setSavedImagePosition(position)
      setSavedImageScale(scale)
      setImagePosition(position)
      setImageScale(scale)
    }

    if (mode === "true") {
      // Load influencer data
      const savedCategory = localStorage.getItem("influencer_category")
      const savedRankedCategories = localStorage.getItem("influencer_ranked_categories")
      const savedInstagramId = localStorage.getItem("influencer_instagram_id")
      const savedBio = localStorage.getItem("influencer_bio")
      const savedPortfolio = localStorage.getItem("influencer_portfolio")
      const savedActivityRate = localStorage.getItem("influencer_activity_rate")
      const savedIsActivityRatePrivate = localStorage.getItem("influencer_is_activity_rate_private")
      const savedBroadRegion = localStorage.getItem("influencer_broad_region")
      const savedNarrowRegion = localStorage.getItem("influencer_narrow_region")
      const savedCareer = localStorage.getItem("influencer_career")
      const savedHashtags = localStorage.getItem("influencer_profile_hashtags")
      const savedInfluencerNickname = localStorage.getItem("influencer_nickname")
      const savedInstagramVerificationStatus = localStorage.getItem("influencer_instagram_verification_status")
      const savedIsInstagramVerified = localStorage.getItem("influencer_is_instagram_verified")
      const savedPortfolioFiles = localStorage.getItem("influencer_portfolio_files")
      const savedCareerEntries = localStorage.getItem(`influencer_career_entries_${currentUserId}`)
      const savedAdditionalPlatforms = localStorage.getItem("influencer_additional_platforms")
      const savedSelectedPlatform = localStorage.getItem("influencer_selected_platform")

      if (savedCategory) setCategory(savedCategory)
      if (savedRankedCategories) {
        try {
          setRankedCategories(JSON.parse(savedRankedCategories))
        } catch (e) {
          console.error("Failed to parse ranked categories:", e)
        }
      }
      if (savedInstagramId) setInstagramId(savedInstagramId)
      if (savedBio) setBio(savedBio)
      if (savedPortfolio) setPortfolio(savedPortfolio)
      if (savedActivityRate) setActivityRate(savedActivityRate)
      if (savedIsActivityRatePrivate) setIsActivityRatePrivate(savedIsActivityRatePrivate === "true")
      if (savedBroadRegion) setBroadRegion(savedBroadRegion)
      if (savedNarrowRegion) setNarrowRegion(savedNarrowRegion)
      if (savedCareer) setCareer(savedCareer)
      if (savedInfluencerNickname) setInfluencerNickname(savedInfluencerNickname)
      if (savedInstagramId && savedInstagramVerificationStatus) {
        setInstagramVerificationStatus(savedInstagramVerificationStatus as "idle" | "pending" | "verified")
      }
      if (savedInstagramId && savedIsInstagramVerified) {
        setIsInstagramVerified(savedIsInstagramVerified === "true")
      }
      if (savedHashtags) {
        try {
          setProfileHashtags(JSON.parse(savedHashtags))
        } catch (e) {
          console.error("Failed to parse saved hashtags:", e)
        }
      }
      if (savedPortfolioFiles) {
        try {
          setPortfolioFiles(JSON.parse(savedPortfolioFiles))
        } catch (e) {
          console.error("Failed to parse saved portfolio files:", e)
        }
      }
      if (savedCareerEntries) {
        try {
          setCareerEntries(JSON.parse(savedCareerEntries))
        } catch (e) {
          console.error("Failed to parse saved career entries:", e)
        }
      }
      // Add migration logic to handle old string array format for additionalPlatforms
      if (savedAdditionalPlatforms) {
        try {
          const parsedPlatforms = JSON.parse(savedAdditionalPlatforms)
          // Check if it's the old format (array of strings) or new format (array of objects)
          if (parsedPlatforms.length > 0) {
            // Check if first item is a string (old format) or object (new format)
            if (typeof parsedPlatforms[0] === "string") {
              // Migrate old format to new format
              const migratedPlatforms = parsedPlatforms.map((url: string) => ({
                type: "", // Default to empty for "플랫폼 선택"
                url: url,
              }))
              setAdditionalPlatforms(migratedPlatforms)
            } else {
              // New format, use as is
              setAdditionalPlatforms(parsedPlatforms)
            }
          } else {
            // Empty array, set default
            setAdditionalPlatforms([{ type: "", url: "" }])
          }
        } catch (e) {
          console.error("Failed to parse saved additional platforms:", e)
          setAdditionalPlatforms([{ type: "", url: "" }])
        }
      }
      if (savedSelectedPlatform) {
        try {
          const platforms = JSON.parse(savedSelectedPlatform)
          if (Array.isArray(platforms)) {
            setSelectedPlatform(platforms)
          }
        } catch {
          setSelectedPlatform(["instagram"])
        }
      }
    } else {
      // Load advertiser data
      const savedBrandCategory = localStorage.getItem("advertiser_brand_category")
      const savedStoreType = localStorage.getItem("advertiser_store_type")
      const savedBrandName = localStorage.getItem("advertiser_brand_name")
      const savedBrandLink = localStorage.getItem("advertiser_brand_link")
      const savedBusinessNum1 = localStorage.getItem("advertiser_business_num1")
      const savedBusinessNum2 = localStorage.getItem("advertiser_business_num2")
      const savedBusinessNum3 = localStorage.getItem("advertiser_business_num3")
      const savedOfflineLocation = localStorage.getItem("advertiser_offline_location")
      const savedBusinessNumberStatus = localStorage.getItem("advertiser_business_number_status") // Load status

      if (savedBrandCategory) setBrandCategory(savedBrandCategory)
      if (savedStoreType) setStoreType(savedStoreType as "online" | "offline" | "both")
      if (savedBrandName) setBrandName(savedBrandName)
      if (savedBrandLink) setBrandLink(savedBrandLink)
      if (savedBusinessNum1) setBusinessNum1(savedBusinessNum1)
      if (savedBusinessNum2) setBusinessNum2(savedBusinessNum2)
      if (savedBusinessNum3) setBusinessNum3(savedBusinessNum3)
      if (savedOfflineLocation) setOfflineLocation(savedOfflineLocation)
      if (savedBusinessNumberStatus) setBusinessNumberStatus(savedBusinessNumberStatus as "idle" | "success" | "error") // Set status
    }
    const savedUserId = localStorage.getItem("current_influencer_id")
    if (savedUserId) {
      setCurrentUserId(Number.parseInt(savedUserId))
    } else {
      // If no ID exists, create one (in a real app, this would come from auth)
      const newUserId = Date.now()
      localStorage.setItem("current_influencer_id", newUserId.toString())
      setCurrentUserId(newUserId)
    }
    // </CHANGE> Empty dependency array - only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const modeParam = searchParams.get("mode")
    if (modeParam === "advertiser") {
      setIsInfluencerMode(false)
      localStorage.setItem("influencer_mode", "false")
    } else if (modeParam === "influencer") {
      setIsInfluencerMode(true)
      localStorage.setItem("influencer_mode", "true")
    }
  }, [searchParams])

  useEffect(() => {
    if (!isInfluencerMode) {
      console.log("[v0] Saving business number status to localStorage:", businessNumberStatus)
      localStorage.setItem("advertiser_business_number_status", businessNumberStatus)
    }
  }, [businessNumberStatus, isInfluencerMode])

  useEffect(() => {
    localStorage.setItem("influencer_mode", isInfluencerMode.toString())
    if (isInfluencerMode) {
      localStorage.setItem("influencer_activity_rate_private", isActivityRatePrivate.toString())
      localStorage.setItem("influencer_profile_hashtags", JSON.stringify(profileHashtags))
      localStorage.setItem("influencer_nickname", influencerNickname)
      localStorage.setItem("influencer_category", category)
      localStorage.setItem("influencer_ranked_categories", JSON.stringify(rankedCategories))
      localStorage.setItem("influencer_instagram_id", instagramId)
      localStorage.setItem("influencer_bio", bio)
      localStorage.setItem("influencer_activity_rate", activityRate)
      localStorage.setItem("influencer_broad_region", broadRegion)
      localStorage.setItem("influencer_narrow_region", narrowRegion)
      localStorage.setItem("influencer_career", career)
      localStorage.setItem("influencer_portfolio_files", JSON.stringify(portfolioFiles))
      // Save additional platforms data
      localStorage.setItem("influencer_additional_platforms", JSON.stringify(additionalPlatforms))
      localStorage.setItem("influencer_selected_platform", JSON.stringify(selectedPlatform)) // Save selected platforms
      if (currentUserId) {
        const careerEntriesWithId = careerEntries.map((entry) => ({
          ...entry,
          influencerId: currentUserId,
        }))
        localStorage.setItem(`influencer_career_entries_${currentUserId}`, JSON.stringify(careerEntriesWithId))
      }
      if (instagramId && instagramId.trim() !== "") {
        localStorage.setItem("influencer_instagram_verification_status", instagramVerificationStatus)
        localStorage.setItem("influencer_is_instagram_verified", isInstagramVerified.toString())
      } else {
        // Reset verification status if Instagram ID is empty
        localStorage.removeItem("influencer_instagram_verification_status")
        localStorage.removeItem("influencer_is_instagram_verified")
        if (instagramVerificationStatus !== "idle") {
          setInstagramVerificationStatus("idle")
          setIsInstagramVerified(false)
        }
      }
    } else {
      // Save advertiser data
      localStorage.setItem("advertiser_brand_category", brandCategory)
      localStorage.setItem("advertiser_store_type", storeType)
      localStorage.setItem("advertiser_brand_name", brandName)
      localStorage.setItem("advertiser_brand_link", brandLink)
      localStorage.setItem("advertiser_business_num1", businessNum1)
      localStorage.setItem("advertiser_business_num2", businessNum2)
      localStorage.setItem("advertiser_business_num3", businessNum3)
      localStorage.setItem("advertiser_offline_location", offlineLocation)

      console.log("[v0] Advertiser profile saved to localStorage", {
        brandCategory,
        storeType,
        brandName,
        brandLink,
        businessNum1,
        businessNum2,
        businessNum3,
        offlineLocation,
      })
    }
  }, [
    isInfluencerMode,
    isActivityRatePrivate,
    profileHashtags,
    influencerNickname,
    category,
    rankedCategories,
    instagramId,
    bio,
    activityRate,
    broadRegion,
    narrowRegion,
    career,
    instagramVerificationStatus,
    isInstagramVerified,
    portfolioFiles,
    // Add additionalPlatforms to dependencies
    additionalPlatforms,
    careerEntries, // Add careerEntries to dependencies
    currentUserId, // Add currentUserId to dependencies
    brandCategory,
    storeType,
    brandName,
    brandLink,
    businessNum1,
    businessNum2,
    businessNum3,
    offlineLocation,
    selectedPlatform, // Added selectedPlatform to dependencies
  ])

  const calculateInfluencerProgress = () => {
    let filledFields = 0
    const totalFields = 9 // Total required fields increased to 9 (including portfolio)

    // 1. Avatar
    if (photoPreview || avatar) filledFields += 1

    // 2. Nickname
    if (influencerNickname && influencerNickname.trim() !== "") filledFields += 1

    // 3. Ranked Categories (at least 1 selected)
    if (rankedCategories.length > 0) filledFields += 1

    // 4. Instagram verification
    if (isInstagramVerified) filledFields += 1

    // 5. Bio
    if (bio && bio.trim() !== "") filledFields += 1

    // 6. Activity Rate
    if (activityRate && activityRate.trim() !== "") filledFields += 1

    // 7. Region (both broad and narrow)
    if (broadRegion && narrowRegion) filledFields += 1

    // 8. Hashtags (at least 1)
    if (profileHashtags.length > 0) filledFields += 1

    if (portfolioFiles.length > 0) filledFields += 1

    console.log("[v0] Influencer profile completion:", {
      avatar: !!(photoPreview || avatar),
      nickname: !!(influencerNickname && influencerNickname.trim() !== ""),
      category: rankedCategories.length > 0,
      instagramVerified: isInstagramVerified,
      bio: !!(bio && bio.trim() !== ""),
      activityRate: !!(activityRate && activityRate.trim() !== ""),
      region: !!(broadRegion && narrowRegion),
      hashtags: profileHashtags.length > 0,
      portfolio: portfolioFiles.length > 0, // Added portfolio to debug log
      completion: `${filledFields}/${totalFields}`,
      percentage: `${Math.round((filledFields / totalFields) * 100)}%`,
    })

    return Math.round((filledFields / totalFields) * 100)
  }

  const calculateAdvertiserProgress = () => {
    let filledFields = 0
    let totalFields = 0

    const businessNumberComplete =
      businessNum1.length === 3 &&
      businessNum2.length === 2 &&
      businessNum3.length === 5 &&
      businessNumberStatus === "success"

    // Base required fields: brandCategory, storeType, brandName
    const baseRequiredFields = [brandCategory, storeType, brandName]

    totalFields += baseRequiredFields.length + 1 // +1 for business number
    filledFields += baseRequiredFields.filter((field) => field && field.trim() !== "").length
    if (businessNumberComplete) filledFields += 1

    // Conditional required field: offlineLocation (only if offline or both)
    if (storeType === "offline" || storeType === "both") {
      totalFields += 1
      if (offlineLocation && offlineLocation.trim() !== "") filledFields += 1
    }

    // Conditional required field: brandLink (only if online or both)
    if (storeType === "online" || storeType === "both") {
      totalFields += 1
      if (brandLink && brandLink.trim() !== "") filledFields += 1
    }

    return Math.round((filledFields / totalFields) * 100)
  }

  const handleSelectCategory = useCallback(
    (selectedCategory: string) => {
      setRankedCategories((prev) => {
        const index = prev.indexOf(selectedCategory)
        if (index !== -1) {
          // Category already selected, remove it
          return prev.filter((cat) => cat !== selectedCategory)
        } else {
          // Add category if less than 3 are selected
          if (prev.length < 3) {
            return [...prev, selectedCategory]
          }
          return prev
        }
      })
      // Keep the old category state for backward compatibility
      if (rankedCategories.length === 0 || rankedCategories[0] === selectedCategory) {
        setCategory(category === selectedCategory ? "" : selectedCategory)
      } else if (!rankedCategories.includes(selectedCategory)) {
        setCategory(selectedCategory)
      }
    },
    [rankedCategories, category], // Added dependencies
  )

  const handleSelectBrandCategory = useCallback((selectedCategory: string) => {
    setBrandCategory((prev) => (prev === selectedCategory ? "" : selectedCategory))
  }, [])

  const handleSelectStoreType = useCallback((storeTypeId: string) => {
    setStoreType((prev) => {
      if (prev === storeTypeId) {
        // Reset conditional fields if the same type is unselected
        if (storeTypeId === "offline") {
          setOfflineLocation("")
        } else if (storeTypeId === "online") {
          setBrandLink("")
        } else if (storeTypeId === "both") {
          setOfflineLocation("")
          setBrandLink("")
        }
        return ""
      } else {
        // Reset conditional fields if switching types
        if (storeTypeId === "offline") {
          setBrandLink("") // Clear brandLink if switching to offline
        } else if (storeTypeId === "online") {
          setOfflineLocation("") // Clear offlineLocation if switching to online
        }
        return storeTypeId as "online" | "offline" | "both"
      }
    })
  }, [])

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageUrl = reader.result as string
        setTempImageUrl(imageUrl)

        // Load image dimensions
        const img = new window.Image()
        img.onload = () => {
          setImageNaturalWidth(img.naturalWidth)
          setImageNaturalHeight(img.naturalHeight)
          console.log("[v0] Image loaded with dimensions:", img.naturalWidth, img.naturalHeight)
        }
        img.src = imageUrl

        // Reset position and scale when a new image is uploaded to start fresh
        setImagePosition({ x: 0, y: 0 })
        setStartPosition({ x: 0, y: 0 }) // Reset start position as well
        setImageScale(1.5) // Start with larger scale so user can see more of the image
        setIsAdjustingImage(true)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleRemovePhoto = useCallback(() => {
    setPhotoPreview(null)
    setAvatar("/placeholder.svg?height=400&width=400")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    // Reset saved position and scale when photo is removed
    setSavedImagePosition({ x: 0, y: 0 })
    setSavedImageScale(1.0)
    setImageNaturalWidth(null) // Clear natural dimensions
    setImageNaturalHeight(null) // Clear natural dimensions
    // Also clear from localStorage
    localStorage.removeItem("user_avatar")
    localStorage.removeItem("influencer_avatar_position_x")
    localStorage.removeItem("influencer_avatar_position_y")
    localStorage.removeItem("influencer_avatar_scale")
    localStorage.removeItem("advertiser_avatar_position_x")
    localStorage.removeItem("advertiser_avatar_position_y")
    localStorage.removeItem("advertiser_avatar_scale")
  }, [])

  const handleChangeToDefaultImage = useCallback(() => {
    setPhotoPreview(null)
    setAvatar("/placeholder.svg?height=400&width=400")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setSavedImagePosition({ x: 0, y: 0 })
    setSavedImageScale(1.0)
    setImageNaturalWidth(null) // Clear natural dimensions
    setImageNaturalHeight(null) // Clear natural dimensions
    localStorage.removeItem("user_avatar")
    localStorage.removeItem("influencer_avatar_position_x")
    localStorage.removeItem("influencer_avatar_position_y")
    localStorage.removeItem("influencer_avatar_scale")
    localStorage.removeItem("advertiser_avatar_position_x")
    localStorage.removeItem("advertiser_avatar_position_y")
    localStorage.removeItem("advertiser_avatar_scale")
    setIsAvatarChangePopupOpen(false)
  }, [])

  const handleChangeProfilePicture = useCallback(() => {
    setIsAvatarChangePopupOpen(false)
    fileInputRef.current?.click()
  }, [])

  const handlePortfolioUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles: { url: string; type: string }[] = []
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newFiles.push({
            url: reader.result as string,
            type: file.type.startsWith("video") ? "video" : "image",
          })
          if (newFiles.length === files.length) {
            setPortfolioFiles((prev) => [...prev, ...newFiles])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }, [])

  const handleRemovePortfolioFile = useCallback((index: number) => {
    setPortfolioFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleInstagramVerify = useCallback(() => {
    if (instagramId.trim()) {
      setInstagramVerificationStatus("pending")
      // Simulate API call delay
      setTimeout(() => {
        setInstagramVerificationStatus("verified")
        setIsInstagramVerified(true)
        localStorage.setItem("influencer_instagram_verification_status", "verified")
        localStorage.setItem("influencer_is_instagram_verified", "true")
      }, 1000)
    }
  }, [instagramId, instagramVerificationStatus, isInstagramVerified]) // Added dependencies

  const handleSave = useCallback(() => {
    // Save common fields
    localStorage.setItem("username", username)
    localStorage.setItem("user_email", email)

    if (photoPreview) {
      localStorage.setItem("user_avatar", photoPreview)
      const modePrefix = isInfluencerMode ? "influencer" : "advertiser"
      localStorage.setItem(`${modePrefix}_avatar_position_x`, savedImagePosition.x.toString())
      localStorage.setItem(`${modePrefix}_avatar_position_y`, savedImagePosition.y.toString())
      localStorage.setItem(`${modePrefix}_avatar_scale`, savedImageScale.toString())
    }

    if (isInfluencerMode) {
      // Save influencer data
      localStorage.setItem("influencer_category", category)
      localStorage.setItem("influencer_instagram_id", instagramId)
      localStorage.setItem("influencer_is_instagram_verified", isInstagramVerified.toString())
      localStorage.setItem("influencer_instagram_verification_status", instagramVerificationStatus)
      localStorage.setItem("influencer_bio", bio)
      localStorage.setItem("influencer_activity_rate", activityRate)
      localStorage.setItem("influencer_activity_rate_private", isActivityRatePrivate.toString())
      localStorage.setItem("influencer_broad_region", broadRegion)
      localStorage.setItem("influencer_narrow_region", narrowRegion)
      localStorage.setItem("influencer_career", career)
      localStorage.setItem("influencer_profile_hashtags", JSON.stringify(profileHashtags))
      localStorage.setItem("influencer_nickname", influencerNickname)
      localStorage.setItem("username", influencerNickname)
      localStorage.setItem("influencer_portfolio_files", JSON.stringify(portfolioFiles))
      // Save additional platforms data
      localStorage.setItem("influencer_additional_platforms", JSON.stringify(additionalPlatforms))
      localStorage.setItem("influencer_selected_platform", JSON.stringify(selectedPlatform)) // Save selected platforms
      if (currentUserId) {
        const careerEntriesWithId = careerEntries.map((entry) => ({
          ...entry,
          influencerId: currentUserId,
        }))
        localStorage.setItem(`influencer_career_entries_${currentUserId}`, JSON.stringify(careerEntriesWithId))
      }
    } else {
      // Save advertiser data
      localStorage.setItem("advertiser_brand_category", brandCategory)
      localStorage.setItem("advertiser_store_type", storeType)
      localStorage.setItem("advertiser_brand_name", brandName)
      localStorage.setItem("advertiser_brand_link", brandLink)
      localStorage.setItem("advertiser_business_num1", businessNum1)
      localStorage.setItem("advertiser_business_num2", businessNum2)
      localStorage.setItem("advertiser_business_num3", businessNum3)
      localStorage.setItem("advertiser_offline_location", offlineLocation)

      console.log("[v0] Advertiser profile saved", {
        brandCategory,
        storeType,
        brandName,
        brandLink,
        businessNum1,
        businessNum2,
        businessNum3,
        offlineLocation,
      })
    }

    router.push("/profile")
  }, [
    username,
    email, // Include email in dependencies
    photoPreview,
    savedImagePosition.x,
    savedImagePosition.y,
    savedImageScale,
    isInfluencerMode,
    category,
    instagramId,
    isInstagramVerified,
    instagramVerificationStatus,
    bio,
    activityRate,
    isActivityRatePrivate,
    broadRegion,
    narrowRegion,
    career,
    profileHashtags,
    influencerNickname,
    // Add additionalPlatforms to dependencies
    additionalPlatforms,
    currentUserId,
    careerEntries,
    brandCategory,
    storeType,
    brandName,
    brandLink,
    businessNum1,
    businessNum2,
    businessNum3,
    offlineLocation,
    selectedPlatform, // Added selectedPlatform to dependencies
    router,
  ])

  const handleCancel = useCallback(() => {
    router.back()
  }, [router])

  const handleBusinessNum1Change = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "").slice(0, 3)
    setBusinessNum1(value)
    if (value.length === 3) {
      businessNum2Ref.current?.focus()
    }
  }, [])

  const handleBusinessNum2Change = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "").slice(0, 2)
    setBusinessNum2(value)
    if (value.length === 2) {
      businessNum3Ref.current?.focus()
    }
  }, [])

  const handleBusinessNum3Change = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "").slice(0, 5)
    setBusinessNum3(value)
  }, [])

  const handleBusinessNumberLookup = useCallback(() => {
    console.log("[v0] Business number lookup triggered:", { businessNum1, businessNum2, businessNum3 })
    if (businessNum1.length === 3 && businessNum2.length === 2 && businessNum3.length === 5) {
      // Simulate lookup - in real app, this would call an API
      const isValid = Math.random() > 0.3 // 70% success rate for demo
      const newStatus = isValid ? "success" : "error"
      console.log("[v0] Business number verification result:", newStatus)
      setBusinessNumberStatus(newStatus)
    } else {
      console.log("[v0] Business number format invalid")
      setBusinessNumberStatus("error")
    }
  }, [businessNum1, businessNum2, businessNum3])

  const handlePreview = useCallback(() => {
    setIsPreviewOpen(true)
  }, [])

  const handleBroadRegionChange = useCallback((value: string) => {
    setBroadRegion(value)
    setNarrowRegion("") // Reset narrow region when broad region changes
  }, [])

  const activityRegion = broadRegion && narrowRegion ? `${broadRegion} ${narrowRegion}` : broadRegion || ""

  const getCategoryTags = useCallback((category: string) => {
    const categoryMap: { [key: string]: string[] } = {
      뷰티·화장품: ["뷰티", "메이크업", "스킨케어"],
      패션·스타일: ["패션", "스타일링", "OOTD"],
      푸드·맛집: ["맛집", "요리", "레시피"],
      여행·숙박: ["여행", "맛집", "관광"],
      라이프스타일: ["라이프스타일", "일상", "브이로그"],
      육아·키즈: ["육아", "베이비", "맘스타그램"],
      반려동물: ["반려동물", "펫스타그램", "케어"],
      헬스·피트니스: ["헬스", "운동", "다이어트"],
      게임·테크: ["테크", "리뷰", "가젯"],
      일상·브이로그: ["일상", "브이로그", "데일리"],
      기타: ["라이프스타일", "일상", "콘텐츠"],
    }
    return categoryMap[category] || ["라이프스타일", "일상", "콘텐츠"]
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true)
      setStartPosition({ x: imagePosition.x, y: imagePosition.y }) // Store current position
      setDragStart({
        x: e.clientX, // Use clientX/Y directly for drag start
        y: e.clientY,
      })
    },
    [imagePosition.x, imagePosition.y],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !imageAdjustRef.current || !imageNaturalWidth || !imageNaturalHeight) return

      // Get the exposure area dimensions (the purple border box size)
      const exposureWidth = isInfluencerMode ? 320 : 256
      const exposureHeight = isInfluencerMode ? 256 : 256

      // Calculate aspect ratio of the original image
      const aspectRatio = imageNaturalWidth / imageNaturalHeight

      // Calculate rendered image dimensions maintaining aspect ratio
      let renderedWidth: number
      let renderedHeight: number

      // We want the image to fill the 400x400 container as much as possible while maintaining aspect ratio
      // This means either width or height will match the container, and the other will be scaled proportionally.
      // We need to consider both scenarios to determine the correct scaling.
      const containerSize = 400

      if (aspectRatio > 1) {
        // Landscape image: width is larger than height
        // If we set width to containerSize, height will be less than containerSize.
        // If we set height to containerSize, width will be larger than containerSize, and we'll need to crop/handle overflow.
        // We want to ensure the scaled image dimensions are at least the exposure dimensions to allow movement.

        // Option 1: Make width match container
        renderedWidth = containerSize
        renderedHeight = containerSize / aspectRatio

        // Option 2: Make height match container (only if it results in a larger scaled image overall, but this is usually handled by object-fit: contain)
        // This logic is more about the _maximum_ size the image can be within the container while still fitting.
        // For image manipulation, we are focusing on the aspect ratio itself for calculation.
      } else {
        // Portrait or square image: height is larger or equal to width
        renderedHeight = containerSize
        renderedWidth = containerSize * aspectRatio
      }

      // Apply scale to get actual scaled dimensions
      const scaledImageWidth = renderedWidth * imageScale
      const scaledImageHeight = renderedHeight * imageScale

      // Calculate maximum translation: exposure area must stay within the scaled image
      // If scaled image is smaller than exposure, prevent any movement
      const maxTranslateX = Math.max(0, (scaledImageWidth - exposureWidth) / 2)
      const maxTranslateY = Math.max(0, (scaledImageHeight - exposureHeight) / 2)

      // Calculate the total delta from the drag start point
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y

      // Calculate the new position based on the starting position and the delta
      let newX = startPosition.x + deltaX
      let newY = startPosition.y + deltaY

      // Clamp the new position to the calculated boundaries
      newX = Math.max(-maxTranslateX, Math.min(maxTranslateX, newX))
      newY = Math.max(-maxTranslateY, Math.min(maxTranslateY, newY))

      setImagePosition({ x: newX, y: newY })
    },
    [
      isDragging,
      dragStart.x,
      dragStart.y,
      startPosition.x,
      startPosition.y,
      imageScale,
      isInfluencerMode,
      imageNaturalWidth,
      imageNaturalHeight,
    ],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const getTouchDistance = useCallback((touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch gesture started
        const distance = getTouchDistance(e.touches[0], e.touches[1])
        setInitialPinchDistance(distance)
        setInitialScale(imageScale)
        setIsDragging(false)
      } else if (e.touches.length === 1) {
        // Single finger drag
        const touch = e.touches[0]
        setIsDragging(true)
        setStartPosition({ x: imagePosition.x, y: imagePosition.y }) // Store current position
        setDragStart({
          x: touch.clientX, // Use clientX/Y directly for drag start
          y: touch.clientY,
        })
      }
    },
    [getTouchDistance, imageScale, imagePosition.x, imagePosition.y],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!imageAdjustRef.current || e.touches.length === 0) return

      if (e.touches.length === 2 && initialPinchDistance !== null) {
        // Pinch gesture in progress
        e.preventDefault()
        const currentDistance = getTouchDistance(e.touches[0], e.touches[1])
        const scale = (currentDistance / initialPinchDistance) * initialScale
        // Clamp scale between 0.5 and 3.0
        setImageScale(Math.max(0.5, Math.min(3.0, scale)))
      } else if (e.touches.length === 1 && isDragging && imageNaturalWidth && imageNaturalHeight) {
        const touch = e.touches[0]

        // Get the exposure area dimensions (the purple border box size)
        const exposureWidth = isInfluencerMode ? 320 : 256
        const exposureHeight = isInfluencerMode ? 256 : 256

        // Calculate aspect ratio of the original image
        const aspectRatio = imageNaturalWidth / imageNaturalHeight

        // Calculate rendered image dimensions maintaining aspect ratio
        let renderedWidth: number
        let renderedHeight: number

        const containerSize = 400 // This is the max size the image can occupy within the container

        if (aspectRatio > 1) {
          // Landscape image
          renderedWidth = containerSize
          renderedHeight = containerSize / aspectRatio
        } else {
          // Portrait or square image
          renderedHeight = containerSize
          renderedWidth = containerSize * aspectRatio
        }

        // Apply scale to get actual scaled dimensions
        const scaledImageWidth = renderedWidth * imageScale
        const scaledImageHeight = renderedHeight * imageScale

        // Calculate maximum translation: exposure area must stay within the scaled image
        const maxTranslateX = Math.max(0, (scaledImageWidth - exposureWidth) / 2)
        const maxTranslateY = Math.max(0, (scaledImageHeight - exposureHeight) / 2)

        // Calculate the total delta from the drag start point
        const deltaX = touch.clientX - dragStart.x
        const deltaY = touch.clientY - dragStart.y

        // Calculate the new position based on the starting position and the delta
        let newX = startPosition.x + deltaX
        let newY = startPosition.y + deltaY

        // Clamp the new position to the calculated boundaries
        newX = Math.max(-maxTranslateX, Math.min(maxTranslateX, newX))
        newY = Math.max(-maxTranslateY, Math.min(maxTranslateY, newY))

        setImagePosition({
          x: newX,
          y: newY,
        })
      }
    },
    [
      getTouchDistance,
      initialPinchDistance,
      initialScale,
      isDragging,
      dragStart.x,
      dragStart.y,
      startPosition.x,
      startPosition.y,
      imageScale,
      isInfluencerMode,
      imageNaturalWidth,
      imageNaturalHeight,
    ],
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    setInitialPinchDistance(null)
  }, [])

  const handleZoomIn = useCallback(() => {
    setImageScale((prev) => Math.min(3.0, prev + 0.1))
  }, [])

  const handleZoomOut = useCallback(() => {
    setImageScale((prev) => Math.max(0.5, prev - 0.1))
  }, [])

  const handleSaveImagePosition = useCallback(() => {
    if (tempImageUrl) {
      console.log("[v0] Saving image position:", imagePosition)
      console.log("[v0] Saving image scale:", imageScale)

      setPhotoPreview(tempImageUrl)
      setAvatar(tempImageUrl)
      setSavedImagePosition(imagePosition)
      setSavedImageScale(imageScale)

      console.log("[v0] Saved position:", imagePosition)
      console.log("[v0] Saved scale:", imageScale)

      setIsAdjustingImage(false)
      setTempImageUrl(null)
      // Clear natural dimensions after saving
      setImageNaturalWidth(null)
      setImageNaturalHeight(null)
    }
  }, [tempImageUrl, imagePosition, imageScale])

  const handleCancelImageAdjustment = useCallback(() => {
    setIsAdjustingImage(false)
    setTempImageUrl(null)
    // Reset to the last saved state or initial state if not saved yet
    setImagePosition(savedImagePosition)
    setImageScale(savedImageScale)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    // Clear natural dimensions on cancel
    setImageNaturalWidth(null)
    setImageNaturalHeight(null)
  }, [savedImagePosition, savedImageScale])

  const handleProfileHashtagInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      // Check if the input ends with a space
      if (value.endsWith(" ")) {
        const trimmedValue = value.trim()
        if (trimmedValue) {
          const tag = trimmedValue.startsWith("#") ? trimmedValue : `#${trimmedValue}`
          if (!profileHashtags.includes(tag)) {
            setProfileHashtags([...profileHashtags, tag])
          }
          setProfileHashtagInput("")
        } else {
          setProfileHashtagInput("")
        }
      } else {
        setProfileHashtagInput(value)
      }
    },
    [profileHashtags],
  )

  const handleProfileHashtagKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        const value = profileHashtagInput.trim()
        if (value) {
          const tag = value.startsWith("#") ? value : `#${value}`
          if (!profileHashtags.includes(tag)) {
            setProfileHashtags([...profileHashtags, tag])
          }
          setProfileHashtagInput("")
        }
      } else if (e.key === "Backspace" && profileHashtagInput === "" && profileHashtags.length > 0) {
        setProfileHashtags(profileHashtags.slice(0, -1))
      }
    },
    [profileHashtagInput, profileHashtags],
  )

  const removeProfileHashtagTag = useCallback(
    (tagToRemove: string) => {
      setProfileHashtags(profileHashtags.filter((tag) => tag !== tagToRemove))
    },
    [profileHashtags],
  )

  const handleAddCareerEntry = useCallback(() => {
    if (newCareerEntry.title && newCareerEntry.category && newCareerEntry.date) {
      if (careerEntries.length < 3) {
        setCareerEntries([...careerEntries, newCareerEntry])
        setNewCareerEntry({ title: "", category: "", date: "" })
      }
    }
  }, [newCareerEntry, careerEntries])

  const handleRemoveCareerEntry = useCallback(
    (index: number) => {
      setCareerEntries(careerEntries.filter((_, i) => i !== index))
    },
    [careerEntries],
  )

  const handleAdditionalPlatformChange = (index: number, field: "type" | "url", value: string) => {
    const newPlatforms = [...additionalPlatforms]
    newPlatforms[index][field] = value
    setAdditionalPlatforms(newPlatforms)
  }

  const handleAddPlatformField = () => {
    if (additionalPlatforms.length < 2) {
      setAdditionalPlatforms([...additionalPlatforms, { type: "", url: "" }])
    }
  }

  const handleRemovePlatformField = (index: number) => {
    const newPlatforms = additionalPlatforms.filter((_, i) => i !== index)
    setAdditionalPlatforms(newPlatforms.length > 0 ? newPlatforms : [{ type: "", url: "" }])
  }

  const togglePlatform = (platform: string) => {
    setSelectedPlatform((prev) => {
      if (prev.includes(platform)) {
        // Remove if already selected
        return prev.filter((p) => p !== platform)
      } else {
        // Add if not selected
        return [...prev, platform]
      }
    })
  }

  useEffect(() => {
    if (isInfluencerMode) {
      const progress = calculateInfluencerProgress()
      setInfluencerProgressPercentage(progress)
      console.log("[v0] Influencer profile completion:", progress)
      console.log("[v0] Is profile complete:", progress === 100)
    }
  }, [
    isInfluencerMode,
    photoPreview,
    avatar,
    influencerNickname,
    rankedCategories,
    isInstagramVerified,
    bio,
    activityRate,
    broadRegion,
    narrowRegion,
    profileHashtags,
    portfolioFiles, // Added portfolioFiles dependency to recalculate when portfolio changes
  ])

  // ADVERTISER MODE UI
  const progressPercentage = calculateAdvertiserProgress()

  // INFLUENCER MODE UI

  return (
    <div className="min-h-screen bg-white">
      <TopHeader
        title="프로필 수정"
        showSearch={false}
        showNotifications={false}
        showHeart={false}
        showBack={true}
        customAction={
          isInfluencerMode ? (
            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Eye className="w-5 h-5 text-gray-700" />
            </button>
          ) : null
        }
      />

      <div className="fixed top-[var(--gnb-height)] left-0 right-0 w-full bg-gray-100 h-1 z-30">
        <div
          className="bg-[#7b68ee] h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${isInfluencerMode ? influencerProgressPercentage : progressPercentage}%` }}
        />
      </div>

      <main className="px-4 py-6 space-y-12 pb-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <div
              className={`overflow-hidden border-2 border-gray-200 relative ${isInfluencerMode ? "w-40 h-32 rounded-2xl" : "w-32 h-32 rounded-full"}`}
            >
              {isInfluencerMode ? (
                // Influencer mode: Show cropped area preview
                <div className="w-full h-full relative overflow-hidden">
                  <img
                    src={photoPreview || "/placeholder.svg"}
                    alt="Profile preview"
                    className="absolute"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `translate(calc(-50% + ${savedImagePosition.x * 0.5}px), calc(-50% + ${savedImagePosition.y * 0.5}px)) scale(${savedImageScale})`,
                      transformOrigin: "center",
                      width: "auto",
                      height: "auto",
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ) : (
                <div
                  className="absolute left-1/2 top-1/2"
                  style={{
                    width: "256px",
                    height: "256px",
                    transform: "translate(-50%, -50%) scale(0.5)",
                    transformOrigin: "center",
                  }}
                >
                  <div
                    className="w-full h-full relative overflow-hidden"
                    style={{
                      transform: `translate(${savedImagePosition.x}px, ${savedImagePosition.y}px) scale(${savedImageScale})`,
                      transformOrigin: "center",
                    }}
                  >
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            {/* End of updated profile picture configuration */}
            <button
              type="button"
              onClick={() => setIsAvatarChangePopupOpen(true)}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#7b68ee] rounded-full flex items-center justify-center shadow-lg"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </div>
          <p className="text-sm text-gray-500">프로필 사진 변경</p>
        </div>

        <div className="flex flex-col items-start">
          <div className="w-full space-y-2 mt-4">
            <Label htmlFor="nickname" className="text-sm font-medium text-gray-700">
              {isInfluencerMode ? "닉네임" : "브랜드 이름"}
              {!isInfluencerMode && <span className="text-gray-400 text-xs font-normal ml-1">(필수)</span>}
            </Label>
            <Input
              id="nickname"
              value={isInfluencerMode ? influencerNickname : brandName}
              onChange={(e) =>
                isInfluencerMode ? setInfluencerNickname(e.target.value) : setBrandName(e.target.value)
              }
              className="h-12 rounded-xl border-gray-300 focus:border-[#7b68ee] focus:ring-[#7b68ee]"
              placeholder={isInfluencerMode ? "닉네임을 입력하세요" : "브랜드 이름을 입력하세요"}
            />
          </div>
        </div>

        {/* Influencer Mode Specific Fields */}
        {isInfluencerMode && (
          <>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">콘텐츠 카테고리</Label>
              <p className="text-sm text-gray-500">
                인플루언서님이 자신있는 순서로 카테고리를 최대 3개까지 선택해주세요
              </p>
              <div className="flex flex-wrap gap-2">
                {CONTENT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleSelectCategory(cat)}
                    className={`relative px-3 py-2 rounded-full text-sm border transition-colors ${
                      rankedCategories.includes(cat)
                        ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {cat}
                    {rankedCategories.includes(cat) && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-[#7b68ee]">
                        <span className="text-xs font-bold text-[#7b68ee]">{rankedCategories.indexOf(cat) + 1}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* </CHANGE> Removed platform authentication section including header, buttons, and additional platforms */}

            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-700">인플루언서 소개글</Label>
              <p className="text-sm text-gray-500">인플루언서님을 광고주분들에게 마음껏 소개해요</p>
              <textarea
                ref={bioTextareaRef}
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full min-h-[160px] px-4 py-3 rounded-xl border border-gray-300 focus:border-[#7b68ee] focus:ring-[#7b68ee] resize-none overflow-hidden"
                placeholder="자신을 소개하는 글을 작성해주세요"
                style={{ height: "auto" }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="activity-rate" className="text-base font-semibold text-gray-700">
                  활동 단가
                </Label>
                <button
                  type="button"
                  onClick={() => setIsActivityRatePrivate(!isActivityRatePrivate)}
                  className="flex items-center gap-1 focus:outline-none"
                >
                  {isActivityRatePrivate ? (
                    <CheckCircle2 className="w-6 h-6 text-[#7b68ee]" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-500">비공개</span>
                </button>
              </div>
              <div className="relative">
                <textarea
                  ref={activityRateTextareaRef}
                  id="activity-rate"
                  value={activityRate}
                  onChange={(e) => setActivityRate(e.target.value)}
                  disabled={isActivityRatePrivate}
                  className={`w-full min-h-[96px] px-4 py-3 rounded-xl border border-gray-300 focus:border-[#7b68ee] focus:ring-[#7b68ee] resize-none overflow-hidden ${
                    isActivityRatePrivate ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
                  }`}
                  placeholder={
                    isActivityRatePrivate
                      ? ""
                      : "릴스 1회당 가격, 게시물 1회당 가격, 패키지로 구성된 가격등 자유롭게 입력하세요."
                  }
                  style={{ height: "auto" }}
                />
                {isActivityRatePrivate && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              {isActivityRatePrivate && (
                <p className="text-sm text-gray-500">더 이상 인플루언서님의 프로필에 단가가 공개되지 않아요.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-700">포트폴리오</Label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {portfolioFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0 w-32 aspect-[9/16] rounded-lg overflow-hidden bg-gray-100"
                  >
                    {file.type === "video" ? (
                      <video src={file.url} className="w-full h-full object-cover" />
                    ) : (
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemovePortfolioFile(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => portfolioInputRef.current?.click()}
                  className="flex-shrink-0 w-32 aspect-[9/16] rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-[#7b68ee] hover:text-[#7b68ee] transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-sm">파일 업로드</span>
                </button>
              </div>
              <input
                ref={portfolioInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handlePortfolioUpload}
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-700">활동 지역</Label>
              <div className="flex gap-2">
                <select
                  value={broadRegion}
                  onChange={(e) => handleBroadRegionChange(e.target.value)}
                  className="flex-1 h-12 rounded-xl border-gray-300 focus:border-[#7b68ee] focus:ring-[#7b68ee] px-3"
                >
                  <option value="placeholder">시/도 선택</option>
                  <option value="전체">전체</option>
                  {Object.keys(REGIONS).map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                <select
                  value={narrowRegion}
                  onChange={(e) => setNarrowRegion(e.target.value)}
                  className="flex-1 h-12 rounded-xl border-gray-300 focus:border-[#7b68ee] focus:ring-[#7b68ee] px-3"
                  disabled={!broadRegion || broadRegion === "전체"}
                >
                  <option value="placeholder">구/군 선택</option>
                  <option value="전체">전체</option>
                  {broadRegion &&
                    broadRegion !== "전체" &&
                    REGIONS[broadRegion]?.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="profile-hashtags" className="text-base font-semibold text-gray-700">
                  해시태그
                </Label>
                <span className="text-sm text-gray-400">(최대 3개)</span>
              </div>
              <p className="text-sm text-gray-500">인플루언서님이 자주 사용하는 해시태그를 입력해주세요.</p>
              <div className="border border-gray-300 rounded-xl p-3 min-h-[48px] flex flex-wrap gap-2 items-center focus-within:border-[#7b68ee] focus-within:ring-1 focus-within:ring-[#7b68ee] transition-colors">
                {profileHashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-500 rounded-full text-sm border border-blue-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeProfileHashtagTag(tag)}
                      className="text-blue-400 hover:text-blue-600 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  id="profile-hashtags"
                  type="text"
                  placeholder={profileHashtags.length === 0 ? "#뷰티 #메이크업 #스킨케어" : ""}
                  value={profileHashtagInput}
                  onChange={handleProfileHashtagInputChange}
                  onKeyDown={handleProfileHashtagKeyDown}
                  className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold text-gray-700">
                  경력 입력하기 <span className="text-sm font-normal text-gray-500">(선택)</span>
                </Label>
              </div>
              <p className="text-sm text-gray-500">인플루언서님이 진행하셨던 협업이 있다면 경력을 추가해주세요</p>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="career-title" className="text-sm text-gray-700">
                    협업 제목
                  </Label>
                  <Input
                    id="career-title"
                    value={newCareerEntry.title}
                    onChange={(e) => setNewCareerEntry({ ...newCareerEntry, title: e.target.value })}
                    className="mt-1 h-12 rounded-xl border-gray-300 focus:border-[#7b68ee] focus:ring-[#7b68ee]"
                    placeholder="예: 패션 브랜드 협업 스타일링"
                  />
                </div>

                <div>
                  <Label htmlFor="career-category" className="text-sm text-gray-700">
                    카테고리
                  </Label>
                  <select
                    value={newCareerEntry.category}
                    onChange={(e) => setNewCareerEntry({ ...newCareerEntry, category: e.target.value })}
                    className="w-full mt-1 h-12 rounded-xl border border-gray-300 focus:border-[#7b68ee] focus:ring-[#7b68ee] px-3"
                  >
                    <option value="placeholder">카테고리 선택</option>
                    {CONTENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="career-date" className="text-sm text-gray-700">
                    협업 날짜
                  </Label>
                  <Input
                    id="career-date"
                    type="date"
                    value={newCareerEntry.date}
                    onChange={(e) => setNewCareerEntry({ ...newCareerEntry, date: e.target.value })}
                    className="mt-1 h-12 rounded-xl border-gray-300 focus:border-[#7b68ee] focus:ring-[#7b68ee]"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleAddCareerEntry}
                  disabled={
                    !newCareerEntry.title ||
                    !newCareerEntry.category ||
                    !newCareerEntry.date ||
                    careerEntries.length >= 3
                  }
                  className="w-full h-10 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  경력 추가하기 ({careerEntries.length}/3)
                </Button>
              </div>

              {careerEntries.length > 0 && (
                <div className="space-y-2 mt-4">
                  <Label className="text-sm text-gray-700">추가된 경력</Label>
                  {careerEntries.map((entry, index) => (
                    <div key={index} className="rounded-2xl bg-white border border-gray-100 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-black text-sm leading-tight">{entry.title}</h4>
                        <button
                          type="button"
                          onClick={() => handleRemoveCareerEntry(index)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                        <span>{entry.date}</span>
                        <span>•</span>
                        <span>사용자 경력</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="bg-[#7b68ee]/10 text-[#7b68ee] font-medium text-xs px-2 py-1 rounded">
                          {entry.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Advertiser Mode Specific Fields */}
        {!isInfluencerMode && (
          <>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                브랜드 카테고리 <span className="text-gray-400 text-xs font-normal">(필수)</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {BRAND_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleSelectBrandCategory(cat)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm border transition-colors ${
                      brandCategory === cat
                        ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {categoryIcons[cat]}
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                매장 유형 <span className="text-gray-400 text-xs font-normal">(필수)</span>
              </Label>
              <div className="flex gap-2">
                {STORE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleSelectStoreType(type.id)}
                    className={`px-3 py-2 rounded-full text-sm border transition-colors ${
                      storeType === type.id
                        ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 매장 위치 - Required for offline/both */}
            {(storeType === "offline" || storeType === "both") && (
              <div className="space-y-2">
                <Label htmlFor="offline-location" className="text-sm font-medium text-gray-700">
                  매장 위치 <span className="text-gray-400 text-xs font-normal">(필수)</span>
                </Label>
                <Input
                  id="offline-location"
                  value={offlineLocation}
                  onChange={(e) => setOfflineLocation(e.target.value)}
                  className="h-12 rounded-xl border-gray-300 focus:border-[#7b68ee] focus:ring-[#7b68ee]"
                  placeholder="예: 서울시 강남구"
                />
              </div>
            )}

            {storeType === "offline" && (
              <div className="space-y-2">
                <Label htmlFor="brand-link-offline" className="text-sm font-medium text-gray-700">
                  브랜드 주소 <span className="text-gray-400 text-xs font-normal">(선택)</span>
                </Label>
                <Input
                  id="brand-link-offline"
                  value={brandLink}
                  onChange={(e) => setBrandLink(e.target.value)}
                  className="h-12 rounded-xl border-gray-300 focus:border-[#7b68ee] focus:ring-[#7b68ee]"
                  placeholder="브랜드 웹사이트 주소를 입력하세요"
                />
              </div>
            )}

            {/* 브랜드 주소 - Required for online/both */}
            {(storeType === "online" || storeType === "both") && (
              <div className="space-y-2">
                <Label htmlFor="brand-link" className="text-sm font-medium text-gray-700">
                  브랜드 주소 <span className="text-gray-400 text-xs font-normal">(필수)</span>
                </Label>
                <Input
                  id="brand-link"
                  value={brandLink}
                  onChange={(e) => setBrandLink(e.target.value)}
                  className="h-12 rounded-xl border-gray-300 focus:border-[#7b68ee] focus:ring-[#7b68ee]"
                  placeholder="브랜드 웹사이트 주소를 입력하세요"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <Label htmlFor="business-number" className="text-sm font-medium text-gray-700">
                    사업자등록번호 <span className="text-gray-400 text-xs font-normal">(필수)</span>
                  </Label>
                  <button
                    type="button"
                    onClick={handleBusinessNumberLookup}
                    className="px-3 py-1 rounded-lg bg-[#7b68ee] text-white text-sm font-medium hover:bg-[#6a5acd] transition-colors flex items-center gap-1"
                  >
                    <Search className="w-4 h-4" />
                    조회하기
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                사업자등록번호는 사장님의 사칭을 방지하기 위한 확인용이에요.
                <br />
                무단 도용시 처벌 받을 수 있어요.
              </p>
              <div className="flex gap-2 items-center">
                <Input
                  ref={businessNum1Ref}
                  id="business-number-1"
                  value={businessNum1}
                  onChange={handleBusinessNum1Change}
                  className="h-12 rounded-xl border-gray-300 focus:border-[#7b68ee] focus:ring-[#7b68ee] flex-1 text-center"
                  placeholder="123"
                  maxLength={3}
                  inputMode="numeric"
                />
                <span className="text-gray-400">-</span>
                <Input
                  ref={businessNum2Ref}
                  id="business-number-2"
                  value={businessNum2}
                  onChange={handleBusinessNum2Change}
                  className="h-12 rounded-xl border-gray-300 focus:border-[#7b68ee] focus:ring-[#7b68ee] flex-1 text-center"
                  placeholder="45"
                  maxLength={2}
                  inputMode="numeric"
                />
                <span className="text-gray-400">-</span>
                <Input
                  ref={businessNum3Ref}
                  id="business-number-3"
                  value={businessNum3}
                  onChange={handleBusinessNum3Change}
                  className="h-12 rounded-xl border-gray-300 focus:border-[#7b68ee] focus:ring-[#7b68ee] flex-[1.5] text-center"
                  placeholder="67890"
                  maxLength={5}
                  inputMode="numeric"
                />
              </div>
              {businessNumberStatus === "success" && (
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-green-600">사업자 번호가 확인됐어요.</p>
                </div>
              )}
              {businessNumberStatus === "error" && (
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-500">조회되지 않는 사업자 번호에요</p>
                </div>
              )}
            </div>
          </>
        )}

        <button
          type="button"
          onClick={handleSave}
          className="w-full h-12 rounded-xl bg-[#7b68ee] text-white font-medium hover:bg-[#6a5acd] transition-colors mb-6"
        >
          저장하기
        </button>
      </main>

      {/* Image Position Adjustment Dialog */}
      {isAdjustingImage && tempImageUrl && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">사진 위치 조정</h3>
              <button type="button" onClick={handleCancelImageAdjustment} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-gray-100 p-4">
              <div
                ref={containerRef}
                className="relative w-full max-w-[400px] aspect-square flex items-center justify-center"
              >
                <img
                  ref={imageAdjustRef}
                  src={tempImageUrl || "/placeholder.svg"}
                  alt="Adjust position"
                  className="absolute cursor-move select-none"
                  style={{
                    maxWidth: "400px",
                    maxHeight: "400px",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                    transformOrigin: "center",
                    left: "50%",
                    top: "50%",
                    translate: "-50% -50%",
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  draggable={false}
                />
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {isInfluencerMode ? (
                  <>
                    {/* 상단 음영 */}
                    <div
                      className="absolute top-0 left-0 right-0 bg-black/60"
                      style={{ height: "calc(50% - 128px)" }}
                    />
                    {/* 하단 음영 */}
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-black/60"
                      style={{ height: "calc(50% - 128px)" }}
                    />
                    {/* 좌측 음영 */}
                    <div
                      className="absolute left-0 bg-black/60"
                      style={{ top: "calc(50% - 128px)", height: "256px", width: "calc(50% - 160px)" }}
                    />
                    {/* 우측 음영 */}
                    <div
                      className="absolute right-0 bg-black/60"
                      style={{ top: "calc(50% - 128px)", height: "256px", width: "calc(50% - 160px)" }}
                    />

                    <div className="border-2 border-[#7b68ee] relative z-10 w-[320px] h-[256px] rounded-2xl" />
                  </>
                ) : (
                  <>
                    <div
                      className="absolute inset-0 bg-black/60"
                      style={{
                        maskImage:
                          "radial-gradient(circle 128px at center, transparent 0%, transparent 128px, black 128px, black 128px)",
                        WebkitMaskImage:
                          "radial-gradient(circle 128px at center, transparent 0%, transparent 128px, black 128px, black 128px)",
                      }}
                    />
                    <div className="w-[256px] h-[256px] rounded-full border-2 border-[#7b68ee] relative z-10" />
                  </>
                )}
              </div>
            </div>

            <div className="px-4 pb-4 border-t border-gray-200 space-y-3 pt-4">
              <p className="text-xs text-center text-gray-500">두 손가락으로 확대/축소할 수 있어요</p>
              <button
                type="button"
                onClick={handleSaveImagePosition}
                className="w-full h-12 rounded-xl bg-[#7b68ee] text-white font-medium hover:bg-[#6a5acd] transition-colors"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Change Popup */}
      {isAvatarChangePopupOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsAvatarChangePopupOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-[280px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3">
              <button
                type="button"
                onClick={handleChangeProfilePicture}
                className="w-full py-2.5 text-center text-gray-700 hover:bg-gray-50 transition-colors rounded-lg text-sm"
              >
                프로필 사진 변경하기
              </button>
              <div className="border-t border-gray-200 my-1.5" />
              <button
                type="button"
                onClick={handleChangeToDefaultImage}
                className="w-full py-2.5 text-center text-gray-700 hover:bg-gray-50 transition-colors rounded-lg text-sm"
              >
                기본이미지로 변경
              </button>
              <div className="border-t border-gray-200 my-1.5" />
              <button
                type="button"
                onClick={() => setIsAvatarChangePopupOpen(false)}
                className="w-full py-2.5 text-center text-gray-500 hover:bg-gray-50 transition-colors rounded-lg text-sm"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Preview Dialog */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between h-14 px-4">
                <h3 className="text-lg font-semibold">프로필 미리보기</h3>
                <button onClick={() => setIsPreviewOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Preview Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-6 space-y-6">
                {/* Profile Header */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`overflow-hidden border-2 border-gray-200 relative bg-gray-100 flex-shrink-0 ${isInfluencerMode ? "w-30 h-24 rounded-2xl" : "w-24 h-24 rounded-full"}`}
                    >
                      {isInfluencerMode ? (
                        <div
                          className="absolute left-1/2 top-1/2"
                          style={{
                            width: "320px",
                            height: "256px",
                            transform: "translate(-50%, -50%)",
                            transformOrigin: "center",
                          }}
                        >
                          <div
                            className="w-full h-full relative overflow-hidden"
                            style={{
                              transform: `translate(${savedImagePosition.x * 0.5}px, ${savedImagePosition.y * 0.5}px) scale(${savedImageScale})`,
                              transformOrigin: "center",
                            }}
                          >
                            <img
                              src={photoPreview || avatar || "/placeholder.svg"}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ) : (
                        // 미리보기 시 광고주 모드 이미지 크기 조정
                        <div
                          className="absolute left-1/2 top-1/2"
                          style={{
                            width: "256px",
                            height: "256px",
                            transform: "translate(-50%, -50%) scale(0.5)",
                            transformOrigin: "center",
                          }}
                        >
                          <div
                            className="w-full h-full relative overflow-hidden"
                            style={{
                              transform: `translate(${savedImagePosition.x}px, ${savedImagePosition.y}px) scale(${savedImageScale})`,
                              transformOrigin: "center",
                            }}
                          >
                            <img
                              src={photoPreview || avatar || "/placeholder.svg"}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-black">{influencerNickname || "닉네임"}</h2>
                        {isInstagramVerified && (
                          <div className="w-5 h-5 bg-[#7b68ee] rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{activityRegion || "활동 지역"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-left">
                        <div className="text-sm font-semibold text-[#7b68ee]">팔로워 수</div>
                        <div className="text-xl font-bold text-black">-</div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-[#7b68ee]">게시물 수</div>
                        <div className="text-xl font-bold text-black">-</div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-[#7b68ee]">평균 참여율</div>
                        <div className="text-xl font-bold text-black">-</div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-[#7b68ee]">평균 좋아요</div>
                        <div className="text-xl font-bold text-black">-</div>
                      </div>
                    </div>
                  </div>

                  {profileHashtags.length > 0 && (
                    <div className="space-y-2 mt-5">
                      <p className="text-sm text-gray-600">
                        {influencerNickname || "인플루언서"}님이 자주 사용하는 해시태그에요.
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {profileHashtags.map((hashtag, index) => (
                          <div key={index} className="px-3 py-1 bg-blue-50 rounded-full">
                            <span className="text-sm text-blue-500">{hashtag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Combined social media buttons */}
                {(instagramId ||
                  additionalPlatforms.filter((p) => p.type && p.url && p.type !== "플랫폼 선택").length > 0) && (
                  <div className="-mx-4 px-4 space-y-2">
                    {instagramId && (
                      <button className="w-full h-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Instagram className="w-5 h-5 text-[#E4405F]" />
                        <span className="font-medium text-gray-700">인스타그램 바로가기</span>
                      </button>
                    )}

                    {additionalPlatforms.map(
                      (platform, index) =>
                        platform.url &&
                        platform.type &&
                        platform.type !== "플랫폼 선택" && (
                          <button
                            key={index}
                            className="w-full h-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center gap-2"
                          >
                            {platform.type === "블로그" && <BookOpen className="w-5 h-5 text-green-600" />}
                            {platform.type === "유튜브" && <Youtube className="w-5 h-5 text-red-600" />}
                            <span className="font-medium text-gray-700">{platform.type} 바로가기</span>
                          </button>
                        ),
                    )}
                  </div>
                )}

                {/* Tabs */}
                <div className="sticky z-40 bg-white -mx-4 px-4">
                  <div className="relative border-b border-gray-200">
                    <div className="flex">
                      <button
                        onClick={() => setPreviewActiveTab("소개")}
                        className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${
                          previewActiveTab === "소개" ? "text-black" : "text-gray-400"
                        }`}
                      >
                        소개
                      </button>
                      <button
                        onClick={() => setPreviewActiveTab("경력")}
                        className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${
                          previewActiveTab === "경력" ? "text-black" : "text-gray-400"
                        }`}
                      >
                        경력
                      </button>
                    </div>
                    <div
                      className="absolute bottom-0 h-0.5 bg-[#7b68ee] transition-transform duration-300 ease-out"
                      style={{
                        width: "50%",
                        transform: previewActiveTab === "소개" ? "translateX(0)" : "translateX(100%)",
                      }}
                    />
                  </div>
                </div>

                {/* Tab Content */}
                {previewActiveTab === "소개" && (
                  <div className="space-y-6">
                    {bio && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-black">인플루언서 소개</h3>
                        <div className="rounded-2xl border border-gray-100 px-5 py-3">
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{bio}</p>
                        </div>
                      </div>
                    )}

                    {portfolioFiles.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-black">포트폴리오</h3>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {portfolioFiles.map((file, index) => (
                            <div
                              key={index}
                              className="rounded-2xl overflow-hidden aspect-[9/16] flex-shrink-0 w-32 border border-gray-100"
                            >
                              {file.type === "video" ? (
                                <video src={file.url} className="w-full h-full object-cover" />
                              ) : (
                                <img
                                  src={file.url || "/placeholder.svg"}
                                  alt={`Portfolio ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(activityRate || isActivityRatePrivate) && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-black">활동 단가</h3>
                        <div className="rounded-2xl border border-gray-100 px-5 py-3">
                          {isActivityRatePrivate ? (
                            <div className="relative">
                              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap blur-sm select-none">
                                포스팅 1회당 25-60만원
                                {"\n"}스토리 1회당 10-20만원
                              </div>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <Lock className="w-8 h-8 text-gray-600 mb-2" />
                                <p className="text-sm text-gray-600 text-center px-4">
                                  단가를 비공개로 설정하셨어요.
                                  <br />
                                  인플루언서님에게 직접 문의해주세요.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {activityRate}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {(broadRegion || narrowRegion) && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-black">활동 지역</h3>
                        <div className="flex gap-2 flex-wrap">
                          <div className="px-3 py-1 bg-gray-100 rounded-full">
                            <span className="text-sm text-gray-700">{activityRegion}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {rankedCategories.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-black">콘텐츠 카테고리</h3>
                        <div className="flex gap-2 flex-wrap">
                          {rankedCategories.map((cat: string, index: number) => (
                            <div key={index} className="px-4 py-2 bg-gray-100 rounded-lg">
                              <span className="text-sm text-gray-700">{cat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {additionalPlatforms.some((p) => p.url) && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-black">추가 플랫폼</h3>
                        <div className="flex flex-col gap-2">
                          {additionalPlatforms.map(
                            (platform, index) =>
                              platform.url && (
                                <div key={index} className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-600">{platform.type}:</span>
                                  <a
                                    href={platform.url.startsWith("http") ? platform.url : `https://${platform.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-500 hover:underline break-all"
                                  >
                                    {platform.url}
                                  </a>
                                </div>
                              ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {previewActiveTab === "경력" && (
                  <div className="space-y-2">
                    {careerEntries.length > 0 ? (
                      careerEntries.map((entry, index) => (
                        <Card key={index} className="rounded-2xl bg-white border border-gray-100 shadow-none">
                          <CardContent className="pl-5 pr-2 py-4">
                            <h4 className="font-bold text-black text-sm mb-2 leading-tight">{entry.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                              <span>{entry.date}</span>
                              <span>•</span>
                              <span>사용자 경력</span>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <span className="bg-[#7b68ee]/10 text-[#7b68ee] font-medium text-xs px-2 py-1 rounded">
                                {entry.category}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>추가된 경력이 없습니다</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
