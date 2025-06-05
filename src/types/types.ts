export type SpecialCode = 'DNF' | 'DNS' | 'DSQ'

export interface Participant {
  name: string
  sailNo: string
  club?: string
}

export type RaceResult = (number | SpecialCode | null)[]

export interface AppData {
  participants: Participant[]
  raceResults: RaceResult[]
  discardCount: number
}
