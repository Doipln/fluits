"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Check,
  ArrowLeft,
  MoreVertical,
  MapPin,
  Heart,
  Instagram,
  Lock,
  BookOpen,
  Youtube,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useViewHistory } from "@/lib/view-history-store"
import { useCampaigns } from "@/lib/campaign-store"
import { useChatStore } from "@/lib/chat-store"
import { checkAdvertiserProfileComplete } from "@/lib/profile-utils"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

const allInfluencers = [
  {
    id: 1,
    name: "김소영",
    followers: "33000",
    followersDisplay: "3.3만",
    engagement: "3.3%",
    category: "패션·잡화",
    region: "서울시 성동구",
    avatar: "/korean-fashion-influencer-woman-stylish-outfit.jpg",
    verified: true,
    hashtags: ["#스타일링", "#패션", "#패션디자인"],
    gender: "여성",
    age: "28세",
    posts: "1,247개",
    averageLikes: "2.1천",
    introduction:
      "안녕하세요! 패션과 스타일링을 사랑하는 인플루언서 김소영입니다. 다양한 브랜드와의 협업을 통해 여러분께 도움이 되는 스타일링 팁을 공유하고 있어요. 진정성 있는 패션 콘텐츠로 함께 성장하는 커뮤니티를 만들어가고 있습니다.",
    activityPrice: "포스팅 1회당 25-60만원\n스토리 1회당 10-20만원\n라이브 1회당 80-120만원",
    activityRegion: ["서울시", "경기도", "온라인"],
    stats: { averagePrice: "40만원", collaborations: "67건", reviews: 4.7 },
    instagram: {
      followers: "33000",
      followersDisplay: "3.3만",
      posts: "1,247개",
      averageLikes: "2.1천",
      engagement: "3.3%",
    },
    blog: {
      followers: "18500",
      followersDisplay: "1.85만",
      posts: "892개",
      averageLikes: "1.2천",
      engagement: "2.8%",
    },
    additionalPhotos: [
      "/korean-fashion-influencer-woman-stylish-outfit.jpg",
      "/korean-beauty-influencer-woman-makeup-skincare.jpg",
    ],
  },
  {
    id: 2,
    name: "박지민",
    followers: "52000",
    followersDisplay: "5.2만",
    engagement: "4.1%",
    category: "뷰티·화장품",
    region: "서울시 강남구",
    avatar: "/korean-beauty-influencer-woman-makeup-skincare.jpg",
    verified: true,
    hashtags: ["#뷰티", "#메이크업", "#스킨케어"],
    gender: "여성",
    age: "26세",
    posts: "1,892개",
    averageLikes: "3.2천",
    introduction:
      "뷰티와 스킨케어 전문 인플루언서 박지민입니다. 다양한 화장품 리뷰와 메이크업 튜토리얼을 통해 여러분의 아름다움을 더욱 빛나게 도와드리고 있어요. 정직한 리뷰와 실용적인 뷰티 팁을 공유합니다.",
    activityPrice: "포스팅 1회당 35-75만원\n스토리 1회당 15-30만원\n라이브 1회당 100-150만원",
    activityRegion: ["서울시", "인천시", "경기도", "온라인"],
    stats: { averagePrice: "55만원", collaborations: "89건", reviews: 4.8 },
    instagram: {
      followers: "52000",
      followersDisplay: "5.2만",
      posts: "1,892개",
      averageLikes: "3.2천",
      engagement: "4.1%",
    },
    blog: {
      followers: "25000",
      followersDisplay: "2.5만",
      posts: "1105개",
      averageLikes: "1.8천",
      engagement: "3.5%",
    },
    additionalPhotos: ["/korean-beauty-influencer-woman-makeup-skincare.jpg", "/makeup-tutorial.png"],
  },
  {
    id: 3,
    name: "이준호",
    followers: "28000",
    followersDisplay: "2.8만",
    engagement: "5.2%",
    category: "리빙·인테리어",
    region: "서울시 마포구",
    avatar: "/korean-lifestyle-influencer-man-home-interior-desi.jpg",
    verified: true,
    hashtags: ["#홈카페", "#인테리어", "#플랜테리어"],
    gender: "남성",
    age: "31세",
    posts: "956개",
    averageLikes: "1.8천",
    introduction:
      "홈 인테리어와 라이프스타일 콘텐츠를 만드는 이준호입니다. 작은 공간도 아름답게 꾸밀 수 있는 인테리어 팁과 홈카페 레시피를 공유하며, 일상을 더욱 특별하게 만드는 방법을 알려드려요.",
    activityPrice: "포스팅 1회당 20-50만원\n스토리 1회당 8-18만원\n라이브 1회당 60-100만원",
    activityRegion: ["서울시", "경기도", "온라인"],
    stats: { averagePrice: "35만원", collaborations: "45건", reviews: 4.6 },
    instagram: {
      followers: "28000",
      followersDisplay: "2.8만",
      posts: "956개",
      averageLikes: "1.8천",
      engagement: "5.2%",
    },
    blog: {
      followers: "15000",
      followersDisplay: "1.5만",
      posts: "678개",
      averageLikes: "0.9천",
      engagement: "4.1%",
    },
    additionalPhotos: [
      "/korean-lifestyle-influencer-man-home-interior-desi.jpg",
      "/korean-home-lifestyle-influencer-man-minimalist-in.jpg",
    ],
  },
  {
    id: 4,
    name: "최유진",
    followers: "81000",
    followersDisplay: "8.1만",
    engagement: "3.8%",
    category: "테크·가전",
    region: "서울시 서초구",
    avatar: "/korean-tech-influencer-woman-gadgets-technology.jpg",
    verified: true,
    hashtags: ["#테크", "#리뷰", "#가젯"],
    gender: "여성",
    age: "29세",
    posts: "2,134개",
    averageLikes: "4.5천",
    introduction:
      "테크 리뷰어 최유진입니다. 최신 가전제품과 IT 기기들을 직접 사용해보고 솔직한 리뷰를 전달해드려요. 복잡한 기술을 쉽게 설명하여 여러분의 현명한 구매 결정을 도와드립니다.",
    activityPrice: "포스팅 1회당 50-100만원\n스토리 1회당 20-35만원\n라이브 1회당 120-200만원",
    activityRegion: ["서울시", "인천시", "경기도", "온라인"],
    stats: { averagePrice: "75만원", collaborations: "112건", reviews: 4.9 },
    instagram: {
      followers: "81000",
      followersDisplay: "8.1만",
      posts: "2,134개",
      averageLikes: "4.5천",
      engagement: "3.8%",
    },
    blog: {
      followers: "35000",
      followersDisplay: "3.5만",
      posts: "1567개",
      averageLikes: "2.5천",
      engagement: "3.1%",
    },
    additionalPhotos: [
      "/korean-tech-influencer-woman-gadgets-technology.jpg",
      "/korean-beauty-influencer-woman-makeup-skincare.jpg",
    ],
  },
  {
    id: 5,
    name: "한서연",
    followers: "45000",
    followersDisplay: "4.5만",
    engagement: "3.9%",
    category: "패션·잡화",
    region: "서울시 홍대",
    avatar: "/korean-street-fashion-influencer-woman-vintage-sty.jpg",
    verified: true,
    hashtags: ["#스트릿패션", "#빈티지", "#코디"],
    gender: "여성",
    age: "24세",
    posts: "1,456개",
    averageLikes: "2.8천",
    introduction:
      "스트릿 패션과 빈티지 스타일을 좋아하는 한서연입니다. 개성 있는 패션 스타일링과 빈티지 아이템 활용법을 공유하며, 나만의 스타일을 찾아가는 여정을 함께하고 있어요.",
    activityPrice: "포스팅 1회당 30-65만원\n스토리 1회당 12-25만원\n라이브 1회당 85-130만원",
    activityRegion: ["서울시", "경기도", "온라인"],
    stats: { averagePrice: "47만원", collaborations: "73건", reviews: 4.5 },
    instagram: {
      followers: "45000",
      followersDisplay: "4.5만",
      posts: "1,456개",
      averageLikes: "2.8천",
      engagement: "3.9%",
    },
    blog: {
      followers: "22000",
      followersDisplay: "2.2만",
      posts: "987개",
      averageLikes: "1.5천",
      engagement: "3.2%",
    },
    additionalPhotos: [
      "/korean-street-fashion-influencer-woman-vintage-sty.jpg",
      "/korean-fashion-influencer-woman-stylish-outfit.jpg",
    ],
  },
  {
    id: 6,
    name: "정민아",
    followers: "63000",
    followersDisplay: "6.3만",
    engagement: "4.7%",
    category: "뷰티·화장품",
    region: "서울시 압구정",
    avatar: "/korean-beauty-guru-woman-cosmetics-review.jpg",
    verified: true,
    hashtags: ["#화장품", "#리뷰", "#뷰티팁"],
    gender: "여성",
    age: "27세",
    posts: "1,789개",
    averageLikes: "3.8천",
    introduction:
      "화장품 리뷰 전문가 정민아입니다. 다양한 브랜드의 화장품을 직접 사용해보고 정직한 후기를 전달해드려요. 피부 타입별 맞춤 화장품 추천과 뷰티 꿀팁을 공유합니다.",
    activityPrice: "포스팅 1회당 40-80만원\n스토리 1회당 18-32만원\n라이브 1회당 110-160만원",
    activityRegion: ["서울시", "경기도", "온라인"],
    stats: { averagePrice: "60만원", collaborations: "95건", reviews: 4.8 },
    instagram: {
      followers: "63000",
      followersDisplay: "6.3만",
      posts: "1,789개",
      averageLikes: "3.8천",
      engagement: "4.7%",
    },
    blog: {
      followers: "30000",
      followersDisplay: "3만",
      posts: "1345개",
      averageLikes: "2.1천",
      engagement: "3.9%",
    },
    additionalPhotos: ["/korean-beauty-guru-woman-cosmetics-review.jpg", "/skincare-products-display.png"],
  },
  {
    id: 7,
    name: "김태현",
    followers: "31000",
    followersDisplay: "3.1만",
    engagement: "5.8%",
    category: "리빙·인테리어",
    region: "서울시 용산구",
    avatar: "/korean-home-lifestyle-influencer-man-minimalist-in.jpg",
    verified: false,
    hashtags: ["#미니멀", "#인테리어", "#홈데코"],
    gender: "남성",
    age: "33세",
    posts: "823개",
    averageLikes: "2.2천",
    introduction:
      "미니멀 라이프스타일을 추구하는 김태현입니다. 심플하고 깔끔한 인테리어와 정리 정돈 노하우를 공유하며, 더 나은 삶의 질을 위한 라이프스타일 팁을 전달해드려요.",
    activityPrice: "포스팅 1회당 18-45만원\n스토리 1회당 7-15만원\n라이브 1회당 50-90만원",
    activityRegion: ["서울시", "경기도", "온라인"],
    stats: { averagePrice: "32만원", collaborations: "38건", reviews: 4.4 },
    instagram: {
      followers: "31000",
      followersDisplay: "3.1만",
      posts: "823개",
      averageLikes: "2.2천",
      engagement: "5.8%",
    },
    blog: {
      followers: "16000",
      followersDisplay: "1.6만",
      posts: "712개",
      averageLikes: "1.1천",
      engagement: "4.5%",
    },
    additionalPhotos: [
      "/korean-home-lifestyle-influencer-man-minimalist-in.jpg",
      "/korean-lifestyle-influencer-man-home-interior-desi.jpg",
    ],
  },
  {
    id: 8,
    name: "송하늘",
    followers: "72000",
    followersDisplay: "7.2만",
    engagement: "4.3%",
    category: "푸드·외식",
    region: "서울시 종로구",
    avatar: "/korean-food-influencer-woman-cooking-restaurant-re.jpg",
    verified: true,
    hashtags: ["#맛집", "#요리", "#레시피"],
    gender: "여성",
    age: "30세",
    posts: "2,045개",
    averageLikes: "4.1천",
    introduction:
      "푸드 인플루언서 송하늘입니다. 전국 맛집 탐방과 홈쿠킹 레시피를 공유하며, 맛있는 음식과 함께하는 일상의 소중함을 전달해드려요. 요리 초보자도 쉽게 따라할 수 있는 레시피를 소개합니다.",
    activityPrice: "포스팅 1회당 45-90만원\n스토리 1회당 20-35만원\n라이브 1회당 120-180만원",
    activityRegion: ["서울시", "경기도", "인천시", "온라인"],
    stats: { averagePrice: "67만원", collaborations: "108건", reviews: 4.7 },
    instagram: {
      followers: "72000",
      followersDisplay: "7.2만",
      posts: "2,045개",
      averageLikes: "4.1천",
      engagement: "4.3%",
    },
    blog: {
      followers: "38000",
      followersDisplay: "3.8만",
      posts: "1789개",
      averageLikes: "3.1천",
      engagement: "3.7%",
    },
    additionalPhotos: [
      "/korean-food-influencer-woman-cooking-restaurant-re.jpg",
      "/korean-beauty-influencer-woman-makeup-skincare.jpg",
    ],
  },
  {
    id: 9,
    name: "윤도현",
    followers: "39000",
    followersDisplay: "3.9만",
    engagement: "6.1%",
    category: "헬스·피트니스",
    region: "서울시 강남구",
    avatar: "/korean-fitness-influencer-man-workout-gym-training.jpg",
    verified: true,
    hashtags: ["#헬스", "#운동", "#다이어트"],
    gender: "남성",
    age: "32세",
    posts: "1,234개",
    averageLikes: "2.9천",
    introduction:
      "피트니스 트레이너 윤도현입니다. 건강한 몸만들기와 올바른 운동법을 알려드리며, 다이어트와 근력 운동에 대한 전문적인 정보를 공유해요. 함께 건강한 라이프스타일을 만들어가요.",
    activityPrice: "포스팅 1회당 25-55만원\n스토리 1회당 10-22만원\n라이브 1회당 70-110만원",
    activityRegion: ["서울시", "경기도", "온라인"],
    stats: { averagePrice: "40만원", collaborations: "56건", reviews: 4.6 },
    instagram: {
      followers: "39000",
      followersDisplay: "3.9만",
      posts: "1,234개",
      averageLikes: "2.9천",
      engagement: "6.1%",
    },
    blog: {
      followers: "20000",
      followersDisplay: "2만",
      posts: "876개",
      averageLikes: "1.3천",
      engagement: "5.1%",
    },
    additionalPhotos: [
      "/korean-fitness-influencer-man-workout-gym-training.jpg",
      "/korean-lifestyle-influencer-man-home-interior-desi.jpg",
    ],
  },
  {
    id: 10,
    name: "임수빈",
    followers: "24000",
    followersDisplay: "2.4만",
    engagement: "7.2%",
    category: "반려동물",
    region: "서울시 성북구",
    avatar: "/korean-pet-influencer-woman-cute-dog-cat.jpg",
    verified: false,
    hashtags: ["#반려견", "#펫스타그램", "#강아지"],
    gender: "여성",
    age: "25세",
    posts: "1,567개",
    averageLikes: "2.1천",
    introduction:
      "반려동물과 함께하는 일상을 공유하는 임수빈입니다. 귀여운 반려견과의 소소한 일상과 펫용품 리뷰, 반려동물 케어 팁을 전달해드려요. 반려동물과 더 행복한 시간을 보내는 방법을 알려드립니다.",
    activityPrice: "포스팅 1회당 15-40만원\n스토리 1회당 6-15만원\n라이브 1회당 40-80만원",
    activityRegion: ["서울시", "경기도", "온라인"],
    stats: { averagePrice: "27만원", collaborations: "32건", reviews: 4.3 },
    instagram: {
      followers: "24000",
      followersDisplay: "2.4만",
      posts: "1,567개",
      averageLikes: "2.1천",
      engagement: "7.2%",
    },
    blog: {
      followers: "12000",
      followersDisplay: "1.2만",
      posts: "754개",
      averageLikes: "0.8천",
      engagement: "5.5%",
    },
    additionalPhotos: [
      "/korean-pet-influencer-woman-cute-dog-cat.jpg",
      "/korean-beauty-influencer-woman-makeup-skincare.jpg",
    ],
  },
  {
    id: 11,
    name: "조민석",
    followers: "58000",
    followersDisplay: "5.8만",
    engagement: "4.5%",
    category: "숙박·여행",
    region: "부산시 해운대구",
    avatar: "/korean-travel-influencer-man-backpack-adventure.jpg",
    verified: true,
    hashtags: ["#여행", "#부산", "#맛집투어"],
    gender: "남성",
    age: "28세",
    posts: "1,678개",
    averageLikes: "3.4천",
    introduction:
      "여행 인플루언서 조민석입니다. 전국 각지의 숨은 명소와 맛집을 발굴하여 소개해드려요. 특히 부산 지역 전문가로서 현지인만 아는 특별한 장소들을 공유하며, 여행의 즐거움을 전달합니다.",
    activityPrice: "포스팅 1회당 35-70만원\n스토리 1회당 15-28만원\n라이브 1회당 90-140만원",
    activityRegion: ["부산시", "경남", "전국", "온라인"],
    stats: { averagePrice: "52만원", collaborations: "78건", reviews: 4.7 },
    instagram: {
      followers: "58000",
      followersDisplay: "5.8만",
      posts: "1,678개",
      averageLikes: "3.4천",
      engagement: "4.5%",
    },
    blog: {
      followers: "28000",
      followersDisplay: "2.8만",
      posts: "1230개",
      averageLikes: "1.9천",
      engagement: "3.8%",
    },
    additionalPhotos: [
      "/korean-travel-influencer-man-backpack-adventure.jpg",
      "/korean-lifestyle-influencer-man-home-interior-desi.jpg",
    ],
  },
  {
    id: 12,
    name: "강예린",
    followers: "41000",
    followersDisplay: "4.1만",
    engagement: "5.3%",
    category: "베이비·키즈",
    region: "서울시 송파구",
    avatar: "/korean-mom-influencer-woman-baby-kids-parenting.jpg",
    verified: true,
    hashtags: ["#육아", "#베이비", "#맘스타그램"],
    gender: "여성",
    age: "34세",
    posts: "1,345개",
    averageLikes: "2.7천",
    introduction:
      "육아 인플루언서 강예린입니다. 두 아이의 엄마로서 실전 육아 경험과 베이비용품 리뷰를 공유해요. 육아맘들의 고민을 함께 나누고, 아이와 함께하는 소중한 일상을 기록하며 도움이 되는 정보를 전달합니다.",
    activityPrice: "포스팅 1회당 28-60만원\n스토리 1회당 12-25만원\n라이브 1회당 75-120만원",
    activityRegion: ["서울시", "경기도", "온라인"],
    stats: { averagePrice: "44만원", collaborations: "65건", reviews: 4.8 },
    instagram: {
      followers: "41000",
      followersDisplay: "4.1만",
      posts: "1,345개",
      averageLikes: "2.7천",
      engagement: "5.3%",
    },
    blog: {
      followers: "19000",
      followersDisplay: "1.9만",
      posts: "1020개",
      averageLikes: "1.6천",
      engagement: "4.0%",
    },
    additionalPhotos: [
      "/korean-mom-influencer-woman-baby-kids-parenting.jpg",
      "/korean-beauty-influencer-woman-makeup-skincare.jpg",
    ],
  },
]

