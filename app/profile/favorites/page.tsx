"use client"

import { Button } from "@/components/ui/button"
import { allInfluencers } from "@/lib/influencer-store"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Check, MapPin, Users, Heart, ArrowLeft } from "lucide-react"
import { useCampaigns } from "@/lib/campaign-store"

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [favoriteCampaignIds, setFavoriteCampaignIds] = useState<number[]>([])
  const router = useRouter()
  const pathname = usePathname()
  const [isInfluencerMode, setIsInfluencerMode] = useState(false)
  const { campaigns } = useCampaigns()

  useEffect(() => {
    const influencerMode = localStorage.getItem("influencer_mode") === "true"
    setIsInfluencerMode(influencerMode)
    console.log("[v0] Influencer mode:", influencerMode)

    if (influencerMode) {
      const savedFavorites = localStorage.getItem("campaign-favorites")
      console.log("[v0] Loading saved campaign favorites:", savedFavorites)
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites)
        console.log("[v0] Parsed campaign favorites:", parsedFavorites)
        setFavoriteCampaignIds(parsedFavorites)
      }
    } else {
      const savedFavorites = localStorage.getItem("favorites")
      console.log("[v0] Loading saved favorites:", savedFavorites)
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites)
        console.log("[v0] Parsed favorites:", parsedFavorites)
        setFavoriteIds(parsedFavorites)
      }
    }
  }, [])

  const favoriteInfluencers = allInfluencers.filter((influencer) => favoriteIds.includes(influencer.id))
  const favoriteCampaigns = campaigns.filter((campaign) => favoriteCampaignIds.includes(campaign.id))

  const toggleFavorite = (influencerId: number) => {
    console.log("[v0] Toggling favorite for influencer:", influencerId)
    const newFavorites = favoriteIds.includes(influencerId)
      ? favoriteIds.filter((id) => id !== influencerId)
      : [...favoriteIds, influencerId]

    console.log("[v0] New favorites array:", newFavorites)
    setFavoriteIds(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  const toggleCampaignFavorite = (campaignId: number) => {
    console.log("[v0] Toggling favorite for campaign:", campaignId)
    const newFavorites = favoriteCampaignIds.includes(campaignId)
      ? favoriteCampaignIds.filter((id) => id !== campaignId)
      : [...favoriteCampaignIds, campaignId]

    console.log("[v0] New campaign favorites array:", newFavorites)
    setFavoriteCampaignIds(newFavorites)
    localStorage.setItem("campaign-favorites", JSON.stringify(newFavorites))
  }

  const ProfileCard = ({ influencer }: { influencer: any }) => {
    const displayHashtags = influencer.hashtags.slice(0, 2)
    const remainingCount = influencer.hashtags.length - 2

    return (
      <Card className="bg-white rounded-2xl overflow-hidden shadow-sm p-0 h-[230px]">
        <CardContent className="p-0 h-full">
          <Link href={`/influencers/${influencer.id}`}>
            <div className="relative h-full flex flex-col">
              <div className="w-full h-32 bg-white relative overflow-hidden rounded-t-2xl">
                <img
                  src={influencer.avatar || "/placeholder.svg"}
                  alt={influencer.name}
                  className="w-full h-full object-cover rounded-bl-lg rounded-br-lg"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 bg-white/5 hover:bg-white/10 rounded-full"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleFavorite(influencer.id)
                  }}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favoriteIds.includes(influencer.id) ? "text-red-500 fill-red-500" : "text-gray-600 fill-gray-600"
                    }`}
                  />
                </Button>
                <div className="absolute bottom-2 left-2">
                  <span className="bg-white/90 text-[#7b68ee] font-semibold text-xs rounded-full px-1.5 py-0.5">
                    {influencer.category}
                  </span>
                </div>
              </div>

              <div className="h-[92px] p-2 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold text-sm leading-tight">{influencer.name}</h3>
                    {influencer.verified && (
                      <div className="w-4 h-4 bg-[#7b68ee] rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-400 leading-tight">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{influencer.region}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs leading-tight">
                    <span className="flex items-center gap-2 text-black font-semibold">
                      <Users className="w-3 h-3 flex-shrink-0 text-gray-400" />
                      <span className="text-sm">{influencer.followersDisplay}</span>
                    </span>
                    <span className="flex items-center gap-2 text-black font-semibold">
                      <Heart className="w-3 h-3 flex-shrink-0 text-gray-400" />
                      <span className="text-sm">{influencer.averageLikes || influencer.engagement}</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 items-center mt-1 mb-1">
                  {displayHashtags.map((tag, index) => (
                    <span key={index} className="text-xs text-blue-500 leading-tight">
                      {tag}
                    </span>
                  ))}
                  {remainingCount > 0 && <span className="text-xs text-blue-500 leading-tight">+{remainingCount}</span>}
                </div>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const CampaignCard = ({ campaign }: { campaign: any }) => {
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

    return (
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
                <h3 className="font-semibold text-sm text-black leading-tight truncate flex-1">{campaign.title}</h3>
              </div>

              <div className="space-y-0.5 mt-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-black">{campaign.reward}</p>
                  {getNegotiationText(campaign) && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getNegotiationText(campaign).color}`}>
                      {getNegotiationText(campaign).text}
                    </span>
                  )}
                </div>
                {campaign.recruitCount && (
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">
                      <span className="text-sm text-[#7b68ee] font-semibold">{campaign.confirmedApplicants ?? 0}</span>
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
                </div>
              </div>
            </div>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-3 h-8 w-8 bg-white hover:bg-gray-100 rounded-full z-10"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleCampaignFavorite(campaign.id)
          }}
        >
          <Heart
            className={`w-4 h-4 ${
              favoriteCampaignIds.includes(campaign.id) ? "text-red-500 fill-red-500" : "text-gray-600 fill-gray-600"
            }`}
          />
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-40 bg-white border-b border-border" style={{ height: "var(--gnb-height)" }}>
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="h-6 w-6 text-black" />
              <span className="text-base font-medium text-black">찜목록</span>
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-4">
        {isInfluencerMode ? (
          favoriteCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Heart className="w-16 h-16 text-gray-300" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gray-600">찜한 캠페인이 없습니다</h3>
                <p className="text-sm text-gray-500">마음에 드는 캠페인을 찜해보세요!</p>
              </div>
              <Link href="/campaigns">
                <Button className="bg-[#7b68ee] hover:bg-[#7b68ee]/90 text-white px-6 py-2 rounded-full">
                  캠페인 찾아보기
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">찜한 캠페인 ({favoriteCampaigns.length})</h2>
              </div>

              <div className="space-y-0 divide-y divide-gray-100">
                {favoriteCampaigns.map((campaign, index) => (
                  <div key={campaign.id}>
                    {index === 0 && <div className="border-b border-gray-100" />}
                    <CampaignCard campaign={campaign} />
                    {index < favoriteCampaigns.length - 1 && <div className="border-b border-gray-100" />}
                  </div>
                ))}
              </div>
            </div>
          )
        ) : favoriteInfluencers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Heart className="w-16 h-16 text-gray-300" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-600">찜한 파트너가 없습니다</h3>
              <p className="text-sm text-gray-500">마음에 드는 파트너를 찜해보세요!</p>
            </div>
            <Link href="/influencers">
              <Button className="bg-[#7b68ee] hover:bg-[#7b68ee]/90 text-white px-6 py-2 rounded-full">
                파트너 찾아보기
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">찜한 파트너 ({favoriteInfluencers.length})</h2>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-3">
              {favoriteInfluencers.map((influencer) => (
                <ProfileCard key={influencer.id} influencer={influencer} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
