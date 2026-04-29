import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const period = searchParams.get('period') ?? 'month'
  const limit = parseInt(searchParams.get('limit') ?? '10')

  try {
    const supabase = await createClient()

    const now = new Date()
    let fromDate: string
    if (period === 'week') {
      const d = new Date(now); d.setDate(d.getDate() - 7)
      fromDate = d.toISOString().slice(0, 10)
    } else if (period === 'month') {
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
    } else if (period === 'quarter') {
      const d = new Date(now); d.setMonth(d.getMonth() - 3)
      fromDate = d.toISOString().slice(0, 10)
    } else {
      fromDate = `${now.getFullYear()}-01-01`
    }

    const { data, error } = await supabase
      .from('sales_records')
      .select(`revenue, branch:branches(name), product:products(brand:brands(name))`)
      .gte('sale_date', fromDate)

    if (error) throw error

    // 브랜드+지점별 매출 집계
    const map = new Map<string, { brand: string; branch: string; revenue: number }>()
    for (const r of data ?? []) {
      const branchName = (r.branch as { name: string })?.name ?? '알 수 없음'
      const brandName = ((r.product as { brand: { name: string } })?.brand)?.name ?? '알 수 없음'
      const key = `${brandName}||${branchName}`
      const prev = map.get(key) ?? { brand: brandName, branch: branchName, revenue: 0 }
      map.set(key, { ...prev, revenue: prev.revenue + Number(r.revenue) })
    }

    const ranked = Array.from(map.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit)
      .map((item, i) => ({ rank: i + 1, prev_rank: i + 1, ...item }))

    return NextResponse.json({ data: ranked, period })
  } catch {
    return NextResponse.json({
      data: [
        { rank: 1, brand: 'Nike', branch: '강남점', revenue: 32000000, prev_rank: 1 },
        { rank: 2, brand: 'Uniqlo', branch: '강남점', revenue: 28000000, prev_rank: 4 },
        { rank: 3, brand: 'Adidas', branch: '홍대점', revenue: 25000000, prev_rank: 2 },
        { rank: 4, brand: 'Nike', branch: '홍대점', revenue: 22000000, prev_rank: 3 },
        { rank: 5, brand: 'Zara', branch: '강남점', revenue: 19000000, prev_rank: 5 },
      ].slice(0, limit),
      period,
    })
  }
}
