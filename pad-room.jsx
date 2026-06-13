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
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
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

// ── FIREPLACE FIRE — looping video of real flames inside the hearth.
//    `intensity` ramps up for the eruption: the footage brightens,
//    saturates and scales a touch so the fire visibly surges before
//    the flame-pillar / wall takeover of the transmutation. ──
function FireplaceFire({ intensity = 1 }) {
  const vRef = useRef(null);
  const [src, setSrc] = useState(null);

  // The uploaded MP4 isn't "faststart" optimised (moov atom at the end) and
  // the dev server doesn't serve byte ranges — so streaming via a plain
  // src= fails with NO_SOURCE. Fetching the whole file into a Blob URL puts
  // the entire container in memory, letting the browser find the moov atom.
  useEffect(() => {
    let url = null, alive = true;
    fetch('assets/fireplace-fire.mp4')
      .then(r => r.blob())
      .then(b => { if (!alive) return; url = URL.createObjectURL(b); setSrc(url); })
      .catch(() => {});
    return () => { alive = false; if (url) URL.revokeObjectURL(url); };
  }, []);

  // Make sure the muted loop actually starts (some browsers need a nudge).
  useEffect(() => {
    const v = vRef.current; if (!v || !src) return;
    const play = () => { v.play().catch(() => {}); };
    play();
    v.addEventListener('canplay', play);
    return () => v.removeEventListener('canplay', play);
  }, [src]);

  const I = Math.max(0, intensity);
  if (!src) return null;
  return (
    <video
      ref={vRef}
      className="fireplace-fire"
      src={src}
      muted
      loop
      autoPlay
      playsInline
      preload="auto"
      style={{
        filter: `brightness(${0.92 + I * 0.4}) saturate(${1 + I * 0.4}) contrast(${1 + I * 0.1})`,
        transform: `scale(${1.4 + I * 0.06})`,
        transformOrigin: '50% 100%',
        transition: 'filter 0.6s ease, transform 0.6s ease',
      }}
    />
  );
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
//    Sized to its own canvas (lives inside the framed entrance), so the
//    burst originates from the doorway "further away", not the full screen.
function CrackFX({ active, loop = false }) {
  const ref = useRef(null);
  const loopRef = useRef(loop);
  useEffect(() => { loopRef.current = loop; }, [loop]);
  useEffect(() => {
    if (!active) return;
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    let raf, t0 = performance.now(), running = true;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let CW = 0, CH = 0;
    const resize = () => {
      CW = cv.clientWidth; CH = cv.clientHeight;
      cv.width = CW * dpr; cv.height = CH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const W = () => CW, H = () => CH;
    const cx = () => W() * 0.5;
    const sparks = [], smoke = [];
    const initSpark = (p) => {
      const a = (Math.random() - 0.5) * Math.PI * 1.1;
      const sp = 5 + Math.random() * 16;
      p.x = cx() + (Math.random() - 0.5) * 24;
      p.y = H() * (0.18 + Math.random() * 0.64);
      p.vx = Math.sin(a) * sp * (Math.random() < 0.5 ? -1 : 1);
      p.vy = (Math.random() - 0.5) * 6 - 1;
      p.life = 0.6 + Math.random() * 0.9; p.age = 0;
      p.hue = 24 + Math.random() * 24; p.sz = 1 + Math.random() * 2.4;
      return p;
    };
    const initSmoke = (s) => {
      s.x = cx() + (Math.random() - 0.5) * 90;
      s.y = H() * (0.2 + Math.random() * 0.62);
      s.vx = (Math.random() - 0.5) * 1.6;
      s.vy = -0.9 - Math.random() * 2.0;
      s.r = 30 + Math.random() * 78; s.age = Math.random() * 0.4;
      s.life = 1.8 + Math.random() * 1.6;
      return s;
    };
    for (let i = 0; i < 90; i++) sparks.push(initSpark({}));
    for (let i = 0; i < 50; i++) smoke.push(initSmoke({}));
    const ro = new ResizeObserver(resize); ro.observe(cv);
    const tick = (now) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - t0) / 1000); t0 = now;
      ctx.clearRect(0, 0, W(), H());
      // smoke
      ctx.globalCompositeOperation = 'source-over';
      smoke.forEach(s => {
        s.age += dt; s.x += s.vx; s.y += s.vy; s.r += 22 * dt;
        const k = Math.max(0, 1 - s.age / s.life);
        if (k <= 0) { if (loopRef.current) initSmoke(s); return; }
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
        g.addColorStop(0, `rgba(116,102,88,${0.32 * k})`);
        g.addColorStop(0.5, `rgba(82,70,58,${0.16 * k})`);
        g.addColorStop(1, 'rgba(40,32,24,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });
      // sparks
      ctx.globalCompositeOperation = 'lighter';
      sparks.forEach(p => {
        p.age += dt; p.x += p.vx; p.y += p.vy; p.vy += 16 * dt; p.vx *= 0.97;
        const k = Math.max(0, 1 - p.age / p.life);
        if (k <= 0) { if (loopRef.current) initSpark(p); return; }
        ctx.fillStyle = `hsla(${p.hue},100%,${58 + k * 30}%,${k})`;
        ctx.shadowColor = `hsla(${p.hue},100%,60%,${k})`; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2); ctx.fill();
      });
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(raf); ro.disconnect(); };
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

// ── STAIR VIDEO — one full-screen clip. Loaded as a Blob so the whole thing is
//    buffered (needed to scrub in reverse). `mode` drives it:
//      'idle'    → seek to frame 0 and hold (static)
//      'play'    → play once, no loop (fires onEnded at the natural end)
//      'hold'    → pause wherever it is (keeps the last frame)
//      'reverse' → step backwards ~30fps; fires onReverseDone at frame 0
//    `visible` fades it in over the others. ──
function StairVideo({ srcPath, mode, visible, hint, onEnded, onReverseDone, extraClass }) {
  const vRef = useRef(null);
  const rafRef = useRef(0);
  const playTimerRef = useRef(null);
  const [srcUrl, setSrcUrl] = useState(null);

  useEffect(() => {
    let url = null, alive = true;
    fetch(srcPath)
      .then(r => r.blob())
      .then(b => { if (!alive) return; url = URL.createObjectURL(b); setSrcUrl(url); })
      .catch(() => {});
    return () => { alive = false; if (url) URL.revokeObjectURL(url); };
  }, [srcPath]);

  useEffect(() => {
    const v = vRef.current; if (!v || !srcUrl) return;
    cancelAnimationFrame(rafRef.current);
    if (mode === 'idle') {
      v.loop = false; v.pause();
      const seek = () => { try { v.currentTime = 0; } catch (e) {} };
      if (v.readyState >= 1) seek(); else v.addEventListener('loadedmetadata', seek, { once: true });
    } else if (mode === 'play') {
      v.loop = false;
      // Always play forward from the start. Seek to 0, then start playback once
      // the seek settles ('seeked'), with a timer fallback for the case where
      // the clip was already at 0 (no seek fires). Calling play() mid-seek from a
      // parked end-frame stalls the video frozen, so we must wait for the seek.
      let started = false;
      const startPlay = () => { if (started) return; started = true; v.play().catch(() => {}); };
      try { v.currentTime = 0; } catch (e) {}
      v.addEventListener('seeked', startPlay, { once: true });
      const fb = setTimeout(startPlay, 140);
      playTimerRef.current = { fb, v, startPlay };
    } else if (mode === 'hold') {
      // VISIBLE hold = the current landing → show the clip's END frame (the point
      // you walked TO). INVISIBLE hold = a clip waiting off-screen → park it at
      // frame 0 so it can play FORWARD instantly. (Parking off-screen clips at the
      // end forces a slow backward re-buffer when they next play — it stalls.)
      v.loop = false;
      const place = () => {
        try {
          if (visible && v.duration) v.currentTime = Math.max(0, v.duration - 0.05);
          else v.currentTime = 0;
        } catch (e) {}
        v.pause();
      };
      if (v.readyState >= 1) place(); else v.addEventListener('loadedmetadata', place, { once: true });
    } else if (mode === 'reverse') {
      v.pause();
      // Reverse-scrub from wherever we are down to frame 0. If we're starting a
      // reverse from the very START (e.g. walking INTO the stone hall — that clip
      // is played backwards), jump to the end first so the whole clip plays in
      // reverse. The spiral's reverse begins at an end frame, so it's unaffected.
      const begin = () => {
        if (v.currentTime <= 0.05 && v.duration) {
          try { v.currentTime = v.duration - 0.05; } catch (e) {}
        }
        const step = () => {
          const nt = v.currentTime - 0.033;
          if (nt <= 0.02) { try { v.currentTime = 0; } catch (e) {} onReverseDone && onReverseDone(); return; }
          try { v.currentTime = nt; } catch (e) {}
          rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
      };
      if (v.readyState >= 1) begin(); else v.addEventListener('loadedmetadata', begin, { once: true });
    }
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current.fb);
        playTimerRef.current.v.removeEventListener('seeked', playTimerRef.current.startPlay);
        playTimerRef.current = null;
      }
    };
  }, [mode, srcUrl, visible]);

  useEffect(() => {
    const v = vRef.current; if (!v) return;
    const h = () => onEnded && onEnded();
    v.addEventListener('ended', h);
    return () => v.removeEventListener('ended', h);
  }, [srcUrl, onEnded]);

  return (
    <div className={`lw-fsvideo${visible ? ' show' : ''}${extraClass ? ' ' + extraClass : ''}`} style={{ zIndex: visible ? 131 : 120 }}>
      {srcUrl && <video ref={vRef} src={srcUrl} muted playsInline preload="auto"/>}
      {visible && hint && <div className="lw-vhint">{hint}</div>}
    </div>
  );
}

// ── LEFT-WALL STAIR-SPIRAL CHAIN ────────────────────────────────────────────
//    A reversible chain of full-screen clips. Each clip ENDS on a "landing"
//    (its held end frame) — that's a stair-spiral vid view, where you make a
//    D-pad decision. The whole thing is DATA-DRIVEN: to add another landing,
//    just append its clip to STAIR_SRCS. No per-video wiring needed.
//
//    Spiral wall-states are encoded as  <kind>:<i>  where i = 0-based clip idx:
//      play:i  → clip i playing forward          (→ land:i when it ends)
//      land:i  → landing i  (held on clip i's end frame). At a landing:
//                  ▲ forward → play:i+1  (or, at the LAST landing, the Dimension Room)
//                  ▶ right   → that landing's side room
//                  ▼ back    → rev:i  (reverse clip i back to the previous landing)
//      rev:i   → clip i reverse-playing         (→ land:i-1, or 'remnant' for i=0)
const STAIR_SRCS = [
  'assets/stair-spiral.mp4',     //  clip 1  →  landing 1
  'assets/stair-spiral-2.mp4',   //  clip 2  →  landing 2
  'assets/stair-spiral-2.mp4',   //  clip 3  →  landing 3   ·  TODO: drop in the real linking clip here
];
const STAIR_COUNT = STAIR_SRCS.length;

// Parse a spiral wall-state → { kind, idx } | null (null = a non-spiral state).
function parseStair(wall) {
  const m = /^(play|land|rev):(\d+)$/.exec(wall || '');
  return m ? { kind: m[1], idx: +m[2] } : null;
}

// ── LEFT-WALL VIDEO STACK — every clip is mounted at once so each keeps its
//    own playhead as you walk forward/back through the chain. ──
function LeftWallVideoStack({ wall, setWall, setView }) {
  const s = parseStair(wall);
  return (
    <React.Fragment>
      {STAIR_SRCS.map((src, i) => {
        let mode = 'hold', visible = false, hint = null;
        if (wall === 'ready' && i === 0) {            // entry — clip 0 frozen on frame 0
          mode = 'idle'; visible = true; hint = 'press \u25B2';
        } else if (s && s.idx === i) {
          if (s.kind === 'play') { mode = 'play';    visible = true; }
          if (s.kind === 'land') { mode = 'hold';    visible = true; }   // a landing — no hint text
          if (s.kind === 'rev')  { mode = 'reverse'; visible = true; }
        }
        return (
          <StairVideo
            key={i} srcPath={src} mode={mode} visible={visible} hint={hint}
            onEnded={() => setWall(`land:${i}`)}
            onReverseDone={() => setWall(i === 0 ? 'remnant' : `land:${i - 1}`)}
          />
        );
      })}
    </React.Fragment>
  );
}

// ── RIGHT-DOORWAY HALL CHAIN ─────────────────────────────────────────────────
//    Reached by turning RIGHT from the fireplace wall (a plain doorway) and
//    pressing ▲. Works exactly like the stair-spiral chain: a reversible chain
//    of full-screen clips, each ENDING on a landing. DATA-DRIVEN — append a clip
//    to HALL_SRCS to add a landing. States are <play|land|rev>:<i> (i = clip idx).
//      play:i → clip i forward      (→ land:i)
//      land:i → landing i (held end frame): ▲ play:i+1 · ▶ room (later) · ▼ rev:i
//      rev:i  → clip i reverse       (→ land:i-1, or back out the doorway for i=0)
const HALL_SRCS = [
  'assets/pad-hall-1.mp4',
  'assets/pad-hall-2.mp4',
  'assets/pad-hall-3.mp4',
  'assets/pad-hall-4.mp4',
];
const HALL_COUNT = HALL_SRCS.length;

// Each hall landing's ▶ right-turn room — a fireplace-style cube whose back wall
// plays this looping video. Indexed by landing (clip) number.
const HALL_ROOMS = [
  'assets/room-bdrm.mp4',    // landing 1
  'assets/room-stone.mp4',   // landing 2
  'assets/room-day.mp4',     // landing 3
  'assets/room-wave.mp4',    // landing 4
];

// ── WAVE PORTAL — a ONE-WAY sequence reached by stepping ▲ forward into the
//    wave (landing 4's room). Clips auto-advance, then hold on the last frame.
//    No way back for now (a different route via the other library clips comes
//    later). `reverse:true` plays that clip backwards.
const WAVE_PORTAL = [
  { src: 'assets/lib-portal-reverse-loop.mp4', reverse: true  },  // starts, plays in reverse
  { src: 'assets/lib-skull-3.mp4',             reverse: false },
  { src: 'assets/lib-skull-4.mp4',             reverse: false },  // holds on its end frame
];
// After the riddle is solved (chandelier + skull both touched → explosion) the
// portal opens onward through these two clips. (The "different route".)
const WAVE_HALL = [
  'assets/lib-portal-hall-1.mp4',
  'assets/lib-portal-hall-2.mp4',
];
const PORTAL_LINE = 'mix Hu and Mana';   // ancient text that rises from the book

// ── BURST — a fast fire + sparks explosion on canvas. Calls onDone when spent. ──
function PortalBurst({ onDone }) {
  const cvRef = useRef(null);
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const W = cv.clientWidth, H = cv.clientHeight;
    cv.width = W * DPR; cv.height = H * DPR; ctx.scale(DPR, DPR);
    const cx = W / 2, cy = H * 0.5;
    const parts = [];
    const N = 220;
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 5 + Math.random() * 17;
      const spark = Math.random() < 0.4;
      parts.push({
        x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.8 - 2,
        life: 1, decay: 0.012 + Math.random() * 0.03,
        r: spark ? 1 + Math.random() * 1.8 : 4 + Math.random() * 12,
        spark,
        hue: spark ? 48 + Math.random() * 12 : 12 + Math.random() * 30,
      });
    }
    let raf, flash = 1, t0 = performance.now();
    const tick = (now) => {
      const dt = Math.min(2, (now - t0) / 16.67); t0 = now;
      ctx.clearRect(0, 0, W, H);
      // white flash
      if (flash > 0) {
        ctx.fillStyle = `rgba(255,243,214,${flash * 0.7})`;
        ctx.fillRect(0, 0, W, H); flash -= 0.08 * dt;
      }
      ctx.globalCompositeOperation = 'lighter';
      let alive = 0;
      for (const p of parts) {
        if (p.life <= 0) continue; alive++;
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.vy += 0.32 * dt; p.vx *= 0.985; p.vy *= 0.985;
        p.life -= p.decay * dt;
        const a = Math.max(0, p.life);
        if (p.spark) {
          ctx.strokeStyle = `hsla(${p.hue},100%,${70 + a * 25}%,${a})`;
          ctx.lineWidth = p.r;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 1.4, p.y - p.vy * 1.4); ctx.stroke();
        } else {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * a);
          g.addColorStop(0, `hsla(${p.hue},100%,72%,${a})`);
          g.addColorStop(0.5, `hsla(${p.hue - 8},100%,52%,${a * 0.6})`);
          g.addColorStop(1, `hsla(${p.hue - 14},100%,38%,0)`);
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * a, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.globalCompositeOperation = 'source-over';
      if (alive > 0 || flash > 0) raf = requestAnimationFrame(tick);
      else onDone && onDone();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={cvRef} className="portal-burst"/>;
}

// ── AETHER — slow drifting smoke + light crystals + light sparks, the living
//    backdrop the ancient letters rise out of. Runs the whole time. ──
function PortalAether() {
  const cvRef = useRef(null);
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    const resize = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); };
    resize();
    const rnd = (a, b) => a + Math.random() * (b - a);
    const smoke = Array.from({ length: 7 }, () => ({ x: rnd(0, 1), y: rnd(0, 1), r: rnd(0.28, 0.5), vx: rnd(-0.02, 0.02), vy: rnd(-0.012, -0.002), ph: rnd(0, 6.28) }));
    const crystals = Array.from({ length: 14 }, () => ({ x: rnd(0, 1), y: rnd(0, 1), s: rnd(3, 8), vx: rnd(-0.015, 0.015), vy: rnd(-0.02, 0.01), rot: rnd(0, 6.28), vr: rnd(-0.5, 0.5), ph: rnd(0, 6.28) }));
    const sparks = Array.from({ length: 40 }, () => ({ x: rnd(0, 1), y: rnd(0, 1), vx: rnd(-0.01, 0.01), vy: rnd(-0.03, -0.005), r: rnd(0.6, 1.8), ph: rnd(0, 6.28) }));
    let raf, t = 0;
    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);
      // smoke (soft grey, subtractive feel via low-alpha screen)
      ctx.globalCompositeOperation = 'source-over';
      for (const s of smoke) {
        s.x += s.vx * 0.016; s.y += s.vy * 0.016;
        if (s.y < -0.2) { s.y = 1.2; s.x = rnd(0, 1); }
        if (s.x < -0.2) s.x = 1.2; if (s.x > 1.2) s.x = -0.2;
        const cx = s.x * W, cy = s.y * H, r = s.r * Math.min(W, H);
        const a = 0.05 + 0.03 * Math.sin(t * 0.4 + s.ph);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(150,140,160,${a})`);
        g.addColorStop(1, 'rgba(120,110,130,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832); ctx.fill();
      }
      // crystals + sparks add light
      ctx.globalCompositeOperation = 'lighter';
      for (const c of crystals) {
        c.x += c.vx * 0.016; c.y += c.vy * 0.016; c.rot += c.vr * 0.016;
        if (c.y < -0.1) c.y = 1.1; if (c.y > 1.1) c.y = -0.1;
        if (c.x < -0.1) c.x = 1.1; if (c.x > 1.1) c.x = -0.1;
        const cx = c.x * W, cy = c.y * H, tw = 0.55 + 0.45 * Math.sin(t * 1.6 + c.ph);
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(c.rot);
        const s = c.s;
        const g = ctx.createLinearGradient(-s, -s, s, s);
        g.addColorStop(0, `rgba(190,225,255,${0.5 * tw})`);
        g.addColorStop(0.5, `rgba(255,245,220,${0.8 * tw})`);
        g.addColorStop(1, `rgba(170,210,255,${0.4 * tw})`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * 0.55, 0); ctx.lineTo(0, s); ctx.lineTo(-s * 0.55, 0); ctx.closePath(); ctx.fill();
        // glint cross
        ctx.strokeStyle = `rgba(255,255,255,${0.5 * tw})`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, -s * 1.6); ctx.lineTo(0, s * 1.6); ctx.moveTo(-s * 1.6, 0); ctx.lineTo(s * 1.6, 0); ctx.stroke();
        ctx.restore();
      }
      for (const p of sparks) {
        p.x += p.vx * 0.016; p.y += p.vy * 0.016;
        if (p.y < -0.05) { p.y = 1.05; p.x = rnd(0, 1); }
        if (p.x < -0.05) p.x = 1.05; if (p.x > 1.05) p.x = -0.05;
        const cx = p.x * W, cy = p.y * H, tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 2.2 + p.ph));
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, p.r * 4);
        g.addColorStop(0, `rgba(255,236,180,${0.9 * tw})`);
        g.addColorStop(1, 'rgba(255,200,120,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, p.r * 4, 0, 6.2832); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={cvRef} className="portal-aether"/>;
}

// ── ORB — a glowing sphere that wanders the hallway, never resting. Tap to pop. ──
function FloatingOrb({ onPop, popped }) {
  const ref = useRef(null);
  useEffect(() => {
    if (popped) return;
    const el = ref.current; if (!el) return;
    let raf, t0 = performance.now();
    const move = (now) => {
      const t = (now - t0) / 1000;
      // a slow non-repeating wander across the middle of the frame
      const x = 50 + 30 * Math.sin(t * 0.46) + 8 * Math.sin(t * 0.19 + 1.7);
      const y = 46 + 22 * Math.sin(t * 0.33 + 0.6) + 6 * Math.cos(t * 0.27);
      el.style.left = x + '%'; el.style.top = y + '%';
      raf = requestAnimationFrame(move);
    };
    raf = requestAnimationFrame(move);
    return () => cancelAnimationFrame(raf);
  }, [popped]);
  return (
    <button ref={ref} className={`portal-orb${popped ? ' popped' : ''}`} onClick={onPop} aria-label="orb">
      <span className="orb-core"/><span className="orb-glow"/>
    </button>
  );
}

// ── MIRROR — reflects the user (webcam). Tap to step through, back to the pad. ──
function MirrorView({ onEnter }) {
  const vidRef = useRef(null);
  const [stepping, setStepping] = useState(false);
  const [live, setLive] = useState(false);
  useEffect(() => {
    let stream = null, alive = true;
    const md = navigator.mediaDevices;
    if (md && md.getUserMedia) {
      md.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        .then(s => { if (!alive) { s.getTracks().forEach(t => t.stop()); return; } stream = s; if (vidRef.current) { vidRef.current.srcObject = s; vidRef.current.play().catch(() => {}); } setLive(true); })
        .catch(() => setLive(false));
    }
    return () => { alive = false; if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, []);
  const enter = () => { if (stepping) return; setStepping(true); setTimeout(() => onEnter && onEnter(), 720); };
  return (
    <div className={`portal-mirror${stepping ? ' stepping' : ''}`} onClick={enter}>
      <div className="pm-frame">
        <div className="pm-inner">
          <video ref={vidRef} className="pm-video" muted playsInline/>
          {!live && <div className="pm-silhouette"/>}
          <div className="pm-glass"/>
        </div>
      </div>
      <div className="pm-hint">step through</div>
    </div>
  );
}

function WavePortal({ forwardNonce, onPhase, onExit }) {
  // phases: 'seq' (3 entry clips) → 'final' (skull-4 held + riddle) → 'explode'
  //         → 'hall' (hall-1, hall-2) → 'hallEnd' (held; ▲ steps you in)
  //         → 'orb' (wandering orb; tap to pop) → 'mirror' (webcam; tap to exit)
  const [phase, setPhase]   = useState('seq');
  const [step, setStep]     = useState(0);
  const [shown, setShown]   = useState(0);
  const [touched, setTouched] = useState({ chandelier: false, skull: false });
  const [orbPopped, setOrbPopped] = useState(false);

  const SKULL4 = WAVE_PORTAL[WAVE_PORTAL.length - 1].src;
  const HALL2  = WAVE_HALL[WAVE_HALL.length - 1];

  // report phase up so the Pad can re-enable ▲ at the hallway end
  useEffect(() => { onPhase && onPhase(phase); }, [phase]);

  // reveal the ancient line one letter every ~2s
  useEffect(() => {
    if (phase !== 'final' || shown >= PORTAL_LINE.length) return;
    const t = setTimeout(() => setShown(s => s + 1), shown === 0 ? 900 : 2000);
    return () => clearTimeout(t);
  }, [phase, shown]);

  // both hidden points touched → explode
  useEffect(() => {
    if (phase === 'final' && touched.chandelier && touched.skull) {
      const t = setTimeout(() => setPhase('explode'), 220);
      return () => clearTimeout(t);
    }
  }, [phase, touched]);

  // Pad's ▲ at the hallway end → step forward into the hallway (reveal the orb)
  const seenNonce = useRef(forwardNonce);
  useEffect(() => {
    if (forwardNonce === seenNonce.current) return;
    seenNonce.current = forwardNonce;
    setPhase(p => (p === 'hallEnd' ? 'orb' : p));
  }, [forwardNonce]);

  const tp = (id) => () => setTouched(prev => ({ ...prev, [id]: true }));
  const popOrb = () => { if (orbPopped) return; setOrbPopped(true); setTimeout(() => setPhase('mirror'), 480); };

  const revealed = PORTAL_LINE.slice(0, shown);
  const showSkull4 = (phase === 'seq' && step === 2) || phase === 'final' || phase === 'explode';
  const showHall2  = (phase === 'hall' && step === WAVE_HALL.length - 1) || phase === 'hallEnd' || phase === 'orb' || phase === 'mirror';
  const steppedIn  = phase === 'orb' || phase === 'mirror';   // zoom the hallway in

  return (
    <React.Fragment>
      {/* entry clips 0 (reverse-loop) and 1 (skull-3) */}
      {phase === 'seq' && step < 2 && (
        <StairVideo key={'seq' + step} srcPath={WAVE_PORTAL[step].src}
          mode={WAVE_PORTAL[step].reverse ? 'reverse' : 'play'} visible={true} hint={null}
          onEnded={() => setStep(step + 1)} onReverseDone={() => setStep(step + 1)}/>
      )}

      {/* skull-4 — plays through on step 2, then HOLDS for the riddle */}
      {showSkull4 && (
        <StairVideo key="skull4" srcPath={SKULL4}
          mode={phase === 'seq' ? 'play' : 'hold'} visible={true} hint={null}
          onEnded={() => setPhase('final')}/>
      )}

      {/* riddle overlay: aether backdrop + ancient text + hidden touch points + burst */}
      {(phase === 'final' || phase === 'explode') && (
        <div className="portal-scene">
          {phase === 'final' && <PortalAether/>}
          <div className="portal-glyphs">
            {revealed.split('').map((ch, i) => (
              <span key={i} className="pg-char">{ch === ' ' ? '\u00a0' : ch}</span>
            ))}
          </div>
          {phase === 'final' && (
            <React.Fragment>
              <button className="portal-touch pt-chandelier" onClick={tp('chandelier')} aria-label="chandelier"/>
              <button className="portal-touch pt-skull" onClick={tp('skull')} aria-label="skull"/>
            </React.Fragment>
          )}
          {phase === 'explode' && (
            <PortalBurst onDone={() => { setStep(0); setPhase('hall'); }}/>
          )}
        </div>
      )}

      {/* onward route — hall-1 then hall-2 */}
      {phase === 'hall' && step === 0 && (
        <StairVideo key="hall0" srcPath={WAVE_HALL[0]} mode="play" visible={true} hint={null}
          onEnded={() => setStep(1)}/>
      )}
      {showHall2 && (
        <StairVideo key="hall2" srcPath={HALL2}
          mode={phase === 'hall' ? 'play' : 'hold'} visible={true} hint={null}
          extraClass={steppedIn ? 'stepped-in' : null}
          onEnded={() => setPhase('hallEnd')}/>
      )}

      {/* the orb / mirror live in the stepped-in hallway */}
      {(phase === 'orb' || phase === 'mirror') && (
        <div className="portal-scene">
          {phase === 'orb' && <FloatingOrb onPop={popOrb} popped={orbPopped}/>}
          {phase === 'mirror' && <MirrorView onEnter={onExit}/>}
        </div>
      )}
    </React.Fragment>
  );
}

// ── HALL VIDEO STACK — all clips mounted so each keeps its own playhead. ──
function HallVideoStack({ hall, setHall, setView }) {
  const s = parseStair(hall);   // same play/land/rev grammar as the spiral
  return (
    <React.Fragment>
      {HALL_SRCS.map((src, i) => {
        let mode = 'hold', visible = false;
        if (s && s.idx === i) {
          if (s.kind === 'play') { mode = 'play';    visible = true; }
          if (s.kind === 'land') { mode = 'hold';    visible = true; }
          if (s.kind === 'rev')  { mode = 'reverse'; visible = true; }
        }
        return (
          <StairVideo
            key={i} srcPath={src} mode={mode} visible={visible} hint={null}
            onEnded={() => setHall(`land:${i}`)}
            onReverseDone={() => { if (i === 0) { setView('rightwall'); setHall(null); } else { setHall(`land:${i - 1}`); } }}
          />
        );
      })}
    </React.Fragment>
  );
}

// ── LEFT WALL SCENE — the wall you face after turning left. A painting hangs
//    on a solid stone wall (no crack visible). Tapping the painting jiggles it,
//    then a seam of light "unzips" from the top down, widening and shifting
//    colour until it bursts — an explosion that clouds the whole screen and
//    hands off to the spiral video. After the video runs in reverse the wall
//    is left standing open (no crack), with embers + smoke still drifting. ──
function LeftWallScene({ wall, jiggle, onPaintingTap }) {
  // Shared jagged midline (x%,y%) so both door clip-paths meet exactly.
  const seam = '54% 0%, 46% 12%, 53% 25%, 45% 38%, 52% 50%, 44% 62%, 51% 75%, 45% 88%, 53% 100%';
  const leftClip  = `polygon(0% 0%, ${seam}, 0% 100%)`;
  const rightClip = `polygon(100% 0%, ${seam}, 100% 100%)`;
  const open      = wall === 'ready' || parseStair(wall) !== null;   // doors stay parted while in the spiral
  const unzipping = wall === 'unzip';
  const remnant   = wall === 'remnant';
  const embers    = wall === 'unzip' || remnant;

  return (
    <div className="leftwall">
      {/* Same room cube as the front pad — identical dimensions, just turned */}
      <div className="surface left"/>
      <div className="surface right"/>
      <div className="surface floor"/>
      <div className="floor-seam"/>

      {/* Warm spill onto the floor once the wall stands open / smoulders */}
      <div className={`lw-floor-pool${open || remnant ? ' lit' : ''}`}/>

      {/* The framed wall — "further away" */}
      <div className="lw-stage">
        {/* Passage glimpsed behind the wall once it stands open */}
        <div className="lw-behind"><StoneStaircase/></div>

        {/* Two stone wall panels (the "door") — solid until they part */}
        <div className={`lw-door lw-left${open ? ' open' : ''}`} style={{ clipPath: leftClip, WebkitClipPath: leftClip }}/>
        <div className={`lw-door lw-right${open ? ' open' : ''}`} style={{ clipPath: rightClip, WebkitClipPath: rightClip }}/>

        {/* The unzipping crack of light — only while unzipping */}
        {unzipping && (
          <div className="lw-unzip">
            <div className="lw-unzip-core"/>
            <div className="lw-unzip-burst"/>
          </div>
        )}

        {/* Remnant scar — the molten crack still glowing after the blast */}
        {remnant && <div className="lw-scar"/>}

        {/* Painting hangs on the wall (stays put when the wall opens) */}
        <div
          className={`lw-painting${jiggle ? ' jiggling' : ''}`}
          onClick={(e) => { e.stopPropagation(); if (wall === 'closed') onPaintingTap(); }}
        >
          <img src={window.__resources?.paintingTrim || 'assets/painting.jpg'} alt=""/>
          <div className="lw-frame"/>
        </div>

        {/* Embers + smoke — burst during the unzip, then linger (looping) in the remnant */}
        <CrackFX active={embers} loop={remnant}/>
      </div>

      {/* Full-screen colour explosion that clouds the screen as the crack bursts */}
      {unzipping && <div className="lw-explode"/>}
    </div>
  );
}

// ── YIN-YANG — parametric. `invert` swaps the two lobes (its colour-mirror).
//      invert=false → top lobe LIGHT (dark dot)   · bottom lobe DARK (light dot)
//      invert=true  → top lobe DARK  (light dot)   · bottom lobe LIGHT (dark dot)
//    A contrasting ring outlines the whole circle so the symbol reads even when
//    one lobe matches the door behind it. ──
function YinYang({ light = '#f4efe6', dark = '#0b0a0c', ring = 'rgba(150,150,150,0.55)', invert = false }) {
  const base   = invert ? dark  : light;   // background circle (the upper lobe)
  const comma  = invert ? light : dark;    // the S-comma (right + lower lobe)
  const dotTop = invert ? light : dark;    // eye in the upper lobe
  const dotBot = invert ? dark  : light;   // eye in the lower lobe
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: 'block' }}>
      <circle cx="50" cy="50" r="48" fill={base} stroke={ring} strokeWidth="1.4"/>
      <path d="M50,2 A48,48 0 0,1 50,98 A24,24 0 0,1 50,50 A24,24 0 0,0 50,2 Z" fill={comma}/>
      <circle cx="50" cy="26" r="8.6" fill={dotTop}/>
      <circle cx="50" cy="74" r="8.6" fill={dotBot}/>
    </svg>
  );
}

// ── DIMENSION ROOM — reached by going FORWARD (▲) from the final landing. Same
//    cube geometry & perspective as the front pad, but spacious and empty: the
//    back wall (where the fireplace used to be) holds three doors. Inert for now.
//      · Black door — yin-yang (white lobe / black dot)
//      · White door — its colour-mirror (black lobe / white dot)
//      · Gray  door — both, stacked vertically, circles tangent so the
//                     S-curves meet and flow continuously. ──
function DimensionRoom({ onDoorTap }) {
  const doors = [
    { id: 'black', face: '#0a0a0c', frame: '#241d12', ring: 'rgba(216,192,140,0.6)' },
    { id: 'white', face: '#efe9dc', frame: '#b9ab8f', ring: 'rgba(36,32,28,0.5)'   },
    { id: 'gray',  face: '#8d8a86', frame: '#48443d', ring: 'rgba(18,18,20,0.5)'   },
  ];
  return (
    <div className="dimroom">
      <div className="surface left"/>
      <div className="surface right"/>
      <div className="surface floor"/>
      <div className="floor-seam"/>
      <div className="dim-back">
        <div className="dim-doors">
          {doors.map(d => (
            <button
              key={d.id}
              className={`dim-door dd-${d.id}`}
              style={{ background: d.face, boxShadow: `0 0 0 5px ${d.frame}, inset 0 0 38px rgba(0,0,0,0.4), 0 22px 46px rgba(0,0,0,0.6)` }}
              onClick={() => onDoorTap && onDoorTap(d.id)}
            >
              {d.id === 'gray' ? (
                <div className="dd-stack">
                  <div className="dd-yy"><YinYang ring={d.ring} invert={false}/></div>
                  <div className="dd-yy"><YinYang ring={d.ring} invert={true}/></div>
                </div>
              ) : (
                <div className="dd-single"><YinYang ring={d.ring} invert={d.id === 'white'}/></div>
              )}
              <span className="dd-knob"/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SIDE ROOM — placeholder for a landing's ▶ room (not yet furnished). Same
//    cube; backing out (▼) returns to the landing you entered from. ──
function SideRoom() {
  return (
    <div className="sideroom">
      <div className="surface left"/>
      <div className="surface right"/>
      <div className="surface floor"/>
      <div className="floor-seam"/>
      <div className="side-back">
        <div className="side-note">a room · not yet furnished</div>
      </div>
    </div>
  );
}

// ── HALL ROOM — a landing's ▶ right-turn room. Same fireplace-room cube
//    (left/right walls + floor), but the BACK (view) wall is a looping video.
//    Backing out (▼) returns to the landing you entered from. ──
function HallRoom({ srcPath, step }) {
  const vRef = useRef(null);
  const [srcUrl, setSrcUrl] = useState(null);
  const [entered, setEntered] = useState(false);   // false on mount → animates the approach to the threshold
  useEffect(() => {
    let url = null, alive = true;
    fetch(srcPath).then(r => r.blob()).then(b => { if (!alive) return; url = URL.createObjectURL(b); setSrcUrl(url); }).catch(() => {});
    return () => { alive = false; if (url) URL.revokeObjectURL(url); };
  }, [srcPath]);
  useEffect(() => {
    const v = vRef.current; if (!v || !srcUrl) return;
    v.loop = true; v.muted = true; v.play().catch(() => {});
  }, [srcUrl]);
  useEffect(() => { const r = requestAnimationFrame(() => setEntered(true)); return () => cancelAnimationFrame(r); }, []);
  // hr-approach (far, just appeared) → hr-threshold (at the doorway) → hr-inside (stepped in via ▲)
  const worldClass = !entered ? 'hr-approach' : (step >= 1 ? 'hr-inside' : 'hr-threshold');
  return (
    <div className="hallroom">
      <div className={`hr-world ${worldClass}`}>
        <div className="surface left"/>
        <div className="surface right"/>
        <div className="surface floor"/>
        <div className="floor-seam"/>
        <div className="hr-back">
          {srcUrl && <video ref={vRef} className="hr-video" src={srcUrl} muted playsInline autoPlay loop/>}
          <div className="hr-wash"/>
        </div>
      </div>
    </div>
  );
}

// ── HALLWAY — a corridor receding to a warm doorway (the kitchen beyond).
//    Drawn in perspective like the staircase, sits inside the arch. ──
function Hallway() {
  const W = 1000, H = 900;
  const nearL = 40, nearR = 960, nearT = 10, nearB = H;
  const farL = 415, farR = 585, farT = 360, farB = 600;   // far doorway rect
  return (
    <svg className="hall-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="hl-lwall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0a0805"/>
          <stop offset="100%" stopColor="#241a0d"/>
        </linearGradient>
        <linearGradient id="hl-rwall" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#080604"/>
          <stop offset="100%" stopColor="#1e1509"/>
        </linearGradient>
        <linearGradient id="hl-floor" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#0c0805"/>
          <stop offset="100%" stopColor="#2a1c0c"/>
        </linearGradient>
        <radialGradient id="hl-door" cx="50%" cy="58%" r="62%">
          <stop offset="0%" stopColor="rgba(255,210,130,0.95)"/>
          <stop offset="38%" stopColor="rgba(240,150,60,0.7)"/>
          <stop offset="100%" stopColor="rgba(120,50,16,0)"/>
        </radialGradient>
        <radialGradient id="hl-torch" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,196,80,0.55)"/>
          <stop offset="100%" stopColor="rgba(255,120,30,0)"/>
        </radialGradient>
        <radialGradient id="hl-vig" cx="50%" cy="52%" r="72%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.84)"/>
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill="#050403"/>

      {/* ceiling */}
      <polygon points={`${nearL},${nearT} ${nearR},${nearT} ${farR},${farT} ${farL},${farT}`} fill="#0a0705"/>
      {/* side walls */}
      <polygon points={`${nearL},${nearT} ${farL},${farT} ${farL},${farB} ${nearL},${nearB}`} fill="url(#hl-lwall)"/>
      <polygon points={`${nearR},${nearT} ${farR},${farT} ${farR},${farB} ${nearR},${nearB}`} fill="url(#hl-rwall)"/>
      {/* floor */}
      <polygon points={`${nearL},${nearB} ${nearR},${nearB} ${farR},${farB} ${farL},${farB}`} fill="url(#hl-floor)"/>

      {/* receding floor planks */}
      {Array.from({ length: 6 }).map((_, i) => {
        const k = (i + 1) / 7;
        const y = nearB + (farB - nearB) * Math.pow(k, 1.5);
        const lxp = nearL + (farL - nearL) * Math.pow(k, 1.5);
        const rxp = nearR + (farR - nearR) * Math.pow(k, 1.5);
        return <line key={'f' + i} x1={lxp} y1={y} x2={rxp} y2={y}
          stroke={`rgba(255,170,80,${0.05 + k * 0.18})`} strokeWidth="1.2"/>;
      })}
      {/* masonry courses on walls */}
      {Array.from({ length: 6 }).map((_, i) => {
        const y = 90 + i * 130;
        return <g key={'m' + i}>
          <line x1={nearL} y1={y} x2={farL} y2={farT + (farB - farT) * ((y - nearT) / (nearB - nearT))} stroke="rgba(70,50,24,0.22)" strokeWidth="1"/>
          <line x1={nearR} y1={y} x2={farR} y2={farT + (farB - farT) * ((y - nearT) / (nearB - nearT))} stroke="rgba(60,42,20,0.18)" strokeWidth="1"/>
        </g>;
      })}

      {/* warm doorway to the kitchen at the end of the hall */}
      <ellipse cx={(farL + farR) / 2} cy={(farT + farB) / 2 + 30} rx="180" ry="200" fill="url(#hl-door)"/>
      <rect x={farL} y={farT} width={farR - farL} height={farB - farT} rx="6"
        fill="rgba(255,180,90,0.16)" stroke="rgba(60,40,18,0.8)" strokeWidth="6"/>
      <rect x={farL + 10} y={farT + 10} width={farR - farL - 20} height={farB - farT - 20}
        fill="url(#hl-door)" opacity="0.7">
        <animate attributeName="opacity" values="0.55;0.8;0.6;0.8;0.55" dur="5s" repeatCount="indefinite"/>
      </rect>

      {/* wall sconce, left */}
      <g transform="translate(210,360)">
        <ellipse cx="0" cy="-16" rx="48" ry="64" fill="url(#hl-torch)"/>
        <rect x="-2.5" y="0" width="5" height="20" rx="2" fill="#241405"/>
        <ellipse cx="0" cy="-12" rx="8" ry="15" fill="rgba(255,150,40,0.6)"/>
        <ellipse cx="0" cy="-18" rx="3.5" ry="9" fill="rgba(255,230,150,0.95)">
          <animate attributeName="ry" values="9;11;8;9" dur="0.5s" repeatCount="indefinite"/>
        </ellipse>
      </g>

      <rect width={W} height={H} fill="url(#hl-vig)" style={{ pointerEvents: 'none' }}/>
    </svg>
  );
}

// ── BRICK HALLWAY — a long brick corridor reached by going forward from the
//    spiral video. Recedes deep to a far point where a small light pulses,
//    cycling the seven chakra colours (CSS: .bh-light). ──
function BrickHallway() {
  const W = 1000, H = 900;
  const nL = 0, nR = 1000, nT = -40, nB = H + 40;
  const fL = 452, fR = 548, fT = 352, fB = 470;   // small far opening → long hall
  const lerp = (a, b, k) => a + (b - a) * k;
  return (
    <div className="brickhall">
      <svg className="brickhall-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bh-lwall" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0a0706"/>
            <stop offset="100%" stopColor="#3a2018"/>
          </linearGradient>
          <linearGradient id="bh-rwall" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#080605"/>
            <stop offset="100%" stopColor="#341c14"/>
          </linearGradient>
          <linearGradient id="bh-ceil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#060403"/>
            <stop offset="100%" stopColor="#241410"/>
          </linearGradient>
          <linearGradient id="bh-floor" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#0c0806"/>
            <stop offset="100%" stopColor="#2c1a12"/>
          </linearGradient>
          <radialGradient id="bh-vig" cx="50%" cy="44%" r="70%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)"/>
            <stop offset="62%" stopColor="rgba(0,0,0,0.2)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0.9)"/>
          </radialGradient>
        </defs>

        <rect width={W} height={H} fill="#050302"/>
        {/* surfaces */}
        <polygon points={`${nL},${nT} ${nR},${nT} ${fR},${fT} ${fL},${fT}`} fill="url(#bh-ceil)"/>
        <polygon points={`${nL},${nT} ${fL},${fT} ${fL},${fB} ${nL},${nB}`} fill="url(#bh-lwall)"/>
        <polygon points={`${nR},${nT} ${fR},${fT} ${fR},${fB} ${nR},${nB}`} fill="url(#bh-rwall)"/>
        <polygon points={`${nL},${nB} ${nR},${nB} ${fR},${fB} ${fL},${fB}`} fill="url(#bh-floor)"/>
        {/* far wall behind the light */}
        <rect x={fL} y={fT} width={fR - fL} height={fB - fT} fill="#0a0706"/>

        {/* brick courses receding on both walls (perspective via pow) */}
        {Array.from({ length: 13 }).map((_, i) => {
          const k = Math.pow((i + 1) / 14, 1.7);
          const yT = lerp(nT, fT, k), yB = lerp(nB, fB, k);
          const xl = lerp(nL, fL, k), xr = lerp(nR, fR, k);
          return (
            <g key={'c' + i}>
              <line x1={xl} y1={lerp(yT, yB, 0.32)} x2={fL} y2={lerp(fT, fB, 0.32)} stroke="rgba(20,12,8,0.5)" strokeWidth={lerp(3, 0.5, k)}/>
              <line x1={xl} y1={lerp(yT, yB, 0.62)} x2={fL} y2={lerp(fT, fB, 0.62)} stroke="rgba(20,12,8,0.5)" strokeWidth={lerp(3, 0.5, k)}/>
              <line x1={xr} y1={lerp(yT, yB, 0.32)} x2={fR} y2={lerp(fT, fB, 0.32)} stroke="rgba(16,10,6,0.5)" strokeWidth={lerp(3, 0.5, k)}/>
              <line x1={xr} y1={lerp(yT, yB, 0.62)} x2={fR} y2={lerp(fT, fB, 0.62)} stroke="rgba(16,10,6,0.5)" strokeWidth={lerp(3, 0.5, k)}/>
            </g>
          );
        })}
        {/* vertical brick seams marching toward the vanishing point */}
        {Array.from({ length: 9 }).map((_, i) => {
          const k = Math.pow((i + 1) / 10, 1.7);
          const xl = lerp(nL, fL, k), xr = lerp(nR, fR, k);
          const yT = lerp(nT, fT, k), yB = lerp(nB, fB, k);
          return (
            <g key={'v' + i}>
              <line x1={xl} y1={yT} x2={xl} y2={yB} stroke="rgba(18,11,7,0.4)" strokeWidth="1"/>
              <line x1={xr} y1={yT} x2={xr} y2={yB} stroke="rgba(14,9,5,0.4)" strokeWidth="1"/>
            </g>
          );
        })}
        {/* floor seams receding */}
        {Array.from({ length: 9 }).map((_, i) => {
          const k = Math.pow((i + 1) / 10, 1.7);
          const y = lerp(nB, fB, k);
          const xl = lerp(nL, fL, k), xr = lerp(nR, fR, k);
          return <line key={'fl' + i} x1={xl} y1={y} x2={xr} y2={y} stroke="rgba(255,160,90,0.05)" strokeWidth="1"/>;
        })}

        {/* soft wash of the pulsing light bleeding onto the far walls */}
        <ellipse cx={(fL + fR) / 2} cy={(fT + fB) / 2} rx="150" ry="150" fill="rgba(255,255,255,0.05)"/>

        <rect width={W} height={H} fill="url(#bh-vig)" style={{ pointerEvents: 'none' }}/>
      </svg>

      {/* the small pulsing chakra light at the end of the hall */}
      <div className="bh-light-halo"/>
      <div className="bh-light"/>
      <div className="lw-vhint">▼ back</div>
    </div>
  );
}


function RightWallScene() {
  return (
    <div className="rightwall">
      {/* Same room cube as the front pad */}
      <div className="surface left"/>
      <div className="surface right"/>
      <div className="surface floor"/>
      <div className="floor-seam"/>

      {/* warm spill from the hallway onto the floor */}
      <div className="rw-floor-pool"/>

      {/* Back-wall frame holding the arched hallway — "further away" */}
      <div className="rw-stage">
        <div className="rw-arch-frame"/>
        <div className="rw-arch"><Hallway/></div>
        <div className="rw-keystone"/>
      </div>
    </div>
  );
}

// ── KITCHEN SCENE — the room beyond the hallway, same cube perspective.
//    Interactive: opening fridge (food pickup), walk-in pantry, and a
//    sink with running water for rinsing crystals. ──
function KitchenScene() {
  const KM = window.PadMemory;
  const [fridgeOpen, setFridgeOpen] = useState(false);
  const [pantryOpen, setPantryOpen] = useState(false);
  const [waterOn,    setWaterOn]    = useState(false);
  const [crystal,    setCrystal]    = useState(() => KM ? KM.get('kitchen.crystal', 'dusty') : 'dusty'); // dusty | clean | gone
  const [shake,      setShake]      = useState(false);
  const [foods, setFoods] = useState(() => ({
    apple: true, cheese: true, milk: true, grapes: true, bread: true, fish: true,
    ...(KM ? KM.get('kitchen.foods', {}) : {})
  }));
  const [pantryItems, setPantryItems] = useState(() => ({
    flour: true, wine: true, onion: true, jam: true, pepper: true, loaf: true,
    ...(KM ? KM.get('kitchen.pantry', {}) : {})
  }));

  // Persist kitchen consumables so taken items stay taken across visits/sessions.
  useEffect(() => { if (KM) { KM.state.kitchen.foods   = foods;       KM.save(); } }, [foods]);
  useEffect(() => { if (KM) { KM.state.kitchen.pantry  = pantryItems; KM.save(); } }, [pantryItems]);
  useEffect(() => { if (KM) { KM.state.kitchen.crystal = crystal;     KM.save(); } }, [crystal]);

  const pick = (id, name, icon, type) =>
    window.dispatchEvent(new CustomEvent('pad:inv-add', { detail: { id, name, icon, type } }));

  const takeFood = (key, name, icon) => {
    if (!foods[key]) return;
    setFoods(f => ({ ...f, [key]: false }));
    pick('food-' + key, name, icon, 'food');
  };
  const takePantry = (key, name, icon) => {
    if (!pantryItems[key]) return;
    setPantryItems(p => ({ ...p, [key]: false }));
    pick('pantry-' + key, name, icon, 'food');
  };

  const tapCrystal = () => {
    if (crystal === 'gone') return;
    if (!waterOn) { setShake(true); setTimeout(() => setShake(false), 420); return; }
    if (crystal === 'dusty') {
      setCrystal('clean');
      pick('crystal-clean', 'Cleansed Crystal', '◈', 'crystal');
      setTimeout(() => setCrystal('gone'), 1100);
    }
  };

  const Food = ({ k, name, icon }) =>
    <button className={`kit-food${foods[k] ? '' : ' gone'}`} onClick={() => takeFood(k, name, icon)} aria-label={name}>{icon}</button>;
  const PItem = ({ k, name, icon }) =>
    <button className={`pantry-item${pantryItems[k] ? '' : ' gone'}`} onClick={() => takePantry(k, name, icon)} aria-label={name}>{icon}</button>;

  const caption =
    crystal === 'clean' || crystal === 'gone' ? '— the crystal is cleansed —' :
    waterOn ? '— rinse the crystal under the water —' :
    '— the kitchen —';

  return (
    <div className="kitchen">
      {/* Same room cube */}
      <div className="surface left"/>
      <div className="surface right"/>
      <div className="surface floor"/>
      <div className="floor-seam"/>

      {/* Back wall: hood + cooking niche */}
      <div className="kit-back">
        <div className="kit-hood"/>
        <div className="kit-niche">
          <div className="kit-niche-glow"/>
          <div className="kit-pot"/>
        </div>
      </div>

      {/* Walk-in pantry door (left) */}
      <div className="kit-pantry" onClick={() => setPantryOpen(true)}>
        <div className="kit-pantry-label">walk-in pantry</div>
        <div className="kit-pantry-door"><span className="kit-pantry-knob"/></div>
      </div>

      {/* Refrigerator (right) */}
      <div className={`kit-fridge${fridgeOpen ? ' open' : ''}`} onClick={() => setFridgeOpen(o => !o)}>
        <div className="kit-fridge-label">{fridgeOpen ? 'take what you need' : 'refrigerator'}</div>
        <div className="kit-fridge-body">
          <div className="kit-fridge-interior" onClick={e => e.stopPropagation()}>
            <div className="kit-fridge-shelf"><Food k="apple" name="Apple" icon="🍎"/><Food k="cheese" name="Cheese" icon="🧀"/></div>
            <div className="kit-fridge-shelf"><Food k="milk" name="Milk" icon="🥛"/><Food k="grapes" name="Grapes" icon="🍇"/></div>
            <div className="kit-fridge-shelf"><Food k="bread" name="Butter" icon="🧈"/><Food k="fish" name="Fish" icon="🐟"/></div>
          </div>
          <div className="kit-fridge-leaf l"><span className="kit-fridge-handle"/></div>
          <div className="kit-fridge-leaf r"><span className="kit-fridge-handle"/></div>
        </div>
      </div>

      {/* Counter with sink + crystal */}
      <div className="kit-counter">
        <div className="kit-props">
          <div className="kit-sink" onClick={() => setWaterOn(w => !w)}>
            <div className="kit-faucet"/>
            <div className="kit-sink-basin"/>
          </div>
          <div className={`kit-water${waterOn ? ' on' : ''}`}/>
          <div className="kit-splash"/>
          <div className={`kit-crystal ${crystal}${shake ? ' shake' : ''}`} onClick={tapCrystal} aria-label="crystal">
            <svg viewBox="0 0 40 52">
              <polygon points="20,2 33,16 26,50 14,50 7,16" fill="#8fe6f5" stroke="#3a8fb8" strokeWidth="1.2"/>
              <polygon points="20,2 26,50 20,50" fill="#c8f4ff" opacity="0.6"/>
              <polygon points="20,2 14,50 20,50" fill="#5fb6d8" opacity="0.5"/>
              <polygon points="7,16 14,50 20,2" fill="#aef0ff" opacity="0.35"/>
            </svg>
          </div>
        </div>
        <div className="kit-counter-top"/>
        <div className="kit-counter-front">
          <div className="kit-drawer"/>
          <div className="kit-drawer"/>
          <div className="kit-drawer"/>
        </div>
      </div>

      {/* Pendant lamp + warm pool */}
      <div className="kit-pendant">
        <div className="kit-pendant-cord"/>
        <div className="kit-pendant-shade"/>
      </div>
      <div className="kit-pendant-glow"/>

      <div className="kit-caption">{caption}</div>

      {/* Walk-in pantry interior */}
      {pantryOpen && (
        <div className="pantry-overlay">
          <div className="pantry-glow"/>
          <div className="pantry-title">The Pantry</div>
          <div className="pantry-back">
            <div className="pantry-shelf"><PItem k="flour" name="Flour" icon="🌾"/><PItem k="wine" name="Wine" icon="🍷"/></div>
            <div className="pantry-shelf"><PItem k="onion" name="Onions" icon="🧅"/><PItem k="jam" name="Honey" icon="🍯"/></div>
            <div className="pantry-shelf"><PItem k="pepper" name="Peppers" icon="🌶️"/><PItem k="loaf" name="Loaf" icon="🥖"/></div>
          </div>
          <div className="pantry-floor"/>
          <button className="pantry-back-btn" onClick={() => setPantryOpen(false)}>‹ back to kitchen</button>
        </div>
      )}
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
  const [lanternTaps, setLanternTaps] = useState(() => window.PadMemory ? window.PadMemory.get('world.lanternTaps', 0) : 0);
  const lanternTapsRef = useRef(window.PadMemory ? window.PadMemory.get('world.lanternTaps', 0) : 0);
  const [bubble,      setBubble]      = useState(null);   // current lantern line
  const [dpadOn,      setDpadOn]      = useState(() => window.PadMemory ? !!window.PadMemory.get('world.dpadRevealed', false) : false);  // sticky once revealed
  const [view,        setView]        = useState('front');// 'front' | 'leftwall' | 'game'
  const [wall,        setWall]        = useState('closed');// 'closed' | 'cracking' | 'open'
  const [hall,        setHall]        = useState(null);   // right-doorway hall chain: null | play:i | land:i | rev:i
  const [hallRoom,    setHallRoom]    = useState(null);   // open hall-landing ▶ room: null | landing index
  const [roomStep,    setRoomStep]    = useState(0);      // depth inside a hall room: 0 = threshold, 1 = stepped in
  const [portalPhase, setPortalPhase] = useState('seq');  // WavePortal's reported phase (so ▲ can re-enable at the hallway end)
  const [portalFwd,   setPortalFwd]   = useState(0);      // nonce: ▲ pressed in the portal
  const [paintingJiggle, setPaintingJiggle] = useState(false);
  const bubbleTimer = useRef(null);

  // Broadcast the Pad's current view so the phone can step aside in the dungeon.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('pad:view', { detail: view }));
  }, [view]);

  // Persist lantern / d-pad progress to user memory.
  useEffect(() => {
    if (window.PadMemory) {
      window.PadMemory.state.world.lanternTaps  = lanternTaps;
      window.PadMemory.state.world.dpadRevealed = dpadOn;
      window.PadMemory.save();
    }
  }, [lanternTaps, dpadOn]);

  const handleLanternTap = () => {
    if (dpadOn) return;
    const n = Math.min(3, lanternTapsRef.current + 1);
    lanternTapsRef.current = n;
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
      setWall('unzip');                          // crack unzips + explosion (~2.4s)
      setTimeout(() => setWall('ready'), 2400);  // hand off to the (static) video
    }, 760);
  };

  // ── Relative 4-wall rotation. The four walls form a ring and the
  //    d-pad is ALWAYS relative to where you face: left/right turn to
  //    the side walls, down turns around to the wall behind you, up
  //    steps through the wall ahead when it has a passage. No 5th wall.
  //    Ring (clockwise): main → hallway → kitchen (behind) → cracked wall.
  const RING = ['front', 'rightwall', 'kitchen', 'leftwall'];
  const i = RING.indexOf(view);
  const nav = i === -1
    ? { up: null, down: null, left: null, right: null }
    : {
        left:  RING[(i + 3) % 4],   // turn left  (anti-clockwise)
        right: RING[(i + 1) % 4],   // turn right (clockwise)
        down:  RING[(i + 2) % 4],   // turn around (wall behind)
        // up = "step forward / back out". From the kitchen it returns to the
        // Front Pad. The left-wall's forward/back is driven by the crack
        // sequence below, so up is left null here for that wall.
        up:    view === 'kitchen' ? 'front' : null,
      };

  // The left wall hijacks the d-pad for the crack → video chain → rooms.
  let avail;
  if (view === 'game') {
    avail = { left: false, right: false, up: false, down: false }; // GR has its own controls
  } else if (view === 'hallway' || view === 'sideroom' || view === 'dimension') {
    avail = { left: false, right: false, up: false, down: true };       // ▼ back to the landing you entered from
  } else if (view === 'hallroom') {
    // ▲ steps deeper; in the WAVE room (landing 4) a further ▲ enters the portal. ▼ backs out.
    const wavePortalNext = hallRoom === 3 && roomStep >= 1;
    avail = { left: false, right: false, up: roomStep < 1 || wavePortalNext, down: true };
  } else if (view === 'portal') {
    // one-way portal; the only control is ▲ to step into the hallway once hall-2 holds
    avail = { left: false, right: false, up: portalPhase === 'hallEnd', down: false };
  } else if (view === 'stonehall') {
    // right-doorway hall chain — mirrors the spiral. At a landing: ▲ forward,
    // ▶ right room, ▼ back. In transit (play/rev) → no controls.
    const s = parseStair(hall);
    if (s && s.kind === 'land') {
      avail = { left: false, right: true, up: s.idx < HALL_COUNT - 1, down: true };
    } else {
      avail = { left: false, right: false, up: false, down: false };
    }
  } else if (view === 'rightwall') {
    avail = { left: !!nav.left, right: !!nav.right, down: !!nav.down, up: true }; // ▲ forward → into the stone hall
  } else if (view === 'leftwall') {
    const s = parseStair(wall);
    if (wall === 'closed' || wall === 'remnant') {
      // free to turn away; from the smouldering remnant, ▲ re-enters the spiral
      avail = { left: !!nav.left, right: !!nav.right, down: !!nav.down, up: wall === 'remnant' };
    } else if (wall === 'ready') {
      avail = { left: false, right: false, down: false, up: true };       // ▲ enter / play
    } else if (s && s.kind === 'land') {
      avail = { left: false, right: true, down: true, up: true };         // ▲ forward · ▶ room · ▼ back
    } else {
      avail = { left: false, right: false, down: false, up: false };      // jiggle/unzip/playing/reversing
    }
  } else {
    avail = { left: !!nav.left, right: !!nav.right, up: !!nav.up, down: !!nav.down };
  }

  const handleMove = (dir) => {
    if (view === 'game') return; // handled inside the game room
    // Every room reached from a landing backs out (▼) to that same landing —
    // `wall` is preserved across the view change, so we just return to leftwall.
    if (view === 'hallway' || view === 'sideroom' || view === 'dimension') {
      if (dir === 'down') setView('leftwall');
      return;
    }
    // The wave portal — mostly self-driven. The only Pad control is ▲ to step
    // forward into the hallway once hall-2 is holding at its end.
    if (view === 'portal') {
      if (dir === 'up' && portalPhase === 'hallEnd') setPortalFwd(n => n + 1);
      return;
    }
    // A hall-landing ▶ room — ▲ takes an extra step deeper in; ▼ steps back out,
    // then (from the threshold) returns to the landing you entered from.
    if (view === 'hallroom') {
      if (dir === 'up') {
        if (roomStep < 1) { setRoomStep(roomStep + 1); return; }     // threshold → stepped in
        if (hallRoom === 3) { setView('portal'); return; }            // wave room → ▲ into the portal (one-way)
        return;
      }
      if (dir === 'down') {
        if (roomStep > 0) { setRoomStep(roomStep - 1); return; }
        setView('stonehall'); setHallRoom(null); setRoomStep(0);
      }
      return;
    }
    // Right-doorway hall chain — mirrors the spiral exactly.
    if (view === 'stonehall') {
      const s = parseStair(hall);
      if (s && s.kind === 'land') {
        const i = s.idx;
        if (dir === 'up' && i < HALL_COUNT - 1) { setHall(`play:${i + 1}`); return; } // forward → next clip
        if (dir === 'right') { setHallRoom(i); setRoomStep(0); setView('hallroom'); return; } // ▶ this landing's room (at the threshold)
        if (dir === 'down') { setHall(`rev:${i}`); return; }                          // back → reverse to prev landing
      }
      return;
    }
    // Right-wall doorway — a plain doorway that does nothing on its own; ▲ forward
    // walks into the hall chain. Other turns follow the room ring.
    if (view === 'rightwall') {
      if (dir === 'up') { setView('stonehall'); setHall('play:0'); return; }
      const dest = nav[dir]; if (dest) setView(dest);
      return;
    }
    if (view === 'leftwall') {
      const s = parseStair(wall);
      if (wall === 'ready' && dir === 'up')    { setWall('play:0'); return; }   // enter → play clip 0
      if (wall === 'remnant' && dir === 'up')  { setWall('play:0'); return; }   // re-enter the spiral
      if (s && s.kind === 'land') {
        const i = s.idx;
        if (dir === 'up') {
          if (i < STAIR_COUNT - 1) setWall(`play:${i + 1}`);   // forward → next clip → next landing
          else                     setView('dimension');       // final landing → the Dimension Room
          return;
        }
        if (dir === 'right') {                                  // ▶ this landing's side room (different per landing)
          if (i === 0)      setView('game');                    //   landing 1 → the dungeon
          else if (i === 1) setView('hallway');                 //   landing 2 → the chakra hall
          else              setView('sideroom');                //   landing 3 → placeholder room
          return;
        }
        if (dir === 'down') { setWall(`rev:${i}`); return; }    // ▼ back → reverse this clip to the previous landing
        return;
      }
      if (wall === 'closed' || wall === 'remnant') {
        const dest = nav[dir]; if (dest) setView(dest); return;
      }
      return; // jiggle / unzip / playing / reversing — ignore turns
    }
    const dest = nav[dir];
    if (dest) setView(dest);
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
  const [keyCollected, setKeyCollected] = useState(() => window.PadMemory ? !!window.PadMemory.get('world.keyCollected', false) : false);
  useEffect(() => {
    const onFL = (e) => setFlOn(!!e.detail.active);
    window.addEventListener('pad:flashlight', onFL);
    return () => window.removeEventListener('pad:flashlight', onFL);
  }, []);

  const collectKey = () => {
    if (keyCollected) return;
    setKeyCollected(true);
    if (window.PadMemory) window.PadMemory.set('world.keyCollected', true);
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

      {/* Faint hint that there is something to your left / right */}
      {dpadOn && view === 'front' && <div className="turn-hint-left"/>}
      {dpadOn && view === 'front' && <div className="turn-hint-right"/>}

      {/* TV — cattycorner in the LEFT corner */}
      <div className="tv">
        <div className="tv-bezel"/>
        <div className="tv-screen">
          <TVScene intensity={tw.tvIntensity} warmth={tw.warmth}/>
          <div className="tv-edge-mask"/>
        </div>
        <div className="tv-glow"/>
        <div className="tv-stand">
          <div className="tv-console"/>
          <div className="tv-legs">
            <div className="tv-leg l1"/>
            <div className="tv-leg l2"/>
          </div>
        </div>
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

      {/* Lantern speech — rendered at room level (NOT inside the 3D-transformed
          desk) so it is always fully on-screen on every device/orientation. */}
      <LanternBubble text={bubble}/>

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
          <window.TweakSection label="Memory">
            <window.TweakButton label="Reset saved memory" secondary onClick={() => {
              if (window.confirm('Reset all saved memory? This clears collected items, progress, and atmosphere (uploaded music is kept).')) {
                if (window.PadMemory) window.PadMemory.reset();
                window.location.reload();
              }
            }}/>
          </window.TweakSection>
        </window.TweaksPanel>
      )}

      {/* ── CHEVRON D-PAD — persistent in the Pad/wall; the game has its own pad ── */}
      <ChevronPad visible={dpadOn && view !== 'game'} avail={avail} onMove={handleMove}/>

      {/* ── LEFT WALL — painting, unzipping crack, explosion ── */}
      {view === 'leftwall' && (
        <LeftWallScene wall={wall} jiggle={paintingJiggle} onPaintingTap={handlePaintingTap}/>
      )}

      {/* ── LEFT-WALL STAIR-SPIRAL CHAIN — full-screen clips; static until ▲, each plays once ── */}
      {view === 'leftwall' && (wall === 'ready' || parseStair(wall) !== null) && (
        <LeftWallVideoStack wall={wall} setWall={setWall} setView={setView}/>
      )}

      {/* ── RIGHT WALL — arched hallway entrance to the kitchen; also the doorway into the stone hall (▲) ── */}
      {view === 'rightwall' && <RightWallScene/>}

      {/* ── HALL CHAIN — ▲ forward through the right doorway walks the 4-clip hall;
            landings between clips, ▼ back reverse-plays to the previous landing ── */}
      {view === 'stonehall' && (
        <HallVideoStack hall={hall} setHall={setHall} setView={setView}/>
      )}

      {/* ── HALL ROOM — a landing's ▶ right-turn room; video on the back wall.
            Enter at the threshold; ▲ steps deeper in, ▼ steps back / to the landing ── */}
      {view === 'hallroom' && hallRoom != null && (
        <HallRoom srcPath={HALL_ROOMS[hallRoom]} step={roomStep}/>
      )}

      {/* ── WAVE PORTAL — reverse-loop → skulls → riddle → explosion → hallway → orb → mirror ── */}
      {view === 'portal' && (
        <WavePortal
          forwardNonce={portalFwd}
          onPhase={setPortalPhase}
          onExit={() => {
            // step through the mirror → back to the fireplace view of the pad
            setView('front'); setPortalPhase('seq'); setPortalFwd(0);
            setHall(null); setHallRoom(null); setRoomStep(0);
          }}
        />
      )}

      {/* ── KITCHEN — the wall behind the fireplace view ── */}
      {view === 'kitchen' && <KitchenScene/>}

      {/* ── BRICK HALLWAY — landing 2's ▶ room (the chakra hall) ── */}
      {view === 'hallway' && <BrickHallway/>}

      {/* ── SIDE ROOM — landing 3's ▶ room (placeholder, not yet furnished) ── */}
      {view === 'sideroom' && <SideRoom/>}

      {/* ── DIMENSION ROOM — forward (▲) from the final landing; 3 yin-yang doors ── */}
      {view === 'dimension' && <DimensionRoom/>}

      {/* ── GAME ROOM — the full dungeon; "← surface" returns to the Pad ── */}
      {view === 'game' && GR && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 150, background: '#050302' }}>
          <GR onExit={() => setView('leftwall')}/>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Pad/>);
