import React, { useState } from 'react'
import { AppData, Participant } from '../types'

type Props = {
  data: AppData
  setData: (d: AppData) => void
}

const empty: Omit<Participant, 'id'> = { name: '', sailNumber: '', club: '' }

const Participants: React.FC<Props> = ({ data, setData }) => {
  const [input, setInput] = useState(empty)

  const addParticipant = () => {
    if (!input.name || !input.sailNumber) return
    setData({
      ...data,
      participants: [
        ...data.participants,
        {
          id: Date.now().toString(),
          ...input
        }
      ]
    })
    setInput(empty)
  }

  const remove = (id: string) => {
    setData({
      ...data,
      participants: data.participants.filter(p => p.id !== id),
      results: data.results.map(race =>
        race.filter(r => r.participantId !== id)
      )
    })
  }

  return (
    <section>
      <h2>参加者登録</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input placeholder="選手名" value={input.name} onChange={e => setInput(i => ({ ...i, name: e.target.value }))} />
        <input placeholder="セール番号" value={input.sailNumber} onChange={e => setInput(i => ({ ...i, sailNumber: e.target.value }))} />
        <input placeholder="クラブ名（任意）" value={input.club} onChange={e => setInput(i => ({ ...i, club: e.target.value }))} />
        <button onClick={addParticipant}>追加</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>選手名</th><th>セール番号</th><th>クラブ名</th><th></th>
          </tr>
        </thead>
        <tbody>
          {data.participants.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.sailNumber}</td>
              <td>{p.club}</td>
              <td><button onClick={() => remove(p.id)}>削除</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default Participants