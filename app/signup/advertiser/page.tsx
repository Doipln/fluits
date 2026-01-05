"use client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function AdvertiserSignupPage() {
  const router = useRouter()

  const handleKakaoLogin = () => {
    localStorage.setItem("influencer_mode", "false")
    localStorage.setItem("is_logged_in", "true")
    router.push("/advertiser/dashboard")
  }

  const handleGoogleLogin = () => {
    localStorage.setItem("influencer_mode", "false")
    localStorage.setItem("is_logged_in", "true")
    router.push("/advertiser/dashboard")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="fixed top-0 left-0 right-0 bg-transparent z-50 px-4 py-4">
        <button
          onClick={() => router.back()}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
      </header>

      <main className="flex-1 px-4 pt-20 flex flex-col">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-6 text-left">
            <h1 className="font-bold text-black mb-1 text-2xl">가입하기</h1>
            <p className="text-gray-600 text-base leading-relaxed">인플루언서와 광고주를 잇다</p>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto mt-auto mb-32">
          <div className="space-y-2">
            <Button
              type="button"
              onClick={handleKakaoLogin}
              className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#000000] font-semibold rounded-2xl"
              size="lg"
              style={{ height: "48px" }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.442 1.443 4.615 3.686 6.143-.21.734-.686 2.385-.786 2.77-.12.462.17.456.358.332.142-.094 2.298-1.55 3.264-2.202.81.144 1.648.22 2.478.22 5.523 0 10-3.477 10-7.763S17.523 3 12 3z" />
              </svg>
              카카오로 로그인하기
            </Button>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl bg-transparent"
              size="lg"
              style={{ height: "48px" }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              구글로 로그인하기
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
