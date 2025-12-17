"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"

interface Signal {
  id: string
  pair: string
  type: "BUY" | "SELL"
  entry: number
  sl: number
  tp: number
  reason: string
  timeframe: string
  timestamp: Date
  status: "active" | "pending" | "closed"
  pnl?: number
}

export function LiveSignals() {
  const [signals, setSignals] = useState<Signal[]>([
    {
      id: "1",
      pair: "EUR/USD",
      type: "BUY",
      entry: 1.0875,
      sl: 1.0845,
      tp: 1.098,
      reason: "OB + FVG + Liquidity Sweep",
      timeframe: "15M",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: "active",
      pnl: 45.2,
    },
    {
      id: "2",
      pair: "GBP/JPY",
      type: "SELL",
      entry: 189.45,
      sl: 189.85,
      tp: 188.15,
      reason: "Premium Zone + BOS",
      timeframe: "1H",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      status: "pending",
    },
    {
      id: "3",
      pair: "XAU/USD",
      type: "BUY",
      entry: 2045.3,
      sl: 2038.5,
      tp: 2068.2,
      reason: "HTF OB + Kill Zone Entry",
      timeframe: "4H",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      status: "closed",
      pnl: 228.5,
    },
  ])

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())

      setSignals((prev) =>
        prev.map((signal) => {
          if (signal.status === "active" && signal.pnl !== undefined) {
            const change = (Math.random() - 0.5) * 5
            return { ...signal, pnl: Number.parseFloat((signal.pnl + change).toFixed(2)) }
          }
          return signal
        }),
      )
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((currentTime.getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <section className="container py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent/20 text-accent-foreground border-accent/30 animate-pulse">Live Demo</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Real-Time Signal Feed</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Watch the bot identify and execute high-probability smart money setups in real-time
          </p>
        </div>

        <div className="grid gap-4">
          {signals.map((signal) => (
            <Card
              key={signal.id}
              className={`border-l-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                signal.type === "BUY"
                  ? "border-l-accent hover:border-l-accent/80"
                  : "border-l-destructive hover:border-l-destructive/80"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {signal.type === "BUY" ? (
                      <div className="rounded-full bg-accent/10 p-2 group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-5 w-5 text-accent" />
                      </div>
                    ) : (
                      <div className="rounded-full bg-destructive/10 p-2 group-hover:scale-110 transition-transform">
                        <TrendingDown className="h-5 w-5 text-destructive" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {signal.pair}
                        <Badge
                          variant={signal.type === "BUY" ? "default" : "destructive"}
                          className={signal.type === "BUY" ? "bg-accent" : ""}
                        >
                          {signal.type}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" />
                        {getTimeAgo(signal.timestamp)} • {signal.timeframe}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`transition-all ${
                        signal.status === "active"
                          ? "border-accent text-accent animate-pulse"
                          : signal.status === "pending"
                            ? "border-primary text-primary"
                            : "border-muted-foreground text-muted-foreground"
                      }`}
                    >
                      {signal.status.toUpperCase()}
                    </Badge>
                    {signal.pnl && (
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-medium transition-all ${
                          signal.pnl > 0 ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        <DollarSign className="h-3 w-3" />
                        {signal.pnl > 0 ? "+" : ""}
                        {signal.pnl}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground mb-1">Entry</span>
                    <span className="font-mono font-semibold">{signal.entry}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground mb-1">Stop Loss</span>
                    <span className="font-mono font-semibold text-destructive">{signal.sl}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground mb-1">Take Profit</span>
                    <span className="font-mono font-semibold text-accent">{signal.tp}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground mb-1">R:R Ratio</span>
                    <span className="font-mono font-semibold">
                      1:{((signal.tp - signal.entry) / Math.abs(signal.entry - signal.sl)).toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <span className="text-xs text-muted-foreground">Setup Confluence:</span>
                  <p className="text-sm font-medium mt-1">{signal.reason}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            This is a simulated feed for demonstration. Real implementation connects to TradingView webhooks or broker
            APIs.
          </p>
        </div>
      </div>
    </section>
  )
}
