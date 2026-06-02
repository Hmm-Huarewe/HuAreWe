/* pad-music.jsx — Persistent music engine + Sound Mixer + Mini Player
   Shared via window.__lrpMusicEngine. Load BEFORE pad-phone.jsx. */

const { useState: muUseState, useEffect: muUseEffect, useRef: muUseRef } = React;

// ── INDEXEDDB HELPERS (duplicated here so this file is self-contained) ──
function muOpenDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open('lantern-music-v1', 1);
    r.onupgradeneeded = e => e.target.result.createObjectStore('tracks', { keyPath: 'id' });
    r.onsuccess = e => res(e.target.result);
    r.onerror   = e => rej(e.target.error);
  });
}
function muDbGetAll(db) {
  return new Promise((res, rej) => {
    const r = db.transaction('tracks','readonly').objectStore('tracks').getAll();
    r.onsuccess = e => res(e.target.result);
    r.onerror   = e => rej(e.target.error);
  });
}
function muDbPut(db, item) {
  return new Promise((res, rej) => {
    const r = db.transaction('tracks','readwrite').objectStore('tracks').put(item);
    r.onsuccess = () => res();
    r.onerror   = e => rej(e.target.error);
  });
}
function muDbDelete(db, id) {
  return new Promise((res, rej) => {
    const r = db.transaction('tracks','readwrite').objectStore('tracks').delete(id);
    r.onsuccess = () => res();
    r.onerror   = e => rej(e.target.error);
  });
}

