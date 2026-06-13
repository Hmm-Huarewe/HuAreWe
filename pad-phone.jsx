/* pad-phone.jsx — The Observer's cellphone overlay.
   Navigation: Home → Button Layer → List/Content
   Screen state uses ':' separator: 'messages' | 'messages:notes' | etc.
*/

const { useState, useEffect, useRef, useCallback } = React;

const CHANNELS = [
  { id: 'lantern', name: 'Lantern Road',  hint: 'warm · hearth · home',
    filter: 'none', tint: 'rgba(0,0,0,0)', color: '#e8a830' },
  { id: 'static',  name: 'Static Field',  hint: 'the in-between',
    filter: 'grayscale(0.6) contrast(1.15) brightness(0.92)',
    tint: 'rgba(120,120,140,0.12)', color: '#9090a8' },
  { id: 'ember',   name: 'Ember Tongue',  hint: 'all fire, no mercy',
    filter: 'saturate(1.35) hue-rotate(-12deg) brightness(1.05)',
    tint: 'rgba(180,60,20,0.18)', color: '#e04020' },
  { id: 'cold',    name: 'Cold Signal',   hint: 'before the warmth came',
    filter: 'saturate(0.55) hue-rotate(180deg) brightness(0.78) contrast(1.2)',
    tint: 'rgba(60,90,140,0.22)', color: '#4a80c0' },
];

const INITIAL_MESSAGES = [
  { from: 'The Observer', time: 'now',   type: 'note',  body: 'You\u2019ve arrived. Lower the lantern. Raise the phone.' },
  { from: 'hu-mana',      time: '\u22125m', type: 'clue', body: 'The way through is you. Tap a wall when the light is on.' },
  { from: 'The Road',     time: '\u221218m', type: 'hint', body: 'There is a key on the desk. Take it. A door will follow.' },
  { from: 'The Observer', time: '\u221232m', type: 'note', body: 'The flame was never out. Only the glass needed cleaning.' },
  { from: 'hu-mana',      time: '\u22121h',  type: 'clue', body: 'Something is written on the back wall. You\u2019ll need light.' },
];

