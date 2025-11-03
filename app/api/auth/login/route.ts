
import { NextResponse } from "next/server"
import { getRepo } from "@/lib/repository"
import { setSessionUserId } from "@/lib/auth"
import { createHash } from "crypto"
const failedAttempts = new Map<string, { count: number, last: number }>()

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 })
  }
  // Rate limit and lockout by email+ip
  const ip = req.headers.get("x-forwarded-for") || "unknown"
  const key = email + ":" + ip
  const now = Date.now()
  const entry = failedAttempts.get(key)
  if (entry && entry.count >= 5 && now - entry.last < 30000) {
    return NextResponse.json({ error: "Too many failed attempts. Please wait 30 seconds and try again." }, { status: 429 })
  }
  const repo = getRepo()
  const user = await repo.getUserByEmail(email)
  if (!user) {
    failedAttempts.set(key, { count: (entry?.count || 0) + 1, last: now })
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
  const passwordHash = createHash("sha256").update(password).digest("hex")
  if (passwordHash !== user.passwordHash) {
    failedAttempts.set(key, { count: (entry?.count || 0) + 1, last: now })
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
  // Optionally: check phone matches user profile (if stored)
  // ...
  failedAttempts.delete(key)
  await setSessionUserId(user.id)
  return NextResponse.json({ ok: true })
}