// ── SINGLETON ENGINE ─────────────────────────────────────────────────
function getMusicEngine() {
  if (window.__lrpMusicEngine) return window.__lrpMusicEngine;

  const audio = new Audio();
  audio.preload = 'auto';

  const eng = {
    audio,
    tracks:      [],
    curIdx:      null,
    playing:     false,
    loopMode:    'off',   // 'off'|'all'|'one'
    musicVol:    0.85,
    musicMuted:  false,
    wallVol:     0.65,
    wallMuted:   true,    // wall vids silent by default
    allMuted:    false,
    wallLabel:   'Forest Path',
    _db:         null,
    _listeners:  new Set(),
    _progress:   0,
    _duration:   0,

    subscribe(fn) { this._listeners.add(fn); return () => this._listeners.delete(fn); },
    notify()     { this._listeners.forEach(fn => fn()); },

    setTrack(idx) {
      if (idx === null || !this.tracks[idx]) return;
      this.curIdx = idx;
      this._progress = 0;
      audio.src = this.tracks[idx].blobUrl || '';
      audio.volume = this.allMuted || this.musicMuted ? 0 : this.musicVol;
      audio.play().then(() => { this.playing = true; this.notify(); }).catch(() => {});
      if (window.PadMemory) { window.PadMemory.state.music.lastTrackId = this.tracks[idx].id; window.PadMemory.save(); }
      this._mediaSession();
      this.notify();
    },

    toggle() {
      if (this.curIdx === null && this.tracks.length) { this.setTrack(0); return; }
      if (!audio.src) return;
      if (this.playing) { audio.pause(); this.playing = false; }
      else { audio.play(); this.playing = true; }
      this.notify();
    },

    prev() {
      if (!this.tracks.length) return;
      this.setTrack(this.curIdx === null ? 0 : (this.curIdx - 1 + this.tracks.length) % this.tracks.length);
    },

    next() {
      if (!this.tracks.length) return;
      this.setTrack(this.curIdx === null ? 0 : (this.curIdx + 1) % this.tracks.length);
    },

    cycleLoop() {
      this.loopMode = this.loopMode === 'off' ? 'all' : this.loopMode === 'all' ? 'one' : 'off';
      this.notify();
    },

    seek(pct) {
      if (!audio.duration) return;
      audio.currentTime = pct * audio.duration;
    },

    setMusicVol(v) {
      this.musicVol = v;
      audio.volume = this.allMuted || this.musicMuted ? 0 : v;
      if (window.PadMemory) { window.PadMemory.state.music.musicVol = v; window.PadMemory.save(); }
      this.notify();
    },
    setMusicMuted(m) {
      this.musicMuted = m;
      audio.volume = this.allMuted || m ? 0 : this.musicVol;
      this.notify();
    },
    setWallVol(v)   { this.wallVol = v;   if (window.PadMemory) { window.PadMemory.state.music.wallVol = v; window.PadMemory.save(); } this._wallEvent(); this.notify(); },
    setWallMuted(m) { this.wallMuted = m; this._wallEvent(); this.notify(); },

    toggleAllMuted() {
      this.allMuted = !this.allMuted;
      audio.volume = this.allMuted ? 0 : (this.musicMuted ? 0 : this.musicVol);
      this._wallEvent();
      this.notify();
    },

    setWallLabel(label) { this.wallLabel = label; this.notify(); },

    _wallEvent() {
      window.dispatchEvent(new CustomEvent('pad:wall-volume', {
        detail: { volume: this.wallVol, muted: this.allMuted || this.wallMuted }
      }));
    },

    _mediaSession() {
      if (!('mediaSession' in navigator) || this.curIdx === null) return;
      const t = this.tracks[this.curIdx];
      if (!t) return;
      navigator.mediaSession.metadata = new MediaMetadata({ title: t.name, artist: 'My Music' });
      ['previoustrack','nexttrack','play','pause'].forEach(a =>
        navigator.mediaSession.setActionHandler(a, () => {
          if (a === 'previoustrack') this.prev();
          else if (a === 'nexttrack') this.next();
          else if (a === 'play')  { audio.play(); this.playing = true; this.notify(); }
          else  { audio.pause(); this.playing = false; this.notify(); }
        })
      );
    },

    async addFiles(files) {
      if (!this._db) return;
      const added = [];
      for (const f of files) {
        const id = `${f.name}|${f.size}|${f.lastModified}`;
        if (this.tracks.find(t => t.id === id)) continue;
        const data = await f.arrayBuffer();
        const item = { id, name: f.name.replace(/\.[^.]+$/, ''), type: f.type, size: f.size, data };
        await muDbPut(this._db, item);
        item.blobUrl = URL.createObjectURL(new Blob([data], { type: f.type }));
        added.push(item);
      }
      if (added.length) { this.tracks = [...this.tracks, ...added]; this.notify(); }
    },

    async removeTrack(id) {
      if (this._db) await muDbDelete(this._db, id);
      const idx = this.tracks.findIndex(t => t.id === id);
      if (idx === -1) return;
      const t = this.tracks[idx];
      if (t.blobUrl) URL.revokeObjectURL(t.blobUrl);
      this.tracks = this.tracks.filter(tr => tr.id !== id);
      if (this.curIdx !== null) {
        if (idx === this.curIdx) {
          if (this.tracks.length) this.setTrack(Math.min(this.curIdx, this.tracks.length - 1));
          else { this.curIdx = null; this.playing = false; audio.pause(); }
        } else if (idx < this.curIdx) { this.curIdx--; }
      }
      this.notify();
    },
  };

  audio.addEventListener('ended', () => {
    if (eng.loopMode === 'one') { audio.play(); }
    else if (eng.loopMode === 'all' || (eng.curIdx !== null && eng.curIdx < eng.tracks.length - 1)) eng.next();
    else { eng.playing = false; eng.notify(); }
  });
  audio.addEventListener('timeupdate', () => {
    eng._progress = audio.currentTime;
    eng._duration = audio.duration || 0;
    eng.notify();
  });

  window.__lrpMusicEngine = eng;

  muOpenDB().then(db => {
    eng._db = db;
    return muDbGetAll(db);
  }).then(rows => {
    rows.forEach(t => { t.blobUrl = URL.createObjectURL(new Blob([t.data], { type: t.type })); });
    eng.tracks = rows;
    // Restore music prefs + last selected track (paused) from user memory.
    var mm = window.PadMemory && window.PadMemory.state.music;
    if (mm) {
      if (typeof mm.musicVol === 'number') eng.musicVol = mm.musicVol;
      if (typeof mm.wallVol  === 'number') eng.wallVol  = mm.wallVol;
      if (mm.lastTrackId) {
        var li = rows.findIndex(t => t.id === mm.lastTrackId);
        if (li >= 0) { eng.curIdx = li; audio.src = rows[li].blobUrl || ''; }
      }
    }
    eng.notify();
  }).catch(e => console.warn('music engine db', e));

  return eng;
}

// ── HOOK ─────────────────────────────────────────────────────────────
function useMusicEngine() {
  const [, tick] = muUseState(0);
  const eng = getMusicEngine();
  muUseEffect(() => eng.subscribe(() => tick(n => n + 1)), []);
  return eng;
}

