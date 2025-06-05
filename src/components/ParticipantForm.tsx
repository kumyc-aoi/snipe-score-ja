import React, { useRef, useState } from 'react'
import { Participant } from '../types/types'

interface Props {
  participants: Participant[]
  addParticipant: (p: Participant) => void
  removeParticipant: (idx: number) => void
  disabled?: boolean
}

function ParticipantForm({ participants, addParticipant, removeParticipant, disabled }: Props) {
  const [name, setName] = useState('')
  const [sailNo, setSailNo] = useState('')
  const [club, setClub] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !sailNo) return
    addParticipant({ name, sailNo, club })
    setName('')
    setSailNo('')
    setClub('')
    nameRef.current?.focus()
  }

  return (
    <section>
      <h2>参加者登録</h2>
      <form style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }} onSubmit={handleAdd}>
        <div>
          <label>選手名<br/>
            <input ref={nameRef} disabled={disabled} value={name} onChange={e=>setName(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>セール番号<br/>
            <input disabled={disabled} value={sailNo} onChange={e=>setSailNo(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>クラブ名（任意）<br/>
            <input disabled={disabled} value={club} onChange={e=>setClub(e.target.value)} />
          </label>
        </div>
        <button type="submit" disabled={disabled || !name || !sailNo}>追加</button>
      </form>
      <div style={{marginTop:12}}>
        <table style={{width:"100%", maxWidth:500, borderCollapse:"collapse"}}>
          <thead>
            <tr style={{background:"#f5f5f5"}}><th>選手名</th><th>セールNo.</th><th>クラブ</th><th></th></tr>
          </thead>
          <tbody>
            {participants.map((p, i) =>
              <tr key={i}>
                <td>{p.name}</td>
                <td>{p.sailNo}</td>
                <td>{p.club}</td>
                <td>
                  <button onClick={()=>removeParticipant(i)} disabled={disabled}>削除</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {disabled && <div style={{color:"#888", fontSize:13, marginTop:4}}>※レース開始後の参加者編集はできません</div>}
    </section>
  )
}

export default ParticipantForm
