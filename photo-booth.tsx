"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Image, Sparkles } from "lucide-react"
import { useState } from "react"
import { WelcomeTab } from "@/components/tabs/WelcomeTab"
import { CaptureTab } from "@/components/tabs/CaptureTab"
import { DecorateTab } from "@/components/tabs/DecorateTab"

export default function PhotoBooth() {
  const [activeTab, setActiveTab] = useState("welcome")
  const [photos, setPhotos] = useState<string[]>([])

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-200 mb-2">Vintage Photo Booth</h1>
            <p className="text-amber-200/60">創造復古風格的照片回憶</p>
          </div>

          <Card className="bg-zinc-800 border-zinc-700 shadow-xl shadow-black/20">
            <CardContent className="p-0">
              <Tabs value={activeTab} className="w-full">
                <TabsList className="w-full justify-start rounded-none rounded-t-lg border-b border-zinc-700 bg-zinc-900 p-0">
                  <TabsTrigger
                    value="welcome"
                    className="rounded-none data-[state=active]:bg-amber-900/50 data-[state=active]:text-amber-200 text-zinc-400"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    歡迎
                  </TabsTrigger>
                  <TabsTrigger
                    value="capture"
                    className="rounded-none data-[state=active]:bg-amber-900/50 data-[state=active]:text-amber-200 text-zinc-400"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    拍攝
                  </TabsTrigger>
                  <TabsTrigger
                    value="decorate"
                    className="rounded-none data-[state=active]:bg-amber-900/50 data-[state=active]:text-amber-200 text-zinc-400"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    裝飾
                  </TabsTrigger>
                </TabsList>

                <WelcomeTab setActiveTab={setActiveTab} />
                <CaptureTab setActiveTab={setActiveTab} isActive={activeTab === "capture"} onPhotosCaptured={setPhotos} />
                <DecorateTab photos={photos} onBack={() => setActiveTab("capture")} />
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

