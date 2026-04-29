'use client'

import { useState, useCallback } from 'react'
import Header from '@/components/layout/Header'
import { Upload, FileSpreadsheet, CheckCircle2, XCircle, Clock, Trash2 } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface UploadFile {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  rows?: number
  error?: string
}

const historyData = [
  { id: 1, file: '강남점_재고_2026-04-28.xlsx', rows: 342, status: 'success', time: '2026-04-28 14:22' },
  { id: 2, file: '홍대점_판매_2026-04-28.xlsx', rows: 218, status: 'success', time: '2026-04-28 13:10' },
  { id: 3, file: '부산점_재고_2026-04-27.xlsx', rows: 0, status: 'error', time: '2026-04-27 18:05', error: '필수 컬럼(branch_id) 누락' },
  { id: 4, file: '전체지점_매출_2026-04-27.xlsx', rows: 1205, status: 'success', time: '2026-04-27 09:30' },
]

export default function UploadPage() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArr = Array.from(newFiles).filter(
      (f) => f.name.match(/\.(xlsx|xls|csv)$/i)
    )
    const entries: UploadFile[] = fileArr.map((f) => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      status: 'pending',
      progress: 0,
    }))
    setFiles((prev) => [...prev, ...entries])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }, [addFiles])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files)
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const uploadAll = async () => {
    const pending = files.filter((f) => f.status === 'pending')
    for (const entry of pending) {
      setFiles((prev) =>
        prev.map((f) => f.id === entry.id ? { ...f, status: 'uploading', progress: 30 } : f)
      )
      const formData = new FormData()
      formData.append('file', entry.file)
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        setFiles((prev) =>
          prev.map((f) => f.id === entry.id
            ? { ...f, status: res.ok ? 'success' : 'error', progress: 100, rows: data.rows, error: data.error }
            : f
          )
        )
      } catch {
        setFiles((prev) =>
          prev.map((f) => f.id === entry.id ? { ...f, status: 'error', progress: 0, error: '업로드 실패' } : f)
        )
      }
    }
  }

  const hasPending = files.some((f) => f.status === 'pending')

  return (
    <div className="flex flex-col min-h-full">
      <Header title="데이터 업로드" subtitle="엑셀·CSV 파일을 업로드하면 자동으로 파싱·저장됩니다" />
      <div className="p-6 space-y-6">

        {/* 드래그앤드롭 존 */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
          }`}
        >
          <Upload className="w-10 h-10 mx-auto text-slate-500 mb-3" />
          <p className="text-slate-300 font-medium mb-1">파일을 여기에 드래그하거나</p>
          <p className="text-slate-500 text-sm mb-4">지원 형식: .xlsx, .xls, .csv</p>
          <label className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Upload className="w-4 h-4" />
            파일 선택
            <input type="file" multiple accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileInput} />
          </label>
        </div>

        {/* 파일 목록 */}
        {files.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-300">업로드 대기 파일</h2>
              {hasPending && (
                <button
                  onClick={uploadAll}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
                >
                  전체 업로드
                </button>
              )}
            </div>
            <div className="space-y-2">
              {files.map((f) => (
                <div key={f.id} className="flex items-center gap-3 bg-slate-700/40 rounded-lg px-4 py-3">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 truncate">{f.file.name}</p>
                    <p className="text-xs text-slate-500">{(f.file.size / 1024).toFixed(1)} KB</p>
                    {f.status === 'uploading' && (
                      <div className="mt-1 h-1 bg-slate-600 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${f.progress}%` }} />
                      </div>
                    )}
                    {f.error && <p className="text-xs text-red-400 mt-0.5">{f.error}</p>}
                  </div>
                  {f.rows !== undefined && f.status === 'success' && (
                    <span className="text-xs text-slate-400">{formatNumber(f.rows)}행</span>
                  )}
                  {f.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                  {f.status === 'error' && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                  {f.status === 'pending' && <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                  <button onClick={() => removeFile(f.id)} className="text-slate-600 hover:text-red-400 transition-colors ml-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 업로드 이력 */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">업로드 이력</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-slate-700">
                <th className="text-left pb-2 font-medium">파일명</th>
                <th className="text-left pb-2 font-medium">상태</th>
                <th className="text-right pb-2 font-medium">행 수</th>
                <th className="text-left pb-2 font-medium pl-4">오류</th>
                <th className="text-right pb-2 font-medium">업로드 시간</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {historyData.map((h) => (
                <tr key={h.id} className="text-slate-300 hover:bg-slate-700/30">
                  <td className="py-2.5 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                    {h.file}
                  </td>
                  <td className="py-2.5">
                    <span className={h.status === 'success'
                      ? 'text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs'
                      : 'text-red-400 bg-red-400/10 px-2 py-0.5 rounded text-xs'
                    }>
                      {h.status === 'success' ? '✓ 완료' : '✗ 오류'}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-slate-400">{h.rows > 0 ? formatNumber(h.rows) : '-'}</td>
                  <td className="py-2.5 pl-4 text-red-400 text-xs">{h.error || '-'}</td>
                  <td className="py-2.5 text-right text-slate-500">{h.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
