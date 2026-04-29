import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

const summaryData = [
  { 항목: '전체 매출', 값: '299,000,000', 단위: '원' },
  { 항목: '전월 대비 성장률', 값: '12.4', 단위: '%' },
  { 항목: '운영 지점 수', 값: '5', 단위: '개' },
  { 항목: '브랜드 수', 값: '5', 단위: '개' },
]

const inventoryData = [
  { 지점: '강남점', 브랜드: 'Nike', SKU: 'NK-001', 상품명: '에어맥스 90', 현재고: 120, 최소재고: 50, 최대재고: 150, 상태: '적정' },
  { 지점: '강남점', 브랜드: 'Adidas', SKU: 'AD-001', 상품명: '울트라부스트', 현재고: 30, 최소재고: 60, 최대재고: 120, 상태: '부족' },
  { 지점: '홍대점', 브랜드: 'Zara', SKU: 'ZR-001', 상품명: '오버핏 코트', 현재고: 20, 최소재고: 40, 최대재고: 100, 상태: '부족' },
]

const salesData = [
  { 날짜: '2026-04-28', 지점: '강남점', 브랜드: 'Nike', 판매수량: 1200, 매출액: 85000000 },
  { 날짜: '2026-04-28', 지점: '홍대점', 브랜드: 'Adidas', 판매수량: 850, 매출액: 63000000 },
  { 날짜: '2026-04-28', 지점: '부산점', 브랜드: 'Zara', 판매수량: 720, 매출액: 52000000 },
]

const rankingData = [
  { 순위: 1, 브랜드: 'Nike', 지점: '강남점', 매출액: 32000000, '전기간 대비': '+5.2%' },
  { 순위: 2, 브랜드: 'Uniqlo', 지점: '강남점', 매출액: 28000000, '전기간 대비': '+18.3%' },
  { 순위: 3, 브랜드: 'Adidas', 지점: '홍대점', 매출액: 25000000, '전기간 대비': '-3.1%' },
]

const topProductsData = [
  { 순위: 1, 상품명: '나이키 에어맥스 90', 브랜드: 'Nike', SKU: 'NK-AM90-001', 매출액: 12800000, 판매수량: 320, 성장률: '+18.5%' },
  { 순위: 2, 상품명: '아디다스 울트라부스트 22', 브랜드: 'Adidas', SKU: 'AD-UB22-002', 매출액: 10500000, 판매수량: 210, 성장률: '+7.2%' },
  { 순위: 3, 상품명: '유니클로 히트텍', 브랜드: 'Uniqlo', SKU: 'UQ-HT-004', 매출액: 8750000, 판매수량: 875, 성장률: '+32.4%' },
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') ?? 'full'

  const wb = XLSX.utils.book_new()

  if (type === 'full' || type === 'summary') {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryData), '요약')
  }
  if (type === 'full' || type === 'inventory') {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(inventoryData), '재고현황')
  }
  if (type === 'full' || type === 'sales') {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(salesData), '판매현황')
  }
  if (type === 'full' || type === 'ranking') {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rankingData), '브랜드랭킹')
  }
  if (type === 'full' || type === 'top-products') {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(topProductsData), '인기상품TOP10')
  }

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  const date = new Date().toISOString().slice(0, 10)
  const fileName = `AX_리포트_${date}.xlsx`

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    },
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { sheets = ['summary', 'inventory', 'sales', 'ranking', 'top-products'] } = body

  const wb = XLSX.utils.book_new()

  if (sheets.includes('summary')) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryData), '요약')
  if (sheets.includes('inventory')) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(inventoryData), '재고현황')
  if (sheets.includes('sales')) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(salesData), '판매현황')
  if (sheets.includes('ranking')) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rankingData), '브랜드랭킹')
  if (sheets.includes('top-products')) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(topProductsData), '인기상품TOP10')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  const date = new Date().toISOString().slice(0, 10)
  const fileName = `AX_커스텀리포트_${date}.xlsx`

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    },
  })
}
