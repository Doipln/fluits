"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  MoreVertical,
  Paperclip,
  Send,
  Check,
  CheckCircle,
  PenTool,
  Flag,
  UserX,
  LogOut,
  X,
  ImageIcon,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useCampaigns } from "@/lib/campaign-store"
import { useChatStore } from "@/lib/chat-store"
import { useInfluencers } from "@/lib/influencer-store"
import { useApplicationStore } from "@/lib/application-store"
import Image from "next/image"

const applicants = [
  {
    id: 1,
    name: "김뷰티",
    followers: "125K",
    avatar: "/korean-beauty-influencer.jpg",
    category: "뷰티",
  },
  {
    id: 2,
    name: "박뷰티",
    followers: "89K",
    avatar: "/korean-beauty-influencer-2.jpg",
    category: "뷰티",
  },
  {
    id: 3,
    name: "이뷰티",
    followers: "203K",
    avatar: "/korean-beauty-influencer-3.jpg",
    category: "뷰티",
  },
  {
    id: 4,
    name: "최소영",
    followers: "156K",
    avatar: "/korean-fashion-influencer-woman-stylish-outfit.jpg",
    category: "뷰티",
  },
  {
    id: 5,
    name: "정민아",
    followers: "98K",
    avatar: "/korean-beauty-guru-woman-cosmetics-review.jpg",
    category: "뷰티",
  },
  {
    id: 6,
    name: "한서연",
    followers: "72K",
    avatar: "/korean-street-fashion-influencer-woman-vintage-sty.jpg",
    category: "뷰티",
  },
  {
    id: 7,
    name: "송하늘",
    followers: "134K",
    avatar: "/korean-food-influencer-woman-cooking-restaurant-re.jpg",
    category: "뷰티",
  },
]

