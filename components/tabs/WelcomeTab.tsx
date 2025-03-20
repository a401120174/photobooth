import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { Camera, Sparkles } from "lucide-react"

interface WelcomeTabProps {
  setActiveTab: (tab: string) => void
}

export function WelcomeTab({ setActiveTab }: WelcomeTabProps) {
  return (
    <TabsContent value="welcome" className="p-6 bg-white">
      <div className="text-center py-12">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-pink-100 rounded-full animate-pulse"></div>
            <div className="absolute -top-2 -right-6 w-24 h-24 bg-purple-100 rounded-full animate-pulse delay-75"></div>
            <div className="absolute -bottom-4 -right-2 w-28 h-28 bg-yellow-100 rounded-full animate-pulse delay-150"></div>
            <Camera className="relative w-32 h-32 text-pink-500" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-pink-600 mb-4">Welcome to Kawaii Photo Booth!</h2>
        <p className="text-purple-600 mb-8 max-w-md mx-auto">
          ✨ 創造屬於你的可愛回憶！用夢幻濾鏡和可愛貼紙裝飾你的照片 ✨
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center bg-purple-50 px-4 py-2 rounded-full">
              <Camera className="w-5 h-5 text-purple-500 mr-2" />
              <span className="text-purple-600">拍攝照片</span>
            </div>
            <span className="text-purple-400">→</span>
            <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full">
              <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-yellow-600">製作成品</span>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full px-12 py-6 text-lg hover:scale-105 transition-transform"
            onClick={() => setActiveTab("capture")}
          >
            開始拍攝 ✨
          </Button>
        </div>
      </div>
    </TabsContent>
  )
} 