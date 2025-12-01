"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./lessons.module.css";

const LESSONS = [
  { 
    id: 'beg-1-home-row-left', 
    title: 'Home Row — Left Hand', 
    level: 'Beginner',
    description: 'Left-hand home-row drills to build accuracy.',
    text: 'aaaa ssss dddd ffff a s d f asdf asdf asdf asdf  as as as as  s d f a  asdf asdf asdf asdf  aaaa ssss dddd ffff'
  },
  { 
    id: 'beg-2-home-row-right', 
    title: 'Home Row — Right Hand', 
    level: 'Beginner',
    description: 'Right-hand home-row drills to balance speed.',
    text: 'jjjj kkkk llll ;;;; j k l ; jkl; jkl; jkl; jkl;  jk jk jk jk  l; l; l; l;  jjjj kkkk llll ;;;;'
  },
  { 
    id: 'beg-3-home-row-words', 
    title: 'Home Row Words I', 
    level: 'Beginner',
    description: 'Short, simple words from home-row letters.',
    text: 'as as as; dad; salad; alas; sad; fall; ask; all; as;  asdf jkl; asdf jkl;  lass; fall; ask; as; as; as;'
  },
  { 
    id: 'beg-4-home-row-words-2', 
    title: 'Home Row Words II', 
    level: 'Beginner',
    description: 'Slightly longer patterns and spacing.',
    text: 'sad lad; add; as if; fall as; ask a lad;  salad as if; as; as;  add all; fall; as if;  lad; lad; sad;'
  },
  { 
    id: 'beg-5-home-row-mixed', 
    title: 'Home Row Mixed Drill', 
    level: 'Beginner',
    description: 'Combine left/right hands with rhythm.',
    text: 'asdf jkl; asdf jkl;  a s d f j k l ;  as df jk l;  asdfjkl; asdfjkl;  a s d f  j k l ;  asdf jkl;'
  },

  { 
    id: 'beg-6-alternating-basic',
    title: 'Alternating Hands — Basic',
    level: 'Beginner',
    description: 'Gentle left–right alternation on home row.',
    text: 'a j a j  s k s k  d l d l  f ; f ;  as jk dl f;  a s d f  j k l ;  asdf jkl;  a j s k d l f ;'
  },
  { 
    id: 'beg-7-spacing-control',
    title: 'Spacing Control I',
    level: 'Beginner',
    description: 'Focus on clean spaces and steady tempo.',
    text: 'as df  as df  jk l;  jk l;  asdf  jkl;  a  s  d  f   j  k  l  ;  asdf  jkl;  as df  jk l;'
  },
  { 
    id: 'beg-8-repeats-and-pairs',
    title: 'Repeats and Pairs',
    level: 'Beginner',
    description: 'Repeat small pairs to build accuracy.',
    text: 'aa ss dd ff jj kk ll ;;  as as sd df jk kl l; ;a  as sd df  jk kl l;  asdf jkl;  as as as  jk jk jk'
  },
  { 
    id: 'beg-9-short-phrases',
    title: 'Short Phrases I',
    level: 'Beginner',
    description: 'Tiny phrases with calm rhythm.',
    text: 'as if; as is; a lad; a fall;  asdf asdf  jkl; jkl;  as as df df  jk jk l; l;  as if as if  a lad a lad'
  },
  { 
    id: 'beg-10-home-row-review',
    title: 'Home Row Review',
    level: 'Beginner',
    description: 'Full review of home-row keys with spaces.',
    text: 'asdf jkl;  asdf jkl;  a s d f j k l ;  asdfjkl;  as df jk l;  a j s k d l f ;  asdf jkl; asdf jkl;'
  },

  { 
    id: 'int-1-alternating-hands-ii',
    title: 'Alternating Hands II',
    level: 'Intermediate',
    description: 'Quicker alternation and tighter spacing.',
    text: 'a j s k d l f ;  as jk dl f;  asdf jkl;  ajsk dlf;  as df jk l;  a j s k  d l f ;  asdfjkl;'
  },
  { 
    id: 'int-2-rhythm-and-flow',
    title: 'Rhythm and Flow I',
    level: 'Intermediate',
    description: 'Maintain flow across mixed patterns.',
    text: 'asdf jkl; as df jk l;  ajsk dlf;  asdfjkl;  a s d f  j k l ;  as df  jk l;  asdf jkl;'
  },
  { 
    id: 'int-3-speed-bursts-i',
    title: 'Speed Bursts I',
    level: 'Intermediate',
    description: 'Short speed bursts with recovery gaps.',
    text: 'asdfjkl; asdfjkl;  a s d f  j k l ;  asdfjkl;  as df jk l;  ajsk dlf;  asdfjkl;  a j s k d l f ;'
  },
  { 
    id: 'int-4-accuracy-focus-i',
    title: 'Accuracy Focus I',
    level: 'Intermediate',
    description: 'Slow precise typing then brief bursts.',
    text: 'a s d f   j k l ;   as df  jk l;   asdf jkl;  asdfjkl;  a j s k d l f ;  asdf jkl;'
  },
  { 
    id: 'int-5-phrase-chaining',
    title: 'Phrase Chaining I',
    level: 'Intermediate',
    description: 'Chain short phrases without stopping.',
    text: 'as if as is  a lad a fall  asdf jkl;  as df jk l;  as if as if  jkl; asdf  ajsk dlf;'
  },
  { 
    id: 'int-6-hand-switch-drill',
    title: 'Hand Switch Drill',
    level: 'Intermediate',
    description: 'Frequent hand switches on home row.',
    text: 'a j s k d l f ;  as jk dl f;  a j a j  s k s k  d l d l  f ; f ;  asdf jkl;'
  },
  { 
    id: 'int-7-consistency-run',
    title: 'Consistency Run I',
    level: 'Intermediate',
    description: 'Even pace with minimal errors.',
    text: 'as df jk l;  asdf jkl;  asdfjkl;  a s d f  j k l ;  as df jk l;  asdf jkl;  a j s k d l f ;'
  },
  { 
    id: 'int-8-mixed-spacing',
    title: 'Mixed Spacing I',
    level: 'Intermediate',
    description: 'Vary spaces while holding form.',
    text: 'asdf  jkl;   as df  jk l;  a  j  s  k  d  l  f  ;  asdfjkl;  asdf  jkl;'
  },
  { 
    id: 'int-9-endurance-mini',
    title: 'Endurance Mini I',
    level: 'Intermediate',
    description: 'Longer line with steady accuracy.',
    text: 'asdf jkl; asdf jkl; a s d f j k l ; as df jk l; a j s k d l f ; asdfjkl; as df jk l; asdf jkl;'
  },
  { 
    id: 'int-10-home-row-sentences',
    title: 'Home Row Sentences I',
    level: 'Intermediate',
    description: 'Sentence-like flows using home-row keys.',
    text: 'as if a lad falls; as if all ask; asdf jkl; a j s k d l f ; as df jk l; asdf jkl;'
  }
]

