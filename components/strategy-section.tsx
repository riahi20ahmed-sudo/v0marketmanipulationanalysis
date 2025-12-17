"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpCircle, ArrowDownCircle, Clock } from "lucide-react"
import { useState } from "react"

export function StrategySection() {
  const [expandedCard, setExpandedCard] = useState<"buy" | "sell" | null>(null)

  return (
    <section id="strategy" className="container py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Entry Conditions & Confluence</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Strict multi-factor confirmation required for high-probability trade signals
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Buy Setup */}
          <Card
            className={`border-2 bg-card transition-all duration-500 cursor-pointer ${
              expandedCard === "buy"
                ? "border-accent shadow-2xl shadow-accent/20 scale-105"
                : "border-primary/20 hover:border-accent/40 hover:scale-102"
            }`}
            onClick={() => setExpandedCard(expandedCard === "buy" ? null : "buy")}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className={expandedCard === "buy" ? "animate-pulse" : ""}>
                  <ArrowUpCircle className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl">Buy Setup</CardTitle>
              </div>
              <CardDescription>Long entry conditions with bullish bias</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <ConditionItem
                  number={1}
                  label="HTF Alignment"
                  value="Monthly/Weekly/Daily all Bullish"
                  expanded={expandedCard === "buy"}
                  highlight
                />
                <ConditionItem
                  number={2}
                  label="Liquidity Sweep"
                  value="Price sweeps sell-side liquidity (SSL)"
                  expanded={expandedCard === "buy"}
                />
                <ConditionItem
                  number={3}
                  label="Structure Break"
                  value="CHoCH or BOS confirmed on LTF"
                  expanded={expandedCard === "buy"}
                />
                <ConditionItem
                  number={4}
                  label="Entry Zone"
                  value="Retraces into HTF Bullish OB or FVG"
                  expanded={expandedCard === "buy"}
                />
                <ConditionItem
                  number={5}
                  label="Zone Alignment"
                  value="Entry in Discount Zone (below 50%)"
                  expanded={expandedCard === "buy"}
                />
                <ConditionItem
                  number={6}
                  label="Time Filter"
                  value="Occurs during London or NY Kill Zone"
                  expanded={expandedCard === "buy"}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Risk Management</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Stop Loss:</span>
                    <span className="text-destructive font-medium">Below OB/FVG low</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Take Profit 1:</span>
                    <span className="text-accent font-medium">Nearest liquidity</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Take Profit 2:</span>
                    <span className="text-accent font-medium">HTF liquidity target</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sell Setup */}
          <Card
            className={`border-2 bg-card transition-all duration-500 cursor-pointer ${
              expandedCard === "sell"
                ? "border-destructive shadow-2xl shadow-destructive/20 scale-105"
                : "border-destructive/20 hover:border-destructive/40 hover:scale-102"
            }`}
            onClick={() => setExpandedCard(expandedCard === "sell" ? null : "sell")}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className={expandedCard === "sell" ? "animate-pulse" : ""}>
                  <ArrowDownCircle className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-2xl">Sell Setup</CardTitle>
              </div>
              <CardDescription>Short entry conditions with bearish bias</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <ConditionItem
                  number={1}
                  label="HTF Alignment"
                  value="Monthly/Weekly/Daily all Bearish"
                  expanded={expandedCard === "sell"}
                  highlight
                />
                <ConditionItem
                  number={2}
                  label="Liquidity Sweep"
                  value="Price sweeps buy-side liquidity (BSL)"
                  expanded={expandedCard === "sell"}
                />
                <ConditionItem
                  number={3}
                  label="Structure Break"
                  value="CHoCH or BOS confirmed on LTF"
                  expanded={expandedCard === "sell"}
                />
                <ConditionItem
                  number={4}
                  label="Entry Zone"
                  value="Retraces into HTF Bearish OB or FVG"
                  expanded={expandedCard === "sell"}
                />
                <ConditionItem
                  number={5}
                  label="Zone Alignment"
                  value="Entry in Premium Zone (above 50%)"
                  expanded={expandedCard === "sell"}
                />
                <ConditionItem
                  number={6}
                  label="Time Filter"
                  value="Occurs during London or NY Kill Zone"
                  expanded={expandedCard === "sell"}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Risk Management</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Stop Loss:</span>
                    <span className="text-destructive font-medium">Above OB/FVG high</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Take Profit 1:</span>
                    <span className="text-accent font-medium">Nearest liquidity</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Take Profit 2:</span>
                    <span className="text-accent font-medium">HTF liquidity target</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 bg-muted/50 border-border">
          <CardHeader>
            <CardTitle>Configuration Parameters</CardTitle>
            <CardDescription>Adjustable settings for strategy optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Risk Per Trade</div>
                <Badge variant="outline" className="font-mono">
                  0.5% - 2.0%
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Minimum R:R Ratio</div>
                <Badge variant="outline" className="font-mono">
                  1:2
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Partial TP</div>
                <Badge variant="outline" className="font-mono">
                  50% at TP1
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function ConditionItem({
  number,
  label,
  value,
  expanded,
  highlight = false,
}: { number: number; label: string; value: string; expanded: boolean; highlight?: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 transition-all duration-300 ${expanded ? "translate-x-0 opacity-100" : ""} ${
        highlight ? "bg-primary/5 border border-primary/20 rounded-lg p-3 -mx-3" : ""
      }`}
      style={{ transitionDelay: `${number * 50}ms` }}
    >
      <div
        className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full ${
          highlight ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
        } text-xs font-bold transition-transform duration-200 ${expanded ? "scale-125" : ""}`}
      >
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${highlight ? "font-bold" : ""}`}>
          {highlight && <Clock className="h-3 w-3 inline mr-1" />}
          {label}
        </div>
        <div className={`text-sm ${highlight ? "text-foreground" : "text-muted-foreground"}`}>{value}</div>
      </div>
    </div>
  )
}
