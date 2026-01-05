"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, X, Lightbulb, ChevronDown } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import ProfileCard from "@/components/profile-card"

export default function CreateProposalPage() {
  const router = useRouter()
  const [proposalText, setProposalText] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [expandTips, setExpandTips] = useState(false)

  useEffect(() => {
    const savedProposal = localStorage.getItem("influencer_proposal")
    if (savedProposal) {
      setProposalText(savedProposal)
    }
  }, [])

  const handleSave = () => {
    setIsSaving(true)
    localStorage.setItem("influencer_proposal", proposalText)
    console.log("[v0] Proposal saved successfully")
    setTimeout(() => {
      setIsSaving(false)
      router.back()
    }, 300)
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white">
        <div className="flex items-center p-2 gap-3">
          <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">내 제안서 관리</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4 mb-20">
          {/* 제안서 작성 꿀팁 */}
          <div className="bg-purple-50 rounded-lg overflow-hidden">
            <div className="p-4 pb-3">
              <h3 className="font-semibold text-gray-900 text-sm">제안서 작성 꿀팁</h3>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ${expandTips ? "max-h-[1000px]" : "max-h-[180px]"}`}
            >
              <div className="space-y-3 px-4 pb-3">
                <div>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-[#7b68ee] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">이 캠페인에 잘 어울리는 이유</p>
                      <ul className="text-xs text-gray-600 mt-1.5 space-y-1">
                        <li>• 캠페인에 관심이 생긴 계기</li>
                        <li>• 브랜드·제품과 콘텐츠의 연결 포인트</li>
                      </ul>
                      <p className="text-xs text-gray-600 rounded px-2 py-1.5 mt-2 italic">
                        예) 평소 ○○ 관련 콘텐츠를 자주 제작하고 있어 이번 캠페인과 잘 어울린다고 생각했어요.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-[#7b68ee] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">콘텐츠 스타일과 활용 아이디어</p>
                      <ul className="text-xs text-gray-600 mt-1.5 space-y-1">
                        <li>• 어떤 형식으로 콘텐츠를 만들 계획인지</li>
                        <li>• 자연스럽게 보여줄 수 있는 방식</li>
                      </ul>
                      <p className="text-xs text-gray-600 rounded px-2 py-1.5 mt-2 italic">
                        예) 일상 브이로그 안에서 실제 사용 장면을 자연스럽게 담아 콘텐츠로 풀고 싶어요.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-[#7b68ee] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">크리에이터의 강점과 차별점</p>
                      <ul className="text-xs text-gray-600 mt-1.5 space-y-1">
                        <li>• 콘텐츠의 특징</li>
                        <li>• 팔로워 반응이나 소통 방식</li>
                      </ul>
                      <p className="text-xs text-gray-600 rounded px-2 py-1.5 mt-2 italic">
                        예) 팔로워와의 댓글 소통이 활발하고, 솔직한 리뷰에 공감도가 높은 편이에요.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 더보기/접기 버튼 영역 */}
            <button
              onClick={() => setExpandTips(!expandTips)}
              className="w-full flex justify-center py-1.5 px-4 hover:bg-purple-100/50 transition-colors rounded-t-lg"
            >
              <span className="text-sm font-semibold text-[#7b68ee] flex items-center gap-1.5">
                {expandTips ? (
                  <>
                    접기
                    <ChevronDown className="w-4 h-4 rotate-180" />
                  </>
                ) : (
                  <>
                    더보기
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </span>
            </button>
          </div>

          <div>
            <label className="text-xs text-gray-600 text-left block">
              이 제안서는 캠페인에 지원 시, 인플루언서님을 소개하는 공간이에요. 300자 이상 작성할수록 선정 확률이
              올라가요.
            </label>
            <Textarea
              value={proposalText}
              onChange={(e) => setProposalText(e.target.value)}
              placeholder="인플루언서님만의 콘텐츠 스타일과 강점을 살려, 여러 광고주님에게 어필할 제안서를 작성해보세요!"
              className="mt-2 min-h-[380px] resize-none border-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-2">
        <div className="max-w-full flex gap-3">
          <Button variant="outline" onClick={() => setShowPreview(true)} className="flex-[3] h-12 bg-transparent">
            미리보기
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="flex-[7] bg-[#7b68ee] hover:bg-[#7b68ee]/90 h-12">
            {isSaving ? "저장 중..." : "저장하기"}
          </Button>
        </div>
      </div>

      {/* Preview Modal Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent
          className="w-[calc(100vw-32px)] max-w-[360px] max-h-[85vh] p-0 flex flex-col rounded-2xl overflow-hidden border-0 mx-auto"
          showCloseButton={false}
        >
          {/* Header - Fixed */}
          <div className="border-b border-gray-200 bg-white px-4 py-2 flex items-center justify-between flex-shrink-0">
            <span className="text-xs text-gray-600">
              인플루언서님이 캠페인 지원시,
              <br />
              광고주님에게 보이는 화면이에요
            </span>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {/* Campaign Info Section */}
            <div className="border-b border-gray-200 bg-white px-3 py-1 pb-2 flex-shrink-0">
              <div className="space-y-1 cursor-pointer hover:bg-gray-50/50 rounded-lg p-1.5 -m-1.5 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[#7b68ee]/20 bg-[#7b68ee]/5 text-[#7b68ee] h-6 flex items-center">
                    협업 제안
                  </span>
                </div>
                <div style={{ marginBottom: "4px" }}>
                  <h2 className="text-xs font-medium text-gray-900 leading-tight">인플루언서 제안서</h2>
                  <p className="text-base font-semibold text-gray-900 mt-0.5">협업 기회</p>
                </div>
              </div>

              <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                <button
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold bg-white border border-black/10 text-[#7b68ee] flex items-center justify-center gap-1.5 hover:border-black/20 transition-all duration-150"
                  style={{ minHeight: "36px" }}
                  disabled
                >
                  <span className="text-xs font-semibold truncate">협업 확정 요청</span>
                </button>
                <button
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold bg-white border border-black/10 text-[#7b68ee] flex items-center justify-center gap-1.5 hover:border-black/20 transition-all duration-150"
                  style={{ minHeight: "36px" }}
                  disabled
                >
                  <span className="text-xs font-semibold truncate">후기 작성하기</span>
                </button>
              </div>
            </div>

            {/* Chat messages area - scrollable */}
            <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-3 space-y-3 min-h-0">
              <div className="flex justify-start">
                <div className="max-w-[85%]">
                  <div>
                    <ProfileCard
                      influencer={{
                        name: "인플루언서 이름",
                        avatar: "/placeholder.svg",
                        verified: true,
                        category: "뷰티",
                        region: "서울",
                        followers: "50K",
                        followersDisplay: "50K",
                        engagement: "3.2%",
                        hashtags: ["#뷰티", "#라이프스타일"],
                      }}
                      showFavoriteButton={false}
                    />
                  </div>
                  <span className="text-xs text-gray-400 mt-1 block px-1 text-left">오전 10:30</span>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="max-w-[85%]">
                  <div className="bg-gray-200 text-gray-900 rounded-2xl px-4 py-3">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {proposalText || "제안서 내용을 입력하세요."}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 block px-1 text-left">오전 10:31</span>
                </div>
              </div>
            </div>

            {/* Chat input area - Fixed at bottom */}
            <div className="border-t border-gray-200 bg-white px-4 py-3 flex-shrink-0">
              <div className="flex items-center gap-3">
                <button className="flex-shrink-0 text-gray-400">
                  <span className="text-lg">📎</span>
                </button>
                <input
                  type="text"
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 h-10 px-4 bg-gray-100 rounded-xl border-0 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7b68ee] focus:bg-white"
                  disabled
                />
                <button className="flex-shrink-0 text-gray-400">
                  <span className="text-lg">→</span>
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
