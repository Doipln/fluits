"use client"

import { TopHeader } from "@/components/top-header"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Users, TrendingUp, MapPin, X, MessageCircle, Check, Sliders, Sparkles, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useChatStore } from "@/lib/chat-store"
import { useCampaigns } from "@/lib/campaign-store"
import { useMemo, useState } from "react"

const allInfluencers = [
  {
    id: 1,
    name: "김소영",
    followers: "33000",
    followersDisplay: "3.3만",
    engagement: "3.3%",
    category: "패션·잡화",
    region: "서울시 성동구",
    avatar: "/korean-fashion-influencer-woman-stylish-outfit.jpg",
    verified: true,
  },
  {
    id: 2,
    name: "박지민",
    followers: "52000",
    followersDisplay: "5.2만",
    engagement: "4.1%",
    category: "뷰티·화장품",
    region: "서울시 강남구",
    avatar: "/korean-beauty-influencer-woman-makeup-skincare.jpg",
    verified: true,
  },
  {
    id: 3,
    name: "이준호",
    followers: "28000",
    followersDisplay: "2.8만",
    engagement: "5.2%",
    category: "리빙·인테리어",
    region: "서울시 마포구",
    avatar: "/korean-lifestyle-influencer-man-home-interior-desi.jpg",
    verified: true,
  },
  {
    id: 4,
    name: "최유진",
    followers: "81000",
    followersDisplay: "8.1만",
    engagement: "3.8%",
    category: "테크·가전",
    region: "서울시 서초구",
    avatar: "/korean-tech-influencer-woman-gadgets-technology.jpg",
    verified: true,
  },
  {
    id: 5,
    name: "한서연",
    followers: "45000",
    followersDisplay: "4.5만",
    engagement: "3.9%",
    category: "패션·잡화",
    region: "서울시 홍대",
    avatar: "/korean-street-fashion-influencer-woman-vintage-sty.jpg",
    verified: true,
  },
  {
    id: 6,
    name: "정민아",
    followers: "63000",
    followersDisplay: "6.3만",
    engagement: "4.7%",
    category: "뷰티·화장품",
    region: "서울시 압구정",
    avatar: "/korean-beauty-guru-woman-cosmetics-review.jpg",
    verified: true,
  },
  {
    id: 7,
    name: "김태현",
    followers: "31000",
    followersDisplay: "3.1만",
    engagement: "5.8%",
    category: "리빙·인테리어",
    region: "서울시 용산구",
    avatar: "/korean-home-lifestyle-influencer-man-minimalist-in.jpg",
    verified: false,
  },
  {
    id: 8,
    name: "송하늘",
    followers: "72000",
    followersDisplay: "7.2만",
    engagement: "4.3%",
    category: "푸드·외식",
    region: "서울시 종로구",
    avatar: "/korean-food-influencer-woman-cooking-restaurant-re.jpg",
    verified: true,
  },
  {
    id: 9,
    name: "윤도현",
    followers: "39000",
    followersDisplay: "3.9만",
    engagement: "6.1%",
    category: "헬스·피트니스",
    region: "서울시 강남구",
    avatar: "/korean-fitness-influencer-man-workout-gym-training.jpg",
    verified: true,
  },
  {
    id: 10,
    name: "조민석",
    followers: "58000",
    followersDisplay: "5.8만",
    engagement: "4.5%",
    category: "숙박·여행",
    region: "부산시 해운대구",
    avatar: "/korean-travel-influencer-man-backpack-adventure.jpg",
    verified: true,
  },
  {
    id: 11,
    name: "강예린",
    followers: "41000",
    followersDisplay: "4.1만",
    engagement: "5.3%",
    category: "베이비·키즈",
    region: "서울시 송파구",
    avatar: "/korean-mom-influencer-woman-baby-kids-parenting.jpg",
    verified: true,
  },
]

// Mock data - in real app this would come from API
const campaignData = {
  id: 1,
  title: "뷰티 브랜드 신제품 리뷰",
  budget: "500만원",
  category: "뷰티",
}

type ApplicantStatus = "pending" | "selected" | "rejected"

type Applicant = {
  id: number
  name: string
  followers: string // display용 ("3.3만")
  followersCount: number // 필터용 (33000)
  engagement: number
  category: string
  region: string
  price: string
  avatar: string
  verified: boolean
  trustScore: number
  appliedAt: string
  status: ApplicantStatus
  message: string
}

