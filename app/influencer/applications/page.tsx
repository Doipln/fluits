"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageCircle, MoreVertical, ChevronDown, Flag, Star } from "lucide-react"
import { Drawer, DrawerContent, DrawerFooter, DrawerClose } from "@/components/ui/drawer"

const userData = {
  name: "밍밍 부인",
  avatar: "/korean-business-person.jpg",
}

// Mock application data
const applications = [
  {
    id: 1,
    campaignId: 1,
    status: "지원완료",
    statusDate: "12.15",
    campaignStatus: "진행중",
    campaignTitle: "강남 카페 신메뉴 릴스 캠페인",
    advertiser: "잇다커피",
    appliedTime: "2개월 전 지원",
    thumbnail: "/skincare-products-display.png",
  },
  {
    id: 2,
    campaignId: 2,
    status: "협업확정",
    statusDate: "12.10",
    campaignStatus: "진행중",
    campaignTitle: "뷰티 제품 리뷰 캠페인",
    advertiser: "뷰티브랜드",
    appliedTime: "3개월 전 지원",
    thumbnail: "/makeup-tutorial.png",
  },
  {
    id: 3,
    campaignId: 3,
    status: "연락중",
    statusDate: "12.08",
    campaignStatus: "마감",
    campaignTitle: "패션 브랜드 협찬 캠페인",
    advertiser: "패션하우스",
    appliedTime: "3개월 전 지원",
    thumbnail: "/korean-fashion-influencer.jpg",
  },
  {
    id: 4,
    campaignId: 4,
    status: "다음에",
    statusDate: "12.01",
    campaignStatus: "비공개글",
    campaignTitle: "맛집 탐방 콘텐츠 제작",
    advertiser: "푸드컴퍼니",
    appliedTime: "4개월 전 지원",
    thumbnail: "/korean-food-influencer.jpg",
  },
]

