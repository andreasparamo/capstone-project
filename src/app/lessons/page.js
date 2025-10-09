'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import './lessons.css';

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
  }
];

const PAGE_CHARS = 260;
const fingerMap = { 
  'a': 'LP', 's': 'LR', 'd': 'LM', 'f': 'LI', 
  'j': 'RI', 'k': 'RM', 'l': 'RR', ';': 'RP', ' ': 'RP' 
};

export default function LessonsPage() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [activeKeys, setActiveKeys] = useState(new Set());
  const [activeFingers, setActiveFingers] = useState(new Set());
  const [keyFlash, setKeyFlash] = useState({ key: null, type: null });
  
  const hiddenInputRef = useRef(null);

  const makePages = (text) => {
    const words = text.split(/(\s+)/);
    const pages = [];
    let buf = '';
    for (const w of words) {
      if ((buf + w).length > PAGE_CHARS && buf.length > 0) {
        pages.push(buf);
        buf = w;
      } else {
        buf += w;
      }
    }
    if (buf) pages.push(buf);
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
      log: []
    });
    setOverlayVisible(true);
  }, []);

  const closePlayer = () => {
    setOverlayVisible(false);
    setCurrentLesson(null);
    setActiveKeys(new Set());
    setActiveFingers(new Set());
  };

  const restartLesson = () => {
    if (currentLesson) {
      startLesson(currentLesson.lesson);
    }
  };

  const highlightForChar = (ch) => {
    setActiveKeys(new Set([ch]));
    setActiveFingers(new Set([fingerMap[ch]]));
  };

  const flashKey = (ch, ok) => {
    setKeyFlash({ key: ch, type: ok ? 'correct' : 'wrong' });
    setTimeout(() => setKeyFlash({ key: null, type: null }), 150);
  };

  const calculateStats = (lesson) => {
    if (!lesson.startedAt) return { wpm: 0, acc: 100, prog: 0 };
    
    const elapsedMin = (Date.now() - lesson.startedAt) / 60000;
    const words = lesson.correct / 5;
    const wpm = elapsedMin > 0 ? Math.round(words / elapsedMin) : 0;
    const total = lesson.correct + lesson.errors;
    const acc = total ? Math.max(0, Math.round((lesson.correct / total) * 100)) : 100;
    const totalChars = lesson.pages.join('').length;
    const typedGlobal = lesson.pages.slice(0, lesson.pageIndex).join('').length + lesson.idx;
    const prog = totalChars ? Math.round((typedGlobal / totalChars) * 100) : 0;
    
    return { wpm, acc, prog };
  };

  const openReview = (stats, lesson) => {
    const mistakes = lesson.log.filter(r => !r.correct);
    const counts = {};
    mistakes.forEach(m => counts[m.expected] = (counts[m.expected] || 0) + 1);
    
    setCurrentLesson(prev => ({
      ...prev,
      reviewData: {
        wpm: stats.wpm,
        acc: stats.acc,
        mistakes,
        counts,
        total: lesson.pages.join('').length,
        date: new Date().toISOString(),
        title: lesson.lesson.title
      }
    }));
    setReviewVisible(true);
  };

  const handleKey = useCallback((ch) => {
    if (!currentLesson || currentLesson.finished) return;
    
    setCurrentLesson(prev => {
      const newLesson = { ...prev };
      if (newLesson.startedAt === null) {
        newLesson.startedAt = Date.now();
      }

      const expected = newLesson.chars[newLesson.idx];
      let ok = false;
      
      if (ch === expected) {
        ok = true;
        newLesson.correct++;
      } else {
        newLesson.errors++;
      }
      
      newLesson.log.push({
        page: newLesson.pageIndex,
        i: newLesson.idx,
        expected,
        typed: ch,
        correct: ok
      });
      
      newLesson.idx++;
      flashKey(expected, ok);

      if (newLesson.idx >= newLesson.chars.length) {
        if (newLesson.pageIndex < newLesson.pages.length - 1) {
          newLesson.pageIndex++;
          newLesson.chars = [...newLesson.pages[newLesson.pageIndex]];
          newLesson.idx = 0;
          highlightForChar(newLesson.chars[0] || '');
        } else {
          newLesson.finished = true;
          setTimeout(() => {
            const stats = calculateStats(newLesson);
            openReview(stats, newLesson);
          }, 100);
        }
      } else {
        highlightForChar(newLesson.chars[newLesson.idx] || '');
      }
      
      return newLesson;
    });
  }, [currentLesson]);

  useEffect(() => {
    if (overlayVisible && hiddenInputRef.current) {
      setTimeout(() => hiddenInputRef.current?.focus(), 20);
    }
  }, [overlayVisible]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!overlayVisible || !currentLesson) return;
      
      if (e.key.length === 1) {
        e.preventDefault();
        handleKey(e.key);
      } else if (e.key === 'Spacebar' || e.code === 'Space') {
        e.preventDefault();
        handleKey(' ');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closePlayer();
      } else if (e.key === 'Enter' && currentLesson.finished) {
        e.preventDefault();
        setReviewVisible(true);
      }
    };

    if (overlayVisible) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [overlayVisible, currentLesson, handleKey]);

  useEffect(() => {
    if (currentLesson && currentLesson.chars[currentLesson.idx]) {
      highlightForChar(currentLesson.chars[currentLesson.idx]);
    }
  }, [currentLesson?.idx]);

  const stats = currentLesson ? calculateStats(currentLesson) : { wpm: 0, acc: 100, prog: 0 };

  return (
    <main>
      <section className="hero">
        <h1 className="title">Lessons</h1>
        <p className="subtitle">Structured practice that scales from home row basics to speed drills.</p>
      </section>

      <section className="grid">
        {LESSONS.map((lesson) => (
          <article key={lesson.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.5rem' }}>
              <h3>{lesson.title}</h3>
              <span className="badge">{lesson.level}</span>
            </div>
            <p className="muted">{lesson.description}</p>
            <div className="actions">
              <button className="btn" onClick={() => startLesson(lesson)}>Start</button>
            </div>
          </article>
        ))}
      </section>

      {/* Player Overlay */}
      {overlayVisible && currentLesson && (
        <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="playerTitle">
          <div className="player">
            <header className="player-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                <span className="badge">{currentLesson.lesson.level}</span>
                <h2 id="playerTitle">{currentLesson.lesson.title}</h2>
              </div>
              <div className="stats">
                <div className="stat">WPM: <strong>{stats.wpm}</strong></div>
                <div className="stat">Accuracy: <strong>{stats.acc}%</strong></div>
                <div className="stat">Progress: <strong>{stats.prog}%</strong></div>
              </div>
            </header>
            <div className="typing-pane">
              <div className="lesson-text">
                {currentLesson.chars.map((ch, i) => {
                  const classes = [];
                  if (i === currentLesson.idx) classes.push('char-current');
                  if (i < currentLesson.idx) {
                    const logEntry = currentLesson.log.find(l => l.i === i && l.page === currentLesson.pageIndex);
                    if (logEntry) {
                      classes.push(logEntry.correct ? 'char-correct' : 'char-wrong');
                    }
                  }
                  return (
                    <span key={i} data-i={i} className={classes.join(' ')}>
                      {ch === ' ' ? '\u00A0' : ch}
                    </span>
                  );
                })}
              </div>
              <div className="kb-wrap" aria-hidden="true">
                <div className="kb-row">
                  {['a', 's', 'd', 'f', 'j', 'k', 'l', ';'].map(key => (
                    <div 
                      key={key}
                      className={`key ${activeKeys.has(key) ? 'active' : ''} ${keyFlash.key === key && keyFlash.type === 'correct' ? 'correct-flash' : ''} ${keyFlash.key === key && keyFlash.type === 'wrong' ? 'wrong-flash' : ''}`}
                      data-key={key}
                    >
                      {key.toUpperCase()}
                    </div>
                  ))}
                </div>
                <div className="kb-row">
                  <div 
                    className={`key space ${activeKeys.has(' ') ? 'active' : ''} ${keyFlash.key === ' ' && keyFlash.type === 'correct' ? 'correct-flash' : ''} ${keyFlash.key === ' ' && keyFlash.type === 'wrong' ? 'wrong-flash' : ''}`}
                    data-key=" "
                  >
                    SPACE
                  </div>
                </div>
                <div className="hands">
                  {['LP', 'LR', 'LM', 'LI', 'LI', 'RI', 'RM', 'RR', 'RP', 'RP'].map((finger, idx) => (
                    <div 
                      key={idx}
                      className={`finger ${activeFingers.has(finger) ? 'active' : ''}`}
                      data-finger={finger}
                    />
                  ))}
                </div>
                <div className="legend">Keys & fingers highlight for the **next** character.</div>
              </div>
              <input 
                ref={hiddenInputRef}
                className="hidden-input" 
                aria-hidden="true"
                readOnly
              />
            </div>
            <footer className="player-footer">
              <button className="btn" onClick={closePlayer}>Exit</button>
              <div style={{ display: 'flex', gap: '.5rem' }}>
                <button className="btn" onClick={restartLesson}>Restart</button>
                {currentLesson.finished && (
                  <button className="btn" onClick={() => setReviewVisible(true)}>Review</button>
                )}
              </div>
            </footer>
          </div>
        </div>
      )}

      {/* Review Overlay */}
      {reviewVisible && currentLesson?.reviewData && (
        <div className="review-overlay" role="dialog" aria-modal="true" aria-labelledby="reviewTitle">
          <div className="review">
            <header>
              <h3 id="reviewTitle">{currentLesson.reviewData.title || 'Lesson Review'}</h3>
              <button className="btn" onClick={() => setReviewVisible(false)}>Close</button>
            </header>
            <div className="stats">
              <span className="chip">WPM: <strong>{currentLesson.reviewData.wpm}</strong></span>
              <span className="chip">Accuracy: <strong>{currentLesson.reviewData.acc}%</strong></span>
              <span className="chip">Errors: <strong>{currentLesson.reviewData.mistakes.length}</strong></span>
              <span className="chip">Typed: <strong>{currentLesson.reviewData.total}</strong></span>
              <span className="chip">Date: <strong>{new Date(currentLesson.reviewData.date).toLocaleString()}</strong></span>
            </div>
            <div className="panel">
              <div className="mistakes">
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
                    {currentLesson.reviewData.mistakes.slice(0, 80).map((m, idx) => (
                      <tr key={idx} className="bad">
                        <td>{idx + 1}</td>
                        <td>{m.expected === ' ' ? '⎵' : m.expected}</td>
                        <td>{m.typed === ' ' ? '⎵' : m.typed}</td>
                        <td>{m.correct ? '✓' : '✗'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="heat">
                <div className="subtitle" style={{ margin: '0 0 .4rem 0' }}>Mistake heat</div>
                <div className="heat-grid">
                  {Object.entries(currentLesson.reviewData.counts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([ch, count], idx) => (
                      <div key={idx} className="heat-cell">
                        <div style={{ fontSize: '1.1rem', marginBottom: '.25rem' }}>
                          {ch === ' ' ? '⎵' : ch}
                        </div>
                        <div className="muted">{count} error{count > 1 ? 's' : ''}</div>
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
