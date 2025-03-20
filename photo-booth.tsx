"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Download, Heart, Image, Sparkles, Star } from "lucide-react"

export default function PhotoBooth() {
  const [activeTab, setActiveTab] = useState("welcome")
  const [selectedFrame, setSelectedFrame] = useState(0)

  const frames = [
    { name: "Hearts", color: "bg-pink-100 border-pink-300" },
    { name: "Stars", color: "bg-purple-100 border-purple-300" },
    { name: "Flowers", color: "bg-yellow-100 border-yellow-300" },
    { name: "Clouds", color: "bg-blue-100 border-blue-300" },
  ]

  const stickers = [
    { icon: <Heart className="w-6 h-6 text-pink-500" />, name: "Heart" },
    { icon: <Star className="w-6 h-6 text-yellow-500" />, name: "Star" },
    { icon: <Sparkles className="w-6 h-6 text-purple-500" />, name: "Sparkle" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-2 tracking-wide">Kawaii Photo Booth</h1>
          <p className="text-purple-600">✨ Take cute photos with adorable frames and stickers! ✨</p>
        </header>

        <Card className="border-2 border-pink-300 shadow-lg rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <Tabs defaultValue="welcome" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className={`bg-pink-200 p-2 ${activeTab === 'welcome' ? 'hidden' : ''}`}>
                <TabsList className="grid grid-cols-3 bg-pink-100 p-1 rounded-xl">
                  <TabsTrigger
                    value="frames"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Frames
                  </TabsTrigger>
                  <TabsTrigger
                    value="capture"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capture
                  </TabsTrigger>
                  <TabsTrigger
                    value="decorate"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Decorate
                  </TabsTrigger>
                </TabsList>
              </div>

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
                    ✨ Create magical moments with cute frames, adorable stickers, and dreamy filters! ✨
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex items-center bg-pink-50 px-4 py-2 rounded-full">
                        <Image className="w-5 h-5 text-pink-500 mr-2" />
                        <span className="text-pink-600">Choose Frame</span>
                      </div>
                      <span className="text-purple-400">→</span>
                      <div className="flex items-center bg-purple-50 px-4 py-2 rounded-full">
                        <Camera className="w-5 h-5 text-purple-500 mr-2" />
                        <span className="text-purple-600">Take Photo</span>
                      </div>
                      <span className="text-purple-400">→</span>
                      <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full">
                        <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                        <span className="text-yellow-600">Decorate</span>
                      </div>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full px-12 py-6 text-lg hover:scale-105 transition-transform"
                      onClick={() => setActiveTab("frames")}
                    >
                      Start Creating! ✨
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="frames" className="p-6 bg-white">
                <h2 className="text-xl font-bold text-purple-600 mb-4 text-center">Choose Your Frame</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {frames.map((frame, index) => (
                    <div
                      key={index}
                      className={`${frame.color} border-2 rounded-xl p-3 aspect-square flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${selectedFrame === index ? "ring-4 ring-pink-500" : ""}`}
                      onClick={() => setSelectedFrame(index)}
                    >
                      <div className="text-center">
                        <div className="text-sm font-medium">{frame.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <Button
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full px-8"
                    onClick={() => setActiveTab("capture")}
                  >
                    Next Step
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="capture" className="p-6 bg-white">
                <h2 className="text-xl font-bold text-purple-600 mb-4 text-center">Take Your Photo</h2>
                <div
                  className={`${frames[selectedFrame].color} border-4 rounded-xl aspect-[3/4] max-w-sm mx-auto flex items-center justify-center`}
                >
                  <div className="text-center p-4 bg-white/80 rounded-lg">
                    <Camera className="w-12 h-12 mx-auto text-pink-500 mb-2" />
                    <p className="text-purple-600 font-medium">Camera preview will appear here</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-center gap-4">
                  <Button
                    variant="outline"
                    className="rounded-full border-pink-300 text-pink-600"
                    onClick={() => setActiveTab("frames")}
                  >
                    Back
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full px-8"
                    onClick={() => setActiveTab("decorate")}
                  >
                    Take Photo
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="decorate" className="p-6 bg-white">
                <h2 className="text-xl font-bold text-purple-600 mb-4 text-center">Decorate Your Photo</h2>
                <div className="flex flex-col md:flex-row gap-6">
                  <div
                    className={`${frames[selectedFrame].color} border-4 rounded-xl aspect-[3/4] w-full md:w-2/3 flex items-center justify-center`}
                  >
                    <div className="text-center p-4 bg-white/80 rounded-lg">
                      <Image className="w-12 h-12 mx-auto text-pink-500 mb-2" />
                      <p className="text-purple-600 font-medium">Your photo will appear here</p>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3">
                    <h3 className="font-medium text-purple-600 mb-2">Add Stickers</h3>
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      {stickers.map((sticker, index) => (
                        <div
                          key={index}
                          className="bg-pink-50 border border-pink-200 rounded-lg p-2 flex flex-col items-center cursor-pointer hover:bg-pink-100"
                        >
                          {sticker.icon}
                          <span className="text-xs mt-1 text-pink-600">{sticker.name}</span>
                        </div>
                      ))}
                    </div>

                    <h3 className="font-medium text-purple-600 mb-2">Filters</h3>
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <div className="bg-pink-50 border border-pink-200 rounded-lg p-2 text-center cursor-pointer hover:bg-pink-100">
                        <span className="text-xs text-pink-600">Pastel</span>
                      </div>
                      <div className="bg-pink-50 border border-pink-200 rounded-lg p-2 text-center cursor-pointer hover:bg-pink-100">
                        <span className="text-xs text-pink-600">Dreamy</span>
                      </div>
                      <div className="bg-pink-50 border border-pink-200 rounded-lg p-2 text-center cursor-pointer hover:bg-pink-100">
                        <span className="text-xs text-pink-600">Glitter</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center gap-4">
                  <Button
                    variant="outline"
                    className="rounded-full border-pink-300 text-pink-600"
                    onClick={() => setActiveTab("capture")}
                  >
                    Back
                  </Button>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full px-8">
                    <Download className="w-4 h-4 mr-2" />
                    Save Photo
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-purple-600">✨ Share your kawaii photos with friends! ✨</p>
        </div>
      </div>
    </div>
  )
}

