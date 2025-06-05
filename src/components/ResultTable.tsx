import React from "react";
import { Participant, RaceResult, SpecialCode } from "../types";

// 着順やスコアの集計
function getResultRows(participants: Participant[], raceResults: RaceResult[], discardCount: number) {
  return participants.map((p) => {
    const scores: (number | null)[] = [];
    let hasSpecialCode = false;
    raceResults.forEach((race) => {
      const res = race.find((r) => r.participantId === p.id);
      if (!res) {
        scores.push(null);
      } else if (res.code && res.code !== "") {
        // 特別コード（DNFなど）の場合は着順も表示
        hasSpecialCode = true;
        // 参加艇数+1点として計算
        scores.push(participants.length + 1);
      } else if (res.position !== null && res.position !== undefined) {
        scores.push(res.position);
      } else {
        scores.push(null);
      }
    });

    // カット対象を除く合計点
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

  // 合計点順に並べ替え
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
              <th style={{ minWidth: 60 }}>Total</th>
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
                {/* 合計点 */}
                <td
                  style={{
                    fontWeight: "bold",
                    background: "#e6f0d6",
                    textAlign: "center",
                    textDecoration: row.cutIndexes.length ? "line-through" : undefined,
                    color: row.cutIndexes.length ? "#888" : undefined,
                  }}
                >
                  {row.sum}
                </td>
                {/* 各レース点 */}
                {row.scores.map((score, i) => {
                  // DNF等の特別コードもあわせて表示
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
                      {special
                        ? `${score ?? ""} ${special}` // 着順と特別コード両方表示
                        : score ?? ""}
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
