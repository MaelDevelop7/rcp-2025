import React, { useState, useEffect, useRef, useCallback } from "react";

interface Props {
  onGameEnd: (score: number) => void;
}

const RCPSimulator: React.FC<Props> = ({ onGameEnd }) => {
  const [step, setStep] = useState(1);
  const [compressions, setCompressions] = useState(0);
  const [correctCompressions, setCorrectCompressions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [lastTime, setLastTime] = useState<number | null>(null);
  const [color, setColor] = useState("lightgray");
  const [gameOver, setGameOver] = useState(false);
  const [targetInterval, setTargetInterval] = useState(550);
  const rhythmRef = useRef<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const callAudioRef = useRef<HTMLAudioElement>(null);
  const gameEndedRef = useRef(false);

  // Ritmo variable cada 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setTargetInterval(400 + Math.random() * 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Inicializar lastTime al empezar el paso 3
  useEffect(() => {
    if (step === 3 && lastTime === null) {
      setLastTime(Date.now());
    }
  }, [step, lastTime]);

  // Temporizador
  useEffect(() => {
    if (step === 3 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (step === 3 && timeLeft === 0 && !gameEndedRef.current) {
      setGameOver(true);
      gameEndedRef.current = true;
      setTimeout(() => onGameEnd(correctCompressions), 1000);
    }
  }, [step, timeLeft, correctCompressions, onGameEnd]);

  // Sonido y vibración en paso 2
  useEffect(() => {
    if (step === 2) {
      if (callAudioRef.current) {
        callAudioRef.current.loop = true;
        callAudioRef.current.play();
      }
      if (navigator.vibrate) {
        const vibrateInterval = setInterval(() => navigator.vibrate([100, 50, 100]), 600);
        return () => {
          clearInterval(vibrateInterval);
          navigator.vibrate(0);
        };
      }
    } else {
      if (callAudioRef.current) callAudioRef.current.pause();
    }
  }, [step]);

  const handleNextStep = () => setStep(step + 1);

  const handleCompression = useCallback(() => {
    setCompressions(c => c + 1);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    const now = Date.now();
    if (lastTime) {
      const diff = now - lastTime;

      // Guardar solo últimos 50 intervalos
      rhythmRef.current.push(diff);
      if (rhythmRef.current.length > 50) rhythmRef.current.shift();

      if (diff >= targetInterval - 150 && diff <= targetInterval + 150) {
        setColor("green");
        setCorrectCompressions(c => c + 1);
      } else {
        setColor("red");
      }
    }
    setLastTime(now);
  }, [lastTime, targetInterval]);

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <audio ref={audioRef} src="https://www.soundjay.com/button/beep-07.mp3" preload="auto" />
      <audio ref={callAudioRef} src="https://www.soundjay.com/phone/phone-ring-1.mp3" preload="auto" />

      {step === 1 && (
        <div>
          <p>1️⃣ Verifica si la persona está consciente y respira.</p>
          <button onClick={handleNextStep}>Siguiente</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <p>2️⃣ Llama a los servicios de emergencia</p>
          <div style={{ fontSize: "60px", margin: "20px auto", display: "inline-block", animation: "vibrate 0.5s infinite" }}>📞</div>
          <p style={{ fontWeight: "bold", animation: "blink 1s infinite" }}>Llamando...</p>
          <button onClick={handleNextStep} style={{ marginTop: "20px", padding: "10px 20px" }}>Siguiente</button>
        </div>
      )}

      {step === 3 && !gameOver && (
        <div>
          <p>3️⃣ Compresiones totales: {compressions}</p>
          <p>Compresiones correctas: {correctCompressions}</p>
          <p>Tiempo restante: {timeLeft}s</p>

          {/* Muñeco */}
          <div
            onClick={handleCompression}
            onTouchStart={(e) => { e.preventDefault(); handleCompression(); }}
            style={{
              margin: "20px auto",
              width: "150px",
              height: "200px",
              borderRadius: "10px",
              backgroundColor: color,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              userSelect: "none",
              transition: "background-color 0.2s, transform 0.1s",
              transform: `scaleY(${1 - (compressions % 2) * 0.1})`,
            }}
          >
            <div style={{ width: "50px", height: "50px", backgroundColor: "#ffaaaa", borderRadius: "50%", marginBottom: "10px" }} />
          </div>

          {/* Barra de ritmo dinámica */}
          <div style={{ width: "200px", height: "20px", backgroundColor: "#ddd", margin: "10px auto", borderRadius: "10px", overflow: "hidden", display: "flex" }}>
            {Array.from({ length: Math.min(compressions, 30) }).map((_, i) => {
              const idx = compressions - 30 + i >= 0 ? compressions - 30 + i : i;
              return <div key={i} style={{ flex: 1, margin: "0 1px", backgroundColor: idx < correctCompressions ? "green" : "red", transition: "background-color 0.2s" }} />;
            })}
          </div>

          <p>Toca o haz clic en el pecho al ritmo correcto</p>
        </div>
      )}

      {gameOver && (
        <div style={{ marginTop: "30px", animation: "fadeIn 1s" }}>
          <h2>🎉 ¡Juego terminado! 🎉</h2>
          <p>Compresiones correctas: {correctCompressions}</p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:scale(0.8);} to {opacity:1; transform:scale(1);} }
        @keyframes vibrate { 0%{transform:translate(0);} 20%{transform:translate(-2px,2px);} 40%{transform:translate(-2px,-2px);} 60%{transform:translate(2px,2px);} 80%{transform:translate(2px,-2px);} 100%{transform:translate(0);} }
        @keyframes blink { 0%,50%,100%{opacity:1;} 25%,75%{opacity:0;} }
      `}</style>
    </div>
  );
};

export default RCPSimulator;
