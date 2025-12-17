"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Target,
  Layers,
  BarChart3,
  Activity,
  Zap,
  Shield,
  Brain,
  Sparkles,
  Crosshair,
  Compass,
  Lock,
  Shuffle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  ComposedChart,
} from "recharts"
import { AssetSelector, type Asset, ASSETS } from "@/components/asset-selector"
import { type Language, translations } from "@/lib/translations"

const TRADING_STRATEGIES = [
  {
    id: "smc",
    name: "Smart Money Concepts",
    description: "BOS, CHoCH, Order Blocks",
    icon: Target,
    color: "from-purple-500/20 to-purple-500/5 border-purple-500/40",
    iconColor: "text-purple-500",
    winRate: 75,
  },
  {
    id: "momentum",
    name: "Momentum Trading",
    description: "RSI + MACD signals",
    icon: Zap,
    color: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/40",
    iconColor: "text-yellow-500",
    winRate: 68,
  },
  {
    id: "breakout",
    name: "Breakout Strategy",
    description: "Support/Resistance breaks",
    icon: TrendingUp,
    color: "from-green-500/20 to-green-500/5 border-green-500/40",
    iconColor: "text-green-500",
    winRate: 71,
  },
  {
    id: "meanreversion",
    name: "Mean Reversion",
    description: "Bollinger Bands",
    icon: TrendingDown,
    color: "from-blue-500/20 to-blue-500/5 border-blue-500/40",
    iconColor: "text-blue-500",
    winRate: 73,
  },
  {
    id: "volumespread",
    name: "Volume Spread Analysis",
    description: "VSA + Wyckoff Method",
    icon: BarChart3,
    color: "from-orange-500/20 to-orange-500/5 border-orange-500/40",
    iconColor: "text-orange-500",
    winRate: 78,
  },
  {
    id: "icttimezone",
    name: "ICT Kill Zones",
    description: "London/NY Session Trading",
    icon: Crosshair,
    color: "from-red-500/20 to-red-500/5 border-red-500/40",
    iconColor: "text-red-500",
    winRate: 82,
  },
  {
    id: "instituorder",
    name: "Institutional Order Flow",
    description: "CVD + Delta Analysis",
    icon: Shield,
    color: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/40",
    iconColor: "text-indigo-500",
    winRate: 79,
  },
  {
    id: "marketmaker",
    name: "Market Maker Model",
    description: "Accumulation/Distribution",
    icon: Compass,
    color: "from-pink-500/20 to-pink-500/5 border-pink-500/40",
    iconColor: "text-pink-500",
    winRate: 76,
  },
  {
    id: "aiml",
    name: "AI/ML Pattern Recognition",
    description: "Neural Network Predictions",
    icon: Brain,
    color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/40",
    iconColor: "text-cyan-500",
    winRate: 84,
  },
  {
    id: "multitimeframe",
    name: "Multi-Timeframe Confluence",
    description: "HTF + LTF Alignment",
    icon: Layers,
    color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/40",
    iconColor: "text-emerald-500",
    winRate: 81,
  },
  {
    id: "arbitrage",
    name: "Statistical Arbitrage",
    description: "Pair Trading + Correlation",
    icon: Shuffle,
    color: "from-violet-500/20 to-violet-500/5 border-violet-500/40",
    iconColor: "text-violet-500",
    winRate: 77,
  },
  {
    id: "darkpool",
    name: "Dark Pool Indicator",
    description: "Hidden Liquidity Detection",
    icon: Lock,
    color: "from-slate-500/20 to-slate-500/5 border-slate-500/40",
    iconColor: "text-slate-500",
    winRate: 80,
  },
]

interface MarketAnalysisProps {
  selectedAsset: string
  language: Language
}

