"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Application {
  id: number
  campaignId: number
  applicationStatus: string
  campaignStatus: string
  campaignStatusColor: string
  title: string
  advertiser: string
  appliedTime: string
  proposalText: string
}

interface ApplicationStore {
  applications: Application[]
  addApplication: (application: Omit<Application, "id">) => number
  removeApplication: (id: number) => void
  getApplications: () => Application[]
  updateApplicationStatus: (campaignId: number, status: string) => void
}

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set, get) => ({
      applications: [],
      addApplication: (application) => {
        const newId = Date.now()
        const newApplication = {
          ...application,
          id: newId,
        }
        set((state) => ({
          applications: [newApplication, ...state.applications],
        }))
        return newId
      },
      removeApplication: (id) => {
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
        }))
      },
      getApplications: () => get().applications,
      updateApplicationStatus: (campaignId, status) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.campaignId === campaignId
              ? {
                  ...app,
                  applicationStatus: status,
                  campaignStatus: status === "다음기회에" ? "구인 마감" : app.campaignStatus,
                  campaignStatusColor: status === "다음기회에" ? "bg-gray-500" : app.campaignStatusColor,
                }
              : app,
          ),
        }))
        console.log("[v0] Updated application status for campaign", campaignId, "to:", status)
      },
    }),
    {
      name: "application-storage",
    },
  ),
)
