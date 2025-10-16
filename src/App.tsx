import React, { useState } from "react";
import RCPSimulator from "./RCPGamePro";
import Leaderboard from "./LeaderBoard";
import Encuesta from "./Votar";

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [viewLeaderboard, setViewLeaderboard] = useState(false);
  const [showEncuesta, setShowEncuesta] = useState(false);

  const handleGameEnd = (finalScore: number) => {
    setScore(finalScore);
    setGameStarted(false);
    setViewLeaderboard(true);
    setShowEncuesta(true); // mostrar encuesta después del juego
  };

  const handleRestart = () => {
    setScore(null);
    setGameStarted(true);
    setShowEncuesta(false);
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "sans-serif", padding: "20px" }}>
      <h1>🏥 Simulador RCP</h1>

      {!gameStarted && !viewLeaderboard && !showEncuesta && (
        <div>
          <p>Aprende a realizar RCP correctamente y salva vidas.</p>
          <button onClick={() => setGameStarted(true)} style={{ margin: "10px", padding: "10px 20px" }}>
            ▶ Iniciar Juego
          </button>
          <button onClick={() => setViewLeaderboard(true)} style={{ margin: "10px", padding: "10px 20px" }}>
            🏆 Ver Leaderboard
          </button>
        </div>
      )}

      {gameStarted && <RCPSimulator onGameEnd={handleGameEnd} />}

      {viewLeaderboard && score !== null && (
        <Leaderboard score={score} onRestart={handleRestart} />
      )}

      {/* Encuesta después del juego */}
      {showEncuesta && <Encuesta />}
    </div>
  );
};

export default App;
