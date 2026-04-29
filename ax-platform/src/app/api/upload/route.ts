import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['xlsx', 'xls', 'csv'].includes(ext ?? '')) {
      return NextResponse.json({ error: '지원하지 않는 파일 형식입니다. (.xlsx, .xls, .csv만 허용)' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet)

    if (rows.length === 0) {
      return NextResponse.json({ error: '파일에 데이터가 없습니다.' }, { status: 400 })
    }

    // 필수 컬럼 검증 (실제 스키마에 맞게 조정)
    const headers = Object.keys(rows[0])
    const requiredCols = ['branch', 'brand', 'sku']
    const missing = requiredCols.filter((c) => !headers.some((h) => h.toLowerCase().includes(c)))

    if (missing.length > 0) {
      return NextResponse.json({
        error: `필수 컬럼 누락: ${missing.join(', ')}`,
        rows: 0,
      }, { status: 422 })
    }

    // TODO: Supabase 저장 로직 (환경변수 설정 후 활성화)
    // const supabase = createServiceClient()
    // await supabase.from('file_uploads').insert({ file_name: file.name, row_count: rows.length, status: 'success' })

    return NextResponse.json({
      success: true,
      rows: rows.length,
      fileName: file.name,
      preview: rows.slice(0, 5),
    })
  } catch (err) {
    console.error('[upload]', err)
    return NextResponse.json({ error: '파일 파싱 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
