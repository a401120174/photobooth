import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { useCallback, useEffect, useRef, useState } from "react"
import { Download } from "lucide-react"

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
  { id: "warm", label: "暖色", filter: "brightness(1.1) contrast(0.9) saturate(0.9)" },
  { id: "cool", label: "冷色", filter: "brightness(0.9) contrast(1.1) saturate(1.1)" },
  { id: "vintage", label: "復古", filter: "saturate(0.8) contrast(1.2) sepia(0.5) blur(1px)" },
]

export function DecorateTab({ photos, onBack }: DecorateTabProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("normal")
  const [mergedPhoto, setMergedPhoto] = useState<string | null>(null)
  const [mergeCanvasRef, setMergeCanvasRef] = useState<HTMLCanvasElement | null>(null)
  // 合併照片
  const mergePhotos = useCallback(() => {
    if (!mergeCanvasRef || photos.length === 0) return

      const canvas = mergeCanvasRef
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 設置畫布大小為 1080x1920
    canvas.width = 1080
    canvas.height = 1920

    // 創建漸層背景
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#fdf2f8") // 淺粉色
    gradient.addColorStop(0.5, "#fbcfe8") // 中粉色
    gradient.addColorStop(1, "#e9d5ff") // 淺紫色
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 計算照片大小和間距
    const photoWidth = Math.floor(canvas.width * 0.6) // 照片寬度為畫布寬度的 80%
    const photoHeight = Math.floor(photoWidth * (9/16)) // 保持 16:9 比例
    const gap = Math.floor(canvas.height * 0.03) // 間距為畫布高度的 3%

    // 創建第二個畫布用於垂直排列照片
    const canvasB = document.createElement("canvas")
    const ctxB = canvasB.getContext("2d")
    if (!ctxB) return

    // 設置畫布 B 的大小
    canvasB.width = photoWidth
    canvasB.height = (photoHeight + gap) * photos.length - gap

    // 創建畫布 B 的背景漸層
    const gradientB = ctxB.createLinearGradient(0, 0, 0, canvasB.height)
    gradientB.addColorStop(0, "#fce7f3") // 淺粉色
    gradientB.addColorStop(1, "#f5f3ff") // 淺紫色
    ctxB.fillStyle = gradientB
    ctxB.fillRect(0, 0, canvasB.width, canvasB.height)

    // 使用 Promise.all 等待所有照片加載完成
    const loadPromises = photos.map((photo, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => {
          // 繪製白色背景和陰影
          ctxB.save()
          ctxB.shadowColor = "rgba(0, 0, 0, 0.2)"
          ctxB.shadowBlur = 10
          ctxB.shadowOffsetX = 5
          ctxB.shadowOffsetY = 5
          ctxB.fillStyle = "white"
          ctxB.fillRect(0, index * (photoHeight + gap), photoWidth, photoHeight)
          ctxB.restore()

          // 應用濾鏡效果
          const filter = filters.find(f => f.id === selectedFilter)
          if (filter && filter.id !== "normal") {
            ctxB.filter = filter.filter
          }

          // 繪製照片
          ctxB.drawImage(img, 0, index * (photoHeight + gap), photoWidth, photoHeight)
          
          // 重置濾鏡
          ctxB.filter = "none"

          // 添加日期標記
          const date = new Date().toLocaleDateString("zh-TW", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          ctxB.fillStyle = "#9f7aea"
          ctxB.font = "16px Arial"
          ctxB.textAlign = "center"
          ctxB.fillText(date, photoWidth / 2, (index + 1) * (photoHeight + gap) - gap / 2)

          resolve()
        }
        img.src = photo
      })
    })

    // 等待所有照片加載完成後進行合併
    Promise.all(loadPromises).then(() => {
      // 將畫布 B 旋轉 10 度並放置在畫布 A 的中心
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((10 * Math.PI) / 180)
      ctx.drawImage(canvasB, -canvasB.width / 2, -canvasB.height / 2)
      ctx.restore()

      // 設置合併後的照片
      setMergedPhoto(canvas.toDataURL("image/jpeg", 0.9))
    })
  }, [photos, selectedFilter, mergeCanvasRef])

  // 當照片或濾鏡改變時重新合併
  useEffect(() => {
    mergePhotos()
  }, [photos, selectedFilter, mergePhotos])

  // 下載照片
  const downloadPhoto = useCallback(() => {
    if (!mergedPhoto) return

    const link = document.createElement("a")
    link.href = mergedPhoto
    link.download = "kawaii-photo-booth.jpg"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [mergedPhoto])

  return (
    <TabsContent value="decorate" className="p-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-purple-600">裝飾照片</h2>
          <Button
            variant="outline"
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
            onClick={onBack}
          >
            重新拍攝
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-purple-600 mb-3">選擇濾鏡</h3>
                <div className="grid grid-cols-2 gap-2">
                  {filters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={selectedFilter === filter.id ? "default" : "outline"}
                      className="w-full"
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
            <Card>
              <CardContent className="p-4">
                <div className="aspect-[9/16] bg-pink-50 rounded-lg overflow-hidden relative">
                  {mergedPhoto ? (
                    <img
                      src={mergedPhoto}
                      alt="Merged photos"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-purple-400">
                      處理中...
                    </div>
                  )}
                </div>
                <canvas ref={setMergeCanvasRef} className="hidden" />
                <div className="mt-4 flex justify-center">
                  <Button
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full px-8"
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