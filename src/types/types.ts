export type Participant = {
  id: string;
  sailNumber: string;
  club: string;
  skipper: string;
  crew: string[]; // 複数名OK
};

export type RaceResult = {
  participantId: string;
  position: number | null; // 着順
  code: "DNF" | "DNS" | "DSQ" | "BFD" | "" | null; // 特別コード
};

export type AllRaceResults = RaceResult[][]; // [レース1, レース2, ...]