// ── APP ICON SVGs ─────────────────────────────────────────────────────
function IconFlashlight() {
  return (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none" aria-hidden="true">
      <path d="M12 10 L28 10 L23 21 L17 21 Z" fill="white" opacity="0.92"/>
      <rect x="15" y="21" width="10" height="11" rx="2.5" fill="rgba(0,0,0,0.32)"/>
      <rect x="16" y="21" width="8" height="9" rx="2" fill="white" opacity="0.55"/>
      <circle cx="20" cy="11" r="3.5" fill="white" opacity="0.75"/>
      <circle cx="20" cy="11" r="2" fill="rgba(255,240,120,0.6)"/>
      <line x1="20" y1="3" x2="20" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
      <line x1="9"  y1="6" x2="11" y2="8"  stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <line x1="31" y1="6" x2="29" y2="8"  stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}
function IconChannels() {
  return (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none" aria-hidden="true">
      <rect x="5" y="15" width="30" height="19" rx="3.5" fill="white" opacity="0.9"/>
      <rect x="9"  y="18" width="22" height="13" rx="1.5" fill="rgba(110,64,201,0.55)"/>
      <rect x="12" y="25" width="3" height="4"  rx="0.8" fill="white" opacity="0.7"/>
      <rect x="17" y="23" width="3" height="6"  rx="0.8" fill="white" opacity="0.7"/>
      <rect x="22" y="21" width="3" height="8"  rx="0.8" fill="white" opacity="0.7"/>
      <line x1="20" y1="15" x2="13" y2="5"  stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="20" y1="15" x2="27" y2="5"  stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}
function IconMessages() {
  return (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none" aria-hidden="true">
      <path d="M5 8 Q5 5 8 5 L32 5 Q35 5 35 8 L35 23 Q35 26 32 26 L23 26 L17 33 L17 26 L8 26 Q5 26 5 23 Z"
        fill="white" opacity="0.95"/>
      <rect x="10" y="12" width="20" height="2.5" rx="1.25" fill="rgba(36,138,61,0.55)"/>
      <rect x="10" y="17" width="14" height="2.5" rx="1.25" fill="rgba(36,138,61,0.38)"/>
    </svg>
  );
}
function IconMusic() {
  return (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none" aria-hidden="true">
      <path d="M17 28 L17 12 L33 9 L33 25" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9"/>
      <circle cx="13" cy="28" r="4.5" fill="white" opacity="0.9"/>
      <circle cx="29" cy="25" r="4.5" fill="white" opacity="0.75"/>
      <circle cx="13" cy="28" r="2" fill="rgba(180,60,220,0.55)"/>
      <circle cx="29" cy="25" r="2" fill="rgba(180,60,220,0.4)"/>
    </svg>
  );
}
function IconInventory() {
  return (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none" aria-hidden="true">
      <rect x="6" y="14" width="28" height="21" rx="4.5" fill="white" opacity="0.92"/>
      <path d="M14 14 L14 10 Q14 5 20 5 Q26 5 26 10 L26 14"
        stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9"/>
      <rect x="8" y="14" width="24" height="4" rx="1.5" fill="rgba(204,114,0,0.42)"/>
      <rect x="15" y="22" width="10" height="6" rx="2" fill="rgba(204,114,0,0.38)"/>
      <rect x="17" y="23.5" width="6" height="3" rx="1" fill="rgba(255,255,255,0.55)"/>
    </svg>
  );
}
function IconMyPad() {
  return (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none" aria-hidden="true">
      {/* fireplace arch */}
      <path d="M8 34 L8 20 Q8 10 20 10 Q32 10 32 20 L32 34" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
      <rect x="6" y="32" width="28" height="4" rx="1.5" fill="white" opacity="0.75"/>
      {/* flame */}
      <ellipse cx="20" cy="26" rx="4" ry="6" fill="rgba(255,180,60,0.85)"/>
      <ellipse cx="20" cy="25" rx="2.2" ry="4" fill="rgba(255,230,140,0.9)"/>
      <ellipse cx="20" cy="24" rx="1" ry="2.2" fill="white" opacity="0.8"/>
    </svg>
  );
}
function IconAvelion() {
  return (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none" aria-hidden="true">
      {/* lantern shape */}
      <path d="M14 4 Q20 1 26 4" stroke="rgba(255,210,140,0.8)" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      <ellipse cx="20" cy="6" rx="7" ry="2" fill="rgba(255,210,140,0.7)"/>
      <rect x="12" y="8" width="16" height="22" rx="1" fill="none" stroke="rgba(255,210,140,0.8)" strokeWidth="1.4"/>
      <rect x="13" y="9" width="14" height="20" rx="0.5" fill="rgba(10,7,2,0.85)"/>
      {/* inner flame glow */}
      <ellipse cx="20" cy="22" rx="4.5" ry="7" fill="rgba(255,180,60,0.35)"/>
      <ellipse cx="20" cy="20" rx="2.5" ry="5" fill="rgba(255,220,120,0.6)"/>
      <ellipse cx="20" cy="18.5" rx="1.2" ry="3" fill="white" opacity="0.65"/>
      {/* base */}
      <ellipse cx="20" cy="30.5" rx="7.5" ry="1.8" fill="rgba(255,210,140,0.65)"/>
      <rect x="12.5" y="30" width="15" height="6" rx="1.2" fill="rgba(20,12,5,0.9)" stroke="rgba(200,160,60,0.5)" strokeWidth="0.8"/>
      <ellipse cx="20" cy="36.5" rx="7.5" ry="1.7" fill="rgba(200,160,60,0.55)"/>
    </svg>
  );
}

// ── SHARED COMPONENTS ─────────────────────────────────────────────────
function CloseBtn({ onClose }) {
  return (
    <button className="ph-close-x" onClick={onClose} aria-label="Close">
      <svg viewBox="0 0 36 36" width="27" height="27">
        <circle cx="18" cy="18" r="17" fill="rgba(72,70,85,0.78)" stroke="rgba(255,255,255,0.10)" strokeWidth="1"/>
        <line x1="12.5" y1="12.5" x2="23.5" y2="23.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="23.5" y1="12.5" x2="12.5" y2="23.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

function AppHeader({ title, icon, grad, onBack }) {
  return (
    <div className="ph-header">
      {icon != null && (
        <div className="ph-header-icon" style={grad ? { background: grad } : undefined}>{icon}</div>
      )}
      <div className="ph-title">{title}</div>
      <CloseBtn onClose={onBack}/>
    </div>
  );
}

// A single nav button for the button layer
function NavButton({ icon, grad, label, sub, active, onClick, arrow = true }) {
  return (
    <button className={`ph-nav-btn ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="ph-nav-btn-icon" style={{ background: grad }}>{icon}</div>
      <div className="ph-nav-btn-text">
        <div className="ph-nav-btn-label">{label}</div>
        {sub && <div className="ph-nav-btn-sub">{sub}</div>}
      </div>
      {arrow && <div className="ph-nav-btn-arrow">›</div>}
    </button>
  );
}

// ── FLASHLIGHT APP ────────────────────────────────────────────────────
const FL_MODES = [
  { id: 'standard',  label: 'Standard',    sub: 'broad warm beam',       grad: 'linear-gradient(145deg,#FFE234,#FFA800)', icon: '🔦' },
  { id: 'uv',        label: 'UV Spectrum', sub: 'reveals hidden symbols', grad: 'linear-gradient(145deg,#9B3FFF,#5E10C0)', icon: '✦'  },
  { id: 'infrared',  label: 'Infrared',    sub: 'heat and motion',        grad: 'linear-gradient(145deg,#FF4500,#AA1500)', icon: '◎'  },
];

function FlashlightApp({ flashlight, flMode, onToggle, onMode, onBack }) {
  return (
    <div className="ph-app-view">
      <AppHeader title="Flashlight" icon={<IconFlashlight/>} grad="linear-gradient(145deg,#FFE234,#FFAA00)" onBack={onBack}/>
      {/* Big ON/OFF toggle */}
      <button className={`ph-fl-toggle ${flashlight ? 'on' : ''}`} onClick={onToggle}>
        <div className="ph-fl-toggle-orb">💡</div>
        <div className="ph-fl-toggle-label">{flashlight ? 'On' : 'Off'}</div>
      </button>
      {/* Mode buttons */}
      <div className="ph-nav-list">
        {FL_MODES.map(m => (
          <NavButton key={m.id}
            icon={m.icon} grad={m.grad} label={m.label} sub={m.sub}
            active={flMode === m.id} arrow={false}
            onClick={() => { onMode(m.id); if (!flashlight) onToggle(); }}
          />
        ))}
      </div>
    </div>
  );
}

// ── CHANNELS APP ──────────────────────────────────────────────────────
function ChannelsApp({ channel, setChannel, onBack }) {
  return (
    <div className="ph-app-view">
      <AppHeader title="Channels" onBack={onBack}/>
      <div className="ph-nav-list">
        {CHANNELS.map((c, i) => (
          <NavButton key={c.id}
            icon={i === 0 ? '🕯️' : i === 1 ? '📡' : i === 2 ? '🔥' : '❄️'}
            grad={`linear-gradient(145deg, ${c.color}CC, ${c.color}88)`}
            label={c.name} sub={c.hint}
            active={i === channel} arrow={false}
            onClick={() => setChannel(i)}
          />
        ))}
      </div>
    </div>
  );
}

// ── MESSAGES APP ──────────────────────────────────────────────────────
const MSG_CATEGORIES = [
  { id: 'notes',  label: 'Observer Notes',  sub: 'clues and observations', grad: 'linear-gradient(145deg,#34C759,#1A8A36)', icon: '📋', type: 'note'  },
  { id: 'clues',  label: 'Clues',           sub: 'fragments of truth',     grad: 'linear-gradient(145deg,#FF9F0A,#CC6A00)', icon: '🔍', type: 'clue'  },
  { id: 'hints',  label: 'Hints',           sub: 'the road forward',       grad: 'linear-gradient(145deg,#5AC8FA,#1A78C0)', icon: '✦',  type: 'hint'  },
];

function MessagesMenu({ messages, unread, onOpen, onBack }) {
  return (
    <div className="ph-app-view">
      <AppHeader title="Messages" icon={<IconMessages/>} grad="linear-gradient(145deg,#34C759,#1A8A36)" onBack={onBack}/>
      <div className="ph-nav-list">
        {MSG_CATEGORIES.map(c => {
          const count = messages.filter(m => m.type === c.type).length;
          return (
            <NavButton key={c.id}
              icon={c.icon} grad={c.grad} label={c.label} sub={c.sub}
              onClick={() => onOpen(c.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

function MessagesList({ messages, category, onBack }) {
  const cat = MSG_CATEGORIES.find(c => c.id === category);
  const filtered = messages.filter(m => cat ? m.type === cat.type : true);
  const title = cat ? cat.label : 'Messages';
  return (
    <div className="ph-app-view">
      <AppHeader title={title} icon={cat?.icon} grad={cat?.grad} onBack={onBack}/>
      <div className="msg-list">
        {filtered.length === 0 && (
          <div className="inv-empty-note">Nothing yet in this channel.</div>
        )}
        {filtered.map((m, i) => (
          <div key={i} className="msg-row">
            <div className="msg-head">
              <span className="msg-from">{m.from}</span>
              <span className="msg-time">{m.time}</span>
            </div>
            <div className="msg-body">{m.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── INVENTORY APP ─────────────────────────────────────────────────────
const INV_CATEGORIES = [
  { id: 'all',       label: 'All Items',     sub: 'everything collected',    grad: 'linear-gradient(145deg,#FF9500,#CC6A00)', icon: '🎒', type: null     },
  { id: 'keys',      label: 'Keys & Access', sub: 'doors and locks',         grad: 'linear-gradient(145deg,#E8C830,#B09010)', icon: '🗝️', type: 'key'    },
  { id: 'provisions',label: 'Provisions',    sub: 'food & drink',            grad: 'linear-gradient(145deg,#34C759,#1A8A36)', icon: '🍎', type: 'food'   },
  { id: 'crystals',  label: 'Crystals',      sub: 'raw and cleansed',        grad: 'linear-gradient(145deg,#7FE9F5,#2E8FD8)', icon: '◈',  type: 'crystal' },
  { id: 'symbols',   label: 'Symbols',       sub: 'discovered markings',     grad: 'linear-gradient(145deg,#9B59F5,#5E30D8)', icon: '✦',  type: 'symbol' },
  { id: 'fragments', label: 'Fragments',     sub: 'pieces of something larger', grad: 'linear-gradient(145deg,#34C759,#1A8A36)', icon: '◈',  type: 'fragment' },
];

function InventoryMenu({ inv, onOpen, onBack }) {
  return (
    <div className="ph-app-view">
      <AppHeader title="Inventory" icon={<IconInventory/>} grad="linear-gradient(145deg,#FF9500,#CC6A00)" onBack={onBack}/>
      <div className="ph-nav-list">
        {INV_CATEGORIES.map(c => {
          const count = c.type ? inv.filter(i => i.type === c.type).length : inv.length;
          return (
            <NavButton key={c.id}
              icon={c.icon} grad={c.grad} label={c.label}
              sub={count > 0 ? `${count} item${count !== 1 ? 's' : ''}` : c.sub}
              onClick={() => onOpen(c.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

function InventoryGrid({ inv, category, onBack }) {
  const cat = INV_CATEGORIES.find(c => c.id === category);
  const title = cat ? cat.label : 'Inventory';
  const filtered = cat?.type ? inv.filter(i => i.type === cat.type) : inv;
  const slots = Math.max(9, Math.ceil(filtered.length / 3) * 3);
  const padded = [...filtered, ...Array(Math.max(0, slots - filtered.length)).fill(null)];
  return (
    <div className="ph-app-view">
      <AppHeader title={title} icon={cat?.icon} grad={cat?.grad} onBack={onBack}/>
      <div className="inv-grid">
        {padded.map((it, i) => (
          <div key={i} className={`inv-slot ${it ? 'has' : ''}`}>
            {it ? (
              <>
                <div className="inv-icon">{it.icon || '◇'}</div>
                <div className="inv-name">{it.name}</div>
              </>
            ) : <div className="inv-empty">·</div>}
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="inv-empty-note">Nothing here yet.</div>
      )}
    </div>
  );
}

// ── HOME SCREEN ───────────────────────────────────────────────────────
function PhoneHome({ apps, onOpen }) {
  return (
    <div className="ph-home-screen">
      <div className="ph-wallpaper"/>
      <div className="ph-greeting" style={{ margin: '6px 0 10px' }}>
        <div className="ph-greeting-l1">hu · are · we</div>
      </div>
      <div className="ph-grid" style={{ gap: '12px 10px', padding: '4px 4px' }}>
        {apps.map(a => (
          <button key={a.id} className={`ph-app ${a.active ? 'app-active' : ''}`} onClick={() => onOpen(a)}>
            <div className="ph-app-icon" style={{ background: a.grad }}>
              {a.svg}
              {a.badge != null && <span className="ph-badge">{a.badge}</span>}
            </div>
            <div className="ph-app-label">{a.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── PORTALS ───────────────────────────────────────────────────────────
const PORTALS = [
  { id: 'forest-path',   name: 'Forest Path',   src: window.__resources?.tempWall    || 'Temp-wall.mp4' },
  { id: 'relaxing-room', name: 'Relaxing Room', src: window.__resources?.relaxingPad || 'uploads/Relaxing-pad.mp4' },
];

function PortalViewApp({ onBack }) {
  const [selected, setSelected] = useState(null);
  const [transmuting, setTransmuting] = useState(false);

  const handleSelect = (portal) => {
    setSelected(portal);
    setTransmuting(false);
    window.dispatchEvent(new CustomEvent('pad:portal-preview', { detail: { src: portal.src } }));
  };

  const handleTransmute = () => {
    if (!selected || transmuting) return;
    setTransmuting(true);
    window.dispatchEvent(new CustomEvent('pad:portal-transmute', { detail: { src: selected.src } }));
    // Update wall label in music engine
    const eng = window.getMusicEngine ? window.getMusicEngine() : null;
    if (eng) eng.setWallLabel(selected.name);
    setTimeout(() => setTransmuting(false), 4000);
  };

  return (
    <div className="ph-app-view">
      <AppHeader title="Portal View" icon="⬡" grad="linear-gradient(145deg,#4A7A9B,#1A3A5C)" onBack={onBack}/>
      <div className="ph-nav-list" style={{ gap: 10 }}>
        <div style={{ fontSize: 8, letterSpacing: '0.26em', textTransform: 'uppercase',
          color: '#5a5248', marginBottom: 2 }}>Select a View</div>

        {PORTALS.map(p => {
          const on = selected?.id === p.id;
          return (
            <button key={p.id} onClick={() => handleSelect(p)} style={{
              width: '100%', padding: '12px 14px',
              border: `1px solid ${on ? '#c89040' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 10,
              background: on ? 'rgba(200,144,64,0.12)' : 'rgba(255,255,255,0.025)',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 12,
              transition: 'all 0.2s ease', textAlign: 'left',
            }}>
              <div style={{
                width: 36, height: 26, borderRadius: 4,
                background: on ? 'rgba(200,144,64,0.35)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${on ? 'rgba(200,144,64,0.5)' : 'rgba(255,255,255,0.06)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg viewBox="0 0 18 12" width="18" height="12" fill="none">
                  <rect x="0.5" y="0.5" width="17" height="11" rx="1.5"
                    fill={on ? 'rgba(200,144,64,0.3)' : 'rgba(255,255,255,0.04)'}
                    stroke={on ? '#c89040' : 'rgba(255,255,255,0.12)'} strokeWidth="0.8"/>
                  {on && <rect x="2" y="2" width="14" height="8" rx="0.8" fill="rgba(200,144,64,0.25)"/>}
                </svg>
              </div>
              <div>
                <div style={{
                  fontSize: 11.5, letterSpacing: '0.04em',
                  color: on ? '#f0c870' : '#a89880', fontWeight: on ? '600' : '400',
                  transition: 'color 0.2s ease',
                }}>{p.name}</div>
                {on && <div style={{
                  fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(200,144,64,0.7)', marginTop: 2,
                }}>previewing in mantel</div>}
              </div>
              {on && <div style={{ marginLeft: 'auto', color: '#c89040', fontSize: 14 }}>◉</div>}
            </button>
          );
        })}

        {selected && (
          <button onClick={handleTransmute} disabled={transmuting} style={{
            width: '100%', marginTop: 6, padding: '13px',
            border: `1px solid ${transmuting ? 'rgba(255,120,30,0.5)' : 'rgba(255,160,40,0.6)'}`,
            borderRadius: 10,
            background: transmuting
              ? 'rgba(255,80,10,0.18)'
              : 'linear-gradient(135deg, rgba(200,100,20,0.22), rgba(240,160,40,0.15))',
            cursor: transmuting ? 'default' : 'pointer',
            fontFamily: 'inherit', fontSize: 11, letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: transmuting ? 'rgba(255,140,60,0.9)' : 'rgba(240,190,80,0.95)',
            transition: 'all 0.25s ease',
            animation: transmuting ? 'transmute-pulse 0.6s ease-in-out infinite alternate' : 'none',
          }}>
            {transmuting ? '◉ transmuting…' : '✦ Transmute'}
          </button>
        )}
        <style>{`
          @keyframes transmute-pulse {
            from { box-shadow: 0 0 8px rgba(255,100,20,0.3); }
            to   { box-shadow: 0 0 24px rgba(255,120,30,0.7), 0 0 48px rgba(255,80,10,0.25); }
          }
        `}</style>
      </div>
    </div>
  );
}

// ── CHANNELS CONTENT — Parables / Tools / Links ───────────────────────
const PARABLES_LIST = [
  { id: 'lantern-bonfire', title: 'The Lantern and the Bonfire', icon: '✸', grad: 'linear-gradient(145deg,#F0A23C,#A1530F)' },
  { id: 'rock-river',      title: 'The Rock and the River',      icon: '≋', grad: 'linear-gradient(145deg,#D9A23C,#8A5810)' },
  { id: 'garden-hose',     title: 'The Garden and the Hose',     icon: '❀', grad: 'linear-gradient(145deg,#E6BE52,#9C6A16)' },
];
const TOOLS_LIST = [
  { id: 'feel-back',      title: 'The Feel-Back Loop',           icon: '↻', grad: 'linear-gradient(145deg,#6A4FF0,#2E1AB8)' },
  { id: 'observer-triad', title: 'The Observer Triad',           icon: '△', grad: 'linear-gradient(145deg,#7B5AF2,#3A22C2)' },
  { id: '12-laws',        title: 'The 12 Laws of the Universe',  icon: '◎', grad: 'linear-gradient(145deg,#5A6AF0,#2A2AC0)' },
  { id: '5-absolutes',    title: 'The Five Absolutes',           icon: '✦', grad: 'linear-gradient(145deg,#8654F2,#4326C4)' },
  { id: 'higher-bliss',   title: 'Awakening Higher Bliss',       icon: '❂', grad: 'linear-gradient(145deg,#9A66F5,#5832D4)' },
  { id: 'parables',       title: 'Parables',                     icon: '❖', grad: 'linear-gradient(145deg,#A85AE8,#6A28C0)' },
];
const LINKS_LIST = [
  { title: 'Hu-Mana Model',    url: 'https://humanamodel.com/',  icon: '◇', grad: 'linear-gradient(145deg,#2FA06A,#176040)' },
  { title: 'Lantern of Light', url: 'https://payhip.com/b/rq3EH', icon: '✦', grad: 'linear-gradient(145deg,#2E9C99,#155E58)' },
];

function ContentPlaceholder({ accent = '#c89040', note }) {
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px 18px',
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
        fontSize: 13.5, lineHeight: 1.65, color: `${accent}77`,
        letterSpacing: '0.02em', textAlign: 'center',
      }}>{note}</div>
    </div>
  );
}

