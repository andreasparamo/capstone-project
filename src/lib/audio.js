// Lightweight singleton audio manager for site-wide sound effects
const AudioManager = (function () {
  let ctx = null;
  let master = null;
  let lastKeyAt = 0;

  function ensure() {
    if (typeof window === 'undefined') return null;
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
      master = ctx.createGain();
      master.gain.value = 0.45; // master volume
      master.connect(ctx.destination);
    }
    return ctx;
  }

  async function resume() {
    const c = ensure();
    if (!c) return null;
    try {
      if (c.state === 'suspended') await c.resume();
    } catch (e) {
      // ignore resume errors
    }
    return c;
  }

  function _playTone(freq = 440, dur = 0.06, type = 'sine', scale = 1) {
    const c = ensure();
    if (!c) return;
    try {
      const now = c.currentTime;
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      const attack = 0.003;
      const release = Math.max(0.02, dur - attack);

      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(1.0 * Math.max(0.0001, scale), now + attack);
      g.gain.linearRampToValueAtTime(0.0001, now + attack + release);

      osc.connect(g);
      g.connect(master);

      osc.start(now);
      osc.stop(now + attack + release + 0.02);

      // Cleanup after play
      setTimeout(() => {
        try {
          osc.disconnect();
          g.disconnect();
        } catch (e) {}
      }, (attack + release + 0.05) * 1000);
    } catch (e) {
      // swallow errors
    }
  }

  function playEffect(effect) {
    if (!effect || effect === 'none') return;
    const delta = Math.max(0, performance.now() - (lastKeyAt || 0));
    lastKeyAt = performance.now();
    const scale = delta < 40 ? Math.max(0.25, delta / 120) : 1;

    switch (effect) {
      case 'typewriter':
        _playTone(1000, 0.04, 'square', scale);
        break;
      case 'blip':
        _playTone(1200, 0.06, 'sine', scale);
        break;
      case 'pop':
        _playTone(520, 0.06, 'triangle', scale);
        break;
      default:
        _playTone(880, 0.05, 'sine', scale);
        break;
    }
  }

  function close() {
    try {
      if (ctx) {
        ctx.close();
      }
    } catch (e) {}
    ctx = null;
    master = null;
  }

  return {
    ensure,
    resume,
    playEffect,
    _playTone,
    close,
  };
})();

export default AudioManager;
