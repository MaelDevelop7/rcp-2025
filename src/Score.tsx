import React from "react";

interface Props {
  score: number;
}

const Score: React.FC<Props> = ({ score }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>¡Juego terminado!</h2>
      <p>Compresiones realizadas correctamente: {score}</p>
      <p>Recuerda que en la vida real, se deben hacer 100-120 compresiones por minuto.</p>
    </div>
  );
};

export default Score;
