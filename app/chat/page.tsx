"use client"

import { useChat } from "ai/react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useMemo, useCallback } from "react"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: {
      creditScore: typeof window !== 'undefined' ? localStorage.getItem('taxsage_user_credit_score') : null,
      creditAnalysisDate: typeof window !== 'undefined' ? localStorage.getItem('taxsage_credit_analysis_date') : null,
    }
  })

  const headerPills = useMemo(() => {
    let creditStatus = "Not Analyzed";
    let creditColor = "text-destructive";
    
    if (typeof window !== 'undefined') {
      const creditScore = localStorage.getItem('taxsage_user_credit_score');
      if (creditScore && creditScore !== 'null') {
        const score = parseInt(creditScore);
        creditStatus = `${score}`;
        creditColor = score >= 720 ? "text-accent" : score >= 680 ? "text-primary" : "text-destructive";
      }
    }
    
    return [
      { label: "Credit Score", value: creditStatus, color: creditColor },
      { label: "Security", value: "Active", color: "text-accent" },
      { label: "Status", value: "Online", color: "text-primary" },
    ];
  }, [])

  return (
    <div className="animated-bg" style={{
      minHeight: '100vh',
      position: 'relative'
    }}>
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(1deg); }
          66% { transform: translateY(-12px) rotate(-1deg); }
        }
        .animated-bg {
          background: linear-gradient(-45deg, #1e1b4b, #312e81, #3730a3, #1e40af, #1e3a8a);
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
        }
        .floating-orb {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          animation: float 6s ease-in-out infinite;
          z-index: 0;
        }
        .floating-orb:nth-child(1) {
          width: 100px;
          height: 100px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        .floating-orb:nth-child(2) {
          width: 150px;
          height: 150px;
          top: 20%;
          right: 10%;
          animation-delay: 2s;
        }
        .floating-orb:nth-child(3) {
          width: 80px;
          height: 80px;
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }
        .floating-orb:nth-child(4) {
          width: 120px;
          height: 120px;
          bottom: 10%;
          right: 20%;
          animation-delay: 1s;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
        }
      `}</style>

      {/* Floating Orbs */}
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>

    <main className="min-h-screen px-4 py-6 md:px-8 md:py-10" style={{ position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 ring-1 ring-blue-400/40 flex items-center justify-center shadow-lg">
            <img 
              src="/icon.svg" 
              alt="TaxSage Logo" 
              className="w-6 h-6"
              onError={(e) => {
                // Fallback to text if icon fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <span className="text-blue-400 font-bold text-sm hidden">TS</span>
          </div>
          <h1 className="text-pretty text-xl font-semibold text-white">TaxSage AI Chat</h1>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {headerPills.map((p) => (
            <span
              key={p.label}
              className={cn("pill", "flex items-center gap-2 bg-white/5 text-foreground/90")}
              aria-label={p.label}
            >
              <span className="text-foreground/60">{p.label}:</span>
              <span className={cn(p.color, "font-medium")}>{p.value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="grid gap-6 md:grid-cols-[1fr_340px]">
        {/* Chat panel */}
        <GlassPanel className="p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground/95">TaxSage AI Assistant</h2>
            <Button
              variant="secondary"
              className="bg-primary/15 text-foreground hover:bg-primary/25"
              onClick={() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
              }}
            >
              Jump to latest
            </Button>
          </div>

          <div className="glass relative mb-4 max-h-[60vh] overflow-y-auto bg-white/2 p-3 md:p-4">
            <ul className="space-y-4">
              {messages.length === 0 && (
                <li className="text-sm text-foreground/70">
                  Hello! I'm TaxSage AI, your personal CA and financial advisor. Ask me about tax planning, loan eligibility, investments, or budgeting. 
                  {typeof window !== 'undefined' && !localStorage.getItem('taxsage_user_credit_score') && 
                    " For loan advice, please first analyze your credit score in the Credit Analysis section."
                  }
                </li>
              )}
              {messages.map((m) => (
                <li key={m.id} className="flex gap-3">
                  <div
                    className={cn(
                      "h-6 w-6 shrink-0 rounded-md",
                      m.role === "user" ? "bg-accent/25 ring-1 ring-accent/40" : "bg-primary/25 ring-1 ring-primary/40",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs uppercase tracking-wide text-foreground/60">
                      {m.role === "user" ? "You" : "TaxSage AI"}
                    </div>
                    <div className="prose prose-invert mt-1 max-w-none text-pretty text-sm leading-6 text-foreground/95">
                      {m.content}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 rounded-xl border border-border/70 bg-white/5 p-2 backdrop-blur md:p-3"
          >
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="e.g., My monthly income is ₹75,000, rent ₹15,000, SIP ₹5,000. Help me plan for a ₹6L car in 12 months."
              className="min-h-12 w-full resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-foreground/40"
              rows={3}
              aria-label="Type your financial question"
            />
            <Button
              type="submit"
              disabled={isLoading || input.trim().length === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? "Thinking…" : "Ask TaxSage"}
            </Button>
          </form>
        </GlassPanel>

        {/* Sidebar */}
        <div className="space-y-6">
          <GlassPanel className="p-4 md:p-5">
            <h3 className="mb-2 text-sm font-semibold text-foreground/90">Spending Signals</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <span className="text-foreground/70">Entertainment cap</span>
                <span className="text-destructive font-semibold">₹2,500</span>
              </li>
              <li className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <span className="text-foreground/70">Dining cap</span>
                <span className="text-destructive font-semibold">₹3,000</span>
              </li>
              <li className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <span className="text-foreground/70">Savings target</span>
                <span className="text-accent font-semibold">₹15,000</span>
              </li>
            </ul>
          </GlassPanel>

          <GlassPanel className="p-4 md:p-5">
            <h3 className="mb-2 text-sm font-semibold text-foreground/90">Quick Prompts</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "What loans can I get with my credit score?",
                "Compare old vs new tax regime for ₹12L",
                "Help me plan for a ₹6L car purchase",
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    const el = document.querySelector("textarea")
                    if (el) {
                      ;(el as HTMLTextAreaElement).value = q
                      el.dispatchEvent(new Event("input", { bubbles: true }))
                    }
                  }}
                  className="pill hover:bg-white/10"
                >
                  {q}
                </button>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </main>
    </div>
  )
}
