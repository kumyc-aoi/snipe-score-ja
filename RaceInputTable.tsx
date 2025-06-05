import React from 'react'
import { Participant, RaceResult, SpecialCode } from '../types/types'

interface Props {
  participants: Participant[]
  raceResults: RaceResult[]
  addRace: () => void
  updateRaceResult: (raceIdx: number, partIdx: number, value: number | SpecialCode | null) => void
}

const specialCodes: SpecialCode[] = ['DNF', 'DNS', 'DSQ']

function RaceInputTable({ participants, raceResults, addRace, updateRaceResult }: Props) {
  if (participants.length === 0) return null

  return (
    <section style={{marginTop:32}}>
      <h2>レース結果入力</h2>
      <button onClick={addRace} style={{marginBottom:8}}>レースを追加</button>
      <table style={{width:"100%", maxWidth:800, borderCollapse:"collapse", fontSize:15}}>
        <thead>
          <tr>
            <th>選手名</th>
            {raceResults.map((_, raceIdx) =>
              <th key={raceIdx}>R{raceIdx+1}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {participants.map((p, partIdx) =>
            <tr key={partIdx}>
              <td>{p.name}</td>
              {raceResults.map((race, raceIdx) =>
                <td key={raceIdx}>
                  <RaceResultInput
                    value={race[partIdx]}
                    onChange={v => updateRaceResult(raceIdx, partIdx, v)}
                  />
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>
      {raceResults.length === 0 && <div style={{color:"#888", fontSize:13}}>※「レースを追加」して結果入力を開始してください</div>}
    </section>
  )
}

function RaceResultInput({ value, onChange }: { value: number | SpecialCode | null, onChange: (v: number | SpecialCode | null) => void }) {
  return (
    <span>
      <input
        type="number"
        min={1}
        style={{width:48}}
        value={typeof value === 'number' && value > 0 ? value : ''}
        onChange={e => {
          const v = e.target.value
          onChange(v ? Number(v) : null)
        }}
      />
      <select
        value={typeof value === 'string' ? value : ''}
        onChange={e => {
          onChange(e.target.value as SpecialCode || null)
        }}
      >
        <option value="">---</option>
        {specialCodes.map(code =>
          <option value={code} key={code}>{code}</option>
        )}
      </select>
    </span>
  )
}

export default RaceInputTable