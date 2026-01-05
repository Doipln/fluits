"use client"

import type React from "react"

import { TopHeader } from "@/components/top-header"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useChatStore } from "@/lib/chat-store"
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer"
import { Flag, UserX, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

type FilterType = "all" | "unread" | "active"

export default function ChatPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [isInfluencerMode, setIsInfluencerMode] = useState(false)
  const [userId, setUserId] = useState<number>(1)
  const [showMoreModal, setShowMoreModal] = useState(false)
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
  const router = useRouter()
  const { getChatsForInfluencer, getChatsForAdvertiser, deleteChat } = useChatStore()

  useEffect(() => {
    const influencerMode = localStorage.getItem("influencer_mode") === "true"
    setIsInfluencerMode(influencerMode)
    setUserId(1)
    console.log("[v0] Chat page loaded, influencer mode:", influencerMode)
  }, [])

  const allChats = isInfluencerMode ? getChatsForInfluencer(userId) : getChatsForAdvertiser(userId)

  const filteredChats = allChats.filter((chat) => {
    switch (activeFilter) {
      case "unread":
        return chat.isUnread
      case "active":
        return chat.isActiveCollaboration
      default:
        return true
    }
  })

  const unreadCount = allChats.filter((chat) => chat.isUnread).length
  const activeCollaborationCount = allChats.filter((chat) => chat.isActiveCollaboration).length

  console.log("[v0] Displaying", filteredChats.length, "chats for", isInfluencerMode ? "influencer" : "advertiser")

  const handleMoreOptions = (chatId: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedChatId(chatId)
    setShowMoreModal(true)
  }

  const handleLeaveChat = () => {
    if (selectedChatId !== null) {
      deleteChat(selectedChatId)
      setShowMoreModal(false)
      setSelectedChatId(null)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <TopHeader title="채팅" showNotifications={true} showHeart={false} />

      <main className="pt-0">
        <div className="max-w-2xl mx-auto">
          <div className="px-4 pt-3 pb-0">
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              <Button
                variant="outline"
                onClick={() => setActiveFilter("all")}
                className={`rounded-full whitespace-nowrap h-10 px-3 flex-shrink-0 ${
                  activeFilter === "all"
                    ? "bg-[#7b68ee] text-white border-[#7b68ee] hover:bg-[#7b68ee]/90"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
                aria-pressed={activeFilter === "all"}
              >
                전체
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveFilter("unread")}
                className={`rounded-full whitespace-nowrap h-10 px-3 flex-shrink-0 ${
                  activeFilter === "unread"
                    ? "bg-[#7b68ee] text-white border-[#7b68ee] hover:bg-[#7b68ee]/90"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
                aria-pressed={activeFilter === "unread"}
              >
                안읽음
                {unreadCount > 0 && (
                  <span
                    className={`ml-1 text-xs px-1.5 py-0.5 rounded-full min-w-[16px] h-4 flex items-center justify-center ${
                      activeFilter === "unread" ? "bg-white/20 text-white" : "bg-[#7b68ee] text-white"
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveFilter("active")}
                className={`rounded-full whitespace-nowrap h-10 px-3 flex-shrink-0 ${
                  activeFilter === "active"
                    ? "bg-[#7b68ee] text-white border-[#7b68ee] hover:bg-[#7b68ee]/90"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
                aria-pressed={activeFilter === "active"}
              >
                진행중인 협업
                {activeCollaborationCount > 0 && (
                  <span
                    className={`ml-1 text-xs px-1.5 py-0.5 rounded-full min-w-[16px] h-4 flex items-center justify-center ${
                      activeFilter === "active" ? "bg-white/20 text-white" : "bg-[#7b68ee] text-white"
                    }`}
                  >
                    {activeCollaborationCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="pt-2 pb-20">
            {filteredChats.length > 0 ? (
              <div>
                {filteredChats.map((chat, index) => (
                  <div key={chat.id}>
                    {index > 0 && <div className="mx-4 my-2 border-b border-black/6"></div>}
                    <Link
                      href={`/chat/${chat.id}`}
                      className="block min-h-[44px]"
                      aria-label={`${isInfluencerMode ? chat.advertiserName : chat.influencerName}, ${chat.lastMessage}, ${chat.time}`}
                    >
                      <div className="flex items-start px-4 py-4 hover:bg-gray-50 transition-colors duration-150">
                        <div className="flex-shrink-0">
                          <img
                            src={isInfluencerMode ? chat.advertiserAvatar : chat.influencerAvatar || "/placeholder.svg"}
                            alt={`${isInfluencerMode ? chat.advertiserName : chat.influencerName} 프로필`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0 ml-3">
                          <div className="flex items-baseline gap-2 mb-1">
                            <h3
                              className={
                                `text-[15px] ${chat.isUnread ? "font-semibold text-[#111]" : "font-semibold text-[#111]"}` +
                                ` truncate`
                              }
                            >
                              {isInfluencerMode ? chat.advertiserName : chat.influencerName}
                            </h3>
                            <span className="text-xs text-[#999] flex-shrink-0">{chat.time}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p
                              className={
                                `text-sm ${chat.isUnread ? "font-medium text-[#666]" : "text-[#666]"}` +
                                ` truncate pr-2 flex-1`
                              }
                            >
                              {chat.lastMessage}
                            </p>
                            {chat.isUnread && chat.unreadCount > 0 && (
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-xs font-semibold text-[#7b68ee] min-w-[16px] text-center">
                                  {chat.unreadCount}
                                </span>
                                <div className="w-2 h-2 bg-[#7b68ee] rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-11 h-11 p-0 ml-2 flex-shrink-0 hover:bg-gray-100 rounded-full"
                          onClick={(e) => handleMoreOptions(chat.id, e)}
                          aria-label="더보기 옵션"
                        >
                          <MoreVertical className="w-5 h-5 text-[#666]" />
                        </Button>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="min-h-[calc(100vh-280px)] flex items-center justify-center text-center px-4">
                <div>
                  <h3 className="text-sm font-medium text-[#999] mb-1">
                    {activeFilter === "unread"
                      ? "안읽은 채팅이 없어요"
                      : activeFilter === "active"
                        ? "진행중인 협업 채팅이 없어요"
                        : "채팅이 없어요"}
                  </h3>
                  <p className="text-xs text-[#ccc]">
                    {activeFilter === "unread"
                      ? "모든 메시지를 확인했습니다."
                      : activeFilter === "active"
                        ? "현재 진행중인 협업이 없습니다."
                        : isInfluencerMode
                          ? "캠페인에 지원하여 광고주와 협업을 진행해요"
                          : "캠페인을 생성하여 인플루언서와 협업을 진행해요"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

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
              onClick={handleLeaveChat}
              className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 text-[#D92D20]" />
              <span className="text-base font-medium text-[#D92D20]">나가기</span>
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
