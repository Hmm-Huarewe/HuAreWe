/* pad-room.jsx — The Lantern Road Pad room interior. Loads after React + tweaks-panel. */

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ── Small SVGs: lantern + key ──────────────────────────────────────────
// More refined lantern — smaller default, brass details, softer flame.
function LanternOnTable({ size = 50 }) {
  const brass = '#c9a14c';
  const brassDk = '#7e5e26';
  return (
    <svg width={size} height={size * 1.55} viewBox="0 0 40 62"
      style={{
        display: 'block',
        filter: `drop-shadow(0 0 12px rgba(232,170,70,0.45)) drop-shadow(0 0 26px rgba(232,140,50,0.28))`,
      }}>
      <defs>
        <radialGradient id="lt-flame" cx="50%" cy="58%" r="55%">
          <stop offset="0%" stopColor="#fff6c8" stopOpacity="0.72"/>
          <stop offset="55%" stopColor="#f0b048" stopOpacity="0.42"/>
          <stop offset="100%" stopColor="#c08020" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="lt-glass" cx="38%" cy="36%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        <linearGradient id="lt-brass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={brassDk}/>
          <stop offset="48%" stopColor={brass}/>
          <stop offset="100%" stopColor={brassDk}/>
        </linearGradient>
      </defs>
      {/* bail handle */}
      <path d="M13 5 Q20 -1 27 5" stroke={brass} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <circle cx="13" cy="5" r="1.4" fill={brassDk}/>
      <circle cx="27" cy="5" r="1.4" fill={brassDk}/>
      {/* top finial */}
      <line x1="20" y1="-1" x2="20" y2="6" stroke={brass} strokeWidth="1.1" strokeLinecap="round"/>
      <circle cx="20" cy="-1" r="1.4" fill={brass}/>
      {/* lid / cap */}
      <ellipse cx="20" cy="9" rx="9.5" ry="2.4" fill="url(#lt-brass)"/>
      <path d="M11 9 Q11 5 20 4 Q29 5 29 9" fill="#241a0a" stroke={brassDk} strokeWidth="0.5"/>
      <ellipse cx="20" cy="9.4" rx="9.5" ry="1.4" fill="#0e0a04" opacity="0.55"/>
      {/* vertical posts at corners of glass */}
      <rect x="10.6" y="11" width="1.6" height="32" fill="url(#lt-brass)"/>
      <rect x="27.8" y="11" width="1.6" height="32" fill="url(#lt-brass)"/>
      {/* glass (rectangular with rounded top) */}
      <path d="M12.2 11.5 L27.8 11.5 L27.8 42.5 L12.2 42.5 Z"
        fill="#0e0904" stroke="rgba(0,0,0,0)" opacity="0.92"/>
      <path d="M12.2 11.5 L27.8 11.5 L27.8 42.5 L12.2 42.5 Z" fill="url(#lt-flame)"/>
      <path d="M12.2 11.5 L27.8 11.5 L27.8 42.5 L12.2 42.5 Z" fill="url(#lt-glass)"/>
      {/* horizontal cross bar */}
      <rect x="11" y="27" width="18" height="1" fill={brassDk} opacity="0.7"/>
      {/* burner base inside glass */}
      <rect x="16" y="38" width="8" height="4" rx="0.5" fill="#1a1208" stroke={brassDk} strokeWidth="0.4"/>
      {/* wick */}
      <line x1="20" y1="38" x2="20" y2="34" stroke="#3a2a14" strokeWidth="1.2" strokeLinecap="round"/>
      {/* flame */}
      <g style={{ transformOrigin: '20px 36px', animation: 'flame-flicker 2.6s ease-in-out infinite' }}>
        <ellipse cx="20" cy="30" rx="3.2" ry="7.2" fill="#f0b048" opacity="0.36"/>
        <ellipse cx="20" cy="28.5" rx="2.0" ry="5.4" fill="#fff4c8" opacity="0.82"/>
        <ellipse cx="20" cy="27" rx="0.9" ry="3.0" fill="#ffffff" opacity="0.92"/>
      </g>
      {/* glass top trim */}
      <rect x="10.6" y="11" width="18.8" height="1.4" fill="url(#lt-brass)"/>
      {/* glass bottom trim */}
      <rect x="10.6" y="42.6" width="18.8" height="1.4" fill="url(#lt-brass)"/>
      {/* base */}
      <ellipse cx="20" cy="44.5" rx="10.5" ry="2.2" fill="url(#lt-brass)"/>
      <rect x="10" y="44.5" width="20" height="8" rx="1.4" fill="#1e1408" stroke={brassDk} strokeWidth="0.55"/>
      <ellipse cx="20" cy="52.5" rx="10.5" ry="2.4" fill="url(#lt-brass)"/>
      <ellipse cx="20" cy="53" rx="10" ry="1.6" fill="#0e0a04" opacity="0.6"/>
      {/* small thumbwheel */}
      <circle cx="30.5" cy="48.5" r="1.6" fill="#1a1208" stroke={brassDk} strokeWidth="0.4"/>
      <line x1="30.5" y1="47.2" x2="30.5" y2="49.8" stroke={brass} strokeWidth="0.35"/>
      <line x1="29.3" y1="48.5" x2="31.7" y2="48.5" stroke={brass} strokeWidth="0.35"/>
      <style>{`
        @keyframes flame-flicker {
          0%, 100% { transform: scaleY(1) translateY(0); }
          25% { transform: scaleY(1.10) translateY(-0.6px) scaleX(0.96); }
          50% { transform: scaleY(0.93) translateY(0.6px) scaleX(1.04); }
          75% { transform: scaleY(1.05) translateY(-0.3px); }
        }
      `}</style>
    </svg>
  );
}

function KeyOnTable({ size = 60 }) {
  const c = '#c9a050';
  return (
    <svg width={size} height={size * 0.4} viewBox="0 0 100 40"
      style={{ display: 'block', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.7))' }}>
      {/* shaft */}
      <rect x="22" y="17" width="48" height="6" fill={c} stroke="#7a5824" strokeWidth="0.6"/>
      {/* teeth */}
      <rect x="60" y="23" width="4" height="6" fill={c} stroke="#7a5824" strokeWidth="0.6"/>
      <rect x="66" y="23" width="3" height="4" fill={c} stroke="#7a5824" strokeWidth="0.6"/>
      {/* bow */}
      <circle cx="18" cy="20" r="13" fill="none" stroke={c} strokeWidth="3.2"/>
      <circle cx="18" cy="20" r="4.5" fill="#06040a" stroke="#7a5824" strokeWidth="0.6"/>
      {/* highlight */}
      <path d="M10 14 Q14 11 20 11" stroke="rgba(255,220,160,0.5)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <rect x="23" y="17" width="46" height="1.4" fill="rgba(255,220,160,0.35)"/>
    </svg>
  );
}

