"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ConceptsGrid } from "@/components/concepts-grid"
import { StrategySection } from "@/components/strategy-section"
import { CodeExamples } from "@/components/code-examples"
import { BacktestingMetrics } from "@/components/backtesting-metrics"
import { Footer } from "@/components/footer"
import { LiveSignals } from "@/components/live-signals"
import { InteractiveChart } from "@/components/interactive-chart"
import { RiskCalculator } from "@/components/risk-calculator"
import { TradingSimulator } from "@/components/trading-simulator"
import { PerformanceDashboard } from "@/components/performance-dashboard"
import { CandlestickChart } from "@/components/candlestick-chart"
import { MarketInsights } from "@/components/market-insights"
import { MultiTimeframeAnalysis } from "@/components/multi-timeframe-analysis"
import { AssetSelector, type Asset, ASSETS } from "@/components/asset-selector"
import { AdvancedMarketAnalysis } from "@/components/advanced-market-analysis"
import type { Language } from "@/lib/translations"

export default function Home() {
  const [selectedAsset, setSelectedAsset] = useState<Asset>(ASSETS.find((a) => a.category === "crypto") || ASSETS[0])
  const [language, setLanguage] = useState<Language>("en")

  const handleAssetChange = (asset: Asset) => {
    setSelectedAsset(asset)
    console.log("[v0] Asset changed to:", asset.symbol)
  }

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    console.log("[v0] Language changed to:", lang)
    // Apply RTL for Arabic
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
  }

  return (
    <div className="min-h-screen scroll-smooth">
      <Header language={language} onLanguageChange={handleLanguageChange} />
      <main className="overflow-hidden">
        <Hero />
        <AssetSelector onAssetChange={handleAssetChange} />
        <ConceptsGrid />
        <MultiTimeframeAnalysis />
        <LiveSignals />
        <CandlestickChart />
        <InteractiveChart />
        <MarketInsights />
        <div id="market-analysis">
          <AdvancedMarketAnalysis selectedAsset={selectedAsset.symbol} language={language} />
        </div>
        <TradingSimulator selectedAsset={selectedAsset} />
        <RiskCalculator />
        <StrategySection />
        <BacktestingMetrics />
        <PerformanceDashboard />
        <CodeExamples />
      </main>
      <Footer />
    </div>
  )
}
