"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Chat {
  id: number
  campaignId?: number
  campaignTitle?: string
  campaignCategory?: string
  campaignStatus?: string
  campaignReward?: string
  campaignThumbnail?: string
  influencerId?: number
  influencerName: string
  influencerAvatar: string
  advertiserId?: number
  advertiserName?: string
  advertiserAvatar?: string
  lastMessage: string
  time: string
  unreadCount: number
  isUnread: boolean
  isActiveCollaboration: boolean
  initiatedBy: "influencer" | "advertiser"
  status: "pending" | "accepted" | "rejected" | "active"
  isCollaborationConfirmed?: boolean
  messages: Array<{
    id: number
    senderId: number
    senderType: "influencer" | "advertiser"
    content: string
    timestamp: string
    type: "text" | "proposal" | "campaign_card" | "profile_card" | "collaboration_request"
  }>
  isRead: boolean // 광고주가 채팅을 읽었는지 여부
}

interface ChatStore {
  chats: Chat[]
  addChat: (chat: Omit<Chat, "id">) => number
  updateChatStatus: (chatId: number, status: Chat["status"]) => void
  addMessage: (chatId: number, message: Omit<Chat["messages"][0], "id">) => void
  getChatById: (chatId: number) => Chat | undefined
  getChatsForInfluencer: (influencerId: number) => Chat[]
  getChatsForAdvertiser: (advertiserId: number) => Chat[]
  updateChatCampaignStatus: (chatId: number, campaignStatus: string) => void
  updateCollaborationStatus: (chatId: number, isConfirmed: boolean) => void
  clearAllChats: () => void
  deleteChat: (chatId: number) => void
  markChatAsRead: (chatId: number) => void // 채팅 읽음 상태 업데이트 함수 추가
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [
        {
          id: 1,
          campaignId: 101,
          campaignTitle: "여름 신상품 프로모션",
          campaignCategory: "뷰티",
          campaignStatus: "진행중",
          campaignReward: "500,000원",
          campaignThumbnail: "/public/skincare-products-display.png",
          influencerId: 2,
          influencerName: "김뷰티",
          influencerAvatar: "/public/korean-beauty-influencer.jpg",
          advertiserId: 1,
          advertiserName: "ABC 뷰티",
          advertiserAvatar: "/public/advertiser.jpg",
          lastMessage: "네, 좋은 조건이네요. 협업 진행해요!",
          time: "방금",
          unreadCount: 0,
          isUnread: false,
          isActiveCollaboration: true,
          initiatedBy: "advertiser",
          status: "active",
          isCollaborationConfirmed: true,
          messages: [
            {
              id: 1,
              senderId: 1,
              senderType: "advertiser",
              content: "안녕하세요! 저희 신상품 홍보에 관심있으실까요?",
              timestamp: "2024-01-15 10:30",
              type: "campaign_card",
            },
            {
              id: 2,
              senderId: 2,
              senderType: "influencer",
              content: "네, 좋은 조건이네요. 협업 진행해요!",
              timestamp: "2024-01-15 10:45",
              type: "text",
            },
          ],
          isRead: true,
        },
        {
          id: 2,
          campaignId: 102,
          campaignTitle: "패션 브랜드 협업",
          campaignCategory: "패션",
          campaignStatus: "진행중",
          campaignReward: "800,000원",
          campaignThumbnail: "/public/korean-fashion-influencer.jpg",
          influencerId: 3,
          influencerName: "이패션",
          influencerAvatar: "/public/korean-fashion-influencer.jpg",
          advertiserId: 1,
          advertiserName: "ABC 뷰티",
          advertiserAvatar: "/public/advertiser.jpg",
          lastMessage: "네, 스케줄 확인해보겠습니다.",
          time: "2시간 전",
          unreadCount: 1,
          isUnread: true,
          isActiveCollaboration: true,
          initiatedBy: "advertiser",
          status: "active",
          isCollaborationConfirmed: false,
          messages: [
            {
              id: 3,
              senderId: 1,
              senderType: "advertiser",
              content: "새로운 패션 컬렉션 홍보 협업을 제안드립니다.",
              timestamp: "2024-01-15 13:00",
              type: "campaign_card",
            },
            {
              id: 4,
              senderId: 3,
              senderType: "influencer",
              content: "네, 스케줄 확인해보겠습니다.",
              timestamp: "2024-01-15 13:30",
              type: "text",
            },
          ],
          isRead: false,
        },
        {
          id: 3,
          campaignId: 103,
          campaignTitle: "라이프스타일 콘텐츠",
          campaignCategory: "라이프스타일",
          campaignStatus: "진행중",
          campaignReward: "600,000원",
          campaignThumbnail: "/public/korean-lifestyle-influencer.jpg",
          influencerId: 4,
          influencerName: "박라이프",
          influencerAvatar: "/public/korean-lifestyle-influencer.jpg",
          advertiserId: 1,
          advertiserName: "ABC 뷰티",
          advertiserAvatar: "/public/advertiser.jpg",
          lastMessage: "감사합니다! 협업 기다리겠습니다.",
          time: "어제",
          unreadCount: 0,
          isUnread: false,
          isActiveCollaboration: true,
          initiatedBy: "advertiser",
          status: "accepted",
          isCollaborationConfirmed: false,
          messages: [
            {
              id: 5,
              senderId: 1,
              senderType: "advertiser",
              content: "라이프스타일 콘텐츠 협업 제안입니다.",
              timestamp: "2024-01-14 15:00",
              type: "text",
            },
            {
              id: 6,
              senderId: 4,
              senderType: "influencer",
              content: "감사합니다! 협업 기다리겠습니다.",
              timestamp: "2024-01-14 15:30",
              type: "text",
            },
          ],
          isRead: true,
        },
      ],

