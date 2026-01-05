"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Home, Search, Briefcase, User, MessageCircle } from "lucide-react"
import { useChatStore } from "@/lib/chat-store"
import { useEffect, useState } from "react"

const navItems = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/influencers", icon: Search, label: "파트너" },
  { href: "/campaigns", icon: Briefcase, label: "캠페인" },
  { href: "/chat", icon: MessageCircle, label: "채팅" },
  { href: "/profile", icon: User, label: "프로필" },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)
  const { getChatsForAdvertiser, getChatsForInfluencer } = useChatStore()

  useEffect(() => {
    const influencerMode = localStorage.getItem("influencer_mode") === "true"
    const userId = 1
    const chats = influencerMode ? getChatsForInfluencer(userId) : getChatsForAdvertiser(userId)
    const count = chats.filter((chat) => chat.isUnread).length
    setUnreadCount(count)
  }, [pathname, getChatsForAdvertiser, getChatsForInfluencer])

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 rounded-t-2xl">
      <div className="flex items-center justify-around py-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          const showBadge = href === "/chat" && unreadCount > 0
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-h-[44px] justify-center",
                isActive ? "text-[#7b68ee]" : "text-[#999] hover:text-foreground",
              )}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 bg-[#7b68ee] text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
