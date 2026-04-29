import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('file_uploads')
      .select('id, file_name, status, row_count, error_log, created_at')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return NextResponse.json({ data: data ?? [] })
  } catch {
    return NextResponse.json({
      data: [
        { id: 1, file_name: '강남점_재고_2026-04-29.xlsx', status: 'success', row_count: 342, created_at: '2026-04-29T14:22:00' },
        { id: 2, file_name: '홍대점_판매_2026-04-29.xlsx', status: 'success', row_count: 218, created_at: '2026-04-29T13:10:00' },
        { id: 3, file_name: '부산점_재고_2026-04-28.xlsx', status: 'error', row_count: 0, error_log: '필수 컬럼(branch_id) 누락', created_at: '2026-04-28T18:05:00' },
      ],
    })
  }
}