export default function ApplicationsPage() {
  const router = useRouter()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isCampaignFilterOpen, setIsCampaignFilterOpen] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const getCampaignStatusBadge = (status: string) => {
    switch (status) {
      case "진행중":
        return "bg-[#7b68ee] text-white"
      case "마감":
        return "bg-gray-500 text-white"
      case "비공개글":
        return "bg-gray-400 text-white"
      default:
        return "bg-gray-400 text-white"
    }
  }

  const isChatEnabled = (status: string) => {
    return status === "협업확정" || status === "연락중"
  }

  const toggleFavorite = (applicationId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const newFavorites = new Set(favorites)
    if (newFavorites.has(applicationId)) {
      newFavorites.delete(applicationId)
    } else {
      newFavorites.add(applicationId)
    }
    setFavorites(newFavorites)
  }

  const filteredApplications = showFavoritesOnly ? applications.filter((app) => favorites.has(app.id)) : applications

  return (
    <div className="min-h-screen bg-white pb-0">
      <header className="sticky top-0 z-50 bg-white">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-black" />
            </button>
            <h1 className="text-base font-semibold text-black">캠페인 지원 내역</h1>
          </div>

          <div className="w-8" />
        </div>
      </header>

      <main className="px-4 py-4">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 snap-x snap-mandatory">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-gray-300 text-sm whitespace-nowrap bg-transparent flex-shrink-0 snap-start"
            onClick={() => setIsFilterOpen(true)}
          >
            지원 상태 <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
          <Button
            size="sm"
            className={`rounded-full px-3 flex-shrink-0 snap-start transition-colors ${
              showFavoritesOnly
                ? "bg-[#7b68ee] text-white"
                : "border border-gray-300 bg-transparent text-gray-600 hover:border-gray-400"
            }`}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <Star className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className="border-b border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => router.push(`/campaigns/${application.campaignId}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-600">{application.status}</span>
                <button
                  className="p-1.5 -mr-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={(e) => toggleFavorite(application.id, e)}
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      favorites.has(application.id)
                        ? "fill-[#7b68ee] text-[#7b68ee]"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  />
                </button>
              </div>

              <div className="mb-3">
                <div className="flex items-start gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getCampaignStatusBadge(application.campaignStatus)}`}
                  >
                    {application.campaignStatus}
                  </span>
                  <h3 className="font-semibold text-sm text-gray-900 flex-1">{application.campaignTitle}</h3>
                </div>

                <p className="text-xs text-gray-500">
                  {application.advertiser} · {application.appliedTime}
                </p>
              </div>

              {application.status === "협업확정" ? (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg h-9 transition-colors font-semibold">
                    후기 남기기
                  </Button>
                  <Button
                    size="sm"
                    className="w-10 h-10 rounded-lg p-0 bg-transparent hover:bg-gray-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedApplicationId(application.id)
                      setIsReportOpen(true)
                    }}
                  >
                    <MoreVertical className="w-4 h-4 text-black" />
                  </Button>
                </div>
              ) : application.status === "다음에" ? (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button className="flex-1 text-gray-700 rounded-lg h-9 bg-gray-100 hover:bg-gray-200 transition-colors font-semibold">
                    목록에서 삭제하기
                  </Button>
                  <Button
                    size="sm"
                    className="w-10 h-10 rounded-lg p-0 bg-transparent hover:bg-gray-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedApplicationId(application.id)
                      setIsReportOpen(true)
                    }}
                  >
                    <MoreVertical className="w-4 h-4 text-black" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-sm h-9 border-gray-300 rounded-lg bg-transparent font-semibold"
                  >
                    지원 취소
                  </Button>
                  <Button
                    size="sm"
                    className={`flex-1 text-sm h-9 rounded-lg font-semibold ${
                      isChatEnabled(application.status)
                        ? "bg-[#7b68ee] hover:bg-[#7b68ee]/90"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!isChatEnabled(application.status)}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    채팅 하기
                  </Button>
                  <Button
                    size="sm"
                    className="w-10 h-10 rounded-lg p-0 bg-transparent hover:bg-gray-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedApplicationId(application.id)
                      setIsReportOpen(true)
                    }}
                  >
                    <MoreVertical className="w-4 h-4 text-black" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DrawerContent className="rounded-t-3xl [&>div:first-child]:hidden">
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
          <div className="px-4 pt-2 pb-4 space-y-2">
            <h3 className="font-semibold text-lg mb-3">지원 상태</h3>
            {["지원완료", "협업확정", "다음에", "연락중"].map((status) => (
              <button
                key={status}
                className="w-full px-4 py-3 rounded-xl text-sm border transition-colors text-left bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              >
                {status}
              </button>
            ))}
          </div>
          <DrawerFooter className="pt-3 pb-6">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full bg-transparent h-12">
                닫기
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer open={isCampaignFilterOpen} onOpenChange={setIsCampaignFilterOpen}>
        <DrawerContent className="rounded-t-3xl [&>div:first-child]:hidden">
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
          <div className="px-4 pt-2 pb-4 space-y-2">
            <h3 className="font-semibold text-lg mb-3">캠페인 상태</h3>
            {["진행중", "마감", "비공개글"].map((status) => (
              <button
                key={status}
                className="w-full px-4 py-3 rounded-xl text-sm border transition-colors text-left bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              >
                {status}
              </button>
            ))}
          </div>
          <DrawerFooter className="pt-3 pb-6">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full bg-transparent h-12">
                닫기
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DrawerContent className="rounded-t-3xl [&>div:first-child]:hidden">
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
          <div className="px-4 pt-2 pb-4">
            <h3 className="font-semibold text-lg mb-4">옵션</h3>
            <button className="w-full px-4 py-3 rounded-xl text-sm border border-gray-300 bg-white text-gray-700 hover:border-gray-400 flex items-center gap-2 transition-colors">
              <Flag className="w-4 h-4" />
              신고하기
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
