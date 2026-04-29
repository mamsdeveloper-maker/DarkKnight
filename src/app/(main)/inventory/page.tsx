'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import { formatNumber } from '@/lib/utils'
import { Filter } from 'lucide-react'

const branches = ['강남점', '홍대점', '부산점', '대구점', '인천점']
const brands = ['Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo']

const inventoryMatrix: Record<string, Record<string, { qty: number; min: number; max: number }>> = {
  '강남점': { Nike: { qty: 120, min: 50, max: 150 }, Adidas: { qty: 30, min: 60, max: 120 }, Zara: { qty: 95, min: 40, max: 100 }, 'H&M': { qty: 75, min: 50, max: 100 }, Uniqlo: { qty: 200, min: 80, max: 180 } },
  '홍대점': { Nike: { qty: 85, min: 50, max: 150 }, Adidas: { qty: 110, min: 60, max: 120 }, Zara: { qty: 20, min: 40, max: 100 }, 'H&M': { qty: 88, min: 50, max: 100 }, Uniqlo: { qty: 65, min: 80, max: 180 } },
  '부산점': { Nike: { qty: 55, min: 50, max: 150 }, Adidas: { qty: 70, min: 60, max: 120 }, Zara: { qty: 80, min: 40, max: 100 }, 'H&M': { qty: 42, min: 50, max: 100 }, Uniqlo: { qty: 130, min: 80, max: 180 } },
  '대구점': { Nike: { qty: 160, min: 50, max: 150 }, Adidas: { qty: 55, min: 60, max: 120 }, Zara: { qty: 60, min: 40, max: 100 }, 'H&M': { qty: 95, min: 50, max: 100 }, Uniqlo: { qty: 90, min: 80, max: 180 } },
  '인천점': { Nike: { qty: 75, min: 50, max: 150 }, Adidas: { qty: 90, min: 60, max: 120 }, Zara: { qty: 45, min: 40, max: 100 }, 'H&M': { qty: 72, min: 50, max: 100 }, Uniqlo: { qty: 110, min: 80, max: 180 } },
}

function getStatus(qty: number, min: number, max: number) {
  if (qty < min) return 'low'
  if (qty > max) return 'over'
  return 'ok'
}

const statusStyle = {
  low: 'bg-red-500/20 text-red-300 border border-red-500/30',
  ok: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  over: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
}

const statusLabel = { low: '부족', ok: '적정', over: '과잉' }

export default function InventoryPage() {
  const [selectedBranch, setSelectedBranch] = useState('전체')
  const [selectedBrand, setSelectedBrand] = useState('전체')

  const filteredBranches = selectedBranch === '전체' ? branches : [selectedBranch]
  const filteredBrands = selectedBrand === '전체' ? brands : [selectedBrand]

  return (
    <div className="flex flex-col min-h-full">
      <Header title="재고 현황" subtitle="지점 × 브랜드 재고 매트릭스" />
      <div className="p-6 space-y-6">

        {/* 범례 + 필터 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500/30 inline-block" />부족 (최소 재고 미달)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/30 inline-block" />적정</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500/30 inline-block" />과잉 (최대 재고 초과)</span>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option>전체</option>
              {branches.map((b) => <option key={b}>{b}</option>)}
            </select>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option>전체</option>
              {brands.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>

        {/* 매트릭스 테이블 */}
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left pb-3 font-medium text-slate-400 w-24">지점</th>
                {filteredBrands.map((brand) => (
                  <th key={brand} className="text-center pb-3 font-medium text-slate-300 px-4">{brand}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredBranches.map((branch) => (
                <tr key={branch} className="hover:bg-slate-700/20">
                  <td className="py-3 text-slate-300 font-medium">{branch}</td>
                  {filteredBrands.map((brand) => {
                    const data = inventoryMatrix[branch][brand]
                    const status = getStatus(data.qty, data.min, data.max)
                    return (
                      <td key={brand} className="py-3 px-4 text-center">
                        <div className={`inline-flex flex-col items-center px-3 py-1.5 rounded-lg ${statusStyle[status]}`}>
                          <span className="font-bold">{formatNumber(data.qty)}</span>
                          <span className="text-xs opacity-70">{statusLabel[status]}</span>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 요약 통계 */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '부족 항목', count: 4, color: 'text-red-400 bg-red-400/10' },
            { label: '적정 항목', count: 17, color: 'text-emerald-400 bg-emerald-400/10' },
            { label: '과잉 항목', count: 4, color: 'text-amber-400 bg-amber-400/10' },
          ].map((s) => (
            <div key={s.label} className="card text-center">
              <p className={`text-3xl font-bold mb-1 ${s.color.split(' ')[0]}`}>{s.count}</p>
              <p className="text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
