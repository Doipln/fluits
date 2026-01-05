"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const LOADING_MESSAGES = ["정보를 찾고 있어요", "리뷰를 찾고 있어요", "강점을 찾고 있어요"]

const SECOND_LOADING_MESSAGES = [
  <div key="1">
    Flu IT이 매장 정보를 분석하여
    <br />
    최적의 타겟 고객을 찾고 있어요
  </div>,
  <div key="2">Flu IT이 캠페인을 작성해드릴게요</div>,
  <div key="3">
    이제 사장님이 &quot;직접&quot; 마케팅해서
    <br />
    마케팅 비용을 절감해요
  </div>,
  <div key="4">
    Flu IT이 캠페인을
    <br />
    사장님 맞춤으로 작성해드려요
  </div>,
]

const STRENGTH_OPTIONS = [
  "맛이 좋아요",
  "분위기가 좋아요",
  "서비스가 친절해요",
  "가성비가 좋아요",
  "접근성이 좋아요",
  "인테리어가 예뻐요",
  "메뉴가 다양해요",
  "청결해요",
]

const TARGET_CUSTOMER_OPTIONS = [
  "20대 여성",
  "30대 여성",
  "20대 남성",
  "30대 남성",
  "40대 이상",
  "학생",
  "직장인",
  "주부",
  "커플",
  "가족 단위",
  "친구 모임",
  "비즈니스 미팅",
]

type Phase = "initial-loading" | "strength-selection" | "second-loading" | "target-selection"

export default function CreateAICampaignPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>("initial-loading")
  const [messageIndex, setMessageIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([])
  const [selectedTargets, setSelectedTargets] = useState<string[]>([])

  useEffect(() => {
    if (phase !== "initial-loading" && phase !== "second-loading") return

    const messages = phase === "initial-loading" ? LOADING_MESSAGES : SECOND_LOADING_MESSAGES
    const duration = phase === "initial-loading" ? 1800 : 2500 // Slower for second loading

    const interval = setInterval(() => {
      setIsFading(true)
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length)
        setIsFading(false)
      }, 500)
    }, duration)

    const totalDuration = phase === "initial-loading" ? 5400 : messages.length * duration
    const timeout = setTimeout(() => {
      if (phase === "initial-loading") {
        setPhase("strength-selection")
      } else {
        setPhase("target-selection")
      }
      setMessageIndex(0)
    }, totalDuration)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [phase])

  const toggleStrength = (strength: string) => {
    setSelectedStrengths((prev) => {
      if (prev.includes(strength)) {
        return prev.filter((s) => s !== strength)
      } else {
        if (prev.length >= 3) {
          return prev
        }
        return [...prev, strength]
      }
    })
  }

  const toggleTarget = (target: string) => {
    setSelectedTargets((prev) => {
      if (prev.includes(target)) {
        return prev.filter((t) => t !== target)
      } else {
        return [...prev, target]
      }
    })
  }

  const handleStrengthComplete = () => {
    setPhase("second-loading")
  }

  const handleTargetComplete = () => {
    router.push("/campaigns/create")
  }

  if (phase === "initial-loading") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-32 px-4">
        <div className="w-full max-w-2xl">
          <p className="text-lg sm:text-xl font-medium text-gray-900 flex items-baseline gap-2">
            <span className="whitespace-nowrap">Flu IT이 사장님의 매장</span>
            <span className="relative inline-block overflow-hidden" style={{ width: "10em", textAlign: "left" }}>
              <span
                key={messageIndex}
                className={`inline-block transition-all duration-700 ease-in-out ${
                  isFading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                }`}
              >
                {LOADING_MESSAGES[messageIndex]}
              </span>
            </span>
          </p>
        </div>

        <Button onClick={() => router.push("/profile")} variant="outline" className="mt-8">
          내 프로필로 돌아가기
        </Button>
      </div>
    )
  }

  if (phase === "second-loading") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-32 px-4">
        <div className="text-left w-full max-w-md">
          <p
            key={messageIndex}
            className={`text-lg sm:text-xl font-medium text-gray-900 transition-all duration-700 ease-in-out ${
              isFading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            {SECOND_LOADING_MESSAGES[messageIndex]}
          </p>
        </div>

        <Button onClick={() => router.push("/profile")} variant="outline" className="mt-8">
          내 프로필로 돌아가기
        </Button>
      </div>
    )
  }

  if (phase === "strength-selection") {
    return (
      <div className="min-h-screen bg-white pb-32">
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${index === 0 ? "bg-[#7b68ee]" : "bg-gray-200"}`}
              />
            ))}
          </div>
        </div>

        <main className="px-4 py-8 space-y-6 mt-4">
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              네이버 블로그/리뷰 분석결과, 캠페인에서 강조하고 싶은 강점을 최대 3개 선택해주세요.
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {STRENGTH_OPTIONS.map((strength) => {
                const isSelected = selectedStrengths.includes(strength)
                return (
                  <button
                    key={strength}
                    onClick={() => toggleStrength(strength)}
                    className={`
                      relative px-4 py-3 rounded-xl border-2 transition-all
                      ${isSelected ? "border-[#7b68ee] bg-[#7b68ee]/5" : "border-gray-200 bg-white hover:border-gray-300"}
                    `}
                  >
                    <span className={`text-sm font-medium ${isSelected ? "text-[#7b68ee]" : "text-gray-700"}`}>
                      {strength}
                    </span>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#7b68ee] rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <Button onClick={() => router.push("/profile")} variant="outline" className="w-full">
            내 프로필로 돌아가기
          </Button>

          {selectedStrengths.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
              <Button
                onClick={handleStrengthComplete}
                className="w-full h-12 bg-[#7b68ee] hover:bg-[#7b68ee]/90 text-white font-semibold"
              >
                선택완료 ({selectedStrengths.length}/3)
              </Button>
            </div>
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors ${index <= 1 ? "bg-[#7b68ee]" : "bg-gray-200"}`}
            />
          ))}
        </div>
      </div>

      <main className="px-4 py-8 space-y-6 mt-4">
        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Flu IT 추천 타겟 고객 선정</h2>
          <p className="text-sm text-gray-500">우리 매장이 집중 공략할 고객층을 선택해주세요</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {TARGET_CUSTOMER_OPTIONS.map((target) => {
            const isSelected = selectedTargets.includes(target)
            return (
              <button
                key={target}
                onClick={() => toggleTarget(target)}
                className={`
                  relative px-4 py-3 rounded-xl border-2 transition-all
                  ${isSelected ? "border-[#7b68ee] bg-[#7b68ee]/5" : "border-gray-200 bg-white hover:border-gray-300"}
                `}
              >
                <span className={`text-sm font-medium ${isSelected ? "text-[#7b68ee]" : "text-gray-700"}`}>
                  {target}
                </span>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[#7b68ee] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <Button onClick={() => router.push("/profile")} variant="outline" className="w-full">
          내 프로필로 돌아가기
        </Button>

        {selectedTargets.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <Button
              onClick={handleTargetComplete}
              className="w-full h-12 bg-[#7b68ee] hover:bg-[#7b68ee]/90 text-white font-semibold"
            >
              선택완료
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
