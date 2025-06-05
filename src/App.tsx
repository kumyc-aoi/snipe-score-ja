import React, { useEffect, useState } from 'react'
import { Participant, RaceResult, SpecialCode, AppData } from './types/types'
import ParticipantForm from './components/ParticipantForm'
import RaceInputTable from './components/RaceInputTable'
import ResultTable from './components/ResultTable'
import ExportImportPanel from './components/ExportImportPanel'
import DiscardControl from './components/DiscardControl'

// ローカルストレージキー
const STORAGE_KEY = 'snipe-score-ja-appdata'

function defaultAppData(): AppData {
  return {
    participants: [],
    raceResults: [],
    discardCount: 0,
  }
}

function App() {
  const [appData, setAppData] = useState<AppData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : defaultAppData()
    } catch {
      // 万一localStorageが壊れていた場合も初期化
      localStorage.removeItem(STORAGE_KEY)
      return defaultAppData()
    }
  })

  // 自動保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData))
  }, [appData])

  // データ操作関数群
  const addParticipant = (p: Participant) => {
    setAppData((prev: AppData) => ({
      ...prev,
      participants: [...prev.participants, p],
      raceResults: prev.raceResults.map(r => [...r, null])
    }))
  }

  const removeParticipant = (idx: number) => {
    setAppData((prev: AppData) => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== idx),
      raceResults: prev.raceResults.map(r => r.filter((_, i) => i !== idx))
    }))
  }

  const addRace = () => {
    setAppData((prev: AppData) => ({
      ...prev,
      raceResults: [...prev.raceResults, Array(prev.participants.length).fill(null)]
    }))
  }

  const updateRaceResult = (raceIdx: number, partIdx: number, value: number | SpecialCode | null) => {
    setAppData((prev: AppData) => ({
      ...prev,
      raceResults: prev.raceResults.map((r, i) =>
        i === raceIdx ? r.map((v, j) => j === partIdx ? value : v) : r
      )
    }))
  }

  const setDiscardCount = (count: number) => {
    setAppData((prev: AppData) => ({
      ...prev,
      discardCount: count
    }))
  }

  const clearAll = () => {
    if(window.confirm('すべてのデータをリセットします。よろしいですか？')) {
      setAppData(defaultAppData())
    }
  }

  const importData = (data: AppData) => setAppData(data)

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 12, fontFamily: "sans-serif" }}>
      <h1>スナイプ級ヨットレース 順位自動集計ツール</h1>
      <ParticipantForm
        participants={appData.participants}
        addParticipant={addParticipant}
        removeParticipant={removeParticipant}
        disabled={appData.raceResults.length > 0}
      />
      <RaceInputTable
        participants={appData.participants}
        raceResults={appData.raceResults}
        addRace={addRace}
        updateRaceResult={updateRaceResult}
      />
      <DiscardControl
        raceCount={appData.raceResults.length}
        discardCount={appData.discardCount}
        setDiscardCount={setDiscardCount}
      />
      <ResultTable
        participants={appData.participants}
        raceResults={appData.raceResults}
        discardCount={appData.discardCount}
      />
      <ExportImportPanel
        appData={appData}
        importData={importData}
        clearAll={clearAll}
      />
      <footer style={{marginTop:40, textAlign:"center", fontSize:13, color:"#888"}}>
        © 2025 Snipe Score JA | Powered by React + Vite
      </footer>
    </div>
  )
}

export default App