const createApplicantFromInfluencer = (influencer: (typeof allInfluencers)[number], status: ApplicantStatus): Applicant => ({
  id: influencer.id,
  name: influencer.name,
  followers: influencer.followersDisplay,
  followersCount: Number.parseInt(influencer.followers, 10) || 0,
  engagement: Number.parseFloat(influencer.engagement),
  category: influencer.category,
  region: influencer.region,
  price: "협의 가능",
  avatar: influencer.avatar,
  verified: influencer.verified,
  trustScore: 4.5,
  appliedAt: "2024-01-02",
  status,
 message:
  "안녕하세요! " +
  influencer.category +
  " 분야에서 활동하고 있는 " +
  influencer.name +
  "입니다. 브랜드와의 협업에 관심이 많아 지원하게 되었습니다.",
})

type Filters = {
  verificationStatus: "all" | "verified" | "unverified"
  category: "all" | string
  followersRange: "all" | "under10k" | "10k-50k" | "50k-100k" | "over100k"
}

function ApplicantRow({
  applicant,
  showReject,
  isFavorite,
  onToggleFavorite,
  onReject,
  onChat,
}: {
  applicant: Applicant
  showReject: boolean
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
  onReject: (id: number) => void
  onChat: (a: Applicant) => void
}) {
  return (
    <div className="flex items-start gap-3 py-4 relative">
      <Link href={`/influencers/${applicant.id}`}>
        <Avatar className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src={applicant.avatar || "/placeholder.svg"} alt={applicant.name} />
          <AvatarFallback>{applicant.name[0]}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Link href={`/influencers/${applicant.id}`}>
            <h3 className="font-semibold text-base text-foreground hover:underline cursor-pointer">{applicant.name}</h3>
          </Link>
          {applicant.verified && (
            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#7b68ee]">
              <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{applicant.followers}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>{applicant.engagement}%</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{applicant.region}</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2">{applicant.message}</p>

        <div className="flex gap-2 justify-end mt-1">
          {showReject && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent rounded-md"
              onClick={() => onReject(applicant.id)}
            >
              <X className="h-4 w-4 mr-1" />
              거절
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="bg-[#7b68ee] text-white hover:bg-[#7b68ee]/90 border-[#7b68ee] rounded-md"
            onClick={() => onChat(applicant)}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            채팅하기
          </Button>
        </div>
      </div>

      <button
        onClick={() => onToggleFavorite(applicant.id)}
        className="text-muted-foreground hover:text-[#fbbf24] transition-colors absolute top-4 right-2"
      >
        <Star className="h-5 w-5" fill={isFavorite ? "#fbbf24" : "none"} stroke={isFavorite ? "#fbbf24" : "currentColor"} />
      </button>
    </div>
  )
}

function ApplicantList({
  items,
  emptyText,
  showReject,
  favorites,
  onToggleFavorite,
  onReject,
  onChat,
}: {
  items: Applicant[]
  emptyText: string
  showReject: boolean
  favorites: Set<number>
  onToggleFavorite: (id: number) => void
  onReject: (id: number) => void
  onChat: (a: Applicant) => void
}) {
  if (items.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">{emptyText}</div>
  }

  return (
    <div className="space-y-0">
      {items.map((applicant, index) => (
        <div key={applicant.id}>
          <ApplicantRow
            applicant={applicant}
            showReject={showReject}
            isFavorite={favorites.has(applicant.id)}
            onToggleFavorite={onToggleFavorite}
            onReject={onReject}
            onChat={onChat}
          />
          {index < items.length - 1 && <div className="h-px bg-border" />}
        </div>
      ))}
    </div>
  )
}

export default function CampaignApplicantsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { addChat } = useChatStore()
  const { getCampaignById } = useCampaigns()

  const initialApplicants: Applicant[] = useMemo(
    () => [
      createApplicantFromInfluencer(allInfluencers[1], "pending"),
      createApplicantFromInfluencer(allInfluencers[5], "selected"),
      createApplicantFromInfluencer(allInfluencers[0], "pending"),
      createApplicantFromInfluencer(allInfluencers[4], "pending"),
      createApplicantFromInfluencer(allInfluencers[7], "selected"),
      createApplicantFromInfluencer(allInfluencers[8], "pending"),
      createApplicantFromInfluencer(allInfluencers[2], "rejected"),
      createApplicantFromInfluencer(allInfluencers[3], "pending"),
    ],
    []
  )

  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants)
  const [activeTab, setActiveTab] = useState<"pending" | "selected">("pending")
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const [showFilterModal, setShowFilterModal] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    verificationStatus: "all",
    category: "all",
    followersRange: "all",
  })

  const categories = useMemo(() => [...new Set(allInfluencers.map((i) => i.category))].sort(), [])

  const pendingApplicants = useMemo(() => applicants.filter((a) => a.status === "pending"), [applicants])
  const selectedApplicants = useMemo(() => applicants.filter((a) => a.status === "selected"), [applicants])

  const getFilteredApplicants = (list: Applicant[]) => {
    return list.filter((applicant) => {
      if (filters.verificationStatus === "verified" && !applicant.verified) return false
      if (filters.verificationStatus === "unverified" && applicant.verified) return false

      if (filters.category !== "all" && applicant.category !== filters.category) return false

      if (filters.followersRange !== "all") {
        const followers = applicant.followersCount
        switch (filters.followersRange) {
          case "under10k":
            if (followers >= 10000) return false
            break
          case "10k-50k":
            if (followers < 10000 || followers >= 50000) return false
            break
          case "50k-100k":
            if (followers < 50000 || followers >= 100000) return false
            break
          case "over100k":
            if (followers < 100000) return false
            break
        }
      }

      return true
    })
  }

  const filteredPendingApplicants = useMemo(() => {
    const base = getFilteredApplicants(pendingApplicants)
    return showFavoritesOnly ? base.filter((a) => favorites.has(a.id)) : base
  }, [pendingApplicants, showFavoritesOnly, favorites, filters])

  const filteredSelectedApplicants = useMemo(() => {
    const base = getFilteredApplicants(selectedApplicants)
    return showFavoritesOnly ? base.filter((a) => favorites.has(a.id)) : base
  }, [selectedApplicants, showFavoritesOnly, favorites, filters])

  const handleRejectClick = (applicantId: number) => {
    setApplicants((prev) => prev.filter((a) => a.id !== applicantId))
  }

  const handleFavoriteClick = (applicantId: number) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(applicantId)) next.delete(applicantId)
      else next.add(applicantId)
      return next
    })
  }

  const handleChatClick = (applicant: Applicant) => {
    const campaign = getCampaignById(Number(params.id))

    const proposalMessage = {
      id: Date.now(),
      senderId: applicant.id,
      senderType: "influencer" as const,
      content: applicant.message,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      type: "proposal" as const,
    }

    const newChatId = addChat({
      campaignId: Number(params.id),
      campaignTitle: campaign?.title || campaignData.title,
      campaignCategory: campaign?.category || campaignData.category,
      campaignStatus: campaign?.status || "구인 진행 중",
      campaignReward: campaign?.reward || campaignData.budget,
      campaignThumbnail: campaign?.thumbnail || "/placeholder.svg",
      influencerId: applicant.id,
      influencerName: applicant.name,
      influencerAvatar: applicant.avatar,
      advertiserId: 1,
      advertiserName: "광고주",
      advertiserAvatar: "/placeholder.svg",
      lastMessage: applicant.message,
      time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      unreadCount: 1,
      isUnread: true,
      isActiveCollaboration: true,
      initiatedBy: "advertiser",
      status: "active",
      messages: [proposalMessage],
      isRead: false,
    })

    router.push(`/chat/${newChatId}`)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopHeader title="지원자 관리" showSearch={false} showNotifications={false} showBack={true} showHeart={false} />

      {/* Tab Indicator Bar */}
      <div className="sticky top-14 bg-background z-20">
        <div className="border-b border-border">
          <div className="flex">
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex-1 py-4 font-medium text-sm transition-colors relative text-center ${
                activeTab === "pending" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              지원완료 ({pendingApplicants.length})
              {activeTab === "pending" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7b68ee]" />}
            </button>
            <button
              onClick={() => setActiveTab("selected")}
              className={`flex-1 py-4 font-medium text-sm transition-colors relative text-center ${
                activeTab === "selected" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              선정완료 ({selectedApplicants.length})
              {activeTab === "selected" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7b68ee]" />}
            </button>
          </div>
        </div>

        {activeTab === "pending" && (
          <div className="bg-background px-4 py-2 flex items-center gap-2 border-b border-border">
            <Button
              variant="outline"
              size="sm"
              className="text-sm bg-transparent rounded-full border border-border hover:bg-muted"
              onClick={() => setShowFilterModal(true)}
            >
              <Sliders className="h-4 w-4 mr-1" />
              필터
            </Button>
            <button
              className={`p-2 rounded-full border border-border transition-colors ${
                showFavoritesOnly ? "bg-[#fbbf24]/10" : "hover:bg-muted"
              }`}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Star className="h-4 w-4" fill={showFavoritesOnly ? "#fbbf24" : "none"} stroke={showFavoritesOnly ? "#fbbf24" : "currentColor"} />
            </button>
            <Button
              variant="outline"
              size="sm"
              className="text-sm bg-transparent rounded-full border border-border hover:bg-muted text-[#7b68ee]"
            >
              <Sparkles className="h-4 w-4 mr-1 text-[#7b68ee]" />
              Gemini에게 추천받기
            </Button>
          </div>
        )}

        {activeTab === "selected" && (
          <div className="bg-background px-4 py-2 flex items-center gap-2 border-b border-border">
            <Button
              variant="outline"
              size="sm"
              className="text-sm bg-transparent rounded-full border border-border hover:bg-muted"
              onClick={() => setShowFilterModal(true)}
            >
              <Sliders className="h-4 w-4 mr-1" />
              필터
            </Button>
            <button
              className={`p-2 rounded-full border border-border transition-colors ${
                showFavoritesOnly ? "bg-[#fbbf24]/10" : "hover:bg-muted"
              }`}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Star className="h-4 w-4" fill={showFavoritesOnly ? "#fbbf24" : "none"} stroke={showFavoritesOnly ? "#fbbf24" : "currentColor"} />
            </button>
          </div>
        )}
      </div>

      <main className="px-4 py-2 space-y-4">
        {activeTab === "pending" && (
          <ApplicantList
            items={filteredPendingApplicants}
            emptyText={showFavoritesOnly ? "즐겨찾기된 지원자가 없습니다." : "지원완료된 지원자가 없습니다."}
            showReject={true}
            favorites={favorites}
            onToggleFavorite={handleFavoriteClick}
            onReject={handleRejectClick}
            onChat={handleChatClick}
          />
        )}

        {activeTab === "selected" && (
          <ApplicantList
            items={filteredSelectedApplicants}
            emptyText={showFavoritesOnly ? "즐겨찾기된 인플루언서가 없습니다." : "선정완료된 인플루언서가 없습니다."}
            showReject={false}
            favorites={favorites}
            onToggleFavorite={handleFavoriteClick}
            onReject={handleRejectClick}
            onChat={handleChatClick}
          />
        )}
      </main>

      <Sheet open={showFilterModal} onOpenChange={setShowFilterModal}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <div className="space-y-6 py-4">
            {/* Verification Status Filter */}
            <div>
              <h3 className="font-semibold text-sm mb-3">인증상태</h3>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: "all" as const, label: "전체" },
                  { value: "verified" as const, label: "인증된 인플루언서" },
                  { value: "unverified" as const, label: "미인증 인플루언서" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilters((prev) => ({ ...prev, verificationStatus: option.value }))}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      filters.verificationStatus === option.value
                        ? "bg-[#7b68ee] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-semibold text-sm mb-3">카테고리</h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, category: "all" }))}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    filters.category === "all" ? "bg-[#7b68ee] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  전체
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      filters.category === cat ? "bg-[#7b68ee] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Followers Range Filter */}
            <div>
              <h3 className="font-semibold text-sm mb-3">팔로워 수</h3>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: "all" as const, label: "전체" },
                  { value: "under10k" as const, label: "1만 이하" },
                  { value: "10k-50k" as const, label: "1만 ~ 5만" },
                  { value: "50k-100k" as const, label: "5만 ~ 10만" },
                  { value: "over100k" as const, label: "10만 이상" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilters((prev) => ({ ...prev, followersRange: option.value }))}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      filters.followersRange === option.value
                        ? "bg-[#7b68ee] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 pb-2">
              <Button
                variant="outline"
                className="flex-1 rounded-lg bg-transparent"
                onClick={() =>
                  setFilters({
                    verificationStatus: "all",
                    category: "all",
                    followersRange: "all",
                  })
                }
              >
                초기화
              </Button>
              <Button className="flex-1 bg-[#7b68ee] text-white hover:bg-[#7b68ee]/90 rounded-lg" onClick={() => setShowFilterModal(false)}>
                적용
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