function ChannelsContentApp({ screen, setScreen, onBack }) {
  const parts = screen.split(':').slice(1); // e.g. ['parables','lantern-bonfire']

  // ── Portal View ──
  if (parts[0] === 'portal') {
    return <PortalViewApp onBack={() => setScreen('channels')}/>;
  }

  // ── Links ──
  if (parts[0] === 'links') {
    return (
      <div className="ph-app-view">
        <AppHeader title="Links" icon="↗" grad="linear-gradient(145deg,#2A8A5C,#1A5A38)" onBack={() => setScreen('channels')}/>
        <div className="ph-nav-list">
          {LINKS_LIST.map((l, i) => (
            <NavButton key={i}
              icon={l.icon} grad={l.grad}
              label={l.title} sub={l.url.replace('https://','')}
              arrow={false}
              onClick={() => window.open(l.url, '_blank')}/>
          ))}
        </div>
      </div>
    );
  }

  // ── Individual parable ──
  if (parts[0] === 'parables' && parts[1]) {
    const item = PARABLES_LIST.find(p => p.id === parts[1]);
    return (
      <div className="ph-app-view">
        <AppHeader title={item?.title || 'Parable'} icon={item?.icon || '◈'} grad={item?.grad || 'linear-gradient(145deg,#C8903C,#7A5014)'} onBack={() => setScreen('channels:parables')}/>
        <ContentPlaceholder accent="#c89040"
          note="This parable is being transcribed&#10;from the original flame."/>
      </div>
    );
  }

  // ── Parables list ──
  if (parts[0] === 'parables') {
    return (
      <div className="ph-app-view">
        <AppHeader title="Parables" icon="📜" grad="linear-gradient(145deg,#C8903C,#7A5014)" onBack={() => setScreen('channels')}/>
        <div className="ph-nav-list">
          {PARABLES_LIST.map(p => (
            <NavButton key={p.id}
              icon={p.icon} grad={p.grad}
              label={p.title}
              onClick={() => setScreen(`channels:parables:${p.id}`)}/>
          ))}
        </div>
      </div>
    );
  }

  // ── Individual tool ──
  if (parts[0] === 'tools' && parts[1]) {
    const item = TOOLS_LIST.find(t => t.id === parts[1]);
    return (
      <div className="ph-app-view">
        <AppHeader title={item?.title || 'Tool'} icon={item?.icon || '◉'} grad={item?.grad || 'linear-gradient(145deg,#5A3FE8,#2A1AB0)'} onBack={() => setScreen('channels:tools')}/>
        <ContentPlaceholder accent="#7060e8"
          note="This framework is still&#10;being mapped to the field."/>
      </div>
    );
  }

  // ── Tools list ──
  if (parts[0] === 'tools') {
    return (
      <div className="ph-app-view">
        <AppHeader title="Tools" icon="⚗️" grad="linear-gradient(145deg,#5A3FE8,#2A1AB0)" onBack={() => setScreen('channels')}/>
        <div className="ph-nav-list">
          {TOOLS_LIST.map(t => (
            <NavButton key={t.id}
              icon={t.icon} grad={t.grad}
              label={t.title}
              onClick={() => setScreen(`channels:tools:${t.id}`)}/>
          ))}
        </div>
      </div>
    );
  }

  // ── Main channels menu ──
  return (
    <div className="ph-app-view">
      <AppHeader title="Channels" icon={<IconChannels/>} grad="linear-gradient(145deg,#9B59F5,#5E30D8)" onBack={onBack}/>
      <div className="ph-nav-list">
        <NavButton icon="⬡" grad="linear-gradient(145deg,#4A7A9B,#1A3A5C)"
          label="Portal View" sub="change the wall screen"
          onClick={() => setScreen('channels:portal')}/>
        <NavButton icon="📜" grad="linear-gradient(145deg,#C8903C,#7A5014)"
          label="Parables" sub="3 teachings"
          onClick={() => setScreen('channels:parables')}/>
        <NavButton icon="⚗️" grad="linear-gradient(145deg,#5A3FE8,#2A1AB0)"
          label="Tools" sub="6 frameworks"
          onClick={() => setScreen('channels:tools')}/>
        <NavButton icon="↗" grad="linear-gradient(145deg,#2A8A5C,#1A5A38)"
          label="Links" sub="portals and paths"
          onClick={() => setScreen('channels:links')}/>
      </div>
    </div>
  );
}