// ── TV CONTENT — real video on the screen (placeholder loop) ─────────
function TVScene({ intensity = 1, warmth = 1 }) {
  const videoRef = useRef(null);
  const [src, setSrc] = useState(null);

  // The asset server doesn't support HTTP range requests, which <video>
  // relies on for direct src loading. Fetch the file into a Blob URL and
  // feed THAT to the video element — works in every browser.
  useEffect(() => {
    let url = null;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(window.__resources?.phVideoGuitar || 'PH-Video-Guitar.mp4');
        if (!r.ok) throw new Error('http ' + r.status);
        const blob = await r.blob();
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setSrc(url);
      } catch (e) {
        console.warn('TV video load failed', e);
      }
    })();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  return (
    <div className="tv-video-wrap">
      {src && (
        <video
          ref={videoRef}
          className="tv-video"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      )}
      {/* CRT scanlines + warm tint overlay, scaled by tweaks */}
      <div className="tv-overlay" style={{
        '--tv-intensity': intensity,
        '--tv-warmth': warmth,
      }}/>
      <style>{`
        .tv-video-wrap { position: absolute; inset: 0; overflow: hidden; background: #04030a; }
        .tv-video {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: 50% 50%;
          transform: scale(1.12);
          display: block;
          filter:
            brightness(calc(0.85 + 0.15 * var(--tv-intensity, 1)))
            contrast(1.06)
            saturate(calc(0.95 + 0.18 * var(--tv-warmth, 1)));
        }
        .tv-overlay {
          position: absolute; inset: 0;
          pointer-events: none;
          background:
            /* warm color wash */
            linear-gradient(180deg,
              rgba(255, 200, 120, calc(0.10 * var(--tv-warmth, 1))) 0%,
              rgba(180, 90, 40, calc(0.08 * var(--tv-warmth, 1))) 100%),
            /* CRT scanlines */
            repeating-linear-gradient(180deg,
              rgba(0,0,0,0) 0px,
              rgba(0,0,0,0) 2px,
              rgba(0,0,0,0.14) 2px,
              rgba(0,0,0,0.14) 3px),
            /* vignette */
            radial-gradient(ellipse 90% 80% at 50% 50%,
              rgba(0,0,0,0) 40%,
              rgba(0,0,0,0.55) 100%);
        }
      `}</style>
    </div>
  );
}

// ── LANTERN VIDEO — small video replacing the lantern SVG on the desk ──
function LanternVideo() {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    let url = null, cancelled = false;
    (async () => {
      try {
        const r = await fetch(window.__resources?.lanternVideo || 'lantern-video-small.mp4');
        if (!r.ok) throw new Error('http ' + r.status);
        const blob = await r.blob();
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setSrc(url);
      } catch (e) { console.warn('lantern video load failed', e); }
    })();
    return () => { cancelled = true; if (url) URL.revokeObjectURL(url); };
  }, []);
  return (
    <div className="lantern-video-wrap">
      {src && (
        <video src={src} autoPlay muted loop playsInline preload="auto"/>
      )}
    </div>
  );
}

// ── MANTEL + WALL VIDEO — video lives in the small mantel screen.
//    mantelPath = video shown in the small screen (preview / current)
//    wallPath   = video shown when wall expands (set on Transmute)
//    When `expanded` is true the overlay fills the full back wall and
//    STAYS until expanded becomes false (toggle or channel change). ──
function MantelWallVideo({ expanded, mantelPath, wallPath }) {
  const [mantelSrc, setMantelSrc] = useState(null);
  const [wallSrc,   setWallSrc]   = useState(null);
  const [phase, setPhase] = useState('dormant');
  const [wallVolume, setWallVolume] = useState(0); // muted by default
  const prevExpanded = useRef(expanded);
  const wallVidRef   = useRef(null);

  // Fetch a path → blob URL helper
  const fetchBlob = async (path, setter, cancelled) => {
    try {
      const r = await fetch(path);
      if (!r.ok) throw new Error('http ' + r.status);
      const blob = await r.blob();
      if (!cancelled.v) setter(URL.createObjectURL(blob));
    } catch (e) { console.warn('video load failed', path, e); }
  };

  useEffect(() => {
    const c = { v: false };
    fetchBlob(mantelPath, setMantelSrc, c);
    return () => { c.v = true; };
  }, [mantelPath]);

  useEffect(() => {
    const c = { v: false };
    fetchBlob(wallPath, setWallSrc, c);
    return () => { c.v = true; };
  }, [wallPath]);

  useEffect(() => {
    const onVol = (e) => {
      const { volume, muted } = e.detail;
      setWallVolume(muted ? 0 : volume);
      if (wallVidRef.current) wallVidRef.current.volume = muted ? 0 : volume;
    };
    window.addEventListener('pad:wall-volume', onVol);
    return () => window.removeEventListener('pad:wall-volume', onVol);
  }, []);

  useEffect(() => {
    const was = prevExpanded.current;
    prevExpanded.current = expanded;
    if (expanded && !was) {
      setPhase('rising');
      const t = setTimeout(() => setPhase('playing'), 1500);
      return () => clearTimeout(t);
    }
    if (!expanded && was) {
      setPhase('ending');
      const t = setTimeout(() => setPhase('dormant'), 1600);
      return () => clearTimeout(t);
    }
  }, [expanded]);

  return (
    <>
      {/* ── Mantel screen — shows preview/current video ── */}
      <div className="mantel-screen">
        <div className="mantel-frame">
          <div className="mantel-inner">
            {mantelSrc ? (
              <video key={mantelSrc} src={mantelSrc} autoPlay muted loop playsInline
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block', transform:'scale(1.38)' }}/>
            ) : (
              <div className="mantel-placeholder">— loading —</div>
            )}
          </div>
        </div>
      </div>

      {/* ── Back-wall overlay — expands on stage 4 / Transmute ── */}
      <div className={`back-wall-video phase-${phase}`}>
        {wallSrc && (
          <video key={wallSrc} ref={wallVidRef} className="bw-video" src={wallSrc}
            autoPlay muted={wallVolume === 0} loop playsInline preload="auto"/>
        )}
      </div>
    </>
  );
}

