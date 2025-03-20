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
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-600 mb-2">Kawaii Photo Booth</h1>
            <p className="text-pink-600">拍出可愛的照片吧！</p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-0">
              <Tabs value={activeTab} className="w-full">
                <TabsList className="w-full justify-start rounded-none rounded-t-lg border-b bg-white p-0">
                  <TabsTrigger
                    value="welcome"
                    className="rounded-none data-[state=active]:bg-pink-50 data-[state=active]:text-pink-600"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    歡迎
                  </TabsTrigger>
                  <TabsTrigger
                    value="capture"
                    className="rounded-none data-[state=active]:bg-pink-50 data-[state=active]:text-pink-600"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    拍攝
                  </TabsTrigger>
                  <TabsTrigger
                    value="decorate"
                    className="rounded-none data-[state=active]:bg-pink-50 data-[state=active]:text-pink-600"
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

