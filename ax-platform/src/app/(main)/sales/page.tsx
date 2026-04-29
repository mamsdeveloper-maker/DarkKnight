'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { TrendingUp, TrendingDown, Download } from 'lucide-react'
import { formatCurrency, calcGrowthRate } from '@/lib/utils'

const PERIOD_OPTIONS = ['오늘', '이번 주', '이번 달', '3개월', '올해']
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const monthlyData = [
  { month: '11월', revenue: 52000000 },
  { month: '12월', revenue: 61000000 },
  { month: '1월', revenue: 42000000 },
  { month: '2월', revenue: 38000000 },
  { month: '3월', revenue: 51000000 },
  { month: '4월', revenue: 63000000 },
]

const branchRevenue = [
  { branch: '강남점', revenue: 85000000, prev: 72000000 },
  { branch: '홍대점', revenue: 63000000, prev: 58000000 },
  { branch: '인천점', revenue: 57000000, prev: 60000000 },
  { branch: '부산점', revenue: 52000000, prev: 48000000 },
  { branch: '대구점', revenue: 42000000, prev: 39000000 },
]

const brandRevenue = [
  { name: 'Nike', value: 98000000 },
  { name: 'Adidas', value: 75000000 },
  { name: 'Zara', value: 58000000 },
  { name: 'H&M', value: 45000000 },
  { name: 'Uniqlo', value: 23000000 },
]

const totalRevenue = monthlyData[monthlyData.length - 1].revenue
const prevRevenue = monthlyData[monthlyData.length - 2].revenue
const growthRate = calcGrowthRate(totalRevenue, prevRevenue)

export default function SalesPage() {
  const [period, setPeriod] = useState('이번 달')

  return (
    <div className="flex flex-col min-h-full">
      <Header title="판매·매출 분석" subtitle="지점·브랜드별 매출 현황 및 비교" />
      <div className="p-6 space-y-6">

        {/* 기간 선택 + 다운로드 */}
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
            onClick={() => window.location.href = '/api/export?type=sales'}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            엑셀 다운로드
          </button>
        </div>

        {/* 요약 KPI */}
        <div className="grid grid-cols-3 gap-4">
          <div className="kpi-card">
            <p className="text-xs text-slate-500 mb-1">전체 매출</p>
            <p className="text-2xl font-bold text-slate-100">{formatCurrency(totalRevenue)}</p>
            <div className="mt-2 flex items-center gap-1">
              {growthRate >= 0
                ? <span className="badge-up flex items-center gap-1"><TrendingUp className="w-3 h-3" />+{growthRate.toFixed(1)}%</span>
                : <span className="badge-down flex items-center gap-1"><TrendingDown className="w-3 h-3" />{growthRate.toFixed(1)}%</span>
              }
              <span className="text-xs text-slate-500">전월 대비</span>
            </div>
          </div>
          <div className="kpi-card">
            <p className="text-xs text-slate-500 mb-1">최고 매출 지점</p>
            <p className="text-2xl font-bold text-slate-100">강남점</p>
            <p className="text-xs text-slate-400 mt-1">{formatCurrency(85000000)}</p>
          </div>
          <div className="kpi-card">
            <p className="text-xs text-slate-500 mb-1">최고 매출 브랜드</p>
            <p className="text-2xl font-bold text-slate-100">Nike</p>
            <p className="text-xs text-slate-400 mt-1">{formatCurrency(98000000)}</p>
          </div>
        </div>

        {/* 차트 영역 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 매출 추이 */}
          <div className="card">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">월별 매출 추이</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => formatCurrency(Number(v))}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Line type="monotone" dataKey="revenue" name="매출" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 브랜드별 매출 파이 */}
          <div className="card">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">브랜드별 매출 비중</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={brandRevenue} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                  {brandRevenue.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 지점별 매출 비교 */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">지점별 매출 순위</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={branchRevenue} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis type="category" dataKey="branch" tick={{ fill: '#94a3b8', fontSize: 12 }} width={55} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="revenue" name="이번 달" fill="#3b82f6" radius={[0, 3, 3, 0]} />
              <Bar dataKey="prev" name="전월" fill="#334155" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}
