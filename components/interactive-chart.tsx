"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"

export function InteractiveChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; price: number } | null>(null)
  const [animationProgress, setAnimationProgress] = useState(0)

  useEffect(() => {
    const animationDuration = 2000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / animationDuration, 1)
      setAnimationProgress(progress)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx.scale(dpr, dpr)

    canvas.style.width = rect.width + "px"
    canvas.style.height = rect.height + "px"

    const data = [
      1.085, 1.087, 1.089, 1.091, 1.088, 1.086, 1.083, 1.081, 1.079, 1.078, 1.08, 1.083, 1.086, 1.089, 1.092, 1.095,
      1.093, 1.09, 1.087, 1.085, 1.088, 1.091, 1.094, 1.097, 1.1, 1.098, 1.095, 1.092, 1.09, 1.093, 1.096, 1.099, 1.102,
      1.105, 1.108, 1.106, 1.103, 1.101, 1.098, 1.095,
    ]

    const visibleDataLength = Math.floor(data.length * animationProgress)
    const visibleData = data.slice(0, visibleDataLength)

    const padding = 40
    const width = rect.width - padding * 2
    const height = rect.height - padding * 2

    const minPrice = Math.min(...data)
    const maxPrice = Math.max(...data)
    const priceRange = maxPrice - minPrice

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
    ctx.lineWidth = 1

    for (let i = 0; i <= 5; i++) {
      const y = padding + (height / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + width, y)
      ctx.stroke()
    }

    // Draw price line with gradient
    const gradient = ctx.createLinearGradient(padding, padding, padding, padding + height)
    gradient.addColorStop(0, "rgba(100, 255, 150, 0.8)")
    gradient.addColorStop(1, "rgba(50, 200, 100, 0.8)")

    ctx.strokeStyle = gradient
    ctx.lineWidth = 2.5
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()

    visibleData.forEach((price, index) => {
      const x = padding + (width / (data.length - 1)) * index
      const y = padding + height - ((price - minPrice) / priceRange) * height

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    if (animationProgress > 0.3) {
      // Draw Order Block with glow
      ctx.shadowBlur = 15
      ctx.shadowColor = "rgba(100, 255, 150, 0.3)"
      ctx.fillStyle = "rgba(100, 255, 150, 0.15)"
      ctx.strokeStyle = "rgba(100, 255, 150, 0.5)"
      ctx.lineWidth = 1.5
      const obStart = 8
      const obEnd = 12
      const obLow = 1.078
      const obHigh = 1.083

      const obX1 = padding + (width / (data.length - 1)) * obStart
      const obX2 = padding + (width / (data.length - 1)) * obEnd
      const obY1 = padding + height - ((obHigh - minPrice) / priceRange) * height
      const obY2 = padding + height - ((obLow - minPrice) / priceRange) * height

      ctx.fillRect(obX1, obY1, obX2 - obX1, obY2 - obY1)
      ctx.strokeRect(obX1, obY1, obX2 - obX1, obY2 - obY1)

      // Draw label
      ctx.shadowBlur = 0
      ctx.fillStyle = "rgba(100, 255, 150, 1)"
      ctx.font = "10px monospace"
      ctx.fillText("OB", obX1 + 5, obY1 + 12)
    }

    if (animationProgress > 0.5) {
      // Draw FVG with glow
      ctx.shadowBlur = 15
      ctx.shadowColor = "rgba(150, 150, 255, 0.3)"
      ctx.fillStyle = "rgba(150, 150, 255, 0.15)"
      ctx.strokeStyle = "rgba(150, 150, 255, 0.5)"
      const fvgStart = 18
      const fvgEnd = 22
      const fvgLow = 1.085
      const fvgHigh = 1.09

      const fvgX1 = padding + (width / (data.length - 1)) * fvgStart
      const fvgX2 = padding + (width / (data.length - 1)) * fvgEnd
      const fvgY1 = padding + height - ((fvgHigh - minPrice) / priceRange) * height
      const fvgY2 = padding + height - ((fvgLow - minPrice) / priceRange) * height

      ctx.fillRect(fvgX1, fvgY1, fvgX2 - fvgX1, fvgY2 - fvgY1)
      ctx.strokeRect(fvgX1, fvgY1, fvgX2 - fvgX1, fvgY2 - fvgY1)

      // Draw label
      ctx.shadowBlur = 0
      ctx.fillStyle = "rgba(150, 150, 255, 1)"
      ctx.font = "10px monospace"
      ctx.fillText("FVG", fvgX1 + 5, fvgY1 + 12)
    }
  }, [animationProgress])

  return (
    <section className="container py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Smart Money Visualization</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Interactive demonstration of key institutional trading concepts
          </p>
        </div>

        <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader>
            <CardTitle>EUR/USD - 15M Timeframe</CardTitle>
            <CardDescription className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-accent/20 text-accent-foreground border-accent/30">Order Block</Badge>
              <Badge className="bg-primary/20 text-primary-foreground border-primary/30">Fair Value Gap</Badge>
              <Badge className="bg-chart-2/20 text-foreground border-chart-2/30">Liquidity Zone</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas ref={canvasRef} className="w-full h-[400px] rounded-lg bg-card border border-border" />
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-sm bg-accent/50 group-hover:scale-125 transition-transform" />
                  <span className="text-sm font-medium">Order Block</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Area where institutions placed large orders, creating support/resistance
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-sm bg-primary/50 group-hover:scale-125 transition-transform" />
                  <span className="text-sm font-medium">Fair Value Gap</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Imbalance zone where price moved inefficiently, often gets filled
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-sm bg-chart-2/50 group-hover:scale-125 transition-transform" />
                  <span className="text-sm font-medium">Market Structure</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Series of higher highs and higher lows indicating bullish trend
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
