import React from 'react'
import { Participant, RaceResult, SpecialCode } from '../types/types'

// ローポイント計算・カット判定
function getResultRows(participants: Participant[], raceResults: RaceResult[], discardCount: number) {
  const totalRaces = raceResults.length
  const boatCount = participants.length
  const rows = participants.map((p, idx) => {
    // 各レースのスコア
    const scores = raceResults.map(race => {
      const v = race[idx]
      if (typeof v === 'number' && v > 0) return v
      if (v === 'DNF' || v === 'DNS' || v === 'DSQ') return boatCount + 1
      return null
    })

    // カット対象を除く合計点
    const scoreWithIndexes = scores.map((v, i) => ({v, i}))
    const sorted = [...scoreWithIndexes].sort((a,b)=> (b.v??-1)-(a.v??-1))
    const cutIndexes = sorted.filter(s=>s.v!==null).slice(0, discardCount).map(s=>s.i)
    const sum = scores.reduce((acc, s, i) =>
      cutIndexes.includes(i) ? acc : acc + (s ?? 0), 0
    )
    return {
      participant: p,
      scores,
      sum,
      cutIndexes,
    }
  })

  // 順位計算（合計点が低い順、同点は同順位）
  const sorted = [...rows].sort((a, b) => a.sum - b.sum)
  let lastSum: number | null = null
  let lastRank = 1
  let sameRankCount = 0
  const withRank = sorted.map((row, idx) => {
    if (lastSum === row.sum) {
      sameRankCount++
      return { ...row, rank: lastRank }
    } else {
      lastRank = idx + 1
      lastSum = row.sum
      sameRankCount = 0
      return { ...row, rank: lastRank }
    }
  })

  // 元の順に戻す
  return rows.map(row =>
    withRank.find(r => r.participant === row.participant)!
  )
}

function codeDisplay(code: SpecialCode | null | undefined) {
  if (!code) return ""
  if (code === "DNF") return "DNF"
  if (code === "DNS") return "DNS"
  if (code === "DSQ") return "DSQ"
  return ""
}

function ResultTable({ participants, raceResults, discardCount }: {
  participants: Participant[],
  raceResults: RaceResult[],
  discardCount: number
}) {
  if (participants.length === 0 || raceResults.length === 0) return null

  const rows = getResultRows(participants, raceResults, discardCount)
  const raceCount = raceResults.length

  // rowsを合計点昇順に並べ替え
  const sortedRows = [...rows].sort((a, b) => a.sum - b.sum)

  return (
    <section style={{marginTop:40}}>
      <h2>順位表</h2>
      <div style={{overflowX:'auto'}}>
      <table style={{
        minWidth: 600,
        borderCollapse: "collapse",
        fontSize: 15,
        background: "#fff"
      }}>
        <thead>
          <tr style={{background:"#f5f5f5"}}>
            <th>順位</th>
            <th>選手名</th>
            <th>セールNo.</th>
            <th>クラブ</th>
            {Array.from({length: raceCount}, (_, i) => <th key={i}>R{i+1}</th>)}
            <th>合計点</th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, idx) =>
            <tr key={idx}>
              <td style={{fontWeight:"bold"}}>{idx + 1}</td>
              <td>{row.participant.name}</td>
              <td>{row.participant.sailNo}</td>
              <td>{row.participant.club}</td>
              {row.scores.map((score, i) =>
                <td key={i} style={{
                  // ...省略...
                }}>{score ?? ""}</td>
              )}
              <td>{row.sum}</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </section>
  )
}

export default ResultTable
