import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const by = searchParams.get('by') ?? 'revenue'
  const limit = parseInt(searchParams.get('limit') ?? '10')
  const brand = searchParams.get('brand')

  // TODO: Supabase 집계
  const mockProducts = [
    { rank: 1, name: '나이키 에어맥스 90', brand: 'Nike', sku: 'NK-AM90-001', revenue: 12800000, qty: 320, growth: 18.5 },
    { rank: 2, name: '아디다스 울트라부스트 22', brand: 'Adidas', sku: 'AD-UB22-002', revenue: 10500000, qty: 210, growth: 7.2 },
    { rank: 3, name: '유니클로 히트텍', brand: 'Uniqlo', sku: 'UQ-HT-004', revenue: 8750000, qty: 875, growth: 32.4 },
  ]
    .filter((p) => !brand || brand === '전체' || p.brand === brand)
    .sort((a, b) => by === 'qty' ? b.qty - a.qty : by === 'growth' ? b.growth - a.growth : b.revenue - a.revenue)
    .slice(0, limit)

  return NextResponse.json({ data: mockProducts })
}
