"use client"

import { TopHeader } from "@/components/top-header"
import { allInfluencers } from "@/lib/influencer-store"
import Link from "next/link"
import { MapPin, Check, Users, HeartIcon } from "lucide-react"

export default function InfluencerTrendingInfluencers() {
  const trendingInfluencers = allInfluencers.sort((a, b) => (b.averageLikes || 0) - (a.averageLikes || 0))

  const ProfileCard = ({ influencer }: { influencer: any }) => {
    const displayHashtags = influencer.hashtags.slice(0, 2)
    const remainingCount = influencer.hashtags.length - 2

    return (
      <div
        className="bg-transparent rounded-2xl overflow-hidden p-0 h-[230px] w-full"
        style={{ boxSizing: "border-box" }}
      >
        <div className="p-0 h-full">
          <Link href={`/influencers/${influencer.id}`}>
            <div className="relative h-full flex flex-col">
              <div className="w-full h-32 bg-white relative overflow-hidden rounded-t-2xl">
                <img
                  src={influencer.avatar || "/placeholder.svg"}
                  alt={influencer.name}
                  className="w-full h-full object-cover rounded-bl-lg rounded-br-lg"
                />
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
                      <HeartIcon className="w-3 h-3 flex-shrink-0 text-gray-400" />
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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <TopHeader title="지금 핫한 인플루언서" showBack={true} showHeart={false} showNotifications={false} />

      <main className="px-4 pb-20">
        <div className="grid grid-cols-2 gap-3">
          {trendingInfluencers.map((influencer) => (
            <ProfileCard key={influencer.id} influencer={influencer} />
          ))}
        </div>
      </main>
    </div>
  )
}
