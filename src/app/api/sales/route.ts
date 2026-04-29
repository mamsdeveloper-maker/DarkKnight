import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  // filters available: branch, brand, from, to
  void searchParams

  // TODO: Supabase 연동
  const mockSales = [
    { branch: '강남점', brand: 'Nike', revenue: 85000000, qty: 1200, date: '2026-04-28' },
    { branch: '홍대점', brand: 'Adidas', revenue: 63000000, qty: 850, date: '2026-04-28' },
    { branch: '부산점', brand: 'Zara', revenue: 52000000, qty: 720, date: '2026-04-28' },
  ]

  return NextResponse.json({ data: mockSales })
}
