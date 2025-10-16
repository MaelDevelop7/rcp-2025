import React, { useState } from "react";

const Encuesta: React.FC = () => {
  const [vote, setVote] = useState<string | null>(null);
  const [results, setResults] = useState<{ [key: string]: number }>({
    "Me ha gustado 👍": 0,
    "Está bien 🤔": 0,
    "No me ha gustado 👎": 0,
  });
  console.log(vote)
  const [voted, setVoted] = useState(false);

  const handleVote = (option: string) => {
    if (!voted) {
      setVote(option);
      setResults(prev => ({ ...prev, [option]: prev[option] + 1 }));
      setVoted(true);
    }
  };

  const totalVotes = Object.values(results).reduce((a, b) => a + b, 0);

  return (
    <div style={{ marginTop: "30px", textAlign: "center" }}>
      <h2>🗳️ ¿Qué te ha parecido el juego?</h2>

      {!voted && (
        <div>
          {Object.keys(results).map(option => (
            <button
              key={option}
              onClick={() => handleVote(option)}
              style={{ margin: "5px", padding: "10px 20px" }}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {voted && (
        <div>
          <h3>Resultados:</h3>
          {Object.entries(results).map(([option, count]) => {
            const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            return (
              <p key={option}>
                {option}: {count} votos ({percentage}%)
              </p>
            );
          })}
          <button onClick={() => setVoted(false)} style={{ marginTop: "10px", padding: "5px 10px" }}>
            Votar de nuevo
          </button>
        </div>
      )}
    </div>
  );
};

export default Encuesta;
