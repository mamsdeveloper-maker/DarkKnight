import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const branch = searchParams.get('branch')
  const brand = searchParams.get('brand')
  const date = searchParams.get('date')

  try {
    const supabase = await createClient()

    let query = supabase
      .from('inventory_snapshots')
      .select(`
        id, quantity, min_quantity, max_quantity, snapshot_date,
        branch:branches(id, name),
        product:products(id, sku, name, unit_price, brand:brands(id, name))
      `)
      .order('snapshot_date', { ascending: false })

    if (date) query = query.eq('snapshot_date', date)

    const { data, error } = await query
    if (error) throw error

    const filtered = (data ?? []).filter((r) => {
      const branchName = (r.branch as { name: string })?.name
      const brandName = ((r.product as { brand: { name: string } })?.brand)?.name
      if (branch && branch !== '전체' && branchName !== branch) return false
      if (brand && brand !== '전체' && brandName !== brand) return false
      return true
    })

    return NextResponse.json({ data: filtered, total: filtered.length })
  } catch {
    const mockData = [
      { branch: '강남점', brand: 'Nike', sku: 'NK-001', product: '에어맥스 90', quantity: 120, min_quantity: 50, max_quantity: 150 },
      { branch: '강남점', brand: 'Adidas', sku: 'AD-001', product: '울트라부스트', quantity: 30, min_quantity: 60, max_quantity: 120 },
      { branch: '홍대점', brand: 'Zara', sku: 'ZR-001', product: '오버핏 코트', quantity: 20, min_quantity: 40, max_quantity: 100 },
      { branch: '부산점', brand: 'Nike', sku: 'NK-002', product: '에어포스1', quantity: 80, min_quantity: 50, max_quantity: 150 },
      { branch: '대구점', brand: 'Uniqlo', sku: 'UQ-001', product: '히트텍', quantity: 200, min_quantity: 80, max_quantity: 180 },
    ].filter((r) => {
      if (branch && branch !== '전체' && r.branch !== branch) return false
      if (brand && brand !== '전체' && r.brand !== brand) return false
      return true
    })
    return NextResponse.json({ data: mockData, total: mockData.length })
  }
}
