import React, { useState, useEffect, useRef, useCallback } from "react";
// Assurez-vous d'importer le Leaderboard ici (ou de le coller si vous travaillez dans un seul fichier)
import Leaderboard from "./LeaderBoard"; 

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
  const [isCompressed, setIsCompressed] = useState(false); 
  const [targetInterval, setTargetInterval] = useState(550);
  
  const rhythmRef = useRef<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const callAudioRef = useRef<HTMLAudioElement>(null);
  const gameEndedRef = useRef(false);
  const timeLeftRef = useRef(30);
  const timerRef = useRef<number | null>(null); 
  const animationTimerRef = useRef<number | null>(null); 

  // Fonction pour réinitialiser le jeu
  const handleRestart = () => {
    setStep(1);
    setCompressions(0);
    setCorrectCompressions(0);
    setTimeLeft(30);
    setLastTime(null);
    setColor("lightgray");
    setGameOver(false);
    setIsCompressed(false);
    setTargetInterval(550);
    rhythmRef.current = [];
    gameEndedRef.current = false;
    timeLeftRef.current = 30;

    if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
    }
    if (animationTimerRef.current) {
        window.clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
    }
  };

  // 1. Rythme variable (logique conservée)
  useEffect(() => {
    if (step !== 3) return;

    const intervalId = window.setInterval(() => {
      setTargetInterval(500 + Math.random() * 100);
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, [step]);

  // 2. Logique du temporisateur (Correction du bug de réinitialisation conservée)
  useEffect(() => {
    if (step === 3 && !gameOver) {
      if (timerRef.current) return; 

      if (lastTime === null) {
        setLastTime(Date.now());
      }
      
      timeLeftRef.current = timeLeft;

      timerRef.current = window.setInterval(() => {
        timeLeftRef.current -= 1;
        setTimeLeft(timeLeftRef.current);

        if (timeLeftRef.current <= 0) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          if (!gameEndedRef.current) {
            setGameOver(true);
            gameEndedRef.current = true;
            
            setCorrectCompressions(finalCorrectCompressions => {
                setTimeout(() => onGameEnd(finalCorrectCompressions), 500); 
                return finalCorrectCompressions;
            });
          }
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [step, gameOver, onGameEnd]); 

  // 3. Son et vibration (logique conservée)
  useEffect(() => {
    if (step === 2) {
      if (callAudioRef.current) {
        callAudioRef.current.loop = true;
        callAudioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      if (navigator.vibrate) {
        const vibrateInterval = window.setInterval(() => navigator.vibrate([100, 50, 100]), 600);
        return () => {
          window.clearInterval(vibrateInterval);
          navigator.vibrate(0);
        };
      }
    } else {
      if (callAudioRef.current) {
         callAudioRef.current.pause();
         callAudioRef.current.currentTime = 0;
      }
    }
  }, [step]);

  const handleNextStep = () => setStep(step + 1);

  // 4. Gestion de la compression et de l'animation (logique conservée)
  const handleCompression = useCallback(() => {
    if (step !== 3 || gameOver) return;

    setCompressions(c => c + 1);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }

    const now = Date.now();

    if (lastTime) {
      const diff = now - lastTime;
      const margin = 100;

      rhythmRef.current.push(diff);
      if (rhythmRef.current.length > 50) rhythmRef.current.shift();

      if (diff >= targetInterval - margin && diff <= targetInterval + margin) {
        setColor("green");
        setCorrectCompressions(c => c + 1);
      } else {
        setColor("red");
      }
    } else {
      setColor("green");
      setCorrectCompressions(c => c + 1);
    }
    setLastTime(now);

    // LOGIQUE D'ANIMATION
    setIsCompressed(true); 

    if (animationTimerRef.current) {
        window.clearTimeout(animationTimerRef.current);
    }

    animationTimerRef.current = window.setTimeout(() => {
        setIsCompressed(false);
    }, 100); 

  }, [lastTime, targetInterval, step, gameOver]);

  // Nettoyage lors du démontage du composant (logique conservée)
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (animationTimerRef.current) window.clearTimeout(animationTimerRef.current); 
      if (callAudioRef.current) callAudioRef.current.pause();
      if (navigator.vibrate) navigator.vibrate(0);
    };
  }, []);

  // --- Rendu (HTML/JSX) ---

  // Si le jeu est terminé, on affiche le Leaderboard.
  if (gameOver) {
    return (
        <Leaderboard score={correctCompressions} onRestart={handleRestart} />
    );
  }

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <audio ref={audioRef} src="https://www.soundjay.com/button/beep-07.mp3" preload="auto" />
      <audio ref={callAudioRef} src="https://www.soundjay.com/phone/phone-ring-1.mp3" preload="auto" />

      {/* Rendu des étapes 1, 2, et 3 (conservé) */}
      {step === 1 && (
        <div><p>1️⃣ Verifica si la persona está consciente y respira.</p><button onClick={handleNextStep}>Siguiente</button></div>
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
          {/* SUPPRESSION DES ** */}
          <p>3️⃣ Compresiones totales: {compressions}</p>
          <p>Compresiones correctas: {correctCompressions}</p>
          <p>Tiempo restante: {timeLeft}s</p>

          <div
            onClick={handleCompression}
            onTouchStart={(e) => { e.preventDefault(); handleCompression(); }}
            style={{
              margin: "20px auto", width: "150px", height: "200px", borderRadius: "10px", backgroundColor: color,
              display: "flex", alignItems: "flex-end", justifyContent: "center", userSelect: "none",
              transition: "background-color 0.2s, transform 0.1s",
              transform: `scaleY(${isCompressed ? 0.9 : 1})`, 
            }}
          >
            <div style={{ width: "50px", height: "50px", backgroundColor: "#ffaaaa", borderRadius: "50%", marginBottom: "10px" }} />
          </div>

          <p>Taux cible : {Math.round(60000 / targetInterval)}/min</p>
          <div style={{ width: "200px", height: "20px", backgroundColor: "#ddd", margin: "10px auto", borderRadius: "10px", overflow: "hidden", display: "flex" }}>
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{ flex: 1, margin: "0 1px", backgroundColor: color, transition: "background-color 0.2s" }} />
            ))}
          </div>

          <p>Toca o haz clic en el pecho al ritmo correcto</p>
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