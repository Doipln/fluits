"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileText, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function VerificationPage() {
  const router = useRouter()
  const [selectedPlatform, setSelectedPlatform] = useState<string>("instagram")
  const [lastSelectedPlatform, setLastSelectedPlatform] = useState<string>("instagram")
  const [instagramId, setInstagramId] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [blogVerificationCode, setBlogVerificationCode] = useState("")
  const [isInstagramVerified, setIsInstagramVerified] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [blogCooldownTime, setBlogCooldownTime] = useState(0)
  const [isCodeIssued, setIsCodeIssued] = useState(false)
  const [isBlogCodeIssued, setIsBlogCodeIssued] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isVerificationSubmitted, setIsVerificationSubmitted] = useState(false)
  const [submittedAt, setSubmittedAt] = useState("")
  const [isInstagramCodeGenerated, setIsInstagramCodeGenerated] = useState(false)
  const [isBlogCodeGenerated, setIsBlogCodeGenerated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("influencerVerification")
    if (saved) {
      const data = JSON.parse(saved)
      setSelectedPlatform(data.selectedPlatform || "instagram")
      setLastSelectedPlatform(data.lastSelectedPlatform || "instagram")
      setInstagramId(data.instagramId || "")
      setVerificationCode(data.verificationCode || "")
      setBlogVerificationCode(data.blogVerificationCode || "")
      setIsInstagramVerified(data.isInstagramVerified || false)
      setIsCodeIssued(data.isCodeIssued || false)
      setIsVerificationSubmitted(data.isVerificationSubmitted || false)
      setSubmittedAt(data.submittedAt || "")
    }
    // Initialize code generation states to false on page load
    setIsInstagramCodeGenerated(false)
    setIsBlogCodeGenerated(false)
  }, [])

  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldownTime])

  useEffect(() => {
    if (blogCooldownTime > 0) {
      const timer = setTimeout(() => setBlogCooldownTime(blogCooldownTime - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [blogCooldownTime])

  const togglePlatform = (platform: string) => {
    setSelectedPlatform(platform)
    setLastSelectedPlatform(platform)
  }

  const handleIssueCode = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    setVerificationCode(newCode)
    setCooldownTime(180)
    setIsCodeIssued(true)
    setIsInstagramCodeGenerated(true)
  }

  const handleIssueBlogCode = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    setBlogVerificationCode(newCode)
    setBlogCooldownTime(180)
    setIsBlogCodeIssued(true)
    setIsBlogCodeGenerated(true)
  }

  const handleVerify = () => {
    setShowSuccessModal(true)
    const verificationData = {
      selectedPlatform,
      lastSelectedPlatform,
      instagramId,
      verificationCode,
      blogVerificationCode,
      isInstagramVerified: true,
      isCodeIssued,
      isBlogCodeIssued,
      isVerificationSubmitted: true,
      submittedAt: new Date().toISOString(),
      isInstagramCodeGenerated,
      isBlogCodeGenerated,
    }
    localStorage.setItem("influencerVerification", JSON.stringify(verificationData))
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    router.push("/profile")
  }

  if (showSuccessModal) {
    return (
      <div className="w-full h-screen bg-white flex flex-col items-center justify-between px-4 py-8">
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .check-icon {
            animation: float 2s ease-in-out infinite;
          }
        `}</style>

        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Animated check icon */}
          <div className="check-icon w-20 h-20 rounded-full bg-[#7b68ee] flex items-center justify-center mb-8">
            <Check className="w-10 h-10 text-white" />
          </div>

          {/* Text */}
          <p className="text-xl text-gray-900 font-semibold">승인 완료시 알려드릴게요</p>
        </div>

        <Button
          onClick={handleCloseSuccessModal}
          className="w-full h-12 bg-[#7b68ee] hover:bg-[#6a5acd] text-white font-semibold rounded-lg transition-colors max-w-md"
        >
          알겠습니다
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">인증 상태</h1>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="bg-[#7b68ee]/5 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#7b68ee]">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">인증 마크 안내</h4>
            </div>
            <div className="space-y-2 text-sm text-gray-700 ml-7 mt-3">
              <p className="flex items-start gap-2">
                <span className="text-[#7b68ee] font-semibold">•</span>
                <span>인증 마크가 있으면 광고주에게 신뢰도 있게 보여요</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#7b68ee] font-semibold">•</span>
                <span>협업 제안을 받을 확률이 높아져요</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#7b68ee] font-semibold">•</span>
                <span>실제 인플루언서로 표시돼요</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-0">
            <h3 className="text-lg font-semibold text-gray-900">
              플랫폼 인증하기 <span className="text-sm text-gray-400 font-normal">(1개 이상 필수)</span>
            </h3>
          </div>

          <div className="flex gap-2 mt-0.5">
            <button
              type="button"
              onClick={() => togglePlatform("instagram")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedPlatform === "instagram"
                  ? "bg-[#7b68ee] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.259.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.849-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
              </svg>
              <span>인스타그램</span>
            </button>
            <button
              type="button"
              onClick={() => togglePlatform("blog")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedPlatform === "blog" ? "bg-[#7b68ee] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>블로그</span>
            </button>
          </div>
        </div>

        {selectedPlatform === "blog" && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#7b68ee]" />
                <h4 className="font-semibold text-gray-900">블로그 계정 인증</h4>
              </div>

              <div className="border-t border-gray-300"></div>

              <div className="space-y-4">
                <h5 className="text-sm font-semibold text-gray-900">계정 인증 절차 안내</h5>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7b68ee] text-white flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-gray-900">플루잇 블로그 공식계정을 이웃으로 추가해주세요!</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7b68ee] text-white flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-gray-900">인플루언서님의 블로그 정보를 캡쳐해주세요.</p>
                    <p className="text-xs text-gray-600">(인플루언서님의 프로필 정보에 등록돼요)</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <img src="/images/1222.png" alt="블로그 인증 방법" className="w-full rounded-lg" />
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7b68ee] text-white flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-gray-900">
                      아래 인증코드를 발급받고, 인증코드와 함께 캡쳐한 사진을 플루잇 공식계정으로 전송해주세요.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-300"></div>

              <div className="space-y-2">
                <Button
                  onClick={handleIssueBlogCode}
                  disabled={blogCooldownTime > 0}
                  className={`w-full h-10 text-white rounded-lg font-semibold transition-colors ${
                    blogCooldownTime > 0 ? "bg-gray-300 cursor-not-allowed" : "bg-[#7b68ee] hover:bg-[#6a5acd]"
                  }`}
                >
                  {blogCooldownTime > 0 ? `${blogCooldownTime}초 대기중` : "인증코드 발급받기"}
                </Button>
                <p
                  className={`text-sm text-gray-600 mt-3 transition-opacity duration-300 ${
                    isBlogCodeIssued ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  승인은 요청 후 최대 6시간 이내에 확인돼요.
                </p>
              </div>

              <div className="mt-6">
                <Label className="text-base font-semibold text-gray-700">인증코드</Label>
                <div className="flex gap-2 items-end mt-2">
                  <Input
                    value={blogVerificationCode}
                    readOnly
                    className="w-24 h-10 rounded-lg border-gray-300 bg-white text-black text-center font-semibold text-sm"
                    placeholder="코드"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (blogVerificationCode) navigator.clipboard.writeText(blogVerificationCode)
                    }}
                    className="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    복사
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  플루잇 공식계정으로 인증코드를 보내주세요.
                  <br />
                  <a
                    href="https://blog.naver.com/fluetit_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7b68ee] hover:text-[#6a5acd] font-semibold underline"
                  >
                    플루잇 공식계정으로 바로가기
                  </a>
                </p>
              </div>
            </div>

            {/* Moved button outside card for consistent layout with Instagram section */}
            <div className="mt-6 pt-4 border-t border-gray-300">
              <Button
                onClick={handleVerify}
                disabled={!isBlogCodeGenerated}
                className={`w-full h-12 text-white font-semibold rounded-lg transition-colors ${
                  isBlogCodeGenerated ? "bg-[#7b68ee] hover:bg-[#6a5acd]" : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                인증코드를 전송했어요
              </Button>
            </div>
          </div>
        )}

        {selectedPlatform === "instagram" && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#7b68ee]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.259.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.849-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                </svg>
                <h4 className="font-semibold text-gray-900">인스타그램 계정 인증</h4>
              </div>

              <div className="border-t border-gray-300"></div>

              <div className="space-y-4">
                <h5 className="text-sm font-semibold text-gray-900">계정 인증 절차 안내</h5>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7b68ee] text-white flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-gray-900">인스타그램 아이디 입력</p>
                    <p className="text-xs text-gray-600">협업에 사용할 본인의 인스타그램 아이디를 입력해주세요.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7b68ee] text-white flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-gray-900">인증 코드 DM 전송</p>
                    <p className="text-xs text-gray-600">
                      아래 인증 코드를 복사해
                      <br />
                      인스타그램 공식 계정에 DM으로 보내주세요.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7b68ee] text-white flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-gray-900">인증 완료</p>
                    <p className="text-xs text-gray-600">
                      DM 확인 후 자동으로 인증이 완료되며
                      <br />
                      프로필에 인증 마크가 표시됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-700">인스타그램 아이디</Label>
              <div className="flex gap-2">
                <Input
                  value={instagramId}
                  onChange={(e) => setInstagramId(e.target.value)}
                  placeholder="인스타그램 아이디를 입력하세요"
                  className="flex-1 h-10 rounded-lg border-gray-300"
                />
                <Button
                  onClick={handleIssueCode}
                  disabled={cooldownTime > 0}
                  className={`h-10 px-4 text-white rounded-lg font-semibold transition-colors ${
                    cooldownTime > 0 ? "bg-gray-300 cursor-not-allowed" : "bg-[#7b68ee] hover:bg-[#6a5acd]"
                  }`}
                >
                  {cooldownTime > 0 ? `${cooldownTime}초` : "발급하기"}
                </Button>
              </div>
            </div>

            <p
              className={`text-sm text-gray-500 transition-opacity duration-300 ${isCodeIssued ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              DM은 요청 후 최대 6시간 이내에 확인돼요.
            </p>

            <div className="space-y-2 mt-4">
              <Label className="text-base font-semibold text-gray-700">인증코드</Label>
              <div className="flex gap-2 items-end">
                <Input
                  value={verificationCode}
                  readOnly
                  className="w-24 h-10 rounded-lg border-gray-300 bg-white text-black text-center font-semibold text-sm"
                  placeholder="코드"
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (verificationCode) navigator.clipboard.writeText(verificationCode)
                  }}
                  className="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  복사
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                플루잇 공식계정으로 인증코드를 보내주세요.
                <br />
                <a
                  href="https://www.instagram.com/fluetit_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7b68ee] hover:text-[#6a5acd] font-semibold underline"
                >
                  플루잇 프로필 바로가기
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Moved button outside card for consistent layout with Instagram section */}
        {selectedPlatform === "instagram" && (
          <div className="mt-6 pt-4 border-t border-gray-300">
            <Button
              onClick={handleVerify}
              disabled={!isInstagramCodeGenerated}
              className={`w-full h-12 text-white font-semibold rounded-lg transition-colors ${
                isInstagramCodeGenerated ? "bg-[#7b68ee] hover:bg-[#6a5acd]" : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              인증코드를 전송했어요
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
