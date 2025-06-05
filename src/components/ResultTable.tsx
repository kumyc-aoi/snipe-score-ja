import React from "react";
import { Participant, RaceResult, SpecialCode } from "../types";

function getResultRows(participants: Participant[], raceResults: RaceResult[], discardCount: number) {
  return participants.map((p) => {
    const scores: (number | null)[] = [];
    raceResults.forEach((race) => {
      const res = race.find((r) => r.participantId === p.id);
      if (!res) {
        scores.push(null);
      } else if (res.code && res.code !== "") {
        scores.push(res.position ?? participants.length + 1);
      } else if (res.position !== null && res.position !== undefined) {
        scores.push(res.position);
      } else {
        scores.push(null);
      }
    });

    const scoreWithIndexes = scores.map((v, i) => ({ v, i }));
    const sorted = [...scoreWithIndexes].sort((a, b) => (b.v ?? -1) - (a.v ?? -1));
    const cutIndexes = sorted.filter((s) => s.v !== null).slice(0, discardCount).map((s) => s.i);
    const sum = scores.reduce((acc, s, i) => (cutIndexes.includes(i) ? acc : acc + (s ?? 0)), 0);

    return {
      participant: p,
      scores,
      sum,
      cutIndexes,
    };
  });
}

function codeDisplay(code: SpecialCode | null | undefined) {
  if (!code) return "";
  if (code === "DNF") return "DNF";
  if (code === "DNS") return "DNS";
  if (code === "DSQ") return "DSQ";
  if (code === "BFD") return "BFD";
  return "";
}

function ResultTable({
  participants,
  raceResults,
  discardCount,
}: {
  participants: Participant[];
  raceResults: RaceResult[];
  discardCount: number;
}) {
  if (participants.length === 0 || raceResults.length === 0) return null;

  const rows = getResultRows(participants, raceResults, discardCount);
  const raceCount = raceResults.length;

  const sortedRows = [...rows].sort((a, b) => a.sum - b.sum);

  return (
    <section style={{ marginTop: 40 }}>
      <h2>順位表</h2>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            minWidth: 600,
            borderCollapse: "collapse",
            fontSize: 15,
            background: "#fff",
          }}
        >
          <thead>
            <tr style={{ background: "#e6f0d6" }}>
              <th>Rank</th>
              <th>セールNo.</th>
              <th>クラブ</th>
              <th>スキッパー</th>
              <th>クルー</th>
              <th>Total</th>
              {Array.from({ length: raceCount }, (_, i) => (
                <th key={i} style={{ minWidth: 40 }}>
                  R{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, idx) => (
              <tr key={row.participant.id}>
                <td style={{ textAlign: 'center', fontWeight: 'bold', background: '#e6f0d6' }}>{idx + 1}</td>
                <td style={{ textAlign: 'center' }}>{row.participant.sailNumber ?? ''}</td>
                <td>{row.participant.club ?? ''}</td>
                <td>{row.participant.skipper ?? row.participant.name ?? ''}</td>
                <td>
                  {Array.isArray(row.participant.crew)
                    ? row.participant.crew.filter(Boolean).join(', ')
                    : (row.participant.crew ?? '')}
                </td>
                <td style={{ background: '#e6f0d6', textAlign: 'center' }}>{row.sum}</td>
                {row.scores.map((score, i) => {
                  const race = raceResults[i];
                  const res = race.find((r) => r.participantId === row.participant.id);
                  const special = codeDisplay(res?.code);
                  return (
                    <td
                      key={i}
                      style={{
                        textAlign: "center",
                        textDecoration: row.cutIndexes.includes(i) ? "line-through" : undefined,
                        background: row.cutIndexes.includes(i) ? "#ffe0e0" : undefined,
                        color: row.cutIndexes.includes(i) ? "#888" : undefined,
                      }}
                    >
                      {score !== null && score !== undefined ? score : ""}
                      {special ? ` ${special}` : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul style={{ fontSize: 13, color: "#888", marginTop: 8 }}>
        <li>DNF/DNS/DSQ/BFDは「参加艇数+1点」</li>
        <li>カット（破棄）対象スコアは取消線＋色付き</li>
        <li>特別コードがある場合でも着順を表示します</li>
      </ul>
    </section>
  );
}

export default ResultTable;
