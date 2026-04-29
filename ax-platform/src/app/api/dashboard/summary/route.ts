import { NextResponse } from 'next/server'

// TODO: Supabase 연동 후 실제 데이터로 교체
export async function GET() {
  try {
    // const supabase = await createClient()
    // const { data: sales } = await supabase.from('sales_records').select('revenue')
    // const totalRevenue = sales?.reduce((sum, r) => sum + r.revenue, 0) ?? 0

    const summary = {
      totalRevenue: 299000000,
      totalRevenuePrev: 262000000,
      branchCount: 5,
      brandCount: 5,
      todayUploads: 2,
    }

    return NextResponse.json(summary)
  } catch (err) {
    console.error('[dashboard/summary]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
