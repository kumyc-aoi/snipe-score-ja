export type Participant = {
  id: string
  name: string
  sailNumber: string
  club?: string
}

export type RaceCode = '' | 'DNF' | 'DNS' | 'DSQ'

export type RaceResult = {
  participantId: string
  position: number | null // 順位（1,2,3...） nullなら未入力
  code: RaceCode // DNFなど
}

export type AppData = {
  participants: Participant[]
  results: RaceResult[][]
  cutCount: number
}