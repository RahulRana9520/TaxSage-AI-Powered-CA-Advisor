"use client"













import { useEffect, useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { countryCodes } from "@/lib/country-codes"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function OnboardingPage() {
  const router = useRouter()
  const { data: me } = useSWR("/api/me", fetcher)
  const [step, setStep] = useState(1)

  // Profile
  const [fullName, setFullName] = useState("")
  const [age, setAge] = useState<number | undefined>()
  const [location, setLocation] = useState("")
  const [countryCode, setCountryCode] = useState("+91")
  const [phoneNumber, setPhoneNumber] = useState("") // local part only
  const [dependents, setDependents] = useState<number | undefined>()
  const [filingStatus, setFilingStatus] = useState<"single" | "married" | "huf" | "other">("single")

  // Income
  const [incomes, setIncomes] = useState<
    { source: string; amount: number; frequency: "monthly" | "weekly" | "yearly" }[]
  >([{ source: "Salary", amount: 0, frequency: "monthly" }])

  // Budget
  const [budget, setBudget] = useState<{ category: string; monthlyAmount: number }[]>([
    { category: "housing", monthlyAmount: 0 },
    { category: "food", monthlyAmount: 0 },
    { category: "transport", monthlyAmount: 0 },
    { category: "entertainment", monthlyAmount: 0 },
    { category: "investments", monthlyAmount: 0 },
  ])

  // Goals
  const [goals, setGoals] = useState<{ name: string; targetAmount: number; targetDate: string }[]>([
    {
      name: "Buy a car",
      targetAmount: 1500000,
      targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
  ])

  useEffect(() => {
    if (me?.user?.name) setFullName(me.user.name)
  }, [me])

  async function saveProfile() {
    // Combine country code and phone number for E.164
    const fullPhone = countryCode + phoneNumber.replace(/^0+/, "");
    await fetch("/api/data/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, age, location, phoneNumber: fullPhone, dependents, filingStatus }),
    })
    setStep(2)
  }

  async function saveIncome() {
    await fetch("/api/data/income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(incomes),
    })
    setStep(3)
  }

  async function saveBudget() {
    await fetch("/api/data/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(budget),
    })
    setStep(4)
  }

  async function saveGoals() {
    await fetch("/api/data/goal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goals),
    })
    router.push("/dashboard")
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

        /* Mobile enhancements for Step 2 (Income) */
        @media (max-width: 640px) {
          .income-row {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 0.75rem;
            padding: 0.75rem 0.85rem;
          }
          .income-row label {
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            opacity: .8;
          }
          .income-actions {
            flex-direction: column;
            gap: 0.6rem;
          }
          .income-actions button {
            width: 100%;
          }
        }

        /* Mobile enhancements for Step 4 */
        @media (max-width: 640px) {
          .goal-row {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 0.75rem;
            padding: 0.75rem 0.85rem;
          }
          .goal-row label {
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            opacity: .8;
          }
          .goal-actions {
            flex-direction: column;
            gap: 0.6rem;
          }
            .goal-actions button {
              width: 100%;
            }
        }

        /* (Optional) Reusable metric styles – copy to dashboard */
        .metrics { display: grid; gap: 1rem; }
        .metric-tile { position: relative; }
        @media (max-width: 640px){
          .metrics { grid-template-columns: repeat(2,minmax(0,1fr)); }
        }
        @media (max-width: 420px){
          .metrics { grid-template-columns: 1fr; }
          .metric-tile { padding: 0.65rem 0.7rem; }
        }
      `}</style>

      {/* Floating Orbs */}
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>

    <main className="min-h-dvh flex items-center justify-center p-6" style={{ position: 'relative', zIndex: 1 }}>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-balance">Set up your CA Advisor</CardTitle>
          <CardDescription>Step {step} of 4</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {step === 1 && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Full name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={age ?? "0"}
                    onFocus={(e) => {
                      if (e.target.value === "0") {
                        setAge(undefined)
                        e.target.select()
                      }
                    }}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Dependents</Label>
                  <Input
                    type="number"
                    value={dependents ?? "0"}
                    onFocus={(e) => {
                      if (e.target.value === "0") {
                        setDependents(undefined)
                        e.target.select()
                      }
                    }}
                    onChange={(e) => setDependents(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Phone Number</Label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger size="default" style={{ width: 120, minWidth: 90 }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ maxHeight: 300, overflowY: 'auto' }}>
                      {countryCodes.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.name} ({c.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="9876543210"
                    pattern="^\\d{8,15}$"
                    required
                    style={{ flex: 1 }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">Select your country and enter your phone number. Country code will be used for tax advice.</span>
              </div>
              <div className="grid gap-2">
                <Label>Filing Status</Label>
                <select
                  className="border rounded h-10 px-3"
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value as any)}
                >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="huf">HUF</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Button onClick={saveProfile}>Continue</Button>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4">
              {incomes.map((inc, idx) => (
                <div key={idx} className="income-row grid gap-4 md:grid-cols-3">
                  <div className="grid gap-1">
                    <Label>Source</Label>
                    <Input
                      value={inc.source}
                      onChange={(e) => {
                        const c = [...incomes]
                        c[idx].source = e.target.value
                        setIncomes(c)
                      }}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={inc.amount === 0 ? "0" : inc.amount}
                      onFocus={(e) => {
                        if (e.target.value === "0") {
                          const c = [...incomes]
                          c[idx].amount = 0
                          setIncomes(c)
                          e.target.select()
                        }
                      }}
                      onChange={(e) => {
                        const c = [...incomes]
                        c[idx].amount = Number(e.target.value) || 0
                        setIncomes(c)
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label>Frequency</Label>
                    <select
                      className="border rounded h-10 px-3"
                      value={inc.frequency}
                      onChange={(e) => {
                        const c = [...incomes]
                        c[idx].frequency = e.target.value as any
                        setIncomes(c)
                      }}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
              ))}
              <div className="income-actions flex gap-3 md:justify-start">
                <Button
                  variant="secondary"
                  onClick={() => setIncomes([...incomes, { source: "", amount: 0, frequency: "monthly" }])}
                >
                  Add income
                </Button>
                <Button onClick={saveIncome}>Continue</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4">
              {budget.map((b, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Category</Label>
                    <Input
                      value={b.category}
                      onChange={(e) => {
                        const c = [...budget]
                        c[idx].category = e.target.value
                        setBudget(c)
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Monthly Amount</Label>
                    <Input
                      type="number"
                      value={b.monthlyAmount === 0 ? "0" : b.monthlyAmount}
                      onFocus={(e) => {
                        if (e.target.value === "0") {
                          const c = [...budget]
                          c[idx].monthlyAmount = 0
                          setBudget(c)
                          e.target.select()
                        }
                      }}
                      onChange={(e) => {
                        const c = [...budget]
                        c[idx].monthlyAmount = Number(e.target.value) || 0
                        setBudget(c)
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setBudget([...budget, { category: "", monthlyAmount: 0 }])}>
                  Add category
                </Button>
                <Button onClick={saveBudget}>Continue</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-4">
              {goals.map((g, idx) => (
                <div key={idx} className="goal-row grid gap-4 md:grid-cols-3">
                  <div className="grid gap-1">
                    <Label>Goal</Label>
                    <Input
                      value={g.name}
                      onChange={(e) => {
                        const c = [...goals]
                        c[idx].name = e.target.value
                        setGoals(c)
                      }}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label>Target Amount (₹)</Label>
                    <Input
                      type="number"
                      value={g.targetAmount === 0 ? "0" : g.targetAmount}
                      onFocus={(e) => {
                        if (e.target.value === "0") {
                          const c = [...goals]
                          c[idx].targetAmount = 0
                          setGoals(c)
                          e.target.select()
                        }
                      }}
                      onChange={(e) => {
                        const c = [...goals]
                        c[idx].targetAmount = Number(e.target.value) || 0
                        setGoals(c)
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label>Target Date</Label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={g.targetDate}
                        onChange={(e) => {
                          const c = [...goals]
                          c[idx].targetDate = e.target.value
                          setGoals(c)
                        }}
                        className="pr-10"
                      />
                      <svg
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
              <div className="goal-actions flex gap-3 md:justify-start">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setGoals([
                      ...goals,
                      { name: "", targetAmount: 0, targetDate: new Date().toISOString().slice(0, 10) },
                    ])
                  }
                >
                  Add goal
                </Button>
                <Button onClick={saveGoals}>Finish</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
    </div>
  )
}
