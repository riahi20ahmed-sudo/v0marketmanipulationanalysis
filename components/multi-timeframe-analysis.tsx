"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, CheckCircle2, Clock } from "lucide-react"
import { useState, useEffect } from "react"

interface TimeframeAnalysis {
  timeframe: string
  trend: "Bullish" | "Bearish" | "Neutral"
  structure: string
  keyLevel: number
  confidence: number
  orderBlock: string
  liquidity: string
}

export function MultiTimeframeAnalysis() {
  const [selectedPair, setSelectedPair] = useState("EUR/USD")

  const timeframeData: Record<string, TimeframeAnalysis[]> = {
    "EUR/USD": [
      {
        timeframe: "Monthly",
        trend: "Bullish",
        structure: "Higher Highs & Higher Lows",
        keyLevel: 1.125,
        confidence: 95,
        orderBlock: "Bullish OB @ 1.085",
        liquidity: "BSL @ 1.128",
      },
      {
        timeframe: "Weekly",
        trend: "Bullish",
        structure: "Respecting HTF Trend",
        keyLevel: 1.112,
        confidence: 88,
        orderBlock: "Bullish OB @ 1.095",
        liquidity: "SSL swept @ 1.089",
      },
      {
        timeframe: "Daily",
        trend: "Bullish",
        structure: "Break of Structure Confirmed",
        keyLevel: 1.105,
        confidence: 82,
        orderBlock: "Fresh Bullish OB @ 1.098",
        liquidity: "Target BSL @ 1.108",
      },
      {
        timeframe: "4 Hour",
        trend: "Bullish",
        structure: "Retracement into Discount",
        keyLevel: 1.102,
        confidence: 78,
        orderBlock: "OB Zone 1.099-1.101",
        liquidity: "Minor SSL @ 1.097",
      },
      {
        timeframe: "1 Hour",
        trend: "Neutral",
        structure: "Consolidation Phase",
        keyLevel: 1.1,
        confidence: 65,
        orderBlock: "Waiting for entry",
        liquidity: "Equal lows forming",
      },
    ],
    "GBP/USD": [
      {
        timeframe: "Monthly",
        trend: "Bearish",
        structure: "Lower Highs & Lower Lows",
        keyLevel: 1.245,
        confidence: 92,
        orderBlock: "Bearish OB @ 1.285",
        liquidity: "SSL @ 1.242",
      },
      {
        timeframe: "Weekly",
        trend: "Bearish",
        structure: "Continuation Pattern",
        keyLevel: 1.258,
        confidence: 85,
        orderBlock: "Bearish OB @ 1.275",
        liquidity: "BSL swept @ 1.282",
      },
      {
        timeframe: "Daily",
        trend: "Bearish",
        structure: "Premium Zone Rejection",
        keyLevel: 1.268,
        confidence: 80,
        orderBlock: "Fresh Bearish OB @ 1.272",
        liquidity: "Target SSL @ 1.255",
      },
      {
        timeframe: "4 Hour",
        trend: "Bearish",
        structure: "Rally into Supply",
        keyLevel: 1.265,
        confidence: 75,
        orderBlock: "OB Zone 1.270-1.272",
        liquidity: "Minor BSL @ 1.273",
      },
      {
        timeframe: "1 Hour",
        trend: "Bearish",
        structure: "Short-term Downtrend",
        keyLevel: 1.262,
        confidence: 70,
        orderBlock: "Entry zone active",
        liquidity: "Equal highs above",
      },
    ],
  }

  const [data, setData] = useState(timeframeData[selectedPair])

  useEffect(() => {
    setData(timeframeData[selectedPair])
  }, [selectedPair])

  const getAlignmentScore = () => {
    const bullishCount = data.filter((d) => d.trend === "Bullish").length
    const bearishCount = data.filter((d) => d.trend === "Bearish").length
    const alignment = Math.max(bullishCount, bearishCount)
    return {
      score: (alignment / data.length) * 100,
      direction: bullishCount > bearishCount ? "Bullish" : bearishCount > bullishCount ? "Bearish" : "Mixed",
    }
  }

  const alignment = getAlignmentScore()

  return (
    <section className="container py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/20 text-primary-foreground border-primary/30">
            Multi-Timeframe Confluence
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Higher Timeframe Analysis</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Top-down analysis from Monthly to Hourly - The foundation of Smart Money trading
          </p>
        </div>

        {/* Pair Selector */}
        <div className="flex justify-center gap-4 mb-8">
          {Object.keys(timeframeData).map((pair) => (
            <button
              key={pair}
              onClick={() => setSelectedPair(pair)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedPair === pair
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-card border border-border hover:border-primary/50 hover:scale-102"
              }`}
            >
              {pair}
            </button>
          ))}
        </div>

        {/* Alignment Score */}
        <Card className="mb-8 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
                  {alignment.direction === "Bullish" ? (
                    <TrendingUp className="h-8 w-8 text-accent" />
                  ) : alignment.direction === "Bearish" ? (
                    <TrendingDown className="h-8 w-8 text-destructive" />
                  ) : (
                    <Minus className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{alignment.score.toFixed(0)}% Alignment</h3>
                  <p className="text-muted-foreground">
                    Overall Bias:{" "}
                    <span
                      className={`font-semibold ${
                        alignment.direction === "Bullish" ? "text-accent" : "text-destructive"
                      }`}
                    >
                      {alignment.direction}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {data.filter((d) => d.trend === "Bullish").length}
                  </div>
                  <div className="text-muted-foreground">Bullish TFs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">
                    {data.filter((d) => d.trend === "Bearish").length}
                  </div>
                  <div className="text-muted-foreground">Bearish TFs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {data.filter((d) => d.trend === "Neutral").length}
                  </div>
                  <div className="text-muted-foreground">Neutral TFs</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeframe Cards */}
        <div className="space-y-4">
          {data.map((tf, index) => (
            <Card
              key={tf.timeframe}
              className="border-l-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
              style={{
                borderLeftColor: tf.trend === "Bullish" ? "#10b981" : tf.trend === "Bearish" ? "#ef4444" : "#6b7280",
                animationDelay: `${index * 100}ms`,
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-xl">{tf.timeframe}</CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        tf.trend === "Bullish"
                          ? "border-accent text-accent"
                          : tf.trend === "Bearish"
                            ? "border-destructive text-destructive"
                            : "border-muted-foreground text-muted-foreground"
                      }
                    >
                      {tf.trend === "Bullish" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : tf.trend === "Bearish" ? (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      ) : (
                        <Minus className="h-3 w-3 mr-1" />
                      )}
                      {tf.trend}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Confidence</div>
                      <div className="text-lg font-bold">{tf.confidence}%</div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${tf.confidence >= 80 ? "bg-accent" : "bg-yellow-500"}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Market Structure</div>
                    <div className="text-sm font-medium">{tf.structure}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Key Level</div>
                    <div className="text-sm font-mono font-bold">{tf.keyLevel.toFixed(3)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Order Block</div>
                    <div className="text-sm font-medium">{tf.orderBlock}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Liquidity</div>
                    <div className="text-sm font-medium">{tf.liquidity}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trading Rule */}
        <Card className="mt-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-amber-500" />
              HTF Trading Rule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              <strong>Only take trades that align with the Higher Timeframe trend.</strong> If Monthly, Weekly, and
              Daily are all Bullish, only look for BUY opportunities on lower timeframes. Wait for price to retrace into
              discount zones (below 50% equilibrium) on HTF order blocks or Fair Value Gaps before entering. This
              ensures you&apos;re trading WITH institutional flow, not against it.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
