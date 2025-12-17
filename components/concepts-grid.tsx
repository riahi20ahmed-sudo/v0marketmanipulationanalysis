"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers, TrendingUp, Activity, Target, Zap, Shield } from "lucide-react"
import { useState } from "react"

const concepts = [
  {
    icon: Layers,
    title: "Market Structure",
    description:
      "Detect BOS (Break of Structure) and CHoCH (Change of Character) to identify trend shifts and institutional positioning.",
    details: ["Swing high/low detection", "Bullish/Bearish structure", "Candle close confirmation"],
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "group-hover:border-blue-500/50",
  },
  {
    icon: Target,
    title: "Liquidity Analysis",
    description:
      "Identify equal highs/lows, buy-side and sell-side liquidity zones where institutions hunt stop losses.",
    details: ["Equal Highs (EQH)", "Equal Lows (EQL)", "Stop hunt detection"],
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "group-hover:border-purple-500/50",
  },
  {
    icon: Activity,
    title: "Order Blocks",
    description: "Locate institutional order zones where smart money accumulates or distributes positions.",
    details: ["Bullish OB detection", "Bearish OB detection", "Mitigation tracking"],
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "group-hover:border-green-500/50",
  },
  {
    icon: TrendingUp,
    title: "Fair Value Gaps",
    description: "Find imbalances in price action where institutions create inefficiencies before filling orders.",
    details: ["FVG identification", "Mean threshold entries", "Gap size filtering"],
    color: "from-orange-500/20 to-amber-500/20",
    borderColor: "group-hover:border-orange-500/50",
  },
  {
    icon: Zap,
    title: "Premium/Discount",
    description: "Determine optimal entry zones using higher timeframe ranges and 50% equilibrium levels.",
    details: ["HTF range analysis", "Equilibrium calculation", "Zone-based entries"],
    color: "from-yellow-500/20 to-lime-500/20",
    borderColor: "group-hover:border-yellow-500/50",
  },
  {
    icon: Shield,
    title: "Kill Zones",
    description:
      "Time-based trading windows aligned with London and New York sessions for maximum institutional activity.",
    details: ["London Kill Zone", "NY Kill Zone", "Session filtering"],
    color: "from-red-500/20 to-rose-500/20",
    borderColor: "group-hover:border-red-500/50",
  },
]

export function ConceptsGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="concepts" className="container py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Core Smart Money Concepts</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Six fundamental pillars that replicate institutional trading logic and behavior
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concepts.map((concept, index) => (
            <Card
              key={index}
              className={`group border-border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${concept.borderColor} cursor-pointer relative overflow-hidden animate-scale-in`}
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${concept.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <concept.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-foreground transition-colors">
                    {concept.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-base leading-relaxed">{concept.description}</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-2">
                  {concept.details.map((detail, idx) => (
                    <li
                      key={idx}
                      className={`flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 ${
                        hoveredIndex === index ? "translate-x-2 opacity-100" : "translate-x-0 opacity-70"
                      }`}
                      style={{ transitionDelay: `${idx * 50}ms` }}
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary group-hover:scale-150 transition-transform duration-200" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
