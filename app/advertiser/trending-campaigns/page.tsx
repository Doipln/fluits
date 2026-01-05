"use client"
import { Users } from "lucide-react"
import { useCampaigns } from "@/lib/campaign-store"
import Link from "next/link"
import { TopHeader } from "@/components/top-header"

const getNegotiationText = (campaign: any) => {
  if (campaign.isDealPossible) {
    return { text: "딜 가능", color: "text-[#51a66f] bg-[#51a66f]/10" }
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
      text: "방문형",
    }
  } else if (campaign.visitType === "non-visit") {
    return {
      text: "비방문형",
    }
  }
  return null
}

export default function AdvertiserTrendingCampaigns() {
  const { campaigns } = useCampaigns()

  const trendingCampaigns = campaigns
    .filter((campaign) => campaign.status === "구인 진행 중" && (campaign.views ?? 0) > 0)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-white">
      <TopHeader title="지금 주목받는 캠페인" showBack={true} showHeart={false} showNotifications={false} />

      <main className="px-4 pb-20">
        {trendingCampaigns.length > 0 ? (
          <div className="space-y-0">
            {trendingCampaigns.map((campaign, index) => (
              <div key={campaign.id}>
                {index === 0 && <div className="border-b border-gray-100" />}
                <div className="pt-6 pb-12 hover:bg-gray-50 transition-colors duration-200 cursor-pointer relative">
                  <Link href={`/campaigns/${campaign.id}`} className="block">
                    <div className="flex items-start gap-3">
                      <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 self-start">
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
                                <span className="text-sm">/{campaign.recruitCount}</span>{" "}
                                <span className="text-xs text-gray-500">명 모집중</span>
                              </p>
                              {Number(campaign.confirmedApplicants ?? 0) > 0 &&
                              Number(campaign.recruitCount) > 0 &&
                              Number(campaign.confirmedApplicants ?? 0) / Number(campaign.recruitCount) >= 0.7 ? (
                                <span className="text-orange-500 text-[10px] font-medium">마감 임박</span>
                              ) : null}
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
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-6 right-0 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      {Number(campaign.applicants ?? 0) > 0 ? (
                        <span className="text-xs font-semibold text-gray-400">{campaign.applicants}</span>
                      ) : null}
                    </div>
                  </Link>
                </div>
                {index < trendingCampaigns.length - 1 && <div className="border-b border-gray-100" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">현재 주목받는 캠페인이 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  )
}
