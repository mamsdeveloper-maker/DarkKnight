import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value)
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR')
}

export function calcGrowthRate(current: number, previous: number) {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}
