import React, { useState } from 'react'
import Participants from './components/Participants'
import ParticipantsForm from './components/ParticipantForm'
import { Participant } from './types'

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [editing, setEditing] = useState<Participant | null>(null)
  const [showForm, setShowForm] = useState(false)

  function handleAddClick() {
    setEditing(null)
    setShowForm(true)
  }

  function handleEdit(id: string) {
    setEditing(participants.find(p => p.id === id) ?? null)
    setShowForm(true)
  }

  function handleDelete(id: string) {
    setParticipants(prev => prev.filter(p => p.id !== id))
  }

  function handleSubmit(participant: Participant) {
    setParticipants(prev =>
      prev.some(p => p.id === participant.id)
        ? prev.map(p => p.id === participant.id ? participant : p)
        : [...prev, participant]
    )
    setShowForm(false)
  }

  function handleCancel() {
    setShowForm(false)
  }

  return (
    <div>
      <button onClick={handleAddClick}>参加者追加</button>
      {showForm && (
        <ParticipantsForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
      <Participants
        participants={participants}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
