// 常數定義
export const CANVAS_WIDTH = 1080
export const CANVAS_HEIGHT = 1920
export const PHOTO_WIDTH = CANVAS_WIDTH * 0.35
export const PHOTO_HEIGHT = PHOTO_WIDTH
export const PHOTO_GAP = 10

// 畫布背景處理
export const createMainCanvasBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, "#1a1a1a")
  gradient.addColorStop(0.5, "#262626")
  gradient.addColorStop(1, "#333333")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

export const createSecondaryCanvasBackground = (ctxB: CanvasRenderingContext2D, canvasB: HTMLCanvasElement) => {
  const gradientB = ctxB.createLinearGradient(0, 0, 0, canvasB.height)
  gradientB.addColorStop(0, "#262626")
  gradientB.addColorStop(1, "#333333")
  ctxB.fillStyle = gradientB
  ctxB.fillRect(0, 0, canvasB.width, canvasB.height)
}

// 照片處理
export const drawSinglePhoto = (
  ctxB: CanvasRenderingContext2D, 
  img: HTMLImageElement,
  index: number,
  photoWidth: number,
  photoHeight: number,
  gap: number,
  selectedFilter: string
) => {
  // 計算圖片位置
  const centerX = img.width / 2
  const centerY = img.height / 2
  const sourceX = centerX - photoWidth / 2
  const sourceY = centerY - photoHeight / 2
  
  // 繪製背景和陰影
  ctxB.save()
  ctxB.shadowColor = "rgba(0, 0, 0, 0.2)"
  ctxB.shadowBlur = 10
  ctxB.shadowOffsetX = 5
  ctxB.shadowOffsetY = 5
  ctxB.fillStyle = "white"
  ctxB.fillRect(0, index * (photoHeight + gap), photoWidth, photoHeight)
  ctxB.restore()

  // 創建臨時畫布處理圖片
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = img.width
  canvas.height = img.height
  ctx!.drawImage(img, 0, 0, img.width, img.height)

  // 獲取並處理圖像數據
  const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
    data[i] = avg
    data[i + 1] = avg
    data[i + 2] = avg
  }
  ctx!.putImageData(imageData, 0, 0)
  
  // 繪製處理後的圖片
  ctxB.drawImage(
    canvas,
    sourceX, sourceY,
    photoWidth, photoHeight,
    0, index * (photoHeight + gap),
    photoWidth, photoHeight
  )

  // 添加日期標記
  addDateMark(ctxB, photoWidth, photoHeight, gap, index)
}

export const addDateMark = (
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
}

// 畫布合併
export const mergeFinalCanvas = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  canvasB: HTMLCanvasElement
) => {
  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((10 * Math.PI) / 180)
  ctx.drawImage(canvasB, -canvasB.width / 2, -canvasB.height / 2)
  ctx.restore()
}

// 畫布初始化
export const initializeCanvases = (
  canvas: HTMLCanvasElement,
  canvasB: HTMLCanvasElement,
  photosLength: number
) => {
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  canvasB.width = PHOTO_WIDTH
  canvasB.height = (PHOTO_HEIGHT + PHOTO_GAP) * photosLength - PHOTO_GAP
} 