import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const period = searchParams.get('period') ?? 'month'
  const limit = parseInt(searchParams.get('limit') ?? '10')

  // TODO: Supabase 집계 쿼리
  const mockRanking = [
    { rank: 1, brand: 'Nike', branch: '강남점', revenue: 32000000, prev_rank: 1 },
    { rank: 2, brand: 'Uniqlo', branch: '강남점', revenue: 28000000, prev_rank: 4 },
    { rank: 3, brand: 'Adidas', branch: '홍대점', revenue: 25000000, prev_rank: 2 },
  ].slice(0, limit)

  return NextResponse.json({ data: mockRanking, period })
}
