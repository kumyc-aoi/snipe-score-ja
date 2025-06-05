import React, { useState } from "react";
import { Participant } from "../types";

type Props = {
  initial?: Participant;
  onSubmit: (p: Participant) => void;
  onCancel: () => void;
};

const ParticipantForm: React.FC<Props> = ({ initial, onSubmit, onCancel }) => {
  const [sailNumber, setSailNumber] = useState(initial?.sailNumber ?? "");
  const [club, setClub] = useState(initial?.club ?? "");
  const [skipper, setSkipper] = useState(initial?.skipper ?? "");
  const [crew, setCrew] = useState(initial?.crew?.join(", ") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      id: initial?.id ?? Math.random().toString(36).slice(2),
      sailNumber: sailNumber.trim(),
      club: club.trim(),
      skipper: skipper.trim(),
      crew: crew.split(",").map((c) => c.trim()).filter(Boolean),
    });
    onCancel();
  }

  return (
    <form onSubmit={handleSubmit} style={{ margin: "16px 0", background: "#f6f6f6", padding: 10 }}>
      <div>
        <label>
          セールNo. <input value={sailNumber} onChange={(e) => setSailNumber(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          クラブ <input value={club} onChange={(e) => setClub(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          スキッパー <input value={skipper} onChange={(e) => setSkipper(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          クルー（カンマ区切り） <input value={crew} onChange={(e) => setCrew(e.target.value)} />
        </label>
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit">保存</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
          キャンセル
        </button>
      </div>
    </form>
  );
};

export default ParticipantForm;
