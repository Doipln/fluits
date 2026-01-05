"use client"

import type React from "react"

import { useState } from "react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface PreviewDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: {
    marketingBrief: string
    contentInstructions: string
    sceneInstructions: string
    titleSuggestion: string
    hashtags: string[]
  }
  onConfirm: (editedData: {
    marketingBrief: string
    contentInstructions: string
    sceneInstructions: string
    titleSuggestion: string
    hashtags: string[]
  }) => void
}

export function PreviewDrawer({ open, onOpenChange, data, onConfirm }: PreviewDrawerProps) {
  const [editedData, setEditedData] = useState(data)
  const [hashtagInput, setHashtagInput] = useState("")

  const handleHashtagAdd = () => {
    if (hashtagInput.trim()) {
      const tag = hashtagInput.startsWith("#") ? hashtagInput : `#${hashtagInput}`
      if (!editedData.hashtags.includes(tag)) {
        setEditedData({
          ...editedData,
          hashtags: [...editedData.hashtags, tag],
        })
      }
      setHashtagInput("")
    }
  }

  const handleHashtagRemove = (tag: string) => {
    setEditedData({
      ...editedData,
      hashtags: editedData.hashtags.filter((t) => t !== tag),
    })
  }

  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleHashtagAdd()
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle>AI 생성 결과 미리보기</DrawerTitle>
          <DrawerDescription>생성된 내용을 확인하고 수정할 수 있습니다</DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto p-4 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              캠페인 제목
            </Label>
            <Input
              id="title"
              value={editedData.titleSuggestion}
              onChange={(e) => setEditedData({ ...editedData, titleSuggestion: e.target.value })}
              className="w-full"
            />
          </div>

          {/* Marketing Brief */}
          <div className="space-y-2">
            <Label htmlFor="brief" className="text-sm font-medium">
              마케팅 브리프
            </Label>
            <Textarea
              id="brief"
              value={editedData.marketingBrief}
              onChange={(e) => setEditedData({ ...editedData, marketingBrief: e.target.value })}
              rows={6}
              className="w-full resize-none"
            />
          </div>

          {/* Content Instructions */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              콘텐츠 제작 가이드
            </Label>
            <Textarea
              id="content"
              value={editedData.contentInstructions}
              onChange={(e) => setEditedData({ ...editedData, contentInstructions: e.target.value })}
              rows={6}
              className="w-full resize-none"
            />
          </div>

          {/* Scene Instructions */}
          <div className="space-y-2">
            <Label htmlFor="scene" className="text-sm font-medium">
              촬영 가이드
            </Label>
            <Textarea
              id="scene"
              value={editedData.sceneInstructions}
              onChange={(e) => setEditedData({ ...editedData, sceneInstructions: e.target.value })}
              rows={6}
              className="w-full resize-none"
            />
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">해시태그</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedData.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                  <button onClick={() => handleHashtagRemove(tag)} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="해시태그 추가"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={handleHashtagKeyDown}
                className="flex-1"
              />
              <Button onClick={handleHashtagAdd} variant="outline" size="sm">
                추가
              </Button>
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t">
          <div className="flex gap-3 w-full">
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1 bg-transparent">
                취소
              </Button>
            </DrawerClose>
            <Button
              onClick={() => {
                onConfirm(editedData)
                onOpenChange(false)
              }}
              className="flex-1 bg-[#7b68ee] hover:bg-[#6b58de]"
            >
              확인 및 게시
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
