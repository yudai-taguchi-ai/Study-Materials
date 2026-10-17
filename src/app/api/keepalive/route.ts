import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET
    if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
        return NextResponse.json({ ok: false }, { status: 401 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
        return NextResponse.json({ ok: false, error: 'missing env' }, { status: 500 })
    }

    const res = await fetch(`${url}/rest/v1/fields?select=id&limit=1`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: 'no-store',
    })

    return NextResponse.json({ ok: res.ok, status: res.status }, { status: res.ok ? 200 : 502 })
}