// ── FIREPLACE FIRE — particle-based real flames inside the hearth.
//    `intensity` ramps up for the eruption (rises above mantle). ──
function FireplaceFire({ intensity = 1 }) {
  const cvRef = useRef(null);
  const intRef = useRef(intensity);
  useEffect(() => { intRef.current = intensity; }, [intensity]);

  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext('2d', { alpha: true });
    let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];

    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);

    let raf = 0, last = performance.now();
    const spawn = (dt) => {
      const I = intRef.current;
      const count = Math.floor((4 + I * 4) * dt);
      for (let i = 0; i < count; i++) {
        const cx = W * 0.5 + (Math.random() - 0.5) * W * 0.45;
        particles.push({
          x: cx,
          y: H - 4 + Math.random() * 4,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -(1.4 + Math.random() * 1.6) * (0.85 + I * 0.4),
          life: 0,
          maxLife: 28 + Math.random() * 22 + I * 18,
          r: 5 + Math.random() * 9,
          hue: 18 + Math.random() * 22,
        });
      }
    };

    const tick = (now) => {
      const dt = Math.min(2, (now - last) / 16.6); last = now;
      ctx.clearRect(0, 0, W, H);
      spawn(dt);

      ctx.globalCompositeOperation = 'lighter';
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        // accelerate upward (heat) and add horizontal wobble
        p.vy -= 0.025 * dt;
        p.vx += Math.sin(p.life * 0.3 + i) * 0.04 * dt;
        // air drag
        p.vx *= 0.99;

        const t = p.life / p.maxLife;
        if (t >= 1) { particles.splice(i, 1); continue; }

        // color: white hot at base → yellow → orange → red → fade
        const heat = 1 - t;
        let r, g, b, a;
        if (heat > 0.75) {
          r = 255; g = 245; b = 200;
        } else if (heat > 0.5) {
          r = 255; g = 200 + (heat - 0.5) * 4 * 45; b = 90;
        } else if (heat > 0.25) {
          r = 240; g = 130 + (heat - 0.25) * 4 * 70; b = 40;
        } else {
          r = 180 + heat * 240; g = 50 + heat * 320; b = 20;
        }
        a = Math.pow(heat, 1.4) * 0.55;
        const rad = p.r * (0.5 + heat * 0.7);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
        grad.addColorStop(0, `rgba(${r|0},${g|0},${b|0},${a})`);
        grad.addColorStop(1, `rgba(${r|0},${g|0},${b|0},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={cvRef} className="fireplace-fire"/>;
}

// ── FLAME PILLAR — tall column of fire rising up the back wall above
//    the mantle when the eruption is happening. Sits above back wall
//    video so it blends with the video taking over. ──
function FlamePillar({ active }) {
  const cvRef = useRef(null);
  const activeRef = useRef(active);
  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext('2d', { alpha: true });
    let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];

    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);

    let raf = 0, last = performance.now();
    const tick = (now) => {
      const dt = Math.min(2, (now - last) / 16.6); last = now;
      ctx.clearRect(0, 0, W, H);

      if (activeRef.current) {
        // spawn at bottom-center (where fireplace top is)
        const count = Math.floor(8 * dt);
        for (let i = 0; i < count; i++) {
          const cx = W * 0.5 + (Math.random() - 0.5) * W * 0.18;
          particles.push({
            x: cx,
            y: H - 4 + Math.random() * 6,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -(4 + Math.random() * 4),
            life: 0,
            maxLife: 70 + Math.random() * 50,
            r: 12 + Math.random() * 22,
          });
        }
      }

      ctx.globalCompositeOperation = 'lighter';
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy -= 0.06 * dt;
        p.vx += Math.sin(p.life * 0.18 + i) * 0.08 * dt;
        p.vx *= 0.985;

        const t = p.life / p.maxLife;
        if (t >= 1) { particles.splice(i, 1); continue; }

        const heat = 1 - t;
        let r, g, b;
        if (heat > 0.7) { r = 255; g = 240; b = 190; }
        else if (heat > 0.45) { r = 255; g = 200; b = 80; }
        else if (heat > 0.22) { r = 235; g = 120; b = 35; }
        else { r = 160; g = 50; b = 20; }
        const a = Math.pow(heat, 1.2) * 0.40;
        const rad = p.r * (0.6 + heat * 1.1);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
        grad.addColorStop(0, `rgba(${r|0},${g|0},${b|0},${a})`);
        grad.addColorStop(1, `rgba(${r|0},${g|0},${b|0},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={cvRef}/>;
}

// ── GUITAR PERFORMANCE PLACEHOLDER ─────────────────────────────────────
function GuitarScene() {
  const cvRef = useRef(null);
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext('2d', { alpha: false });
    let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);

    const init = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    init();
    const ro = new ResizeObserver(init); ro.observe(cv);

    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.016;

      // Background — warm dim stage
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#0a0608');
      bg.addColorStop(1, '#1a0c08');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Stage spotlight from above (cone)
      const spotPulse = 0.85 + Math.sin(t * 1.2) * 0.1;
      const spotX = W * 0.5, spotY = H * 0.35;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const sg = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, W * 0.7);
      sg.addColorStop(0, `rgba(255, 200, 120, ${0.45 * spotPulse})`);
      sg.addColorStop(0.4, `rgba(200, 120, 60, ${0.2 * spotPulse})`);
      sg.addColorStop(1, 'rgba(40, 20, 10, 0)');
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // Silhouette of seated musician + guitar
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      // body
      ctx.beginPath();
      ctx.ellipse(W * 0.5, H * 0.62, W * 0.13, H * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();
      // head
      ctx.beginPath();
      ctx.arc(W * 0.5, H * 0.40, W * 0.07, 0, Math.PI * 2);
      ctx.fill();
      // shoulders
      ctx.beginPath();
      ctx.ellipse(W * 0.5, H * 0.50, W * 0.18, H * 0.07, 0, 0, Math.PI * 2);
      ctx.fill();
      // arm holding guitar
      ctx.fillRect(W * 0.36, H * 0.5, W * 0.12, H * 0.04);
      // guitar body
      ctx.fillStyle = 'rgba(20, 10, 6, 0.95)';
      ctx.beginPath();
      ctx.ellipse(W * 0.36, H * 0.62, W * 0.13, H * 0.10, -0.3, 0, Math.PI * 2);
      ctx.fill();
      // guitar neck
      ctx.save();
      ctx.translate(W * 0.34, H * 0.58);
      ctx.rotate(-0.5);
      ctx.fillRect(0, -3, W * 0.30, 4);
      ctx.restore();
      // strum highlight on guitar — pulses
      const strumPulse = 0.5 + Math.sin(t * 8) * 0.5;
      ctx.fillStyle = `rgba(255, 200, 120, ${0.18 * strumPulse})`;
      ctx.beginPath();
      ctx.ellipse(W * 0.36, H * 0.62, W * 0.06, H * 0.04, 0, 0, Math.PI * 2);
      ctx.fill();

      // Audio bars at bottom — soft visualizer
      const bars = 26;
      const bw = (W * 0.7) / bars;
      const bstart = W * 0.15;
      for (let i = 0; i < bars; i++) {
        const h = Math.abs(Math.sin(t * 3 + i * 0.6) * Math.sin(t * 1.3 + i * 0.21)) * H * 0.10 + 2;
        ctx.fillStyle = `rgba(232, 168, 80, ${0.4 + (h / (H * 0.1)) * 0.4})`;
        ctx.fillRect(bstart + i * bw + 1, H - 12 - h, bw - 2, h);
      }

      // Soft vignette
      const vg = ctx.createRadialGradient(W/2, H/2, Math.min(W,H)*0.2, W/2, H/2, Math.max(W,H)*0.7);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.5)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={cvRef} className="guitar-canvas"/>;
}

