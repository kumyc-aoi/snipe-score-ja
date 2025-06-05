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
  'DSQ': 'DSQ',
  'BFD': 'BFD',
}

const ScoreTable: React.FC<Props> = ({ data }) => {
  const { table, totals, cutIndexes } = calcRanking(data)
  const sortedParticipants = [...data.participants].sort((a, b) => {
    const atotal = totals[a.id] ?? Infinity
    const btotal = totals[b.id] ?? Infinity
    return atotal - btotal
  })

  return (
    <section>
      <h2>順位表</h2>
      <table border={1} style={{ borderCollapse: 'collapse', width: '100%', background: '#fff', fontSize: 15 }}>
        <thead>
          <tr style={{ background: '#e6f0d6' }}>
            <th>Rank</th>
            <th>セールNo.</th>
            <th>クラブ</th>
            <th>スキッパー</th>
            <th>クルー</th>
            <th>Total</th>
            {data.results.map((_, i) => (
              <th key={i} style={{ minWidth: 40 }}>R{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedParticipants.map((p, idx) => (
            <tr key={p.id}>
              <td style={{ textAlign: 'center', fontWeight: 'bold', background: '#e6f0d6' }}>{idx + 1}</td>
              <td style={{ textAlign: 'center' }}>{p.sailNumber ?? ''}</td>
              <td>{p.club ?? ''}</td>
              <td>{p.skipper ?? p.name ?? ''}</td>
              <td>
                {Array.isArray(p.crew)
                  ? p.crew.filter(Boolean).join(', ')
                  : (p.crew ?? '')}
              </td>
              <td style={{ background: '#e6f0d6', textAlign: 'center' }}>{totals[p.id]}</td>
              {table[p.id].map((sc, rIdx) => (
                <td key={rIdx} style={{
                  textAlign: 'center',
                  textDecoration: cutIndexes[p.id]?.includes(rIdx) ? 'line-through' : undefined,
                  background: cutIndexes[p.id]?.includes(rIdx) ? '#ffe0e0' : undefined,
                  color: cutIndexes[p.id]?.includes(rIdx) ? '#888' : undefined
                }}>
                  {sc.code ? codeMap[sc.code] : sc.point}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ul style={{ fontSize: 13, color: '#888', marginTop: 8 }}>
        <li>DNF/DNS/DSQ/BFDは「参加艇数+1点」</li>
        <li>カット（破棄）対象スコアは取消線＋色付き</li>
      </ul>
    </section>
  )
}

export default ScoreTable
