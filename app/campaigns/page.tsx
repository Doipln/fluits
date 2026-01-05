"use client"

import type React from "react"
import type { Influencer } from "@/types/influencer" // Assuming Influencer type is defined somewhere

import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { Drawer, DrawerContent, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { useState } from "react"
import Link from "next/link"
import { useCampaigns } from "@/lib/campaign-store"
import { TopHeader } from "@/components/top-header"
import { Button } from "@/components/ui/button"
import {
  Search,
  Pencil,
  MapPin,
  Home,
  SlidersHorizontal,
  Grid3x3,
  ListIcon,
  Coffee,
  Utensils,
  Shirt,
  Sparkles,
  Briefcase,
  Plane,
  Calendar,
  Baby,
  PawPrint,
  Users,
} from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { CampaignCreationModal } from "@/components/campaign-creation-modal"

const bannerAds = [
  {
    id: 1,
    title: "새로운 캠페인 기회",
    subtitle: "지금 참여하고 특별 혜택을 받아보세요",
    backgroundColor: "bg-gray-400",
    textColor: "text-white",
  },
  {
    id: 2,
    title: "브랜드 협업 특가",
    subtitle: "프리미엄 캠페인 30% 할인 혜택",
    backgroundColor: "bg-gray-500",
    textColor: "text-white",
  },
  {
    id: 3,
    title: "수익 기회 확대",
    subtitle: "더 많은 브랜드와 연결되세요",
    backgroundColor: "bg-gray-600",
    textColor: "text-white",
  },
]

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

const regions = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "경기도",
  "강원도",
  "충청도",
  "전라도",
  "경상도",
  "제주도",
]

const categoryIcons: Record<string, React.ReactNode> = {
  카페: <Coffee className="w-4 h-4" />,
  음식점: <Utensils className="w-4 h-4" />,
  "패션/의류": <Shirt className="w-4 h-4" />,
  "뷰티/화장품": <Sparkles className="w-4 h-4" />,
  "라이프/서비스": <Briefcase className="w-4 h-4" />,
  "여행/숙박": <Plane className="w-4 h-4" />,
  "이벤트/축제": <Calendar className="w-4 h-4" />,
  "키즈/유아": <Baby className="w-4 h-4" />,
  "펫/반려동물": <PawPrint className="w-4 h-4" />,
}

