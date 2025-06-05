import React from 'react'
import { Participant, RaceResult, RaceCode } from '../types'

type Props = {
  participants: Participant[]
  raceResults: RaceResult
  onChange: (results: RaceResult) => void
}

const resultCodes: RaceCode[] = ['', 'DNF', 'DNS', 'DSQ', 'BFD']

const RaceInputTable: React.FC<Props> = ({ participants, raceResults, onChange }) => {
  const updateResult = (participantId: string, field: 'position' | 'code', value: any) => {
    const newResults = raceResults.map(res =>
      res.participantId !== participantId
        ? res
        : {
            ...res,
            [field]: field === 'position' ? (value ? Number(value) : null) : value
          }
    )
    onChange(newResults)
  }

  return (
    <table>
      <thead>
        <tr>
          <th>セールNo.</th>
          <th>クラブ</th>
          <th>スキッパー</th>
          <th>クルー</th>
          <th>順位</th>
          <th>特別</th>
        </tr>
      </thead>
      <tbody>
        {participants.map((p) => {
          const result = raceResults.find(r => r.participantId === p.id) || { position: '', code: '' }
          return (
            <tr key={p.id}>
              <td>{p.sailNumber ?? ''}</td>
              <td>{p.club ?? ''}</td>
              <td>{p.skipper ?? p.name ?? ''}</td>
              <td>
                {Array.isArray(p.crew)
                  ? p.crew.filter(Boolean).join(', ')
                  : (p.crew ?? '')}
              </td>
              <td>
                <input
                  type="number"
                  min={1}
                  style={{ width: 60 }}
                  value={result.position ?? ''}
                  onChange={e =>
                    updateResult(p.id, 'position', e.target.value)
                  }
                />
              </td>
              <td>
                <select
                  value={result.code}
                  onChange={e =>
                    updateResult(p.id, 'code', e.target.value)
                  }
                >
                  {resultCodes.map(code =>
                    <option value={code} key={code}>{code || '-'}</option>
                  )}
                </select>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default RaceInputTable
