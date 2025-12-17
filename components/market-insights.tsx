"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"

interface MarketInsight {
  pair: string
  timeframe: string
  bias: "Bullish" | "Bearish" | "Neutral"
  strength: number
  keyLevels: {
    resistance: number[]
    support: number[]
  }
  patterns: string[]
  nextMove: string
  htfAlignment: boolean
  htfBias: string
}

export function MarketInsights() {
  const [insights, setInsights] = useState<MarketInsight[]>([
    {
      pair: "EUR/USD",
      timeframe: "H4",
      bias: "Bullish",
      strength: 85,
      keyLevels: {
        resistance: [1.105, 1.112],
        support: [1.092, 1.085],
      },
      patterns: ["Order Block Support", "FVG Fill", "Liquidity Grab Complete"],
      nextMove: "Expecting continuation to 1.105 resistance after minor pullback",
      htfAlignment: true,
      htfBias: "Daily/Weekly/Monthly all Bullish",
    },
    {
      pair: "GBP/USD",
      timeframe: "H1",
      bias: "Bearish",
      strength: 72,
      keyLevels: {
        resistance: [1.275, 1.282],
        support: [1.258, 1.252],
      },
      patterns: ["Break of Structure", "Premium Zone Rejection", "Bearish OB Active"],
      nextMove: "Target sweep of 1.258 lows before potential reversal",
      htfAlignment: true,
      htfBias: "Daily/Weekly Bearish trend",
    },
    {
      pair: "XAU/USD",
      timeframe: "H4",
      bias: "Bullish",
      strength: 91,
      keyLevels: {
        resistance: [2088, 2095],
        support: [2062, 2055],
      },
      patterns: ["Discount Array Entry", "HTF OB", "AMD Confirmation"],
      nextMove: "Strong buy momentum targeting 2088-2095 resistance zone",
      htfAlignment: true,
      htfBias: "Weekly/Daily strongly Bullish",
    },
  ])

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % insights.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [insights.length])

  return (
    <section className="container py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/20 text-primary-foreground border-primary/30">Live Analysis</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Smart Money Market Insights</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Real-time institutional analysis with HTF trend confirmation across major pairs
          </p>
        </div>

        <div className="grid gap-6">
          {insights.map((insight, index) => (
            <Card
              key={insight.pair}
              className={`transition-all duration-500 hover:shadow-xl hover:scale-[1.01] ${
                index === activeIndex ? "border-primary shadow-lg shadow-primary/20" : "border-border"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3 mb-2">
                      {insight.pair}
                      <Badge
                        variant="outline"
                        className={
                          insight.bias === "Bullish"
                            ? "border-accent text-accent"
                            : insight.bias === "Bearish"
                              ? "border-destructive text-destructive"
                              : "border-muted-foreground text-muted-foreground"
                        }
                      >
                        {insight.bias}
                      </Badge>
                      {insight.htfAlignment && (
                        <Badge variant="outline" className="border-primary text-primary">
                          ✓ HTF Aligned
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span>Timeframe: {insight.timeframe}</span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Strength: {insight.strength}%
                      </span>
                      <span className="text-xs bg-primary/10 px-2 py-1 rounded">{insight.htfBias}</span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      <Target className="h-3 w-3" />
                      High Probability
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      Key Resistance Levels
                    </h4>
                    <div className="space-y-2">
                      {insight.keyLevels.resistance.map((level, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded bg-destructive/5 border border-destructive/20"
                        >
                          <span className="text-sm text-muted-foreground">R{i + 1}</span>
                          <span className="font-mono font-semibold text-destructive">{level.toFixed(3)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Key Support Levels
                    </h4>
                    <div className="space-y-2">
                      {insight.keyLevels.support.map((level, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded bg-accent/5 border border-accent/20"
                        >
                          <span className="text-sm text-muted-foreground">S{i + 1}</span>
                          <span className="font-mono font-semibold text-accent">{level.toFixed(3)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <h4 className="text-sm font-semibold">Detected Patterns</h4>
                  <div className="flex flex-wrap gap-2">
                    {insight.patterns.map((pattern, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-xs hover:scale-105 transition-transform cursor-default"
                      >
                        {pattern}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="text-sm font-semibold mb-2 text-primary">Expected Price Action</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{insight.nextMove}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-lg border border-border bg-card text-center">
          <p className="text-sm text-muted-foreground">
            Analysis updates every 15 minutes • HTF alignment verified across Monthly/Weekly/Daily timeframes
          </p>
        </div>
      </div>
    </section>
  )
}
