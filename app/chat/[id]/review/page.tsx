"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const processRecommendations = [
  { icon: "⏰", text: "시간 약속을 잘 지켜요" },
  { icon: "📩", text: "메시지 응답이 빠르고 원활해요" },
  { icon: "🙂", text: "친절하고 매너가 좋아요" },
  { icon: "🙌", text: "협조적이고 융통성이 있어요" },
  { icon: "💬", text: "피드백을 긍정적으로 수용해요" },
  { icon: "📋", text: "협업 준비가 충분했어요" },
  { icon: "🛠", text: "문제 상황이 생겨도 적극적으로 해결했어요" },
]

const resultRecommendations = [
  { icon: "🎥", text: "결과물 퀄리티가 높아요" },
  { icon: "📝", text: "브랜드 메시지를 잘 반영했어요" },
  { icon: "✨", text: "창의적이고 매력적으로 표현했어요" },
  { icon: "#️⃣", text: "필수 해시태그/요청사항을 정확히 반영했어요" },
  { icon: "📏", text: "약속된 분량을 충족했어요" },
  { icon: "📆", text: "마감 기한을 잘 지켰어요" },
  { icon: "🚀", text: "브랜드 인지도/노출 효과에 도움이 되었어요" },
  { icon: "💡", text: "추가적인 아이디어 제안이 유익했어요" },
  { icon: "🤝", text: "장기 협업으로 이어가고 싶어요" },
]

