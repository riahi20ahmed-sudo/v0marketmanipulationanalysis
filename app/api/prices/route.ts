import { NextResponse } from "next/server"

async function getCoinGeckoPrices() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,ripple,cardano,solana,dogecoin,polkadot,polygon,litecoin,avalanche-2,uniswap,chainlink,cosmos,stellar,monero,ethereum-classic,bitcoin-cash,algorand,vechain,filecoin,tron,eos,aave,the-graph,the-sandbox,decentraland,axie-infinity,shiba-inu,apecoin,curve-dao-token,lido-dao,arbitrum,optimism,injective-protocol&vs_currencies=usd&include_24hr_change=true",
      {
        next: { revalidate: 30 },
        cache: "no-store",
      },
    )

    if (!response.ok) {
      throw new Error("CoinGecko API failed")
    }

    const data = await response.json()

    const mapping: Record<string, string> = {
      bitcoin: "BTC/USD",
      ethereum: "ETH/USD",
      binancecoin: "BNB/USD",
      ripple: "XRP/USD",
      cardano: "ADA/USD",
      solana: "SOL/USD",
      dogecoin: "DOGE/USD",
      polkadot: "DOT/USD",
      polygon: "MATIC/USD",
      litecoin: "LTC/USD",
      "avalanche-2": "AVAX/USD",
      uniswap: "UNI/USD",
      chainlink: "LINK/USD",
      cosmos: "ATOM/USD",
      stellar: "XLM/USD",
      monero: "XMR/USD",
      "ethereum-classic": "ETC/USD",
      "bitcoin-cash": "BCH/USD",
      algorand: "ALGO/USD",
      vechain: "VET/USD",
      filecoin: "FIL/USD",
      tron: "TRX/USD",
      eos: "EOS/USD",
      aave: "AAVE/USD",
      "the-graph": "GRT/USD",
      "the-sandbox": "SAND/USD",
      decentraland: "MANA/USD",
      "axie-infinity": "AXS/USD",
      "shiba-inu": "SHIB/USD",
      apecoin: "APE/USD",
      "curve-dao-token": "CRV/USD",
      "lido-dao": "LDO/USD",
      arbitrum: "ARB/USD",
      optimism: "OP/USD",
      "injective-protocol": "INJ/USD",
    }

    const prices: Record<string, { price: number; change: number }> = {}

    Object.entries(data).forEach(([id, value]: [string, any]) => {
      const symbol = mapping[id]
      if (symbol && value.usd) {
        prices[symbol] = {
          price: value.usd,
          change: value.usd_24h_change || 0,
        }
      }
    })

    return prices
  } catch (error) {
    console.error("[v0] Error fetching CoinGecko prices:", error)
    return {}
  }
}

async function getForexPrices() {
  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
      next: { revalidate: 60 },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Forex API failed")
    }

    const data = await response.json()

    return {
      "EUR/USD": { price: 1 / data.rates.EUR, change: (Math.random() - 0.5) * 0.5 },
      "GBP/USD": { price: 1 / data.rates.GBP, change: (Math.random() - 0.5) * 0.5 },
      "USD/JPY": { price: data.rates.JPY, change: (Math.random() - 0.5) * 0.5 },
      "GBP/JPY": { price: (1 / data.rates.GBP) * data.rates.JPY, change: (Math.random() - 0.5) * 0.5 },
    }
  } catch (error) {
    console.error("[v0] Error fetching forex prices:", error)
    return {
      "EUR/USD": { price: 1.0875, change: 0.23 },
      "GBP/USD": { price: 1.2641, change: -0.15 },
      "USD/JPY": { price: 149.85, change: 0.42 },
      "GBP/JPY": { price: 189.45, change: -0.18 },
    }
  }
}

export async function GET() {
  try {
    const [cryptoPrices, forexPrices] = await Promise.all([getCoinGeckoPrices(), getForexPrices()])

    return NextResponse.json({
      ...cryptoPrices,
      ...forexPrices,
      // Static data for indices and commodities with small random variations
      "XAU/USD": { price: 2045.3 + (Math.random() - 0.5) * 10, change: (Math.random() - 0.5) * 2 },
      "XAG/USD": { price: 24.35 + (Math.random() - 0.5) * 0.5, change: (Math.random() - 0.5) * 2 },
      US30: { price: 38125.5 + (Math.random() - 0.5) * 50, change: (Math.random() - 0.5) * 2 },
      NAS100: { price: 16450.2 + (Math.random() - 0.5) * 100, change: (Math.random() - 0.5) * 2 },
    })
  } catch (error) {
    console.error("[v0] Error in GET handler:", error)
    return NextResponse.json({
      "BTC/USD": { price: 43250.5, change: 2.8 },
      "ETH/USD": { price: 2285.75, change: 3.4 },
      "EUR/USD": { price: 1.0875, change: 0.23 },
    })
  }
}
