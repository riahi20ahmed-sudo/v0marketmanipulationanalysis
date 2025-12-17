"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, TrendingUp, TrendingDown, RotateCcw, Activity, Target, Zap } from "lucide-react"
import { ASSETS, type Asset } from "@/components/asset-selector"
import { TradingViewChart } from "@/components/tradingview-chart"

type Trade = {
  id: number
  type: "BUY" | "SELL"
  entry: number
  exit: number
  pnl: number
  timestamp: Date
  asset: string
}

type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d"

type Candle = {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  timestamp: number
}

interface TradingSimulatorProps {
  selectedAsset?: Asset
}

export function TradingSimulator({ selectedAsset: parentSelectedAsset }: TradingSimulatorProps) {
  const cryptoAssets = ASSETS.filter((a) => a.category === "crypto")
  const [selectedAsset, setSelectedAsset] = useState<Asset>(parentSelectedAsset || cryptoAssets[0])
  const [balance, setBalance] = useState(10000)
  const [position, setPosition] = useState<"LONG" | "SHORT" | null>(null)
  const [entryPrice, setEntryPrice] = useState(0)
  const [stopLoss, setStopLoss] = useState<number | null>(null)
  const [takeProfit, setTakeProfit] = useState<number | null>(null)
  const [trades, setTrades] = useState<Trade[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [timeframe, setTimeframe] = useState<Timeframe>("5m")
  const [candles, setCandles] = useState<Candle[]>([])
  const [currentCandle, setCurrentCandle] = useState<Candle | null>(null)

  useEffect(() => {
    if (parentSelectedAsset) {
      setSelectedAsset(parentSelectedAsset)
    }
  }, [parentSelectedAsset])

  useEffect(() => {
    const initialPrice = selectedAsset.price
    const initialCandles: Candle[] = []

    // Generate 50 historical candles
    for (let i = 49; i >= 0; i--) {
      const timestamp = Date.now() - i * 60000
      const basePrice = initialPrice * (1 + (Math.random() - 0.5) * 0.1)
      const open = basePrice
      const close = basePrice * (1 + (Math.random() - 0.5) * 0.02)
      const high = Math.max(open, close) * (1 + Math.random() * 0.015)
      const low = Math.min(open, close) * (1 - Math.random() * 0.015)
      const volume = Math.random() * 1000000 + 500000

      initialCandles.push({
        time: new Date(timestamp).toLocaleTimeString(),
        open,
        high,
        low,
        close,
        volume,
        timestamp,
      })
    }

    setCandles(initialCandles)
    setCurrentCandle(initialCandles[initialCandles.length - 1])
  }, [selectedAsset])

  useEffect(() => {
    if (!isRunning) return

    const intervals: Record<Timeframe, number> = {
      "1m": 1000,
      "5m": 2000,
      "15m": 3000,
      "1h": 5000,
      "4h": 8000,
      "1d": 10000,
    }

    const volatilityMultipliers: Record<Timeframe, number> = {
      "1m": 0.0005,
      "5m": 0.001,
      "15m": 0.0015,
      "1h": 0.002,
      "4h": 0.003,
      "1d": 0.005,
    }

    const interval = setInterval(() => {
      setCandles((prevCandles) => {
        const lastCandle = prevCandles[prevCandles.length - 1]
        const volatility = volatilityMultipliers[timeframe]

        const newClose = lastCandle.close * (1 + (Math.random() - 0.48) * volatility)
        const newHigh = Math.max(lastCandle.close, newClose) * (1 + Math.random() * volatility * 0.5)
        const newLow = Math.min(lastCandle.close, newClose) * (1 - Math.random() * volatility * 0.5)
        const newVolume = Math.random() * 1000000 + 500000

        const newCandle: Candle = {
          time: new Date().toLocaleTimeString(),
          open: lastCandle.close,
          high: newHigh,
          low: newLow,
          close: newClose,
          volume: newVolume,
          timestamp: Date.now(),
        }

        setCurrentCandle(newCandle)

        if (position && stopLoss && takeProfit) {
          if (position === "LONG") {
            if (newLow <= stopLoss) {
              closePositionAtPrice(stopLoss, "Stop Loss Hit")
            } else if (newHigh >= takeProfit) {
              closePositionAtPrice(takeProfit, "Take Profit Hit")
            }
          } else if (position === "SHORT") {
            if (newHigh >= stopLoss) {
              closePositionAtPrice(stopLoss, "Stop Loss Hit")
            } else if (newLow <= takeProfit) {
              closePositionAtPrice(takeProfit, "Take Profit Hit")
            }
          }
        }

        const updatedCandles = [...prevCandles.slice(-49), newCandle]
        return updatedCandles
      })
    }, intervals[timeframe])

    return () => clearInterval(interval)
  }, [isRunning, timeframe, position, stopLoss, takeProfit])

  const openPosition = (type: "LONG" | "SHORT") => {
    if (position || !currentCandle) return

    setPosition(type)
    setEntryPrice(currentCandle.close)

    const slDistance = currentCandle.close * 0.02 // 2% stop loss
    const tpDistance = currentCandle.close * 0.06 // 6% take profit (1:3 risk/reward)

    if (type === "LONG") {
      setStopLoss(currentCandle.close - slDistance)
      setTakeProfit(currentCandle.close + tpDistance)
    } else {
      setStopLoss(currentCandle.close + slDistance)
      setTakeProfit(currentCandle.close - tpDistance)
    }
  }

  const closePositionAtPrice = (exitPrice: number, reason?: string) => {
    if (!position) return

    const multiplier = selectedAsset.category === "crypto" ? 1 : 10000
    const pnl = position === "LONG" ? (exitPrice - entryPrice) * multiplier : (entryPrice - exitPrice) * multiplier

    setBalance((prev) => prev + pnl)

    const newTrade: Trade = {
      id: Date.now(),
      type: position === "LONG" ? "BUY" : "SELL",
      entry: entryPrice,
      exit: exitPrice,
      pnl,
      timestamp: new Date(),
      asset: selectedAsset.symbol,
    }

    setTrades((prev) => [newTrade, ...prev].slice(0, 15))
    setPosition(null)
    setEntryPrice(0)
    setStopLoss(null)
    setTakeProfit(null)
  }

  const closePosition = () => {
    if (!position || !currentCandle) return
    closePositionAtPrice(currentCandle.close)
  }

  const reset = () => {
    setBalance(10000)
    setPosition(null)
    setEntryPrice(0)
    setStopLoss(null)
    setTakeProfit(null)
    setTrades([])
    setIsRunning(false)

    const initialPrice = selectedAsset.price
    const initialCandles: Candle[] = []

    for (let i = 49; i >= 0; i--) {
      const timestamp = Date.now() - i * 60000
      const basePrice = initialPrice * (1 + (Math.random() - 0.5) * 0.1)
      const open = basePrice
      const close = basePrice * (1 + (Math.random() - 0.5) * 0.02)
      const high = Math.max(open, close) * (1 + Math.random() * 0.015)
      const low = Math.min(open, close) * (1 - Math.random() * 0.015)
      const volume = Math.random() * 1000000 + 500000

      initialCandles.push({
        time: new Date(timestamp).toLocaleTimeString(),
        open,
        high,
        low,
        close,
        volume,
        timestamp,
      })
    }

    setCandles(initialCandles)
    setCurrentCandle(initialCandles[initialCandles.length - 1])
  }

  const currentPrice = currentCandle?.close || selectedAsset.price

  const currentPnL =
    position && entryPrice
      ? position === "LONG"
        ? (currentPrice - entryPrice) * (selectedAsset.category === "crypto" ? 1 : 10000)
        : (entryPrice - currentPrice) * (selectedAsset.category === "crypto" ? 1 : 10000)
      : 0

  const winRate = trades.length > 0 ? ((trades.filter((t) => t.pnl > 0).length / trades.length) * 100).toFixed(0) : "0"
  const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0)
  const avgWin =
    trades.filter((t) => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) / (trades.filter((t) => t.pnl > 0).length || 1)
  const avgLoss = Math.abs(
    trades.filter((t) => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0) / (trades.filter((t) => t.pnl < 0).length || 1),
  )

  const timeframes: { value: Timeframe; label: string }[] = [
    { value: "1m", label: "1M" },
    { value: "5m", label: "5M" },
    { value: "15m", label: "15M" },
    { value: "1h", label: "1H" },
    { value: "4h", label: "4H" },
    { value: "1d", label: "1D" },
  ]

  return (
    <section className="container py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Advanced Trading Simulator</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Practice SMC concepts with realistic candlestick charts, stop loss, take profit, and real-time price action
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="border-primary/20 hover:border-primary/30 transition-all">
            <CardHeader>
              <CardTitle className="text-lg">Select Asset</CardTitle>
              <CardDescription>Choose from {cryptoAssets.length} crypto pairs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-2">
                {cryptoAssets.slice(0, 30).map((asset) => (
                  <Button
                    key={asset.symbol}
                    variant={selectedAsset.symbol === asset.symbol ? "default" : "outline"}
                    onClick={() => setSelectedAsset(asset)}
                    className="justify-start text-xs h-auto py-2"
                    size="sm"
                  >
                    <span className="truncate">{asset.symbol}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/30 transition-all">
            <CardHeader>
              <CardTitle className="text-lg">Select Timeframe</CardTitle>
              <CardDescription>Different speeds and volatility patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {timeframes.map((tf) => (
                  <Button
                    key={tf.value}
                    variant={timeframe === tf.value ? "default" : "outline"}
                    onClick={() => setTimeframe(tf.value)}
                    size="sm"
                  >
                    {tf.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TradingViewChart
              candles={candles}
              currentPrice={currentPrice}
              entryPrice={position ? entryPrice : undefined}
              stopLoss={stopLoss}
              takeProfit={takeProfit}
              position={position}
              isRunning={isRunning}
              symbol={selectedAsset.symbol}
              timeframe={timeframe}
            />

            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold mb-4 font-mono tracking-tight">
                $
                {currentPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                })}
              </div>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Badge variant={balance >= 10000 ? "default" : "destructive"} className="text-base px-4 py-2">
                  Balance: ${balance.toFixed(2)}
                </Badge>
                {position && (
                  <>
                    <Badge
                      variant={currentPnL >= 0 ? "default" : "destructive"}
                      className="text-base px-4 py-2 animate-pulse"
                    >
                      P&L: {currentPnL >= 0 ? "+" : ""}${currentPnL.toFixed(2)}
                    </Badge>
                    <Badge variant="outline" className="text-sm px-3 py-1.5">
                      SL: ${stopLoss?.toFixed(2)}
                    </Badge>
                    <Badge variant="outline" className="text-sm px-3 py-1.5">
                      TP: ${takeProfit?.toFixed(2)}
                    </Badge>
                  </>
                )}
                {trades.length > 0 && (
                  <>
                    <Badge variant="outline" className="text-base px-4 py-2">
                      Win Rate: {winRate}%
                    </Badge>
                    <Badge variant={totalPnL >= 0 ? "default" : "destructive"} className="text-base px-4 py-2">
                      Total: {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
                    </Badge>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              {!isRunning ? (
                <Button onClick={() => setIsRunning(true)} size="lg" className="gap-2 text-base px-6">
                  <Play className="h-5 w-5" />
                  Start Simulation
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => setIsRunning(false)}
                    size="lg"
                    variant="outline"
                    className="gap-2 text-base px-6"
                  >
                    <Pause className="h-5 w-5" />
                    Pause
                  </Button>
                  {!position ? (
                    <>
                      <Button
                        onClick={() => openPosition("LONG")}
                        size="lg"
                        className="gap-2 bg-accent hover:bg-accent/90 text-base px-6"
                      >
                        <TrendingUp className="h-5 w-5" />
                        Buy Long
                      </Button>
                      <Button
                        onClick={() => openPosition("SHORT")}
                        size="lg"
                        variant="destructive"
                        className="gap-2 text-base px-6"
                      >
                        <TrendingDown className="h-5 w-5" />
                        Sell Short
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={closePosition}
                      size="lg"
                      variant="outline"
                      className="gap-2 bg-transparent text-base px-6 hover:scale-105 transition-transform"
                    >
                      <Target className="h-5 w-5" />
                      Close {position}
                    </Button>
                  )}
                  <Button onClick={reset} size="lg" variant="outline" className="gap-2 bg-transparent text-base px-6">
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </>
              )}
            </div>

            {position && (
              <Card
                className={`border-2 ${currentPnL >= 0 ? "border-accent bg-accent/5" : "border-destructive bg-destructive/5"} animate-scale-in`}
              >
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Position</div>
                      <div className="text-lg font-bold flex items-center justify-center gap-1">
                        {position === "LONG" ? (
                          <TrendingUp className="h-4 w-4 text-accent" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        {position}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Entry</div>
                      <div className="text-lg font-bold font-mono">${entryPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Stop Loss</div>
                      <div className="text-lg font-bold font-mono text-destructive">${stopLoss?.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Take Profit</div>
                      <div className="text-lg font-bold font-mono text-accent">${takeProfit?.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Current P&L</div>
                      <div className={`text-lg font-bold ${currentPnL >= 0 ? "text-accent" : "text-destructive"}`}>
                        {currentPnL >= 0 ? "+" : ""}${currentPnL.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="animate-slide-in-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50">
                    <span className="text-sm text-muted-foreground">Win Rate</span>
                    <span className="text-lg font-bold">{winRate}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50">
                    <span className="text-sm text-muted-foreground">Total Trades</span>
                    <span className="text-lg font-bold">{trades.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50">
                    <span className="text-sm text-muted-foreground">Avg Win</span>
                    <span className="text-lg font-bold text-accent">${avgWin.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50">
                    <span className="text-sm text-muted-foreground">Avg Loss</span>
                    <span className="text-lg font-bold text-destructive">${avgLoss.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-primary/30 bg-primary/5">
                    <span className="text-sm font-medium">Total P&L</span>
                    <span className={`text-xl font-bold ${totalPnL >= 0 ? "text-accent" : "text-destructive"}`}>
                      {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-right">
              <CardHeader>
                <CardTitle>Trade History</CardTitle>
                <CardDescription>Last 15 closed positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {trades.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No trades yet. Start trading!</p>
                  ) : (
                    trades.map((trade, index) => (
                      <div
                        key={trade.id}
                        className="p-3 rounded-lg border border-border bg-background hover:border-primary/50 transition-all duration-200 hover:shadow-lg cursor-pointer group animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={trade.type === "BUY" ? "default" : "destructive"}>{trade.type}</Badge>
                            <span className="text-xs text-muted-foreground">{trade.asset}</span>
                          </div>
                          <span
                            className={`text-sm font-bold ${trade.pnl >= 0 ? "text-accent" : "text-destructive"} group-hover:scale-110 transition-transform`}
                          >
                            {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex justify-between">
                            <span>Entry:</span>
                            <span className="font-mono">${trade.entry.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Exit:</span>
                            <span className="font-mono">${trade.exit.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time:</span>
                            <span>{trade.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
