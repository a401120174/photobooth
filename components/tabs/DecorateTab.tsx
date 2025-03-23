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
  { id: "warm", label: "暖色", filter: "brightness(1.1) contrast(0.9) saturate(0.9) sepia(0.2)" },
  { id: "cool", label: "冷色", filter: "brightness(0.9) contrast(1.1) saturate(1.1) sepia(0.1)" },
  { id: "vintage", label: "復古", filter: "saturate(0.7) contrast(1.2) sepia(0.5) brightness(0.9)" },
]

export function DecorateTab({ photos, onBack }: DecorateTabProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("normal")
  const [mergedPhoto, setMergedPhoto] = useState<string | null>(null)
  const mergeCanvasRef = useRef<HTMLCanvasElement>(null)

  // 創建主畫布背景
  const createMainCanvasBackground = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#1a1a1a") // 深灰色
    gradient.addColorStop(0.5, "#262626") // 中灰色
    gradient.addColorStop(1, "#333333") // 淺灰色
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  // 創建次要畫布背景
  const createSecondaryCanvasBackground = useCallback((ctxB: CanvasRenderingContext2D, canvasB: HTMLCanvasElement) => {
    const gradientB = ctxB.createLinearGradient(0, 0, 0, canvasB.height)
    gradientB.addColorStop(0, "#262626") // 深灰色
    gradientB.addColorStop(1, "#333333") // 淺灰色
    ctxB.fillStyle = gradientB
    ctxB.fillRect(0, 0, canvasB.width, canvasB.height)
  }, [])

  // 繪製單張照片
  const drawSinglePhoto = useCallback((
    ctxB: CanvasRenderingContext2D, 
    img: HTMLImageElement,
    index: number,
    photoWidth: number,
    photoHeight: number,
    gap: number,
    selectedFilter: string
  ) => {
    // 計算圖片的中心點
    const centerX = img.width / 2
    const centerY = img.height / 2
    
    // 計算要截取區域的左上角座標
    const sourceX = centerX - photoWidth / 2
    const sourceY = centerY - photoHeight / 2
    
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
    ctxB.drawImage(
      img,
      sourceX, sourceY,
      photoWidth, photoHeight,
      0, index * (photoHeight + gap),
      photoWidth, photoHeight
    )

    // 重置濾鏡
    ctxB.filter = "none"

    // 添加日期標記
    addDateMark(ctxB, photoWidth, photoHeight, gap, index)
  }, [])

  // 添加日期標記
  const addDateMark = useCallback((
    ctx: CanvasRenderingContext2D,
    photoWidth: number,
    photoHeight: number,
    gap: number,
    index: number
  ) => {
    const date = new Date().toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    ctx.fillStyle = "#9f7aea"
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.fillText(date, photoWidth / 2, (index + 1) * (photoHeight + gap) - gap / 2)
  }, [])

  // 合併所有照片到主畫布
  const mergeFinalCanvas = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    canvasB: HTMLCanvasElement
  ) => {
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((10 * Math.PI) / 180)
    ctx.drawImage(canvasB, -canvasB.width / 2, -canvasB.height / 2)
    ctx.restore()
  }, [])

  // 初始化畫布尺寸
  const initializeCanvases = useCallback((
    canvas: HTMLCanvasElement,
    canvasB: HTMLCanvasElement,
    photos: string[]
  ) => {
    // 設置主畫布大小
    canvas.width = 1080
    canvas.height = 1920

    // 計算照片大小和間距
    const photoWidth = Math.floor(canvas.width * 0.35)
    const photoHeight = photoWidth
    const gap = Math.floor(canvas.height * 0.03)

    // 設置次要畫布大小
    canvasB.width = photoWidth
    canvasB.height = (photoHeight + gap) * photos.length - gap

    return { photoWidth, photoHeight, gap }
  }, [])

  // 合併照片主函數
  const mergePhotos = useCallback(() => {
    if (!mergeCanvasRef.current || photos.length === 0) return

    const canvas = mergeCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 創建第二個畫布
    const canvasB = document.createElement("canvas")
    const ctxB = canvasB.getContext("2d")
    if (!ctxB) return

    // 初始化畫布
    const { photoWidth, photoHeight, gap } = initializeCanvases(canvas, canvasB, photos)

    // 創建背景
    createMainCanvasBackground(ctx, canvas)
    createSecondaryCanvasBackground(ctxB, canvasB)

    // 使用 Promise.all 等待所有照片加載完成
    const loadPromises = photos.map((photo, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => {
          drawSinglePhoto(ctxB, img, index, photoWidth, photoHeight, gap, selectedFilter)
          resolve()
        }
        img.src = photo
      })
    })

    // 等待所有照片加載完成後進行合併
    Promise.all(loadPromises).then(() => {
      mergeFinalCanvas(ctx, canvas, canvasB)
      setMergedPhoto(canvas.toDataURL("image/jpeg", 0.9))
    })
  }, [photos, selectedFilter, createMainCanvasBackground, createSecondaryCanvasBackground, drawSinglePhoto, mergeFinalCanvas, initializeCanvases])

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

  // 當照片或濾鏡改變時重新合併
  useEffect(() => {
    mergePhotos()
  }, [photos, selectedFilter, mergePhotos])

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