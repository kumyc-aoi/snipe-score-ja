import React from 'react'
import { AppData, RaceResult, RaceCode } from '../types'

type Props = {
  data: AppData
  setData: (d: AppData) => void
}

const resultCodes: RaceCode[] = ['', 'DNF', 'DNS', 'DSQ']

const RaceResults: React.FC<Props> = ({ data, setData }) => {
  const addRace = () => {
    setData({
      ...data,
      results: [
        ...data.results,
        data.participants.map(p => ({
          participantId: p.id,
          position: null,
          code: ''
        }))
      ]
    })
  }

  const removeRace = (i: number) => {
    setData({
      ...data,
      results: data.results.filter((_, idx) => idx !== i)
    })
  }

  const updateResult = (raceIdx: number, pid: string, field: 'position' | 'code', value: any) => {
    setData({
      ...data,
      results: data.results.map((race, idx) =>
        idx !== raceIdx ? race : race.map(result =>
          result.participantId !== pid
            ? result
            : {
                ...result,
                [field]: field === 'position' ? (value ? Number(value) : null) : value
              }
        )
      )
    })
  }

  return (
    <section>
      <h2>レース結果入力</h2>
      <button onClick={addRace} style={{ marginBottom: 8 }}>レースを追加</button>
      {data.results.map((race, raceIdx) => (
        <div key={raceIdx} style={{ border: '1px solid #aaa', padding: 8, marginBottom: 8 }}>
          <div style={{ marginBottom: 4 }}>
            <b>第{raceIdx + 1}レース</b>
            <button style={{ marginLeft: 8, color: 'red' }} onClick={() => removeRace(raceIdx)}>削除</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>選手名</th><th>順位</th><th>特別</th>
              </tr>
            </thead>
            <tbody>
              {race.map(result => {
                const participant = data.participants.find(p => p.id === result.participantId)
                if (!participant) return null
                return (
                  <tr key={result.participantId}>
                    <td>{participant.name}</td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        style={{ width: 60 }}
                        value={result.position ?? ''}
                        onChange={e =>
                          updateResult(raceIdx, result.participantId, 'position', e.target.value)
                        }
                        disabled={result.code !== ''}
                      />
                    </td>
                    <td>
                      <select
                        value={result.code}
                        onChange={e =>
                          updateResult(raceIdx, result.participantId, 'code', e.target.value)
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
        </div>
      ))}
    </section>
  )
}

export default RaceResults