export default function ReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [selectedProcessRecommendations, setSelectedProcessRecommendations] = useState<string[]>([])
  const [selectedResultRecommendations, setSelectedResultRecommendations] = useState<string[]>([])
  const [review, setReview] = useState("")

  const toggleProcessRecommendation = (text: string) => {
    if (selectedProcessRecommendations.includes(text)) {
      setSelectedProcessRecommendations(selectedProcessRecommendations.filter((r) => r !== text))
    } else {
      setSelectedProcessRecommendations([...selectedProcessRecommendations, text])
    }
  }

  const toggleResultRecommendation = (text: string) => {
    if (selectedResultRecommendations.includes(text)) {
      setSelectedResultRecommendations(selectedResultRecommendations.filter((r) => r !== text))
    } else {
      setSelectedResultRecommendations([...selectedResultRecommendations, text])
    }
  }

  const handleSubmit = () => {
    const totalSelected = selectedProcessRecommendations.length + selectedResultRecommendations.length
    if (totalSelected === 0) {
      alert("추천 항목을 최소 1개 이상 선택해주세요.")
      return
    }

    const chatStorage = JSON.parse(localStorage.getItem("chat-storage") || '{"state":{"chats":[]}}')
    const chats = chatStorage.state?.chats || []
    const chatData = chats.find((c: any) => c.id === Number.parseInt(params.id))

    console.log("[v0] Looking for chat ID:", params.id)
    console.log("[v0] Found chat data:", chatData)

    if (!chatData) {
      console.error("[v0] Chat data not found for ID:", params.id)
      alert("채팅 정보를 찾을 수 없습니다.")
      return
    }

    if (!chatData.influencerId) {
      console.error("[v0] Influencer ID not found in chat data")
      alert("인플루언서 정보를 찾을 수 없습니다.")
      return
    }

    const reviews = JSON.parse(localStorage.getItem("influencer_reviews") || "[]")

    const newReview = {
      id: Date.now(),
      influencerId: chatData.influencerId,
      campaignId: chatData.campaignId,
      advertiserName: chatData.advertiserName || "광고주",
      advertiserAvatar: chatData.advertiserAvatar || "/placeholder.svg",
      verified: true,
      collaborations: 1,
      date: "방금 전",
      processRecommendations: selectedProcessRecommendations,
      resultRecommendations: selectedResultRecommendations,
      detailedReview: review,
      category: chatData.campaignCategory || "기타",
      createdAt: new Date().toISOString(),
    }

    reviews.push(newReview)
    localStorage.setItem("influencer_reviews", JSON.stringify(reviews))

    console.log("[v0] Review saved successfully!")
    console.log("[v0] Review details:", {
      influencerId: chatData.influencerId,
      processRecommendations: selectedProcessRecommendations,
      resultRecommendations: selectedResultRecommendations,
      detailedReview: review,
    })
    console.log("[v0] Total reviews in storage:", reviews.length)

    alert("후기가 등록되었습니다!")
    router.push(`/chat/${params.id}`)
  }

  const totalSelected = selectedProcessRecommendations.length + selectedResultRecommendations.length

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-100"
        style={{ height: "var(--gnb-height)", borderBottomColor: "rgba(0,0,0,0.06)" }}
      >
        <div
          className="flex items-center h-full"
          style={{ paddingLeft: "var(--gnb-padding-x)", paddingRight: "var(--gnb-padding-x)" }}
        >
          <Link href={`/chat/${params.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8" style={{ marginRight: "6px" }}>
              <ArrowLeft className="w-6 h-6 text-black" />
            </Button>
          </Link>

          <h1 className="font-semibold text-base text-black">후기 작성하기</h1>
        </div>
      </header>

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto px-4"
        style={{
          paddingTop: "calc(var(--gnb-height) + 20px)",
          paddingBottom: "calc(80px + env(safe-area-inset-bottom))",
        }}
      >
        <div className="space-y-6">
          {/* Process Recommendations */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">잇다에서 받은 추천</h2>

            {/* Process Recommendations Card */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-[15px] font-semibold text-gray-700">협업 과정에서의 좋은 점</h3>
                <div className="flex flex-wrap gap-2">
                  {processRecommendations.map((option) => (
                    <button
                      key={option.text}
                      onClick={() => toggleProcessRecommendation(option.text)}
                      className={`px-3 py-2 rounded-full text-sm transition-all flex items-center gap-1 ${
                        selectedProcessRecommendations.includes(option.text)
                          ? "bg-[#7b68ee] text-white border border-[#7b68ee] font-medium"
                          : "bg-white text-gray-400 border border-[#7b68ee] font-normal"
                      }`}
                    >
                      <span>{option.icon}</span>
                      <span>{option.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Recommendations Card */}
              <div className="space-y-3">
                <h3 className="text-[15px] font-semibold text-gray-700">협업 결과물에서의 좋은 점</h3>
                <div className="flex flex-wrap gap-2">
                  {resultRecommendations.map((option) => (
                    <button
                      key={option.text}
                      onClick={() => toggleResultRecommendation(option.text)}
                      className={`px-3 py-2 rounded-full text-sm transition-all flex items-center gap-1 ${
                        selectedResultRecommendations.includes(option.text)
                          ? "bg-[#7b68ee] text-white border border-[#7b68ee] font-medium"
                          : "bg-white text-gray-400 border border-[#7b68ee] font-normal"
                      }`}
                    >
                      <span>{option.icon}</span>
                      <span>{option.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {totalSelected > 0 && <p className="text-sm text-[#7b68ee] font-medium">{totalSelected}개 선택됨</p>}
          </div>

          {/* Review Text Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">자세한 후기를 남겨주세요</h2>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="협업 경험을 자세히 공유해주세요."
              className="w-full h-40 px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7b68ee] focus:bg-white resize-none"
              maxLength={500}
            />
            <div className="flex justify-end items-center text-xs text-gray-500">
              <span>{review.length}/500</span>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-blue-50 rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-blue-900">💡 후기 작성 팁</h3>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>협업 과정에서 좋았던 점을 구체적으로 작성해주세요</li>
              <li>소통 방식, 제품 품질, 일정 준수 등을 언급해주세요</li>
              <li>다른 광고주들에게 도움이 되는 정보를 공유해주세요</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-100"
        style={{
          paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
          paddingTop: "16px",
          borderTopColor: "rgba(0,0,0,0.08)",
        }}
      >
        <div className="px-4">
          <Button
            onClick={handleSubmit}
            disabled={totalSelected === 0}
            className="w-full h-12 bg-[#7b68ee] hover:bg-[#7b68ee]/90 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            후기 등록하기
          </Button>
        </div>
      </div>
    </div>
  )
}
