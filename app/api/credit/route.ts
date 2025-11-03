
import { NextResponse } from "next/server"
import { getRepo, UserProfile } from "@/lib/repository"
import { getSessionUserId } from "@/lib/auth"

// POST /api/credit - Save credit score for logged-in user
export async function POST(req: Request) {
	const { score, band, provider, retrievedAt, source } = await req.json()
	const userId = await getSessionUserId()
	if (!userId) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
	}
	if (typeof score !== "number" || !band || !provider || !retrievedAt) {
		return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
	}
	// Save as a profile extension (or add a new method in repo if needed)
		const repo = getRepo()
		let profile = await repo.getProfile(userId)
		if (!profile) {
			// You may want to fetch fullName from user or require it in the request for new users
			profile = { userId, fullName: "" }
		}
		const updatedProfile: UserProfile = {
			...profile,
			creditScore: score,
			creditBand: band,
			creditProvider: provider,
			creditRetrievedAt: retrievedAt,
			creditSource: source,
		}
		await repo.upsertProfile(updatedProfile)
		return NextResponse.json({ ok: true })
}
