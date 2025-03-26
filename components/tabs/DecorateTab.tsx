import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { useCallback, useEffect, useRef, useState } from "react"
import { Download } from "lucide-react"
import {
  PHOTO_WIDTH,
  PHOTO_HEIGHT,
  PHOTO_GAP,
  createMainCanvasBackground,
  createSecondaryCanvasBackground,
  drawSinglePhoto,
  mergeFinalCanvas,
  initializeCanvases
} from "@/utils/canvasUtils"

interface DecorateTabProps {
  photos: string[]
  onBack: () => void
}

interface Filter {
  id: string
  label: string
  filter: string
}

const filters: Filter[] = [
  { id: "normal", label: "原始", filter: "none" },
  { id: "warm", label: "暖色", filter: "brightness(1.1) contrast(0.9) saturate(0.9) sepia(0.2)" },
  { id: "cool", label: "冷色", filter: "brightness(0.9) contrast(1.1) saturate(1.1) sepia(0.1)" },
  { id: "vintage", label: "復古", filter: "saturate(0.7) contrast(1.2) sepia(0.5) brightness(0.9)" },
]

export function DecorateTab({ photos, onBack }: DecorateTabProps) {
  // 狀態管理
  const [selectedFilter, setSelectedFilter] = useState<string>("normal")
  const [mergedPhoto, setMergedPhoto] = useState<string | null>(null)
  const mergeCanvasRef = useRef<HTMLCanvasElement>(null)

  const mergePhotos = useCallback(() => {
    if (!mergeCanvasRef.current || photos.length === 0) return

    const canvasA = mergeCanvasRef.current
    const ctxA = canvasA.getContext("2d")
    if (!ctxA) return

    const canvasB = document.createElement("canvas")
    const ctxB = canvasB.getContext("2d")
    if (!ctxB) return

    initializeCanvases(canvasA, canvasB, photos.length)
    createMainCanvasBackground(ctxA, canvasA)
    createSecondaryCanvasBackground(ctxB, canvasB)

    const loadPromises = photos.map((photo, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => {
          drawSinglePhoto(ctxB, img, index, PHOTO_WIDTH, PHOTO_HEIGHT, PHOTO_GAP, selectedFilter)
          resolve()
        }
        img.src = photo
      })
    })

    Promise.all(loadPromises).then(() => {
      mergeFinalCanvas(ctxA, canvasA, canvasB)
      setMergedPhoto(canvasA.toDataURL("image/jpeg", 0.9))
    })
  }, [photos, selectedFilter])

  // 下載功能
  const downloadPhoto = useCallback(() => {
    if (!mergedPhoto) return
    const link = document.createElement("a")
    link.href = mergedPhoto
    link.download = "kawaii-photo-booth.jpg"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [mergedPhoto])

  // 效果處理
  useEffect(() => {
    mergePhotos()
  }, [photos, selectedFilter, mergePhotos])

  // 渲染UI
  return (
    <TabsContent value="decorate" className="p-6 bg-zinc-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-amber-200">裝飾照片</h2>
          <Button
            variant="outline"
            className="text-amber-200 border-amber-800 hover:bg-amber-900/50"
            onClick={onBack}
          >
            重新拍攝
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-amber-200 mb-3">選擇濾鏡</h3>
                <div className="grid grid-cols-2 gap-2">
                  {filters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={selectedFilter === filter.id ? "default" : "outline"}
                      className={`w-full ${
                        selectedFilter === filter.id
                          ? "bg-amber-700 hover:bg-amber-600 text-amber-100"
                          : "text-amber-200 border-amber-700 hover:bg-amber-800/50"
                      }`}
                      onClick={() => setSelectedFilter(filter.id)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-4">
                <div className="aspect-[9/16] bg-zinc-900 rounded-lg overflow-hidden relative border border-zinc-700">
                  {mergedPhoto ? (
                    <img
                      src={mergedPhoto}
                      alt="Merged photos"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-amber-200/60">
                      處理中...
                    </div>
                  )}
                </div>
                <canvas ref={mergeCanvasRef} className="hidden" />
                <div className="mt-4 flex justify-center">
                  <Button
                    className="bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 hover:from-amber-600 hover:to-amber-800 rounded-full px-8 shadow-lg shadow-amber-900/20"
                    onClick={downloadPhoto}
                    disabled={!mergedPhoto}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    下載照片
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TabsContent>
  )
} 