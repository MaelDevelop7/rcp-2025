import React, { useEffect, useState } from "react";

interface Props {
  score: number;
  onRestart: () => void;
}

const Leaderboard: React.FC<Props> = ({ score, onRestart }) => {
  const [scores, setScores] = useState<number[]>([]);
  const [isNewHighscore, setIsNewHighscore] = useState(false);
  const [hasProcessedScore, setHasProcessedScore] = useState(false);

  useEffect(() => {
    if (hasProcessedScore) return;

    const stored = JSON.parse(localStorage.getItem("rcp_scores") || "[]") as number[];
    
    // Utiliser un Set pour éviter les doublons dans le tableau des scores
    const tempScores = [...stored, score];
    const newScores = Array.from(new Set(tempScores))
      .sort((a: number, b: number) => b - a)
      .slice(0, 5); 

    localStorage.setItem("rcp_scores", JSON.stringify(newScores));
    
    setScores(newScores);
    setHasProcessedScore(true); 

    // Vérifier si c'est un nouveau meilleur score
    if (stored.length > 0 && score > Math.max(...stored)) {
        setIsNewHighscore(true);
    } else if (stored.length === 0 && score > 0) {
        setIsNewHighscore(true);
    }
  }, [score, hasProcessedScore]); 

  // Fonction utilitaire pour vérifier si un score est celui qui vient d'être joué
  const isCurrentScore = (s: number, index: number): boolean => {
    // Vérifier si la valeur correspond ET si c'est la première occurrence de cette valeur
    return s === score && scores.indexOf(s) === index;
  };

  return (
    <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", maxWidth: "300px", margin: "30px auto" }}>
      <h2>🏆 Leaderboard</h2>

      {/* Message de célébration */}
      {isNewHighscore && (
        <p style={{ color: 'gold', fontWeight: 'bold', fontSize: '1.2em' }}>
            🌟 NOUVEAU RECORD ! 🌟
        </p>
      )}

      {/* Affichage du score actuel (CORRIGÉ : Remplacement de **{score}** par <strong>{score}</strong>) */}
      <h3 style={{ color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>
          Votre score : <strong>{score}</strong>
      </h3>
      
      <hr style={{ margin: "15px 0" }}/>

      <h3 style={{ marginBottom: "10px" }}>Top 5</h3>
      <ol style={{ paddingLeft: "20px", textAlign: "left" }}>
        {scores.map((s, i) => (
          <li 
            key={i} 
            style={{ 
              fontWeight: isCurrentScore(s, i) ? 'bold' : 'normal',
              color: isCurrentScore(s, i) ? '#d9534f' : 'inherit',
              backgroundColor: isCurrentScore(s, i) ? '#ffe0e0' : 'transparent',
              padding: '5px',
              borderRadius: '4px'
            }}
          >
            {s} compresiones
          </li>
        ))}
        {scores.length === 0 && <li>Aucun score enregistré.</li>}
      </ol>

      <button 
        onClick={onRestart}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        🔄 Jugar de nuevo
      </button>
    </div>
  );
};

export default Leaderboard;