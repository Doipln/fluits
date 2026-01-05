"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, PenLine } from "lucide-react"

interface CampaignCreationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CampaignCreationModal({ open, onOpenChange }: CampaignCreationModalProps) {
  const router = useRouter()

  const handleRegularCampaign = () => {
    onOpenChange(false)
    router.push("/campaigns/create")
  }

  const handleAICampaign = () => {
    onOpenChange(false)
    router.push("/campaigns/create-ai")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[96vw] sm:max-w-2xl p-2 sm:p-6 gap-0 bg-transparent border-none"
        showCloseButton={false}
      >
        <div className="flex flex-row items-center justify-center gap-1.5 sm:gap-3 w-full">
          <Button
            onClick={handleRegularCampaign}
            className="flex-1 min-w-0 h-32 sm:h-36 bg-white hover:bg-gray-50 text-gray-900 rounded-2xl flex flex-col items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <PenLine className="w-4 h-4 sm:w-6 sm:h-6 text-[#7b68ee]" />
              <span className="text-sm sm:text-lg font-semibold whitespace-nowrap">직접 작성하기</span>
            </div>
            <span className="text-[10px] sm:text-sm text-gray-500 text-center leading-tight">
              캠페인의 항목을 직접 작성해요
            </span>
          </Button>

          <Button
            disabled
            className="flex-1 min-w-0 h-32 sm:h-36 bg-gray-100 hover:bg-gray-100 text-gray-400 rounded-2xl flex flex-col items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 cursor-not-allowed"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-gray-300" />
              <span className="text-sm sm:text-lg font-semibold whitespace-nowrap">Flu IT으로 작성하기</span>
            </div>
            <span className="text-[10px] sm:text-sm text-gray-400 text-center leading-tight">준비중입니다</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
