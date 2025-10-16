import React, { useEffect, useState } from "react";

interface Props {
  score: number;
  onRestart: () => void;
}

const Leaderboard: React.FC<Props> = ({ score, onRestart }) => {
  const [scores, setScores] = useState<number[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("rcp_scores") || "[]");
    const newScores = [...stored, score].sort((a: number, b: number) => b - a).slice(0, 5);
    localStorage.setItem("rcp_scores", JSON.stringify(newScores));
    setScores(newScores);
  }, [score]);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>🏆 Leaderboard</h2>
      <ol>
        {scores.map((s, i) => (
          <li key={i}>{s} compresiones</li>
        ))}
      </ol>
      <button onClick={onRestart}>🔄 Jugar de nuevo</button>
    </div>
  );
};

export default Leaderboard;