// ── SOUND MIXER OVERLAY ───────────────────────────────────────────────
function SoundMixer({ onClose }) {
  const eng   = useMusicEngine();
  const cur   = eng.curIdx !== null ? eng.tracks[eng.curIdx] : null;
  const AMBER = '#c89040';
  const BLUE  = '#5a8ab8';

  const rangeStyle = (val, col) => ({
    WebkitAppearance:'none', appearance:'none',
    width:'100%', height: 4, borderRadius: 2,
    outline:'none', cursor:'pointer',
    background: `linear-gradient(to right,${col} 0%,${col} ${Math.round(val*100)}%,rgba(255,255,255,0.1) ${Math.round(val*100)}%,rgba(255,255,255,0.1) 100%)`,
  });

  const muteBtn = (muted, onClick, col) => (
    <button onClick={onClick} style={{
      padding:'2px 7px', borderRadius:5, fontSize:9, cursor:'pointer',
      fontFamily:'inherit', lineHeight:1.4,
      background: muted ? 'rgba(255,255,255,0.06)' : `${col}22`,
      border:`1px solid ${muted ? 'rgba(255,255,255,0.1)' : `${col}66`}`,
      color: muted ? '#3a3428' : col,
    }}>{muted ? '🔇' : '🔊'}</button>
  );

  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, zIndex:500,
      background:'rgba(0,0,0,0.35)',
      display:'flex', alignItems:'flex-end', justifyContent:'center',
      padding:'0 12px 100px',
      animation:'fadeIn 0.2s ease forwards',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'100%', maxWidth:340,
        background:'rgba(8,5,2,0.98)',
        border:'1px solid rgba(200,155,60,0.25)',
        borderRadius:16, padding:'14px 14px 12px',
        boxShadow:'0 -6px 30px rgba(0,0,0,0.7)',
        animation:'mixerRise 0.28s cubic-bezier(0.22,0.9,0.28,1.05) forwards',
      }}>
        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
          <div style={{fontSize:8,letterSpacing:'0.28em',textTransform:'uppercase',color:'#5a5248'}}>Sound Mixer</div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <button onClick={()=>eng.toggleAllMuted()} style={{
              padding:'3px 10px', borderRadius:6, fontSize:9, cursor:'pointer',
              fontFamily:'inherit',
              background: eng.allMuted ? 'rgba(200,144,64,0.15)' : 'rgba(255,255,255,0.04)',
              border:`1px solid ${eng.allMuted ? 'rgba(200,144,64,0.5)' : 'rgba(255,255,255,0.1)'}`,
              color: eng.allMuted ? AMBER : '#6a6050',
            }}>{eng.allMuted ? '🔇 All Muted' : '🔊 All Live'}</button>
            <button onClick={onClose} style={{background:'none',border:'none',color:'#5a5248',fontSize:20,cursor:'pointer',lineHeight:1,padding:'0 2px'}}>×</button>
          </div>
        </div>

        {/* Music channel */}
        <div style={{padding:'10px',background:'rgba(200,144,64,0.05)',borderRadius:10,border:'1px solid rgba(200,144,64,0.10)',marginBottom:8}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
            <div style={{fontSize:8,letterSpacing:'0.2em',textTransform:'uppercase',color:AMBER}}>♫ Music</div>
            {muteBtn(eng.musicMuted, ()=>eng.setMusicMuted(!eng.musicMuted), AMBER)}
          </div>
          <div style={{
            fontSize:10.5, color: cur ? '#f0c870' : '#3a3428',
            fontStyle: cur ? 'normal' : 'italic',
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            marginBottom:8, letterSpacing:'0.02em',
          }}>{cur ? cur.name : '— nothing playing —'}</div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
            <button onClick={()=>eng.prev()} style={{background:'none',border:'none',color:'#a89880',fontSize:14,cursor:'pointer',padding:0}}>⏮</button>
            <button onClick={()=>eng.toggle()} style={{background:'none',border:'none',color:AMBER,fontSize:18,cursor:'pointer',padding:0,opacity:cur?1:0.4}}>{eng.playing?'⏸':'▶'}</button>
            <button onClick={()=>eng.next()} style={{background:'none',border:'none',color:'#a89880',fontSize:14,cursor:'pointer',padding:0}}>⏭</button>
            <button onClick={()=>eng.cycleLoop()} style={{background:'none',border:'none',fontSize:12,cursor:'pointer',padding:0,
              color:eng.loopMode!=='off'?AMBER:'#3a3428'}}>
              {eng.loopMode==='one'?'①':eng.loopMode==='all'?'⟳':'↩'}
            </button>
          </div>
          <input type="range" min={0} max={1} step={0.01} value={eng.musicVol}
            onChange={e=>eng.setMusicVol(+e.target.value)}
            style={rangeStyle(eng.musicVol, AMBER)}/>
        </div>

        {/* Wall channel */}
        <div style={{padding:'10px',background:'rgba(90,138,184,0.05)',borderRadius:10,border:'1px solid rgba(90,138,184,0.10)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
            <div style={{fontSize:8,letterSpacing:'0.2em',textTransform:'uppercase',color:BLUE}}>⬡ Wall — {eng.wallLabel}</div>
            {muteBtn(eng.wallMuted, ()=>eng.setWallMuted(!eng.wallMuted), BLUE)}
          </div>
          <input type="range" min={0} max={1} step={0.01} value={eng.wallVol}
            onChange={e=>eng.setWallVol(+e.target.value)}
            style={rangeStyle(eng.wallVol, BLUE)}/>
        </div>

        <style>{`
          @keyframes mixerRise {
            from { transform:translateY(24px); opacity:0; }
            to   { transform:none; opacity:1; }
          }
        `}</style>
      </div>
    </div>
  );
}

// ── MINI PLAYER — persistent bar on phone bezel ───────────────────────
function MiniPlayer() {
  const eng = useMusicEngine();
  const cur = eng.curIdx !== null ? eng.tracks[eng.curIdx] : null;
  const [mixerOpen, setMixerOpen] = muUseState(false);
  const tapCount = muUseRef(0);
  const tapTimer = muUseRef(null);
  const AMBER = '#c89040';

  const handleTap = () => {
    tapCount.current++;
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      if (tapCount.current >= 2) setMixerOpen(o => !o);
      else eng.toggleAllMuted();
      tapCount.current = 0;
    }, 280);
  };

  // Always show when phone is raised; hidden visually when lowered (bezel covered)
  return (
    <>
      <div onClick={handleTap} style={{
        position:'absolute',
        top: 8, right: 8,
        zIndex: 200,
        display:'flex', alignItems:'center', gap: 5,
        padding:'4px 8px 4px 6px',
        background: eng.allMuted
          ? 'rgba(30,20,10,0.88)'
          : eng.playing
            ? 'rgba(200,144,64,0.18)'
            : 'rgba(30,20,10,0.75)',
        border:`1px solid ${eng.allMuted ? 'rgba(255,255,255,0.08)' : 'rgba(200,144,64,0.32)'}`,
        borderRadius: 20,
        cursor:'pointer',
        backdropFilter:'blur(6px)',
        transition:'all 0.25s ease',
        maxWidth: 120,
        userSelect:'none',
      }}>
        <div style={{
          fontSize: 9, color: eng.allMuted ? '#3a3428' : AMBER,
          transition:'color 0.2s ease', flexShrink:0,
        }}>{eng.allMuted ? '🔇' : eng.playing ? '♫' : '♩'}</div>
        {cur && (
          <div style={{
            fontSize: 8, color: eng.allMuted ? '#3a3428' : '#c8a060',
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            letterSpacing:'0.04em', maxWidth: 75,
            transition:'color 0.2s ease',
          }}>{cur.name}</div>
        )}
        {!cur && (
          <div style={{fontSize:8,color:'#3a3428',letterSpacing:'0.08em'}}>tap</div>
        )}
      </div>

      {mixerOpen && <SoundMixer onClose={()=>setMixerOpen(false)}/>}
    </>
  );
}

