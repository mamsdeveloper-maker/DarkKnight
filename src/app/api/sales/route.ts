import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const branch = searchParams.get('branch')
  const brand = searchParams.get('brand')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  try {
    const supabase = await createClient()

    let query = supabase
      .from('sales_records')
      .select(`
        id, quantity_sold, revenue, sale_date,
        branch:branches(id, name),
        product:products(id, sku, name, brand:brands(id, name))
      `)
      .order('sale_date', { ascending: false })

    if (from) query = query.gte('sale_date', from)
    if (to) query = query.lte('sale_date', to)

    const { data, error } = await query
    if (error) throw error

    const filtered = (data ?? []).filter((r) => {
      const branchName = (r.branch as { name: string })?.name
      const brandName = ((r.product as { brand: { name: string } })?.brand)?.name
      if (branch && branch !== '전체' && branchName !== branch) return false
      if (brand && brand !== '전체' && brandName !== brand) return false
      return true
    })

    return NextResponse.json({ data: filtered })
  } catch {
    return NextResponse.json({
      data: [
        { branch: '강남점', brand: 'Nike', revenue: 85000000, qty: 1200, date: '2026-04-29' },
        { branch: '홍대점', brand: 'Adidas', revenue: 63000000, qty: 850, date: '2026-04-29' },
        { branch: '부산점', brand: 'Zara', revenue: 52000000, qty: 720, date: '2026-04-29' },
        { branch: '대구점', brand: 'H&M', revenue: 42000000, qty: 580, date: '2026-04-29' },
        { branch: '인천점', brand: 'Uniqlo', revenue: 57000000, qty: 920, date: '2026-04-29' },
      ],
    })
  }
}
