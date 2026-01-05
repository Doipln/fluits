"use client"

import { TopHeader } from "@/components/top-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerFooter } from "@/components/ui/drawer"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useCampaigns } from "@/lib/campaign-store"
import { checkAdvertiserProfileComplete } from "@/lib/profile-utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileText, Edit, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"

const statusOptions = [
  { value: "구인 진행 중", label: "진행중", color: "bg-[#7b68ee] text-white" },
  { value: "구인 마감", label: "마감", color: "bg-gray-500 text-white" },
  { value: "비공개 글", label: "비공개 글", color: "bg-gray-400 text-white" },
]

export default function MyCampaignsPage() {
  const router = useRouter()
  const { getUserCreatedCampaigns, updateCampaignStatus, deleteCampaign } = useCampaigns()
  const userCampaigns = getUserCreatedCampaigns()
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null)
  const [tempStatus, setTempStatus] = useState("")
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState<number | null>(null)
  const [isStateWarningOpen, setIsStateWarningOpen] = useState(false)

  useEffect(() => {
    console.log("[v0] MyCampaignsPage mounted")
    const influencerMode = localStorage.getItem("influencer_mode") === "true"
    if (!influencerMode) {
      setIsProfileComplete(checkAdvertiserProfileComplete())
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "구인 진행 중":
        return "bg-[#7b68ee] text-white"
      case "구인 마감":
        return "bg-gray-500 text-white"
      case "비공개 글":
        return "bg-gray-400 text-white"
      default:
        return "bg-[#7b68ee] text-white"
    }
  }

  const getStatusLabel = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status)
    return option?.label || status
  }

  function onStatusChangeClick(campaignId: number, currentStatus: string) {
    console.log("[v0] onStatusChangeClick called", campaignId, currentStatus)
    if (currentStatus === "구인 마감") return
    setSelectedCampaignId(campaignId)
    setTempStatus(currentStatus)
    setIsStatusModalOpen(true)
  }

  const handleStatusApply = () => {
    if (tempStatus === "구인 마감") {
      setIsStatusModalOpen(false)
      setIsConfirmDialogOpen(true)
      return
    }
    if (selectedCampaignId && tempStatus) {
      updateCampaignStatus(selectedCampaignId, tempStatus as "구인 진행 중" | "구인 마감" | "비공개 글")
    }
    setIsStatusModalOpen(false)
    setSelectedCampaignId(null)
    setTempStatus("")
  }

  const handleConfirmClose = () => {
    if (selectedCampaignId && tempStatus === "구인 마감") {
      updateCampaignStatus(selectedCampaignId, "구인 마감")
    }
    setIsConfirmDialogOpen(false)
    setSelectedCampaignId(null)
    setTempStatus("")
  }

  const handleCancelClose = () => {
    setIsConfirmDialogOpen(false)
    setIsStatusModalOpen(true)
  }

  function onEditClick(campaignId: number, status: string) {
    console.log("[v0] onEditClick called", campaignId, status)
    if (status !== "비공개 글") {
      setIsStateWarningOpen(true)
      return
    }
    router.push(`/campaigns/${campaignId}/edit`)
  }

  function onDeleteClick(campaignId: number, status: string) {
    console.log("[v0] onDeleteClick called", campaignId, status)
    if (status !== "비공개 글") {
      setIsStateWarningOpen(true)
      return
    }
    setCampaignToDelete(campaignId)
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    if (campaignToDelete) {
      deleteCampaign(campaignToDelete)
    }
    setIsDeleteConfirmOpen(false)
    setCampaignToDelete(null)
  }

  const isEditDeleteEnabled = (status: string) => {
    return status === "비공개 글"
  }

  function onApplicantsClick(campaignId: number) {
    console.log("[v0] onApplicantsClick called", campaignId)
    router.push(`/campaigns/${campaignId}/applicants`)
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <TopHeader title="내 캠페인" showBack={true} showSearch={false} showNotifications={false} showHeart={false} />

      <main className="px-4 py-6">
        {userCampaigns.length > 0 ? (
          <div className="space-y-6">
            {userCampaigns.map((campaign) => {
              const currentStatus = campaign.status || "구인 진행 중"
              const enabled = isEditDeleteEnabled(currentStatus)

              return (
                <div key={campaign.id} className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm">
                  <div className="flex gap-4">
                    <div className="w-32 h-32 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
                      <img
                        src={campaign.thumbnail || "/placeholder.svg"}
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <Badge className={`text-xs px-2 py-1 rounded-full ${getStatusColor(currentStatus)}`}>
                          {getStatusLabel(currentStatus)}
                        </Badge>
                      </div>

                      <p className="text-xs text-gray-500 mb-1">{campaign.brandName || "브랜드"}</p>

                      <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1 mb-1">
                        {campaign.title}
                      </h3>

                      <p className="text-sm mb-2">
                        <span className="text-[#7b68ee] font-medium">
                          {campaign.confirmedApplicants ?? 0}/{Number(campaign.recruitCount) || 1}
                        </span>
                        <span className="text-gray-600">명 모집중</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="text-sm h-11 rounded-xl bg-transparent"
                      onClick={() => onStatusChangeClick(campaign.id, currentStatus)}
                    >
                      상태 변경
                    </Button>
                    <Button
                      className="text-sm h-11 bg-[#7b68ee] hover:bg-[#6a5acd] text-white rounded-xl"
                      onClick={() => onApplicantsClick(campaign.id)}
                    >
                      지원자 관리
                    </Button>
                    <Button
                      variant="outline"
                      className={`text-sm h-11 rounded-xl flex items-center justify-center gap-2 ${
                        enabled ? "text-gray-900" : "text-gray-400 opacity-50"
                      }`}
                      onClick={() => onEditClick(campaign.id, currentStatus)}
                    >
                      <Edit className="w-4 h-4" />
                      수정하기
                    </Button>
                    <Button
                      variant="outline"
                      className={`text-sm h-11 rounded-xl flex items-center justify-center gap-2 ${
                        enabled ? "text-red-500 border-red-300 hover:bg-red-50" : "text-gray-400 opacity-50"
                      }`}
                      onClick={() => onDeleteClick(campaign.id, currentStatus)}
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제하기
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <FileText className="w-16 h-16 text-gray-300" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-600">작성한 캠페인이 없습니다</h3>
              <p className="text-sm text-gray-500">캠페인을 작성하고 파트너를 찾아보세요!</p>
            </div>
            {isProfileComplete ? (
              <Link href="/campaigns/create">
                <Button className="bg-[#7b68ee] hover:bg-[#7b68ee]/90 text-white px-6 py-2 rounded-full">
                  캠페인 만들기
                </Button>
              </Link>
            ) : (
              <Button disabled className="bg-[#7b68ee]/30 text-white px-6 py-2 rounded-full cursor-not-allowed">
                캠페인 만들기
              </Button>
            )}
          </div>
        )}
      </main>

      {/* 상태 변경 모달 */}
      <Drawer open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DrawerContent className="rounded-t-3xl">
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
          <div className="px-4 pt-2 pb-2 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-3">상태 변경</h3>
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTempStatus(option.value)}
                    className={`w-full px-4 py-3 rounded-xl text-sm border transition-colors text-left ${
                      tempStatus === option.value
                        ? "bg-[#7b68ee] text-white border-[#7b68ee]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DrawerFooter className="pt-3 pb-6">
            <Button onClick={handleStatusApply} className="w-full bg-[#7b68ee] hover:bg-[#7b68ee]/90 h-12">
              적용
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* 구인 마감 확인 다이얼로그 */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>구인 마감 확인</AlertDialogTitle>
            <AlertDialogDescription>
              구인 마감으로 변경하면 다시 수정할 수 없습니다. 정말 마감하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelClose}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose} className="bg-[#7b68ee] hover:bg-[#7b68ee]/90">
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 비공개 글 경고 다이얼로그 */}
      <AlertDialog open={isStateWarningOpen} onOpenChange={setIsStateWarningOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>캠페인 상태 확인</AlertDialogTitle>
            <AlertDialogDescription>먼저 캠페인의 상태를 비공개 글로 바꿔주세요.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setIsStateWarningOpen(false)}
              className="bg-[#7b68ee] hover:bg-[#7b68ee]/90"
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>캠페인 삭제</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-sm">
              <p>이 캠페인을 삭제하시겠습니까?</p>
              <p className="text-red-500 font-semibold">삭제 후에는 다시 복구할 수 없습니다.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