export default function ChatDetailPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: { influencerId?: string; influencerName?: string; influencerAvatar?: string; campaignId?: string }
}) {
  const [message, setMessage] = useState("")
  const [showMoreModal, setShowMoreModal] = useState(false)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [scheduleMonth, setScheduleMonth] = useState("")
  const [scheduleDay, setScheduleDay] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [imagePreview, setImagePreview] = useState<{ url: string; type: string } | null>(null) // Added for image preview
  const topCardRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { getCampaignById, updateCampaign, campaigns } = useCampaigns()
  const { getChatById, addMessage, updateChatCampaignStatus, updateCollaborationStatus, addChat, chats, deleteChat } =
    useChatStore()
  const { getInfluencerById } = useInfluencers()
  const { updateApplicationStatus } = useApplicationStore()
  const chatId = Number.parseInt(params.id)

  const [chat, setChat] = useState(() => getChatById(chatId))

  useEffect(() => {
    const existingChat = getChatById(chatId)

    if (existingChat) {
      console.log("[v0] Chat found:", existingChat.id)
      setChat(existingChat)
    } else {
      console.log("[v0] Chat not found with ID:", chatId)
      console.log("[v0] Total chats:", chats.length)
      console.log("[v0] Redirecting to chat list...")
      // Redirect immediately if chat not found
      router.push("/chat")
    }
  }, [chatId, getChatById, chats, router])

  const [isInfluencerMode, setIsInfluencerMode] = useState(false)
  const [isFirstApplication, setIsFirstApplication] = useState(true)
  const [decisionStatus, setDecisionStatus] = useState<"pending" | "accepted" | "rejected">("pending")
  const [showApprovalCard, setShowApprovalCard] = useState(false)
  const [hasPendingCollaborationRequest, setHasPendingCollaborationRequest] = useState(false)
  const [isCollaborationConfirmed, setIsCollaborationConfirmed] = useState(chat?.isCollaborationConfirmed || false)
  const approvalCardRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const mode = localStorage.getItem("influencer_mode") === "true"
    setIsInfluencerMode(mode)
  }, [])

  useEffect(() => {
    if (chat?.isCollaborationConfirmed) {
      setIsCollaborationConfirmed(true)
    }
  }, [chat?.isCollaborationConfirmed])

  const handleSendMessage = () => {
    if (message.trim() && !showApprovalCard && chat) {
      addMessage(chat.id, {
        senderId: 1, // Current user ID
        senderType: isInfluencerMode ? "influencer" : "advertiser",
        content: message.trim(),
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        type: "text",
      })
      setMessage("")
      console.log("[v0] Message sent to chat:", chat.id)
    }
  }

  const handleAcceptCollaboration = () => {
    setDecisionStatus("accepted")
    setShowApprovalCard(false)
  }

  const handleRejectCollaboration = () => {
    console.log("[v0] Rejecting collaboration for chat:", chatId)

    if (chat?.campaignId) {
      updateApplicationStatus(chat.campaignId, "다음기회에")
      console.log("[v0] Updated application status to '다음기회에' for campaign:", chat.campaignId)
    }

    setDecisionStatus("rejected")
    setShowApprovalCard(false)

    deleteChat(chatId)
    router.replace("/chat")
  }

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "구인 진행중":
        return {
          textColor: "#7b68ee",
          borderColor: "#7b68ee",
          backgroundColor: "rgba(123,104,238,0.12)",
        }
      case "구인 마감":
        return {
          textColor: "#666",
          borderColor: "#666",
          backgroundColor: "#F0F1F3",
        }
      case "비공개 글":
        return {
          textColor: "#888",
          borderColor: "#888",
          backgroundColor: "#F4F5F7",
        }
      default:
        return {
          textColor: "#666",
          borderColor: "#666",
          backgroundColor: "#F0F1F3",
        }
    }
  }

  const handleCampaignClick = () => {
    if (chat?.campaignId) {
      router.push(`/campaigns/${chat.campaignId}`)
    }
  }

  const handleCloseModal = () => {
    setShowMoreModal(false)
  }

  const updateTopCardHeight = () => {
    if (topCardRef.current) {
      const height = topCardRef.current.offsetHeight
      document.documentElement.style.setProperty("--topcard-h", `${height}px`)
    }
  }

  const updateApprovalCardHeight = () => {
    if (approvalCardRef.current && showApprovalCard) {
      const height = approvalCardRef.current.offsetHeight
      document.documentElement.style.setProperty("--approval-card-h", `${height}px`)
    } else {
      document.documentElement.style.setProperty("--approval-card-h", "0px")
    }
  }

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === approvalCardRef.current?.querySelector("button:first-child")) {
          e.preventDefault()
          approvalCardRef.current?.querySelector("button:last-child")?.focus()
        }
      } else {
        if (document.activeElement === approvalCardRef.current?.querySelector("button:last-child")) {
          e.preventDefault()
          approvalCardRef.current?.querySelector("button:first-child")?.focus()
        }
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setFilePreviewUrl(previewUrl)
      setShowAttachmentMenu(false)
      setImagePreview({ url: previewUrl, type: file.type }) // Set image preview state
    }
  }

  const handleSendFile = () => {
    if (selectedFile && filePreviewUrl && chat) {
      addMessage(chat.id, {
        senderId: 1,
        senderType: isInfluencerMode ? "influencer" : "advertiser",
        content: filePreviewUrl,
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        type: selectedFile.type.startsWith("video/") ? "video" : "image",
      })
      // Clean up
      URL.revokeObjectURL(filePreviewUrl)
      setSelectedFile(null)
      setFilePreviewUrl(null)
      setImagePreview(null) // Clear image preview
    }
  }

  const handleCancelFile = () => {
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl)
    }
    setSelectedFile(null)
    setFilePreviewUrl(null)
    setImagePreview(null) // Clear image preview
  }

  const handleScheduleSelect = () => {
    console.log("[v0] Schedule select called with:", { scheduleMonth, scheduleDay, scheduleTime })

    if (!scheduleMonth || !scheduleDay || !scheduleTime) {
      alert("월, 일, 시간을 모두 입력해주세요")
      return
    }

    const scheduleMessage = `일정을 정해요\n${scheduleMonth}월 ${scheduleDay}일 ${scheduleTime}`
    console.log("[v0] Sending schedule message:", scheduleMessage)

    addMessage(chat.id, {
      senderId: isInfluencerMode ? chat.influencerId : chat.advertiserId,
      senderType: isInfluencerMode ? "influencer" : "advertiser",
      content: scheduleMessage,
      timestamp: new Date().toLocaleTimeString("ko-KR"),
      type: "text",
    })

    console.log("[v0] Schedule message added, resetting state")

    // Reset and close
    setScheduleMonth("")
    setScheduleDay("")
    setScheduleTime("")
    setShowScheduleDialog(false)
  }

  const handleFinalConfirmation = () => {
    console.log("[v0] handleFinalConfirmation called")
    setHasPendingCollaborationRequest(false)
    setIsCollaborationConfirmed(true)
    updateCollaborationStatus(chat.id, true)

    if (chat?.campaignId && chat?.influencerId) {
      const campaign = getCampaignById(chat.campaignId)
      if (campaign) {
        const currentConfirmed = campaign.confirmedApplicants || 0
        const totalRecruitCount = Number.parseInt(campaign.recruitCount || "1")
        const newConfirmedCount = currentConfirmed + 1

        console.log(`[v0] Campaign ${chat.campaignId}: ${newConfirmedCount}/${totalRecruitCount} positions confirmed`)

        const updates: Partial<any> = {
          confirmedApplicants: newConfirmedCount,
        }

        if (newConfirmedCount >= totalRecruitCount) {
          updates.status = "구인 마감"
          console.log(`[v0] Campaign ${chat.campaignId} is now fully staffed and closed`)
          updateChatCampaignStatus(chat.id, "구인 마감")
        } else {
          console.log(
            `[v0] Campaign ${chat.campaignId} still has ${totalRecruitCount - newConfirmedCount} positions remaining`,
          )
        }

        updateCampaign(chat.campaignId, updates)
      }

      const careerRecords = JSON.parse(localStorage.getItem("influencer_career_records") || "[]")
      const newCareer = {
        id: Date.now(),
        influencerId: chat.influencerId,
        campaignId: chat.campaignId,
        projectName: chat.campaignTitle,
        date: `${new Date().getFullYear().toString().slice(2)}년 ${new Date().getMonth() + 1}월 ${new Date().getDate()}일 업로드`,
        type: "포스팅",
        tags: [chat.campaignCategory || "기타"],
        verified: true,
        createdAt: new Date().toISOString(),
      }
      careerRecords.push(newCareer)
      localStorage.setItem("influencer_career_records", JSON.stringify(careerRecords))
      console.log("[v0] Career record added for influencer:", chat.influencerId)
    }

    addMessage(chat.id, {
      senderId: 1,
      senderType: isInfluencerMode ? "influencer" : "advertiser",
      content: "협업이 확정되었습니다. 캠페인이 자동으로 마감됩니다.",
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    })

    console.log("[v0] Collaboration confirmed, campaign closed")
  }

  const handleImageSend = () => {
    if (imagePreview && chat) {
      addMessage(chat.id, {
        senderId: 1,
        senderType: isInfluencerMode ? "influencer" : "advertiser",
        content: imagePreview.url,
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        type: imagePreview.type.startsWith("video/") ? "video" : "image",
      })
      setImagePreview(null) // Clear image preview
      setSelectedFile(null) // Clear selected file
      setFilePreviewUrl(null) // Clear file preview URL
    }
  }

  return (
    <div
      className="h-screen bg-gray-50 flex flex-col overflow-x-hidden"
      style={
        {
          "--inputbar-h": "60px",
          "--topcard-h": "180px",
          "--gap-top": "12px",
          "--approval-card-h": "0px",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        html {
          scroll-padding-top: calc(var(--gnb-height) + var(--topcard-h) + var(--gap-top));
        }
      `}</style>

      <header
        className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-100"
        style={{ height: "var(--gnb-height)", borderBottomColor: "rgba(0,0,0,0.06)" }}
      >
        <div
          className="flex items-center h-full"
          style={{ paddingLeft: "var(--gnb-padding-x)", paddingRight: "var(--gnb-padding-x)" }}
        >
          <Link href="/chat">
            <Button variant="ghost" size="icon" className="h-8 w-8" style={{ marginRight: "6px" }}>
              <ArrowLeft className="w-6 h-6 text-black" />
            </Button>
          </Link>

          <div className="flex items-center gap-2 flex-1">
            <Link
              href={`/influencers/${chat?.influencerId || "demo"}`}
              className="flex items-center gap-2 flex-1 min-w-0 hover:opacity-80 transition-opacity"
            >
              <h1 className="font-semibold text-base text-black truncate">{chat?.influencerName}</h1>
              {chat?.verified && (
                <div className="w-4 h-4 bg-[#7b68ee] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
                </div>
              )}
            </Link>
          </div>

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowMoreModal(true)}>
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <Drawer open={showMoreModal} onOpenChange={setShowMoreModal}>
        <DrawerContent className="rounded-t-3xl [&>div:first-child]:hidden">
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
          <div className="px-4 pt-2 pb-6 space-y-0">
            <DrawerClose asChild>
              <button className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Flag className="w-5 h-5 text-gray-600" />
                <span className="text-base font-medium text-gray-900">신고하기</span>
              </button>
            </DrawerClose>
            <DrawerClose asChild>
              <button className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <UserX className="w-5 h-5 text-[#D92D20]" />
                <span className="text-base font-medium text-[#D92D20]">차단하기</span>
              </button>
            </DrawerClose>
            <button
              onClick={() => {
                deleteChat(chatId)
                setShowMoreModal(false)
                router.push("/chat")
              }}
              className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 text-[#D92D20]" />
              <span className="text-base font-medium text-[#D92D20]">나가기</span>
            </button>
          </div>
        </DrawerContent>
      </Drawer>

      <div
        ref={topCardRef}
        className="fixed inset-x-0 z-[95]"
        style={{
          top: "var(--gnb-height)",
          width: "100%",
        }}
      >
        <div className="bg-white rounded-b-2xl px-3 py-2 pb-2">
          <div
            className="space-y-1.5 cursor-pointer hover:bg-gray-50/50 rounded-lg p-1.5 -m-1.5 transition-colors duration-200"
            onClick={handleCampaignClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleCampaignClick()
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`캠페인 상세보기: ${chat?.campaignTitle}`}
            style={{
              outline: "none",
              boxShadow: "none",
              WebkitTapHighlightColor: "transparent",
              WebkitFocusRingColor: "transparent",
            }}
            onFocus={(e) => {
              if (e.target.matches(":focus-visible")) {
                e.target.style.outline = "2px solid rgba(123,104,238,0.5)"
                e.target.style.outlineOffset = "2px"
              }
            }}
            onBlur={(e) => {
              e.target.style.outline = "none"
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                style={{
                  color: getStatusBadgeStyle(chat?.campaignStatus || "").textColor,
                  borderColor: getStatusBadgeStyle(chat?.campaignStatus || "").borderColor,
                  backgroundColor: getStatusBadgeStyle(chat?.campaignStatus || "").backgroundColor,
                  height: "26px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {chat?.campaignStatus || "비공개 글"}
              </span>
            </div>

            <div style={{ marginBottom: "4px" }}>
              <h2 className="text-xs font-medium text-gray-900 leading-tight">{chat?.campaignTitle}</h2>
              <p className="text-base font-semibold text-gray-900 mt-0.5">{chat?.campaignReward}</p>
            </div>
          </div>

          <div className="flex gap-2" style={{ marginTop: "6px" }} onClick={(e) => e.stopPropagation()}>
            <button
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold bg-white border border-black/10 text-[#7b68ee] flex items-center justify-center gap-1.5 hover:border-black/20 hover:opacity-100 active:scale-98 focus:outline-none focus:ring-2 focus:ring-[#7b68ee] focus:ring-offset-1 transition-all duration-150 ${showApprovalCard || hasPendingCollaborationRequest || isCollaborationConfirmed ? "opacity-50 pointer-events-none" : ""}`}
              style={{ minHeight: "36px" }}
              disabled={showApprovalCard || hasPendingCollaborationRequest || isCollaborationConfirmed}
              onClick={(e) => {
                e.stopPropagation()
                console.log("[v0] Collaboration request clicked")
                handleFinalConfirmation()
              }}
            >
              <CheckCircle className="w-4 h-4 text-[#7b68ee] flex-shrink-0" />
              <span className="text-xs font-semibold truncate">
                {isCollaborationConfirmed ? "협업 완료" : "협업 확정 요청"}
              </span>
            </button>
            <Link
              href={`/chat/${params.id}/review`}
              className={`flex-1 ${showApprovalCard || !isCollaborationConfirmed ? "opacity-50 pointer-events-none" : ""}`}
              onClick={(e) => {
                if (showApprovalCard || !isCollaborationConfirmed) {
                  e.preventDefault()
                }
              }}
            >
              <button
                className="w-full px-3 py-2 rounded-lg text-sm font-semibold bg-white border border-black/10 text-[#7b68ee] flex items-center justify-center gap-1.5 hover:border-black/20 hover:opacity-100 active:scale-98 focus:outline-none focus:ring-2 focus:ring-[#7b68ee] focus:ring-offset-1 transition-all duration-150"
                style={{ minHeight: "36px" }}
                disabled={showApprovalCard || !isCollaborationConfirmed}
                onClick={(e) => e.stopPropagation()}
              >
                <PenTool className="w-4 h-4 text-[#7b68ee] flex-shrink-0" />
                <span className="text-xs font-semibold truncate">후기 작성하기</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto"
        style={{
          paddingTop: "calc(var(--gnb-height) + var(--topcard-h) + var(--gap-top))",
          paddingBottom: showApprovalCard
            ? "calc(var(--approval-card-h) + env(safe-area-inset-bottom))"
            : "calc(var(--inputbar-h) + env(safe-area-inset-bottom))",
          transition: "padding-bottom 0.3s ease-in-out",
        }}
      >
        <div className="px-4 space-y-3">
          {chat?.messages.map((msg) => {
            if (msg.type === "campaign_card") {
              const isCurrentUserSender = isInfluencerMode
                ? msg.senderType === "influencer"
                : msg.senderType === "advertiser"

              return (
                <div key={msg.id} className={`flex ${isCurrentUserSender ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%]">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                      <div className="p-4 space-y-2">
                        <div className="text-left space-y-1">
                          <p className="text-xs text-gray-700 leading-relaxed">
                            <span className="font-semibold text-gray-900">
                              {isInfluencerMode ? chat?.influencerName : chat?.advertiserName || "사용자"}
                            </span>
                            님이 캠페인을 제안했어요.
                          </p>
                          <p className="text-[11px] text-gray-500 leading-relaxed">
                            캠페인에 대해 더 알아보려면 캠페인 카드를 클릭하세요.
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 mt-1 block px-1">{msg.timestamp}</span>
                  </div>
                </div>
              )
            }

            if (msg.type === "collaboration_request") {
              const isCurrentUserSender = isInfluencerMode
                ? msg.senderType === "influencer"
                : msg.senderType === "advertiser"

              return (
                <div key={msg.id} className={`flex ${isCurrentUserSender ? "justify-end" : "justify-start"} my-4`}>
                  <div className="max-w-sm w-full">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                      <div className="p-4 space-y-2">
                        <div className="text-left space-y-1">
                          <p className="text-xs text-gray-700 leading-relaxed">
                            <span className="font-semibold text-gray-900">
                              {isInfluencerMode ? chat?.influencerName : chat?.advertiserName || "사용자"}
                            </span>
                            님이 협업 확정을 요청했어요.
                          </p>
                          <p className="text-[11px] text-gray-500 leading-relaxed">
                            하단 협업 확정 버튼을 눌러 협업을 확정하세요. 캠페인이 자동으로 마감돼요.
                          </p>
                        </div>

                        <button
                          onClick={handleFinalConfirmation}
                          disabled={isCollaborationConfirmed}
                          className={`w-full font-semibold rounded-xl h-10 text-sm ${isCollaborationConfirmed ? "bg-white border border-[#7b68ee] text-[#7b68ee] cursor-not-allowed" : "bg-[#7b68ee] hover:bg-[#7b68ee]/90 text-white"}`}
                        >
                          {isCollaborationConfirmed ? "협업 완료" : "협업 확정"}
                        </button>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 mt-1 block text-left">{msg.timestamp}</span>
                  </div>
                </div>
              )
            }

            const isCurrentUserSender = isInfluencerMode
              ? msg.senderType === "influencer"
              : msg.senderType === "advertiser"

            return (
              <div key={msg.id} className={`flex ${isCurrentUserSender ? "justify-end" : "justify-start"}`}>
                <div className="relative max-w-[75%]">
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      isCurrentUserSender ? "bg-[#7b68ee] text-white" : "bg-white text-gray-900 shadow-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 block px-1">{msg.timestamp}</span>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {showApprovalCard && (
        <div
          ref={approvalCardRef}
          className="fixed bottom-0 left-0 right-0 z-[1000] bg-[#F2F3F5] shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
          style={{
            paddingBottom: "env(safe-area-inset-bottom)",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px",
            overflow: "hidden",
            borderRadius: "16px 16px 0 0 !important",
          }}
        >
          <div className="px-4 py-6" style={{ paddingTop: "28px", paddingBottom: "24px" }}>
            <div style={{ marginBottom: "16px" }}>
              <h3 className="text-base font-bold text-gray-900 leading-tight" style={{ marginBottom: "8px" }}>
                {chat?.influencerName} 님이 협업을 제안했어요. 수락하시겠습니까?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                수락을 선택하지 않는 이상 상대방은 요청을 확인했다는 사실을 알 수 없습니다. 거절 시, 채팅방에서
                나가져요.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRejectCollaboration}
                className="flex-1 px-4 bg-white border rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-98 transition-all duration-150"
                style={{
                  height: "48px",
                  color: "#888888",
                  borderColor: "rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  outline: "none",
                  boxShadow: "none",
                }}
                onFocus={(e) => {
                  e.target.style.outline = "none"
                  e.target.style.boxShadow = "none"
                }}
                onBlur={(e) => {
                  e.target.style.outline = "none"
                  e.target.style.boxShadow = "none"
                }}
                aria-label="협업 제안 거절"
              >
                <X className="w-5 h-5" style={{ width: "18px", height: "18px", color: "#888888" }} />
                <span>거절</span>
              </button>
              <button
                onClick={handleAcceptCollaboration}
                className="flex-1 px-4 bg-white border rounded-xl text-[#7b68ee] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-98 transition-all duration-150"
                style={{
                  height: "48px",
                  borderColor: "rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  outline: "none",
                  boxShadow: "none",
                }}
                onFocus={(e) => {
                  e.target.style.outline = "none"
                  e.target.style.boxShadow = "none"
                }}
                onBlur={(e) => {
                  e.target.style.outline = "none"
                  e.target.style.boxShadow = "none"
                }}
                aria-label="협업 제안 수락"
              >
                <Check className="w-5 h-5" style={{ width: "18px", height: "18px" }} />
                <span>수락</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {imagePreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-4 space-y-4">
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              {imagePreview.type.startsWith("image/") ? (
                <Image
                  src={imagePreview.url || "/placeholder.svg"}
                  alt="Preview"
                  fill
                  className="object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <video src={imagePreview.url} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  setImagePreview(null)
                  setShowAttachmentMenu(false)
                }}
              >
                취소
              </Button>
              <Button className="flex-1" onClick={handleImageSend}>
                전송
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Picker Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-[280px] top-[60%] z-[200]">
          <DialogHeader>
            <DialogTitle className="text-sm">일정 선택</DialogTitle>
          </DialogHeader>
          <div className="space-y-2.5 py-2">
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <label htmlFor="month" className="text-xs font-medium text-gray-600">
                  월
                </label>
                <input
                  id="month"
                  type="number"
                  min="1"
                  max="12"
                  placeholder="1-12"
                  value={scheduleMonth}
                  onChange={(e) => setScheduleMonth(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label htmlFor="day" className="text-xs font-medium text-gray-600">
                  일
                </label>
                <input
                  id="day"
                  type="number"
                  min="1"
                  max="31"
                  placeholder="1-31"
                  value={scheduleDay}
                  onChange={(e) => setScheduleDay(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="schedule-time" className="text-xs font-medium text-gray-600">
                시간
              </label>
              <input
                id="schedule-time"
                type="text"
                placeholder="예: 오후 3시, 14:00"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowScheduleDialog(false)}>
              취소
            </Button>
            <Button size="sm" onClick={handleScheduleSelect}>
              일정 보내기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div
        className={`fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-100 transition-all duration-300 ${showApprovalCard ? "opacity-50 pointer-events-none" : ""}`}
        style={{
          height: "var(--inputbar-h)",
          paddingBottom: "env(safe-area-inset-bottom)",
          borderTopColor: "rgba(0,0,0,0.08)",
          overflow: "visible",
        }}
      >
        {showAttachmentMenu && (
          <div className="absolute bottom-full left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  fileInputRef.current?.click()
                  setShowAttachmentMenu(false)
                }}
                className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs text-gray-700">사진</span>
              </button>

              <button
                onClick={() => {
                  // TODO: Implement schedule feature
                  console.log("[v0] Schedule clicked")
                  setShowScheduleDialog(true)
                  setShowAttachmentMenu(false)
                }}
                className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs text-gray-700">일정</span>
              </button>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="border-t bg-white p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
              disabled={showApprovalCard}
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            >
              <Paperclip className="w-5 h-5 text-gray-600" />
            </Button>

            <div className="flex-1">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="w-full h-10 px-4 bg-gray-100 rounded-xl border-0 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7b68ee] focus:bg-white"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={showApprovalCard}
                aria-disabled={showApprovalCard}
              />
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || showApprovalCard}
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
            >
              <Send className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
    </div>
  )
}
