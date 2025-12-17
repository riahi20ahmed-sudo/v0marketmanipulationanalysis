"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, BarChart3 } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { LanguageSelector } from "@/components/language-selector"
import { type Language, translations } from "@/lib/translations"

interface HeaderProps {
  language: Language
  onLanguageChange: (lang: Language) => void
}

export function Header({ language, onLanguageChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = translations[language].header

  const scrollToAnalysis = () => {
    const element = document.getElementById("market-analysis")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl group">
          <div className="p-1 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all overflow-hidden">
            <Image
              src="/bot-logo.png"
              alt="SmartMoney Bot Logo"
              width={32}
              height={32}
              className="object-contain group-hover:scale-110 transition-transform"
            />
          </div>
          <span className="text-balance">SmartMoney Bot</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="#concepts"
            className="text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            {t.concepts}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
          <Link
            href="#strategy"
            className="text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            {t.strategy}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
          <Link href="#code" className="text-muted-foreground hover:text-foreground transition-colors relative group">
            {t.implementation}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
          <Link
            href="#backtesting"
            className="text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            {t.backtesting}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
          <button
            onClick={scrollToAnalysis}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            <BarChart3 className="h-4 w-4" />
            {t.analysis}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSelector currentLanguage={language} onLanguageChange={onLanguageChange} />
          <Button className="hidden md:inline-flex hover:scale-105 transition-transform">{t.getStarted}</Button>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <nav className="container py-4 flex flex-col gap-4">
            <Link
              href="#concepts"
              className="text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.concepts}
            </Link>
            <Link
              href="#strategy"
              className="text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.strategy}
            </Link>
            <Link
              href="#code"
              className="text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.implementation}
            </Link>
            <Link
              href="#backtesting"
              className="text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.backtesting}
            </Link>
            <button
              onClick={scrollToAnalysis}
              className="text-muted-foreground hover:text-foreground transition-colors py-2 text-left flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              {t.analysis}
            </button>
            <Button className="w-full mt-2">{t.getStarted}</Button>
          </nav>
        </div>
      )}
    </header>
  )
}
