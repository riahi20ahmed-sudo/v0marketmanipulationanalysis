"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, LineChart, Calendar, Percent, TrendingUp } from "lucide-react"
import { useState } from "react"

const monthlyData = [
  { month: "Jan", trades: 18, winRate: 72, profit: 3420 },
  { month: "Feb", trades: 22, winRate: 68, profit: 2890 },
  { month: "Mar", trades: 20, winRate: 75, profit: 4120 },
  { month: "Apr", trades: 19, winRate: 74, profit: 3680 },
  { month: "May", trades: 21, winRate: 71, profit: 3290 },
  { month: "Jun", trades: 23, winRate: 70, profit: 3450 },
  { month: "Jul", trades: 20, winRate: 73, profit: 3890 },
  { month: "Aug", trades: 24, winRate: 69, profit: 3150 },
  { month: "Sep", trades: 22, winRate: 76, profit: 4560 },
  { month: "Oct", trades: 19, winRate: 72, profit: 3720 },
  { month: "Nov", trades: 21, winRate: 74, profit: 3980 },
  { month: "Dec", trades: 18, winRate: 71, profit: 3080 },
]

export function PerformanceDashboard() {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null)
  const maxProfit = Math.max(...monthlyData.map((d) => d.profit))
  const totalProfit = monthlyData.reduce((sum, d) => sum + d.profit, 0)
  const totalTrades = monthlyData.reduce((sum, d) => sum + d.trades, 0)
  const avgWinRate = (monthlyData.reduce((sum, d) => sum + d.winRate, 0) / monthlyData.length).toFixed(1)
  const avgMonthlyProfit = (totalProfit / monthlyData.length).toFixed(0)

  return (
    <section className="container py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Performance Dashboard</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Detailed monthly breakdown and performance analytics
          </p>
        </div>

        <Card className="border-accent/50 bg-accent/5 mb-8 animate-scale-in hover:shadow-2xl transition-all duration-300">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform">
                  ${totalProfit.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Total Profit (12 months)
                </div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">
                  {totalTrades}
                </div>
                <div className="text-sm text-muted-foreground">Total Trades</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">
                  {avgWinRate}%
                </div>
                <div className="text-sm text-muted-foreground">Average Win Rate</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">
                  ${avgMonthlyProfit}
                </div>
                <div className="text-sm text-muted-foreground">Avg Monthly Profit</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 mb-8">
          <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 animate-slide-in-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Monthly Profit Chart
              </CardTitle>
              <CardDescription>Visual representation of profit by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 flex items-end justify-between gap-2 px-2">
                {monthlyData.map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2 group"
                    onMouseEnter={() => setHoveredMonth(index)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    <div
                      className="w-full bg-gradient-to-t from-accent to-accent/50 rounded-t-lg hover:from-primary hover:to-primary/50 transition-all duration-300 relative group-hover:scale-105 cursor-pointer"
                      style={{ height: `${(data.profit / maxProfit) * 100}%`, minHeight: "20px" }}
                    >
                      <div
                        className={`absolute -top-12 left-1/2 -translate-x-1/2 transition-opacity duration-200 bg-background border border-border px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl z-10 ${
                          hoveredMonth === index ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                      >
                        <div className="text-accent">${data.profit}</div>
                        <div className="text-muted-foreground">{data.trades} trades</div>
                        <div className="text-muted-foreground">{data.winRate}% WR</div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{data.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className="border-primary/20 hover:border-primary/40 transition-all duration-300 animate-slide-in-left"
              style={{ animationDelay: "100ms" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Monthly Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {monthlyData.map((data, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 group hover:shadow-lg cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg w-12 group-hover:text-primary transition-colors">
                          {data.month}
                        </span>
                        <div className="text-sm text-muted-foreground">{data.trades} trades</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm hidden sm:block">
                          <span className="text-muted-foreground">WR: </span>
                          <span className="font-bold">{data.winRate}%</span>
                        </div>
                        <div className="text-sm font-bold text-accent group-hover:scale-110 transition-transform">
                          ${data.profit}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card
              className="border-primary/20 hover:border-primary/40 transition-all duration-300 animate-slide-in-right"
              style={{ animationDelay: "200ms" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Win Rate Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="space-y-2 group">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium group-hover:text-primary transition-colors">{data.month}</span>
                        <span className="text-muted-foreground font-bold">{data.winRate}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500 group-hover:shadow-lg"
                          style={{ width: `${data.winRate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
