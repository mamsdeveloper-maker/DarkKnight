import { NextResponse } from 'next/server'

export async function GET() {
  // TODO: Supabase 연동
  const history = [
    { id: 1, file_name: '강남점_재고_2026-04-28.xlsx', status: 'success', row_count: 342, created_at: '2026-04-28T14:22:00' },
    { id: 2, file_name: '홍대점_판매_2026-04-28.xlsx', status: 'success', row_count: 218, created_at: '2026-04-28T13:10:00' },
    { id: 3, file_name: '부산점_재고_2026-04-27.xlsx', status: 'error', row_count: 0, error_log: '필수 컬럼(branch_id) 누락', created_at: '2026-04-27T18:05:00' },
  ]

  return NextResponse.json({ data: history })
}
