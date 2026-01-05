import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLikesToThousands(likes: string | number): string {
  const count = typeof likes === "string" ? Number.parseInt(likes) : likes
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}천`
  }
  return count.toString()
}