export default function CampaignsPage() {
  const { campaigns } = useCampaigns()
  const [isInfluencerMode, setIsInfluencerMode] = useState(false)
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [influencerProfileCompletion, setInfluencerProfileCompletion] = useState(100)
  const [searchQuery, setSearchQuery] = useState("")
  const [bannerApi, setBannerApi] = useState<CarouselApi>()
  const [currentBannerSlide, setCurrentBannerSlide] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedVisitType, setSelectedVisitType] = useState<string>("")
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest")
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false)
  const [campaignViewMode, setCampaignViewMode] = useState<"list" | "grid">("list")
  const [filteredInfluencers, setFilteredInfluencers] = useState<Influencer[]>([])

  const getSortedCampaigns = () => {
    let filteredCampaigns = [...campaigns]

    filteredCampaigns = filteredCampaigns.filter(
      (campaign) => campaign.status !== "구인 마감" && campaign.status !== "비공개 글",
    )

    // Apply search filter
    if (searchQuery.trim()) {
      filteredCampaigns = filteredCampaigns.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filteredCampaigns = filteredCampaigns.filter((campaign) => selectedCategories.includes(campaign.category))
    }

    // Apply visit type filter
    if (selectedVisitType) {
      filteredCampaigns = filteredCampaigns.filter((campaign) => {
        if (selectedVisitType === "방문형") {
          return campaign.visitType === "visit"
        } else if (selectedVisitType === "비방문형") {
          return campaign.visitType === "non-visit"
        }
        return true
      })
    }

    // Apply sort filter
    if (sortBy === "popular") {
      filteredCampaigns.sort((a, b) => (b.confirmedApplicants ?? 0) - (a.confirmedApplicants ?? 0))
    } else if (sortBy === "latest") {
      filteredCampaigns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    // Return filtered campaigns
    return filteredCampaigns
  }

  const sortedCampaigns = getSortedCampaigns()

  const getNegotiationText = (campaign: any) => {
    if (campaign.isDealPossible) {
      return { text: "딜 가능", color: "text-[#7b68ee] bg-[#7b68ee]/10" }
    }
    if (campaign.negotiationOption === "yes") {
      return { text: "협의 가능", color: "text-gray-400 bg-gray-100" }
    } else if (campaign.negotiationOption === "no") {
      return { text: "협의 불가", color: "text-gray-400 bg-gray-100" }
    }
    return null
  }

  const getVisitTypeBadge = (campaign: any) => {
    if (campaign.visitType === "visit") {
      return {
        icon: MapPin,
        text: "방문형",
      }
    } else if (campaign.visitType === "non-visit") {
      return {
        icon: Home,
        text: "비방문형",
      }
    }
    return null
  }

  const getPlatformBadge = (campaign: any) => {
    if (campaign.platform === "instagram") {
      return {
        text: "Instagram",
        color: "text-pink-500 bg-pink-50",
      }
    } else if (campaign.platform === "blog") {
      return {
        text: "Blog",
        color: "text-blue-500 bg-blue-50",
      }
    }
    return null
  }

  const getPlatformIcon = (campaign: any) => {
    if (campaign.platform === "instagram") {
      return <img src="/instagram-icon.png" alt="Instagram" className="w-5 h-5 object-cover" />
    } else if (campaign.platform === "blog") {
      return <img src="/blog-icon.png" alt="Blog" className="w-5 h-5 object-cover" />
    }
    return null
  }

  const CampaignCard = ({ campaign }: { campaign: any }) => {
    return (
      <Link href={`/campaigns/${campaign.id}`} className="block h-full">
        <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col">
          {/* 캠페인 썸네일 */}
          <div className="w-full h-48 bg-gray-100 bg-hidden rounded-lg overflow-hidden flex-shrink-0 self-start relative">
            <img
              src={campaign.thumbnail || "/placeholder.svg"}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 캠페인 정보 */}
          <div className="p-3 flex flex-col flex-1">
            {/* 캠페인 제목 */}
            <h3 className="font-semibold text-sm text-black mb-2 line-clamp-2">{campaign.title}</h3>

            {/* 보상금 */}
            <div className="flex items-center gap-2 mb-1">
              <p className="text-base font-bold text-black">{campaign.reward}</p>
              {getNegotiationText(campaign) && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${getNegotiationText(campaign).color}`}>
                  {getNegotiationText(campaign).text}
                </span>
              )}
            </div>

            {/* 모집 정보 */}
            <div className="text-xs text-gray-600 mb-2">
              <p className="flex items-center gap-1.5">
                <span>
                  <span className="text-xs text-[#7b68ee] font-semibold">{campaign.confirmedApplicants ?? 0}</span>
                  <span className="text-xs">/{Number(campaign.recruitCount) || 0}</span>
                  <span className="text-xs text-gray-500"> 명 모집중</span>
                </span>
                {(campaign.confirmedApplicants ?? 0) > 0 &&
                  Number(campaign.recruitCount) > 0 &&
                  (campaign.confirmedApplicants ?? 0) / Number(campaign.recruitCount) >= 0.7 && (
                    <span className="text-orange-500 text-[10px] font-medium ml-1.5">마감 임박</span>
                  )}
              </p>
            </div>

            {/* 카테고리 및 유형 */}
            <div className="flex items-center gap-1.5">
              <div className="flex flex-wrap gap-1">
                <span className="bg-[#7b68ee]/10 text-[#7b68ee] font-medium text-[10px] px-1.5 py-0.5 rounded">
                  {campaign.category}
                </span>
                {getVisitTypeBadge(campaign) && (
                  <span className="bg-gray-100 text-gray-600 font-medium text-[10px] px-1.5 py-0.5 rounded">
                    {getVisitTypeBadge(campaign).text}
                  </span>
                )}
              </div>
            </div>

            {/* 플랫폼 아이콘 */}
            <div className="flex items-center gap-1.5 mt-2">
              {campaign.platform === "instagram" && (
                <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 flex-shrink-0">
                  {getPlatformIcon(campaign)}
                </div>
              )}
              {campaign.platform === "blog" && (
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 flex-shrink-0">
                  {getPlatformIcon(campaign)}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  const handleVisitTypeChange = (visitType: string) => {
    setSelectedVisitType(visitType)
  }

  const handleCategoryChange = (category: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category))
    }
  }

  const handleRegionChange = (region: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedRegions([...selectedRegions, region])
    } else {
      setSelectedRegions(selectedRegions.filter((reg) => reg !== region))
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedRegions([])
    setSelectedVisitType("")
    setSortBy("latest")
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <TopHeader title="캠페인" />

      <main className="px-2 py-2 space-y-2">
        {/* 정렬방식 및 필터 */}
        <div className={`px-1 ${isInfluencerMode && influencerProfileCompletion < 100 ? "mt-4" : ""}`}>
          <div className="relative">
            <Input
              placeholder="원하는 키워드를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-100 rounded-full pl-4 pr-10 py-4 border-gray-200 placeholder:text-gray-400 text-gray-700 h-12"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="px-1">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {/* Filter button */}
            <Button
              variant="outline"
              className="rounded-full whitespace-nowrap bg-white h-8 px-3 text-xs"
              onClick={() => setIsFilterOpen(true)}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
              필터
            </Button>

            {selectedCategories.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full h-8 bg-[#7b68ee]/30 whitespace-nowrap">
                <span className="text-xs text-[#7b68ee] font-medium">
                  {selectedCategories.length > 1
                    ? `${selectedCategories[0]} 외 ${selectedCategories.length - 1}개`
                    : selectedCategories[0]}
                </span>
                <button onClick={() => setSelectedCategories([])} className="ml-auto flex-shrink-0">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <X className="w-3 h-3 text-[#7b68ee]" />
                  </div>
                </button>
              </div>
            )}

            {selectedRegions.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full h-8 bg-[#7b68ee]/30 whitespace-nowrap">
                <span className="text-xs text-[#7b68ee] font-medium">
                  {selectedRegions.length > 1
                    ? `${selectedRegions[0]} 외 ${selectedRegions.length - 1}곳`
                    : selectedRegions[0]}
                </span>
                <button onClick={() => setSelectedRegions([])} className="ml-auto flex-shrink-0">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <X className="w-3 h-3 text-[#7b68ee]" />
                  </div>
                </button>
              </div>
            )}

            {/* Grid/List toggle button */}
            <div className="flex-shrink-0">
              <div className="relative flex rounded-full bg-gray-100 overflow-hidden h-8 p-1">
                <div
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full transition-all duration-300 ease-in-out shadow-sm ${campaignViewMode === "grid" ? "left-1" : "left-[calc(50%+2px)]"}`}
                />

                <button
                  className={`relative z-10 rounded-full px-2 py-1 h-full flex-1 transition-all duration-200 flex items-center justify-center ${campaignViewMode === "grid" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setCampaignViewMode("grid")}
                >
                  <Grid3x3 className="w-3.5 h-3.5" />
                </button>

                <button
                  className={`relative z-10 rounded-full px-2 py-1 h-full flex-1 transition-all duration-200 flex items-center justify-center ${campaignViewMode === "list" ? "text-gray-900" : "text-gray-500 hover:text-[#7b68ee] hover:border-[#7b68ee]"}`}
                  onClick={() => setCampaignViewMode("list")}
                >
                  <ListIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Visit type buttons */}
            {["방문형", "비방문형"].map((visitType) => {
              const icon = visitType === "방문형" ? MapPin : Home
              const Icon = icon
              return (
                <Button
                  key={visitType}
                  className={`rounded-full whitespace-nowrap h-8 px-3 text-xs flex items-center gap-1.5 border transition-colors ${
                    selectedVisitType === visitType
                      ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                      : "bg-white text-gray-700 border-gray-300 hover:text-[#7b68ee] hover:border-[#7b68ee]"
                  }`}
                  onClick={() => handleVisitTypeChange(visitType)}
                >
                  <Icon className="w-4 h-4" />
                  {visitType}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="px-1">
          <div className="relative">
            <Carousel
              setApi={setBannerApi}
              opts={{
                align: "start",
                loop: false,
                dragFree: false,
                containScroll: "trimSnaps",
                slidesToScroll: 1,
                skipSnaps: false,
                inViewThreshold: 1.0,
              }}
              className="w-full"
            >
              <CarouselContent className="ml-0">
                {bannerAds.map((banner, index) => (
                  <CarouselItem key={banner.id} className="pl-0 mr-3 last:mr-0">
                    <div
                      className={`w-full h-20 md:h-30 lg:h-36 ${banner.backgroundColor} ${banner.textColor} rounded-2xl p-4 flex flex-col justify-center`}
                    >
                      <h3 className="font-bold text-base leading-tight">{banner.title}</h3>
                      <p className="text-xs opacity-90 mt-1">{banner.subtitle}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {bannerAds.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentBannerSlide ? "bg-white" : "bg-white/50"
                    }`}
                    onClick={() => bannerApi?.scrollTo(index)}
                  />
                ))}
              </div>
            </Carousel>
          </div>
        </div>

        <div className="px-1">
          {sortedCampaigns.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>조건에 맞는 캠페인이 없습니다.</p>
            </div>
          ) : campaignViewMode === "list" ? (
            <div className="border-t border-gray-200">
              {sortedCampaigns.map((campaign, index) => (
                <div key={campaign.id}>
                  {index === 0 && <div className="border-b border-gray-100" />}
                  <div className="pt-4 pb-8 hover:bg-gray-50 transition-colors duration-200 cursor-pointer relative">
                    <Link href={`/campaigns/${campaign.id}`} className="block">
                      <div className="flex items-start gap-3">
                        <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 self-start relative">
                          <img
                            src={campaign.thumbnail || "/placeholder.svg"}
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-0.5">
                            <h3 className="font-semibold text-sm text-black leading-tight truncate flex-1">
                              {campaign.title}
                            </h3>
                          </div>

                          <div className="space-y-0.5 mt-0.5">
                            <div className="flex items-center gap-2">
                              <p className="text-base font-bold text-black">{campaign.reward}</p>
                              {getNegotiationText(campaign) && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${getNegotiationText(campaign).color}`}
                                >
                                  {getNegotiationText(campaign).text}
                                </span>
                              )}
                            </div>
                            {campaign.recruitCount && (
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-600">
                                  <span className="text-sm text-[#7b68ee] font-semibold">
                                    {campaign.confirmedApplicants ?? 0}
                                  </span>
                                  <span className="text-sm">/{Number(campaign.recruitCount) || 0}</span>{" "}
                                  <span className="text-xs text-gray-500">명 모집중</span>
                                  {(campaign.confirmedApplicants ?? 0) > 0 &&
                                    Number(campaign.recruitCount) > 0 &&
                                    (campaign.confirmedApplicants ?? 0) / Number(campaign.recruitCount) >= 0.7 && (
                                      <span className="text-orange-500 text-[10px] font-medium ml-1.5">마감 임박</span>
                                    )}
                                </p>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="bg-[#7b68ee]/10 text-[#7b68ee] font-medium text-[10px] px-1.5 py-0.5 rounded">
                                {campaign.category}
                              </span>
                              {getVisitTypeBadge(campaign) && (
                                <span className="bg-gray-100 text-gray-600 font-medium text-[10px] px-1.5 py-0.5 rounded">
                                  {getVisitTypeBadge(campaign).text}
                                </span>
                              )}
                            </div>

                            {/* 플랫폼 아이콘 */}
                            <div className="flex items-center gap-1.5 mt-2">
                              {campaign.platform === "instagram" && (
                                <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 flex-shrink-0">
                                  {getPlatformIcon(campaign)}
                                </div>
                              )}
                              {campaign.platform === "blog" && (
                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 flex-shrink-0">
                                  {getPlatformIcon(campaign)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="absolute bottom-6 right-0 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      {Number(campaign.applicants ?? 0) > 0 ? (
                        <span className="text-xs font-semibold text-gray-400">{campaign.applicants}</span>
                      ) : null}
                    </div>
                  </div>
                  {index < sortedCampaigns.length - 1 && <div className="border-b border-gray-100" />}
                </div>
              ))}
            </div>
          ) : campaignViewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-3">
              {sortedCampaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/campaigns/${campaign.id}`}
                  className="block bg-transparent rounded-none"
                >
                  <div className="relative w-full h-40 overflow-hidden rounded-lg">
                    <img
                      src={campaign.thumbnail || "/placeholder.svg"}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-1 mt-2">
                    <h3 className="font-semibold text-sm text-black mb-1 line-clamp-2">{campaign.title}</h3>

                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-base font-bold text-black">{campaign.reward}</p>
                      {getNegotiationText(campaign) && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getNegotiationText(campaign).color}`}>
                          {getNegotiationText(campaign).text}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 flex items-center gap-1.5">
                      <span>
                        <span className="text-sm text-[#7b68ee] font-semibold">
                          {campaign.confirmedApplicants ?? 0}
                        </span>
                        <span className="text-sm">/{Number(campaign.recruitCount) || 0}</span>{" "}
                        <span className="text-xs text-gray-500">명 모집</span>
                      </span>
                      {(campaign.confirmedApplicants ?? 0) > 0 &&
                        Number(campaign.recruitCount) > 0 &&
                        (campaign.confirmedApplicants ?? 0) / Number(campaign.recruitCount) >= 0.7 && (
                          <span className="text-orange-500 text-[10px] font-medium">마감 임박</span>
                        )}
                    </p>

                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#7b68ee]/10 text-[#7b68ee] font-medium text-[10px] px-1.5 py-0.5 rounded">
                        {campaign.category}
                      </span>
                      {getVisitTypeBadge(campaign) && (
                        <span className="bg-gray-100 text-gray-600 font-medium text-[10px] px-1.5 py-0.5 rounded">
                          {getVisitTypeBadge(campaign).text}
                        </span>
                      )}
                    </div>

                    {/* 플랫폼 아이콘 */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {campaign.platform === "instagram" && (
                        <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 flex-shrink-0">
                          <img
                            src="/instagram-icon.png"
                            alt="Instagram"
                            className="w-5 h-5 object-cover rounded-full"
                          />
                        </div>
                      )}
                      {campaign.platform === "blog" && (
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 flex-shrink-0">
                          <img src="/blog-icon.png" alt="Blog" className="w-5 h-5 object-cover rounded-full" />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </main>

      {!isInfluencerMode && isProfileComplete && (
        <button
          onClick={() => setIsCampaignModalOpen(true)}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 transition-all duration-200 hover:scale-105 active:scale-95 bg-[#7b68ee]"
        >
          <Pencil className="w-6 h-6 text-white" />
        </button>
      )}

      {!isInfluencerMode && !isProfileComplete && (
        <button
          disabled
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 bg-[#7b68ee]/30 cursor-not-allowed"
        >
          <Pencil className="w-6 h-6 text-white" />
        </button>
      )}

      <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DrawerContent className="rounded-t-3xl">
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
          <div className="px-4 pt-4 pb-2 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-3">카테고리</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category, !selectedCategories.includes(category))}
                    className={`px-3 py-2 rounded-full text-sm border transition-colors flex items-center gap-2 ${selectedCategories.includes(category) ? "bg-[#7b68ee] text-white border-[#7b68ee]" : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"}`}
                  >
                    {categoryIcons[category]}
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">지역</h3>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => handleRegionChange(region, !selectedRegions.includes(region))}
                    className={`px-3 py-2 rounded-full text-sm border transition-colors ${selectedRegions.includes(region) ? "bg-[#7b68ee] text-white border-[#7b68ee]" : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"}`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">방문 형태</h3>
              <div className="flex flex-wrap gap-2">
                {["방문형", "비방문형"].map((visitType) => {
                  const icon = visitType === "방문형" ? MapPin : Home
                  const Icon = icon
                  return (
                    <button
                      key={visitType}
                      onClick={() => handleVisitTypeChange(visitType)}
                      className={`px-3 py-2 rounded-full text-sm border transition-colors flex items-center gap-1.5 whitespace-nowrap ${selectedVisitType === visitType ? "bg-[#7b68ee] text-white border-[#7b68ee]" : "bg-white text-gray-700 border-gray-300 hover:text-[#7b68ee] hover:border-[#7b68ee]"}`}
                    >
                      <Icon className="w-4 h-4" />
                      {visitType}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          <DrawerFooter className="pt-3 pb-4 px-4 border-t border-gray-200 sticky bottom-0 bg-white">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex-1 bg-white text-gray-700 border-gray-300 h-12 hover:bg-gray-50"
              >
                초기화
              </Button>
              <DrawerClose asChild>
                <Button className="flex-1 bg-[#7b68ee] hover:bg-[#7b68ee]/90 h-12 text-white">적용</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <CampaignCreationModal open={isCampaignModalOpen} onOpenChange={setIsCampaignModalOpen} />
    </div>
  )
}