const categories = [
  "베이비·키즈",
  "뷰티·화장품",
  "패션·잡화",
  "푸드·외식",
  "간편식·배달",
  "리빙·인테리어",
  "반려동물",
  "숙박·여행",
  "헬스·피트니스",
  "취미·여가",
  "테크·가전",
  "기타",
]

const generateCareerData = (influencer: any) => {
  const careerTemplates = {
    패션·잡화: [
      { projectName: "패션 브랜드 협업 스타일링", type: "포스팅", tags: ["패션·잡화"] },
      { projectName: "신상 의류 착용샷 촬영", type: "스토리", tags: ["패션·잡화"] },
      { projectName: "액세서리 브랜드 홍보", type: "릴스", tags: ["패션·잡화"] },
    ],
    뷰티·화장품: [
      { projectName: "뷰티 브랜드 제품 리뷰", type: "릴스", tags: ["뷰티·화장품"] },
      { projectName: "메이크업 튜토리얼 콘텐츠", type: "포스팅", tags: ["뷰티·화장품"] },
      { projectName: "화장품 브랜드 협업", type: "스토리", tags: ["뷰티·화장품"] },
    ],
    리빙·인테리어: [
      { projectName: "홈 인테리어 소품 협업", type: "스토리", tags: ["리빙·인테리어"] },
      { projectName: "가구 브랜드 홍보 콘텐츠", type: "포스팅", tags: ["리빙·인테리어"] },
      { projectName: "홈카페 용품 리뷰", type: "릴스", tags: ["리빙·인테리어"] },
    ],
    테크·가전: [
      { projectName: "최신 가전제품 리뷰", type: "포스팅", tags: ["테크·가전"] },
      { projectName: "스마트폰 언박싱 영상", type: "릴스", tags: ["테크·가전"] },
      { projectName: "IT 기기 사용법 가이드", type: "스토리", tags: ["테크·가전"] },
    ],
    푸드·외식: [
      { projectName: "레스토랑 방문 후기 콘텐츠", type: "포스팅", tags: ["푸드·외식"] },
      { projectName: "홈쿠킹 레시피 영상", type: "릴스", tags: ["푸드·외식"] },
      { projectName: "맛집 탐방 콘텐츠", type: "스토리", tags: ["푸드·외식"] },
    ],
    헬스·피트니스: [
      { projectName: "운동복 브랜드 착용샷", type: "포스팅", tags: ["헬스·피트니스"] },
      { projectName: "홈트레이닝 루틴 영상", type: "릴스", tags: ["헬스·피트니스"] },
      { projectName: "피트니스 용품 리뷰", type: "스토리", tags: ["헬스·피트니스"] },
    ],
    반려동물: [
      { projectName: "펫용품 브랜드 협업", type: "포스팅", tags: ["반려동물"] },
      { projectName: "반려견 일상 콘텐츠", type: "스토리", tags: ["반려동물"] },
      { projectName: "펫 케어 용품 리뷰", type: "릴스", tags: ["반려동물"] },
    ],
    숙박·여행: [
      { projectName: "호텔 숙박 후기 콘텐츠", type: "포스팅", tags: ["숙박·여행"] },
      { projectName: "여행지 맛집 탐방", type: "릴스", tags: ["숙박·여행"] },
      { projectName: "관광지 홍보 콘텐츠", type: "스토리", tags: ["숙박·여행"] },
    ],
    베이비·키즈: [
      { projectName: "베이비용품 브랜드 협업", type: "포스팅", tags: ["베이비·키즈"] },
      { projectName: "육아 일상 공유 콘텐츠", type: "스토리", tags: ["베이비·키즈"] },
      { projectName: "키즈 제품 리뷰 영상", type: "릴스", tags: ["베이비·키즈"] },
    ],
  }

  const templates = careerTemplates[influencer.category as keyof typeof careerTemplates] || careerTemplates["패션·잡화"]
  const dates = [
    "25년 3월 14일",
    "25년 2월 28일",
    "25년 2월 15일",
    "25년 1월 20일",
    "25년 1월 10일",
    "24년 12월 25일",
    "24년 12월 15일",
  ]

  return templates.map((template, index) => ({
    id: index + 1,
    projectName: template.projectName,
    date: `${dates[index % dates.length]} 업로드`,
    type: template.type,
    tags: template.tags,
  }))
}

