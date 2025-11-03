"use client"

import { useRef, useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Compact INR formatter (L = Lakh, Cr = Crore)
function formatINRCompact(v: number) {
  if (v >= 1_00_00_000) return "₹" + (v / 1_00_00_000).toFixed(2) + "Cr"
  if (v >= 1_00_000) return "₹" + (v / 1_00_000).toFixed(2) + "L"
  if (v >= 1_000) return "₹" + (v / 1_000).toFixed(1) + "K"
  return "₹" + v
}

export default function DashboardPage() {
  const { data: analytics, mutate } = useSWR("/api/analytics", fetcher)
  const { data: me } = useSWR("/api/me", fetcher)
  const [category, setCategory] = useState("entertainment")
  const [amount, setAmount] = useState<number>(0)
  const [desc, setDesc] = useState("")
  const [level, setLevel] = useState<"expensive" | "moderate" | "basic">("moderate")

  const [chatInput, setChatInput] = useState("")
  const [chat, setChat] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const abortRef = useRef<AbortController | null>(null)

  async function addExpense() {
    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, amount, description: desc, level }),
    })
    setAmount(0)
    setDesc("")
    mutate()
  }

  async function sendChat() {
    const content = chatInput.trim()
    if (!content) return
    
    // Store current input for roadmap detection
    setCurrentInput(content)
    
    setChat((c) => [...c, { role: "user", content }])
    setChatInput("")
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
        signal: abortRef.current.signal,
      })
      
      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json()
        } catch {
          errorData = { error: `HTTP ${res.status}`, details: await res.text() }
        }
        console.error("Chat API Error:", errorData)
        setChat((c) => [...c, { role: "assistant", content: "Sorry, I couldn't respond right now. Please check your API key." }])
        return
      }
      
      const data = await res.json()
      const responseContent = data.content || "Sorry, I couldn't generate a response."
      setChat((c) => [...c, { role: "assistant", content: responseContent }])
      
      // Check if the user asked for a roadmap
      const inputLower = content.toLowerCase();
      const userAskedForRoadmap = inputLower.includes('roadmap') || 
                                 inputLower.includes('make a plan') ||
                                 inputLower.includes('create a plan') ||
                                 inputLower.includes('help me plan') ||
                                 inputLower.includes('strategy') ||
                                 (inputLower.includes('plan') && (inputLower.includes('buy') || inputLower.includes('save') || inputLower.includes('invest')));
      
      if (userAskedForRoadmap && responseContent) {
        // Extract title from user message
        let title = 'Roadmap';
        const afterRoadmap = inputLower.split('roadmap')[1]?.trim() || 
                           inputLower.split('plan')[1]?.trim() ||
                           inputLower.split('strategy')[1]?.trim();
        if (afterRoadmap) {
          title = `Roadmap: ${afterRoadmap.charAt(0).toUpperCase() + afterRoadmap.slice(1)}`;
        }
        
        // Create roadmap with metadata
        const roadmapData = {
          id: Date.now().toString(),
          title,
          description: responseContent.trim(),
          createdAt: new Date().toISOString(),
          theme: 'default',
          exported: false
        };
        
        // Save to localStorage
        const key = 'taxsage_roadmaps';
        let roadmaps = [];
        try {
          const existing = localStorage.getItem(key);
          if (existing) roadmaps = JSON.parse(existing);
        } catch {}
        roadmaps.push(roadmapData);
        localStorage.setItem(key, JSON.stringify(roadmaps));
        
        // Show export button in chat for this message
        setTimeout(() => {
          const chatContainer = document.querySelector('.dashboard-chat-container');
          if (chatContainer) {
            const messageElements = chatContainer.querySelectorAll('[data-message-role="assistant"]');
            const lastAssistantMessage = messageElements[messageElements.length - 1];
            if (lastAssistantMessage && !lastAssistantMessage.querySelector('.export-roadmap-btn')) {
              const exportBtn = document.createElement('button');
              exportBtn.className = 'export-roadmap-btn bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm mt-3 mr-2 transition-colors';
              exportBtn.textContent = '📋 Export to Roadmap';
              exportBtn.onclick = () => {
                roadmapData.exported = true;
                const updatedRoadmaps = roadmaps.map((r: any) => r.id === roadmapData.id ? roadmapData : r);
                localStorage.setItem(key, JSON.stringify(updatedRoadmaps));
                window.dispatchEvent(new Event('taxsage_roadmap_updated'));
                exportBtn.textContent = '✅ Exported';
                exportBtn.disabled = true;
                exportBtn.className = 'export-roadmap-btn bg-green-600 text-white px-3 py-1 rounded text-sm mt-3 mr-2 cursor-not-allowed opacity-75';
              };
              lastAssistantMessage.appendChild(exportBtn);
            }
          }
        }, 100);
        
        // Trigger reload event for roadmap page
        window.dispatchEvent(new Event('taxsage_roadmap_updated'));
      }
      
    } catch (error) {
      console.error("Chat Error:", error)
      setChat((c) => [...c, { role: "assistant", content: "Sorry, I couldn't respond right now." }])
    }
  }

  return (
    <div className="animated-bg" style={{ minHeight: '100vh', position: 'relative' }}>
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
          animation: gradientMove 20s ease infinite;
        }
        .glass-panel {
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(25px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .floating-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 70%, transparent 100%);
          filter: blur(1px);
          animation: float 8s ease-in-out infinite;
        }

        /* Summary metrics responsive fixes */
        .summary-metrics .metric-card { position:relative; display:flex; flex-direction:column; justify-content:center; }
        .summary-metrics .metric-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .08em;
          opacity:.75;
          line-height:1;
          margin-bottom:4px;
          white-space:nowrap;
        }
        .summary-metrics .metric-value {
          font-weight:600;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
          font-size: clamp(.85rem, 3.2vw, 1.05rem);
          line-height:1.15;
          max-width:100%;
        }
        /* Allow a soft wrap if still overflows (fallback) */
        .summary-metrics .metric-value.long {
          white-space:normal;
          word-break:break-word;
        }
        @media (max-width:640px){
          .summary-metrics { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .summary-metrics .metric-card { padding:.6rem .55rem; }
          .summary-metrics .metric-value { font-size: clamp(.8rem, 4vw, .95rem); }
        }
        @media (max-width:420px){
          .summary-metrics { grid-template-columns: repeat(2,minmax(0,1fr)); gap:.55rem; }
          .summary-metrics .metric-card { padding:.5rem .45rem; }
          .summary-metrics .metric-value { font-size: clamp(.78rem, 4.3vw, .9rem); }
        }

        /* Mobile quick nav buttons */
        .mobile-quick {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }
        .mobile-quick a {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 0.9rem;
          font-size: 0.8rem;
          font-weight: 500;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.12);
          border-radius: 0.75rem;
          backdrop-filter: blur(12px);
          color: white;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          min-width: fit-content;
        }
        .mobile-quick a:hover {
          background: rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.3);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .mobile-quick a:active { 
          transform: translateY(0px) scale(0.98); 
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        /* Desktop navigation improvements */
        .desktop-nav {
          display: none;
        }
        .desktop-nav a {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 0.75rem;
          font-weight: 500;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.25s ease;
          backdrop-filter: blur(16px);
          border: 1px solid transparent;
          position: relative;
          overflow: hidden;
        }
        .desktop-nav a::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .desktop-nav a:hover::before {
          opacity: 1;
        }
        .desktop-nav .roadmap-btn {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.25);
          color: white;
        }
        .desktop-nav .roadmap-btn:hover {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.35);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        .desktop-nav .credit-btn {
          background: linear-gradient(135deg, rgba(147,51,234,0.15) 0%, rgba(59,130,246,0.15) 100%);
          border-color: rgba(147,51,234,0.4);
          color: white;
          box-shadow: 0 4px 15px rgba(147,51,234,0.1);
        }
        .desktop-nav .credit-btn:hover {
          background: linear-gradient(135deg, rgba(147,51,234,0.25) 0%, rgba(59,130,246,0.25) 100%);
          border-color: rgba(147,51,234,0.6);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(147,51,234,0.2);
        }

        /* Responsive breakpoints */
        @media (min-width: 768px) {
          .mobile-quick { display: none; }
          .desktop-nav { 
            display: flex; 
            align-items: center; 
            gap: 1rem; 
          }
        }

        /* Better mobile spacing */
        @media (max-width: 480px) {
          .mobile-quick {
            gap: 0.6rem;
            margin-top: 0.6rem;
          }
          .mobile-quick a {
            padding: 0.6rem 0.8rem;
            font-size: 0.75rem;
            gap: 0.4rem;
          }
        }

        /* Mobile logout button spacing */
        @media (max-width: 767px) {
          .mobile-logout {
            margin-top: 2.5rem;
          }
        }

        /* Export button styling */
        .export-roadmap-btn {
          display: inline-block;
          margin-top: 0.75rem;
          padding: 0.5rem 0.75rem;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
        }
        .export-roadmap-btn:hover {
          background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
        }
        .export-roadmap-btn:disabled {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          cursor: not-allowed;
          opacity: 0.8;
        }
      `}</style>
      
      {/* Floating Background Elements */}
      <div className="floating-orb" style={{
        top: '10%',
        left: '10%',
        width: '120px',
        height: '120px',
        animationDelay: '0s'
      }}></div>
      
      <div className="floating-orb" style={{
        top: '60%',
        right: '15%',
        width: '100px',
        height: '100px',
        animationDelay: '2s',
        animationDirection: 'reverse'
      }}></div>
      
      <div className="floating-orb" style={{
        bottom: '25%',
        left: '20%',
        width: '80px',
        height: '80px',
        animationDelay: '4s'
      }}></div>

      <main className="p-6 max-w-5xl mx-auto relative z-10">
      {/* Navigation Header */}
      <nav className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 ring-1 ring-blue-400/40 flex items-center justify-center shadow-lg">
                <img
                  src="/icon.svg"
                  alt="TaxSage Logo"
                  className="w-6 h-6"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = target.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'block'
                  }}
                />
                <span className="text-blue-400 font-bold text-sm hidden">TS</span>
              </div>
              <h1 className="text-xl font-semibold text-white">TaxSage</h1>
            </div>
            <div className="mobile-quick">
              <a href="/roadmap" aria-label="Roadmap">
                <span>Roadmap</span>
              </a>
              <a href="/credit-analysis" aria-label="Credit Score">
                <span>Credit</span>
              </a>
            </div>
          </div>
          <div className="desktop-nav">
            <a href="/roadmap" className="roadmap-btn" aria-label="Financial Roadmap">
              <span>Roadmap</span>
            </a>
            <a href="/credit-analysis" className="credit-btn" aria-label="Credit Score Analysis">
              <span>Credit Score</span>
            </a>
          </div>
        </div>
        <Button 
          variant="outline"
          className="mobile-logout"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" })
            window.location.href = "/login"
          }}
        >
          Logout
        </Button>
      </nav>

      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-balance">
            Welcome{me?.profile?.fullName ? `, ${me.profile.fullName}` : ""}
          </h2>
          {/* Show sample data button if user has no data */}
          {analytics?.summary && 
           analytics.summary.monthlyIncome === 0 && 
           analytics.summary.monthlyBudget === 0 && (
            <Button
              onClick={async () => {
                try {
                  const res = await fetch("/api/data/sample", { method: "POST" })
                  if (res.ok) {
                    mutate() // Refresh analytics
                    alert("Sample data added successfully! Refresh the page to see your demo financial data.")
                  } else {
                    alert("Failed to add sample data")
                  }
                } catch (error) {
                  console.error("Error adding sample data:", error)
                  alert("Error adding sample data")
                }
              }}
              variant="outline"
            >
              Load Demo Data
            </Button>
          )}
        </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 glass-panel" style={{color: 'white'}}>
          <CardHeader>
            <CardTitle style={{color: 'white'}}>Notifications & Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {analytics?.summary && (
              <div className="summary-metrics grid grid-cols-2 min-[480px]:grid-cols-3 gap-3">
                <div className="metric-card p-3 border rounded" title={`Income: ₹${analytics.summary.monthlyIncome?.toLocaleString?.()}`}>
                  <div className="metric-label">Income</div>
                  <div className={"metric-value" + (String(analytics.summary.monthlyIncome).length > 9 ? " long" : "")}>
                    {formatINRCompact(analytics.summary.monthlyIncome)}
                  </div>
                </div>
                <div className="metric-card p-3 border rounded" title={`Budget: ₹${analytics.summary.monthlyBudget?.toLocaleString?.()}`}>
                  <div className="metric-label">Budget</div>
                  <div className={"metric-value" + (String(analytics.summary.monthlyBudget).length > 9 ? " long" : "")}>
                    {formatINRCompact(analytics.summary.monthlyBudget)}
                  </div>
                </div>
                <div className="metric-card p-3 border rounded" title={`Spent: ₹${analytics.summary.monthlySpent?.toLocaleString?.()}`}>
                  <div className="metric-label">Spent</div>
                  <div className={"metric-value" + (String(analytics.summary.monthlySpent).length > 9 ? " long" : "")}>
                    {formatINRCompact(analytics.summary.monthlySpent)}
                  </div>
                </div>
              </div>
            )}
            <div className="grid gap-2">
              {(analytics?.notifications || []).map((n: string, i: number) => (
                <div key={i} className="text-sm p-2 rounded bg-muted">
                  {n}
                </div>
              ))}
              {(!analytics?.notifications || analytics.notifications.length === 0) && (
                <div className="text-sm text-muted-foreground">No alerts yet. Add expenses to see insights.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel" style={{color: 'white'}}>
          <CardHeader>
            <CardTitle style={{color: 'white'}}>Add Expense</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Amount (₹)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <Label>Level</Label>
              <select
                className="border rounded h-10 px-3"
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
              >
                <option value="basic">Basic</option>
                <option value="moderate">Moderate</option>
                <option value="expensive">Expensive</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
            </div>
            <Button onClick={addExpense}>Save Expense</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel" style={{color: 'white'}}>
        <CardHeader>
          <CardTitle style={{color: 'white'}}>Chat with your CA</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="h-64 border border-white/20 rounded p-3 overflow-auto space-y-3 bg-white/5 backdrop-blur-sm dashboard-chat-container">
            {chat.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div
                  data-message-role={m.role}
                  className={`inline-block max-w-full md:max-w-2xl px-4 py-3 rounded-2xl shadow-md whitespace-pre-wrap break-words text-base leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-blue-500/30 to-blue-700/30 border border-blue-400/30 text-blue-100"
                      : "bg-gradient-to-br from-white/20 to-white/10 border border-white/20 text-white"
                  }`}
                  style={{ textAlign: "left", fontFamily: m.role === "user" ? undefined : 'inherit' }}
                >
                  {m.role === "assistant" ? (
                    <ReactMarkdown
                      components={{
                        p: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLParagraphElement>>) => <p style={{ marginBottom: 12 }} {...props}>{props.children}</p>,
                        ul: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLUListElement>>) => <ul style={{ marginBottom: 12, paddingLeft: 20 }} {...props}>{props.children}</ul>,
                        ol: (props: React.PropsWithChildren<React.OlHTMLAttributes<HTMLOListElement>>) => <ol style={{ marginBottom: 12, paddingLeft: 20 }} {...props}>{props.children}</ol>,
                        li: (props: React.PropsWithChildren<React.LiHTMLAttributes<HTMLLIElement>>) => <li style={{ marginBottom: 4 }} {...props}>{props.children}</li>,
                        strong: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) => <strong style={{ color: '#facc15' }} {...props}>{props.children}</strong>,
                        em: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) => <em style={{ color: '#a5b4fc' }} {...props}>{props.children}</em>,
                        code: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) => <code style={{ background: '#22223b', color: '#facc15', borderRadius: 4, padding: '2px 6px', fontSize: '0.95em' }} {...props}>{props.children}</code>,
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Ask for advice (e.g., “How to afford a ₹15 lakh car in 12 months?”)"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
            />
            <Button onClick={sendChat}>Send</Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </main>
    </div>
  )
}
