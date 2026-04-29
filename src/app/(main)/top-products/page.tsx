'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import { Package, TrendingUp, TrendingDown, Download } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'

type SortBy = 'revenue' | 'quantity' | 'growth'

const allProducts = [
  { rank: 1, name: '나이키 에어맥스 90', brand: 'Nike', sku: 'NK-AM90-001', revenue: 12800000, qty: 320, growth: 18.5, image: null },
  { rank: 2, name: '아디다스 울트라부스트 22', brand: 'Adidas', sku: 'AD-UB22-002', revenue: 10500000, qty: 210, growth: 7.2, image: null },
  { rank: 3, name: '자라 오버핏 코트', brand: 'Zara', sku: 'ZR-OC-003', revenue: 9200000, qty: 184, growth: -2.1, image: null },
  { rank: 4, name: '유니클로 히트텍 라운드넥', brand: 'Uniqlo', sku: 'UQ-HT-004', revenue: 8750000, qty: 875, growth: 32.4, image: null },
  { rank: 5, name: '나이키 조던 1 레트로', brand: 'Nike', sku: 'NK-J1-005', revenue: 7600000, qty: 95, growth: 5.8, image: null },
  { rank: 6, name: 'H&M 스트라이프 셔츠', brand: 'H&M', sku: 'HM-SS-006', revenue: 6400000, qty: 640, growth: 11.3, image: null },
  { rank: 7, name: '아디다스 스탠스미스', brand: 'Adidas', sku: 'AD-SS-007', revenue: 5800000, qty: 145, growth: -5.4, image: null },
  { rank: 8, name: '유니클로 플리스 자켓', brand: 'Uniqlo', sku: 'UQ-FJ-008', revenue: 5200000, qty: 260, growth: 28.1, image: null },
  { rank: 9, name: '자라 와이드 팬츠', brand: 'Zara', sku: 'ZR-WP-009', revenue: 4900000, qty: 196, growth: 3.6, image: null },
  { rank: 10, name: 'H&M 크롭 후디', brand: 'H&M', sku: 'HM-CH-010', revenue: 4200000, qty: 420, growth: 14.7, image: null },
]

export default function TopProductsPage() {
  const [sortBy, setSortBy] = useState<SortBy>('revenue')
  const [selectedBrand, setSelectedBrand] = useState('전체')

  const brands = ['전체', 'Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo']

  const filtered = allProducts
    .filter((p) => selectedBrand === '전체' || p.brand === selectedBrand)
    .sort((a, b) => {
      if (sortBy === 'revenue') return b.revenue - a.revenue
      if (sortBy === 'quantity') return b.qty - a.qty
      return b.growth - a.growth
    })
    .slice(0, 10)

  return (
    <div className="flex flex-col min-h-full">
      <Header title="인기상품 TOP 10" subtitle="판매량·매출·성장률 기준 베스트 상품" />
      <div className="p-6 space-y-6">

        {/* 필터 바 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
              {(['revenue', 'quantity', 'growth'] as SortBy[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    sortBy === s ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s === 'revenue' ? '매출액' : s === 'quantity' ? '판매량' : '증가율'}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedBrand === b ? 'bg-slate-600 text-slate-100' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/api/export?type=top-products'}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            엑셀 다운로드
          </button>
        </div>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((p, i) => (
            <div key={p.sku} className="card hover:border-blue-500/30 transition-all cursor-pointer group">
              <div className="flex items-start gap-4">
                {/* 순위 배지 */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                  i === 0 ? 'bg-amber-500/20 text-amber-400' :
                  i === 1 ? 'bg-slate-400/20 text-slate-300' :
                  i === 2 ? 'bg-orange-700/20 text-orange-400' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {i + 1}
                </div>

                {/* 상품 이미지 자리 */}
                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-slate-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-100 truncate">{p.name}</p>
                  <p className="text-xs text-slate-500 mb-2">{p.brand} · {p.sku}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-300">{formatCurrency(p.revenue)}</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">{formatNumber(p.qty)}개</span>
                    <span className="text-slate-500">|</span>
                    {p.growth >= 0 ? (
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" />+{p.growth}%
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-0.5">
                        <TrendingDown className="w-3 h-3" />{p.growth}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