const PAGE_CHARS = 180;

const fingerMap = {
  a: "LP",
  s: "LR",
  d: "LM",
  f: "LI",
  j: "RI",
  k: "RM",
  l: "RR",
  ";": "RP",
  "’": "RP",
};

export default function LessonsPage() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [activeKeys, setActiveKeys] = useState(new Set());
  const [activeFingers, setActiveFingers] = useState(new Set());
  const [keyFlash, setKeyFlash] = useState({ key: null, type: null });
  const [levelFilter, setLevelFilter] = useState("All");
  const hiddenInputRef = useRef(null);

  const makePages = (text) => {
    const words = text.split(/\s+/);
    const pages = [];
    let buf = "";
    for (const w of words) {
      if ((buf + " " + w).length > PAGE_CHARS) {
        if (buf.length > 0) pages.push(buf.trim());
        buf = w;
      } else {
        buf = buf ? buf + " " + w : w;
      }
    }
    if (buf) pages.push(buf.trim());
    return pages;
  };

  const startLesson = useCallback((lesson) => {
    const pages = makePages(lesson.text);
    setCurrentLesson({
      lesson,
      pages,
      pageIndex: 0,
      chars: [...pages[0]],
      idx: 0,
      errors: 0,
      correct: 0,
      startedAt: null,
      finished: false,
      log: [],
    });
    setOverlayVisible(true);
  }, []);

  const closePlayer = () => {
    setOverlayVisible(false);
    setCurrentLesson(null);
    setActiveKeys(new Set());
    setActiveFingers(new Set());
  };

  const returnToLessons = () => {
    setReviewVisible(false);
    setOverlayVisible(false);
    setCurrentLesson(null);
    setActiveKeys(new Set());
    setActiveFingers(new Set());
  };

  const restartLesson = () => {
    if (currentLesson) startLesson(currentLesson.lesson);
  };

  const highlightForChar = (ch) => {
    setActiveKeys(new Set(ch ? [ch] : []));
    setActiveFingers(new Set(fingerMap[ch] ? [fingerMap[ch]] : []));
  };

  const flashKey = (ch, ok) => {
    setKeyFlash({ key: ch, type: ok ? "correct" : "wrong" });
    setTimeout(() => setKeyFlash({ key: null, type: null }), 150);
  };

  const calculateStats = (lesson) => {
    if (!lesson.startedAt) return { wpm: 0, acc: 100, prog: 0 };
    const elapsedMin = (Date.now() - lesson.startedAt) / 60000;
    const words = lesson.correct / 5;
    const wpm = elapsedMin > 0 ? Math.round(words / elapsedMin) : 0;
    const total = lesson.correct + lesson.errors;
    const acc = total ? Math.max(0, Math.round((lesson.correct / total) * 100)) : 100;
    const totalChars = lesson.pages.join("").length;
    const typedGlobal = lesson.pages.slice(0, lesson.pageIndex).join("").length + lesson.idx;
    const prog = totalChars ? Math.round((typedGlobal / totalChars) * 100) : 0;
    return { wpm, acc, prog };
  };

  const openReview = (stats, lesson) => {
    const mistakes = lesson.log.filter((r) => !r.correct);
    const counts = {};
    mistakes.forEach((m) => {
      counts[m.expected] = (counts[m.expected] || 0) + 1;
    });
    setCurrentLesson((prev) => ({
      ...prev,
      reviewData: {
        wpm: stats.wpm,
        acc: stats.acc,
        mistakes,
        counts,
        total: lesson.pages.join("").length,
        date: new Date().toISOString(),
        title: lesson.lesson.title,
      },
    }));
    setReviewVisible(true);
  };

  const handleKey = useCallback(
    (ch) => {
      if (!currentLesson || currentLesson.finished) return;
      setCurrentLesson((prev) => {
        const L = { ...prev };
        if (L.startedAt == null) L.startedAt = Date.now();
        const expected = L.chars[L.idx];
        let ok = false;
        if (ch === expected) {
          ok = true;
          L.correct++;
        } else {
          L.errors++;
        }
        L.log.push({ page: L.pageIndex, i: L.idx, expected, typed: ch, correct: ok });
        flashKey(expected, ok);
        if (L.idx < L.chars.length - 1) {
          L.idx++;
          highlightForChar(L.chars[L.idx]);
          return L;
        }
        if (L.pageIndex < L.pages.length - 1) {
          L.pageIndex++;
          L.chars = [...L.pages[L.pageIndex]];
          L.idx = 0;
          highlightForChar(L.chars[0]);
          return L;
        }
        L.finished = true;
        setTimeout(() => {
          const stats = calculateStats(L);
          openReview(stats, L);
        }, 100);
        return L;
      });
    },
    [currentLesson]
  );

  useEffect(() => {
    if (overlayVisible && hiddenInputRef.current) {
      setTimeout(() => hiddenInputRef.current?.focus(), 20);
    }
  }, [overlayVisible]);

  useEffect(() => {
    const onKey = (e) => {
      if (!overlayVisible || !currentLesson) return;
      if (e.key.length === 1) {
        e.preventDefault();
        handleKey(e.key);
      } else if (e.key === "Spacebar" || e.code === "Space") {
        e.preventDefault();
        handleKey(" ");
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (reviewVisible) setReviewVisible(false);
        else closePlayer();
      } else if (e.key === "Enter" && currentLesson.finished) {
        e.preventDefault();
        setReviewVisible(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlayVisible, currentLesson, handleKey, reviewVisible]);

  useEffect(() => {
    if (currentLesson?.chars && currentLesson.idx < currentLesson.chars.length) {
      highlightForChar(currentLesson.chars[currentLesson.idx]);
    }
  }, [currentLesson?.idx]);

  const stats = currentLesson ? calculateStats(currentLesson) : { wpm: 0, acc: 100, prog: 0 };
  const filtered = LESSONS.filter(l => levelFilter === "All" ? true : l.level === levelFilter);

  return (
    <main>
      <section className={styles.hero}>
        <h1 className={styles.title}>Lessons</h1>
        <p className={styles.subtitle}>
          Structured practice that scales from home row basics to speed drills.
        </p>
      </section>

      <section className={styles.filterbar}>
        <button
          className={[styles["filter-btn"], levelFilter==="All" ? styles.active : ""].join(" ")}
          onClick={() => setLevelFilter("All")}
        >
          All
        </button>
        <button
          className={[styles["filter-btn"], levelFilter==="Beginner" ? styles.active : ""].join(" ")}
          onClick={() => setLevelFilter("Beginner")}
        >
          Beginner
        </button>
        <button
          className={[styles["filter-btn"], levelFilter==="Intermediate" ? styles.active : ""].join(" ")}
          onClick={() => setLevelFilter("Intermediate")}
        >
          Intermediate
        </button>
      </section>

      <section className={styles.grid}>
        {filtered.map((lesson) => (
          <article key={lesson.id} className={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: ".5rem" }}>
              <h3>{lesson.title}</h3>
              <span className={styles.badge}>{lesson.level}</span>
            </div>
            <p className={styles.muted}>{lesson.description}</p>
            <div className={styles.actions}>
              <button className={styles.btn} onClick={() => startLesson(lesson)}>Start</button>
            </div>
          </article>
        ))}
      </section>

      {overlayVisible && currentLesson && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="playerTitle">
          <div className={styles.player}>
            <header className={styles["player-header"]}>
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                <span className={styles.badge}>{currentLesson.lesson.level}</span>
                <h2 id="playerTitle">{currentLesson.lesson.title}</h2>
              </div>
              <div className={styles.stats}>
                <div className={styles.stat}>WPM <strong id="statWPM">{stats.wpm}</strong></div>
                <div className={styles.stat}>Accuracy <strong id="statACC">{stats.acc}</strong></div>
                <div className={styles.stat}>Progress <strong id="statPROG">{stats.prog}</strong></div>
              </div>
            </header>

            <div className={styles["typing-pane"]}>
              <div className={styles["lesson-text"]} id="lessonText">
                {currentLesson.chars.map((ch, i) => {
                  const spanClasses = [];
                  if (i === currentLesson.idx) spanClasses.push(styles["char-current"]);
                  const logEntry = currentLesson.log.find(
                    (l) => l.i === i && l.page === currentLesson.pageIndex
                  );
                  if (logEntry) spanClasses.push(logEntry.correct ? styles["char-correct"] : styles["char-wrong"]);
                  return (
                    <span key={i} data-i={i} className={spanClasses.join(" ")}>
                      {ch === " " ? "\u00A0" : ch}
                    </span>
                  );
                })}
              </div>

              <div className={styles["kb-wrap"]} aria-hidden="true">
                <div className={styles["kb-row"]}>
                  {["a", "s", "d", "f", "j", "k", "l", ";"].map((key) => (
                    <div
                      key={key}
                      className={[
                        styles.key,
                        activeKeys.has(key) ? styles.active : "",
                        keyFlash.key === key && keyFlash.type === "correct" ? styles["correct-flash"] : "",
                        keyFlash.key === key && keyFlash.type === "wrong" ? styles["wrong-flash"] : "",
                      ].join(" ")}
                      data-key={key}
                    >
                      {key.toUpperCase()}
                    </div>
                  ))}
                </div>
                <div className={styles["kb-row"]}>
                  <div
                    className={[
                      styles.key,
                      styles.space,
                      activeKeys.has(" ") ? styles.active : "",
                      keyFlash.key === " " && keyFlash.type === "correct" ? styles["correct-flash"] : "",
                      keyFlash.key === " " && keyFlash.type === "wrong" ? styles["wrong-flash"] : "",
                    ].join(" ")}
                    data-key="SPACE"
                  >
                    SPACE
                  </div>
                </div>
                <div className={styles.hands}>
                  {["LP", "LR", "LM", "LI", "LI", "RI", "RM", "RR", "RP", "RP"].map((finger, idx) => (
                    <div
                      key={idx}
                      className={[styles.finger, activeFingers.has(finger) ? styles.active : ""].join(" ")}
                      data-finger={finger}
                    />
                  ))}
                </div>
                <div className={styles.legend}>Next key finger are highlighted.</div>
              </div>
            </div>

            <input ref={hiddenInputRef} className={styles["hidden-input"]} aria-hidden="true" readOnly />

            <footer className={styles["player-footer"]}>
              <button className={styles.btn} onClick={() => (reviewVisible ? setReviewVisible(false) : closePlayer())}>
                Exit
              </button>
              <div style={{ display: "flex", gap: ".5rem" }}>
                <button className={styles.btn} onClick={restartLesson}>Restart</button>
                {currentLesson.finished && (
                  <button className={styles.btn} onClick={() => setReviewVisible(true)}>Review</button>
                )}
              </div>
            </footer>
          </div>
        </div>
      )}

      {reviewVisible && currentLesson?.reviewData && (
        <div className={styles["review-overlay"]} role="dialog" aria-modal="true" aria-labelledby="reviewTitle">
          <div className={styles.review}>
            <header>
              <h3 id="reviewTitle">{currentLesson.reviewData.title} Review</h3>
              <button className={styles["icon-close"]} aria-label="Close" onClick={() => setReviewVisible(false)}>×</button>
            </header>

            <div className={styles.stats} id="reviewStats">
              <span className={styles.chip}>WPM <strong>{currentLesson.reviewData.wpm}</strong></span>
              <span className={styles.chip}>Accuracy <strong>{currentLesson.reviewData.acc}</strong></span>
              <span className={styles.chip}>Errors <strong>{currentLesson.reviewData.mistakes.length}</strong></span>
              <span className={styles.chip}>Typed <strong>{currentLesson.reviewData.total}</strong></span>
              <span className={styles.chip}>Date <strong>{new Date(currentLesson.reviewData.date).toLocaleString()}</strong></span>
            </div>

            <div className={styles.panel}>
              <div className={styles.mistakes}>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Expected</th>
                      <th>Typed</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLesson.reviewData.mistakes.slice(0, 120).map((m, idx) => (
                      <tr key={idx} className={styles.bad}>
                        <td>{idx + 1}</td>
                        <td>{m.expected === " " ? "⎵" : m.expected}</td>
                        <td>{m.typed === " " ? "⎵" : m.typed}</td>
                        <td>{m.correct ? "✓" : "✗"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.heat}>
                <div className={styles.subtitle} style={{ margin: "0 0 .4rem 0" }}>Mistake heat</div>
                <div className={styles["heat-grid"]}>
                  {Object.entries(currentLesson.reviewData.counts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([ch, count], idx) => (
                      <div key={idx} className={styles["heat-cell"]}>
                        <div style={{ fontSize: "1.1rem", marginBottom: ".25rem" }}>{ch === " " ? "⎵" : ch}</div>
                        <div className={styles.muted}>{count} error{count === 1 ? "" : "s"}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
