"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useState, useEffect } from "react"

export interface Asset {
  symbol: string
  name: string
  category: "forex" | "crypto" | "indices" | "commodities"
  price: number
  change: number
}

const ASSETS: Asset[] = [
  // Major Forex Pairs
  { symbol: "EUR/USD", name: "Euro / US Dollar", category: "forex", price: 1.0875, change: 0.23 },
  { symbol: "GBP/USD", name: "British Pound / US Dollar", category: "forex", price: 1.2641, change: -0.15 },
  { symbol: "USD/JPY", name: "US Dollar / Japanese Yen", category: "forex", price: 149.85, change: 0.42 },
  { symbol: "USD/CHF", name: "US Dollar / Swiss Franc", category: "forex", price: 0.8456, change: 0.18 },
  { symbol: "AUD/USD", name: "Australian Dollar / US Dollar", category: "forex", price: 0.6523, change: 0.35 },
  { symbol: "USD/CAD", name: "US Dollar / Canadian Dollar", category: "forex", price: 1.3645, change: -0.22 },
  { symbol: "NZD/USD", name: "New Zealand Dollar / US Dollar", category: "forex", price: 0.6012, change: 0.41 },

  // Minor Forex Pairs (Cross Pairs)
  { symbol: "EUR/GBP", name: "Euro / British Pound", category: "forex", price: 0.8603, change: 0.12 },
  { symbol: "EUR/JPY", name: "Euro / Japanese Yen", category: "forex", price: 162.95, change: 0.56 },
  { symbol: "EUR/CHF", name: "Euro / Swiss Franc", category: "forex", price: 0.9198, change: 0.08 },
  { symbol: "EUR/AUD", name: "Euro / Australian Dollar", category: "forex", price: 1.6675, change: -0.18 },
  { symbol: "EUR/CAD", name: "Euro / Canadian Dollar", category: "forex", price: 1.4843, change: 0.31 },
  { symbol: "EUR/NZD", name: "Euro / New Zealand Dollar", category: "forex", price: 1.8089, change: -0.15 },
  { symbol: "GBP/JPY", name: "British Pound / Japanese Yen", category: "forex", price: 189.45, change: -0.18 },
  { symbol: "GBP/CHF", name: "British Pound / Swiss Franc", category: "forex", price: 1.0689, change: 0.22 },
  { symbol: "GBP/AUD", name: "British Pound / Australian Dollar", category: "forex", price: 1.9384, change: 0.19 },
  { symbol: "GBP/CAD", name: "British Pound / Canadian Dollar", category: "forex", price: 1.7251, change: -0.09 },
  { symbol: "GBP/NZD", name: "British Pound / New Zealand Dollar", category: "forex", price: 2.1023, change: 0.28 },
  { symbol: "AUD/JPY", name: "Australian Dollar / Japanese Yen", category: "forex", price: 97.75, change: 0.45 },
  { symbol: "AUD/CHF", name: "Australian Dollar / Swiss Franc", category: "forex", price: 0.5515, change: 0.11 },
  { symbol: "AUD/CAD", name: "Australian Dollar / Canadian Dollar", category: "forex", price: 0.8899, change: -0.16 },
  { symbol: "AUD/NZD", name: "Australian Dollar / New Zealand Dollar", category: "forex", price: 1.0849, change: 0.07 },
  { symbol: "CAD/JPY", name: "Canadian Dollar / Japanese Yen", category: "forex", price: 109.84, change: 0.33 },
  { symbol: "CAD/CHF", name: "Canadian Dollar / Swiss Franc", category: "forex", price: 0.6197, change: 0.14 },
  { symbol: "NZD/JPY", name: "New Zealand Dollar / Japanese Yen", category: "forex", price: 90.1, change: 0.52 },
  { symbol: "NZD/CHF", name: "New Zealand Dollar / Swiss Franc", category: "forex", price: 0.5083, change: 0.21 },
  { symbol: "NZD/CAD", name: "New Zealand Dollar / Canadian Dollar", category: "forex", price: 0.8203, change: -0.13 },
  { symbol: "CHF/JPY", name: "Swiss Franc / Japanese Yen", category: "forex", price: 177.23, change: 0.39 },

  // Exotic Forex Pairs
  { symbol: "USD/TRY", name: "US Dollar / Turkish Lira", category: "forex", price: 32.45, change: 1.25 },
  { symbol: "USD/ZAR", name: "US Dollar / South African Rand", category: "forex", price: 18.75, change: 0.67 },
  { symbol: "USD/MXN", name: "US Dollar / Mexican Peso", category: "forex", price: 17.23, change: 0.42 },
  { symbol: "USD/SGD", name: "US Dollar / Singapore Dollar", category: "forex", price: 1.3456, change: 0.18 },
  { symbol: "USD/HKD", name: "US Dollar / Hong Kong Dollar", category: "forex", price: 7.8234, change: 0.05 },
  { symbol: "USD/NOK", name: "US Dollar / Norwegian Krone", category: "forex", price: 10.75, change: 0.32 },
  { symbol: "USD/SEK", name: "US Dollar / Swedish Krona", category: "forex", price: 10.45, change: 0.28 },
  { symbol: "USD/DKK", name: "US Dollar / Danish Krone", category: "forex", price: 6.89, change: 0.15 },
  { symbol: "USD/PLN", name: "US Dollar / Polish Zloty", category: "forex", price: 4.12, change: 0.37 },
  { symbol: "USD/CZK", name: "US Dollar / Czech Koruna", category: "forex", price: 23.45, change: 0.21 },
  { symbol: "USD/HUF", name: "US Dollar / Hungarian Forint", category: "forex", price: 356.78, change: 0.48 },
  { symbol: "USD/THB", name: "US Dollar / Thai Baht", category: "forex", price: 35.67, change: 0.19 },
  { symbol: "USD/INR", name: "US Dollar / Indian Rupee", category: "forex", price: 83.12, change: 0.14 },
  { symbol: "USD/CNY", name: "US Dollar / Chinese Yuan", category: "forex", price: 7.23, change: 0.11 },

  // Major Crypto Pairs
  { symbol: "BTC/USD", name: "Bitcoin", category: "crypto", price: 43250.5, change: 2.8 },
  { symbol: "ETH/USD", name: "Ethereum", category: "crypto", price: 2285.75, change: 3.4 },
  { symbol: "BNB/USD", name: "Binance Coin", category: "crypto", price: 315.42, change: 1.8 },
  { symbol: "XRP/USD", name: "Ripple", category: "crypto", price: 0.6234, change: 5.2 },
  { symbol: "ADA/USD", name: "Cardano", category: "crypto", price: 0.4567, change: -1.3 },
  { symbol: "SOL/USD", name: "Solana", category: "crypto", price: 98.75, change: 4.6 },
  { symbol: "DOGE/USD", name: "Dogecoin", category: "crypto", price: 0.0892, change: 2.1 },
  { symbol: "DOT/USD", name: "Polkadot", category: "crypto", price: 7.34, change: -0.8 },
  { symbol: "MATIC/USD", name: "Polygon", category: "crypto", price: 0.8945, change: 3.2 },
  { symbol: "LTC/USD", name: "Litecoin", category: "crypto", price: 72.45, change: 1.5 },
  { symbol: "AVAX/USD", name: "Avalanche", category: "crypto", price: 36.78, change: -2.1 },
  { symbol: "UNI/USD", name: "Uniswap", category: "crypto", price: 6.23, change: 2.7 },
  { symbol: "LINK/USD", name: "Chainlink", category: "crypto", price: 14.89, change: 1.9 },
  { symbol: "ATOM/USD", name: "Cosmos", category: "crypto", price: 10.45, change: -1.2 },
  { symbol: "XLM/USD", name: "Stellar", category: "crypto", price: 0.1234, change: 0.9 },
  { symbol: "XMR/USD", name: "Monero", category: "crypto", price: 158.92, change: -0.5 },
  { symbol: "ETC/USD", name: "Ethereum Classic", category: "crypto", price: 22.67, change: 1.3 },
  { symbol: "BCH/USD", name: "Bitcoin Cash", category: "crypto", price: 245.78, change: 0.7 },
  { symbol: "ALGO/USD", name: "Algorand", category: "crypto", price: 0.1789, change: 2.4 },
  { symbol: "VET/USD", name: "VeChain", category: "crypto", price: 0.0234, change: 1.1 },
  { symbol: "FIL/USD", name: "Filecoin", category: "crypto", price: 5.67, change: -1.8 },
  { symbol: "TRX/USD", name: "TRON", category: "crypto", price: 0.1045, change: 0.6 },
  { symbol: "EOS/USD", name: "EOS", category: "crypto", price: 0.7823, change: -0.9 },
  { symbol: "AAVE/USD", name: "Aave", category: "crypto", price: 94.56, change: 3.1 },
  { symbol: "GRT/USD", name: "The Graph", category: "crypto", price: 0.1567, change: 2.3 },
  { symbol: "SAND/USD", name: "The Sandbox", category: "crypto", price: 0.4234, change: 1.7 },
  { symbol: "MANA/USD", name: "Decentraland", category: "crypto", price: 0.5678, change: -1.4 },
  { symbol: "AXS/USD", name: "Axie Infinity", category: "crypto", price: 7.89, change: 2.9 },
  { symbol: "SHIB/USD", name: "Shiba Inu", category: "crypto", price: 0.00000923, change: 4.2 },
  { symbol: "APE/USD", name: "ApeCoin", category: "crypto", price: 1.234, change: -2.3 },
  { symbol: "CRV/USD", name: "Curve DAO", category: "crypto", price: 0.6789, change: 1.4 },
  { symbol: "LDO/USD", name: "Lido DAO", category: "crypto", price: 2.345, change: 0.8 },
  { symbol: "ARB/USD", name: "Arbitrum", category: "crypto", price: 1.123, change: 3.5 },
  { symbol: "OP/USD", name: "Optimism", category: "crypto", price: 2.456, change: 2.2 },
  { symbol: "INJ/USD", name: "Injective", category: "crypto", price: 28.45, change: 5.1 },

  { symbol: "US30", name: "Dow Jones Industrial Average", category: "indices", price: 38125.5, change: 0.65 },
  { symbol: "NAS100", name: "Nasdaq 100", category: "indices", price: 16450.2, change: 1.15 },
  { symbol: "SPX500", name: "S&P 500", category: "indices", price: 4785.75, change: 0.82 },
  { symbol: "US2000", name: "Russell 2000", category: "indices", price: 2045.3, change: 0.45 },
  { symbol: "VIX", name: "Volatility Index", category: "indices", price: 13.45, change: -2.15 },
  { symbol: "UK100", name: "FTSE 100", category: "indices", price: 7656.2, change: 0.38 },
  { symbol: "GER40", name: "DAX 40", category: "indices", price: 16823.45, change: 0.92 },
  { symbol: "FRA40", name: "CAC 40", category: "indices", price: 7498.15, change: 0.67 },
  { symbol: "ESP35", name: "IBEX 35", category: "indices", price: 10234.8, change: 0.51 },
  { symbol: "ITA40", name: "FTSE MIB", category: "indices", price: 29876.5, change: 0.73 },
  { symbol: "EU50", name: "Euro Stoxx 50", category: "indices", price: 4523.75, change: 0.88 },
  { symbol: "JPN225", name: "Nikkei 225", category: "indices", price: 33145.8, change: 1.12 },
  { symbol: "HK50", name: "Hang Seng", category: "indices", price: 16789.35, change: 0.95 },
  { symbol: "CHINA50", name: "China A50", category: "indices", price: 13456.9, change: 1.35 },
  { symbol: "AUS200", name: "ASX 200", category: "indices", price: 7623.4, change: 0.58 },
  { symbol: "SING", name: "Singapore STI", category: "indices", price: 3289.65, change: 0.42 },
  { symbol: "IND50", name: "Nifty 50", category: "indices", price: 21234.55, change: 0.78 },
  { symbol: "SAF40", name: "FTSE/JSE Top 40", category: "indices", price: 65432.1, change: 0.33 },
  { symbol: "BRA", name: "Bovespa", category: "indices", price: 125678.9, change: 1.05 },
  { symbol: "MEX", name: "IPC Mexico", category: "indices", price: 56789.45, change: 0.61 },

  // Precious Metals
  { symbol: "XAU/USD", name: "Gold", category: "commodities", price: 2045.3, change: 1.2 },
  { symbol: "XAG/USD", name: "Silver", category: "commodities", price: 24.35, change: 0.85 },
  { symbol: "XPT/USD", name: "Platinum", category: "commodities", price: 945.6, change: 0.45 },
  { symbol: "XPD/USD", name: "Palladium", category: "commodities", price: 1056.75, change: -0.72 },

  // Base Metals
  { symbol: "XCU/USD", name: "Copper", category: "commodities", price: 3.845, change: 0.58 },
  { symbol: "XZUSD", name: "Zinc", category: "commodities", price: 2.567, change: 0.32 },
  { symbol: "XNIUSD", name: "Nickel", category: "commodities", price: 17.234, change: 0.91 },
  { symbol: "XALUSD", name: "Aluminum", category: "commodities", price: 2.345, change: 0.41 },

  // Energy
  { symbol: "WTI", name: "Crude Oil WTI", category: "commodities", price: 78.45, change: 1.35 },
  { symbol: "BRENT", name: "Brent Crude Oil", category: "commodities", price: 82.67, change: 1.28 },
  { symbol: "NGAS", name: "Natural Gas", category: "commodities", price: 2.845, change: -0.95 },
  { symbol: "HEATING", name: "Heating Oil", category: "commodities", price: 2.456, change: 0.67 },
  { symbol: "RBOB", name: "Gasoline", category: "commodities", price: 2.234, change: 0.89 },

  // Agricultural
  { symbol: "WHEAT", name: "Wheat", category: "commodities", price: 645.5, change: 0.72 },
  { symbol: "CORN", name: "Corn", category: "commodities", price: 478.25, change: 0.55 },
  { symbol: "SOYBEAN", name: "Soybeans", category: "commodities", price: 1345.8, change: 0.88 },
  { symbol: "SUGAR", name: "Sugar", category: "commodities", price: 21.45, change: 0.35 },
  { symbol: "COFFEE", name: "Coffee", category: "commodities", price: 185.6, change: 1.12 },
  { symbol: "COCOA", name: "Cocoa", category: "commodities", price: 4567.9, change: 0.93 },
  { symbol: "COTTON", name: "Cotton", category: "commodities", price: 84.35, change: 0.41 },
  { symbol: "LUMBER", name: "Lumber", category: "commodities", price: 567.45, change: -0.68 },
  { symbol: "OJ", name: "Orange Juice", category: "commodities", price: 345.78, change: 0.52 },

  // Livestock
  { symbol: "CATTLE", name: "Live Cattle", category: "commodities", price: 178.5, change: 0.38 },
  { symbol: "HOGS", name: "Lean Hogs", category: "commodities", price: 82.35, change: 0.61 },
]

