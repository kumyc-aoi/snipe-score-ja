import React, { useRef } from "react";
import { Participant } from "../types";

type Props = {
  participants: Participant[];
  onImport: (list: Participant[]) => void;
};

const ParticipantsExportImport: React.FC<Props> = ({ participants, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // エクスポート
  function handleExport() {
    const text = JSON.stringify(participants, null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "participants.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // インポート
  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (!Array.isArray(data)) throw new Error("Invalid format");
        // 最低限の型チェック
        const list: Participant[] = data.map((item, i) => ({
          id: typeof item.id === "string" ? item.id : Math.random().toString(36).slice(2),
          sailNumber: item.sailNumber ?? "",
          club: item.club ?? "",
          skipper: item.skipper ?? "",
          crew: Array.isArray(item.crew)
            ? item.crew.map((c: any) => String(c))
            : typeof item.crew === "string"
            ? item.crew.split(",").map((c: string) => c.trim()).filter(Boolean)
            : [],
        }));
        onImport(list);
        alert("インポートしました");
      } catch (err) {
        alert("インポート失敗: ファイル形式が正しくありません");
      }
      // ファイル選択をリセット
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  }

  return (
    <div style={{ margin: "16px 0" }}>
      <button onClick={handleExport}>参加者リストをエクスポート</button>
      <label style={{ marginLeft: 10 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: "none" }}
          onChange={handleImportFile}
        />
        <button
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          type="button"
        >
          参加者リストをインポート
        </button>
      </label>
    </div>
  );
};

export default ParticipantsExportImport;
