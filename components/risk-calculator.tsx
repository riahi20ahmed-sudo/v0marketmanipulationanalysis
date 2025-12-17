"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, TrendingUp } from "lucide-react"

export function RiskCalculator() {
  const [accountSize, setAccountSize] = useState(10000)
  const [riskPercent, setRiskPercent] = useState(1)
  const [entry, setEntry] = useState(1.1)
  const [stopLoss, setStopLoss] = useState(1.095)
  const [takeProfit, setTakeProfit] = useState(1.11)

  const riskAmount = accountSize * (riskPercent / 100)
  const stopDistance = Math.abs(entry - stopLoss)
  const profitDistance = Math.abs(takeProfit - entry)
  const rrRatio = stopDistance > 0 ? profitDistance / stopDistance : 0
  const positionSize = stopDistance > 0 ? riskAmount / stopDistance : 0
  const potentialProfit = positionSize * profitDistance
  const potentialLoss = positionSize * stopDistance

  return (
    <section className="container py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Risk Calculator</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Calculate position size, risk-reward ratio, and potential profit/loss
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Trade Parameters</CardTitle>
              <CardDescription>Enter your trade setup details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Account Size ($)</label>
                <input
                  type="number"
                  value={accountSize}
                  onChange={(e) => setAccountSize(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Per Trade (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Entry Price</label>
                <input
                  type="number"
                  step="0.0001"
                  value={entry}
                  onChange={(e) => setEntry(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Stop Loss</label>
                <input
                  type="number"
                  step="0.0001"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Take Profit</label>
                <input
                  type="number"
                  step="0.0001"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-accent/50 bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Calculation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-lg bg-background border border-border">
                  <span className="text-muted-foreground">Risk Amount</span>
                  <span className="text-xl font-bold text-destructive">${riskAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center p-4 rounded-lg bg-background border border-border">
                  <span className="text-muted-foreground">Position Size</span>
                  <span className="text-xl font-bold">{positionSize.toFixed(2)} units</span>
                </div>

                <div className="flex justify-between items-center p-4 rounded-lg bg-background border border-border">
                  <span className="text-muted-foreground">Risk:Reward Ratio</span>
                  <span className={`text-xl font-bold ${rrRatio >= 2 ? "text-accent" : "text-yellow-500"}`}>
                    1:{rrRatio.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 rounded-lg bg-background border border-border">
                  <span className="text-muted-foreground">Potential Profit</span>
                  <span className="text-xl font-bold text-accent">${potentialProfit.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center p-4 rounded-lg bg-background border border-border">
                  <span className="text-muted-foreground">Potential Loss</span>
                  <span className="text-xl font-bold text-destructive">-${potentialLoss.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {rrRatio < 2 && (
              <Card className="border-yellow-500/50 bg-yellow-500/5">
                <CardContent className="pt-6">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Warning: R:R ratio is below 2:1. Consider adjusting your take profit or stop loss for better risk
                    management.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