const generateRecommendationTags = (influencer: any) => {
  const baseTags = [
    { text: "시간 약속을 잘 지켜요", count: Math.floor(Math.random() * 5) + 1 },
    { text: "답장이 빨라요", count: Math.floor(Math.random() * 4) + 1 },
    { text: "친절해요", count: Math.floor(Math.random() * 3) + 1 },
    { text: "제작 능력이 뛰어나요", count: Math.floor(Math.random() * 3) + 1 },
  ]

  if (influencer.engagement && Number.parseFloat(influencer.engagement) > 5.0) {
    baseTags.push({ text: "참여도가 높아요", count: Math.floor(Math.random() * 3) + 1 })
  }

  if (influencer.verified) {
    baseTags.push({ text: "신뢰할 수 있어요", count: Math.floor(Math.random() * 4) + 1 })
  }

  return baseTags.slice(0, 4)
}

const generateReviewData = (influencer: any) => [
  {
    id: 1,
    name: "김민지",
    avatar: "/placeholder.svg",
    verified: true,
    collaborations: Math.floor(Math.random() * 5) + 1,
    date: "2주 전",
    review: `${influencer.name}님과 협업하게 되어 정말 좋았어요. 시간 약속도 잘 지켜주시고 퀄리티도 기대 이상이었습니다!`,
  },
  {
    id: 2,
    name: "박서연",
    avatar: "/placeholder.svg",
    verified: true,
    collaborations: Math.floor(Math.random() * 3) + 1,
    date: "1개월 전",
    review: "답장도 빠르고 요청사항을 잘 반영해주셔서 만족스러운 결과물을 받을 수 있었습니다. 추천해요!",
  },
]

