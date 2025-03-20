import { TabsContent } from "@/components/ui/tabs"
import { useCallback, useEffect, useRef, useState } from "react"

interface CaptureTabProps {
  isActive: boolean
  setActiveTab: (tab: string) => void
  onPhotosCaptured: (photos: string[]) => void
}

export function CaptureTab({ setActiveTab, onPhotosCaptured,isActive }: CaptureTabProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [countdown, setCountdown] = useState<number>(0)
  const [showFlash, setShowFlash] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 開始連續拍攝
  const startCapturing = useCallback(() => {
    setIsCapturing(true)
    setPhotos([])
    setCountdown(3)
  }, [])

  // 初始化攝像頭
  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 720 },
          height: { ideal: 720 }
        }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        startCapturing()
      }
    } catch (err) {
      console.error("無法訪問攝像頭:", err)
    }
  }, [])

  // 拍照功能
  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const photoData = canvas.toDataURL("image/jpeg")
        setPhotos(prev => [...prev, photoData])
      }
    }
  }, [])

  // 處理倒數計時和拍攝
  useEffect(() => {
    if (!isCapturing) return

    if (countdown === 0) {
      capturePhoto()
      setShowFlash(true)
      setTimeout(() => setShowFlash(false), 200)
    } else {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }

  }, [countdown, isCapturing, capturePhoto])

  // 處理倒數計時和拍攝
  useEffect(() => {
    if (!isCapturing) return

    if (photos.length < 4) {
      setCountdown(3)
    } else {
      setIsCapturing(false)
      onPhotosCaptured(photos)
      setActiveTab("decorate")
    }
  }, [ isCapturing, photos, onPhotosCaptured, setActiveTab])
  
  useEffect(() => {
    if (isActive) {
      initCamera()
    }
  }, [initCamera, isActive])

  return (
    <TabsContent value="capture" className="p-6 bg-white">
      <h2 className="text-xl font-bold text-purple-600 mb-4 text-center">
        {isCapturing 
          ? `第 ${photos.length + 1} 張照片` 
          : "準備拍攝"}
      </h2>
      <div className="relative">
        <div className="bg-pink-100 border-pink-300 border-4 rounded-xl mx-auto flex items-center justify-center overflow-hidden relative
          aspect-[1/1] max-w-[480px]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          {countdown !== 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl font-bold text-white drop-shadow-lg animate-bounce">
                {countdown}
              </span>
            </div>
          )}
          {showFlash && (
            <div className="absolute inset-0 bg-white animate-flash"></div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </TabsContent>
  )
} 