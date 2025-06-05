import React, { useRef } from 'react'
import { AppData } from '../types'
import { loadData, saveData } from '../utils/storage'

type Props = {
  data: AppData
  setData: (d: AppData) => void
}

const Controls: React.FC<Props> = ({ data, setData }) => {
  const fileRef = useRef<HTMLInputElement>(null)

  const clearAll = () => {
    if (window.confirm('本当にすべてリセットしますか？')) {
      setData({ participants: [], results: [], cutCount: 0 })
      saveData({ participants: [], results: [], cutCount: 0 })
    }
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'snipe_score_data.json'
    a.click()
  }

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      try {
        const imported = JSON.parse(evt.target?.result as string)
        setData(imported)
        saveData(imported)
        alert('インポートしました')
      } catch {
        alert('不正なデータです')
      }
    }
    reader.readAsText(file)
  }

  return (
    <section style={{ margin: '16px 0' }}>
      <label>
        カット数（破棄）：　
        <input
          type="number"
          min={0}
          max={data.results.length}
          value={data.cutCount}
          onChange={e =>
            setData({ ...data, cutCount: Number(e.target.value) })
          }
          style={{ width: 60 }}
        />
      </label>
      <button onClick={exportData} style={{ marginLeft: 8 }}>エクスポート</button>
      <button onClick={() => fileRef.current?.click()} style={{ marginLeft: 8 }}>インポート</button>
      <input
        type="file"
        ref={fileRef}
        accept="application/json"
        style={{ display: 'none' }}
        onChange={importData}
      />
      <button onClick={clearAll} style={{ marginLeft: 8, color: 'red' }}>クリア</button>
    </section>
  )
}

export default Controls
