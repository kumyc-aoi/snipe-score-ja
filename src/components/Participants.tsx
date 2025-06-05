import React from "react";
import { Participant } from "../types";

type Props = {
  participants: Participant[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const Participants: React.FC<Props> = ({ participants, onEdit, onDelete }) => (
  <section>
    <h2>参加者一覧</h2>
    <table border={1} style={{ borderCollapse: "collapse", width: "100%", fontSize: 15 }}>
      <thead>
        <tr style={{ background: "#e6f0d6" }}>
          <th>セールNo.</th>
          <th>クラブ</th>
          <th>スキッパー</th>
          <th>クルー</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {participants.map((p) => (
          <tr key={p.id}>
            <td>{p.sailNumber}</td>
            <td>{p.club}</td>
            <td>{p.skipper}</td>
            <td>{p.crew.join(", ")}</td>
            <td>
              <button onClick={() => onEdit(p.id)}>編集</button>
              <button onClick={() => onDelete(p.id)} style={{ marginLeft: 8, color: "red" }}>
                削除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);

export default Participants;
