import React, { useState, useEffect } from "react";
import { Participant, RaceResult, AllRaceResults } from "./types";
import Participants from "./components/Participants";
import ParticipantForm from "./components/ParticipantForm";
import RaceInputTable from "./components/RaceInputTable";
import ScoreTable from "./components/ScoreTable";
import ParticipantsExportImport from "./components/ParticipantsExportImport";

const PARTICIPANTS_KEY = "snipe-score-participants";
const RESULTS_KEY = "snipe-score-results";

export default function App() {
  // localStorageからの初期化
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const s = localStorage.getItem(PARTICIPANTS_KEY);
    return s ? JSON.parse(s) : [];
  });
  const [results, setResults] = useState<AllRaceResults>(() => {
    const s = localStorage.getItem(RESULTS_KEY);
    return s ? JSON.parse(s) : [];
  });

  const [editing, setEditing] = useState<Participant | null>(null);
  const [showForm, setShowForm] = useState(false);

  // 参加者・結果が変わるたびにlocalStorageへ保存
  useEffect(() => {
    localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(participants));
  }, [participants]);
  useEffect(() => {
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  }, [results]);

  // 参加者追加・編集
  function handleSubmitParticipant(p: Participant) {
    setParticipants((prev) =>
      prev.some((pp) => pp.id === p.id)
        ? prev.map((pp) => (pp.id === p.id ? p : pp))
        : [...prev, p]
    );
    setShowForm(false);
  }
  function handleAddParticipant() {
    setEditing(null);
    setShowForm(true);
  }
  function handleEditParticipant(id: string) {
    setEditing(participants.find((p) => p.id === id) ?? null);
    setShowForm(true);
  }
  function handleDeleteParticipant(id: string) {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
    // 削除時に各レース結果も削除
    setResults((prev) =>
      prev.map((race) => race.filter((r) => r.participantId !== id))
    );
  }

  // レース追加・削除
  function handleAddRace() {
    setResults((prev) => [
      ...prev,
      participants.map((p) => ({
        participantId: p.id,
        position: null,
        code: "",
      })),
    ]);
  }
  function handleRemoveRace(idx: number) {
    setResults((prev) => prev.filter((_, i) => i !== idx));
  }
  // レース結果更新
  function handleUpdateRace(raceIdx: number, newRace: RaceResult[]) {
    setResults((prev) => prev.map((race, i) => (i === raceIdx ? newRace : race)));
  }

  // すべてリセット
  function handleResetAll() {
    if (window.confirm("全ての参加者・レース・結果をリセットします。よろしいですか？")) {
      setParticipants([]);
      setResults([]);
      localStorage.removeItem(PARTICIPANTS_KEY);
      localStorage.removeItem(RESULTS_KEY);
    }
  }

  // 各レースごとのリセット
  function handleResetRace(idx: number) {
    if (window.confirm(`第${idx + 1}レースの結果をリセットします。よろしいですか？`)) {
      setResults((prev) =>
        prev.map((race, i) =>
          i === idx
            ? participants.map((p) => ({
                participantId: p.id,
                position: null,
                code: "",
              }))
            : race
        )
      );
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 950, margin: "0 auto" }}>
      <h1 style={{ lineHeight: 1.2 }}>
        Snipe Score
        <br />
        <span style={{ fontSize: "0.6em", float: "right" }}>日本語版</span>
      </h1>

      {/* 参加者リストのエクスポート・インポートボタン */}
      <ParticipantsExportImport
        participants={participants}
        onImport={(list) => {
          setParticipants(list);
          setResults([]); // 参加者を入れ替えたらレース結果もリセット
        }}
      />

      <button onClick={handleAddParticipant}>参加者追加</button>
      <button onClick={handleResetAll} style={{ marginLeft: 10, color: "red" }}>
        すべてリセット
      </button>
      {showForm && (
        <ParticipantForm
          initial={editing ?? undefined}
          onSubmit={handleSubmitParticipant}
          onCancel={() => setShowForm(false)}
        />
      )}
      <Participants
        participants={participants}
        onEdit={handleEditParticipant}
        onDelete={handleDeleteParticipant}
      />

      <section style={{ marginTop: 40 }}>
        <h2>レース入力</h2>
        <button onClick={handleAddRace}>レースを追加</button>
        {results.map((race, idx) => (
          <div key={idx} style={{ marginBottom: 20, border: "1px solid #aaa", padding: 8 }}>
            <div style={{ marginBottom: 4 }}>
              <b>第{idx + 1}レース</b>
              <button onClick={() => handleRemoveRace(idx)} style={{ marginLeft: 12, color: "red" }}>
                削除
              </button>
              <button
                onClick={() => handleResetRace(idx)}
                style={{ marginLeft: 12 }}
              >
                このレースをリセット
              </button>
            </div>
            <RaceInputTable
              participants={participants}
              raceResults={race}
              onChange={(newRace) => handleUpdateRace(idx, newRace)}
            />
          </div>
        ))}
      </section>

      <ScoreTable participants={participants} results={results} />
    </div>
  );
}