interface AssetSelectorProps {
  onAssetChange: (asset: Asset) => void
  compact?: boolean
}

export function AssetSelector({ onAssetChange, compact = false }: AssetSelectorProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset>(ASSETS[0])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [assets, setAssets] = useState<Asset[]>(ASSETS)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    onAssetChange(selectedAsset)
    const fetchPrices = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/prices")
        const livePrices = await response.json()

        setAssets((prevAssets) =>
          prevAssets.map((asset) => {
            const liveData = livePrices[asset.symbol]
            if (liveData) {
              return {
                ...asset,
                price: liveData.price,
                change: liveData.change,
              }
            }
            return asset
          }),
        )
      } catch (error) {
        console.error("Error fetching prices:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 30000)

    return () => clearInterval(interval)
  }, [])

  const categories = [
    { id: "all", label: "All Assets" },
    { id: "forex", label: "Forex" },
    { id: "crypto", label: "Crypto" },
    { id: "indices", label: "Indices" },
    { id: "commodities", label: "Commodities" },
  ]

  const filteredAssets =
    selectedCategory === "all" ? assets : assets.filter((asset) => asset.category === selectedCategory)

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset)
    onAssetChange(asset)
  }

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              size="sm"
              className={`transition-all ${
                selectedCategory === category.id ? "bg-primary scale-105" : "hover:scale-105"
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto">
          {filteredAssets.map((asset) => (
            <Card
              key={asset.symbol}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                selectedAsset.symbol === asset.symbol
                  ? "border-primary border-2 shadow-md shadow-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleAssetSelect(asset)}
            >
              <CardContent className="p-3">
                <div className="text-center">
                  <h4 className="font-bold text-sm mb-1">{asset.symbol}</h4>
                  <Badge variant="outline" className="text-xs capitalize mb-2">
                    {asset.category}
                  </Badge>
                  <div className="text-xs font-mono">{asset.price.toLocaleString()}</div>
                  <div className={`text-xs font-semibold ${asset.change > 0 ? "text-accent" : "text-destructive"}`}>
                    {asset.change > 0 ? "+" : ""}
                    {asset.change.toFixed(2)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="container py-24 bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Select Your Trading Asset</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Choose from Forex, Crypto, Indices, or Commodities to analyze and trade
            <span className="ml-2 inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse"></span>
              <span className="text-sm text-accent font-semibold">Live Prices</span>
            </span>
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`transition-all ${
                selectedCategory === category.id ? "bg-primary scale-105" : "hover:scale-105"
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {isLoading && (
          <div className="text-center mb-4">
            <span className="text-sm text-muted-foreground">Updating prices...</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <Card
              key={asset.symbol}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                selectedAsset.symbol === asset.symbol
                  ? "border-primary border-2 shadow-lg shadow-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleAssetSelect(asset)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{asset.symbol}</h3>
                    <p className="text-sm text-muted-foreground">{asset.name}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {asset.category}
                  </Badge>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Current Price</div>
                    <div className="text-2xl font-bold font-mono">{asset.price.toLocaleString()}</div>
                  </div>
                  <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                      asset.change > 0 ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {asset.change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="font-semibold">
                      {asset.change > 0 ? "+" : ""}
                      {asset.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedAsset && (
          <Card className="mt-8 border-primary/30 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Currently Selected</div>
                  <div className="text-2xl font-bold">
                    {selectedAsset.symbol} - {selectedAsset.name}
                  </div>
                </div>
                <Badge className="bg-accent text-lg px-4 py-2">Active</Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}

export { ASSETS }
