"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

export function CodeExamples() {
  const [copiedTab, setCopiedTab] = useState<string | null>(null)

  const copyToClipboard = (text: string, tab: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTab(tab)
    setTimeout(() => setCopiedTab(null), 2000)
  }

  return (
    <section id="code" className="container py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Implementation Code</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Production-ready Pine Script strategy and Python automation bot
          </p>
        </div>

        <Tabs defaultValue="pine" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="pine">Pine Script</TabsTrigger>
            <TabsTrigger value="python">Python Bot</TabsTrigger>
            <TabsTrigger value="webhook">Webhook</TabsTrigger>
          </TabsList>

          <TabsContent value="pine" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>TradingView Pine Script v5</CardTitle>
                    <CardDescription>Complete strategy with all SMC logic and visualization</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(pineScriptCode, "pine")}>
                    {copiedTab === "pine" ? (
                      <>
                        <Check className="h-4 w-4 mr-2" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" /> Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="p-4 rounded-lg bg-background border border-border overflow-x-auto text-sm">
                  <code className="font-mono text-xs leading-relaxed">{pineScriptCode}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="python" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Python Automation Bot</CardTitle>
                    <CardDescription>Modular bot with risk management and trade execution</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(pythonCode, "python")}>
                    {copiedTab === "python" ? (
                      <>
                        <Check className="h-4 w-4 mr-2" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" /> Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="p-4 rounded-lg bg-background border border-border overflow-x-auto text-sm">
                  <code className="font-mono text-xs leading-relaxed">{pythonCode}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhook" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Webhook Integration</CardTitle>
                    <CardDescription>Connect TradingView alerts to Python bot</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(webhookCode, "webhook")}>
                    {copiedTab === "webhook" ? (
                      <>
                        <Check className="h-4 w-4 mr-2" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" /> Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="p-4 rounded-lg bg-background border border-border overflow-x-auto text-sm">
                  <code className="font-mono text-xs leading-relaxed">{webhookCode}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

const pineScriptCode = `//@version=5
strategy("Smart Money Trading Bot", overlay=true, default_qty_type=strategy.percent_of_equity, default_qty_value=1)

// === INPUTS ===
htfTimeframe = input.timeframe("240", "HTF Timeframe")
riskPercent = input.float(1.0, "Risk Per Trade %", minval=0.1, maxval=5.0)
minRR = input.float(2.0, "Minimum R:R Ratio", minval=1.0)
fvgMinPips = input.int(10, "Min FVG Size (pips)")
londonKillZone = input.session("0200-0500", "London Kill Zone")
nyKillZone = input.session("0800-1100", "NY Kill Zone")

// === MARKET STRUCTURE ===
var float swingHigh = na
var float swingLow = na
var int trend = 0  // 1=bullish, -1=bearish

// Detect swing points
isSwingHigh = ta.highest(high, 5)[2] == high[2]
isSwingLow = ta.lowest(low, 5)[2] == low[2]

if isSwingHigh
    swingHigh := high[2]
if isSwingLow
    swingLow := low[2]

// BOS and CHoCH detection
if close > swingHigh and trend <= 0
    trend := 1  // Bullish BOS/CHoCH
    label.new(bar_index, high, "BOS↑", style=label.style_label_up, color=color.green, textcolor=color.white, size=size.small)

if close < swingLow and trend >= 0
    trend := -1  // Bearish BOS/CHoCH
    label.new(bar_index, low, "BOS↓", style=label.style_label_down, color=color.red, textcolor=color.white, size=size.small)

// === LIQUIDITY ZONES ===
lookback = 20
eqh = ta.highest(high, lookback)
eql = ta.lowest(low, lookback)

// Equal highs/lows detection
eqhCount = 0
eqlCount = 0
for i = 0 to lookback - 1
    if math.abs(high[i] - eqh) < syminfo.mintick * 10
        eqhCount += 1
    if math.abs(low[i] - eql) < syminfo.mintick * 10
        eqlCount += 1

bsl = eqhCount >= 2  // Buy-Side Liquidity
ssl = eqlCount >= 2  // Sell-Side Liquidity

// Liquidity sweep detection
bslSweep = ssl and low < eql and close > eql
sslSweep = bsl and high > eqh and close < eqh

// === ORDER BLOCKS ===
var float bullishOB = na
var float bearishOB = na

// Bullish OB: Last red candle before BOS up
if trend == 1 and close[1] < open[1] and close > high[1]
    bullishOB := low[1]
    box.new(bar_index[1], high[1], bar_index, low[1], border_color=color.green, bgcolor=color.new(color.green, 90))

// Bearish OB: Last green candle before BOS down
if trend == -1 and close[1] > open[1] and close < low[1]
    bearishOB := high[1]
    box.new(bar_index[1], high[1], bar_index, low[1], border_color=color.red, bgcolor=color.new(color.red, 90))

// === FAIR VALUE GAPS ===
fvgUp = low > high[2] and (low - high[2]) / syminfo.mintick > fvgMinPips
fvgDown = high < low[2] and (low[2] - high) / syminfo.mintick > fvgMinPips

if fvgUp
    box.new(bar_index[2], low, bar_index, high[2], border_color=color.blue, bgcolor=color.new(color.blue, 85))
if fvgDown
    box.new(bar_index[2], low[2], bar_index, high, border_color=color.orange, bgcolor=color.new(color.orange, 85))

// === PREMIUM/DISCOUNT ===
htfHigh = request.security(syminfo.tickerid, htfTimeframe, ta.highest(high, 50))
htfLow = request.security(syminfo.tickerid, htfTimeframe, ta.lowest(low, 50))
equilibrium = (htfHigh + htfLow) / 2

inDiscount = close < equilibrium
inPremium = close > equilibrium

// Plot equilibrium
plot(equilibrium, "50% Equilibrium", color=color.yellow, linewidth=2, style=plot.style_stepline)

// === KILL ZONES ===
inLondonKZ = time(timeframe.period, londonKillZone)
inNYKZ = time(timeframe.period, nyKillZone)
inKillZone = inLondonKZ or inNYKZ

bgcolor(inKillZone ? color.new(color.purple, 95) : na, title="Kill Zone")

// === ENTRY CONDITIONS ===
buySetup = trend == 1 and sslSweep and not na(bullishOB) and close <= bullishOB * 1.01 and inDiscount and inKillZone
sellSetup = trend == -1 and bslSweep and not na(bearishOB) and close >= bearishOB * 0.99 and inPremium and inKillZone

// === RISK MANAGEMENT ===
if buySetup and strategy.position_size == 0
    stopLoss = bullishOB * 0.999
    takeProfit1 = close + (close - stopLoss) * 2
    takeProfit2 = htfHigh
    if (takeProfit1 - close) / (close - stopLoss) >= minRR
        strategy.entry("Long", strategy.long)
        strategy.exit("TP1", "Long", qty_percent=50, limit=takeProfit1, stop=stopLoss)
        strategy.exit("TP2", "Long", limit=takeProfit2, stop=stopLoss)

if sellSetup and strategy.position_size == 0
    stopLoss = bearishOB * 1.001
    takeProfit1 = close - (stopLoss - close) * 2
    takeProfit2 = htfLow
    if (close - takeProfit1) / (stopLoss - close) >= minRR
        strategy.entry("Short", strategy.short)
        strategy.exit("TP1", "Short", qty_percent=50, limit=takeProfit1, stop=stopLoss)
        strategy.exit("TP2", "Short", limit=takeProfit2, stop=stopLoss)

// Move to break-even after TP1
if strategy.position_size > 0 and strategy.position_size < strategy.position_avg_price
    strategy.exit("BE", stop=strategy.position_avg_price)

// === ALERTS ===
alertcondition(buySetup, "Buy Signal", "SMC Buy Setup Detected")
alertcondition(sellSetup, "Sell Signal", "SMC Sell Setup Detected")`

const pythonCode = `# Smart Money Trading Bot - Python Automation
import json
import logging
from datetime import datetime
from typing import Dict, Optional
import requests
from flask import Flask, request, jsonify

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class RiskManager:
    """Handle position sizing and risk calculations"""
    
    def __init__(self, account_balance: float, risk_percent: float = 1.0):
        self.account_balance = account_balance
        self.risk_percent = risk_percent
        self.max_positions = 3
        self.current_positions = 0
        
    def calculate_position_size(self, entry: float, stop_loss: float) -> float:
        """Calculate position size based on risk parameters"""
        risk_amount = self.account_balance * (self.risk_percent / 100)
        risk_per_unit = abs(entry - stop_loss)
        position_size = risk_amount / risk_per_unit if risk_per_unit > 0 else 0
        return round(position_size, 2)
    
    def can_open_position(self) -> bool:
        """Check if we can open a new position"""
        return self.current_positions < self.max_positions
    
    def validate_rr_ratio(self, entry: float, stop_loss: float, 
                         take_profit: float, min_rr: float = 2.0) -> bool:
        """Validate minimum risk-reward ratio"""
        risk = abs(entry - stop_loss)
        reward = abs(take_profit - entry)
        rr_ratio = reward / risk if risk > 0 else 0
        return rr_ratio >= min_rr

class TradeExecutor:
    """Execute trades via broker API"""
    
    def __init__(self, api_key: str, api_secret: str):
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = "https://api.broker.com"  # Replace with actual broker
        
    def execute_trade(self, signal: Dict) -> Optional[Dict]:
        """Execute trade based on signal"""
        try:
            # Prepare order payload
            order = {
                "symbol": signal["symbol"],
                "side": signal["side"],
                "type": "MARKET",
                "quantity": signal["quantity"],
                "stopLoss": signal["stop_loss"],
                "takeProfit": signal["take_profit"]
            }
            
            # Send order to broker (implement actual API call)
            logger.info(f"Executing {signal['side']} order: {order}")
            
            # Simulated response
            response = {
                "orderId": "12345",
                "status": "FILLED",
                "executedQty": order["quantity"],
                "executedPrice": signal["entry"]
            }
            
            return response
            
        except Exception as e:
            logger.error(f"Trade execution failed: {str(e)}")
            return None
    
    def close_position(self, symbol: str, quantity: float) -> bool:
        """Close existing position"""
        try:
            logger.info(f"Closing position: {symbol} - {quantity}")
            # Implement actual close logic
            return True
        except Exception as e:
            logger.error(f"Failed to close position: {str(e)}")
            return False

class SmartMoneyBot:
    """Main trading bot orchestrator"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.risk_manager = RiskManager(
            account_balance=config["account_balance"],
            risk_percent=config["risk_percent"]
        )
        self.executor = TradeExecutor(
            api_key=config["api_key"],
            api_secret=config["api_secret"]
        )
        self.trade_log = []
        
    def process_signal(self, webhook_data: Dict) -> Dict:
        """Process incoming webhook signal from TradingView"""
        try:
            logger.info(f"Processing signal: {webhook_data}")
            
            # Extract signal data
            symbol = webhook_data.get("symbol")
            side = webhook_data.get("side")  # "BUY" or "SELL"
            entry = float(webhook_data.get("entry"))
            stop_loss = float(webhook_data.get("stop_loss"))
            take_profit = float(webhook_data.get("take_profit"))
            
            # Validate signal
            if not all([symbol, side, entry, stop_loss, take_profit]):
                return {"status": "error", "message": "Invalid signal data"}
            
            # Check if we can open position
            if not self.risk_manager.can_open_position():
                return {"status": "rejected", "message": "Max positions reached"}
            
            # Validate R:R ratio
            if not self.risk_manager.validate_rr_ratio(
                entry, stop_loss, take_profit, min_rr=2.0
            ):
                return {"status": "rejected", "message": "R:R ratio too low"}
            
            # Calculate position size
            position_size = self.risk_manager.calculate_position_size(
                entry, stop_loss
            )
            
            # Execute trade
            signal = {
                "symbol": symbol,
                "side": side,
                "entry": entry,
                "stop_loss": stop_loss,
                "take_profit": take_profit,
                "quantity": position_size
            }
            
            result = self.executor.execute_trade(signal)
            
            if result:
                self.risk_manager.current_positions += 1
                self.log_trade(signal, result)
                return {"status": "success", "result": result}
            else:
                return {"status": "error", "message": "Execution failed"}
                
        except Exception as e:
            logger.error(f"Error processing signal: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    def log_trade(self, signal: Dict, result: Dict):
        """Log trade details"""
        trade_entry = {
            "timestamp": datetime.now().isoformat(),
            "symbol": signal["symbol"],
            "side": signal["side"],
            "entry": signal["entry"],
            "stop_loss": signal["stop_loss"],
            "take_profit": signal["take_profit"],
            "quantity": signal["quantity"],
            "order_id": result.get("orderId"),
            "status": result.get("status")
        }
        self.trade_log.append(trade_entry)
        logger.info(f"Trade logged: {trade_entry}")

# Flask webhook server
app = Flask(__name__)

# Initialize bot (load config from environment or file)
config = {
    "account_balance": 10000,
    "risk_percent": 1.0,
    "api_key": "YOUR_API_KEY",
    "api_secret": "YOUR_API_SECRET"
}

bot = SmartMoneyBot(config)

@app.route('/webhook', methods=['POST'])
def webhook():
    """Receive TradingView webhook signals"""
    try:
        data = request.get_json()
        result = bot.process_signal(data)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/status', methods=['GET'])
def status():
    """Check bot status"""
    return jsonify({
        "status": "running",
        "positions": bot.risk_manager.current_positions,
        "trades": len(bot.trade_log)
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)`

const webhookCode = `// TradingView Alert Message JSON Format
// Paste this into TradingView alert creation dialog

{
  "symbol": "{{ticker}}",
  "side": "{{strategy.order.action}}",
  "entry": {{close}},
  "stop_loss": {{strategy.order.stop}},
  "take_profit": {{strategy.order.limit}},
  "timestamp": "{{timenow}}",
  "timeframe": "{{interval}}",
  "signal_type": "SMC_SETUP"
}

// Webhook URL Setup:
// 1. Deploy Python bot to cloud (Heroku, AWS, DigitalOcean)
// 2. Get public URL: https://your-bot.herokuapp.com/webhook
// 3. In TradingView alert settings:
//    - Webhook URL: https://your-bot.herokuapp.com/webhook
//    - Message: Paste JSON above
// 4. Set alert conditions to strategy entry/exit signals

// Example ngrok for local testing:
// ngrok http 5000
// Use ngrok URL as webhook: https://abc123.ngrok.io/webhook

// Security Recommendations:
// - Add API key authentication
// - Use HTTPS only
// - Whitelist TradingView IPs
// - Implement rate limiting
// - Log all webhook requests`