export function AdvancedMarketAnalysis({ selectedAsset: initialAsset, language }: MarketAnalysisProps) {
  const [activeTab, setActiveTab] = useState("liquidity")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset>() // Changed to undefined
  const [selectedStrategy, setSelectedStrategy] = useState(TRADING_STRATEGIES[0])
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiInsight, setAiInsight] = useState("")

  const t = translations[language]

  const handleAssetChange = (asset: Asset) => {
    setSelectedAsset(asset)
    console.log("[v0] Analysis asset changed to:", asset.symbol)
  }

  const handleStrategyChange = (strategyId: string) => {
    const strategy = TRADING_STRATEGIES.find((s) => s.id === strategyId)
    if (strategy) {
      setSelectedStrategy(strategy)
      console.log("[v0] Strategy changed to:", strategy.name)
    }
  }

  const generateAIAnalysis = async () => {
    setAiGenerating(true)
    setAiInsight("")

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const insights = [
      `Strong bullish momentum detected on ${selectedAsset?.symbol || initialAsset}. AI predicts 78% probability of upward continuation based on historical pattern matching.`,
      `Market structure shows institutional accumulation. Neural network identifies similar patterns from 12 previous bull runs with 84% success rate.`,
      `Volume profile suggests strong support at current levels. AI recommends long positions with tight stop loss for optimal risk-reward.`,
      `Order flow imbalance indicates smart money positioning. Machine learning model forecasts breakout within next 4-8 hours.`,
      `HTF trend alignment confirmed across all timeframes. AI confidence score: 91% for continuation pattern.`,
    ]

    const randomInsight = insights[Math.floor(Math.random() * insights.length)]
    setAiInsight(randomInsight)
    setAiGenerating(false)
  }

  const basePrice = selectedAsset?.price || ASSETS.find((a) => a.symbol === initialAsset)?.price || 100 // Fallback price

  const liquidityData = Array.from({ length: 30 }, (_, i) => {
    const priceOffset = (i - 15) * 0.002 // 0.2% spacing between levels
    const price = basePrice * (1 + priceOffset)
    const distanceFromCenter = Math.abs(i - 15)
    const type = i < 10 ? "buy" : i > 20 ? "sell" : "neutral"
    // Create stronger clusters at key levels
    const clusterBonus = distanceFromCenter % 5 === 0 ? 800 : 0
    const liquidity = Math.abs(Math.sin(i * 0.6)) * 1500 + 500 + Math.random() * 400 + clusterBonus

    return {
      price: price.toFixed(price < 10 ? 4 : 2),
      liquidity: Math.round(liquidity),
      type,
      label: `${(priceOffset * 100).toFixed(2)}%`,
    }
  })

  const orderFlowData = Array.from({ length: 30 }, (_, i) => {
    const hour = i.toString().padStart(2, "0") + ":00"
    const trend = Math.sin(i * 0.3) // Creating trending patterns
    const buyVolume = Math.round(1200 + Math.random() * 1800 + trend * 600)
    const sellVolume = Math.round(1000 + Math.random() * 1500 - trend * 400)
    const imbalance = buyVolume - sellVolume

    return {
      time: hour,
      buyVolume,
      sellVolume,
      imbalance,
      delta: imbalance,
      cumulativeDelta: 0, // Will be calculated
    }
  })

  // Calculate cumulative delta
  let cumDelta = 0
  orderFlowData.forEach((d) => {
    cumDelta += d.delta
    d.cumulativeDelta = cumDelta
  })

  const marketStructureData = Array.from({ length: 16 }, (_, i) => {
    const weekNum = i + 1
    // Create a realistic uptrend with retracements
    const trendBase = i * 0.012
    const swing = Math.sin(i * 0.9) * 0.018
    const price = basePrice * (0.92 + trendBase + swing)

    let structure = "HL"
    // Mark significant Break of Structure points
    if (i === 5 || i === 11) structure = "BOS"
    else if (i % 2 === 0 && i > 5) structure = "HH"
    else if (i % 2 === 1 && i > 5) structure = "HL"
    else if (i < 5 && i % 2 === 0) structure = "LH"
    else if (i < 5 && i % 2 === 1) structure = "LL"

    const strength = structure === "BOS" ? 90 : 65 + Math.random() * 25

    return {
      time: `W${weekNum}`,
      price: Number.parseFloat(price.toFixed(price < 10 ? 4 : 2)),
      structure,
      strength: Math.round(strength),
      high: price * 1.018,
      low: price * 0.982,
    }
  })

  const volumeProfileData = Array.from({ length: 35 }, (_, i) => {
    const priceOffset = (i - 17) * 0.0015
    const price = basePrice * (1 + priceOffset)
    // Create gaussian distribution for volume
    const distanceFromPOC = Math.abs(i - 17)
    const volume = Math.round(3000 + Math.exp(-Math.pow(distanceFromPOC, 2) / 40) * 8000 + Math.random() * 800)
    const poc = i === 17 // Point of Control at center

    return {
      price: price.toFixed(price < 10 ? 4 : 2),
      volume,
      poc,
      valueArea: Math.abs(i - 17) <= 7, // 70% value area
    }
  })

  const maxVolume = Math.max(...volumeProfileData.map((d) => d.volume))
  const pocData = volumeProfileData.find((d) => d.poc)

  const runAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => setIsAnalyzing(false), 2000)
  }

  // Calculate key levels
  const sellSideLiquidity = (basePrice * 1.015).toFixed(basePrice < 10 ? 4 : 2)
  const currentPrice = basePrice.toFixed(basePrice < 10 ? 4 : 2)
  const buySideLiquidity = (basePrice * 0.985).toFixed(basePrice < 10 ? 4 : 2)
  const pocPrice = pocData?.price || currentPrice
  const currentImbalance = orderFlowData[orderFlowData.length - 1]?.imbalance || 0
  const cumulativeDelta = orderFlowData[orderFlowData.length - 1]?.cumulativeDelta || 0

  return (
    <section className="py-20 bg-gradient-to-b from-background via-background/50 to-background">
      <div className="container">
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-1" variant="outline">
            <Activity className="h-3 w-3 mr-2" />
            {t.marketIntelligence}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            {t.realTimeAnalysis} {selectedAsset?.symbol || initialAsset}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            {selectedStrategy.name} - Win Rate: {selectedStrategy.winRate}%
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Select Asset</CardTitle>
            </CardHeader>
            <CardContent>
              <AssetSelector onAssetChange={handleAssetChange} compact />
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5" />
                {t.selectStrategy}
              </CardTitle>
              <CardDescription>{t.selectStrategyDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {TRADING_STRATEGIES.map((strategy) => {
                  const Icon = strategy.icon
                  const isSelected = selectedStrategy.id === strategy.id
                  return (
                    <Card
                      key={strategy.id}
                      className={`relative p-4 cursor-pointer transition-all hover:scale-105 hover:shadow-xl bg-gradient-to-br ${strategy.color} ${
                        isSelected ? "ring-2 ring-primary shadow-2xl scale-105" : ""
                      }`}
                      onClick={() => handleStrategyChange(strategy.id)}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2">
                          <Badge className="animate-pulse">{t.active}</Badge>
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg bg-background/40 backdrop-blur ${isSelected ? "ring-2 ring-primary" : ""}`}
                        >
                          <Icon className={`h-5 w-5 ${strategy.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm mb-1">{strategy.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{strategy.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {strategy.winRate}% Win Rate
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary animate-pulse" />
                {t.aiChartGenerator}
              </CardTitle>
              <CardDescription>Advanced AI-powered analysis using neural networks and machine learning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={generateAIAnalysis}
                disabled={aiGenerating}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {aiGenerating ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t.generateChart}
                  </>
                )}
              </Button>
              {aiInsight && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <p className="text-sm leading-relaxed">{aiInsight}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="max-w-6xl mx-auto mt-16">
          <Card className="border-primary/20 shadow-2xl bg-card/95 backdrop-blur">
            <CardHeader className="border-b border-border/50 bg-muted/30">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="text-2xl mb-2">Professional Market Analysis</CardTitle>
                  <CardDescription className="text-base">
                    <span className="font-bold text-primary text-lg">{selectedAsset?.symbol || initialAsset}</span> -{" "}
                    {selectedAsset?.name || ASSETS.find((a) => a.symbol === initialAsset)?.name || "Asset Name"}
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Current: </span>
                      <span className="font-mono font-bold text-xl text-foreground">
                        $
                        {Number(selectedAsset?.price || basePrice).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <Badge
                      variant={selectedAsset?.change > 0 ? "default" : "destructive"}
                      className="text-sm px-3 py-1"
                    >
                      {selectedAsset?.change > 0 ? "+" : ""}
                      {(selectedAsset?.change || 0).toFixed(2)}% 24h
                    </Badge>
                    <Badge variant="outline" className="text-sm px-3 py-1 gap-2">
                      <Layers className="h-3 w-3" />
                      Strategy: {selectedStrategy.name}
                    </Badge>
                  </div>
                </div>
                <Button onClick={runAnalysis} disabled={isAnalyzing} className="gap-2" size="lg">
                  <BarChart3 className="h-4 w-4" />
                  {isAnalyzing ? "Analyzing..." : "Run Deep Analysis"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-auto bg-muted/50">
                  <TabsTrigger
                    value="liquidity"
                    className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Target className="h-4 w-4" />
                    <span className="hidden sm:inline">Liquidity Zones</span>
                    <span className="sm:hidden">Liquidity</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="orderflow"
                    className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Activity className="h-4 w-4" />
                    <span className="hidden sm:inline">Order Flow</span>
                    <span className="sm:hidden">Flow</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="structure"
                    className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Market Structure</span>
                    <span className="sm:hidden">Structure</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="volume"
                    className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Volume Profile</span>
                    <span className="sm:hidden">Volume</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="liquidity" className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">Liquidity Heatmap</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          High-probability liquidity zones where stop losses cluster
                        </p>
                      </div>
                      <Badge variant="secondary" className="animate-pulse gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        Live Feed
                      </Badge>
                    </div>

                    <Card className="p-6 bg-gradient-to-br from-black/60 to-black/40 border-primary/20">
                      <ResponsiveContainer width="100%" height={600}>
                        <ComposedChart
                          data={liquidityData}
                          layout="vertical"
                          margin={{ left: 30, right: 50, top: 20, bottom: 20 }}
                        >
                          <defs>
                            <linearGradient id="buyLiq" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity={0.2} />
                              <stop offset="50%" stopColor="rgb(34, 197, 94)" stopOpacity={0.6} />
                              <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity={0.95} />
                            </linearGradient>
                            <linearGradient id="sellLiq" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity={0.2} />
                              <stop offset="50%" stopColor="rgb(239, 68, 68)" stopOpacity={0.6} />
                              <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity={0.95} />
                            </linearGradient>
                            <linearGradient id="neutralLiq" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="rgb(100, 116, 139)" stopOpacity={0.2} />
                              <stop offset="100%" stopColor="rgb(100, 116, 139)" stopOpacity={0.6} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.1)"
                            horizontal={true}
                            vertical={false}
                          />
                          <XAxis
                            type="number"
                            stroke="rgba(255,255,255,0.4)"
                            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                            label={{
                              value: "Liquidity Volume (Contracts)",
                              position: "bottom",
                              fill: "rgba(255,255,255,0.6)",
                              offset: 0,
                            }}
                          />
                          <YAxis
                            dataKey="price"
                            type="category"
                            width={100}
                            stroke="rgba(255,255,255,0.4)"
                            tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(20, 20, 30, 0.95)",
                              border: "1px solid rgba(100, 255, 150, 0.3)",
                              borderRadius: "8px",
                              padding: "12px",
                              backdropFilter: "blur(10px)",
                            }}
                            labelStyle={{ color: "rgb(255,255,255)", fontWeight: "bold", marginBottom: "8px" }}
                            formatter={(value: any, name: string) => [
                              `${value.toLocaleString()} contracts`,
                              name === "liquidity" ? "Volume" : name,
                            ]}
                            labelFormatter={(label) => `Price Level: $${label}`}
                          />
                          <Bar dataKey="liquidity" radius={[0, 6, 6, 0]} barSize={16}>
                            {liquidityData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  entry.type === "sell"
                                    ? "url(#sellLiq)"
                                    : entry.type === "buy"
                                      ? "url(#buyLiq)"
                                      : "url(#neutralLiq)"
                                }
                              />
                            ))}
                          </Bar>
                          <ReferenceLine
                            y={currentPrice}
                            stroke="rgb(59, 130, 246)"
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            label={{
                              value: `Current: $${currentPrice}`,
                              fill: "rgb(59, 130, 246)",
                              position: "right",
                              fontSize: 14,
                              fontWeight: "bold",
                            }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-6 bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/30 hover:scale-105 transition-all hover:shadow-xl hover:shadow-red-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-muted-foreground font-semibold">Sell-Side Liquidity</div>
                          <TrendingUp className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="text-3xl font-bold text-red-500 mb-1">${sellSideLiquidity}</div>
                        <div className="text-xs text-muted-foreground">+1.5% above current</div>
                        <div className="text-xs text-red-400 mt-2">⚠️ High probability reversal zone</div>
                      </Card>

                      <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30 hover:scale-105 transition-all hover:shadow-xl hover:shadow-blue-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-muted-foreground font-semibold">Current Price</div>
                          <Activity className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="text-3xl font-bold text-blue-500 mb-1">${currentPrice}</div>
                        <div className="text-xs text-muted-foreground">Fair value equilibrium</div>
                        <div className="text-xs text-blue-400 mt-2">📊 Active trading zone</div>
                      </Card>

                      <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30 hover:scale-105 transition-all hover:shadow-xl hover:shadow-green-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-muted-foreground font-semibold">Buy-Side Liquidity</div>
                          <Target className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="text-3xl font-bold text-green-500 mb-1">${buySideLiquidity}</div>
                        <div className="text-xs text-muted-foreground">-1.5% below current</div>
                        <div className="text-xs text-green-400 mt-2">💰 Buy zone accumulation target</div>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="orderflow" className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">Order Flow Imbalance</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Real-time buy/sell pressure revealing institutional positioning
                        </p>
                      </div>
                      <Badge variant="secondary" className="animate-pulse gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        Live Stream
                      </Badge>
                    </div>

                    <Card className="p-6 bg-gradient-to-br from-black/60 to-black/40 border-primary/20">
                      <ResponsiveContainer width="100%" height={600}>
                        <ComposedChart data={orderFlowData} margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
                          <defs>
                            <linearGradient id="buyVolGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity={0.9} />
                              <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity={0.3} />
                            </linearGradient>
                            <linearGradient id="sellVolGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity={0.9} />
                              <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity={0.3} />
                            </linearGradient>
                            <linearGradient id="deltaGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity={0.8} />
                              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity={0.2} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis
                            dataKey="time"
                            stroke="rgba(255,255,255,0.4)"
                            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
                            interval={3}
                            label={{
                              value: "Time (Hours)",
                              position: "bottom",
                              fill: "rgba(255,255,255,0.6)",
                              offset: 0,
                            }}
                          />
                          <YAxis
                            yAxisId="left"
                            stroke="rgba(255,255,255,0.4)"
                            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
                            label={{
                              value: "Volume",
                              angle: -90,
                              position: "insideLeft",
                              fill: "rgba(255,255,255,0.6)",
                            }}
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="rgba(255,255,255,0.4)"
                            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
                            label={{
                              value: "Cumulative Delta",
                              angle: 90,
                              position: "insideRight",
                              fill: "rgba(255,255,255,0.6)",
                            }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(20, 20, 30, 0.95)",
                              border: "1px solid rgba(100, 255, 150, 0.3)",
                              borderRadius: "8px",
                              padding: "12px",
                              backdropFilter: "blur(10px)",
                            }}
                            labelStyle={{ color: "rgb(255,255,255)", fontWeight: "bold" }}
                          />
                          <Legend
                            wrapperStyle={{
                              paddingTop: "20px",
                            }}
                            iconType="rect"
                          />
                          <Bar
                            yAxisId="left"
                            dataKey="buyVolume"
                            fill="url(#buyVolGradient)"
                            name="Buy Volume"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            yAxisId="left"
                            dataKey="sellVolume"
                            fill="url(#sellVolGradient)"
                            name="Sell Volume"
                            radius={[4, 4, 0, 0]}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="cumulativeDelta"
                            stroke="rgb(59, 130, 246)"
                            strokeWidth={3}
                            dot={{ fill: "rgb(59, 130, 246)", r: 4 }}
                            name="Cumulative Delta"
                          />
                          <ReferenceLine
                            yAxisId="right"
                            y={0}
                            stroke="rgba(255,255,255,0.3)"
                            strokeDasharray="3 3"
                            strokeWidth={2}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 hover:scale-105 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm text-muted-foreground font-semibold">Current Imbalance</div>
                          <Activity className="h-6 w-6 text-primary" />
                        </div>
                        <div
                          className={`text-4xl font-bold mb-2 ${currentImbalance > 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {currentImbalance > 0 ? "+" : ""}
                          {currentImbalance.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.abs(currentImbalance) > 500
                            ? "Strong"
                            : Math.abs(currentImbalance) > 200
                              ? "Moderate"
                              : "Weak"}{" "}
                          {currentImbalance > 0 ? "Buy" : "Sell"} Pressure
                        </div>
                        <div className="text-xs mt-3 text-primary">
                          {currentImbalance > 0 ? "📈 Bullish momentum" : "📉 Bearish momentum"}
                        </div>
                      </Card>

                      <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30 hover:scale-105 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm text-muted-foreground font-semibold">Cumulative Delta</div>
                          <TrendingUp className="h-6 w-6 text-blue-500" />
                        </div>
                        <div
                          className={`text-4xl font-bold mb-2 ${cumulativeDelta > 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {cumulativeDelta > 0 ? "+" : ""}
                          {cumulativeDelta.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {cumulativeDelta > 0 ? "Net Institutional Buying" : "Net Institutional Selling"}
                        </div>
                        <div className="text-xs mt-3 text-blue-400">
                          💼 Smart money is {cumulativeDelta > 0 ? "accumulating" : "distributing"}
                        </div>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="structure" className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">Market Structure Analysis</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Break of Structure (BOS) and swing points identification
                        </p>
                      </div>
                      <Badge variant="secondary" className="gap-2">
                        <TrendingUp className="h-3 w-3" />
                        Trend Analysis
                      </Badge>
                    </div>

                    <Card className="p-6 bg-gradient-to-br from-black/60 to-black/40 border-primary/20">
                      <ResponsiveContainer width="100%" height={600}>
                        <ComposedChart data={marketStructureData} margin={{ top: 30, right: 30, bottom: 30, left: 20 }}>
                          <defs>
                            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="rgb(100, 255, 218)" stopOpacity={0.8} />
                              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity={0.3} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis
                            dataKey="time"
                            stroke="rgba(255,255,255,0.4)"
                            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                            label={{
                              value: "Time Period (Weeks)",
                              position: "bottom",
                              fill: "rgba(255,255,255,0.6)",
                              offset: 0,
                            }}
                          />
                          <YAxis
                            stroke="rgba(255,255,255,0.4)"
                            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
                            domain={["auto", "auto"]}
                            label={{
                              value: "Price",
                              angle: -90,
                              position: "insideLeft",
                              fill: "rgba(255,255,255,0.6)",
                            }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(20, 20, 30, 0.95)",
                              border: "1px solid rgba(100, 255, 150, 0.3)",
                              borderRadius: "8px",
                              padding: "12px",
                              backdropFilter: "blur(10px)",
                            }}
                            labelStyle={{ color: "rgb(255,255,255)", fontWeight: "bold" }}
                            formatter={(value: any, name: string) => {
                              if (name === "price") return [`$${Number(value).toFixed(2)}`, "Price"]
                              if (name === "strength") return [`${value}%`, "Strength"]
                              return [value, name]
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="price"
                            fill="url(#priceGradient)"
                            stroke="rgb(100, 255, 218)"
                            strokeWidth={3}
                            name="Price Action"
                          />
                          <Line
                            type="monotone"
                            dataKey="high"
                            stroke="rgb(34, 197, 94)"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                            name="Swing High"
                          />
                          <Line
                            type="monotone"
                            dataKey="low"
                            stroke="rgb(239, 68, 68)"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                            name="Swing Low"
                          />
                          {marketStructureData.map((entry, index) => {
                            if (entry.structure === "BOS") {
                              return (
                                <ReferenceLine
                                  key={`bos-${index}`}
                                  x={entry.time}
                                  stroke="rgb(234, 179, 8)"
                                  strokeWidth={3}
                                  label={{
                                    value: "BOS",
                                    position: "top",
                                    fill: "rgb(234, 179, 8)",
                                    fontWeight: "bold",
                                    fontSize: 14,
                                  }}
                                />
                              )
                            }
                            return null
                          })}
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Card>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {marketStructureData.slice(-4).map((item, i) => (
                        <Card
                          key={i}
                          className={`p-4 hover:scale-105 transition-all ${
                            item.structure === "BOS"
                              ? "bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-yellow-500/30"
                              : item.structure === "HH"
                                ? "bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30"
                                : "bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30"
                          }`}
                        >
                          <div className="text-xs text-muted-foreground mb-1">{item.time}</div>
                          <div className="text-2xl font-bold mb-1">
                            ${typeof item.price === "number" ? item.price.toLocaleString() : item.price}
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              item.structure === "BOS"
                                ? "border-yellow-500 text-yellow-500"
                                : item.structure === "HH"
                                  ? "border-green-500 text-green-500"
                                  : "border-blue-500 text-blue-500"
                            }`}
                          >
                            {item.structure} - {item.strength}%
                          </Badge>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="volume" className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">Volume Profile Distribution</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          POC (Point of Control) and value area identification
                        </p>
                      </div>
                      <Badge variant="secondary" className="gap-2">
                        <BarChart3 className="h-3 w-3" />
                        TPO Analysis
                      </Badge>
                    </div>

                    <Card className="p-6 bg-gradient-to-br from-black/60 to-black/40 border-primary/20">
                      <ResponsiveContainer width="100%" height={600}>
                        <ComposedChart
                          data={volumeProfileData}
                          layout="vertical"
                          margin={{ left: 30, right: 50, top: 20, bottom: 20 }}
                        >
                          <defs>
                            <linearGradient id="volumeGradient" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity={0.3} />
                              <stop offset="50%" stopColor="rgb(139, 92, 246)" stopOpacity={0.6} />
                              <stop offset="100%" stopColor="rgb(139, 92, 246)" stopOpacity={0.9} />
                            </linearGradient>
                            <linearGradient id="pocGradient" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="rgb(234, 179, 8)" stopOpacity={0.5} />
                              <stop offset="100%" stopColor="rgb(234, 179, 8)" stopOpacity={1} />
                            </linearGradient>
                            <linearGradient id="valueAreaGradient" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity={0.7} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.1)"
                            horizontal={true}
                            vertical={false}
                          />
                          <XAxis
                            type="number"
                            stroke="rgba(255,255,255,0.4)"
                            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                            label={{
                              value: "Volume (Contracts)",
                              position: "bottom",
                              fill: "rgba(255,255,255,0.6)",
                              offset: 0,
                            }}
                          />
                          <YAxis
                            dataKey="price"
                            type="category"
                            width={100}
                            stroke="rgba(255,255,255,0.4)"
                            tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(20, 20, 30, 0.95)",
                              border: "1px solid rgba(100, 255, 150, 0.3)",
                              borderRadius: "8px",
                              padding: "12px",
                              backdropFilter: "blur(10px)",
                            }}
                            labelStyle={{ color: "rgb(255,255,255)", fontWeight: "bold" }}
                            formatter={(value: any) => [`${value.toLocaleString()} contracts`, "Volume"]}
                            labelFormatter={(label) => `Price Level: $${label}`}
                          />
                          <Bar dataKey="volume" radius={[0, 6, 6, 0]} barSize={14}>
                            {volumeProfileData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  entry.poc
                                    ? "url(#pocGradient)"
                                    : entry.valueArea
                                      ? "url(#valueAreaGradient)"
                                      : "url(#volumeGradient)"
                                }
                              />
                            ))}
                          </Bar>
                          {pocData && (
                            <ReferenceLine
                              y={pocData.price}
                              stroke="rgb(234, 179, 8)"
                              strokeWidth={3}
                              strokeDasharray="5 5"
                              label={{
                                value: `POC: $${pocData.price}`,
                                fill: "rgb(234, 179, 8)",
                                position: "right",
                                fontSize: 14,
                                fontWeight: "bold",
                              }}
                            />
                          )}
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/30 hover:scale-105 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-muted-foreground font-semibold">Point of Control</div>
                          <Target className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="text-3xl font-bold text-yellow-500 mb-1">${pocPrice}</div>
                        <div className="text-xs text-muted-foreground">Highest volume price level</div>
                        <div className="text-xs text-yellow-400 mt-2">🎯 {maxVolume.toLocaleString()} volume</div>
                      </Card>

                      <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30 hover:scale-105 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-muted-foreground font-semibold">Value Area</div>
                          <BarChart3 className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="text-3xl font-bold text-blue-500 mb-1">70%</div>
                        <div className="text-xs text-muted-foreground">Of volume traded</div>
                        <div className="text-xs text-blue-400 mt-2">📊 Fair value zone</div>
                      </Card>

                      <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30 hover:scale-105 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-muted-foreground font-semibold">Profile Type</div>
                          <Activity className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="text-3xl font-bold text-purple-500 mb-1">Balanced</div>
                        <div className="text-xs text-muted-foreground">Market distribution</div>
                        <div className="text-xs text-purple-400 mt-2">⚖️ Range-bound profile</div>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
