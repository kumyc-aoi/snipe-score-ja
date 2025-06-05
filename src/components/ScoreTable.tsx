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
  const { table, totals, cutIndexes, ranks } = calcRanking(data)

  // 合計点で昇順にソート（低いほど上位）
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
            <th>Bow #</th>
            <th>Sail #</th>
            <th>Belongs</th>
            <th>Skipper</th>
            <th>Crew</th>
            <th>Net</th>
            <th>Total</th>
            {data.results.map((_, i) => (
              <th key={i} style={{ minWidth: 40 }}>R{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedParticipants.map((p, idx) => (
            <tr key={p.id}>
              {/* 順位 */}
              <td style={{ textAlign: 'center', fontWeight: 'bold', background: '#e6f0d6' }}>{idx + 1}</td>
              {/* Bow #（Bow番号がなければ空白） */}
              <td style={{ textAlign: 'center' }}>{p.bowNumber ?? ''}</td>
              {/* Sail # */}
              <td style={{ textAlign: 'center' }}>{p.sailNumber ?? ''}</td>
              {/* Belongs（所属クラブ） */}
              <td>{p.club ?? ''}</td>
              {/* Skipper（艇長/選手名） */}
              <td>{p.skipper ?? p.name ?? ''}</td>
              {/* Crew */}
              <td>
                {Array.isArray(p.crew)
                  ? p.crew.filter(Boolean).join(', ')
                  : (p.crew ?? '')}
              </td>
              {/* Net（カット後合計点。通常は合計点と同じ） */}
              <td style={{
                background: '#e6f0d6',
                textAlign: 'center'
              }}>{totals[p.id]}</td>
              {/* Total（合計点） */}
              <td style={{
                background: '#e6f0d6',
                textAlign: 'center'
              }}>{totals[p.id]}</td>
              {/* 各レース点 */}
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
