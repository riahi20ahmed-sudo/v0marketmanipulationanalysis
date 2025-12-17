"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Code2, Zap } from "lucide-react"
import { useState, useEffect } from "react"

export function Hero() {
  const [typedText, setTypedText] = useState("")
  const fullText = "Smart Money Trading Bot"

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="container py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm mb-6 hover:border-primary/40 transition-all hover:scale-105 cursor-default">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <Zap className="h-3 w-3 text-primary" />
          <span className="text-primary font-medium">Institutional Trading Logic</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-balance mb-6 tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text min-h-[80px] md:min-h-[120px]">
          {typedText}
          <span className="animate-pulse">|</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground text-pretty mb-8 leading-relaxed max-w-3xl mx-auto">
          Professional-grade automated trading system that replicates institutional behavior. Detect order blocks, fair
          value gaps, liquidity sweeps, and execute high-probability trades with advanced risk management.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button size="lg" className="gap-2 hover:scale-105 transition-transform group">
            View Documentation
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 bg-transparent hover:scale-105 transition-transform group"
          >
            <Code2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            Get Code
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-2 p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group cursor-default">
            <div className="text-4xl font-bold text-primary group-hover:scale-110 transition-transform">98.5%</div>
            <div className="text-sm text-muted-foreground">Detection Accuracy</div>
            <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "98.5%" }} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group cursor-default">
            <div className="text-4xl font-bold text-primary group-hover:scale-110 transition-transform">1:3.5</div>
            <div className="text-sm text-muted-foreground">Avg Risk/Reward</div>
            <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: "87.5%" }} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group cursor-default">
            <div className="text-4xl font-bold text-primary group-hover:scale-110 transition-transform">72%</div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
            <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-chart-3 rounded-full" style={{ width: "72%" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
