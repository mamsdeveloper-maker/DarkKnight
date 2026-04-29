import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const branch = searchParams.get('branch')
  const brand = searchParams.get('brand')
  // const date = searchParams.get('date')

  // TODO: Supabase 연동
  // const supabase = await createClient()
  // let query = supabase.from('inventory_snapshots').select('*, branch:branches(name), product:products(*, brand:brands(name))')
  // if (branch) query = query.eq('branches.name', branch)
  // if (date) query = query.eq('snapshot_date', date)

  const mockData = [
    { branch: '강남점', brand: 'Nike', sku: 'NK-001', product: '에어맥스 90', quantity: 120, min: 50, max: 150 },
    { branch: '강남점', brand: 'Adidas', sku: 'AD-001', product: '울트라부스트', quantity: 30, min: 60, max: 120 },
    { branch: '홍대점', brand: 'Zara', sku: 'ZR-001', product: '오버핏 코트', quantity: 20, min: 40, max: 100 },
  ].filter((r) => {
    if (branch && branch !== '전체' && r.branch !== branch) return false
    if (brand && brand !== '전체' && r.brand !== brand) return false
    return true
  })

  return NextResponse.json({ data: mockData, total: mockData.length })
}
