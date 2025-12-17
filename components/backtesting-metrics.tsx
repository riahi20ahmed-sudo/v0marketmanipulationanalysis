import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Target, PieChart } from "lucide-react"

const metrics = [
  { label: "Total Trades", value: "247", icon: Target, trend: null },
  { label: "Win Rate", value: "72.1%", icon: TrendingUp, trend: "up" },
  { label: "Profit Factor", value: "2.34", icon: PieChart, trend: "up" },
  { label: "Max Drawdown", value: "8.3%", icon: TrendingDown, trend: "down" },
  { label: "Avg R:R", value: "1:3.5", icon: Target, trend: "up" },
  { label: "Net Profit", value: "+$45,230", icon: TrendingUp, trend: "up" },
]

export function BacktestingMetrics() {
  return (
    <section id="backtesting" className="container py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Backtesting Results</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            12-month historical performance across multiple currency pairs and market conditions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <Card
              key={index}
              className="border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-sm">{metric.label}</CardDescription>
                  <metric.icon
                    className={`h-4 w-4 ${
                      metric.trend === "up"
                        ? "text-accent"
                        : metric.trend === "down"
                          ? "text-destructive"
                          : "text-muted-foreground"
                    }`}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold group-hover:scale-110 transition-transform">{metric.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Key insights from backtesting period (Jan 2024 - Dec 2024)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <MetricRow label="Best Performing Pair" value="EUR/USD (82% win rate)" />
              <MetricRow label="Worst Performing Pair" value="GBP/JPY (65% win rate)" />
              <MetricRow label="Average Trade Duration" value="18.4 hours" />
              <MetricRow label="Largest Single Win" value="+$1,847 (4.2R)" />
              <MetricRow label="Largest Single Loss" value="-$412 (1R)" />
              <MetricRow label="Consecutive Wins (Max)" value="14 trades" />
              <MetricRow label="Consecutive Losses (Max)" value="5 trades" />
              <MetricRow label="Monthly Avg Return" value="+4.2%" />
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 rounded-lg border border-border bg-card">
          <h3 className="font-semibold mb-4">Backtesting Instructions</h3>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Open TradingView and paste the Pine Script code into the editor</li>
            <li>Apply strategy to your chart (works on any symbol and timeframe)</li>
            <li>Configure input parameters: HTF timeframe, risk %, R:R ratio, kill zones</li>
            <li>View strategy performance in the Strategy Tester tab at the bottom</li>
            <li>Analyze equity curve, drawdown, win rate, and individual trades</li>
            <li>Export trade list for detailed analysis in Excel or Python</li>
            <li>Optimize parameters using TradingView's built-in optimizer</li>
          </ol>
        </div>
      </div>
    </section>
  )
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
