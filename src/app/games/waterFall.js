'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const WORDS = {
  beginner: ['cat','dog','sun','tree','book','code','star','bird','fish','wind','game','home','rock','ball','milk','blue','green','happy','quick','light','train','apple','bread','mouse','table','phone','water','smile','jump','rain','cloud','river','chair','plant','paper','piano','lemon','grape','quiet','sound','truck','road','house','clock','stone','sugar','butter','cable','castle','garden','blank','simple','bright','clean','cool','fresh','sweet','tiny','brave'],
  intermediate: ['jungle','rocket','puzzle','python','silver','laptop','winter','coffee','planet','thunder','network','battery','keyboard','monitor','quantum','dynamic','channel','gateway','compile','process','package','feature','digital','gravity','texture','control','cluster','balance','library','storage','service','latency','iterate','compute','backend','frontend','mutable','immutable','parallel','virtual','pointer','decimal','validate','optimize','fallback','tracking','partial','connect','resolve','context','adapter','decoder','encoder','handler','cursor','overlay','provider','schema'],
  expert: ['synchronous','metamorphosis','cryptography','microarchitecture','idempotency','observability','characteristic','multiplication','thermodynamics','inconsequential','polymorphism','interoperability','disambiguation','heterogeneous','electromagnetic','parallelizable','synchronization','serialization','mischaracterize','counterintuitive','decomposition','infrastructure','deserialization','posttranslational','electrophysiology','photoautotrophic','metacognition','hyperparameter','spectrophotometer','bioluminescence','neuroplasticity','phenomenological','telecommunication','photosensitivity','computationally','indistinguishable']
};

const PRESETS = {
  beginner: { baseFall: 60, spawn: 1600, laneWidth: 160 },
  intermediate: { baseFall: 85, spawn: 1300, laneWidth: 175 },
  expert: { baseFall: 110, spawn: 1100, laneWidth: 195 }
};

const bags = { beginner: [], intermediate: [], expert: [] };

function refillBag(key) {
  const arr = WORDS[key].slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  bags[key] = arr;
}

function nextWord(key) {
  if (!bags[key] || bags[key].length === 0) refillBag(key);
  return bags[key].pop();
}