// ── MY MUSIC APP (display only — engine is shared) ────────────────────
function MyMusicApp({ onBack }) {
  const eng  = useMusicEngine();
  const AMBER = '#c89040';
  const fmt = s => isNaN(s) ? '0:00' : `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
  const loopLabel = { off:'↩', all:'⟳', one:'①' };
  const cur = eng.curIdx !== null ? eng.tracks[eng.curIdx] : null;

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    eng.seek((e.clientX - rect.left) / rect.width);
  };

  const addFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) await eng.addFiles(files);
    e.target.value = '';
  };

  const CTRL = {
    width:32, height:32, borderRadius:9,
    background:'rgba(255,255,255,0.04)',
    border:'1px solid rgba(255,255,255,0.09)',
    color:'#a89880', fontSize:15, cursor:'pointer',
    fontFamily:'inherit', display:'flex',
    alignItems:'center', justifyContent:'center', lineHeight:1,
  };

  return (
    <div className="ph-app-view">
      <AppHeader title="My Music" onBack={onBack}/>

      {/* Now Playing */}
      <div style={{padding:'10px 14px 12px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{
          fontSize:11.5, letterSpacing:'0.02em',
          color: cur ? '#f0c870' : '#3a3428',
          fontStyle: cur ? 'normal' : 'italic',
          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
          marginBottom:8,
        }}>{cur ? cur.name : '— nothing playing —'}</div>

        {/* Progress bar */}
        <div onClick={seek} style={{height:3,borderRadius:2,background:'rgba(255,255,255,0.08)',cursor:'pointer',marginBottom:5}}>
          <div style={{
            height:'100%', borderRadius:2, background:AMBER,
            width: eng._duration ? `${(eng._progress/eng._duration)*100}%` : '0%',
            transition:'width 0.5s linear',
          }}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:8,color:'#5a5248',marginBottom:12}}>
          <span>{fmt(eng._progress)}</span><span>{fmt(eng._duration)}</span>
        </div>

        {/* iPod controls */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:14}}>
          <button onClick={()=>eng.prev()} style={CTRL}>⏮</button>
          <button onClick={()=>eng.toggle()} style={{...CTRL,width:40,height:40,fontSize:18,
            background:'rgba(200,144,64,0.18)',border:'1px solid rgba(200,144,64,0.45)',color:AMBER}}>
            {eng.playing?'⏸':'▶'}
          </button>
          <button onClick={()=>eng.next()} style={CTRL}>⏭</button>
          <button onClick={()=>eng.cycleLoop()} style={{...CTRL,
            color:eng.loopMode!=='off'?AMBER:'#3a3428',
            border:`1px solid ${eng.loopMode!=='off'?'rgba(200,144,64,0.4)':'rgba(255,255,255,0.06)'}`}}>
            {loopLabel[eng.loopMode]}
          </button>
        </div>
      </div>

      {/* Track list */}
      <div style={{flex:1,overflowY:'auto',padding:'6px 10px'}}>
        {eng.tracks.length === 0 && (
          <div style={{textAlign:'center',color:'#3a3428',fontSize:9,padding:20,
            letterSpacing:'0.18em',textTransform:'uppercase'}}>no tracks yet<br/>tap + Add Songs below</div>
        )}
        {eng.tracks.map((t,i) => {
          const active = i === eng.curIdx;
          return (
            <div key={t.id} onClick={()=>{ if(i===eng.curIdx) eng.toggle(); else eng.setTrack(i); }}
              style={{display:'flex',alignItems:'center',gap:10,
                padding:'9px 6px',borderRadius:8,cursor:'pointer',
                background:active?'rgba(200,144,64,0.09)':'transparent',
                borderBottom:'1px solid rgba(255,255,255,0.04)',
                transition:'background 0.15s ease'}}>
              <div style={{width:22,height:22,borderRadius:'50%',flexShrink:0,
                background:active?'rgba(200,144,64,0.22)':'rgba(255,255,255,0.04)',
                border:`1px solid ${active?'rgba(200,144,64,0.5)':'rgba(255,255,255,0.07)'}`,
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:9,color:active?AMBER:'#5a5248'}}>
                {active && eng.playing ? '♫' : i+1}
              </div>
              <div style={{flex:1,fontSize:11,color:active?'#f0c870':'#a89880',
                whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',
                letterSpacing:'0.02em'}}>{t.name}</div>
              <button onClick={e=>{e.stopPropagation();eng.removeTrack(t.id);}} style={{
                background:'none',border:'none',color:'#3a3428',
                fontSize:16,cursor:'pointer',padding:'0 2px',lineHeight:1,flexShrink:0}}>×</button>
            </div>
          );
        })}
      </div>

      {/* Add Songs */}
      <div style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
        <label style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,
          padding:'10px',borderRadius:10,cursor:'pointer',
          border:'1px dashed rgba(200,144,64,0.35)',
          background:'rgba(200,144,64,0.05)',
          fontSize:9,letterSpacing:'0.24em',textTransform:'uppercase',
          color:'rgba(200,144,64,0.75)'}}>
          + Add Songs
          <input type="file" accept="audio/*" multiple onChange={addFiles} style={{display:'none'}}/>
        </label>
      </div>
    </div>
  );
}

// Export to window so pad-phone.jsx can use them
Object.assign(window, { getMusicEngine, useMusicEngine, SoundMixer, MiniPlayer, MyMusicApp });
