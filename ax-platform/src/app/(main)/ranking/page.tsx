'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import { TrendingUp, TrendingDown, Minus, Pin, Download } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const PERIOD_OPTIONS = ['이번 주', '이번 달', '3개월', '올해']

const rankingData = [
  { rank: 1, prev: 1, brand: 'Nike', branch: '강남점', revenue: 32000000, change: 5.2 },
  { rank: 2, prev: 4, brand: 'Uniqlo', branch: '강남점', revenue: 28000000, change: 18.3 },
  { rank: 3, prev: 2, brand: 'Adidas', branch: '홍대점', revenue: 25000000, change: -3.1 },
  { rank: 4, prev: 3, brand: 'Nike', branch: '홍대점', revenue: 22000000, change: -1.8 },
  { rank: 5, prev: 5, brand: 'Zara', branch: '강남점', revenue: 19000000, change: 2.4 },
  { rank: 6, prev: 8, brand: 'H&M', branch: '인천점', revenue: 17500000, change: 12.1 },
  { rank: 7, prev: 6, brand: 'Adidas', branch: '부산점', revenue: 16000000, change: -4.5 },
  { rank: 8, prev: 7, brand: 'Nike', branch: '부산점', revenue: 15000000, change: 0.8 },
  { rank: 9, prev: 10, brand: 'Zara', branch: '홍대점', revenue: 13500000, change: 9.2 },
  { rank: 10, prev: 9, brand: 'Uniqlo', branch: '대구점', revenue: 12000000, change: -2.3 },
]

export default function RankingPage() {
  const [period, setPeriod] = useState('이번 달')
  const [pinned, setPinned] = useState<string[]>([])

  const togglePin = (key: string) => {
    setPinned((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])
  }

  const sorted = [...rankingData].sort((a, b) => {
    const aKey = `${a.brand}-${a.branch}`
    const bKey = `${b.brand}-${b.branch}`
    if (pinned.includes(aKey) && !pinned.includes(bKey)) return -1
    if (!pinned.includes(aKey) && pinned.includes(bKey)) return 1
    return a.rank - b.rank
  })

  return (
    <div className="flex flex-col min-h-full">
      <Header title="브랜드 랭킹" subtitle="매출액 기준 지점별 브랜드 순위" />
      <div className="p-6 space-y-6">

        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
            {PERIOD_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  period === p ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => window.location.href = '/api/export?type=ranking'}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            엑셀 다운로드
          </button>
        </div>

        <div className="card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-slate-700">
                <th className="text-center pb-3 font-medium w-16">순위</th>
                <th className="text-center pb-3 font-medium w-20">변동</th>
                <th className="text-left pb-3 font-medium">브랜드</th>
                <th className="text-left pb-3 font-medium">지점</th>
                <th className="text-right pb-3 font-medium">매출액</th>
                <th className="text-right pb-3 font-medium">전기간 대비</th>
                <th className="text-center pb-3 font-medium w-12">고정</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sorted.map((item) => {
                const key = `${item.brand}-${item.branch}`
                const isPinned = pinned.includes(key)
                const rankChange = item.prev - item.rank
                return (
                  <tr key={key} className={`hover:bg-slate-700/20 transition-colors ${isPinned ? 'bg-blue-500/5' : ''}`}>
                    <td className="py-3 text-center">
                      {item.rank <= 3 ? (
                        <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                          item.rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                          item.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
                          'bg-orange-700/20 text-orange-400'
                        }`}>{item.rank}</span>
                      ) : (
                        <span className="text-slate-400 font-medium">{item.rank}</span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {rankChange > 0 ? (
                        <span className="badge-up flex items-center justify-center gap-0.5">
                          <TrendingUp className="w-3 h-3" />+{rankChange}
                        </span>
                      ) : rankChange < 0 ? (
                        <span className="badge-down flex items-center justify-center gap-0.5">
                          <TrendingDown className="w-3 h-3" />{rankChange}
                        </span>
                      ) : (
                        <span className="text-slate-600 flex items-center justify-center">
                          <Minus className="w-3 h-3" />
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-slate-200 font-medium">{item.brand}</td>
                    <td className="py-3 text-slate-400">{item.branch}</td>
                    <td className="py-3 text-right text-slate-200 font-medium">{formatCurrency(item.revenue)}</td>
                    <td className="py-3 text-right">
                      {item.change >= 0 ? (
                        <span className="text-emerald-400">+{item.change.toFixed(1)}%</span>
                      ) : (
                        <span className="text-red-400">{item.change.toFixed(1)}%</span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      <button onClick={() => togglePin(key)} className={`transition-colors ${isPinned ? 'text-blue-400' : 'text-slate-600 hover:text-slate-400'}`}>
                        <Pin className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