export default function WordFallGame({ onBack }) {
  const [difficulty, setDifficulty] = useState('beginner');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [words, setWords] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayContent, setOverlayContent] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);

  const gameRef = useRef(null);
  const typeboxRef = useRef(null);
  const requestRef = useRef();
  const lastTimeRef = useRef(null);
  const lastSpawnRef = useRef(0);
  const startTimeRef = useRef(null);
  const lanesRef = useRef([]);
  const laneCountRef = useRef(0);

  const computeLanes = useCallback(() => {
    if (!gameRef.current) return;
    const width = gameRef.current.clientWidth;
    const laneWidth = PRESETS[difficulty].laneWidth;
    const count = Math.max(3, Math.floor(width / laneWidth));
    laneCountRef.current = count;
    const margin = 12;
    const usable = width - margin * 2;
    lanesRef.current = Array.from({ length: count }, (_, i) =>
      Math.round(margin + (i + 0.5) * (usable / count))
    );
  }, [difficulty]);

  const spawnWord = useCallback(() => {
    if (words.length >= 3) return;
    if (!lanesRef.current.length) computeLanes();

    const used = new Set(words.map(w => w.lane));
    const free = lanesRef.current.map((_, i) => i).filter(i => !used.has(i));
    if (!free.length) return;

    const lane = free[Math.floor(Math.random() * free.length)];
    const text = nextWord(difficulty);

    setWords(prev => {
      const newWord = {
        id: Date.now() + Math.random(),
        text,
        lane,
        y: -50,
        speed: 0,
        x: 0
      };
      return [...prev, newWord];
    });
  }, [words, difficulty, computeLanes]);

  const removeWord = useCallback((wordId) => {
    setWords(prev => prev.filter(w => w.id !== wordId));
  }, []);

  const gameOver = useCallback(() => {
    setRunning(false);
    setPaused(false);
    setOverlayContent({
      title: 'Game Over',
      message: `Score ${score} · Level ${level}`,
      actions: [{
        label: 'Play Again',
        primary: true,
        onClick: () => restart()
      }]
    });
    setOverlayVisible(true);
  }, [score, level]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = useCallback((dt) => {
    if (!gameRef.current) return;

    const toRemove = new Set();
    let lifeLost = false;

    setWords(prev => {
      const updated = prev.map(w => {
        if (toRemove.has(w.id)) return null;

        const base = PRESETS[difficulty].baseFall;
        const elapsed = startTimeRef.current ? (performance.now() - startTimeRef.current) / 1000 : 0;
        const timeFactor = 1 + Math.min(1.0, elapsed * 0.004);
        const levelFactor = 1 + (level - 1) * 0.06;
        const speed = (base + Math.random() * base * 0.25) * levelFactor * timeFactor;

        const newY = w.y + speed * dt;

        if (newY >= gameRef.current.clientHeight - 60) {
          toRemove.add(w.id);
          if (!lifeLost) {
            lifeLost = true;
            setLives(l => {
              const newLives = Math.max(0, l - 1);
              if (newLives <= 0) {
                setTimeout(() => gameOver(), 100);
              }
              return newLives;
            });
          }
          return null;
        }

        return { ...w, y: newY, speed };
      }).filter(Boolean);

      return updated;
    });

    lastSpawnRef.current += dt * 1000;
    const baseSpawn = PRESETS[difficulty].spawn;
    const cap = Math.max(900, baseSpawn - (level - 1) * 30);

    if (lastSpawnRef.current >= cap && words.length < 3) {
      lastSpawnRef.current = 0;
      spawnWord();
    }
  }, [difficulty, level, gameOver, spawnWord, words.length]);

  const animate = useCallback((time) => {
    if (!running || paused) {
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
    }

    const dt = Math.min(0.05, (time - lastTimeRef.current) / 1000);
    lastTimeRef.current = time;

    update(dt);
    requestRef.current = requestAnimationFrame(animate);
  }, [running, paused, update]);

  const reset = useCallback(() => {
    setWords([]);
    setScore(0);
    setLevel(1);
    setLives(3);
    startTimeRef.current = performance.now();
    lastSpawnRef.current = 0;
    lastTimeRef.current = null;
    setPaused(false);
    computeLanes();

    setTimeout(() => spawnWord(), 100);
    setTimeout(() => spawnWord(), 400);
  }, [computeLanes, spawnWord]);

  const startGame = () => {
    if (!running) {
      reset();
      setRunning(true);
      setOverlayVisible(false);
      setTimeout(() => typeboxRef.current && typeboxRef.current.focus(), 20);
    } else {
      togglePause();
    }
  };

  const togglePause = () => {
    setPaused(prev => {
      const newPaused = !prev;
      if (newPaused) {
        setOverlayContent({
          title: 'Paused',
          message: 'Press Resume to continue.'
        });
        setOverlayVisible(true);
      } else {
        setOverlayVisible(false);
      }
      return newPaused;
    });
  };

  const restart = () => {
    setOverlayVisible(false);
    reset();
    setRunning(true);
    setTimeout(() => typeboxRef.current && typeboxRef.current.focus(), 20);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const value = inputValue.trim();
      if (!value) return;

      let matchIdx = -1;
      let maxY = -Infinity;

      words.forEach((w, idx) => {
        if (w.text.toLowerCase() === value.toLowerCase() && w.y > maxY) {
          matchIdx = idx;
          maxY = w.y;
        }
      });

      if (matchIdx > -1) {
        removeWord(words[matchIdx].id);
        setScore(s => s + 10);
        setInputValue('');
      } else {
        setInputError(true);
        setTimeout(() => setInputError(false), 180);
      }
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  useEffect(() => {
    computeLanes();
    const handleResize = () => computeLanes();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [computeLanes]);

  useEffect(() => {
    if (gameRef.current && words.length > 0) {
      words.forEach(word => {
        if (!word.x && lanesRef.current[word.lane]) {
          const xCenter = lanesRef.current[word.lane];
          setWords(prev => prev.map(w => {
            if (w.id === word.id && !w.x) {
              return { ...w, x: xCenter - 50 };
            }
            return w;
          }));
        }
      });
    }
  }, [words]);

  return (
    <section id="wordfallPage">
      <div
        className="nav-container"
        style={{
          padding: 0,
          margin: 0,
          maxWidth: '100%',
          display: 'flex',
          gap: '.6rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center' }}>
          <button className="btn" onClick={onBack}>
            ← Back
          </button>
          <h2 style={{ marginLeft: '.4rem' }}>WordFall</h2>
        </div>
        <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center' }}>
          <label
            htmlFor="difficulty"
            className="sr-only"
            style={{ position: 'absolute', left: '-9999px' }}
          >
            Difficulty
          </label>
          <select
            id="difficulty"
            aria-label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
          <button onClick={startGame} className="primary">
            {!running ? 'Start' : paused ? 'Resume' : 'Pause'}
          </button>
          <button onClick={restart}>Restart</button>
          <span className="pill">
            Score: <b>{score}</b>
          </span>
          <span className="pill">
            Level: <b>{level}</b>
          </span>
          <span className="pill">
            Lives: <b>{lives}</b>
          </span>
        </div>
      </div>

      {/* WordFall framed similarly, falling words dark, UI white */}
      <div className="kj-wrapper">
        <div className="kj-header">
          <div className="kj-title">WordFall</div>
          <div className="kj-meta">
            <span>
              Difficulty:{' '}
              <strong>
                {difficulty === 'beginner'
                  ? 'Beginner'
                  : difficulty === 'intermediate'
                  ? 'Intermediate'
                  : 'Expert'}
              </strong>
            </span>
            <span>Words fall faster as you level up.</span>
            <span>Type the word, then press Space or Enter.</span>
          </div>
        </div>

        <section id="stage">
          <div id="game" ref={gameRef}>
            {words.map(word => (
              <div
                key={word.id}
                className="word"
                style={{
                  transform: `translate(${word.x}px, ${word.y}px)`,
                  position: 'absolute',
                  color: '#000'
                }}
              >
                {word.text}
              </div>
            ))}

            {overlayVisible && (
              <div id="overlay">
                <div id="overlayContent">
                  {overlayContent && (
                    <>
                      <h2>{overlayContent.title}</h2>
                      {overlayContent.message && (
                        <p>{overlayContent.message}</p>
                      )}
                      {overlayContent.actions && overlayContent.actions.length > 0 && (
                        <div
                          style={{
                            marginTop: '10px',
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'center'
                          }}
                        >
                          {overlayContent.actions.map((action, idx) => (
                            <button
                              key={idx}
                              className={`btn ${action.primary ? 'primary' : ''}`}
                              onClick={action.onClick}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="footer">
            <div className="muted">
              Type the full word then press Space or Enter.
            </div>
            <input
              ref={typeboxRef}
              id="typebox"
              type="text"
              placeholder="Start typing…"
              autoComplete="off"
              spellCheck="false"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                borderColor: inputError ? 'rgba(239,68,68,.8)' : '',
                color: '#000'
              }}
            />
          </div>
        </section>
      </div>
    </section>
  );
}