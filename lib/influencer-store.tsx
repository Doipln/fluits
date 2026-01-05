"use client"

import { createContext, useContext, type ReactNode } from "react"

export interface Influencer {
  id: number
  name: string
  followers: string
  followersDisplay: string
  engagement: string
  category: string
  region: string
  avatar: string
  verified: boolean
  hashtags: string[]
  averageLikes?: string
}

// All influencers data from the partner page
export const allInfluencers: Influencer[] = [
  {
    id: 1,
    name: "김소영",
    followers: "33000",
    followersDisplay: "3.3만",
    engagement: "3.3%",
    averageLikes: "1.1천",
    category: "패션·잡화",
    region: "서울시 성동구",
    avatar: "/korean-fashion-influencer-woman-stylish-outfit.jpg",
    verified: true,
    hashtags: ["#스타일링", "#패션", "#패션디자인"],
  },
  {
    id: 2,
    name: "박지민",
    followers: "52000",
    followersDisplay: "5.2만",
    engagement: "4.1%",
    averageLikes: "2.1천",
    category: "뷰티·화장품",
    region: "서울시 강남구",
    avatar: "/korean-beauty-influencer-woman-makeup-skincare.jpg",
    verified: true,
    hashtags: ["#뷰티", "#메이크업", "#스킨케어"],
  },
  {
    id: 3,
    name: "이준호",
    followers: "28000",
    followersDisplay: "2.8만",
    engagement: "5.2%",
    averageLikes: "1.5천",
    category: "리빙·인테리어",
    region: "서울시 마포구",
    avatar: "/korean-lifestyle-influencer-man-home-interior-desi.jpg",
    verified: true,
    hashtags: ["#홈카페", "#인테리어", "#플랜테리어"],
  },
  {
    id: 4,
    name: "최유진",
    followers: "81000",
    followersDisplay: "8.1만",
    engagement: "3.8%",
    averageLikes: "3.1천",
    category: "테크·가전",
    region: "서울시 서초구",
    avatar: "/korean-tech-influencer-woman-gadgets-technology.jpg",
    verified: true,
    hashtags: ["#테크", "#리뷰", "#가젯"],
  },
  {
    id: 5,
    name: "한서연",
    followers: "45000",
    followersDisplay: "4.5만",
    engagement: "3.9%",
    averageLikes: "1.8천",
    category: "패션·잡화",
    region: "서울시 홍대",
    avatar: "/korean-street-fashion-influencer-woman-vintage-sty.jpg",
    verified: true,
    hashtags: ["#스트릿패션", "#빈티지", "#코디"],
  },
  {
    id: 6,
    name: "정민아",
    followers: "63000",
    followersDisplay: "6.3만",
    engagement: "4.7%",
    averageLikes: "3.0천",
    category: "뷰티·화장품",
    region: "서울시 압구정",
    avatar: "/korean-beauty-guru-woman-cosmetics-review.jpg",
    verified: true,
    hashtags: ["#화장품", "#리뷰", "#뷰티팁"],
  },
  {
    id: 7,
    name: "김태현",
    followers: "31000",
    followersDisplay: "3.1만",
    engagement: "5.8%",
    averageLikes: "1.8천",
    category: "리빙·인테리어",
    region: "서울시 용산구",
    avatar: "/korean-home-lifestyle-influencer-man-minimalist-in.jpg",
    verified: false,
    hashtags: ["#미니멀", "#인테리어", "#홈데코"],
  },
  {
    id: 8,
    name: "송하늘",
    followers: "72000",
    followersDisplay: "7.2만",
    engagement: "4.3%",
    averageLikes: "3.1천",
    category: "푸드·외식",
    region: "서울시 종로구",
    avatar: "/korean-food-influencer-woman-cooking-restaurant-re.jpg",
    verified: true,
    hashtags: ["#맛집", "#요리", "#레시피"],
  },
  {
    id: 9,
    name: "윤도현",
    followers: "39000",
    followersDisplay: "3.9만",
    engagement: "6.1%",
    averageLikes: "2.4천",
    category: "헬스·피트니스",
    region: "서울시 강남구",
    avatar: "/korean-fitness-influencer-man-workout-gym-training.jpg",
    verified: true,
    hashtags: ["#헬스", "#운동", "#다이어트"],
  },
  {
    id: 10,
    name: "임수빈",
    followers: "24000",
    followersDisplay: "2.4만",
    engagement: "7.2%",
    averageLikes: "1.7천",
    category: "반려동물",
    region: "서울시 성북구",
    avatar: "/korean-pet-influencer-woman-cute-dog-cat.jpg",
    verified: false,
    hashtags: ["#반려견", "#펫스타그램", "#강아지"],
  },
  {
    id: 11,
    name: "조민석",
    followers: "58000",
    followersDisplay: "5.8만",
    engagement: "4.5%",
    averageLikes: "2.6천",
    category: "숙박·여행",
    region: "부산시 해운대구",
    avatar: "/korean-travel-influencer-man-backpack-adventure.jpg",
    verified: true,
    hashtags: ["#여행", "#부산", "#맛집투어"],
  },
  {
    id: 12,
    name: "강예린",
    followers: "41000",
    followersDisplay: "4.1만",
    engagement: "5.3%",
    averageLikes: "2.2천",
    category: "베이비·키즈",
    region: "서울시 송파구",
    avatar: "/korean-mom-influencer-woman-baby-kids-parenting.jpg",
    verified: true,
    hashtags: ["#육아", "#베이비", "#맘스타그램"],
  },
]

interface InfluencerContextType {
  influencers: Influencer[]
  getInfluencerById: (id: number) => Influencer | undefined
}

const InfluencerContext = createContext<InfluencerContextType | undefined>(undefined)

export function InfluencerProvider({ children }: { children: ReactNode }) {
  const getInfluencerById = (id: number) => {
    return allInfluencers.find((influencer) => influencer.id === id)
  }

  return (
    <InfluencerContext.Provider
      value={{
        influencers: allInfluencers,
        getInfluencerById,
      }}
    >
      {children}
    </InfluencerContext.Provider>
  )
}

export function useInfluencers() {
  const context = useContext(InfluencerContext)
  if (context === undefined) {
    throw new Error("useInfluencers must be used within an InfluencerProvider")
  }
  return context
}
