"use client"

import type React from "react"

import { useState, useRef } from "react"

// Force deployment - no phone field in signup
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<"" | "Weak" | "Medium" | "Strong">("")
  const [showPassword, setShowPassword] = useState(false)
  const [lockout, setLockout] = useState(false)
  const [attempts, setAttempts] = useState(0)
  // In browser environments setTimeout returns a number, so use number | null here
  const lockoutTimer = useRef<number | null>(null)
  const router = useRouter()

  function isAllowedEmail(email: string) {
    // Allow only specific domains and one special email
    const allowedDomains = ["gmail.com", "gmai.com", "joho.com"];
    const specialEmail = "rahul015january@gmail.com";
    if (email === specialEmail) return true;
    const match = email.match(/^([\w.-]+)@([\w.-]+)$/);
    if (!match) return false;
    const domain = match[2].toLowerCase();
    return allowedDomains.includes(domain);
  }

  function getPasswordStrength(pw: string): "" | "Weak" | "Medium" | "Strong" {
    if (!pw) return "";
    if (pw.length < 8) return "Weak";
    let score = 0;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score >= 3 && pw.length >= 12) return "Strong";
    if (score >= 2) return "Medium";
    return "Weak";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (lockout) {
      setError("Too many failed attempts. Please wait 30 seconds and try again.");
      return;
    }
    setLoading(true);
    if (!isAllowedEmail(email)) {
      setLoading(false);
      setError("Only authentic gmail.com, gmai.com, joho.com emails are allowed, or 'rahul015january@gmail.com'.");
      return;
    }
    if (password.length < 8) {
      setLoading(false);
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setAttempts((a) => a + 1);
        if (attempts + 1 >= 5) {
          setLockout(true);
          setError("Too many failed attempts. Please wait 30 seconds and try again.");
          lockoutTimer.current = setTimeout(() => {
            setLockout(false);
            setAttempts(0);
          }, 30000);
        } else {
          throw new Error(j.error || "Failed");
        }
        return;
      }
      setAttempts(0);
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">{mode === "login" ? "Welcome back" : "Create your account"}</CardTitle>
        <CardDescription>Sign {mode === "login" ? "in" : "up"} to use your CA Chatbot</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {mode === "signup" && (
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordStrength(getPasswordStrength(e.target.value));
                }}
                required
                minLength={8}
                style={{ paddingRight: 100 }}
                autoComplete="current-password"
              />
              {password && (
                <span
                  style={{
                    position: 'absolute',
                    right: 44,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    minWidth: 64,
                    justifyContent: 'center',
                    padding: '2px 16px',
                    borderRadius: 20,
                    fontWeight: 600,
                    fontSize: '0.95em',
                    background:
                      passwordStrength === "Strong"
                        ? 'linear-gradient(90deg,#bbf7d0,#22c55e)'
                        : passwordStrength === "Medium"
                        ? 'linear-gradient(90deg,#fef9c3,#fde047)'
                        : passwordStrength === "Weak"
                        ? 'linear-gradient(90deg,#fee2e2,#ef4444)'
                        : '#f3f4f6',
                    color:
                      passwordStrength === "Strong"
                        ? '#166534'
                        : passwordStrength === "Medium"
                        ? '#854d0e'
                        : passwordStrength === "Weak"
                        ? '#991b1b'
                        : '#374151',
                    border:
                      passwordStrength === "Strong"
                        ? '1.5px solid #22c55e'
                        : passwordStrength === "Medium"
                        ? '1.5px solid #eab308'
                        : passwordStrength === "Weak"
                        ? '1.5px solid #ef4444'
                        : '1.5px solid #d1d5db',
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                    transition: 'all 0.2s',
                    zIndex: 2,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  {passwordStrength}
                </span>
              )}
              {/* Eye icon toggle */}
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                  zIndex: 3,
                  display: 'flex',
                  alignItems: 'center',
                  color: '#64748b',
                  opacity: 0.85,
                }}
                tabIndex={0}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Sign up"}
          </Button>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-sm text-muted-foreground underline"
          >
            {mode === "login" ? "New here? Create an account" : "Have an account? Sign in"}
          </button>
        </form>
      </CardContent>
    </Card>
  )
}