// ── MY PAD + AVELION CONSTANTS ────────────────────────────────────────
const FIRE_LEVELS = [
  { label: 'Ember',   sub: 'a quiet warmth',      color: '#e07828' },
  { label: 'Gentle',  sub: 'steady and calm',     color: '#e8a030' },
  { label: 'Stoked',  sub: 'full hearth glow',    color: '#f0b840' },
  { label: 'Roaring', sub: 'ignites the wall',    color: '#ff5a14' },
];
const LIGHT_LEVELS = [
  { label: 'Dark',    color: '#c87828' },
  { label: 'Dim',     color: '#d09040' },
  { label: 'Ambient', color: '#f8d089' },
];
const AVELION_GREETINGS = [
  "Thou hast returned. What dost thou seek?",
  "The flame hath kept vigil in thine absence. Welcome.",
  "Welcome home, wanderer. The road led thee true.",
  "By hearth and wick, thou art remembered here.",
  "Long hath the lantern awaited thy return.",
  "Speak thy desire, and I shall attend.",
  "The road brought thee here. I am listening.",
  "Thou art not lost. Thou hast arrived at last.",
  "Rest, traveller. The fire knoweth thy name.",
  "What the road has given, this room shall hold.",
];

// Dot-pip row selector — shared by light and fire level controls
function LvlPips({ count, active, colors, labels, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 5 }}>
      {Array.from({ length: count }, (_, i) => {
        const on = active === i + 1;
        const col = colors[i] || '#888';
        return (
          <button key={i} onClick={() => onChange(i + 1)} style={{
            flex: 1, padding: '9px 3px 7px', border: `1px solid ${on ? col : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 10, background: on ? `${col}1c` : 'rgba(255,255,255,0.025)',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.22s ease',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: on ? col : '#2a2218',
              boxShadow: on ? `0 0 7px ${col}` : 'none',
              transition: 'all 0.22s ease',
            }}/>
            <div style={{
              fontSize: 7.5, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: on ? col : '#5a5248', lineHeight: 1.15, textAlign: 'center',
            }}>
              {labels[i]}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Light D-pad — minus/plus with segmented bar
function LightDPad({ level, max, onChange }) {
  const LEVEL_NAMES  = ['Very Dark', 'Dark', 'Ambient', 'Warm', 'Bright'];
  const LEVEL_COLORS = ['#3a2810', '#7a5020', '#c89040', '#e8b060', '#f8d090'];
  const col = LEVEL_COLORS[level - 1] || '#888';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => onChange(Math.max(1, level - 1))} style={{
          width: 30, height: 30, borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.04)',
          color: '#b8ad94', fontSize: 18, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'inherit', lineHeight: 1, flexShrink: 0,
        }}>−</button>
        <div style={{ flex: 1, display: 'flex', gap: 3 }}>
          {Array.from({ length: max }, (_, i) => (
            <div key={i} onClick={() => onChange(i + 1)} style={{
              flex: 1, height: 6, borderRadius: 3, cursor: 'pointer',
              background: i < level ? col : 'rgba(255,255,255,0.07)',
              boxShadow: i < level ? `0 0 6px ${col}88` : 'none',
              transition: 'all 0.25s ease',
            }}/>
          ))}
        </div>
        <button onClick={() => onChange(Math.min(max, level + 1))} style={{
          width: 30, height: 30, borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.04)',
          color: '#b8ad94', fontSize: 18, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'inherit', lineHeight: 1, flexShrink: 0,
        }}>+</button>
      </div>
      <div style={{ textAlign: 'center', fontSize: 8, letterSpacing: '0.22em',
        textTransform: 'uppercase', color: col, transition: 'color 0.25s ease' }}>
        {LEVEL_NAMES[level - 1]}
      </div>
    </div>
  );
}

function MyPadApp({ fireLevel, lightLevel, channel, invCount, onFire, onLight, onChannel, onInventory, onBack }) {
  return (
    <div className="ph-app-view">
      <AppHeader title="My Pad" icon={<IconMyPad/>} grad="linear-gradient(145deg,#C8782A,#7A4A14)" onBack={onBack}/>
      <div className="ph-nav-list" style={{ gap: 16 }}>

        {/* ── LIGHTS ── */}
        <div>
          <div style={{ fontSize: 8, letterSpacing: '0.26em', textTransform: 'uppercase',
            color: '#5a5248', marginBottom: 10 }}>☾ Lights</div>
          <LightDPad level={lightLevel} max={5} onChange={onLight}/>
        </div>

        {/* ── FIRE ── */}
        <div>
          <div style={{ fontSize: 8, letterSpacing: '0.26em', textTransform: 'uppercase',
            color: '#5a5248', marginBottom: 9 }}>◉ Fire</div>
          <LvlPips count={4} active={fireLevel}
            colors={FIRE_LEVELS.map(l => l.color)}
            labels={FIRE_LEVELS.map(l => l.label)}
            onChange={onFire}/>
          {fireLevel === 4 && (
            <div style={{
              marginTop: 7, padding: '4px 8px',
              background: 'rgba(255,70,10,0.10)', border: '1px solid rgba(255,80,20,0.35)',
              borderRadius: 6, fontSize: 8, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'rgba(255,100,40,0.9)', textAlign: 'center',
            }}>◉ wall ignition active</div>
          )}
        </div>

        {/* ── ATMOSPHERE (channels moved here) ── */}
        <div>
          <div style={{ fontSize: 8, letterSpacing: '0.26em', textTransform: 'uppercase',
            color: '#5a5248', marginBottom: 9 }}>✦ Atmosphere</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {CHANNELS.map((c, i) => {
              const on = channel === i;
              const icons = ['🕯️', '📡', '🔥', '❄️'];
              return (
                <button key={c.id} onClick={() => onChannel(i)} style={{
                  padding: '8px 6px', border: `1px solid ${on ? c.color : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 10, background: on ? `${c.color}1a` : 'rgba(255,255,255,0.025)',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                  <div style={{ fontSize: 15 }}>{icons[i]}</div>
                  <div style={{
                    fontSize: 7.5, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: on ? c.color : '#5a5248', lineHeight: 1.2, textAlign: 'center',
                  }}>{c.name.split(' ')[0]}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── INVENTORY ── */}
        <div>
          <div style={{ fontSize: 8, letterSpacing: '0.26em', textTransform: 'uppercase',
            color: '#5a5248', marginBottom: 9 }}>◇ Inventory</div>
          <button onClick={onInventory} style={{
            width: '100%', padding: '11px 14px',
            border: '1px solid rgba(255,150,0,0.22)',
            borderRadius: 10, background: 'rgba(255,150,0,0.06)',
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            transition: 'all 0.2s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <IconInventory/>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11.5, color: '#c8a060', letterSpacing: '0.04em' }}>My Inventory</div>
                {invCount > 0 && <div style={{ fontSize: 8, color: '#7a6040',
                  letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>
                  {invCount} item{invCount !== 1 ? 's' : ''}
                </div>}
              </div>
            </div>
            <div style={{ color: '#5a5248', fontSize: 14 }}>›</div>
          </button>
        </div>

      </div>
    </div>
  );
}
function AvelionApp({ onBack }) {
  const [history, setHistory] = useState([]);
  const [touched, setTouched] = useState(false);

  const invoke = () => {
    const g = AVELION_GREETINGS[Math.floor(Math.random() * AVELION_GREETINGS.length)];
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setHistory(prev => [{ text: g, time: ts }, ...prev]);
    setTouched(true);
  };

  return (
    <div className="ph-app-view">
      <AppHeader title="Avelion" icon={<IconAvelion/>} grad="linear-gradient(145deg,#F8D089,#C89038)" onBack={onBack}/>

      {/* Compact lantern tap */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '10px 16px 0',
      }}>
        <div onClick={invoke} style={{
          cursor: 'pointer',
          transform: touched ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.45s cubic-bezier(0.22, 0.9, 0.28, 1.05)',
          filter: touched
            ? 'drop-shadow(0 0 14px rgba(232,170,70,0.75))'
            : 'drop-shadow(0 0 8px rgba(232,170,70,0.35))',
        }}>
          <svg viewBox="0 0 40 62" width="46" height="70" fill="none">
            <path d="M13 5 Q20 -1 27 5" stroke="#c9a14c" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
            <ellipse cx="20" cy="9" rx="9.5" ry="2.4" fill="#c9a14c" opacity="0.85"/>
            <rect x="10.6" y="11" width="18.8" height="32" rx="0.5"
              fill="#0e0904" stroke="#c9a14c" strokeWidth="0.9"/>
            <ellipse cx="20" cy="29" rx="4.5" ry="7.5" fill={touched ? "rgba(255,180,60,0.6)" : "rgba(240,160,50,0.4)"}/>
            <ellipse cx="20" cy="27" rx="2.8" ry="5.5" fill={touched ? "rgba(255,235,150,0.85)" : "rgba(255,220,130,0.65)"}/>
            <ellipse cx="20" cy="25" rx="1.3" ry="3.2" fill="white" opacity="0.7"/>
            <rect x="10.6" y="42.6" width="18.8" height="1.4" fill="#c9a14c" opacity="0.8"/>
            <ellipse cx="20" cy="44.5" rx="10.5" ry="2.2" fill="#c9a14c" opacity="0.8"/>
            <rect x="10" y="44.5" width="20" height="8" rx="1.4"
              fill="#1e1408" stroke="#7e5e26" strokeWidth="0.55"/>
            <ellipse cx="20" cy="53" rx="10" ry="2.2" fill="#c9a14c" opacity="0.7"/>
          </svg>
        </div>
        {history.length === 0 && (
          <div style={{
            marginTop: 8, fontSize: 8, letterSpacing: '0.26em',
            textTransform: 'uppercase', color: '#3a3428',
          }}>touch the lantern</div>
        )}
      </div>

      {/* Past answers — scrollable list */}
      {history.length > 0 && (
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '10px 12px 14px', display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {history.map((h, i) => (
            <div key={i} style={{
              padding: '9px 11px',
              background: i === 0 ? 'rgba(200,155,60,0.09)' : 'rgba(255,255,255,0.025)',
              border: `1px solid ${i === 0 ? 'rgba(200,155,60,0.28)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 10,
              animation: i === 0 ? 'fadeIn 0.5s ease forwards' : 'none',
            }}>
              <div style={{
                fontSize: 8, letterSpacing: '0.16em', color: '#6a6050',
                textTransform: 'uppercase', marginBottom: 5,
              }}>{h.time}</div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic', fontSize: 13, lineHeight: 1.5,
                color: 'rgba(248,220,160,0.92)', letterSpacing: '0.01em',
              }}>"{h.text}"</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ── PHONE OVERLAY ─────────────────────────────────────────────────────
function PhoneOverlay() {
  const [raised, setRaised]   = useState(false);
  const PM = window.PadMemory;
  const [padView, setPadView] = useState('front'); // mirrors the Pad's current view; hide the phone inside the dungeon
  const [screen, setScreen]   = useState(null); // navigation state
  const [flashlight, setFL]   = useState(false);
  const [flMode, setFlMode]   = useState('standard');
  const [channel, setChannel] = useState(() => PM ? PM.get('world.channel', 0) : 0);
  const [messages, setMsgs]   = useState(INITIAL_MESSAGES);
  const [inv, setInv]         = useState(() => PM ? (PM.get('inventory', []) || []) : []);
  const [unread, setUnread]   = useState(1);
  const [beam, setBeam]       = useState({ x: -9999, y: -9999 });
  const [fireLevel, setFireLvl]   = useState(() => PM ? PM.get('world.fireLevel', 1) : 1);
  const [lightLevel, setLightLvl] = useState(() => PM ? PM.get('world.lightLevel', 3) : 3);

  // ── Persist durable state to user memory whenever it changes ──
  useEffect(() => { if (PM) { PM.state.inventory = inv;          PM.save(); } }, [inv]);
  useEffect(() => { if (PM) { PM.state.world.channel = channel;  PM.save(); } }, [channel]);
  useEffect(() => { if (PM) { PM.state.world.fireLevel = fireLevel;   PM.save(); } }, [fireLevel]);
  useEffect(() => { if (PM) { PM.state.world.lightLevel = lightLevel; PM.save(); } }, [lightLevel]);

  // ── On mount, replay restored atmosphere so the Pad matches saved memory ──
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('pad:fire-level',   { detail: { level: fireLevel } }));
    window.dispatchEvent(new CustomEvent('pad:lights-level', { detail: { level: lightLevel } }));
  }, []);

  const setFireLevel = (lvl) => {
    if (lvl === 4 && fireLevel === 4) {
      // Toggle off — collapse wall, step down to level 3
      setFireLvl(3);
      window.dispatchEvent(new CustomEvent('pad:fire-level', { detail: { level: 3 } }));
    } else {
      setFireLvl(lvl);
      window.dispatchEvent(new CustomEvent('pad:fire-level', { detail: { level: lvl } }));
    }
  };
  const setLightLevel = (lvl) => {
    setLightLvl(lvl);
    window.dispatchEvent(new CustomEvent('pad:lights-level', { detail: { level: lvl } }));
  };
  const handleChannelChange = (i) => {
    setChannel(i);
    // Changing atmosphere collapses the wall video if it's expanded
    window.dispatchEvent(new CustomEvent('pad:wall-collapse'));
  };

  // ── Drag/pinch refs ──
  const phoneElRef   = useRef(null);
  const raisedRef    = useRef(false);
  const translateRef = useRef({ x: 0, y: 0 });
  const scaleRef     = useRef(null);
  const dragRef_     = useRef(null);
  const pinchRef_    = useRef(null);

  // ── Maximize (double-tap top edge) ──
  const [maximized, setMaximized] = useState(false);
  const maximizedRef    = useRef(false);
  const maxTransformRef = useRef(null);   // the computed near-fullscreen transform
  const preMaxRef       = useRef(null);   // translate/scale to restore on un-maximize
  const lastTapRef      = useRef(0);
  const lastTouchEndRef = useRef(0);

  const getDefaultRot   = () => window.innerWidth <= 720 ? 0    : 8;
  // Base scale, then clamped so the whole phone fits the viewport height.
  // On short (landscape) screens this is what keeps the top app icons on-screen.
  const getDefaultScale = () => {
    const el = phoneElRef.current;
    const H = el ? el.offsetHeight : (window.innerWidth <= 720 ? 420 : 540);
    const base = window.innerWidth <= 720 ? 0.70 : 0.72;
    // 40px breathing room top+bottom; rotation adds a little bbox height too
    const fit = (window.innerHeight - 40) / H;
    return Math.max(0.32, Math.min(base, fit));
  };

  const applyTransform = () => {
    const el = phoneElRef.current; if (!el) return;
    if (maximizedRef.current && maxTransformRef.current) {
      // Maximize keeps a centre pivot so its maths stay exact
      el.style.transformOrigin = '50% 50%';
      el.style.transform = maxTransformRef.current;
      try { el.getAnimations().forEach(a => { if (a.startTime === null) a.cancel(); }); } catch(e) {}
      return;
    }
    const t = translateRef.current;
    const s = scaleRef.current || getDefaultScale();
    const r = getDefaultRot();
    // Anchor scaling to the BOTTOM centre so shrinking never pushes the
    // top of the phone (and its first icon row) off-screen.
    el.style.transformOrigin = '50% 100%';
    el.style.transform = `translate(${t.x}px,${t.y}px) rotate(${r}deg) scale(${s})`;
    // Force any stuck CSS transitions to commit immediately (iframe quirk: pending transitions can stall forever)
    try { el.getAnimations().forEach(a => { if (a.startTime === null) a.cancel(); }); } catch(e) {}
  };

  // Double-tap / double-click the phone's TOP EDGE to swell it to nearly
  // full-screen (relative to the phone's own width & height); double-tap
  // again to drop it back to the previous size.
  const toggleMaximize = () => {
    const el = phoneElRef.current; if (!el || !raisedRef.current) return;
    if (!maximizedRef.current) {
      preMaxRef.current = { x: translateRef.current.x, y: translateRef.current.y, s: scaleRef.current };
      // Use the element's untransformed layout geometry so this is independent
      // of the current transform-origin (default view anchors at bottom centre).
      const W = el.offsetWidth, H = el.offsetHeight;
      const baseCx = el.offsetLeft + W / 2;
      const baseCy = el.offsetTop  + H / 2;
      const vw = window.innerWidth, vh = window.innerHeight;
      const S  = Math.min((vh * 0.96) / H, (vw * 0.96) / W);
      const dx = vw / 2 - baseCx, dy = vh / 2 - baseCy;
      maxTransformRef.current = `translate(${dx}px,${dy}px) rotate(0deg) scale(${S})`;
      maximizedRef.current = true;
      setMaximized(true);
      applyTransform();
    } else {
      maximizedRef.current = false;
      maxTransformRef.current = null;
      const p = preMaxRef.current || { x: 0, y: 0, s: null };
      translateRef.current = { x: p.x, y: p.y };
      scaleRef.current = p.s;
      setMaximized(false);
      applyTransform();
    }
  };

  // Unified double-tap / double-click → maximize. Works for mouse (click) and
  // touch (touchend). On touch we preventDefault to stop the browser's native
  // double-tap-to-zoom from firing on the whole page.
  const handleTopEdge = (e) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastTapRef.current < 360) {
      lastTapRef.current = 0;
      toggleMaximize();
    } else {
      lastTapRef.current = now;
    }
  };
  const onTopEdgeClick = (e) => {
    // Ignore the synthetic click that follows a handled touchend
    if (Date.now() - lastTouchEndRef.current < 600) return;
    handleTopEdge(e);
  };
  const onTopEdgeTouchEnd = (e) => {
    e.preventDefault();         // kill native double-tap zoom on the page
    lastTouchEndRef.current = Date.now();
    handleTopEdge(e);
  };

  // Navigation helpers
  const goBack = () => {
    setScreen(prev => {
      if (!prev) return null;
      const i = prev.lastIndexOf(':');
      return i >= 0 ? prev.slice(0, i) : null;
    });
  };

  const raise = () => setRaised(true);
  const lower = () => {
    maximizedRef.current = false;
    maxTransformRef.current = null;
    setMaximized(false);
    translateRef.current = { x: 0, y: 0 };
    scaleRef.current = null;
    const el = phoneElRef.current;
    if (el) { el.style.transition = 'none'; el.style.transform = ''; el.style.transformOrigin = ''; el.getBoundingClientRect(); el.style.transition = ''; }
    setRaised(false);
    setScreen(null);
  };

  useEffect(() => { raisedRef.current = raised; }, [raised]);

  // Re-fit on viewport resize / orientation change while raised, so the
  // landscape (short height) layout always keeps every icon on-screen.
  useEffect(() => {
    const onResize = () => {
      if (!raisedRef.current) return;
      if (maximizedRef.current) {
        // recompute the maximize target for the new viewport
        const el = phoneElRef.current; if (!el) return;
        const W = el.offsetWidth, H = el.offsetHeight;
        const vw = window.innerWidth, vh = window.innerHeight;
        const S = Math.min((vh * 0.96) / H, (vw * 0.96) / W);
        const dx = vw / 2 - (el.offsetLeft + W / 2);
        const dy = vh / 2 - (el.offsetTop + H / 2);
        maxTransformRef.current = `translate(${dx}px,${dy}px) rotate(0deg) scale(${S})`;
      } else {
        // drop any pinch override so the fresh fit-scale applies
        scaleRef.current = null;
      }
      applyTransform();
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);
  useEffect(() => {
    const el = phoneElRef.current;
    if (raised) {
      applyTransform();
    } else if (el) {
      el.style.transform = '';
      el.style.transformOrigin = '';
    }
    // After class swap, cancel any stuck pending transitions so the new state takes effect
    if (el) {
      // Wait one frame, then cancel anything still pending
      requestAnimationFrame(() => {
        try {
          el.getAnimations().forEach(a => { if (a.startTime === null) a.cancel(); });
        } catch(e) {}
      });
    }
  }, [raised]);

  // Touch events (pinch + drag)
  useEffect(() => {
    const el = phoneElRef.current; if (!el) return;
    const onTS = (e) => {
      if (!raisedRef.current) return;
      if (e.touches.length === 2) {
        dragRef_.current = null;
        const d = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
        pinchRef_.current = { d0: d, s0: scaleRef.current || getDefaultScale() };
        e.preventDefault();
      } else if (e.touches.length === 1) {
        // Don't start a phone-drag when the finger lands inside the screen —
        // let the inner content (nav lists, message lists, etc.) scroll natively.
        // The phone can still be dragged by its bezel / frame.
        if (e.target.closest('.ph-screen')) { dragRef_.current = null; return; }
        const t = e.touches[0];
        dragRef_.current = { cx0: t.clientX, cy0: t.clientY, tx0: translateRef.current.x, ty0: translateRef.current.y, moved: false };
      }
    };
    const onTM = (e) => {
      if (!raisedRef.current) return;
      if (e.touches.length === 2 && pinchRef_.current) {
        const d = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
        scaleRef.current = Math.max(0.22, Math.min(1.15, pinchRef_.current.s0 * (d / pinchRef_.current.d0)));
        applyTransform(); e.preventDefault();
      } else if (e.touches.length === 1 && dragRef_.current) {
        const t = e.touches[0];
        const dx = t.clientX - dragRef_.current.cx0, dy = t.clientY - dragRef_.current.cy0;
        if (!dragRef_.current.moved && Math.hypot(dx, dy) < 6) return;
        dragRef_.current.moved = true;
        translateRef.current = { x: dragRef_.current.tx0 + dx, y: dragRef_.current.ty0 + dy };
        applyTransform(); e.preventDefault();
      }
    };
    const onTE = () => { dragRef_.current = null; pinchRef_.current = null; };
    el.addEventListener('touchstart', onTS, { passive: false });
    el.addEventListener('touchmove',  onTM, { passive: false });
    el.addEventListener('touchend',   onTE);
    return () => { el.removeEventListener('touchstart', onTS); el.removeEventListener('touchmove', onTM); el.removeEventListener('touchend', onTE); };
  }, []);

  // Desktop pointer drag
  const onPD = (e) => {
    if (!raised || e.pointerType === 'touch') return;
    if (e.target.closest('button') || e.target.closest('.ph-home') || e.target.closest('.ph-screen')) return;
    dragRef_.current = { cx0: e.clientX, cy0: e.clientY, tx0: translateRef.current.x, ty0: translateRef.current.y, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();
  };
  const onPM = (e) => {
    if (!dragRef_.current || e.pointerType === 'touch') return;
    const dx = e.clientX - dragRef_.current.cx0, dy = e.clientY - dragRef_.current.cy0;
    if (!dragRef_.current.moved && Math.hypot(dx, dy) < 6) return;
    dragRef_.current.moved = true;
    translateRef.current = { x: dragRef_.current.tx0 + dx, y: dragRef_.current.ty0 + dy };
    applyTransform(); e.stopPropagation();
  };
  const onPU = () => { dragRef_.current = null; };

  // Flashlight pointer tracking
  useEffect(() => {
    if (!flashlight) return;
    const onMove = (e) => {
      const t = e.touches ? e.touches[0] : e;
      setBeam({ x: t.clientX, y: t.clientY });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('touchmove', onMove); };
  }, [flashlight]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('pad:flashlight', { detail: { active: flashlight, x: beam.x, y: beam.y } }));
  }, [flashlight, beam]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('pad:channel', { detail: { id: CHANNELS[channel].id, index: channel } }));
  }, [channel]);

  // The Pad broadcasts its current view; the phone steps aside inside the game
  // dungeon (which has its own full-screen UI) so it never blocks gameplay.
  useEffect(() => {
    const onView = (e) => setPadView(e.detail);
    window.addEventListener('pad:view', onView);
    return () => window.removeEventListener('pad:view', onView);
  }, []);
  useEffect(() => { if (padView === 'game') setRaised(false); }, [padView]);

  useEffect(() => {
    const onPickup = (e) => {
      const item = e.detail;
      setInv(prev => prev.some(p => p.id === item.id) ? prev : [...prev, item]);
      setMsgs(prev => [{ from: 'System', time: 'now', type: 'note', body: `Picked up: ${item.name}` }, ...prev]);
      if (screen !== 'messages' && !screen?.startsWith('messages:')) setUnread(u => u + 1);
    };
    // Replace an item in place (e.g. a crystal cleansed at the sink)
    const onUpdate = (e) => {
      const item = e.detail;
      setInv(prev => prev.map(p => p.id === item.id ? { ...p, ...item } : p));
      if (item.note) {
        setMsgs(prev => [{ from: 'System', time: 'now', type: 'note', body: item.note }, ...prev]);
        if (screen !== 'messages' && !screen?.startsWith('messages:')) setUnread(u => u + 1);
      }
    };
    window.addEventListener('pad:inv-add', onPickup);
    window.addEventListener('pad:inv-update', onUpdate);
    return () => {
      window.removeEventListener('pad:inv-add', onPickup);
      window.removeEventListener('pad:inv-update', onUpdate);
    };
  }, [screen]);

  useEffect(() => {
    if (screen === 'messages' || screen?.startsWith('messages:')) setUnread(0);
  }, [screen]);

  const toggleFL = () => setFL(f => {
    const next = !f;
    if (next) setBeam({ x: window.innerWidth * 0.5, y: window.innerHeight * 0.46 });
    return next;
  });

  const apps = [
    { id: 'flashlight', label: 'Flashlight', grad: 'linear-gradient(145deg, #FFE234 0%, #FFAA00 100%)', svg: <IconFlashlight/>, active: flashlight },
    { id: 'channels',   label: 'Channels',   grad: 'linear-gradient(145deg, #9B59F5 0%, #5E30D8 100%)', svg: <IconChannels/> },
    { id: 'messages',   label: 'Messages',   grad: 'linear-gradient(145deg, #34C759 0%, #1A8A36 100%)', svg: <IconMessages/>, badge: unread || null },
    { id: 'mymusic',    label: 'My Music',   grad: 'linear-gradient(145deg, #BF5FFF 0%, #7A20D0 100%)', svg: <IconMusic/> },
    { id: 'mypad',      label: 'My Pad',     grad: 'linear-gradient(145deg, #C8782A 0%, #7A4A14 100%)', svg: <IconMyPad/> },
    { id: 'avelion',    label: 'Avelion',    grad: 'linear-gradient(145deg, #F8D089 0%, #C89038 100%)', svg: <IconAvelion/> },
  ];

  const stop = (e) => e.stopPropagation();

  // Inside the dungeon the game owns the screen — hide the Pad phone entirely so
  // it never overlaps the game's hotspots or d-pad. Inventory/messages still
  // update in the background via the event listeners above.
  if (padView === 'game') return null;

  return (
    <>
      {flashlight && (
        <div className="fl-overlay" style={{
          background: `radial-gradient(circle 280px at ${beam.x}px ${beam.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0.50) 58%, rgba(0,0,0,0.82) 100%)`,
        }}/>
      )}
      {flashlight && <div className="fl-beam" style={{ left: beam.x, top: beam.y }}/>}

      <div className="ch-wash" style={{
        background: CHANNELS[channel].tint,
        backdropFilter: CHANNELS[channel].filter === 'none' ? 'none' : CHANNELS[channel].filter,
        WebkitBackdropFilter: CHANNELS[channel].filter === 'none' ? 'none' : CHANNELS[channel].filter,
        opacity: channel === 0 ? 0 : 1,
      }}/>

      <div
        ref={phoneElRef}
        className={`obs-phone ${raised ? 'raised' : 'lowered'}`}
        onClick={raised ? undefined : raise}
        onPointerDown={onPD}
        onPointerMove={onPM}
        onPointerUp={onPU}
      >
        {raised && (
          <button className="ph-lower-btn" onClick={(e) => { stop(e); lower(); }} aria-label="Lower phone">
            <svg viewBox="0 0 36 36" width="28" height="28">
              <circle cx="18" cy="18" r="17" fill="rgba(52,50,65,0.92)" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
              <line x1="12.5" y1="12.5" x2="23.5" y2="23.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              <line x1="23.5" y1="12.5" x2="12.5" y2="23.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        <div className="obs-phone-body" onClick={raised ? stop : undefined}>
          {!raised && <div className="ph-lowered-tab">Phone</div>}
          <div className="ph-notch"/>
          <div className="ph-speaker"/>

          {/* Top-edge double-tap / double-click target — swells the phone to
              near full-screen and back. Sits below the mini-player (z200) and
              the lower-X (z100) so those stay tappable; only covers the bezel
              + status strip, never the app header controls below it. */}
          {raised && (
            <div
              className="ph-top-edge"
              onClick={onTopEdgeClick}
              onTouchEnd={onTopEdgeTouchEnd}
              title="Double-tap to expand"
            />
          )}

          {/* Mini player — always on bezel when tracks loaded, single-tap mute, double-tap mixer */}
          <MiniPlayer/>

          <div className="ph-screen">
            <div className="ph-status">
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="ph-status-r">
                <span className="ph-sig">···</span>
                <span className="ph-batt"/>
              </span>
            </div>

            {/* ── NAVIGATION LAYER ── */}
            {screen === null && (
              <PhoneHome apps={apps} onOpen={(a) => setScreen(a.id)}/>
            )}

            {/* Flashlight: button layer */}
            {screen === 'flashlight' && (
              <FlashlightApp
                flashlight={flashlight} flMode={flMode}
                onToggle={toggleFL} onMode={setFlMode}
                onBack={goBack}
              />
            )}

            {/* Channels: Parables / Tools / Links */}
            {(screen === 'channels' || screen?.startsWith('channels:')) && (
              <ChannelsContentApp screen={screen} setScreen={setScreen} onBack={goBack}/>
            )}

            {/* Messages: button layer → list */}
            {screen === 'messages' && (
              <MessagesMenu messages={messages} unread={unread}
                onOpen={(id) => setScreen('messages:' + id)} onBack={goBack}/>
            )}
            {screen?.startsWith('messages:') && (
              <MessagesList messages={messages} category={screen.split(':')[1]} onBack={goBack}/>
            )}

            {/* Inventory: button layer → grid */}
            {screen === 'inventory' && (
              <InventoryMenu inv={inv} onOpen={(id) => setScreen('inventory:' + id)} onBack={goBack}/>
            )}
            {screen?.startsWith('inventory:') && (
              <InventoryGrid inv={inv} category={screen.split(':')[1]} onBack={goBack}/>
            )}

            {/* My Music */}
            {screen === 'mymusic' && (
              <MyMusicApp onBack={goBack}/>
            )}

            {/* My Pad: lights + fire + atmosphere + inventory */}
            {screen === 'mypad' && (
              <MyPadApp
                fireLevel={fireLevel} lightLevel={lightLevel} channel={channel}
                invCount={inv.length}
                onFire={setFireLevel} onLight={setLightLevel} onChannel={handleChannelChange}
                onInventory={() => setScreen('inventory')}
                onBack={goBack}/>
            )}

            {/* Avelion: lantern greeting */}
            {screen === 'avelion' && (
              <AvelionApp onBack={goBack}/>
            )}
          </div>

          <div className="ph-home" onClick={(e) => {
            stop(e);
            if (screen !== null) setScreen(null);
            else lower();
          }}/>
        </div>
      </div>
    </>
  );
}

window.PhoneOverlay = PhoneOverlay;
