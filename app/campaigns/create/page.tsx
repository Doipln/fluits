"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCampaigns } from "@/lib/campaign-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  MapPin,
  Home,
  Coffee,
  UtensilsCrossed,
  Shirt,
  Sparkles,
  Heart,
  Plane,
  Calendar,
  Baby,
  PawPrint,
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const categories = [
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

const categoryHashtags = {
  카페: ["#카페", "#커피", "#디저트", "#카페스타그램"],
  음식점: ["#맛집", "#음식", "#맛스타그램", "#푸드"],
  "패션/의류": ["#패션", "#OOTD", "#스타일링", "#패션아이템"],
  "뷰티/화장품": ["#뷰티", "#화장품", "#스킨케어", "#메이크업"],
  "라이프/서비스": ["#라이프스타일", "#일상", "#서비스", "#리뷰"],
  "여행/숙박": ["#여행", "#숙박", "#호텔", "#펜션"],
  "이벤트/축제": ["#이벤트", "#축제", "#행사", "#문화"],
  "키즈/유아": ["#육아", "#베이비용품", "#키즈", "#육아템"],
  "펫/반려동물": ["#반려동물", "#펫", "#강아지", "#고양이"],
}

const getContentTypes = (platform: "instagram" | "blog" | "") => {
  if (platform === "instagram") {
    return ["릴스", "피드", "스토리 체험단"]
  } else if (platform === "blog") {
    return ["블로그 포스팅"]
  }
  return []
}

const videoDurations = ["15초 이상", "30초 이상", "45초 이상"]

export default function CampaignCreatePage() {
  const router = useRouter()
  const { campaigns, addCampaign } = useCampaigns()

  const [selectedPlatform, setSelectedPlatform] = useState<"instagram" | "blog" | "">("")

  const [selectedCategory, setSelectedCategory] = useState("")
  const [title, setTitle] = useState("")
  const [recruitType, setRecruitType] = useState<"one" | "multiple" | "">("")
  const [recruitCount, setRecruitCount] = useState("")
  const [visitType, setVisitType] = useState<"visit" | "non-visit" | "">("")
  const [selectedRewardType, setSelectedRewardType] = useState<"payment" | "product" | "other" | "meal" | "">("")
  const [paymentBudgetType, setPaymentBudgetType] = useState<"fixed" | "negotiable" | "">("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [isDealPossible, setIsDealPossible] = useState(false)
  const [productName, setProductName] = useState("")
  const [otherReward, setOtherReward] = useState("")
  const [mealType, setMealType] = useState("")
  const [additionalRewardInfo, setAdditionalRewardInfo] = useState("")
  const [showAdditionalRewardInfo, setShowAdditionalRewardInfo] = useState(false)
  const [visitTimeInfo, setVisitTimeInfo] = useState("")
  const [showVisitTimeInfo, setShowVisitTimeInfo] = useState(false)
  const [preferentialInfo, setPreferentialInfo] = useState("")
  const [showPreferentialInfo, setShowPreferentialInfo] = useState(false)
  const [selectedContentType, setSelectedContentType] = useState("")
  const [customVideoDuration, setCustomVideoDuration] = useState("")
  const [selectedVideoDuration, setSelectedVideoDuration] = useState("")
  const [selectedContentOptions, setSelectedContentOptions] = useState<string[]>([])
  const [selectedSceneOptions, setSelectedSceneOptions] = useState<string[]>([])
  const [hashtagTags, setHashtagTags] = useState<string[]>([])
  const [hashtagInput, setHashtagInput] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [additionalMemo, setAdditionalMemo] = useState("")
  const [showCustomVideoInput, setShowCustomVideoInput] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [contentText, setContentText] = useState("")
  const [sceneText, setSceneText] = useState("")
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showLinkUpload, setShowLinkUpload] = useState(false)
  const [showAdditionalMemo, setShowAdditionalMemo] = useState(false)
  const [isBrandTagRequired, setIsBrandTagRequired] = useState(false)
  const [brandInstagram, setBrandInstagram] = useState("")
  const [isLocationTagRequired, setIsLocationTagRequired] = useState(false)
  const [storeLocation, setStoreLocation] = useState("")

  const [contentOptions, setContentOptions] = useState<Array<{ key: string; label: string; hint: string }>>([])
  const [sceneOptions, setSceneOptions] = useState<Array<{ key: string; label: string; hint: string }>>([])

  useEffect(() => {
    console.log("[v0] Campaign create page mounted")
  }, [])

  useEffect(() => {
    if (selectedCategory && selectedContentType) {
      fetchOptions()
    }
  }, [selectedCategory, selectedContentType, visitType]) // Added visitType to dependencies

  const fetchOptions = async () => {
    try {
      const response = await fetch(`/api/options?category=${encodeURIComponent(selectedCategory)}`)
      if (response.ok) {
        const data = await response.json()
        const contentTypeKey =
          selectedContentType === "릴스"
            ? "reels"
            : selectedContentType === "피드"
              ? "feed"
              : selectedContentType === "스토리 체험단"
                ? "story"
                : "blog" // Added 'blog' case

        let fetchedContentOptions = data[contentTypeKey]?.content || []

        if (visitType === "visit") {
          const directionsOption = {
            key: "directions",
            label: "오시는길",
            hint: "매장이나 현장을 찾아오는 방법을 안내해주세요.",
          }
          // Check if it doesn't already exist
          const hasDirections = fetchedContentOptions.some((opt: any) => opt.key === "directions")
          if (!hasDirections) {
            fetchedContentOptions = [...fetchedContentOptions, directionsOption]
          }
        }

        setContentOptions(fetchedContentOptions)
        setSceneOptions(data[contentTypeKey]?.scenes || [])
      }
    } catch (error) {
      console.error("[v0] Failed to fetch options:", error)
    }
  }

  const handleHashtagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setHashtagInput(value)

    if (value.includes(" ") || (value.includes("#") && value.lastIndexOf("#") > 0)) {
      const tags = value.split(/[\s#]+/).filter((tag) => tag.trim() !== "")
      const newTags = tags.map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
      const uniqueTags = [...new Set([...hashtagTags, ...newTags])]
      setHashtagTags(uniqueTags)
      setHashtagInput("")
    }
  }

  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const value = hashtagInput.trim()
      if (value) {
        const tag = value.startsWith("#") ? value : `#${value}`
        if (!hashtagTags.includes(tag)) {
          setHashtagTags([...hashtagTags, tag])
        }
        setHashtagInput("")
      }
    } else if (e.key === "Backspace" && hashtagInput === "" && hashtagTags.length > 0) {
      setHashtagTags(hashtagTags.slice(0, -1))
    }
  }

  const addHashtagTag = (tag: string) => {
    if (!hashtagTags.includes(tag)) {
      setHashtagTags([...hashtagTags, tag])
    }
  }

  const removeHashtagTag = (tagToRemove: string) => {
    setHashtagTags(hashtagTags.filter((tag) => tag !== tagToRemove))
  }

  const handleRewardTypeToggle = (type: "payment" | "product" | "other" | "meal") => {
    if (selectedRewardType === type) {
      setSelectedRewardType("")
      setPaymentBudgetType("")
      setPaymentAmount("")
      setProductName("")
      setOtherReward("")
      setMealType("")
      setIsDealPossible(false)
    } else {
      setSelectedRewardType(type)
      if (type !== "payment") {
        setPaymentBudgetType("")
        setPaymentAmount("")
        setIsDealPossible(false)
      }
      if (type !== "product") {
        setProductName("")
      }
      if (type !== "other") {
        setOtherReward("")
      }
      if (type !== "meal") {
        setMealType("")
      }
    }
  }

  const handlePaymentBudgetTypeToggle = (type: "fixed" | "negotiable") => {
    if (paymentBudgetType === type) {
      setPaymentBudgetType("")
      setPaymentAmount("")
      setIsDealPossible(false)
    } else {
      setPaymentBudgetType(type)
      if (type === "negotiable") {
        setPaymentAmount("인플루언서와 직접 협의")
        setIsDealPossible(false)
      } else {
        setPaymentAmount("")
      }
    }
  }

  const handleRecruitTypeToggle = (type: "one" | "multiple") => {
    if (recruitType === type) {
      setRecruitType("")
      setRecruitCount("")
    } else {
      setRecruitType(type)
      if (type === "one") {
        setRecruitCount("1")
      }
    }
  }

  const handleVisitTypeToggle = (type: "visit" | "non-visit") => {
    setVisitType(visitType === type ? "" : type)
  }

  const handleContentTypeToggle = (type: string) => {
    setSelectedContentType(selectedContentType === type ? "" : type)
  }

  const toggleContentOption = (option: { key: string; label: string; hint: string }) => {
    setSelectedContentOptions((prev) => {
      if (prev.includes(option.label)) {
        // Remove option
        const newOptions = prev.filter((item) => item !== option.label)
        // Update textarea
        const newText = contentOptions
          .filter((opt) => newOptions.includes(opt.label))
          .map((opt) => `${opt.label}: ${opt.hint}`)
          .join("\n\n")
        setContentText(newText)
        return newOptions
      } else {
        // Add option (no max limit)
        const newOptions = [...prev, option.label]
        // Update textarea
        const newText = contentOptions
          .filter((opt) => newOptions.includes(opt.label))
          .map((opt) => `${opt.label}: ${opt.hint}`)
          .join("\n\n")
        setContentText(newText)
        return newOptions
      }
    })
  }

  const toggleSceneOption = (option: { key: string; label: string; hint: string }) => {
    setSelectedSceneOptions((prev) => {
      if (prev.includes(option.label)) {
        // Remove option
        const newOptions = prev.filter((item) => item !== option.label)
        // Update textarea
        const newText = sceneOptions
          .filter((opt) => newOptions.includes(opt.label))
          .map((opt) => `${opt.label}: ${opt.hint}`)
          .join("\n\n")
        setSceneText(newText)
        return newOptions
      } else {
        // Add option (no max limit)
        const newOptions = [...prev, option.label]
        // Update textarea
        const newText = sceneOptions
          .filter((opt) => newOptions.includes(opt.label))
          .map((opt) => `${opt.label}: ${opt.hint}`)
          .join("\n\n")
        setSceneText(newText)
        return newOptions
      }
    })
  }

  const handleVideoDurationToggle = (duration: string) => {
    if (selectedVideoDuration === duration) {
      setSelectedVideoDuration("")
    } else {
      setSelectedVideoDuration(duration)
      setCustomVideoDuration("")
      setShowCustomVideoInput(false)
    }
  }

  const handleCustomVideoToggle = () => {
    if (showCustomVideoInput) {
      setShowCustomVideoInput(false)
      setCustomVideoDuration("")
      setSelectedVideoDuration("")
    } else {
      setShowCustomVideoInput(true)
      setSelectedVideoDuration("")
    }
  }

  const handleCategoryToggle = (category: string) => {
    if (selectedCategory !== category) {
      setSelectedContentOptions([])
      setSelectedSceneOptions([])
      setContentText("")
      setSceneText("")
    }
    setSelectedCategory(selectedCategory === category ? "" : category)
  }

  const handlePlatformToggle = (platform: "instagram" | "blog") => {
    if (selectedPlatform === platform) {
      setSelectedPlatform("")
      setSelectedContentType("")
    } else {
      setSelectedPlatform(platform)
      if (platform === "blog") {
        setSelectedContentType("블로그 포스팅")
      } else {
        setSelectedContentType("")
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(files)])
    }
  }

  const handleSubmit = () => {
    if (!selectedPlatform) {
      alert("플랫폼을 선택해주세요.")
      return
    }
    if (!selectedContentType) {
      alert("콘텐츠 유형을 선택해주세요.")
      return
    }
    if (!selectedCategory) {
      alert("카테고리를 선택해주세요.")
      return
    }
    if (!title.trim()) {
      alert("캠페인 제목을 입력해주세요.")
      return
    }
    if (!recruitType) {
      alert("모집 인원을 선택해주세요.")
      return
    }
    if (!selectedRewardType) {
      alert("제공 내역을 선택해주세요.")
      return
    }

    let rewardString = ""
    if (selectedRewardType === "payment" && paymentAmount) {
      rewardString = paymentAmount === "인플루언서와 직접 협의" ? "협의 후 결정" : `${paymentAmount}만원`
    } else if (selectedRewardType === "product" && productName) {
      rewardString = `제품 제공`
    } else if (selectedRewardType === "other" && otherReward) {
      rewardString = otherReward
    } else if (selectedRewardType === "meal" && mealType) {
      rewardString = mealType
    } else if (selectedRewardType === "payment" && paymentBudgetType === "negotiable") {
      rewardString = "협의 후 결정"
    } else {
      rewardString = "협의 후 결정"
    }

    const finalRecruitCount = recruitType === "one" ? "1" : recruitCount

    const uploadedPhotoUrls = uploadedFiles.map((file) => URL.createObjectURL(file))

    const newCampaign: any = {
      id: Date.now(),
      title: title.trim(),
      category: selectedCategory,
      reward: rewardString,
      recruitCount: finalRecruitCount,
      status: "진행중",
      applicants: 0,
      views: 0,
      likes: 0,
      comments: 0,
      timeAgo: "방금 전",
      createdAt: new Date().toISOString(),
      isUserCreated: true,
      rewardType: selectedRewardType,
      contentType: selectedContentType,
      videoDuration: selectedVideoDuration || customVideoDuration,
      requiredContent: contentText,
      requiredScenes: sceneText,
      hashtags: hashtagTags,
      linkUrl,
      additionalMemo,
      isDealPossible,
      visitType,
      isBrandTagRequired,
      brandInstagram,
      isLocationTagRequired,
      storeLocation,
      // Add platform to campaign object
      platform: selectedPlatform,
    }

    if (selectedRewardType === "payment") {
      if (paymentBudgetType === "fixed") {
        newCampaign.paymentAmount = paymentAmount
      }
      if (isDealPossible) {
        newCampaign.isDealPossible = true
      }
    }
    if (selectedRewardType === "product" && productName) {
      newCampaign.productName = productName
    }
    if (selectedRewardType === "other" && otherReward) {
      newCampaign.otherReward = otherReward
    }
    if (selectedRewardType === "meal" && mealType) {
      newCampaign.mealType = mealType
    }
    if (additionalRewardInfo) {
      newCampaign.additionalRewardInfo = additionalRewardInfo
    }
    if (visitTimeInfo) {
      newCampaign.visitTimeInfo = visitTimeInfo
    }
    if (preferentialInfo) {
      newCampaign.preferentialInfo = preferentialInfo
    }
    if (uploadedPhotoUrls.length > 0) {
      newCampaign.uploadedPhotos = uploadedPhotoUrls
      newCampaign.thumbnail = uploadedPhotoUrls[0]
    }

    addCampaign(newCampaign)
    console.log("[v0] Campaign created successfully")
    alert("캠페인이 성공적으로 생성되었습니다!")
    router.push("/campaigns")
  }

  const getNegotiationText = () => {
    if (paymentBudgetType === "negotiable") return "협의 가능"
    if (isDealPossible) return "딜 가능"
    return "협의 불가"
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200" style={{ height: "var(--gnb-height)" }}>
        <div
          className="flex items-center justify-between h-full"
          style={{ paddingLeft: "var(--gnb-padding-x)", paddingRight: "var(--gnb-padding-x)" }}
        >
          <Button variant="ghost" className="flex items-center h-9 px-1" onClick={() => router.back()}>
            <ArrowLeft className="w-6 h-6 text-black" />
            <span className="text-base text-black">캠페인 만들기</span>
          </Button>
        </div>
      </div>

      <main className="px-4 py-6 space-y-12 pb-32">
        {/* Platform */}
        {/* Add platform selection */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            플랫폼 선택 <span className="text-sm text-gray-500 font-normal">(필수)</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePlatformToggle("instagram")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                selectedPlatform === "instagram"
                  ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                <path d="M5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z" />
              </svg>
              <span>인스타그램</span>
            </button>
            <button
              onClick={() => handlePlatformToggle("blog")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                selectedPlatform === "blog"
                  ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747m0-13c5.5 0 10 4.745 10 10.747 0 5.252-4.5 10.747-10 10.747m0-21c3.59 0 6.917 1.316 9.371 3.47M5.629 9.47A9.988 9.988 0 015.027 12m0 0a10 10 0 1019.854 0m-19.854 0a9.974 9.974 0 00.602 2.53M12 12v6"
                />
              </svg>
              <span>블로그</span>
            </button>
          </div>
        </div>
        {/* End Platform */}

        {/* Content Type Section */}
        <div className="mb-2 min-h-[70px]">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            콘텐츠 유형 <span className="text-sm text-gray-500 font-normal">(필수)</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {getContentTypes(selectedPlatform).map((type) => (
              <button
                key={type}
                onClick={() => handleContentTypeToggle(type)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  selectedContentType === type
                    ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                <span>{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Type / Visit Type */}
        <div className="min-h-[120px] mb-2">
          <h2 className="text-base font-semibold text-gray-900 mb-4 mt-4">
            캠페인 유형 <span className="text-sm text-gray-500 font-normal">(필수)</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleVisitTypeToggle("visit")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                visitType === "visit"
                  ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>방문형 캠페인</span>
            </button>
            <button
              onClick={() => handleVisitTypeToggle("non-visit")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                visitType === "non-visit"
                  ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>비방문형 캠페인</span>
            </button>
          </div>
          {visitType === "visit" && (
            <p className="mt-3 text-xs text-gray-600">
              인플루언서가 직접 매장·현장을 방문해 제품과 서비스를 체험하고 콘텐츠를 제작하는 캠페인이에요.
            </p>
          )}
          {visitType === "non-visit" && (
            <p className="mt-3 text-xs text-gray-600">
              인플루언서가 매장 방문 없이, 제품을 배송받아 직접 사용해 보고 콘텐츠를 제작하는 캠페인이에요.
            </p>
          )}
        </div>

        {/* Category */}
        <div className="mb-2">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            캠페인 카테고리 <span className="text-sm text-gray-500 font-normal">(필수)</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  selectedCategory === category
                    ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {categoryIcons[category]}
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <div className="flex items-baseline gap-2 mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              캠페인 제목 <span className="text-sm text-gray-500 font-normal">(필수)</span>
            </h2>
            <p className="text-xs text-gray-500">최대 노출 18자</p>
          </div>
          <Textarea
            placeholder="예) 잇다카페 멋있게 홍보릴스 올려주실 인플루언서분~"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 50))}
            rows={2}
            className="w-full resize-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            style={{ minHeight: "60px" }}
            maxLength={50}
          />
        </div>

        {/* Recruit Count */}
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            모집 인원 <span className="text-sm text-gray-500 font-normal">(필수)</span>
          </h2>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => handleRecruitTypeToggle("one")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                recruitType === "one"
                  ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>1명</span>
            </button>
            <button
              onClick={() => handleRecruitTypeToggle("multiple")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                recruitType === "multiple"
                  ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>1명 이상</span>
            </button>
          </div>

          <div className="relative h-12">
            {recruitType === "multiple" && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="0"
                  value={recruitCount}
                  onChange={(e) => setRecruitCount(e.target.value)}
                  className="w-16 h-10 px-2 text-right text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  min="2"
                />
                <span className="text-sm text-gray-700 whitespace-nowrap">명 모집</span>
              </div>
            )}
          </div>
        </div>

        {/* Reward */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            제공 내역 <span className="text-sm text-gray-500 font-normal">(필수)</span>
          </h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => handleRewardTypeToggle("payment")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  selectedRewardType === "payment"
                    ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                <span>대금 지급</span>
              </button>
              <button
                onClick={() => handleRewardTypeToggle("product")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  selectedRewardType === "product"
                    ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <polyline points="20,12 20,22 4,22 4,12" />
                  <rect x="2" y="7" width="20" height="5" />
                  <line x1="12" y1="22" x2="12" y2="7" />
                  <path d="m12,7 0,-3a3,3 0 0,1 6,0c0,3 -3,3 -6,3" />
                  <path d="m12,7 0,-3a3,3 0 0,0 -6,0c0,3 3,3 6,3" />
                </svg>
                <span>제품 제공</span>
              </button>
              {/* REMOVED: 기타 button */}
              <button
                onClick={() => handleRewardTypeToggle("meal")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  selectedRewardType === "meal"
                    ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                <UtensilsCrossed className="w-3 h-3" />
                <span>식사권 제공</span>
              </button>
            </div>

            <div>
              {selectedRewardType === "payment" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handlePaymentBudgetTypeToggle("fixed")}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                        paymentBudgetType === "fixed"
                          ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      생각한 금액이 있어요
                    </button>
                    <button
                      onClick={() => handlePaymentBudgetTypeToggle("negotiable")}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                        paymentBudgetType === "negotiable"
                          ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      금액을 안정했어요
                    </button>
                  </div>

                  {paymentBudgetType === "fixed" && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            type="number"
                            placeholder="금액을 입력하세요"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="w-full h-10 pr-12 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            min="0"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            만원
                          </span>
                        </div>
                        <button
                          onClick={() => setIsDealPossible(!isDealPossible)}
                          className={`px-3 py-1.5 rounded-full text-xs border whitespace-nowrap transition-colors ${
                            isDealPossible
                              ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          딜 가능
                        </button>
                      </div>
                      {isDealPossible && (
                        <p className="text-xs text-gray-500">
                          "딜 가능" 버튼은 광고주와 보상 조건이나 진행 방식에 대해 협의할 수 있음을 의미합니다.
                        </p>
                      )}
                    </div>
                  )}

                  {paymentBudgetType === "negotiable" && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="px-3 py-1.5 rounded-full text-xs border bg-[#7b68ee] text-white border-[#7b68ee] cursor-default"
                        disabled
                      >
                        인플루언서와 직접 협의할게요.
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selectedRewardType === "product" && (
                <Input
                  placeholder="제공할 제품명을 입력하세요"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full h-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              )}

              {selectedRewardType === "other" && (
                <Input
                  placeholder="기타 보상 내용을 입력하세요"
                  value={otherReward}
                  onChange={(e) => setOtherReward(e.target.value)}
                  className="w-full h-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              )}

              {/* Meal Voucher Input */}
              {selectedRewardType === "meal" && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="금액 입력"
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-16 h-10 text-sm text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 whitespace-nowrap">만원 상당의 식사권</span>
                </div>
              )}
            </div>

            {selectedRewardType && (
              <div>
                <button
                  onClick={() => setShowAdditionalRewardInfo(!showAdditionalRewardInfo)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors mb-3"
                >
                  <span>추가 입력 사항</span>
                  <span className="text-xs text-gray-500 font-normal">(선택)</span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${showAdditionalRewardInfo ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showAdditionalRewardInfo && (
                  <Textarea
                    placeholder="제공 내역에 대한 추가 설명이나 조건을 입력하세요"
                    value={additionalRewardInfo}
                    onChange={(e) => setAdditionalRewardInfo(e.target.value)}
                    rows={3}
                    className="w-full text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Campaign Details */}
        <div>
          <div className="mb-14">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              콘텐츠 유형 <span className="text-sm text-gray-500 font-normal">(필수)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {/* Re-rendering content types based on platform selection */}
              {getContentTypes(selectedPlatform).map((type) => (
                <button
                  key={type}
                  onClick={() => handleContentTypeToggle(type)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                    selectedContentType === type
                      ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedContentType && contentOptions.length > 0 && (
            <>
              <div className="mb-2">
                <h3 className="text-base font-semibold text-gray-900 mb-4">📝 콘텐츠에 포함할 내용</h3>
                <p className="text-sm text-gray-500 mb-3">
                  인플루언서가 콘텐츠에 반드시 포함해야 할 내용을 선택해주세요.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {contentOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => toggleContentOption(option)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                        selectedContentOptions.includes(option.label)
                          ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <Textarea
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  placeholder="선택하신 항목의 세부적인 내용을 작성해주세요."
                  rows={5}
                  className="w-full text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  style={{ minHeight: "136px" }}
                />
              </div>

              <div className="mb-14 space-y-4">
                {/* First checkbox: Brand Instagram tag */}
                <div>
                  <button
                    onClick={() => setIsBrandTagRequired(!isBrandTagRequired)}
                    className="flex items-center gap-3 text-left mb-2"
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isBrandTagRequired ? "bg-[#7b68ee] border-[#7b68ee]" : "bg-white border-gray-300"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 transition-colors ${isBrandTagRequired ? "text-white" : "text-gray-300"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">브랜드 인스타 계정을 태그해주세요</span>
                  </button>
                  {isBrandTagRequired && (
                    <div className="ml-9">
                      <Input
                        placeholder="@브랜드계정"
                        value={brandInstagram}
                        onChange={(e) => setBrandInstagram(e.target.value)}
                        className="w-full h-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>

                {/* Second checkbox: Store location tag */}
                <div>
                  <button
                    onClick={() => setIsLocationTagRequired(!isLocationTagRequired)}
                    className="flex items-center gap-3 text-left mb-2"
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isLocationTagRequired ? "bg-[#7b68ee] border-[#7b68ee]" : "bg-white border-gray-300"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 transition-colors ${isLocationTagRequired ? "text-white" : "text-gray-300"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">매장 위치를 함께 태그해주세요</span>
                  </button>
                  {isLocationTagRequired && (
                    <div className="ml-9">
                      <Input
                        placeholder="매장 위치 입력"
                        value={storeLocation}
                        onChange={(e) => setStoreLocation(e.target.value)}
                        className="w-full h-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-14">
                <h3 className="text-base font-semibold text-gray-900 mb-4">🎬 촬영 시 포함할 장면</h3>
                <p className="text-sm text-gray-500 mb-3">콘텐츠에 꼭 담겨야 할 장면이나 상황을 선택해주세요.</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {sceneOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => toggleSceneOption(option)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                        selectedSceneOptions.includes(option.label)
                          ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <Textarea
                  value={sceneText}
                  onChange={(e) => setSceneText(e.target.value)}
                  placeholder="선택하신 항목의 세부적인 내용을 작성해주세요."
                  rows={5}
                  className="w-full text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  style={{ minHeight: "136px" }}
                />
              </div>
            </>
          )}

          <div className="mb-14">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              필수 해시태그 <span className="text-sm text-gray-500 font-normal">(선택)</span>
            </h3>
            <p className="text-sm text-gray-500 mb-4">반드시 들어가야할 해시태그를 입력해주세요</p>
            {selectedCategory && categoryHashtags[selectedCategory as keyof typeof categoryHashtags] && (
              <div className="flex flex-wrap gap-2 mb-3">
                {categoryHashtags[selectedCategory as keyof typeof categoryHashtags].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addHashtagTag(tag)}
                    className="px-3 py-1.5 rounded-full text-xs bg-gray-100 text-blue-600 hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
            <div className="border border-gray-300 rounded-lg p-3 min-h-[40px] flex flex-wrap gap-2 items-center focus-within:border-[#7b68ee] focus-within:ring-1 focus-within:ring-[#7b68ee] transition-colors">
              {hashtagTags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm border border-blue-200"
                >
                  {tag}
                  <button onClick={() => removeHashtagTag(tag)} className="text-blue-400 hover:text-blue-600 ml-1">
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={hashtagTags.length === 0 ? "#성수맛집 #감성카페 #데이트코스" : ""}
                value={hashtagInput}
                onChange={handleHashtagInputChange}
                onKeyDown={handleHashtagKeyDown}
                className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
              />
            </div>
          </div>

          <div className="mb-14">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              사진 업로드 <span className="text-sm text-gray-500 font-normal">(필수, 최대 5장)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs text-gray-500 mt-1">사진</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>

          <div className="py-4">
            <button
              onClick={() => setShowVisitTimeInfo(!showVisitTimeInfo)}
              className="flex items-center gap-2 text-base font-semibold text-gray-900 hover:text-gray-700 transition-colors mb-4"
            >
              <span>방문 시간 안내</span>
              <span className="text-sm text-gray-500 font-normal">(선택)</span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${showVisitTimeInfo ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showVisitTimeInfo && (
              <Textarea
                placeholder="방문 가능한 시간대나 운영 시간을 입력해주세요. (예: 평일 10:00-18:00, 주말 휴무)"
                value={visitTimeInfo}
                onChange={(e) => setVisitTimeInfo(e.target.value)}
                rows={4}
                className="w-full text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            )}
          </div>

          <div className="border-t border-gray-200" />

          <div className="py-4">
            <button
              onClick={() => setShowPreferentialInfo(!showPreferentialInfo)}
              className="flex items-center gap-2 text-base font-semibold text-gray-900 hover:text-gray-700 transition-colors mb-4"
            >
              <span>우대사항 안내</span>
              <span className="text-sm text-gray-500 font-normal">(선택)</span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${showPreferentialInfo ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showPreferentialInfo && (
              <Textarea
                placeholder="우대하는 인플루언서 조건이나 선호 사항을 입력해주세요. (예: 팔로워 1만 이상, 뷰티 콘텐츠 경험자 우대)"
                value={preferentialInfo}
                onChange={(e) => setPreferentialInfo(e.target.value)}
                rows={4}
                className="w-full text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            )}
          </div>

          <div className="border-t border-gray-200" />

          <div className="py-4">
            <button
              onClick={() => setShowLinkUpload(!showLinkUpload)}
              className="flex items-center gap-2 text-base font-semibold text-gray-900 hover:text-gray-700 transition-colors mb-4"
            >
              <span>링크 업로드</span>
              <span className="text-sm text-gray-500 font-normal">(선택)</span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${showLinkUpload ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showLinkUpload && (
              <Textarea
                placeholder="관련 링크 URL을 입력하세요"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                rows={4}
                className="w-full text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            )}
          </div>

          <div className="border-t border-gray-200" />

          <div className="py-4">
            <button
              onClick={() => setShowAdditionalMemo(!showAdditionalMemo)}
              className="flex items-center gap-2 text-base font-semibold text-gray-900 hover:text-gray-700 transition-colors mb-4"
            >
              <span>추가 메모</span>
              <span className="text-sm text-gray-500 font-normal">(선택)</span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${showAdditionalMemo ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showAdditionalMemo && (
              <Textarea
                placeholder="추가로 전달하고 싶은 내용이 있다면 자유롭게 작성해주세요."
                value={additionalMemo}
                onChange={(e) => setAdditionalMemo(e.target.value)}
                rows={4}
                className="w-full text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
        <div className="flex gap-2">
          <Button
            onClick={() => setShowPreviewModal(true)}
            variant="outline"
            className="h-12 px-6 border-[#7b68ee] text-[#7b68ee] hover:bg-[#7b68ee]/10"
          >
            미리보기
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 h-12 bg-[#7b68ee] hover:bg-[#7b68ee]/90 text-white font-medium"
          >
            캠페인 만들기
          </Button>
        </div>
      </div>

      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-full w-full h-full max-h-full p-0 gap-0 bg-white rounded-none overflow-hidden flex flex-col sm:max-w-sm sm:h-auto sm:max-h-[90vh] sm:rounded-2xl">
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 pt-6 pb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">캠페인 미리보기</h2>
              <p className="text-sm text-gray-500">실제 캠페인 상세 페이지에서 이렇게 보여집니다.</p>
            </div>

            <div className="space-y-4">
              {/* Campaign Image Preview */}
              <div className="relative">
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                  {uploadedFiles.length > 0 ? (
                    <img
                      src={URL.createObjectURL(uploadedFiles[0]) || "/placeholder.svg"}
                      alt="캠페인 이미지"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">업로드된 이미지가 없습니다</span>
                  )}
                </div>
              </div>

              <div className="px-4">
                <div className="flex gap-2 flex-wrap">
                  {/* Show selected platform in preview */}
                  {selectedPlatform && (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${selectedPlatform === "instagram" ? "bg-pink-100 text-pink-600" : selectedPlatform === "blog" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}
                    >
                      {selectedPlatform === "instagram"
                        ? "인스타그램"
                        : selectedPlatform === "blog"
                          ? "블로그"
                          : "플랫폼 미선택"}
                    </span>
                  )}
                  <span className="bg-gray-100 text-gray-600 font-medium text-xs px-2 py-1 rounded">
                    {visitType === "visit" ? "방문형" : visitType === "non-visit" ? "비방문형" : "유형 미선택"}
                  </span>
                  {selectedCategory && (
                    <span className="bg-[#7b68ee]/10 text-[#7b68ee] font-medium text-xs px-2 py-1 rounded">
                      {selectedCategory}
                    </span>
                  )}
                  {selectedContentType && (
                    <span className="bg-[#7b68ee]/10 text-[#7b68ee] font-medium text-xs px-2 py-1 rounded">
                      {selectedContentType}
                    </span>
                  )}
                </div>
              </div>

              <div className="px-4 space-y-4">
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-black leading-tight">
                    {title || "캠페인 제목을 입력해주세요"}
                  </h2>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>브랜드</span>
                    <span>•</span>
                    <span>방금 전</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-black">
                        {selectedRewardType === "payment" && paymentAmount
                          ? paymentAmount === "인플루언서와 직접 협의"
                            ? "협의 후 결정"
                            : `${paymentAmount}만원`
                          : selectedRewardType === "product" && productName
                            ? "제품 제공"
                            : selectedRewardType === "other" && otherReward
                              ? otherReward
                              : selectedRewardType === "meal" && mealType
                                ? mealType
                                : "보상 미입력"}
                      </span>
                      <div className="px-2 py-1 bg-white rounded-full">
                        <span className="text-xs text-gray-600">{getNegotiationText()}</span>
                      </div>
                    </div>
                    {recruitCount && (
                      <p className="text-sm text-gray-600">
                        <span className="text-[#7b68ee] font-semibold">0</span>/{recruitCount} 명 모집중
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-6 pt-2">
                  <h3 className="text-lg font-semibold text-black">캠페인 상세</h3>

                  {visitType && (
                    <div className="pb-6 border-b border-gray-200">
                      <h4 className="font-medium text-black mb-3">캠페인 유형</h4>
                      <div className="flex items-center gap-2">
                        {visitType === "visit" ? (
                          <>
                            <MapPin className="w-4 h-4 text-[#51a66f]" />
                            <span className="text-sm text-gray-700">방문형 캠페인</span>
                          </>
                        ) : (
                          <>
                            <Home className="w-4 h-4 text-[#51a66f]" />
                            <span className="text-sm text-gray-700">비방문형 캠페인</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {(selectedContentType === "릴스" ||
                    selectedContentType === "피드" ||
                    selectedContentType === "스토리 체험단") &&
                    contentOptions.length > 0 && (
                      <div className="pb-6 border-b border-gray-200">
                        <h4 className="font-medium text-black mb-2">콘텐츠 유형</h4>
                        <span className="inline-block px-3 py-1 bg-white text-[#7b68ee] rounded-full text-sm border border-[#7b68ee]">
                          {selectedContentType}
                        </span>
                        {(selectedVideoDuration || customVideoDuration) &&
                          (selectedContentType === "릴스" || selectedContentType === "피드") && (
                            <span className="inline-block px-3 py-1 bg-white text-[#7b68ee] rounded-full text-sm ml-2 border border-[#7b68ee]">
                              릴스 {selectedVideoDuration || customVideoDuration}
                            </span>
                          )}
                      </div>
                    )}

                  {selectedRewardType && (
                    <div className="pb-6 border-b border-gray-200 space-y-3">
                      <h4 className="font-medium text-black mb-3">제공 내역</h4>
                      {selectedRewardType === "payment" && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">
                              {paymentAmount === "인플루언서와 직접 협의"
                                ? "협의 후 결정"
                                : paymentAmount
                                  ? `${paymentAmount}만원`
                                  : "금액 미입력"}
                            </span>
                            {isDealPossible && (
                              <span className="px-2 py-1 bg-white text-[#7b68ee] rounded-full text-xs border border-[#7b68ee]">
                                딜 가능
                              </span>
                            )}
                          </div>
                          {additionalRewardInfo && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-xs text-gray-500 mb-1">추가 정보</p>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{additionalRewardInfo}</p>
                            </div>
                          )}
                        </div>
                      )}
                      {selectedRewardType === "product" && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-700">{productName || "제품명 미입력"}</p>
                          {additionalRewardInfo && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-xs text-gray-500 mb-1">추가 정보</p>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{additionalRewardInfo}</p>
                            </div>
                          )}
                        </div>
                      )}
                      {selectedRewardType === "other" && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-700">{otherReward || "보상 내용 미입력"}</p>
                          {additionalRewardInfo && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-xs text-gray-500 mb-1">추가 정보</p>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{additionalRewardInfo}</p>
                            </div>
                          )}
                        </div>
                      )}
                      {selectedRewardType === "meal" && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-700">{mealType || "식사권 내용 미입력"}</p>
                          {additionalRewardInfo && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-xs text-gray-500 mb-1">추가 정보</p>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{additionalRewardInfo}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {contentText && (
                    <div className="pb-6 border-b border-gray-200">
                      <h4 className="font-medium text-black mb-2">📝 콘텐츠에 포함할 내용</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{contentText}</p>
                    </div>
                  )}

                  {sceneText && (
                    <div className="pb-6 border-b border-gray-200">
                      <h4 className="font-medium text-black mb-2">🎬 촬영 시 포함할 장면</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{sceneText}</p>
                    </div>
                  )}

                  {hashtagTags.length > 0 && (
                    <div className="pb-6 border-b border-gray-200">
                      <h4 className="font-medium text-black mb-3">해시태그</h4>
                      <div className="flex flex-wrap gap-2">
                        {hashtagTags.map((hashtag, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm border border-blue-200"
                          >
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {linkUrl && (
                    <div className="pb-6 border-b border-gray-200">
                      <h4 className="font-medium text-black mb-2">관련 링크</h4>
                      <a
                        href={linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-[#7b68ee] text-white rounded-lg text-sm hover:bg-[#7b68ee]/90 transition-colors"
                      >
                        링크 보기
                      </a>
                    </div>
                  )}

                  {additionalMemo && (
                    <div className="pb-6 border-b border-gray-200">
                      <h4 className="font-medium text-black mb-2">추가 메모</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{additionalMemo}</p>
                    </div>
                  )}

                  {/* Preview for visit time info */}
                  {visitTimeInfo && (
                    <div className="pb-6 border-b border-gray-200">
                      <h4 className="font-medium text-black mb-2">방문 시간 안내</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{visitTimeInfo}</p>
                    </div>
                  )}

                  {/* Preview for preferential info */}
                  {preferentialInfo && (
                    <div className="pb-6 border-b border-gray-200">
                      <h4 className="font-medium text-black mb-2">우대사항 안내</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{preferentialInfo}</p>
                    </div>
                  )}

                  {(isBrandTagRequired || isLocationTagRequired) && (
                    <div className="pb-6 border-b border-gray-200">
                      <h4 className="font-medium text-black mb-3">필수 표기</h4>
                      <div className="space-y-2">
                        {isBrandTagRequired && (
                          <div>
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">브랜드 인스타 계정</span>을 태그해주세요
                            </p>
                            {brandInstagram && <p className="text-sm text-[#7b68ee] mt-1">{brandInstagram}</p>}
                          </div>
                        )}
                        {isLocationTagRequired && (
                          <div>
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">매장 위치</span>를 함께 태그해주세요
                            </p>
                            {storeLocation && <p className="text-sm text-[#7b68ee] mt-1">{storeLocation}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
