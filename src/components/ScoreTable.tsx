import React from "react";
import { Participant, AllRaceResults } from "../types";

// シンプルな集計ロジック：カットなし、特別コードは参加者数+1点
function calcScore(
  participants: Participant[],
  results: AllRaceResults
): { [id: string]: number } {
  const n = participants.length;
  const total: { [id: string]: number } = {};
  participants.forEach((p) => (total[p.id] = 0));
  results.forEach((race) => {
    race.forEach((res) => {
      if (res.position && !res.code) {
        total[res.participantId] += res.position;
      } else if (res.code) {
        total[res.participantId] += n + 1;
      }
    });
  });
  return total;
}

const codeMap: { [k: string]: string } = {
  DNF: "DNF",
  DNS: "DNS",
  DSQ: "DSQ",
  BFD: "BFD",
  "": "",
};

type Props = {
  participants: Participant[];
  results: AllRaceResults;
};

const ScoreTable: React.FC<Props> = ({ participants, results }) => {
  if (participants.length === 0 || results.length === 0) return null;
  const scores = calcScore(participants, results);

  const sorted = [...participants].sort((a, b) => scores[a.id] - scores[b.id]);

  return (
    <section style={{ marginTop: 40 }}>
      <h2>順位表</h2>
      <table border={1} style={{ borderCollapse: "collapse", width: "100%", background: "#fff", fontSize: 15 }}>
        <thead>
          <tr style={{ background: "#e6f0d6" }}>
            <th>Rank</th>
            <th>セールNo.</th>
            <th>クラブ</th>
            <th>スキッパー</th>
            <th>クルー</th>
            <th>Total</th>
            {results.map((_, i) => (
              <th key={i}>R{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, idx) => (
            <tr key={p.id}>
              <td>{idx + 1}</td>
              <td>{p.sailNumber}</td>
              <td>{p.club}</td>
              <td>{p.skipper}</td>
              <td>{p.crew.join(", ")}</td>
              <td style={{ background: "#e6f0d6" }}>{scores[p.id]}</td>
              {results.map((race, i) => {
                const res = race.find((r) => r.participantId === p.id);
                return (
                  <td key={i} style={{ textAlign: "center" }}>
                    {res
                      ? res.code
                        ? codeMap[res.code]
                        : res.position || ""
                      : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <ul style={{ fontSize: 13, color: "#888", marginTop: 8 }}>
        <li>DNF/DNS/DSQ/BFDは「参加艇数+1点」</li>
        <li>カットなし・シンプル集計例</li>
      </ul>
    </section>
  );
};

export default ScoreTable;
