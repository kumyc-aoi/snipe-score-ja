import React, { useRef } from 'react'
import { AppData } from '../types/types'

interface Props {
  appData: AppData
  importData: (data: AppData) => void
  clearAll: () => void
}

function ExportImportPanel({ appData, importData, clearAll }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const dataStr = JSON.stringify(appData, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "snipe-score-data.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string)
        importData(data)
        alert("インポートしました")
      } catch {
        alert("インポートに失敗しました")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div style={{margin:"32px 0", display:"flex", gap:20, flexWrap:"wrap"}}>
      <button onClick={handleExport}>エクスポート</button>
      <label>
        <button type="button" onClick={()=>fileRef.current?.click()}>インポート</button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          style={{display:"none"}}
          onChange={handleImport}
        />
      </label>
      <button onClick={clearAll}>クリア</button>
      <div style={{color:"#888", fontSize:13, marginLeft:16}}>
        入力内容は自動的に保存されます
      </div>
    </div>
  )
}

export default ExportImportPanel
