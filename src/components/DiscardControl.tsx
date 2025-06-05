import React from 'react'

interface Props {
  raceCount: number
  discardCount: number
  setDiscardCount: (n: number) => void
}

function DiscardControl({ raceCount, discardCount, setDiscardCount }: Props) {
  // 例：4レースで1カット、6レースで2カットなど
  return (
    <div style={{margin:"24px 0"}}>
      <label>
        最悪スコアを破棄（カット）:
        <select
          value={discardCount}
          onChange={e => setDiscardCount(Number(e.target.value))}
          style={{marginLeft:8}}
        >
          {Array.from({length: Math.min(2, raceCount)}, (_, i) => i+0).map(n =>
            <option value={n} key={n}>{n}回</option>
          )}
          {raceCount > 4 && <option value={2}>2回</option>}
        </select>
        <span style={{marginLeft:12, color:"#888", fontSize:13}}>
          ※大会要項に沿って設定
        </span>
      </label>
    </div>
  )
}

export default DiscardControl
