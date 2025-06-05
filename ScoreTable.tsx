import React from 'react'
import { AppData, RaceCode } from '../types'
import { calcRanking } from '../logic/ranking'

type Props = {
  data: AppData
}

const codeMap: Record<RaceCode, string> = {
  '': '',
  'DNF': 'DNF',
  'DNS': 'DNS',
  'DSQ': 'DSQ'
}

const ScoreTable: React.FC<Props> = ({ data }) => {
  const { table, totals, cutIndexes, ranks } = calcRanking(data)

  return (
    <section>
      <h2>順位表</h2>
      <table border={1} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>順位</th>
            <th>選手名</th>
            <th>セール番号</th>
            <th>クラブ名</th>
            {data.results.map((_, i) => <th key={i}>R{i + 1}</th>)}
            <th>合計</th>
          </tr>
        </thead>
        <tbody>
          {data.participants.map((p, idx) => (
            <tr key={p.id}>
              <td>{ranks[p.id] ?? '-'}</td>
              <td>{p.name}</td>
              <td>{p.sailNumber}</td>
              <td>{p.club}</td>
              {table[p.id].map((sc, rIdx) => (
                <td key={rIdx} style={{
                  textDecoration: cutIndexes[p.id].includes(rIdx) ? 'line-through' : undefined,
                  background: cutIndexes[p.id].includes(rIdx) ? '#ffe0e0' : undefined
                }}>
                  {sc.code ? codeMap[sc.code] : sc.point}
                </td>
              ))}
              <td style={{
                textDecoration: cutIndexes[p.id].length ? 'line-through' : undefined,
                background: cutIndexes[p.id].length ? '#ffe0e0' : undefined
              }}>{totals[p.id]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul style={{ fontSize: 13, color: '#888', marginTop: 8 }}>
        <li>DNF/DNS/DSQは「参加艇数+1点」</li>
        <li>カット（破棄）対象スコアは取消線＋色付き</li>
      </ul>
    </section>
  )
}

export default ScoreTable