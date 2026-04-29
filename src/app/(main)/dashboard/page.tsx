'use client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react'
import Header from '@/components/layout/Header'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { TrendingUp, TrendingDown, Store, Tag, Upload, DollarSign } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'

const salesTrend = [
  { month: '1월', revenue: 42000000, prev: 38000000 },
  { month: '2월', revenue: 38000000, prev: 35000000 },
  { month: '3월', revenue: 51000000, prev: 40000000 },
  { month: '4월', revenue: 47000000, prev: 43000000 },
  { month: '5월', revenue: 58000000, prev: 48000000 },
  { month: '6월', revenue: 63000000, prev: 52000000 },
]

const inventoryByBranch = [
  { branch: '강남점', Nike: 120, Adidas: 85, Zara: 60, 'H&M': 95 },
  { branch: '홍대점', Nike: 95, Adidas: 110, Zara: 75, 'H&M': 80 },
  { branch: '부산점', Nike: 80, Adidas: 65, Zara: 90, 'H&M': 70 },
  { branch: '대구점', Nike: 60, Adidas: 75, Zara: 55, 'H&M': 85 },
  { branch: '인천점', Nike: 75, Adidas: 90, Zara: 68, 'H&M': 72 },
]

const recentUploads = [
  { id: 1, file: '강남점_재고_2026-04-28.xlsx', status: 'success', rows: 342, time: '10분 전' },
  { id: 2, file: '홍대점_판매_2026-04-28.xlsx', status: 'success', rows: 218, time: '1시간 전' },
  { id: 3, file: '부산점_재고_2026-04-27.xlsx', status: 'error', rows: 0, time: '3시간 전' },
  { id: 4, file: '전체지점_매출_2026-04-27.xlsx', status: 'success', rows: 1205, time: '5시간 전' },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function DashboardPage() {
  const kpis = [
    { label: '전체 매출', value: formatCurrency(299000000), change: 12.4, icon: DollarSign, color: 'text-blue-400' },
    { label: '운영 지점 수', value: '5개점', change: 0, icon: Store, color: 'text-emerald-400' },
    { label: '브랜드 수', value: '5개', change: 0, icon: Tag, color: 'text-amber-400' },
    { label: '금일 업로드', value: '2건', change: 100, icon: Upload, color: 'text-purple-400' },
  ]

  return (
    <div className="flex flex-col min-h-full">
      <Header title="대시보드" subtitle="전체 판매·재고 현황 한눈에 보기" />
      <div className="p-6 space-y-6">

        {/* KPI 카드 */}
        <div className="grid grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="kpi-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
                  <p className="text-2xl font-bold text-slate-100">{kpi.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-lg bg-slate-700/60 flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="w-5 h-5" />
                </div>
              </div>
              {kpi.change !== 0 && (
                <div className="mt-3 flex items-center gap-1">
                  {kpi.change > 0 ? (
                    <span className="badge-up flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />+{kpi.change}%
                    </span>
                  ) : (
                    <span className="badge-down flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />{kpi.change}%
                    </span>
                  )}
                  <span className="text-xs text-slate-500">전월 대비</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 차트 영역 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 매출 추이 */}
          <div className="card">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">전체 매출 추이</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => formatCurrency(Number(v))}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="이번 해" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="prev" name="전년" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 2" dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 지점별 재고 현황 */}
          <div className="card">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">지점별 브랜드 재고 현황</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={inventoryByBranch}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="branch" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => formatNumber(Number(v))}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Legend />
                {['Nike', 'Adidas', 'Zara', 'H&M'].map((brand, i) => (
                  <Bar key={brand} dataKey={brand} fill={COLORS[i]} radius={[2, 2, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 최근 업로드 */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">최근 업로드 내역</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-slate-700">
                <th className="text-left pb-2 font-medium">파일명</th>
                <th className="text-left pb-2 font-medium">상태</th>
                <th className="text-right pb-2 font-medium">행 수</th>
                <th className="text-right pb-2 font-medium">시간</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentUploads.map((u) => (
                <tr key={u.id} className="text-slate-300 hover:bg-slate-700/30">
                  <td className="py-2.5">{u.file}</td>
                  <td className="py-2.5">
                    <span className={u.status === 'success'
                      ? 'text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs'
                      : 'text-red-400 bg-red-400/10 px-2 py-0.5 rounded text-xs'
                    }>
                      {u.status === 'success' ? '✓ 완료' : '✗ 오류'}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-slate-400">{formatNumber(u.rows)}</td>
                  <td className="py-2.5 text-right text-slate-500">{u.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
