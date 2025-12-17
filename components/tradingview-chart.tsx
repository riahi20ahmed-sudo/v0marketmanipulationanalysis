"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Candle = {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  timestamp: number
}

interface TradingViewChartProps {
  candles: Candle[]
  currentPrice: number
  entryPrice?: number
  stopLoss?: number | null
  takeProfit?: number | null
  position?: "LONG" | "SHORT" | null
  isRunning: boolean
  symbol: string
  timeframe: string
}

export function TradingViewChart({
  candles,
  currentPrice,
  entryPrice,
  stopLoss,
  takeProfit,
  position,
  isRunning,
  symbol,
  timeframe,
}: TradingViewChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null)
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height

    // Clear canvas
    ctx.fillStyle = "hsl(var(--background))"
    ctx.fillRect(0, 0, width, height)

    if (candles.length === 0) return

    // Calculate price range
    const allPrices = candles.flatMap((c) => [c.high, c.low])
    if (stopLoss) allPrices.push(stopLoss)
    if (takeProfit) allPrices.push(takeProfit)
    if (entryPrice) allPrices.push(entryPrice)

    const maxPrice = Math.max(...allPrices)
    const minPrice = Math.min(...allPrices)
    const priceRange = maxPrice - minPrice
    const padding = priceRange * 0.1

    // Chart dimensions
    const chartPadding = { top: 20, right: 80, bottom: 40, left: 10 }
    const chartWidth = width - chartPadding.left - chartPadding.right
    const chartHeight = height - chartPadding.top - chartPadding.bottom

    // Volume chart height
    const volumeHeight = chartHeight * 0.2
    const priceChartHeight = chartHeight - volumeHeight - 10

    const priceToY = (price: number) => {
      return chartPadding.top + ((maxPrice + padding - price) / (priceRange + 2 * padding)) * priceChartHeight
    }

    // Draw grid lines
    ctx.strokeStyle = "hsl(var(--border))"
    ctx.lineWidth = 0.5
    const gridLines = 6
    for (let i = 0; i <= gridLines; i++) {
      const y = chartPadding.top + (priceChartHeight / gridLines) * i
      ctx.beginPath()
      ctx.moveTo(chartPadding.left, y)
      ctx.lineTo(width - chartPadding.right, y)
      ctx.stroke()

      // Price labels
      const price = maxPrice + padding - ((priceRange + 2 * padding) / gridLines) * i
      ctx.fillStyle = "hsl(var(--muted-foreground))"
      ctx.font = "11px monospace"
      ctx.textAlign = "left"
      ctx.fillText(price.toFixed(price < 1 ? 6 : 2), width - chartPadding.right + 5, y + 4)
    }

    // Draw time grid
    const timeSteps = Math.min(8, candles.length)
    const timeInterval = Math.floor(candles.length / timeSteps)
    for (let i = 0; i < timeSteps; i++) {
      const index = i * timeInterval
      if (index >= candles.length) continue
      const x = chartPadding.left + (index / candles.length) * chartWidth
      ctx.beginPath()
      ctx.moveTo(x, chartPadding.top)
      ctx.lineTo(x, height - chartPadding.bottom)
      ctx.stroke()

      ctx.fillStyle = "hsl(var(--muted-foreground))"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(candles[index].time, x, height - chartPadding.bottom + 15)
    }

    // Draw volume bars
    const maxVolume = Math.max(...candles.map((c) => c.volume))
    const volumeY = height - chartPadding.bottom
    candles.forEach((candle, index) => {
      const x = chartPadding.left + (index / candles.length) * chartWidth
      const candleWidth = chartWidth / candles.length
      const volumeBarHeight = (candle.volume / maxVolume) * volumeHeight

      ctx.fillStyle = candle.close >= candle.open ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"
      ctx.fillRect(x, volumeY - volumeBarHeight, candleWidth * 0.8, volumeBarHeight)
    })

    // Draw candlesticks
    candles.forEach((candle, index) => {
      const x = chartPadding.left + (index / candles.length) * chartWidth + chartWidth / candles.length / 2
      const candleWidth = Math.max(2, (chartWidth / candles.length) * 0.7)

      const isGreen = candle.close >= candle.open
      const color = isGreen ? "#10b981" : "#ef4444"

      // Draw wick
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, priceToY(candle.high))
      ctx.lineTo(x, priceToY(candle.low))
      ctx.stroke()

      // Draw body
      const bodyTop = priceToY(Math.max(candle.open, candle.close))
      const bodyBottom = priceToY(Math.min(candle.open, candle.close))
      const bodyHeight = Math.max(1, bodyBottom - bodyTop)

      ctx.fillStyle = color
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight)

      // Border for hollow candles
      if (isGreen && bodyHeight > 2) {
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.strokeRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight)
      }
    })

    // Draw price levels
    if (entryPrice && position) {
      const y = priceToY(entryPrice)
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.setLineDash([8, 4])
      ctx.beginPath()
      ctx.moveTo(chartPadding.left, y)
      ctx.lineTo(width - chartPadding.right, y)
      ctx.stroke()

      ctx.fillStyle = "#3b82f6"
      ctx.font = "12px monospace"
      ctx.textAlign = "right"
      ctx.fillText(`Entry: ${entryPrice.toFixed(2)}`, width - chartPadding.right - 5, y - 5)
    }

    if (stopLoss) {
      const y = priceToY(stopLoss)
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 2
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(chartPadding.left, y)
      ctx.lineTo(width - chartPadding.right, y)
      ctx.stroke()

      ctx.fillStyle = "#ef4444"
      ctx.font = "12px monospace"
      ctx.textAlign = "right"
      ctx.fillText(`SL: ${stopLoss.toFixed(2)}`, width - chartPadding.right - 5, y - 5)
    }

    if (takeProfit) {
      const y = priceToY(takeProfit)
      ctx.strokeStyle = "#10b981"
      ctx.lineWidth = 2
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(chartPadding.left, y)
      ctx.lineTo(width - chartPadding.right, y)
      ctx.stroke()

      ctx.fillStyle = "#10b981"
      ctx.font = "12px monospace"
      ctx.textAlign = "right"
      ctx.fillText(`TP: ${takeProfit.toFixed(2)}`, width - chartPadding.right - 5, y - 5)
    }

    // Draw current price line
    const currentY = priceToY(currentPrice)
    ctx.strokeStyle = "hsl(var(--primary))"
    ctx.lineWidth = 2
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.moveTo(chartPadding.left, currentY)
    ctx.lineTo(width - chartPadding.right, currentY)
    ctx.stroke()

    // Current price label
    ctx.fillStyle = "hsl(var(--primary))"
    ctx.fillRect(width - chartPadding.right + 2, currentY - 12, chartPadding.right - 4, 24)
    ctx.fillStyle = "hsl(var(--primary-foreground))"
    ctx.font = "bold 12px monospace"
    ctx.textAlign = "center"
    ctx.fillText(currentPrice.toFixed(2), width - chartPadding.right / 2, currentY + 4)

    // Draw crosshair
    if (mousePos) {
      ctx.strokeStyle = "hsl(var(--muted-foreground))"
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])

      // Vertical line
      ctx.beginPath()
      ctx.moveTo(mousePos.x, chartPadding.top)
      ctx.lineTo(mousePos.x, height - chartPadding.bottom)
      ctx.stroke()

      // Horizontal line
      ctx.beginPath()
      ctx.moveTo(chartPadding.left, mousePos.y)
      ctx.lineTo(width - chartPadding.right, mousePos.y)
      ctx.stroke()
    }
  }, [candles, currentPrice, entryPrice, stopLoss, takeProfit, position, mousePos])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePos({ x, y })

    // Find hovered candle
    const chartPadding = { left: 10, right: 80 }
    const chartWidth = rect.width - chartPadding.left - chartPadding.right
    const index = Math.floor(((x - chartPadding.left) / chartWidth) * candles.length)

    if (index >= 0 && index < candles.length) {
      setHoveredCandle(candles[index])
    }
  }

  const handleMouseLeave = () => {
    setMousePos(null)
    setHoveredCandle(null)
  }

  return (
    <Card className="border-primary/20 hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold font-mono">{symbol}</h3>
            <Badge variant="outline" className="font-mono">
              {timeframe}
            </Badge>
            <Badge variant={isRunning ? "default" : "secondary"} className={isRunning ? "animate-pulse" : ""}>
              {isRunning ? "LIVE" : "PAUSED"}
            </Badge>
          </div>
          {hoveredCandle && (
            <div className="flex items-center gap-4 text-xs font-mono">
              <span>O: {hoveredCandle.open.toFixed(2)}</span>
              <span>H: {hoveredCandle.high.toFixed(2)}</span>
              <span>L: {hoveredCandle.low.toFixed(2)}</span>
              <span className={hoveredCandle.close >= hoveredCandle.open ? "text-green-500" : "text-red-500"}>
                C: {hoveredCandle.close.toFixed(2)}
              </span>
            </div>
          )}
        </div>
        <div className="relative">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full rounded-lg border border-border cursor-crosshair"
            style={{ height: "500px" }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