      addChat: (chat) => {
        const newId = Math.max(0, ...get().chats.map((c) => c.id)) + 1
        const newChat = { ...chat, id: newId, isRead: false }
        set((state) => ({
          chats: [...state.chats, newChat],
        }))
        console.log("[v0] Created new chat:", newId, "initiated by:", chat.initiatedBy)
        return newId
      },

      updateChatStatus: (chatId, status) => {
        set((state) => ({
          chats: state.chats.map((chat) => (chat.id === chatId ? { ...chat, status } : chat)),
        }))
        console.log("[v0] Updated chat", chatId, "status to:", status)
      },

      updateChatCampaignStatus: (chatId, campaignStatus) => {
        set((state) => ({
          chats: state.chats.map((chat) => (chat.id === chatId ? { ...chat, campaignStatus } : chat)),
        }))
        console.log("[v0] Updated chat", chatId, "campaign status to:", campaignStatus)
      },

      updateCollaborationStatus: (chatId, isConfirmed) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, isCollaborationConfirmed: isConfirmed } : chat,
          ),
        }))
        console.log("[v0] Updated chat", chatId, "collaboration confirmed:", isConfirmed)
      },

      addMessage: (chatId, message) => {
        const newMessageId = Date.now()
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, { ...message, id: newMessageId }],
                  lastMessage: message.content,
                  time: message.timestamp,
                  unreadCount: chat.unreadCount + 1,
                  isUnread: true,
                }
              : chat,
          ),
        }))
        console.log("[v0] Added message to chat:", chatId)
      },

      getChatById: (chatId) => {
        return get().chats.find((chat) => chat.id === chatId)
      },

      getChatsForInfluencer: (influencerId) => {
        const chats = get().chats.filter((chat) => chat.influencerId === influencerId)
        return chats.filter((chat) => {
          if (chat.initiatedBy === "influencer") {
            return chat.status === "accepted" || chat.status === "active"
          }
          return true
        })
      },

      getChatsForAdvertiser: (advertiserId) => {
        return get().chats.filter((chat) => chat.advertiserId === advertiserId)
      },

      clearAllChats: () => {
        set({ chats: [] })
        console.log("[v0] Cleared all chats from storage")
      },

      deleteChat: (chatId) => {
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== chatId),
        }))
        console.log("[v0] Deleted chat:", chatId)
      },

      markChatAsRead: (chatId) => {
        set((state) => ({
          chats: state.chats.map((chat) => (chat.id === chatId ? { ...chat, isRead: true } : chat)),
        }))
        console.log("[v0] Marked chat", chatId, "as read")
      },
    }),
    {
      name: "chat-storage",
    },
  ),
)