// ── MONITOR — scrolling cadence text ───────────────────────────────────
function MonitorCadence({ lines, speed = 0.6 }) {
  const scrollRef = useRef(null);
  const stateRef = useRef({ y: 0 });
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    let raf = 0;
    const tick = () => {
      const inner = el.firstElementChild;
      if (inner) {
        stateRef.current.y += 0.35 * speedRef.current;
        // Loop using mod of inner height / 2 since text is duplicated
        const total = inner.scrollHeight / 2;
        if (total > 0 && stateRef.current.y >= total) stateRef.current.y -= total;
        inner.style.transform = `translateY(${-stateRef.current.y}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="cadence-scroll" ref={scrollRef}>
      <div className="cadence-inner">
        {lines.concat(lines).map((line, i) => (
          <div key={i} className="cad-line">
            <span className="cad-cursor">{(i % lines.length) === 0 ? '◉' : '·'}</span>
            <span className="cad-text">{line}</span>
          </div>
        ))}
      </div>
      <style>{`
        .cadence-scroll {
          position: absolute; inset: 0;
          overflow: hidden;
          padding: 4px 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(7px, 0.9vw, 10px);
          line-height: 1.55;
          color: rgba(180, 220, 200, 0.78);
          text-shadow: 0 0 4px rgba(120, 200, 160, 0.45);
        }
        .cadence-scroll::before, .cadence-scroll::after {
          content: '';
          position: absolute; left: 0; right: 0;
          height: 30%;
          pointer-events: none;
          z-index: 2;
        }
        .cadence-scroll::before { top: 0; background: linear-gradient(180deg, #04030a 0%, transparent 100%); }
        .cadence-scroll::after  { bottom: 0; background: linear-gradient(0deg, #04030a 0%, transparent 100%); }
        .cadence-inner { will-change: transform; }
        .cad-line {
          display: flex; gap: 5px;
          padding: 1px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cad-cursor { color: rgba(120, 220, 180, 0.6); flex-shrink: 0; width: 8px; }
        .cad-text { opacity: 0.85; }
        /* faint scanlines on monitor */
        .cadence-scroll {
          background:
            repeating-linear-gradient(180deg,
              rgba(0,0,0,0) 0px,
              rgba(0,0,0,0) 2px,
              rgba(0,0,0,0.12) 2px,
              rgba(0,0,0,0.12) 3px);
        }
      `}</style>
    </div>
  );
}

// ── ARTICULATE WAVEFORM — subtle floor presence ────────────────────────
function ArticulateWave({ active }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setT(performance.now() * 0.0008);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const points = useMemo(() => {
    const N = 64;
    return Array.from({ length: N }, (_, i) => {
      const x = (i / (N - 1)) * 100;
      // sum of three sines for organic motion
      const baseAmp = active ? 5 : 1.6;
      const y = 50 +
        Math.sin(i * 0.32 + t * 2.2) * baseAmp +
        Math.sin(i * 0.13 - t * 1.5) * (baseAmp * 0.5) +
        Math.sin(i * 0.55 + t * 3.8) * (baseAmp * 0.3);
      return [x, y];
    });
  }, [t, active]);

  const path = useMemo(() => {
    return 'M ' + points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ');
  }, [points]);

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="wfg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(232, 168, 60, 0)"/>
          <stop offset="20%" stopColor="rgba(232, 168, 60, 0.6)"/>
          <stop offset="50%" stopColor="rgba(248, 200, 110, 0.9)"/>
          <stop offset="80%" stopColor="rgba(232, 168, 60, 0.6)"/>
          <stop offset="100%" stopColor="rgba(232, 168, 60, 0)"/>
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke="url(#wfg)" strokeWidth="0.7" vectorEffect="non-scaling-stroke"/>
      <path d={path} fill="none" stroke="rgba(248, 220, 160, 0.5)" strokeWidth="0.3" vectorEffect="non-scaling-stroke"/>
    </svg>
  );
}

// ── ROOM PARTICLES — drifting dust motes catching the warm light ───────
function RoomParticles({ density = 0.8 }) {
  const cvRef = useRef(null);
  const densityRef = useRef(density);
  useEffect(() => { densityRef.current = density; }, [density]);

  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext('2d', { alpha: true });
    let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    let motes = [];

    const init = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const N = Math.floor(60 * densityRef.current);
      motes = Array.from({ length: N }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        z: 0.3 + Math.random() * 0.7,           // depth: 0 far, 1 near
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.05 - Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
      }));
    };
    init();
    const ro = new ResizeObserver(init); ro.observe(cv);

    let raf = 0, last = performance.now();
    const tick = (now) => {
      const dt = Math.min(60, now - last) / 16.6; last = now;
      ctx.clearRect(0, 0, W, H);

      for (const m of motes) {
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.phase += 0.04 * dt;
        if (m.y < -8) { m.y = H + 8; m.x = Math.random() * W; }
        if (m.x < -8) m.x = W + 8;
        if (m.x > W + 8) m.x = -8;
        const tw = Math.sin(m.phase) * 0.4 + 0.6;
        const r = 0.5 + m.z * 1.6;
        const a = tw * m.z * 0.7;
        // Warm tint to match lantern light
        ctx.fillStyle = `rgba(248, 200, 140, ${a})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={cvRef} className="particles"/>;
}

// ── CHEVRON PAD — subtle persistent 4-way. Arrows glow only when a move is available.
function ChevronPad({ visible, avail, onMove }) {
  const Arrow = ({ dir, d }) => (
    <button
      className={`cv-arrow cv-${dir}${avail[dir] ? ' live' : ''}`}
      onClick={() => avail[dir] && onMove(dir)}
      aria-label={dir}
      tabIndex={avail[dir] ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={d}/>
      </svg>
    </button>
  );
  return (
    <div className={`chevpad${visible ? ' on' : ''}`}>
      <Arrow dir="up"   d="M5 15 L12 8 L19 15"/>
      <div className="cv-mid">
        <Arrow dir="left"  d="M15 5 L8 12 L15 19"/>
        <span className="cv-dot"/>
        <Arrow dir="right" d="M9 5 L16 12 L9 19"/>
      </div>
      <Arrow dir="down" d="M5 9 L12 16 L19 9"/>
    </div>
  );
}

// ── LANTERN SPEECH BUBBLE — the lantern "speaks" above the desk lantern.
function LanternBubble({ text }) {
  return (
    <div className={`lantern-bubble${text ? ' show' : ''}`}>
      <div className="lb-inner">{text}</div>
      <div className="lb-tail"/>
    </div>
  );
}

// ── CRACK FX — sparks + smoke that burst from the seam when the wall opens.
function CrackFX({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    let raf, t0 = performance.now(), running = true;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      cv.width = window.innerWidth * dpr; cv.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const W = () => window.innerWidth, H = () => window.innerHeight;
    const cx = () => W() * 0.5;
    const sparks = [], smoke = [];
    for (let i = 0; i < 90; i++) {
      const a = (Math.random() - 0.5) * Math.PI * 1.1;
      const sp = 5 + Math.random() * 16;
      sparks.push({
        x: cx() + (Math.random() - 0.5) * 24,
        y: H() * (0.18 + Math.random() * 0.64),
        vx: Math.sin(a) * sp * (Math.random() < 0.5 ? -1 : 1),
        vy: (Math.random() - 0.5) * 6 - 1,
        life: 0.6 + Math.random() * 0.9, age: 0,
        hue: 24 + Math.random() * 24, sz: 1 + Math.random() * 2.4,
      });
    }
    for (let i = 0; i < 34; i++) {
      smoke.push({
        x: cx() + (Math.random() - 0.5) * 90,
        y: H() * (0.2 + Math.random() * 0.62),
        vx: (Math.random() - 0.5) * 1.4,
        vy: -0.5 - Math.random() * 1.6,
        r: 26 + Math.random() * 70, age: Math.random() * 0.4,
        life: 1.6 + Math.random() * 1.4,
      });
    }
    const tick = (now) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - t0) / 1000); t0 = now;
      ctx.clearRect(0, 0, W(), H());
      // smoke
      ctx.globalCompositeOperation = 'source-over';
      smoke.forEach(s => {
        s.age += dt; s.x += s.vx; s.y += s.vy; s.r += 22 * dt;
        const k = Math.max(0, 1 - s.age / s.life);
        if (k <= 0) return;
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
        g.addColorStop(0, `rgba(60,46,34,${0.16 * k})`);
        g.addColorStop(1, 'rgba(30,22,16,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });
      // sparks
      ctx.globalCompositeOperation = 'lighter';
      sparks.forEach(p => {
        p.age += dt; p.x += p.vx; p.y += p.vy; p.vy += 16 * dt; p.vx *= 0.97;
        const k = Math.max(0, 1 - p.age / p.life);
        if (k <= 0) return;
        ctx.fillStyle = `hsla(${p.hue},100%,${58 + k * 30}%,${k})`;
        ctx.shadowColor = `hsla(${p.hue},100%,60%,${k})`; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2); ctx.fill();
      });
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    return () => { running = false; cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [active]);
  if (!active) return null;
  return <canvas ref={ref} className="crackfx"/>;
}

// ── STONE STAIRCASE — a real 3D castle staircase descending into warm depths.
function StoneStaircase() {
  const W = 1000, H = 800;
  const VP = { x: 500, y: 250 };
  const nearY = H, farY = VP.y;
  const nearL = 70, nearR = 930;
  const lx = (y) => nearL + (VP.x - nearL) * ((nearY - y) / (nearY - farY));
  const rx = (y) => nearR - (nearR - VP.x) * ((nearY - y) / (nearY - farY));

  const N = 13;
  const ys = Array.from({ length: N + 1 }, (_, i) => farY + (nearY - farY) * Math.pow(1 - i / N, 1.8));

  const steps = [];
  for (let i = 0; i < N; i++) {
    const yb = ys[i], yt = ys[i + 1];
    const yMid = yt + (yb - yt) * 0.42;          // tread/riser split
    const warm = i / (N - 1);                      // 0 near (dark) → 1 far (warm glow)
    const tread = `rgb(${Math.round(34 + warm * 168)},${Math.round(26 + warm * 96)},${Math.round(18 + warm * 38)})`;
    const riser = `rgb(${Math.round(15 + warm * 70)},${Math.round(11 + warm * 38)},${Math.round(8 + warm * 14)})`;
    steps.push({ yb, yt, yMid, warm, tread, riser,
      lxb: lx(yb), rxb: rx(yb), lxm: lx(yMid), rxm: rx(yMid), lxt: lx(yt), rxt: rx(yt) });
  }

  return (
    <svg className="stair-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="st-depth" cx="50%" cy="34%" r="42%">
          <stop offset="0%" stopColor="rgba(255,168,60,0.95)"/>
          <stop offset="40%" stopColor="rgba(208,98,28,0.55)"/>
          <stop offset="100%" stopColor="rgba(90,34,10,0)"/>
        </radialGradient>
        <radialGradient id="st-torch" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,196,80,0.6)"/>
          <stop offset="100%" stopColor="rgba(255,120,30,0)"/>
        </radialGradient>
        <radialGradient id="st-vig" cx="50%" cy="46%" r="70%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.86)"/>
        </radialGradient>
        <linearGradient id="st-lwall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0a0805"/>
          <stop offset="100%" stopColor="#1c1409"/>
        </linearGradient>
        <linearGradient id="st-rwall" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#080604"/>
          <stop offset="100%" stopColor="#160f08"/>
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill="#040302"/>

      {/* Side walls */}
      <polygon points={`0,0 ${lx(farY)},${farY} ${lx(nearY)},${nearY} 0,${H}`} fill="url(#st-lwall)"/>
      <polygon points={`${W},0 ${rx(farY)},${farY} ${rx(nearY)},${nearY} ${W},${H}`} fill="url(#st-rwall)"/>
      {/* Ceiling/top void */}
      <polygon points={`0,0 ${W},0 ${rx(farY)},${farY} ${lx(farY)},${farY}`} fill="#050404"/>

      {/* Masonry courses on side walls */}
      {Array.from({ length: 7 }).map((_, i) => {
        const y = 80 + i * 95;
        return <g key={'m' + i}>
          <line x1="0" y1={y} x2={lx(y)} y2={y} stroke="rgba(70,50,24,0.28)" strokeWidth="1"/>
          <line x1={W} y1={y} x2={rx(y)} y2={y} stroke="rgba(60,42,20,0.24)" strokeWidth="1"/>
        </g>;
      })}

      {/* Warm depth glow at the bottom of the stairwell */}
      <ellipse cx={VP.x} cy={farY + 36} rx="150" ry="78" fill="url(#st-depth)"/>

      {/* Steps: riser (dark front face) then tread (lit top) */}
      {steps.map((s, i) => (
        <g key={i}>
          <polygon points={`${s.lxm},${s.yMid} ${s.rxm},${s.yMid} ${s.rxb},${s.yb} ${s.lxb},${s.yb}`} fill={s.riser}/>
          <polygon points={`${s.lxt},${s.yt} ${s.rxt},${s.yt} ${s.rxm},${s.yMid} ${s.lxm},${s.yMid}`} fill={s.tread}/>
          {/* nosing highlight on the lit front edge of the tread */}
          <line x1={s.lxm} y1={s.yMid} x2={s.rxm} y2={s.yMid}
            stroke={`rgba(255,${Math.round(180 + s.warm * 60)},120,${0.18 + s.warm * 0.4})`} strokeWidth={1.4}/>
        </g>
      ))}

      {/* Torch on the left wall */}
      <g transform="translate(150,300)">
        <ellipse cx="0" cy="-20" rx="60" ry="80" fill="url(#st-torch)"/>
        <rect x="-3" y="0" width="7" height="26" rx="2" fill="#241405"/>
        <ellipse cx="0" cy="-16" rx="11" ry="20" fill="rgba(255,150,40,0.6)"/>
        <ellipse cx="0" cy="-21" rx="6.5" ry="13" fill="rgba(255,205,80,0.85)"/>
        <ellipse cx="0" cy="-26" rx="3" ry="7" fill="rgba(255,248,190,0.97)">
          <animate attributeName="ry" values="7;9;6.5;7" dur="0.5s" repeatCount="indefinite"/>
        </ellipse>
      </g>

      <rect width={W} height={H} fill="url(#st-vig)" style={{ pointerEvents: 'none' }}/>
    </svg>
  );
}

// ── LEFT WALL SCENE — the wall you face after turning left.
//    Jagged lightning-bolt light at the seam; painting in the right corner;
//    tapping the painting cracks the wall open like sliding doors.
function LeftWallScene({ wall, jiggle, onPaintingTap }) {
  // Shared jagged midline (x%,y%) so both door clip-paths meet exactly.
  const seam = '54% 0%, 46% 12%, 53% 25%, 45% 38%, 52% 50%, 44% 62%, 51% 75%, 45% 88%, 53% 100%';
  const leftClip  = `polygon(0% 0%, ${seam}, 0% 100%)`;
  const rightClip = `polygon(100% 0%, ${seam}, 100% 100%)`;
  const open = wall === 'open' || wall === 'cracking';

  return (
    <div className="leftwall">
      {/* Revealed staircase behind the doors */}
      <div className="lw-behind"><StoneStaircase/></div>

      {/* Lightning-bolt light along the seam */}
      <svg className={`lw-bolt${open ? ' flare' : ''}`} viewBox="0 0 200 800" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lw-core" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,250,235,0.95)"/>
            <stop offset="50%" stopColor="rgba(255,224,150,0.9)"/>
            <stop offset="100%" stopColor="rgba(255,238,200,0.95)"/>
          </linearGradient>
        </defs>
        <path className="lw-bolt-glow"
          d="M108 0 L92 96 L106 200 L90 304 L104 400 L88 496 L102 600 L90 704 L106 800"
          fill="none" stroke="rgba(255,180,70,0.5)" strokeWidth="20" strokeLinejoin="round"/>
        <path className="lw-bolt-core"
          d="M108 0 L92 96 L106 200 L90 304 L104 400 L88 496 L102 600 L90 704 L106 800"
          fill="none" stroke="url(#lw-core)" strokeWidth="4" strokeLinejoin="round"/>
      </svg>

      {/* Two stone door panels */}
      <div className={`lw-door lw-left${open ? ' open' : ''}`} style={{ clipPath: leftClip, WebkitClipPath: leftClip }}/>
      <div className={`lw-door lw-right${open ? ' open' : ''}`} style={{ clipPath: rightClip, WebkitClipPath: rightClip }}>
        {/* Painting rides the right panel, in the right corner */}
        <div
          className={`lw-painting${jiggle ? ' jiggling' : ''}`}
          onClick={(e) => { e.stopPropagation(); if (wall === 'closed') onPaintingTap(); }}
        >
          <img src={window.__resources?.paintingImg || 'HuAreWe1.jpg'} alt=""/>
          <div className="lw-frame"/>
        </div>
      </div>

      {/* Sparks + smoke during the break */}
      <CrackFX active={wall === 'cracking' || wall === 'open'}/>
    </div>
  );
}

// ── AMBIENT AUDIO — slow drone + soft melodic murmur ───────────────────
function useAmbientAudio(on) {
  const ctxRef = useRef(null);
  useEffect(() => {
    if (!on) {
      const ctx = ctxRef.current;
      if (ctx) {
        try {
          const g = ctx._master;
          g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
        } catch (e) {}
        setTimeout(() => { try { ctx.close(); } catch (e) {} }, 2200);
        ctxRef.current = null;
      }
      return;
    }
    if (ctxRef.current) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      ctx._master = master;
      ctxRef.current = ctx;

      // Drone: 3 sine partials
      const freqs = [55, 82.5, 110];
      const gains = [0.10, 0.06, 0.03];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = f;
        const g = ctx.createGain(); g.gain.value = gains[i];
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.06 + i * 0.027;
        const lfoG = ctx.createGain(); lfoG.gain.value = gains[i] * 0.55;
        lfo.connect(lfoG); lfoG.connect(g.gain);
        osc.connect(g); g.connect(master);
        osc.start(); lfo.start();
      });

      // Soft guitar-like murmur — sparse plucks at long intervals
      const pluck = () => {
        if (!ctxRef.current) return;
        const c = ctxRef.current;
        const notes = [220, 246.94, 293.66, 329.63, 392, 440];
        const n = notes[Math.floor(Math.random() * notes.length)];
        const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = n;
        const g = c.createGain(); g.gain.value = 0;
        o.connect(g); g.connect(master);
        const t = c.currentTime;
        g.gain.linearRampToValueAtTime(0.045, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0005, t + 2.4);
        o.start(t); o.stop(t + 2.6);
        setTimeout(pluck, 4000 + Math.random() * 6000);
      };
      setTimeout(pluck, 4000);

      master.gain.linearRampToValueAtTime(0.34, ctx.currentTime + 3);
    } catch (e) { console.warn('Audio init failed', e); }
  }, [on]);
}

// ── MAIN APP ───────────────────────────────────────────────────────────
function Pad() {
  const useTweaksFn = window.useTweaks || ((d) => [d, () => {}]);
  const [tw, setTweak] = useTweaksFn(window.PAD_DEFAULTS);
  const GR = window.GameRoom || null;

  const [audioOn, setAudioOn] = useState(false);
  useAmbientAudio(audioOn && tw.audio);

  // ── Navigation / dungeon-entry state ───────────────────────────
  const LANTERN_LINES = [
    'seeking light is fulfilling, come back for more enlightenment',
    'keep seeking the light, reach where you have not tried and find yourself there',
    'the desire is strong in this one, you may now turn to seek what you have not seen',
  ];
  const [lanternTaps, setLanternTaps] = useState(0);
  const [bubble,      setBubble]      = useState(null);   // current lantern line
  const [dpadOn,      setDpadOn]      = useState(false);  // sticky once revealed
  const [view,        setView]        = useState('front');// 'front' | 'leftwall' | 'game'
  const [wall,        setWall]        = useState('closed');// 'closed' | 'cracking' | 'open'
  const [paintingJiggle, setPaintingJiggle] = useState(false);
  const bubbleTimer = useRef(null);

  const handleLanternTap = () => {
    if (dpadOn) return;
    const n = Math.min(3, lanternTaps + 1);
    setLanternTaps(n);
    setBubble(LANTERN_LINES[n - 1]);
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubble(null), 5200);
    if (n >= 3) setTimeout(() => setDpadOn(true), 900);
  };

  const handlePaintingTap = () => {
    if (wall !== 'closed') return;
    setPaintingJiggle(true);
    setTimeout(() => {
      setPaintingJiggle(false);
      setWall('cracking');
      setTimeout(() => setWall('open'), 1500);
    }, 760);
  };

  // D-pad availability per view/state.
  // 'up' (▲) = move forward/into;  'right' (›) = turn back toward the Pad.
  const avail =
    view === 'front'    ? { left: true,  right: false, up: false,            down: false } :
    view === 'leftwall' ? { left: false, right: true,  up: wall === 'open',  down: false } :
                          { left: false, right: false, up: false,            down: false };

  const handleMove = (dir) => {
    if (view === 'front' && dir === 'left')  setView('leftwall');
    else if (view === 'leftwall' && dir === 'right') setView('front');
    else if (view === 'leftwall' && dir === 'up' && wall === 'open') setView('game'); // traverse staircase
  };

  // Rotating floor caption
  const [captionIdx, setCaptionIdx] = useState(0);
  const [captionVisible, setCaptionVisible] = useState(true);
  useEffect(() => {
    const captions = window.ROOM_CAPTIONS || [];
    if (!captions.length) return;
    const cycle = () => {
      setCaptionVisible(false);
      setTimeout(() => {
        setCaptionIdx(i => (i + 1) % captions.length);
        setCaptionVisible(true);
      }, 1400);
    };
    const interval = setInterval(cycle, 9000);
    return () => clearInterval(interval);
  }, []);

  // Articulate wave is more active when audio is on
  const waveActive = audioOn && tw.audio;

  // Back wall video phase — now driven by fireLevel from phone
  const [fireLevel,  setFireLevel]  = useState(1);
  const [lightLevel, setLightLevel] = useState(3);
  const [wallExpanded, setWallExpanded] = useState(false);
  const [pillarActive, setPillarActive] = useState(false);
  const [mantelPath, setMantelPath] = useState(window.__resources?.tempWall || 'Temp-wall.mp4');
  const [wallPath,   setWallPath]   = useState(window.__resources?.tempWall || 'Temp-wall.mp4');
  const [transmuteCount, setTransmuteCount] = useState(0);

  useEffect(() => {
    const onFire  = (e) => {
      const lvl = e.detail.level;
      setFireLevel(lvl);
      if (lvl === 4) setWallExpanded(true);
      else           setWallExpanded(false);
    };
    const onLight        = (e) => setLightLevel(e.detail.level);
    const onWallCollapse = ()  => setWallExpanded(false);
    const onPortalPreview   = (e) => setMantelPath(e.detail.src);
    const onPortalTransmute = (e) => {
      const src = e.detail.src;
      setMantelPath(src);
      setWallPath(src);
      setWallExpanded(true);
      setTransmuteCount(c => c + 1); // always increments → always re-fires pillar
    };
    window.addEventListener('pad:fire-level',      onFire);
    window.addEventListener('pad:lights-level',    onLight);
    window.addEventListener('pad:wall-collapse',   onWallCollapse);
    window.addEventListener('pad:portal-preview',  onPortalPreview);
    window.addEventListener('pad:portal-transmute',onPortalTransmute);
    return () => {
      window.removeEventListener('pad:fire-level',      onFire);
      window.removeEventListener('pad:lights-level',    onLight);
      window.removeEventListener('pad:wall-collapse',   onWallCollapse);
      window.removeEventListener('pad:portal-preview',  onPortalPreview);
      window.removeEventListener('pad:portal-transmute',onPortalTransmute);
    };
  }, []);

  // 3-second pillar burst when wall expands OR on every transmute
  useEffect(() => {
    if (!wallExpanded) { setPillarActive(false); return; }
    setPillarActive(true);
    const t = setTimeout(() => setPillarActive(false), 3000);
    return () => clearTimeout(t);
  }, [wallExpanded]);

  // Re-fire pillar on every subsequent transmute (transmuteCount always increments)
  useEffect(() => {
    if (transmuteCount === 0) return;
    setPillarActive(true);
    const t = setTimeout(() => setPillarActive(false), 3000);
    return () => clearTimeout(t);
  }, [transmuteCount]);

  // Fire intensity by level: 1=ember, 2=gentle, 3=stoked, 4=roaring
  const fireLevelToIntensity = [0.32, 0.65, 1.15, pillarActive ? 2.6 : 1.2];
  const fireIntensity = fireLevelToIntensity[fireLevel - 1] ?? 0.32;

  // Fireplace hides after wall fully expands (+1.6 s delay)
  const [wallActive, setWallActive] = useState(false);
  useEffect(() => {
    if (wallExpanded) {
      const t = setTimeout(() => setWallActive(true), 1600);
      return () => clearTimeout(t);
    } else {
      setWallActive(false);
    }
  }, [wallExpanded]);

  // Light overlay — 5 levels: 1=very dark → 3=ambient → 5=bright
  // Levels 1-2: dark overlay; level 3: nothing; levels 4-5: warm screen glow
  const darkOpacity  = [0.88, 0.58, 0, 0, 0][lightLevel - 1] ?? 0;
  const brightOpacity = [0, 0, 0, 0.18, 0.36][lightLevel - 1] ?? 0;

  // ── Flashlight state (driven by phone) tracks .room class for sigil reveal
  const [flOn, setFlOn] = useState(false);
  const [keyCollected, setKeyCollected] = useState(false);
  useEffect(() => {
    const onFL = (e) => setFlOn(!!e.detail.active);
    window.addEventListener('pad:flashlight', onFL);
    return () => window.removeEventListener('pad:flashlight', onFL);
  }, []);

  const collectKey = () => {
    if (keyCollected) return;
    setKeyCollected(true);
    window.dispatchEvent(new CustomEvent('pad:inv-add', {
      detail: { id: 'key-01', name: 'A Key', icon: '\u29C9' }
    }));
  };

  return (
    <div className={`room ${flOn ? 'flashlight-on' : ''}`}>
      {/* Topbar */}
      <div className="topbar">
        <div className="room-name">
          The Lantern Road
          <span className="sigil">·</span>
          A Pad
        </div>
        <button
          className={`sound-chip ${audioOn ? 'on' : ''}`}
          onClick={() => {
            if (!tw.audio) setTweak({ audio: true });
            setAudioOn(a => !a);
            // Also toggle global mute via music engine
            const eng = window.getMusicEngine ? window.getMusicEngine() : null;
            if (eng) eng.toggleAllMuted();
          }}
          aria-label="Toggle ambient sound"
        >
          <span className="dot"/>
          <span>Sound · {audioOn ? 'On' : 'Off'}</span>
        </button>
      </div>

      {/* Room surfaces — the cube */}
      <div className="surface back"/>
      <div className="surface left"/>
      <div className="surface right"/>
      <div className="surface floor"/>
      <div className="floor-seam"/>

      {/* Mantel screen + back-wall expansion — controlled by wallExpanded */}
      <MantelWallVideo expanded={wallExpanded} mantelPath={mantelPath} wallPath={wallPath}/>

      {/* Fireplace — fades back when wall video takes over at stage 4 */}
      <div className="fireplace" style={{
        opacity: wallActive ? 0 : 1,
        transform: wallActive ? 'translateX(-50%) translateY(12px) scale(0.94)' : 'translateX(-50%)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
      }}>
        <div className="fireplace-frame"/>
        <div className="fireplace-opening">
          <FireplaceFire intensity={fireIntensity}/>
        </div>
        <div className="fireplace-hearth"/>
      </div>

      {/* Flame pillar — erupts at fire level 4 */}
      <div className={`flame-pillar ${pillarActive ? 'active' : ''}`}>
        <FlamePillar active={pillarActive}/>
      </div>

      {/* Faint hint that there is something to your left */}
      {dpadOn && view === 'front' && <div className="turn-hint-left"/>}

      {/* TV — cattycorner in the LEFT corner */}
      <div className="tv">
        <div className="tv-bezel"/>
        <div className="tv-screen">
          <TVScene intensity={tw.tvIntensity} warmth={tw.warmth}/>
          <div className="tv-edge-mask"/>
        </div>
        <div className="tv-glow"/>
        <div className="tv-stand"/>
      </div>

      {/* Articulate waveform — between back wall and floor */}
      <div className="articulate"><ArticulateWave active={waveActive}/></div>

      {/* Desk — cattycorner in the RIGHT corner */}
      <div className="desk">
        <div className="desk-surface">
          <div className="desk-monitor">
            <div className="monitor-frame">
              <div className="monitor-screen-inner">
                <MonitorCadence lines={window.CADENCE || []} speed={tw.monitorSpeed}/>
              </div>
            </div>
            <div className="monitor-stand"/>
            <div className="monitor-base"/>
          </div>
          <div className={`lantern-spot${dpadOn ? '' : ' tappable'}`} onClick={handleLanternTap}>
            <LanternVideo/>
            <div className="object-tip">{dpadOn ? 'the lantern' : 'touch the lantern'}</div>
            <LanternBubble text={bubble}/>
          </div>
          <div
            className={`key-spot ${keyCollected ? 'collected' : ''}`}
            onClick={collectKey}
          >
            <KeyOnTable size={36}/>
            <div className="object-tip">a key · take it</div>
          </div>
        </div>
        <div className="desk-top"/>
        <div className="desk-front">
          <div className="desk-drawer"/>
        </div>
        <div className="desk-legs">
          <div className="desk-leg l1"/>
          <div className="desk-leg l2"/>
        </div>
      </div>

      {/* Hidden sigils — only readable under the flashlight beam */}
      <div className="hidden-sigil" style={{ left: '38%', top: '18%', fontSize: 16 }}>hu · are · we</div>
      <div className="hidden-sigil" style={{ left: '72%', top: '24%', transform: 'rotate(-4deg)' }}>the door is inside</div>
      <div className="hidden-sigil" style={{ left: '22%', top: '46%', fontSize: 14, transform: 'rotate(8deg)' }}>listen — the wave knows your name</div>
      <div className="hidden-sigil" style={{ left: '58%', top: '70%', fontSize: 13 }}>turn around. you are already through.</div>
      <div className="hidden-sigil" style={{ left: '8%',  top: '34%', fontSize: 22, letterSpacing: '0.5em' }}>❁</div>
      <div className="hidden-sigil" style={{ left: '88%', top: '58%', fontSize: 22, letterSpacing: '0.5em' }}>❁</div>

      {/* Room dust */}
      <RoomParticles density={tw.particles}/>

      {/* ── LIGHT OVERLAYS — dark layer + warm bright layer ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 20,
        background: 'rgba(3,1,0,1)',
        opacity: darkOpacity,
        pointerEvents: 'none',
        transition: 'opacity 1.6s ease',
      }}/>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 20,
        background: 'radial-gradient(ellipse 90% 70% at 50% 40%, rgba(255,200,100,0.55) 0%, rgba(200,120,40,0.25) 50%, transparent 80%)',
        opacity: brightOpacity,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        transition: 'opacity 1.6s ease',
      }}/>

      {/* Floor caption */}
      <div className="room-caption" style={{ opacity: captionVisible ? 1 : 0, transition: 'opacity 1.4s ease' }}>
        — {(window.ROOM_CAPTIONS || ['the lantern road pad'])[captionIdx]} —
      </div>

      {/* Tweaks panel */}
      {window.PhoneOverlay && <window.PhoneOverlay/>}
      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection label="Atmosphere">
            <window.TweakSlider label="TV glow"        value={tw.tvIntensity}  min={0}   max={1.6} step={0.05} onChange={v => setTweak({ tvIntensity: v })}/>
            <window.TweakSlider label="Warmth"         value={tw.warmth}       min={0}   max={1.6} step={0.05} onChange={v => setTweak({ warmth: v })}/>
            <window.TweakSlider label="Dust"           value={tw.particles}    min={0}   max={1.5} step={0.05} onChange={v => setTweak({ particles: v })}/>
            <window.TweakSlider label="Cadence speed"  value={tw.monitorSpeed} min={0.1} max={1.8} step={0.05} onChange={v => setTweak({ monitorSpeed: v })}/>
          </window.TweakSection>
          <window.TweakSection label="Presence">
            <window.TweakToggle label="Ambient sound" value={tw.audio}      onChange={v => { setTweak({ audio: v }); if (!v) setAudioOn(false); }}/>
            <window.TweakToggle label="Show labels"   value={tw.showLabels} onChange={v => setTweak({ showLabels: v })}/>
          </window.TweakSection>
        </window.TweaksPanel>
      )}

      {/* ── CHEVRON D-PAD — persistent in the Pad/wall; the game has its own pad ── */}
      <ChevronPad visible={dpadOn && view !== 'game'} avail={avail} onMove={handleMove}/>

      {/* ── LEFT WALL — lightning-bolt light, painting, cracking doors ── */}
      {view === 'leftwall' && (
        <LeftWallScene wall={wall} jiggle={paintingJiggle} onPaintingTap={handlePaintingTap}/>
      )}

      {/* ── GAME ROOM — the full dungeon; "← surface" returns to the Pad ── */}
      {view === 'game' && GR && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 150, background: '#050302' }}>
          <GR onExit={() => setView('front')}/>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Pad/>);