const reviewData = [
  {
    id: 3,
    name: "이민호",
    avatar: "/placeholder.svg",
    verified: false,
    collaborations: 2,
    date: "3개월 전",
    review: "평소에 인플루언서님의 콘텐츠를 많이 보고 있어요. 좋은 활동 지역이에요!",
  },
  {
    id: 4,
    name: "김지연",
    avatar: "/placeholder.svg",
    verified: true,
    collaborations: 4,
    date: "6개월 전",
    review: "활동 단가가 합리적이에요. 꼭 제안해볼게요!",
  },
]

export default function InfluencerProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("소개")
  const [visibleCards, setVisibleCards] = useState(3)
  const [showMoreTags, setShowMoreTags] = useState(false)
  const [isInfluencerMode, setIsInfluencerMode] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [isActivityRatePrivate, setIsActivityRatePrivate] = useState(false)
  const [instagramUrl, setInstagramUrl] = useState("")
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [careerRecords, setCareerRecords] = useState<any[]>([])
  const [userReviews, setUserReviews] = useState<any[]>([])
  const [additionalPlatforms, setAdditionalPlatforms] = useState<Array<{ type: string; url: string }>>([])
  const [isPortfolioViewerOpen, setIsPortfolioViewerOpen] = useState(false)
  const [currentPortfolioIndex, setCurrentPortfolioIndex] = useState(0)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0) // Added state for photo index
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false) // Added state for platform dropdown
  const [selectedPlatform, setSelectedPlatform] = useState<"instagram" | "blog">("instagram") // Added state for selected platform

  const router = useRouter()
  const { addViewedProfile } = useViewHistory()
  const { campaigns } = useCampaigns()
  const { addChat } = useChatStore.getState()

  const influencer = allInfluencers.find((inf) => inf.id === Number.parseInt(params.id))

  useEffect(() => {
    const mode = localStorage.getItem("influencer_mode") === "true"
    setIsInfluencerMode(mode)

    if (!mode) {
      const favorites = JSON.parse(localStorage.getItem("favorited_influencers") || "[]")
      setIsFavorited(favorites.includes(Number.parseInt(params.id)))
      setIsProfileComplete(checkAdvertiserProfileComplete())
    }

    const activityRatePrivacy = localStorage.getItem("influencer_activity_rate_private")
    if (activityRatePrivacy) {
      setIsActivityRatePrivate(activityRatePrivacy === "true")
    }
    const savedInstagramUrl = localStorage.getItem("influencer_instagram_url")
    if (savedInstagramUrl) {
      setInstagramUrl(savedInstagramUrl)
    }

    const savedAdditionalPlatforms = localStorage.getItem("influencer_additional_platforms")
    if (savedAdditionalPlatforms) {
      try {
        const parsedPlatforms = JSON.parse(savedAdditionalPlatforms)
        // Filter out empty platforms and platforms without URLs
        const validPlatforms = parsedPlatforms.filter(
          (platform: { type: string; url: string }) => platform.type && platform.url && platform.type !== "",
        )
        setAdditionalPlatforms(validPlatforms)
      } catch (e) {
        console.error("Failed to parse additional platforms:", e)
      }
    }

    const allCareerRecords = JSON.parse(localStorage.getItem("influencer_career_records") || "[]")
    console.log("[v0] All career records:", allCareerRecords)
    const influencerCareerRecords = allCareerRecords.filter(
      (record: any) => record.influencerId === Number.parseInt(params.id),
    )
    console.log("[v0] Career records for influencer", params.id, ":", influencerCareerRecords)
    setCareerRecords(influencerCareerRecords)

    const allReviews = JSON.parse(localStorage.getItem("influencer_reviews") || "[]")
    console.log("[v0] All reviews:", allReviews)
    const influencerReviews = allReviews.filter((review: any) => review.influencerId === Number.parseInt(params.id))
    console.log("[v0] Reviews for influencer", params.id, ":", influencerReviews)
    setUserReviews(influencerReviews)

    const currentUserId = localStorage.getItem("current_influencer_id")
    if (currentUserId && Number.parseInt(params.id) === Number.parseInt(currentUserId)) {
      // This is the current user's profile - load their career entries
      const savedCareerEntries = localStorage.getItem(`influencer_career_entries_${currentUserId}`)
      if (savedCareerEntries) {
        try {
          const entries = JSON.parse(savedCareerEntries)
          console.log("[v0] Loaded career entries for user:", entries)
          setCareerRecords(
            entries.map((entry: any, index: number) => ({
              id: `user-${index}`,
              projectName: entry.title,
              date: entry.date,
              type: "사용자 경력",
              tags: [entry.category],
              isUserCreated: true,
            })),
          )
        } catch (e) {
          console.error("Failed to parse career entries:", e)
        }
      }
    }
  }, [params.id])

  useEffect(() => {
    if (influencer) {
      addViewedProfile({
        id: influencer.id,
        name: influencer.name,
        followers: influencer.followers,
        followersDisplay: influencer.followersDisplay,
        engagement: influencer.engagement,
        category: influencer.category,
        region: influencer.region,
        avatar: influencer.avatar,
        verified: influencer.verified,
        hashtags: influencer.hashtags,
      })
    }
  }, [influencer, addViewedProfile])

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorited_influencers") || "[]")
    const influencerId = Number.parseInt(params.id)

    if (isFavorited) {
      const updated = favorites.filter((id: number) => id !== influencerId)
      localStorage.setItem("favorited_influencers", JSON.stringify(updated))
      setIsFavorited(false)
    } else {
      favorites.push(influencerId)
      localStorage.setItem("favorited_influencers", JSON.stringify(favorites))
      setIsFavorited(true)
    }
  }

  const handlePropose = () => {
    setIsProposalModalOpen(true)
  }

  const handleCampaignSelect = (campaign: any) => {
    if (selectedCampaign?.id === campaign.id) {
      setSelectedCampaign(null)
    } else {
      setSelectedCampaign(campaign)
    }
  }

  const handleSendProposal = () => {
    if (!selectedCampaign || !influencer) return

    const newChatId = addChat({
      campaignId: selectedCampaign.id,
      campaignTitle: selectedCampaign.title,
      campaignCategory: selectedCampaign.category,
      campaignStatus: selectedCampaign.status || "구인 진행중",
      campaignReward: selectedCampaign.reward,
      campaignThumbnail: selectedCampaign.thumbnail,
      influencerId: influencer.id,
      influencerName: influencer.name,
      influencerAvatar: influencer.avatar,
      advertiserId: 1, // Current advertiser user ID
      advertiserName: "광고주", // Would come from auth
      advertiserAvatar: "/placeholder.svg",
      lastMessage: `${selectedCampaign.title} 캠페인을 제안했습니다.`,
      time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      unreadCount: 0,
      isUnread: false,
      isActiveCollaboration: true,
      initiatedBy: "advertiser",
      status: "pending",
      messages: [
        {
          id: Date.now(),
          senderId: 1, // Current advertiser user ID
          senderType: "advertiser",
          content: selectedCampaign.title,
          timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
          type: "campaign_card",
        },
      ],
    })

    console.log("[v0] Created new chat with campaign card:", newChatId)

    setIsProposalModalOpen(false)
    setSelectedCampaign(null)

    router.push(`/chat/${newChatId}`)
  }

  const myCampaigns = campaigns.filter((c) => {
    console.log("[v0] Checking campaign:", {
      id: c.id,
      title: c.title,
      isUserCreated: c.isUserCreated,
      status: c.status,
      hasStatus: !!c.status,
    })

    if (!c.isUserCreated) {
      console.log("[v0] Campaign", c.id, "filtered out: not user created")
      return false
    }

    // Include campaigns with "구인 진행중", "구인 진행 중", "비공개", "비공개 글", or no status
    const status = c.status || "구인 진행중"
    const isActive =
      status === "구인 진행중" || status === "구인 진행 중" || status === "비공개" || status === "비공개 글"

    console.log("[v0] Campaign", c.id, "status check:", {
      originalStatus: c.status,
      effectiveStatus: status,
      isActive: isActive,
    })

    return isActive
  })

  console.log("[v0] Total campaigns:", campaigns.length)
  console.log("[v0] My campaigns:", myCampaigns.length)
  console.log(
    "[v0] Campaigns data:",
    campaigns.map((c) => ({ id: c.id, title: c.title, isUserCreated: c.isUserCreated, status: c.status })),
  )

  if (!influencer) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">프로필을 찾을 수 없습니다</h2>
          <Link href="/influencers">
            <Button className="bg-[#7b68ee] hover:bg-[#7b68ee]/90">목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
  }

  const careerData = generateCareerData(influencer)
  const allCareerData = [...careerRecords, ...careerData]
  const recommendationTags = generateRecommendationTags(influencer)

  const allRecommendationTags = [...recommendationTags]
  userReviews.forEach((review) => {
    if (review.processRecommendations) {
      review.processRecommendations.forEach((rec: string) => {
        const existing = allRecommendationTags.find((tag) => tag.text === rec)
        if (existing) {
          existing.count += 1
        } else {
          allRecommendationTags.push({ text: rec, count: 1 })
        }
      })
    }
    if (review.resultRecommendations) {
      review.resultRecommendations.forEach((rec: string) => {
        const existing = allRecommendationTags.find((tag) => tag.text === rec)
        if (existing) {
          existing.count += 1
        } else {
          allRecommendationTags.push({ text: rec, count: 1 })
        }
      })
    }
  })

  const allReviewData = [...userReviews.filter((r) => r.detailedReview), ...reviewData]

  const loadMoreCards = () => {
    setVisibleCards((prev) => Math.min(prev + 3, allCareerData.length))
  }

  const getCategoryTags = (category: string) => {
    const categoryMap: { [key: string]: string[] } = {
      패션·잡화: ["패션", "스타일링", "OOTD"],
      뷰티·화장품: ["뷰티", "메이크업", "스킨케어"],
      리빙·인테리어: ["인테리어", "홈데코", "라이프스타일"],
      테크·가전: ["테크", "리뷰", "가젯"],
      푸드·외식: ["맛집", "요리", "레시피"],
      헬스·피트니스: ["헬스", "운동", "다이어트"],
      반려동물: ["반려동물", "펫스타그램", "케어"],
      숙박·여행: ["여행", "맛집", "관광"],
      베이비·키즈: ["육아", "베이비", "맘스타그램"],
    }
    return categoryMap[category] || ["라이프스타일", "일상", "콘텐츠"]
  }

  const getRankedCategories = () => {
    const savedRankedCategories = localStorage.getItem("influencer_ranked_categories")
    if (savedRankedCategories) {
      try {
        return JSON.parse(savedRankedCategories)
      } catch (e) {
        console.error("Failed to parse ranked categories:", e)
      }
    }
    return []
  }

  const rankedCategories = getRankedCategories()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.replace("/influencers")
    }
  }

  // Portfolio viewer handlers
  const openPortfolioViewer = (index: number) => {
    setCurrentPortfolioIndex(index)
    setIsPortfolioViewerOpen(true)
  }

  const closePortfolioViewer = () => {
    setIsPortfolioViewerOpen(false)
  }

  const goToPreviousPortfolio = () => {
    setCurrentPortfolioIndex((prev) => (prev > 0 ? prev - 1 : portfolioItems.length - 1))
  }

  const goToNextPortfolio = () => {
    setCurrentPortfolioIndex((prev) => (prev < portfolioItems.length - 1 ? prev + 1 : 0))
  }

  const portfolioItems = [...influencer.additionalPhotos, "video"]

  // Handler to switch between platform stats
  const handlePlatformSelect = (platform: "instagram" | "blog") => {
    setSelectedPlatform(platform)
    setIsPlatformDropdownOpen(false)
    // Potentially update currentPhotoIndex if needed, e.g., reset to 0
    // setCurrentPhotoIndex(0)
  }

  // Get platform stats based on selected platform
  const currentPlatformStats = influencer[selectedPlatform] || influencer.instagram // Default to Instagram

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="sticky top-0 z-50 bg-white" style={{ height: "var(--gnb-height)" }}>
        <div
          className="flex items-center justify-between h-full"
          style={{ paddingLeft: "var(--gnb-padding-x)", paddingRight: "var(--gnb-padding-x)" }}
        >
          <Button variant="ghost" className="flex items-center h-9 px-1" onClick={handleBack}>
            <ArrowLeft className="w-6 h-6 text-black" />
            <span className="text-base text-black">프로필 보기</span>
          </Button>

          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="w-6 h-6 text-black" />
            </Button>
          </div>
        </div>
      </div>

      <main className="px-4 py-3 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24 flex-shrink-0">
              <AvatarImage src={influencer.avatar || "/placeholder.svg"} alt={influencer.name} />
              <AvatarFallback>{influencer.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1 text-left">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-black">{influencer.name}</h2>
                {influencer.verified && (
                  <div className="w-5 h-5 bg-[#7b68ee] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{influencer.region}</span>
              </div>

              {rankedCategories.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {rankedCategories.map((cat: string, index: number) => (
                    <div key={index} className="px-2 py-0 bg-gray-100 rounded-md">
                      <span className="text-xs text-gray-600">{cat}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {getCategoryTags(influencer.category).map((tag, index) => (
                    <div key={index} className="px-2 py-0 bg-gray-100 rounded-md">
                      <span className="text-xs text-gray-600">{tag}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Removed the old platform stats section here */}

          <div className="space-y-3 mt-5">
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setSelectedPlatform("instagram")}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative ${
                  selectedPlatform === "instagram" ? "text-[#E1306C]" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Instagram className="w-4 h-4" />
                Instagram
                {selectedPlatform === "instagram" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E1306C]"></div>
                )}
              </button>
              <button
                onClick={() => setSelectedPlatform("blog")}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative ${
                  selectedPlatform === "blog" ? "text-[#03C75A]" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Blog
                {selectedPlatform === "blog" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#03C75A]"></div>
                )}
              </button>
            </div>

            {/* Platform stats */}
            <div className="grid grid-cols-2 gap-4 pt-3">
              <div className="text-left">
                <div
                  className={`text-sm font-semibold ${selectedPlatform === "instagram" ? "text-[#E1306C]" : "text-[#03C75A]"}`}
                >
                  {selectedPlatform === "instagram" ? "팔로워 수" : "팔로워 수"}
                </div>
                <div className="text-xl font-bold text-black">
                  {selectedPlatform === "instagram"
                    ? influencer.instagram.followersDisplay
                    : influencer.blog.followersDisplay}
                </div>
              </div>
              <div className="text-left">
                <div
                  className={`text-sm font-semibold ${selectedPlatform === "instagram" ? "text-[#E1306C]" : "text-[#03C75A]"}`}
                >
                  게시물 수
                </div>
                <div className="text-xl font-bold text-black">
                  {selectedPlatform === "instagram" ? influencer.instagram.posts : influencer.blog.posts}
                </div>
              </div>
              <div className="text-left">
                <div
                  className={`text-sm font-semibold ${selectedPlatform === "instagram" ? "text-[#E1306C]" : "text-[#03C75A]"}`}
                >
                  평균 참여율
                </div>
                <div className="text-xl font-bold text-black">
                  {selectedPlatform === "instagram" ? influencer.instagram.engagement : influencer.blog.engagement}
                </div>
              </div>
              <div className="text-left">
                <div
                  className={`text-sm font-semibold ${selectedPlatform === "instagram" ? "text-[#E1306C]" : "text-[#03C75A]"}`}
                >
                  평균 좋아요
                </div>
                <div className="text-xl font-bold text-black">
                  {selectedPlatform === "instagram" ? influencer.instagram.averageLikes : influencer.blog.averageLikes}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-5">
            <p className="text-sm text-gray-600">{influencer.name}님이 자주 사용하는 해시태그에요.</p>
            <div className="flex gap-2 flex-wrap">
              {influencer.hashtags.map((hashtag, index) => (
                <div key={index} className="px-3 py-1 bg-blue-50 rounded-full">
                  <span className="text-sm text-blue-500">{hashtag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative -mx-4 px-4">
          <div className="relative mb-2">
            {/* Platform selector */}
            <Button
              variant="ghost"
              onClick={() => setIsPlatformDropdownOpen(true)}
              className="w-full h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              {selectedPlatform === "instagram" && <Instagram className="w-5 h-5 text-[#E1306C]" />}
              {selectedPlatform === "blog" && <BookOpen className="w-5 h-5 text-[#03C75A]" />}
              <span className="font-semibold text-gray-700 capitalize">{selectedPlatform} 바로가기</span>
            </Button>

            {/* Dropdown menu for platform selection */}
            {isPlatformDropdownOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 z-10 shadow-lg">
                {influencer.instagram && (
                  <button
                    onClick={() => handlePlatformSelect("instagram")}
                    className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50"
                  >
                    <Instagram className="w-5 h-5 text-[#E1306C]" />
                    <span className="font-medium text-gray-700">인스타그램</span>
                  </button>
                )}
                {influencer.blog && (
                  <button
                    onClick={() => handlePlatformSelect("blog")}
                    className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50"
                  >
                    <BookOpen className="w-5 h-5 text-[#03C75A]" />
                    <span className="font-medium text-gray-700">블로그</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {additionalPlatforms.map((platform, index) => {
            if (platform.type === "유튜브" && platform.url) {
              return (
                <a
                  key={`youtube-${index}`}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-2"
                >
                  <Button
                    variant="outline"
                    className="w-full h-10 rounded-xl border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <Youtube className="w-5 h-5 text-[#FF0000]" />
                    <span className="font-medium text-gray-700">유튜브 바로가기</span>
                  </Button>
                </a>
              )
            }
            return null
          })}
        </div>

        <div className="sticky z-40 bg-white -mx-4 px-4" style={{ top: "var(--gnb-height)" }}>
          <div className="relative border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("소개")}
                className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${
                  activeTab === "소개" ? "text-black" : "text-gray-400"
                }`}
              >
                소개
              </button>
              <button
                onClick={() => setActiveTab("경력")}
                className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${
                  activeTab === "경력" ? "text-black" : "text-gray-400"
                }`}
              >
                경력
              </button>
            </div>
            {/* Sliding indicator */}
            <div
              className="absolute bottom-0 h-0.5 bg-[#7b68ee] transition-transform duration-300 ease-out"
              style={{
                width: "50%",
                transform: activeTab === "소개" ? "translateX(0)" : "translateX(100%)",
              }}
            />
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            className={`space-y-6 transition-all duration-300 ease-out ${
              activeTab === "소개"
                ? "transform translate-x-0 opacity-100"
                : "transform -translate-x-full opacity-0 absolute top-0 left-0 w-full pointer-events-none"
            }`}
          >
            <div className="space-y-2">
              <h3 className="font-semibold text-black">인플루언서 소개</h3>
              <Card className="rounded-2xl shadow-none bg-gray-50 border-0">
                <CardContent className="px-5 py-3">
                  <p className="text-sm text-gray-700 leading-relaxed">{influencer.introduction}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-black">포트폴리오</h3>
              <div className="relative">
                <div
                  className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {influencer.additionalPhotos.map((photo, index) => (
                    <Card
                      key={index}
                      onClick={() => openPortfolioViewer(index)}
                      className="rounded-2xl overflow-hidden aspect-[9/16] flex-shrink-0 w-32 shadow-none cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`추가 사진 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </Card>
                  ))}
                  <Card
                    onClick={() => openPortfolioViewer(influencer.additionalPhotos.length)}
                    className="rounded-2xl overflow-hidden aspect-[9/16] flex-shrink-0 w-32 bg-gray-100 flex items-center justify-center shadow-none cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600">영상</p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-black">활동 단가</h3>
              <Card className="rounded-2xl shadow-none bg-gray-50 border-0">
                <CardContent className="px-5 py-3">
                  {isActivityRatePrivate ? (
                    <div className="relative">
                      <div className="text-sm text-gray-700 whitespace-pre-line blur-sm select-none">
                        {influencer.activityPrice}
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Lock className="w-8 h-8 text-gray-600 mb-2" />
                        <p className="text-sm text-gray-600 text-center px-4">
                          단가를 비공개로 설정하셨어요.
                          <br />
                          인플루언서님에게 직접 문의해주세요.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-700 whitespace-pre-line">{influencer.activityPrice}</div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-black">활동 지역</h3>
              <div className="flex gap-2 flex-wrap">
                {influencer.activityRegion.map((region, index) => (
                  <div key={index} className="px-3 py-1 bg-gray-100 rounded-full">
                    <span className="text-sm text-gray-700">{region}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-out ${
              activeTab === "경력"
                ? "transform translate-x-0 opacity-100"
                : "transform translate-x-full opacity-0 absolute top-0 left-0 w-full pointer-events-none"
            }`}
          >
            {/* Career records section */}
            <div className="space-y-2">
              {allCareerData.slice(0, visibleCards).map((career) => (
                <Card key={career.id} className="rounded-2xl bg-white border border-gray-100 shadow-none">
                  <CardContent className="pl-5 pr-2 py-0.5">
                    {!career.isUserCreated && (
                      <div className="flex items-start justify-between mb-0.5">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-[#7b68ee] rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white stroke-[3]" />
                          </div>
                          <span className="text-xs font-medium text-[#7b68ee]">잇다 경력 인증</span>
                        </div>
                      </div>
                    )}

                    <h4 className="font-bold text-black text-sm mb-0 leading-tight">{career.projectName}</h4>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-0.5">
                      <span>{career.date}</span>
                      <span>•</span>
                      <span>{career.type}</span>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {career.tags
                        .filter((tag: string) => categories.includes(tag))
                        .map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="bg-[#7b68ee]/10 text-[#7b68ee] font-medium text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {visibleCards < allCareerData.length && (
              <div className="flex justify-center pt-1">
                <Button
                  variant="outline"
                  onClick={loadMoreCards}
                  className="w-full max-w-xs px-12 py-2 rounded-2xl border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent"
                >
                  더보기
                </Button>
              </div>
            )}

            <div className="space-y-4 pt-10">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-black">잇다에서 받은 추천</h3>
                <span className="font-semibold text-black">{allRecommendationTags.length}</span>
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {allRecommendationTags.slice(0, showMoreTags ? allRecommendationTags.length : 4).map((tag, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-full">
                      <span className="text-sm text-gray-700">{tag.text}</span>
                      <span className="text-sm font-medium text-[#7b68ee]">{tag.count}</span>
                    </div>
                  ))}
                </div>
                {allRecommendationTags.length > 4 && (
                  <Button
                    variant="ghost"
                    onClick={() => setShowMoreTags(!showMoreTags)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {showMoreTags ? "접기" : "더보기"}
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2 pt-8">
                <h3 className="font-semibold text-black">잇다에서 받은 후기</h3>
                <span className="font-semibold text-black">{allReviewData.length}</span>
              </div>
              <div className="space-y-2">
                {allReviewData.map((review) => (
                  <Card key={review.id} className="rounded-2xl bg-white border border-gray-100 shadow-none">
                    <CardContent className="pl-5 pr-2 py-3">
                      <div className="flex items-start mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={review.avatar || review.advertiserAvatar || "/placeholder.svg"}
                              alt={review.name || review.advertiserName}
                            />
                            <AvatarFallback>{(review.name || review.advertiserName || "U")[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-black">{review.name || review.advertiserName}</span>
                              {review.verified && (
                                <div className="w-4 h-4 bg-[#7b68ee] rounded-full flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="bg-[#7b68ee]/10 text-[#7b68ee] font-medium text-xs px-2 py-1 rounded">
                                {review.category || influencer.category}
                              </span>
                              <span className="text-sm text-gray-500">• {review.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed">{review.detailedReview || review.review}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {!isInfluencerMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-1 z-40">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-shrink-0 w-12 h-10 rounded-2xl border-gray-300 bg-transparent hover:border-[#7b68ee]"
              onClick={handleToggleFavorite}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </Button>
            <Button
              size="lg"
              className="flex-1 h-10 rounded-2xl text-sm font-semibold bg-[#7b68ee] hover:bg-[#7b68ee]/90"
              onClick={handlePropose}
            >
              제안하기
            </Button>
          </div>
        </div>
      )}

      <Drawer open={isProposalModalOpen} onOpenChange={setIsProposalModalOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-left">제안할 캠페인 선택</DrawerTitle>
            <DrawerDescription className="text-left">
              {influencer.name}님에게 제안할 캠페인을 선택해주세요
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-2 max-h-[60vh] overflow-y-auto">
            {myCampaigns.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
                <p className="text-gray-500 mb-4">작성한 캠페인이 없습니다</p>
                <Button
                  onClick={() => {
                    if (!isProfileComplete) {
                      alert("프로필을 100% 완성해야 캠페인을 작성할 수 있습니다.")
                      setIsProposalModalOpen(false)
                      return
                    }
                    setIsProposalModalOpen(false)
                    router.push("/campaigns/create")
                  }}
                  disabled={!isProfileComplete}
                  className={`${
                    isProfileComplete ? "bg-[#7b68ee] hover:bg-[#7b68ee]/90" : "bg-[#7b68ee]/30 cursor-not-allowed"
                  }`}
                >
                  캠페인 작성하기
                </Button>
              </div>
            ) : (
              <div className="space-y-0">
                {myCampaigns.map((campaign, index) => (
                  <div key={campaign.id}>
                    {index === 0 && <div className="border-b border-gray-100" />}
                    <div
                      className={`py-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                        selectedCampaign?.id === campaign.id ? "bg-green-50" : ""
                      }`}
                      onClick={() => handleCampaignSelect(campaign)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={campaign.thumbnail || "/placeholder.svg"}
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col min-w-0">
                          <h3 className="font-semibold text-sm text-black leading-tight truncate">{campaign.title}</h3>

                          <div className="space-y-0.5 mt-0.5">
                            <div className="flex items-center gap-2">
                              <p className="text-base font-bold text-black">{campaign.reward}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {campaign.recruitCount && (
                                <p className="text-sm text-gray-600">
                                  <span className="text-sm text-[#7b68ee] font-semibold">
                                    {campaign.applicants || 0}
                                  </span>
                                  <span className="text-sm">/{campaign.recruitCount}</span>{" "}
                                  <span className="text-xs text-gray-500">명 모집중</span>
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="bg-[#7b68ee]/10 text-[#7b68ee] font-medium text-xs px-2 py-1 rounded">
                                {campaign.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        {selectedCampaign?.id === campaign.id && (
                          <div className="w-6 h-6 bg-[#7b68ee] rounded-full flex items-center justify-center flex-shrink-0 self-center">
                            <Check className="w-4 h-4 text-white stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </div>
                    {index < myCampaigns.length - 1 && <div className="border-b border-gray-100" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <DrawerFooter>
            <Button
              onClick={handleSendProposal}
              disabled={!selectedCampaign}
              className="w-full h-12 rounded-full text-base font-semibold bg-[#7b68ee] hover:bg-[#7b68ee]/90"
            >
              제안 보내기
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Portfolio fullscreen viewer */}
      {isPortfolioViewerOpen && (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={closePortfolioViewer}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Navigation buttons */}
          <button
            onClick={goToPreviousPortfolio}
            className="absolute left-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={goToNextPortfolio}
            className="absolute right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Content */}
          <div
            className="w-full h-full flex items-center justify-center"
            onTouchStart={(e) => {
              const touch = e.touches[0]
              const startX = touch.clientX

              const handleTouchMove = (moveEvent: TouchEvent) => {
                const currentTouch = moveEvent.touches[0]
                const diff = currentTouch.clientX - startX

                if (Math.abs(diff) > 50) {
                  if (diff > 0) {
                    goToPreviousPortfolio()
                  } else {
                    goToNextPortfolio()
                  }
                  document.removeEventListener("touchmove", handleTouchMove)
                  document.removeEventListener("touchend", handleTouchEnd)
                }
              }

              const handleTouchEnd = () => {
                document.removeEventListener("touchmove", handleTouchMove)
                document.removeEventListener("touchend", handleTouchEnd)
              }

              document.addEventListener("touchmove", handleTouchMove)
              document.addEventListener("touchend", handleTouchEnd)
            }}
          >
            {currentPortfolioIndex < influencer.additionalPhotos.length ? (
              <img
                src={(portfolioItems[currentPortfolioIndex] as string) || "/placeholder.svg"}
                alt={`포트폴리오 ${currentPortfolioIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-white text-lg">영상 콘텐츠</p>
              </div>
            )}
          </div>

          {/* Index indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 px-4 py-2 rounded-full">
            <span className="text-white text-sm font-medium">
              {currentPortfolioIndex + 1} / {portfolioItems.length}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
