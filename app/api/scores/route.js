import { NextResponse } from "next/server"
import { insertScore, getTopScores } from "../../../lib/db"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)))
  const size = searchParams.get("size") || undefined

  try {
    const rows = getTopScores({ limit, size })
    return NextResponse.json({ ok: true, data: rows })
  } catch (err) {
    console.error("GET /api/scores error", err)
    return NextResponse.json({ ok: false, error: "Failed to fetch scores" }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const name = typeof body.name === "string" ? body.name.trim() : ""
    const mines = Number(body.mines)
    const time = Number(body.time)
    const size = typeof body.size === "string" ? body.size.trim() : ""

    if (!name || !size || !Number.isFinite(mines) || !Number.isFinite(time)) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 })
    }

    const id = insertScore({ name, mines, size, time })
    return NextResponse.json({ ok: true, id })
  } catch (err) {
    console.error("POST /api/scores error", err)
    return NextResponse.json({ ok: false, error: "Failed to save score" }, { status: 500 })
  }
}
