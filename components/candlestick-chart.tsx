"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"

interface Candle {
  open: number
  high: number
  low: number
  close: number
  timestamp: number
}

export function CandlestickChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentCandle, setCurrentCandle] = useState(0)

  const candles: Candle[] = [
    { open: 1.085, high: 1.088, low: 1.084, close: 1.087, timestamp: 1 },
    { open: 1.087, high: 1.092, low: 1.086, close: 1.091, timestamp: 2 },
    { open: 1.091, high: 1.093, low: 1.088, close: 1.089, timestamp: 3 },
    { open: 1.089, high: 1.09, low: 1.083, close: 1.086, timestamp: 4 },
    { open: 1.086, high: 1.087, low: 1.081, close: 1.083, timestamp: 5 },
    { open: 1.083, high: 1.084, low: 1.078, close: 1.079, timestamp: 6 },
    { open: 1.079, high: 1.082, low: 1.077, close: 1.08, timestamp: 7 },
    { open: 1.08, high: 1.085, low: 1.079, close: 1.083, timestamp: 8 },
    { open: 1.083, high: 1.088, low: 1.082, close: 1.086, timestamp: 9 },
    { open: 1.086, high: 1.091, low: 1.085, close: 1.089, timestamp: 10 },
    { open: 1.089, high: 1.094, low: 1.088, close: 1.092, timestamp: 11 },
    { open: 1.092, high: 1.096, low: 1.091, close: 1.095, timestamp: 12 },
    { open: 1.095, high: 1.097, low: 1.091, close: 1.093, timestamp: 13 },
    { open: 1.093, high: 1.094, low: 1.088, close: 1.09, timestamp: 14 },
    { open: 1.09, high: 1.092, low: 1.086, close: 1.088, timestamp: 15 },
    { open: 1.088, high: 1.093, low: 1.087, close: 1.091, timestamp: 16 },
    { open: 1.091, high: 1.096, low: 1.09, close: 1.094, timestamp: 17 },
    { open: 1.094, high: 1.099, low: 1.093, close: 1.097, timestamp: 18 },
    { open: 1.097, high: 1.102, low: 1.096, close: 1.1, timestamp: 19 },
    { open: 1.1, high: 1.101, low: 1.095, close: 1.098, timestamp: 20 },
  ]

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentCandle((prev) => {
        if (prev >= candles.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isPlaying, candles.length])

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

    const padding = 50
    const width = rect.width - padding * 2
    const height = rect.height - padding * 2

    const visibleCandles = candles.slice(0, currentCandle + 1)
    const allPrices = candles.flatMap((c) => [c.high, c.low])
    const minPrice = Math.min(...allPrices)
    const maxPrice = Math.max(...allPrices)
    const priceRange = maxPrice - minPrice

    ctx.clearRect(0, 0, rect.width, rect.height)

    // Grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + width, y)
      ctx.stroke()

      const price = maxPrice - (priceRange / 5) * i
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
      ctx.font = "10px monospace"
      ctx.textAlign = "right"
      ctx.fillText(price.toFixed(4), padding - 10, y + 4)
    }

    // Order Block zone (candles 4-6)
    if (currentCandle >= 6) {
      ctx.fillStyle = "rgba(100, 255, 150, 0.1)"
      ctx.strokeStyle = "rgba(100, 255, 150, 0.4)"
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])

      const obLow = 1.078
      const obHigh = 1.083
      const obY1 = padding + height - ((obHigh - minPrice) / priceRange) * height
      const obY2 = padding + height - ((obLow - minPrice) / priceRange) * height

      ctx.fillRect(padding, obY1, width, obY2 - obY1)
      ctx.strokeRect(padding, obY1, width, obY2 - obY1)

      ctx.setLineDash([])
      ctx.fillStyle = "rgba(100, 255, 150, 1)"
      ctx.font = "bold 11px monospace"
      ctx.textAlign = "left"
      ctx.fillText("ORDER BLOCK", padding + 10, obY1 + 15)
    }

    // FVG zone (candles 13-15)
    if (currentCandle >= 15) {
      ctx.fillStyle = "rgba(150, 150, 255, 0.1)"
      ctx.strokeStyle = "rgba(150, 150, 255, 0.4)"
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])

      const fvgLow = 1.088
      const fvgHigh = 1.093
      const fvgY1 = padding + height - ((fvgHigh - minPrice) / priceRange) * height
      const fvgY2 = padding + height - ((fvgLow - minPrice) / priceRange) * height

      ctx.fillRect(padding, fvgY1, width, fvgY2 - fvgY1)
      ctx.strokeRect(padding, fvgY1, width, fvgY2 - fvgY1)

      ctx.setLineDash([])
      ctx.fillStyle = "rgba(150, 150, 255, 1)"
      ctx.font = "bold 11px monospace"
      ctx.textAlign = "left"
      ctx.fillText("FAIR VALUE GAP", padding + 10, fvgY1 + 15)
    }

    // Draw candles
    visibleCandles.forEach((candle, index) => {
      const candleWidth = Math.min(width / candles.length - 2, 12)
      const x = padding + (width / candles.length) * index + (width / candles.length - candleWidth) / 2

      const openY = padding + height - ((candle.open - minPrice) / priceRange) * height
      const closeY = padding + height - ((candle.close - minPrice) / priceRange) * height
      const highY = padding + height - ((candle.high - minPrice) / priceRange) * height
      const lowY = padding + height - ((candle.low - minPrice) / priceRange) * height

      const isBullish = candle.close > candle.open

      // Wick
      ctx.strokeStyle = isBullish ? "rgba(100, 255, 150, 0.8)" : "rgba(255, 100, 100, 0.8)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x + candleWidth / 2, highY)
      ctx.lineTo(x + candleWidth / 2, lowY)
      ctx.stroke()

      // Body
      ctx.fillStyle = isBullish ? "rgba(100, 255, 150, 0.9)" : "rgba(255, 100, 100, 0.9)"
      ctx.fillRect(x, Math.min(openY, closeY), candleWidth, Math.abs(closeY - openY) || 1)
    })

    // Draw entry arrow if current candle >= 16
    if (currentCandle >= 16) {
      const entryIndex = 16
      const entryCandle = candles[entryIndex]
      const x = padding + (width / candles.length) * entryIndex + width / candles.length / 2

      const entryY = padding + height - ((entryCandle.close - minPrice) / priceRange) * height

      // Arrow
      ctx.fillStyle = "rgba(100, 255, 150, 1)"
      ctx.beginPath()
      ctx.moveTo(x, entryY - 30)
      ctx.lineTo(x - 6, entryY - 20)
      ctx.lineTo(x + 6, entryY - 20)
      ctx.closePath()
      ctx.fill()

      ctx.strokeStyle = "rgba(100, 255, 150, 1)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x, entryY - 20)
      ctx.lineTo(x, entryY - 5)
      ctx.stroke()

      ctx.fillStyle = "rgba(100, 255, 150, 1)"
      ctx.font = "bold 10px monospace"
      ctx.textAlign = "center"
      ctx.fillText("ENTRY", x, entryY - 35)
    }
  }, [currentCandle])

  const handleReset = () => {
    setCurrentCandle(0)
    setIsPlaying(false)
  }

  return (
    <section className="container py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Live Trade Simulation</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Watch how the bot identifies order blocks and executes trades in real market conditions
          </p>
        </div>

        <Card className="border-primary/20 hover:border-primary/30 transition-all hover:shadow-2xl animate-scale-in">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl">EUR/USD - 15 Minute Chart</CardTitle>
                <CardDescription className="mt-2">Real-time smart money detection and execution</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="gap-2 hover:scale-105 transition-transform"
                  disabled={currentCandle >= candles.length - 1}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReset}
                  className="gap-2 bg-transparent hover:scale-105 transition-transform"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <canvas ref={canvasRef} className="w-full h-[450px] rounded-lg bg-card/50 border border-border" />

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border border-border bg-card hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <div className="text-sm text-muted-foreground mb-1">Current Candle</div>
                <div className="text-3xl font-bold">
                  {currentCandle + 1}/{candles.length}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <div className="text-sm text-muted-foreground mb-1">Pattern Detected</div>
                <div className="text-lg font-semibold text-accent">
                  {currentCandle >= 16 ? "OB + FVG" : currentCandle >= 6 ? "Building..." : "Scanning"}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <div className="text-sm text-muted-foreground mb-1">Trade Status</div>
                <Badge className={currentCandle >= 16 ? "bg-accent text-lg px-3 py-1" : "bg-muted text-lg px-3 py-1"}>
                  {currentCandle >= 16 ? "ENTERED" : "WAITING"}
                </Badge>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <div className="text-sm text-muted-foreground mb-1">Risk/Reward</div>
                <div className="text-3xl font-bold text-primary">1:3.5</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
