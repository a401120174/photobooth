import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { Camera, Sparkles } from "lucide-react"

interface WelcomeTabProps {
  setActiveTab: (tab: string) => void
}

export function WelcomeTab({ setActiveTab }: WelcomeTabProps) {
  return (
    <TabsContent value="welcome" className="p-6 bg-zinc-900">
      <div className="text-center py-12">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-amber-900/30 rounded-full animate-pulse"></div>
            <div className="absolute -top-2 -right-6 w-24 h-24 bg-amber-800/20 rounded-full animate-pulse delay-75"></div>
            <div className="absolute -bottom-4 -right-2 w-28 h-28 bg-amber-700/20 rounded-full animate-pulse delay-150"></div>
            <Camera className="relative w-32 h-32 text-amber-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-amber-200 mb-4">Welcome to Kawaii Photo Booth!</h2>
        <p className="text-amber-200/60 mb-8 max-w-md mx-auto">
          ✨ 創造屬於你的復古回憶！用經典濾鏡裝飾你的照片 ✨
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center bg-zinc-800 px-4 py-2 rounded-full border border-zinc-700">
              <Camera className="w-5 h-5 text-amber-400 mr-2" />
              <span className="text-amber-200">拍攝照片</span>
            </div>
            <span className="text-amber-400">→</span>
            <div className="flex items-center bg-zinc-800 px-4 py-2 rounded-full border border-zinc-700">
              <Sparkles className="w-5 h-5 text-amber-400 mr-2" />
              <span className="text-amber-200">製作成品</span>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 rounded-full px-12 py-6 text-lg hover:from-amber-600 hover:to-amber-800 transition-all shadow-lg shadow-amber-900/20"
            onClick={() => setActiveTab("capture")}
          >
            開始拍攝 ✨
          </Button>
        </div>
      </div>
    </TabsContent>
  )
} 