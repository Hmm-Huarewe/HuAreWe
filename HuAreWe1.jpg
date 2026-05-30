// game-room.jsx v6 — Deep Pyramid
// Full expanded dungeon: 7 chakra gems, keys, locked chests,
// spiders, rats, portal, floating orbs, rock variety
// Exports: GameRoom, Lantern, CHAKRAS

const { useState, useEffect, useRef, useCallback } = React;

const CHAKRAS = [
  {color:'#c0392b',gem:'Ruby',        glow:'#e74c3c',name:'Root'},
  {color:'#d4600a',gem:'Carnelian',   glow:'#e8823a',name:'Sacral'},
  {color:'#c9960a',gem:'Citrine',     glow:'#f0c030',name:'Solar'},
  {color:'#1e8449',gem:'Emerald',     glow:'#27ae60',name:'Heart'},
  {color:'#1a6fa8',gem:'Blue Topaz',  glow:'#3498db',name:'Throat'},
  {color:'#6c3483',gem:'Amethyst',    glow:'#9b59b6',name:'Third Eye'},
  {color:'#a8a8d8',gem:'Clear Quartz',glow:'#d8d8ff',name:'Crown'},
];

// ── ROOM DEFINITIONS ──────────────────────────────────────────
// keys: physical keys found in rooms, required to open locked chests
// rocks: type = 'normal'|'mossy'|'carved'|'glowing'
const ROOMS = {
  entry:{
    type:'corridor',title:'The Threshold',
    atmos:'Warm air rises from below. Ancient stone. Something watches.',
    exits:{forward:'hall_1'},
    rocks:[{id:'ra',x:.15,y:.78},{id:'rb',x:.80,y:.82},{id:'rc',x:.50,y:.88,type:'mossy'}],
    chest:null,keyItem:null,lockedChest:null,question:null,gem:null,
  },
  hall_1:{
    type:'corridor',title:'First Passage',
    atmos:'Hieroglyphs crowd every surface. The air smells of cedar and dust.',
    exits:{forward:'junction_1',back:'entry'},
    rocks:[{id:'rd',x:.18,y:.76,type:'carved'},{id:'re',x:.74,y:.80}],
    chest:{id:'ca',scroll:'The observer is not one of the twelve things happening. It is the thirteenth — the still point around which all twelve move.'},
    keyItem:null,lockedChest:null,question:null,gem:null,
  },
  junction_1:{
    type:'crossroads',title:'First Junction',
    atmos:'Three passages open before you. The walls pulse with faint colour.',
    exits:{forward:'gem_1',left:'side_scarab',right:'side_anubis',back:'hall_1'},
    rocks:[],chest:null,keyItem:null,lockedChest:null,gem:null,
    question:{text:'The flame was always there — only the glass needed cleaning. What does this tell you about the nature of your light?',choices:[{symbol:'◉',label:'It never left',dir:'forward',correct:true},{symbol:'≋',label:'It comes and goes',dir:'left',correct:false},{symbol:'◆',label:'It must be earned',dir:'right',correct:false}],hint:'The flame was never out. Only the glass needs cleaning.'},
  },
  side_scarab:{
    type:'side',title:'Scarab Alcove',
    atmos:'A small chamber. Scarab carvings cover every inch of the walls.',
    exits:{back:'junction_1'},
    rocks:[{id:'rs1',x:.25,y:.80,type:'carved'},{id:'rs2',x:.65,y:.76,type:'mossy'},{id:'rs3',x:.45,y:.85}],
    chest:null,
    keyItem:{id:'k1',x:.50,y:.74,label:'Scarab Key',desc:'A small bronze key shaped like a scarab. It fits something deeper in.'},
    lockedChest:null,question:null,gem:null,
  },
  side_anubis:{
    type:'side',title:'Anubis Hall',
    atmos:'A jackal-headed statue watches from the far wall. Its eyes catch the torchlight.',
    exits:{back:'junction_1'},
    rocks:[{id:'ra1',x:.20,y:.82,type:'glowing'},{id:'ra2',x:.72,y:.78},{id:'ra3',x:.42,y:.86,type:'carved'}],
    chest:{id:'cb',scroll:'You are not what happens to you. You are the one who watches what happens. I Am. I Remember. I Remain.'},
    keyItem:null,lockedChest:null,question:null,
    gem:{id:'g2',chakra:1,x:.55,y:.68}, // Carnelian hidden in alcove
  },
  gem_1:{
    type:'chamber',title:'Root Chamber',
    atmos:'The floor glows a deep red. The root frequency hums beneath your feet.',
    exits:{forward:'hall_2',back:'junction_1'},
    rocks:[{id:'rg1',x:.14,y:.74},{id:'rg2',x:.28,y:.82,type:'mossy'},{id:'rg3',x:.64,y:.72,type:'gem',chakra:0},{id:'rg4',x:.80,y:.80},{id:'rg5',x:.46,y:.88,type:'carved'}],
    chest:{id:'cc',scroll:'The Ruby carries the root frequency — the colour of the first light, the first sound, the first knowing.'},
    keyItem:null,lockedChest:null,question:null,gem:null,
  },
  hall_2:{
    type:'corridor',title:'The Deeper Hall',
    atmos:'The passage narrows. Something small moves in the shadows near the floor.',
    exits:{forward:'junction_2',back:'gem_1'},
    rocks:[{id:'rh1',x:.22,y:.80,type:'mossy'},{id:'rh2',x:.70,y:.76}],
    chest:null,keyItem:null,
    lockedChest:{id:'lc1',x:.50,y:.72,requiresKey:'k1',scroll:'You found the connection between effort and surrender — the Sacral truth: creation flows when force releases.',gem:{chakra:1}},
    question:null,gem:null,
  },
  junction_2:{
    type:'crossroads',title:'Second Junction',
    atmos:'Four ways. Something glitters to the right. A low growl to the left.',
    exits:{forward:'gem_3',left:'side_deep_left',right:'side_deep_right',back:'hall_2'},
    rocks:[],chest:null,keyItem:null,lockedChest:null,gem:null,
    question:{text:'The Five Absolutes do not change. Which of these is NOT one of the five?',choices:[{symbol:'⚡',label:'Energy',dir:'left',correct:false},{symbol:'◉',label:'Space',dir:'forward',correct:false},{symbol:'≋',label:'Opinion',dir:'right',correct:true}],hint:'Time, Space, Energy, Matter, Consciousness — Opinion is not absolute.'},
  },
  side_deep_left:{
    type:'dead-end',title:'The Growling Dark',
    atmos:'Scratch marks on the walls. Something lived here. An old chest in the corner.',
    exits:{back:'junction_2'},
    rocks:[{id:'rdl1',x:.30,y:.78,type:'carved'},{id:'rdl2',x:.62,y:.82}],
    chest:{id:'cd',scroll:'Matter is not solid — it is frequency made visible. Every stone you crack is a belief becoming porous.'},
    keyItem:{id:'k2',x:.72,y:.74,label:'Iron Key',desc:'Heavy. Cold. This unlocks something in the chamber of the Solar frequency.'},
    lockedChest:null,question:null,gem:null,
  },
  side_deep_right:{
    type:'side',title:'The Glittering Niche',
    atmos:'Citrine fragments catch the torchlight. A sarcophagus leans against the far wall.',
    exits:{back:'junction_2'},
    rocks:[{id:'rdr1',x:.20,y:.80,type:'glowing'},{id:'rdr2',x:.75,y:.76,type:'mossy'}],
    chest:null,keyItem:null,lockedChest:null,question:null,
    gem:{id:'g4',chakra:3,x:.50,y:.68}, // Heart Emerald
  },
  gem_3:{
    type:'chamber',title:'Solar Chamber',
    atmos:'Gold dust on the floor. The light here is different — warmer, older.',
    exits:{forward:'hall_3',back:'junction_2'},
    rocks:[{id:'rsl1',x:.18,y:.76,type:'mossy'},{id:'rsl2',x:.35,y:.84},{id:'rsl3',x:.60,y:.70,type:'gem',chakra:2},{id:'rsl4',x:.78,y:.80,type:'carved'}],
    chest:null,keyItem:null,
    lockedChest:{id:'lc2',x:.50,y:.72,requiresKey:'k2',scroll:'The Solar plexus is where the self says: I have the right to exist, to act, to create. Claim it.',gem:{chakra:2}},
    question:null,gem:null,
  },
  hall_3:{
    type:'corridor',title:'The Long Walk',
    atmos:'The longest passage yet. Your torch casts long shadows. The walls breathe.',
    exits:{forward:'junction_3',back:'gem_3'},
    rocks:[{id:'rl1',x:.25,y:.79,type:'carved'},{id:'rl2',x:.68,y:.83,type:'mossy'}],
    chest:{id:'ce',scroll:'What you put out is what you get back — as resonance. The universe does not judge. It mirrors.'},
    keyItem:null,lockedChest:null,question:null,gem:null,
  },
  junction_3:{
    type:'crossroads',title:'The Deep Junction',
    atmos:'You can feel the pyramid\'s apex far above. Three passages, one truth.',
    exits:{forward:'gem_5',left:'side_throat',right:'side_eye',back:'hall_3'},
    rocks:[],chest:null,keyItem:null,lockedChest:null,gem:null,
    question:{text:'The Feel-Back Loop moves A through G and back again. What is the nature of this return?',choices:[{symbol:'△',label:'Loss',dir:'left',correct:false},{symbol:'◉',label:'Completion',dir:'forward',correct:true},{symbol:'◆',label:'Punishment',dir:'right',correct:false}],hint:'G returns to A — not as failure but as the octave completing. What goes out comes back as gift.'},
  },
  side_throat:{
    type:'side',title:'The Blue Chamber',
    atmos:'Blue stone veins run through the walls here. Sound feels different — like it carries farther.',
    exits:{back:'junction_3'},
    rocks:[{id:'rt1',x:.22,y:.80,type:'carved'},{id:'rt2',x:.70,y:.76,type:'glowing'}],
    chest:{id:'cf',scroll:'The throat is where the inner becomes outer — where HU sounds. Every word is a frequency sent into the field.'},
    keyItem:{id:'k3',x:.50,y:.70,label:'Crystal Key',desc:'Translucent, almost glowing. For the chamber of the Third Eye.'},
    lockedChest:null,question:null,
    gem:{id:'g5',chakra:4,x:.35,y:.72}, // Blue Topaz
  },
  side_eye:{
    type:'side',title:'The Violet Passage',
    atmos:'Purple mineral veins in the stone. The air is heavier here, charged.',
    exits:{back:'junction_3'},
    rocks:[{id:'re1',x:.28,y:.78,type:'glowing'},{id:'re2',x:.65,y:.82,type:'mossy'}],
    chest:null,keyItem:null,
    lockedChest:{id:'lc3',x:.50,y:.72,requiresKey:'k3',scroll:'The third eye does not see with light — it sees with knowing. What you perceive here, you perceived before you arrived.',gem:{chakra:5}},
    question:null,gem:null,
  },
  gem_5:{
    type:'chamber',title:'Throat Chamber',
    atmos:'Five pillars. Each one a different tone when you pass close.',
    exits:{forward:'final_hall',back:'junction_3'},
    rocks:[{id:'rc1',x:.16,y:.74,type:'mossy'},{id:'rc2',x:.30,y:.82},{id:'rc3',x:.55,y:.70,type:'gem',chakra:4},{id:'rc4',x:.75,y:.78,type:'carved'}],
    chest:null,keyItem:null,lockedChest:null,question:null,gem:null,
  },
  final_hall:{
    type:'corridor',title:'The Final Passage',
    atmos:'The air is cold now, electric. Something waits beyond. You can feel all seven frequencies.',
    exits:{forward:'portal_chamber',back:'gem_5'},
    rocks:[{id:'rf1',x:.20,y:.80,type:'glowing'},{id:'rf2',x:.72,y:.76,type:'carved'}],
    chest:null,keyItem:null,
    lockedChest:{id:'lc4',x:.50,y:.72,requiresKey:'k_crown',scroll:'The Crown is not above you. It is you, expanded. Clear Quartz holds all frequencies because it holds none — pure potential.',gem:{chakra:6}},
    question:null,gem:null,
  },
  portal_chamber:{
    type:'portal',title:'The Portal Chamber',
    atmos:'Seven frequencies hum as one. The red orb pulses at the far wall — a door made of light.',
    exits:{back:'final_hall'},
    rocks:[{id:'rp1',x:.20,y:.80,type:'glowing'},{id:'rp2',x:.72,y:.78,type:'glowing'}],
    chest:{id:'cg',scroll:'You have walked the full spectrum. Root to Crown. The portal does not take you somewhere else. It takes you somewhere deeper — into what you already are.'},
    keyItem:{id:'k_crown',x:.50,y:.65,label:'Crown Key',desc:'Pure light, barely visible. The final key. It unlocks the last chest in the passage behind.'},
    lockedChest:null,question:null,gem:{id:'g7',chakra:6,x:.50,y:.55},
  },
};

// ── LANTERN ───────────────────────────────────────────────────
// Traditional oil lantern: bail handle, glass globe, metal ribs,
// base with wick-adjustment key/thumbwheel, burning flame.
function Lantern({brightness=0,size=80,color='#c4a45a',soot=0,onClick,style:sx}) {
  const g=Math.max(0,brightness),fc=color||'#c4a45a';
  // viewBox: 0 0 60 80 (4:3 ratio)
  const h=size*1.33;
  return (
    <div onClick={onClick} style={{cursor:onClick?'pointer':'default',width:size,height:h,position:'relative',flexShrink:0,...sx}}>
      <>
      <svg width={size} height={h} viewBox="0 0 60 80"
        style={{filter:g>0.05?`drop-shadow(0 0 ${4+g*18}px ${fc}) drop-shadow(0 0 ${2+g*10}px #fffaaa) drop-shadow(0 0 ${g*5}px #fff)`:'none',transition:'filter 1.2s ease'}}>
        <defs>
          <radialGradient id={`flg${size}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffaaa" stopOpacity={0.08+g*0.60}/>
            <stop offset="50%" stopColor={fc} stopOpacity={g*0.22}/>
            <stop offset="100%" stopColor={fc} stopOpacity="0"/>
          </radialGradient>
          <radialGradient id={`glassShine${size}`} cx="28%" cy="28%" r="55%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.14)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </radialGradient>
        </defs>

        {/* BAIL HANDLE */}
        <path d="M22 9 Q30 1 38 9" stroke={fc} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <circle cx="22" cy="9" r="2.2" fill="#2a1a06" stroke={fc} strokeWidth=".9"/>
        <circle cx="38" cy="9" r="2.2" fill="#2a1a06" stroke={fc} strokeWidth=".9"/>
        <line x1="30" y1="1" x2="30" y2="12" stroke={fc} strokeWidth="1.8" strokeLinecap="round"/>

        {/* TOP CROWN CAP */}
        <ellipse cx="30" cy="12" rx="12" ry="3.8" fill="#1e1208" stroke={fc} strokeWidth="1.1"/>
        <path d="M18 12 Q18 7 30 6 Q42 7 42 12" fill="#2e1e0a" stroke={fc} strokeWidth=".9"/>
        <line x1="24" y1="8" x2="24" y2="11" stroke={fc} strokeWidth=".7" opacity=".55"/>
        <line x1="30" y1="7" x2="30" y2="11" stroke={fc} strokeWidth=".7" opacity=".55"/>
        <line x1="36" y1="8" x2="36" y2="11" stroke={fc} strokeWidth=".7" opacity=".55"/>

        {/* GLASS GLOBE — barrel shaped */}
        <path d="M20 15 Q12 26 12 40 Q12 54 20 60 L40 60 Q48 54 48 40 Q48 26 40 15 Z"
          fill="#0c0804" stroke={fc} strokeWidth=".6" opacity=".75"/>
        <path d="M20 15 Q12 26 12 40 Q12 54 20 60 L40 60 Q48 54 48 40 Q48 26 40 15 Z"
          fill={`url(#flg${size})`}/>
        <path d="M20 15 Q12 26 12 40 Q12 54 20 60 L40 60 Q48 54 48 40 Q48 26 40 15 Z"
          fill={`url(#glassShine${size})`}/>

        {/* METAL FRAME RIBS */}
        <path d="M20 15 Q14 40 20 60" stroke={fc} strokeWidth="1.4" fill="none" opacity=".75"/>
        <path d="M40 15 Q46 40 40 60" stroke={fc} strokeWidth="1.4" fill="none" opacity=".75"/>
        <path d="M25 15 Q22 40 25 60" stroke={fc} strokeWidth=".8" fill="none" opacity=".38"/>
        <path d="M35 15 Q38 40 35 60" stroke={fc} strokeWidth=".8" fill="none" opacity=".38"/>
        {/* Horizontal bands */}
        <path d="M14 28 Q30 31 46 28" stroke={fc} strokeWidth=".8" fill="none" opacity=".45"/>
        <path d="M12 40 Q30 44 48 40" stroke={fc} strokeWidth=".9" fill="none" opacity=".45"/>
        <path d="M14 52 Q30 55 46 52" stroke={fc} strokeWidth=".8" fill="none" opacity=".45"/>

        {/* WICK */}
        <line x1="30" y1="50" x2="30" y2="44" stroke="#5a3610" strokeWidth="1.8" strokeLinecap="round" opacity=".9"/>

        {/* FLAME — wispy, multi-layer */}
        {/* Far outer wisp */}
        <ellipse cx="30" cy="36" rx={7+g*6} ry={14+g*10} fill={fc} opacity={0.03+g*0.07}
          style={{animation:'lf-out 2.8s ease infinite',transformOrigin:'30px 46px'}}/>
        {/* Outer flame */}
        <ellipse cx="30" cy="38" rx={5+g*4} ry={10+g*7} fill={fc} opacity={0.05+g*0.13}
          style={{animation:'lf-out 2.2s .3s ease infinite',transformOrigin:'30px 47px'}}/>
        {/* Mid flame */}
        <ellipse cx="30" cy="38" rx={3.5+g*2.5} ry={7+g*5} fill={fc} opacity={0.14+g*0.35}
          style={{animation:'lf-mid 1.6s .1s ease infinite',transformOrigin:'30px 46px'}}/>
        {/* Inner flame */}
        <ellipse cx="30" cy="36" rx={2+g*1.5} ry={5+g*3.5} fill="#fffaaa" opacity={0.10+g*0.52}
          style={{animation:'lf-mid 1.1s .05s ease infinite',transformOrigin:'30px 44px'}}/>
        {/* Core */}
        <ellipse cx="30" cy="34" rx={0.9+g} ry={2.2+g*2} fill="#ffffff" opacity={0.07+g*0.58}
          style={{animation:'lf-core .9s .2s ease infinite',transformOrigin:'30px 42px'}}/>
        {/* Wispy top tendril */}
        {g>0.3&&<ellipse cx={30+Math.sin(0)*2} cy={32-g*3} rx={0.5+g*0.8} ry={3+g*4} fill="#ffffff" opacity={g*0.25}
          style={{animation:'lf-wisp 1.8s .4s ease infinite',transformOrigin:'30px 36px'}}/>}

        {/* BASE RESERVOIR */}
        <ellipse cx="30" cy="60" rx="13" ry="3.8" fill="#1e1208" stroke={fc} strokeWidth="1.1"/>
        <rect x="17" y="60" width="26" height="12" rx="2.5" fill="#2e1e0a" stroke={fc} strokeWidth=".9"/>
        <ellipse cx="30" cy="72" rx="13" ry="3.2" fill="#1e1208" stroke={fc} strokeWidth="1.1"/>
        <path d="M17 66 Q30 68.5 43 66" stroke={fc} strokeWidth=".5" fill="none" opacity=".38"/>
        {/* Oil cap */}
        <ellipse cx="22" cy="60" rx="3.2" ry="2" fill="#2e1e0a" stroke={fc} strokeWidth=".7"/>
        <circle cx="22" cy="60" r="1.3" fill={fc} opacity=".42"/>

        {/* THUMBWHEEL KEY */}
        <line x1="43" y1="66" x2="48" y2="66" stroke={fc} strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="49.5" cy="66" r="3.8" fill="#1a1006" stroke={fc} strokeWidth="1.1"/>
        <line x1="49.5" y1="62.2" x2="49.5" y2="69.8" stroke={fc} strokeWidth=".8" opacity=".7"/>
        <line x1="45.7" y1="66" x2="53.3" y2="66" stroke={fc} strokeWidth=".8" opacity=".7"/>
        <line x1="46.8" y1="63.3" x2="52.2" y2="68.7" stroke={fc} strokeWidth=".55" opacity=".5"/>
        <line x1="46.8" y1="68.7" x2="52.2" y2="63.3" stroke={fc} strokeWidth=".55" opacity=".5"/>
        <circle cx="49.5" cy="66" r="1.3" fill={fc} opacity=".62"/>

        {soot>0.01&&(
          <path d="M20 15 Q12 26 12 40 Q12 54 20 60 L40 60 Q48 54 48 40 Q48 26 40 15 Z"
            fill={`rgba(8,4,2,${soot})`}/>
        )}
      </svg>
      <style>{`
        @keyframes lf-out{0%,100%{transform:scaleX(1) scaleY(1)}25%{transform:scaleX(1.1) scaleY(.93)}50%{transform:scaleX(.93) scaleY(1.08)}75%{transform:scaleX(1.06) scaleY(.96)}}
        @keyframes lf-mid{0%,100%{transform:scaleX(1) scaleY(1)}30%{transform:scaleX(1.09) scaleY(.92) translateY(1px)}65%{transform:scaleX(.94) scaleY(1.08) translateY(-1.5px)}}
        @keyframes lf-core{0%,100%{opacity:.7}40%{opacity:.97}70%{opacity:.60}}
        @keyframes lf-wisp{0%,100%{transform:scaleX(1) translateY(0)}30%{transform:scaleX(.6) translateY(-3px)}60%{transform:scaleX(1.2) translateY(-1px)}85%{transform:scaleX(.7) translateY(-4px)}}
      `}</style>
      </>
    </div>
  );
}

// ── SOOT CLEAR ────────────────────────────────────────────────
function SootClear({onComplete}) {
  const [p,setP]=useState(0);
  useEffect(()=>{
    const t1=setTimeout(()=>setP(1),200);
    const t2=setTimeout(()=>setP(2),1700);
    const t3=setTimeout(onComplete,2900);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  },[]);
  return (
    <div style={{position:'absolute',inset:0,background:'#040201',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:50}}>
      <style>{`
        @keyframes sc-wipe{from{opacity:.94;clip-path:inset(0 0 0% 0)}to{opacity:0;clip-path:inset(0 0 100% 0)}}
        @keyframes sc-rise{from{opacity:0;transform:scale(.72) translateY(14px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes sc-txt{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div style={{position:'relative',marginBottom:28}}>
        <Lantern brightness={p>=2?.92:.05} size={112} color={p>=2?'#c4a45a':'#4a2e0a'}
          style={{animation:p===2?'sc-rise 1.1s ease forwards':'none'}}/>
        {p<2&&<div style={{position:'absolute',inset:0,borderRadius:8,
          background:'radial-gradient(circle at 50% 58%,rgba(28,16,4,.96),rgba(10,6,2,1))',
          animation:p===1?'sc-wipe 1.4s ease forwards':'none'}}/>}
      </div>
      {p<2
        ?<div style={{color:'rgba(232,168,32,.42)',fontSize:13,fontStyle:'italic',letterSpacing:'.07em',fontFamily:'Playfair Display,serif'}}>clearing the soot…</div>
        :<div style={{color:'rgba(232,168,32,.82)',fontSize:15,fontStyle:'italic',fontFamily:'Playfair Display,serif',animation:'sc-txt .9s .5s ease both'}}>The flame was always there.</div>
      }
    </div>
  );
}

// ── CANVAS SCENE ──────────────────────────────────────────────
function TombCanvas({room,roomId,cracked,gemFound,opened,collectedGems,heldKeys,chakraColor,flickerT,onRockClick,onChestClick,onGemClick,onKeyClick,onTemptation,onPortalTap}) {
  const canvasRef=useRef(null);
  const W=390,H=620;

  const hexRgb=h=>{
    if(!h||h.length<7)return{r:200,g:160,b:50};
    return{r:parseInt(h.slice(1,3),16),g:parseInt(h.slice(3,5),16),b:parseInt(h.slice(5,7),16)};
  };
  const cc=hexRgb(chakraColor);

  // Perspective geometry
  const VX=195,VY=210;
  const BL=138,BR=252,BT=195,BB=295;

  const leftWallPt=(u,v)=>{
    const topX=u*BL, topY=u*BT;
    const botY=H+(u*(BB-H));
    return{x:topX,y:topY+(botY-topY)*v};
  };
  const rightWallPt=(u,v)=>{
    const topX=BR+(W-BR)*u, topY=BT*(1-u);
    const botY=BB+(H-BB)*u;
    return{x:topX,y:topY+(botY-topY)*v};
  };

  const draw=useCallback(()=>{
    const cv=canvasRef.current; if(!cv)return;
    const ctx=cv.getContext('2d');
    ctx.clearRect(0,0,W,H);
    ctx.setTransform(1,0,0,1,0,0);

    // ── CEILING
    const ceilGrad=ctx.createLinearGradient(0,0,0,BT);
    ceilGrad.addColorStop(0,'#060402');ceilGrad.addColorStop(1,'#1a1208');
    ctx.fillStyle=ceilGrad;
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W,0);ctx.lineTo(BR,BT);ctx.lineTo(BL,BT);ctx.closePath();ctx.fill();

    // ── ROOM TINT — each room has a unique color atmosphere ─
    const roomTints={
      entry:          null,
      hall_1:         'rgba(60,40,10,.06)',
      junction_1:     'rgba(80,60,20,.07)',
      side_scarab:    'rgba(20,60,20,.09)',
      side_anubis:    'rgba(50,10,10,.11)',
      gem_1:          'rgba(90,10,10,.09)',
      hall_2:         'rgba(10,20,50,.08)',
      junction_2:     'rgba(50,30,60,.08)',
      side_deep_left: 'rgba(5,5,5,.14)',
      side_deep_right:'rgba(10,55,30,.09)',
      gem_3:          'rgba(80,60,10,.09)',
      hall_3:         'rgba(20,10,45,.09)',
      junction_3:     'rgba(35,20,55,.09)',
      side_throat:    'rgba(10,30,65,.10)',
      side_eye:       'rgba(55,10,75,.11)',
      gem_5:          'rgba(10,45,65,.09)',
      final_hall:     'rgba(65,50,85,.11)',
      portal_chamber: 'rgba(65,10,10,.09)',
    };
    if(roomTints[roomId]){
      ctx.fillStyle=roomTints[roomId];
      ctx.fillRect(0,0,W,H);
    }

    // ── LEFT WALL
    const lwGrad=ctx.createLinearGradient(0,H/2,BL,H/2);
    lwGrad.addColorStop(0,'#161008');lwGrad.addColorStop(.55,'#3e2c14');lwGrad.addColorStop(1,'#5a3e1e');
    ctx.fillStyle=lwGrad;
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,H);ctx.lineTo(BL,BB);ctx.lineTo(BL,BT);ctx.closePath();ctx.fill();

    // ── RIGHT WALL
    const rwGrad=ctx.createLinearGradient(W,H/2,BR,H/2);
    rwGrad.addColorStop(0,'#161008');rwGrad.addColorStop(.55,'#3e2c14');rwGrad.addColorStop(1,'#5a3e1e');
    ctx.fillStyle=rwGrad;
    ctx.beginPath();ctx.moveTo(W,0);ctx.lineTo(W,H);ctx.lineTo(BR,BB);ctx.lineTo(BR,BT);ctx.closePath();ctx.fill();

    // ── FLOOR
    const flrGrad=ctx.createLinearGradient(0,BB,0,H);
    flrGrad.addColorStop(0,'#4a3614');flrGrad.addColorStop(.5,'#362810');flrGrad.addColorStop(1,'#1e1808');
    ctx.fillStyle=flrGrad;
    ctx.beginPath();ctx.moveTo(0,H);ctx.lineTo(W,H);ctx.lineTo(BR,BB);ctx.lineTo(BL,BB);ctx.closePath();ctx.fill();

    // ── BACK WALL — solid fill
    const isPortal=room.type==='portal';
    ctx.fillStyle='#0e0b06';
    ctx.fillRect(BL,BT,BR-BL,BB-BT);
    ctx.strokeStyle='rgba(200,160,60,.18)';ctx.lineWidth=.8;
    ctx.beginPath();ctx.moveTo(BL,BT+2);ctx.quadraticCurveTo(VX,BT-6,BR,BT+2);ctx.stroke();
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;

    // Portal spiral drawn AFTER light pools — see below

    // ── STONE JOINTS FLOOR
    ctx.strokeStyle='rgba(0,0,0,.5)';
    [.22,.42,.58,.72,.84,.93].forEach(t=>{
      const y=BB+(H-BB)*t;
      ctx.lineWidth=.4+t*.6;
      ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();
    });
    [[140,320],[195,360],[255,340],[100,420],[310,400],[175,480],[220,460],[80,530],[300,510],[195,570]].forEach(([x,y])=>{
      ctx.lineWidth=.4;
      ctx.beginPath();ctx.moveTo(x-12,y);ctx.lineTo(x+12,y);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x,y-8);ctx.lineTo(x,y+8);ctx.stroke();
    });

    // ── STONE JOINTS WALLS
    ctx.strokeStyle='rgba(0,0,0,.38)';ctx.lineWidth=.5;
    [.18,.35,.52,.68,.82].forEach(v=>{
      const p0=leftWallPt(0,v),p1=leftWallPt(1,v);
      ctx.beginPath();ctx.moveTo(p0.x,p0.y);ctx.lineTo(p1.x,p1.y);ctx.stroke();
      const q0=rightWallPt(0,v),q1=rightWallPt(1,v);
      ctx.beginPath();ctx.moveTo(q0.x,q0.y);ctx.lineTo(q1.x,q1.y);ctx.stroke();
    });
    [.28,.55,.78].forEach(u=>{
      const lp0=leftWallPt(u,.12),lp1=leftWallPt(u,.9);
      ctx.beginPath();ctx.moveTo(lp0.x,lp0.y);ctx.lineTo(lp1.x,lp1.y);ctx.stroke();
      const rp0=rightWallPt(u,.12),rp1=rightWallPt(u,.9);
      ctx.beginPath();ctx.moveTo(rp0.x,rp0.y);ctx.lineTo(rp1.x,rp1.y);ctx.stroke();
    });

    // ── HIEROGLYPHS ON WALLS — direct perspective draw ───
    // Draw glyphs row by row along the actual wall perspective lines.
    // No affine transforms — just interpolate positions directly.
    const drawWallGlyphs=(wallPtFn,opacity)=>{
      ctx.save();
      ctx.globalAlpha=opacity;
      const syms=['𓂀','𓅓','𓆣','𓇯','𓈎','𓊃','𓋴','𓌀','𓍿','𓎛','𓏏','𓐍','𓀀','𓁹','𓂋','𓃀','𓄿'];
      const vRows=[.08,.18,.28,.38,.48,.58,.68,.78,.88];
      const uCols=[.15,.30,.45,.60,.75,.88];
      vRows.forEach((v,ri)=>{
        uCols.forEach((u,ci)=>{
          const pt=wallPtFn(u,v);
          // Scale font with perspective (far=small, near=large)
          const fSize=Math.max(5,Math.round(6+u*10));
          const alpha=.25+u*.28+Math.sin((ri+ci)*.8)*.1;
          ctx.fillStyle=`rgba(200,155,55,${alpha})`;
          ctx.font=`${fSize}px serif`;
          ctx.fillText(syms[(ri*uCols.length+ci)%syms.length],pt.x-fSize/2,pt.y+fSize/2);
        });
      });
      // Panel border lines along wall
      [.06,.50,.94].forEach(v=>{
        const p0=wallPtFn(.12,v),p1=wallPtFn(.92,v);
        ctx.strokeStyle=`rgba(180,140,50,.2)`;ctx.lineWidth=.6;
        ctx.beginPath();ctx.moveTo(p0.x,p0.y);ctx.lineTo(p1.x,p1.y);ctx.stroke();
      });
      ctx.restore();
    };
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
    drawWallGlyphs(leftWallPt, 0.75);
    drawWallGlyphs(rightWallPt,0.75);
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;

    // ── DARK CORRIDOR MOUTHS — drawn AFTER hieroglyphs so they overlay ──
    if(room.exits.left){
      ctx.save();
      const lx2=BL*.52,ly2=BT*.7,lx3=BL*.52,ly3=BB*.82;
      ctx.beginPath();ctx.moveTo(0,H*.24);ctx.lineTo(lx2,ly2);ctx.lineTo(lx3,ly3);ctx.lineTo(0,H*.76);ctx.closePath();
      const ldg=ctx.createLinearGradient(0,H*.5,lx2,H*.5);
      ldg.addColorStop(0,'rgba(0,0,0,0)');ldg.addColorStop(.25,'rgba(0,0,0,.52)');ldg.addColorStop(1,'rgba(0,0,0,.94)');
      ctx.fillStyle=ldg;ctx.fill();
      ctx.strokeStyle='rgba(180,140,50,.32)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(lx2,ly2);ctx.quadraticCurveTo(lx2-8,(ly2+ly3)/2,lx3,ly3);ctx.stroke();
      const ltig=ctx.createRadialGradient(lx2*.3,H*.5,0,lx2*.3,H*.5,32);
      ltig.addColorStop(0,`rgba(200,130,25,${.1+Math.sin(flickerT*5.3)*.05})`);
      ltig.addColorStop(1,'rgba(200,130,25,0)');
      ctx.fillStyle=ltig;ctx.beginPath();ctx.arc(lx2*.3,H*.5,32,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(190,150,55,.25)';ctx.font='10px serif';
      ctx.fillText('𓂀',lx2*.22,H*.49);
      ctx.restore();
    }
    if(room.exits.right){
      ctx.save();
      const rx2=BR+(W-BR)*.48,ry2=BT*.7,rx3=BR+(W-BR)*.48,ry3=BB*.82;
      ctx.beginPath();ctx.moveTo(W,H*.24);ctx.lineTo(rx2,ry2);ctx.lineTo(rx3,ry3);ctx.lineTo(W,H*.76);ctx.closePath();
      const rdg=ctx.createLinearGradient(W,H*.5,rx2,H*.5);
      rdg.addColorStop(0,'rgba(0,0,0,0)');rdg.addColorStop(.25,'rgba(0,0,0,.52)');rdg.addColorStop(1,'rgba(0,0,0,.94)');
      ctx.fillStyle=rdg;ctx.fill();
      ctx.strokeStyle='rgba(180,140,50,.32)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(rx2,ry2);ctx.quadraticCurveTo(rx2+8,(ry2+ry3)/2,rx3,ry3);ctx.stroke();
      const rtig=ctx.createRadialGradient(rx2+(W-rx2)*.68,H*.5,0,rx2+(W-rx2)*.68,H*.5,32);
      rtig.addColorStop(0,`rgba(200,130,25,${.1+Math.sin(flickerT*4.7)*.05})`);
      rtig.addColorStop(1,'rgba(200,130,25,0)');
      ctx.fillStyle=rtig;ctx.beginPath();ctx.arc(rx2+(W-rx2)*.68,H*.5,32,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(190,150,55,.25)';ctx.font='10px serif';
      ctx.fillText('𓁹',rx2+(W-rx2)*.62,H*.49);
      ctx.restore();
    }

    // ── TORCHES
    ctx.setTransform(1,0,0,1,0,0);
    const fl=flickerT;
    const drawTorch=(tx,ty,sc,phase)=>{
      ctx.save();ctx.translate(tx,ty);ctx.scale(sc,sc);
      ctx.strokeStyle='#5a3a18';ctx.lineWidth=2.5;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(18,0);ctx.stroke();
      ctx.beginPath();ctx.moveTo(18,0);ctx.lineTo(18,12);ctx.stroke();
      ctx.fillStyle='#2a1808';ctx.strokeStyle='#6a4a20';ctx.lineWidth=.8;
      ctx.beginPath();ctx.roundRect(14,12,8,22,2);ctx.fill();ctx.stroke();
      ctx.fillStyle='#3a2010';ctx.strokeStyle='#c8a030';ctx.lineWidth=.8;
      ctx.beginPath();ctx.moveTo(10,8);ctx.lineTo(14,18);ctx.lineTo(22,18);ctx.lineTo(26,8);
      ctx.quadraticCurveTo(18,4,10,8);ctx.closePath();ctx.fill();ctx.stroke();
      const fi=.3+Math.sin(fl*6.28+phase)*.15;
      const wg=ctx.createRadialGradient(18,0,0,18,0,60);
      wg.addColorStop(0,`rgba(220,140,30,${fi})`);wg.addColorStop(1,'rgba(220,140,30,0)');
      ctx.fillStyle=wg;ctx.beginPath();ctx.arc(18,0,60,0,Math.PI*2);ctx.fill();
      const fs=.85+Math.sin(fl*12.56+phase)*.15;
      ctx.save();ctx.translate(18,4);
      ctx.fillStyle=`rgba(210,120,10,.7)`;ctx.beginPath();ctx.ellipse(0,-6,5.5*fs,10,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=`rgba(240,180,20,.8)`;ctx.beginPath();ctx.ellipse(0,-8,3.5*fs,7,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=`rgba(255,240,120,.85)`;ctx.beginPath();ctx.ellipse(0,-10,2*fs,4.5,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=`rgba(255,255,220,.9)`;ctx.beginPath();ctx.ellipse(0,-12,1,2.5,0,0,Math.PI*2);ctx.fill();
      ctx.restore();ctx.restore();
    };
    drawTorch(2,105,1.15,0);drawTorch(2,260,0.82,1.3);drawTorch(2,420,0.60,2.1);
    ctx.save();ctx.translate(W,0);ctx.scale(-1,1);
    drawTorch(2,105,1.15,0.7);drawTorch(2,260,0.82,1.8);drawTorch(2,420,0.60,2.6);
    ctx.restore();

    // Light pools — clipped to keep off the back wall
    ctx.setTransform(1,0,0,1,0,0);
    const fMod=.82+Math.sin(fl*6.28)*.18;
    const addPool=(lx,ly,r,alpha)=>{
      ctx.save();
      ctx.beginPath();
      ctx.rect(0,0,W,H);
      ctx.rect(BL-2,BT-40,BR-BL+4,BB-BT+50);
      ctx.clip('evenodd');
      const lg=ctx.createRadialGradient(lx,ly,0,lx,ly,r);
      lg.addColorStop(0,`rgba(240,155,35,${alpha*fMod})`);
      lg.addColorStop(.4,`rgba(200,110,25,${alpha*.55*fMod})`);
      lg.addColorStop(1,'rgba(160,80,15,0)');
      ctx.fillStyle=lg;ctx.beginPath();ctx.arc(lx,ly,r,0,Math.PI*2);ctx.fill();
      ctx.restore();
    };
    // Big torch pools — clearly visible corridor lighting
    addPool(8,108,240,.70);addPool(W-8,108,240,.70);
    addPool(8,265,170,.42);addPool(W-8,265,170,.42);
    // Warm floor ambient
    ctx.save();
    const flrAmb=ctx.createLinearGradient(0,BB,0,H);
    flrAmb.addColorStop(0,'rgba(200,130,40,.30)');
    flrAmb.addColorStop(1,'rgba(100,60,20,.10)');
    ctx.fillStyle=flrAmb;
    ctx.beginPath();ctx.moveTo(0,H);ctx.lineTo(W,H);ctx.lineTo(BR,BB);ctx.lineTo(BL,BB);ctx.closePath();ctx.fill();
    ctx.restore();
    // Hard repaint back wall after light pools — prevents amber bleed
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
    ctx.fillStyle='#0e0b06';
    ctx.fillRect(BL,BT,BR-BL,BB-BT);
    ctx.strokeStyle='rgba(200,160,60,.18)';ctx.lineWidth=.8;
    ctx.beginPath();ctx.moveTo(BL,BT+2);ctx.quadraticCurveTo(VX,BT-6,BR,BT+2);ctx.stroke();
    // Subtle vortex always present on back wall — very dim in regular rooms
    {
      const vx2=VX,vy2=VY+10;
      const vPulse=isPortal?0:(.12+Math.sin(flickerT*1.1)*.04);
      const vRot=flickerT*(isPortal?0:.12); // very slow
      ctx.save();ctx.translate(vx2,vy2);ctx.rotate(vRot);
      const phi2=1.6180339887;
      for(let arm=0;arm<12;arm++){
        const armAngle=(arm/12)*Math.PI*2;
        ctx.save();ctx.rotate(armAngle);
        ctx.strokeStyle=`rgba(180,140,50,${vPulse*(0.6+arm*.03)})`;
        ctx.lineWidth=.5;
        ctx.beginPath();
        let vr=1,va=0;
        ctx.moveTo(vr*Math.cos(va),vr*Math.sin(va));
        for(let i=0;i<50;i++){
          va+=0.2;vr*=Math.pow(phi2,0.2/(Math.PI*2));
          if(vr>24)break;
          ctx.lineTo(vr*Math.cos(va),vr*Math.sin(va));
        }
        ctx.stroke();ctx.restore();
      }
      // Very faint center glow
      const vcg=ctx.createRadialGradient(0,0,0,0,0,10);
      vcg.addColorStop(0,`rgba(200,160,50,${vPulse*1.5})`);
      vcg.addColorStop(1,'rgba(200,160,50,0)');
      ctx.fillStyle=vcg;ctx.beginPath();ctx.arc(0,0,10,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
    // Subtle chakra ambient — only tint the floor area, low opacity
    const cg=ctx.createRadialGradient(VX,H*.75,10,VX,H*.75,160);
    cg.addColorStop(0,`rgba(${cc.r},${cc.g},${cc.b},.07)`);
    cg.addColorStop(1,`rgba(${cc.r},${cc.g},${cc.b},0)`);
    ctx.fillStyle=cg;ctx.fillRect(0,BB,W,H-BB);

    // ── COBWEBS with animated spiders
    const drawCobweb=(ox,oy,r,flip,spiderPhase)=>{
      ctx.save();
      ctx.setTransform(1,0,0,1,0,0); // full reset before any flip
      if(flip){ctx.translate(W,0);ctx.scale(-1,1);}
      // Clip to ceiling triangle so strands don't bleed onto walls/floor
      ctx.beginPath();
      ctx.moveTo(0,0);ctx.lineTo(W,0);ctx.lineTo(BR,BT);ctx.lineTo(BL,BT);ctx.closePath();
      ctx.clip();
      // Web strands
      ctx.strokeStyle='rgba(210,200,180,.38)';ctx.lineWidth=.7;
      for(let a=0;a<7;a++){
        const ang=(a/6)*Math.PI*.65+Math.PI*.9;
        ctx.beginPath();ctx.moveTo(ox,oy);
        ctx.lineTo(ox+r*Math.cos(ang),oy+r*Math.sin(ang));ctx.stroke();
      }
      // Concentric rings
      for(let ri=1;ri<=4;ri++){
        ctx.strokeStyle=`rgba(210,200,180,${.32-ri*.04})`;ctx.lineWidth=.6;
        ctx.beginPath();
        for(let a=0;a<=7;a++){
          const ang=(a/6)*Math.PI*.65+Math.PI*.9;
          const rx2=ox+ri*(r/4)*Math.cos(ang),ry2=oy+ri*(r/4)*Math.sin(ang);
          a===0?ctx.moveTo(rx2,ry2):ctx.lineTo(rx2,ry2);
        }
        ctx.stroke();
      }
      // Spider — larger and more visible
      const spiderAng=Math.PI*1.05+Math.sin(flickerT*.8+spiderPhase)*.4;
      const spiderDist=(1.8+Math.sin(flickerT*.5+spiderPhase)*.7)*(r/4);
      const sx=ox+spiderDist*Math.cos(spiderAng),sy=oy+spiderDist*Math.sin(spiderAng);
      // Drop thread
      ctx.strokeStyle='rgba(210,200,180,.3)';ctx.lineWidth=.5;
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(sx,sy);ctx.stroke();
      // Body
      ctx.fillStyle='rgba(18,12,6,.92)';ctx.strokeStyle='rgba(80,60,20,.5)';ctx.lineWidth=.5;
      ctx.beginPath();ctx.ellipse(sx,sy,5.5,4,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      // Head
      ctx.beginPath();ctx.ellipse(sx,sy-4,3.5,3,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      // Eyes (tiny red dots)
      ctx.fillStyle='rgba(180,30,20,.9)';
      ctx.beginPath();ctx.arc(sx-1.5,sy-5,1,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(sx+1.5,sy-5,1,0,Math.PI*2);ctx.fill();
      // Legs
      ctx.strokeStyle='rgba(18,12,6,.75)';ctx.lineWidth=1;
      for(let l=0;l<4;l++){
        const legSwing=Math.sin(flickerT*4+l*.9+spiderPhase)*.3;
        const la=-1+l*.6+legSwing;
        // Left legs
        ctx.beginPath();ctx.moveTo(sx-3,sy-1);
        ctx.quadraticCurveTo(sx-10-l*2,sy+la*4,sx-14-l*2,sy+la*6);ctx.stroke();
        // Right legs
        ctx.beginPath();ctx.moveTo(sx+3,sy-1);
        ctx.quadraticCurveTo(sx+10+l*2,sy+la*4,sx+14+l*2,sy+la*6);ctx.stroke();
      }
      ctx.restore();
    };
    // Cobwebs — draw after full transform reset
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
    drawCobweb(22,18,58,false,0);
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
    drawCobweb(22,18,58,true,1.4);
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
    drawCobweb(38,42,34,false,2.8);
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
    drawCobweb(W-44,32,40,false,0.7);
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;

    // ── WALL-WALKING SPIDER (entry/corridor rooms) ────────
    // Spider walks down left wall, across floor, up right wall
    if(room.type==='corridor'||room.type==='dead-end'){
      const spCycle=flickerT%18;
      // Phase 0-5: down left wall; 5-11: across floor; 11-16: up right wall
      let spX,spY,spAngle;
      if(spCycle<5){
        const p=spCycle/5;
        spX=8+p*4;
        spY=40+p*(H-100);
        spAngle=Math.PI/2;
      } else if(spCycle<11){
        const p=(spCycle-5)/6;
        spX=12+p*(W-24);
        spY=H-55+Math.sin(p*Math.PI*3)*8;
        spAngle=0;
      } else if(spCycle<16){
        const p=(spCycle-11)/5;
        spX=W-8-p*4;
        spY=H-55-p*(H-100);
        spAngle=-Math.PI/2;
      } else {
        spX=-100;spY=-100;spAngle=0; // hidden
      }
      if(spX>-50){
        ctx.save();ctx.translate(spX,spY);ctx.rotate(spAngle);
        // Thread behind
        ctx.strokeStyle='rgba(200,190,170,.22)';ctx.lineWidth=.5;
        if(spCycle<5){ctx.beginPath();ctx.moveTo(0,-spY+22);ctx.lineTo(0,0);ctx.stroke();}
        else if(spCycle<11){ctx.beginPath();ctx.moveTo(-spX+12,0);ctx.lineTo(0,0);ctx.stroke();}
        // Body
        ctx.fillStyle='rgba(18,12,6,.9)';
        ctx.beginPath();ctx.ellipse(0,0,5,4,0,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.ellipse(0,-4,3.5,3,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(180,25,15,1)';
        ctx.beginPath();ctx.arc(-1.5,-5,1,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.arc(1.5,-5,1,0,Math.PI*2);ctx.fill();
        // Legs
        ctx.strokeStyle='rgba(14,9,4,.78)';ctx.lineWidth=.9;
        for(let l=0;l<4;l++){
          const lsw=Math.sin(flickerT*8+l*.8)*.4;
          const la=-1.2+l*.7+lsw;
          ctx.beginPath();ctx.moveTo(-2,0);ctx.quadraticCurveTo(-8-l*2,la*5,-12-l*3,la*7);ctx.stroke();
          ctx.beginPath();ctx.moveTo(2,0);ctx.quadraticCurveTo(8+l*2,la*5,12+l*3,la*7);ctx.stroke();
        }
        ctx.restore();
      }
    }

    // ── RAPPELLING SPIDER (side/chamber rooms) ────────────
    // Spider descends from ceiling on a line, spins, ascends
    if(room.type==='side'||room.type==='chamber'){
      const rpCycle=flickerT%14;
      // Phase 0-3: descend; 3-9: hang and spin; 9-12: ascend; 12-14: hidden
      const rpX=W*.62;
      let rpY,rpVisible=true;
      let spinAngle=0;
      if(rpCycle<3){const p=rpCycle/3;rpY=22+p*180;}
      else if(rpCycle<9){rpY=202;spinAngle=(rpCycle-3)*Math.PI*1.5;}
      else if(rpCycle<12){const p=(rpCycle-9)/3;rpY=202-p*180;}
      else{rpVisible=false;rpY=22;}

      if(rpVisible){
        // Thread line from ceiling
        ctx.strokeStyle='rgba(200,190,170,.35)';ctx.lineWidth=.6;
        ctx.beginPath();ctx.moveTo(rpX,0);ctx.lineTo(rpX,rpY);ctx.stroke();
        ctx.save();ctx.translate(rpX,rpY);ctx.rotate(spinAngle);
        // Web blob
        if(rpCycle>=3&&rpCycle<9){
          ctx.strokeStyle='rgba(200,190,170,.22)';ctx.lineWidth=.5;
          for(let w=0;w<6;w++){
            const wa=(w/6)*Math.PI*2;
            ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(wa)*10,Math.sin(wa)*10);ctx.stroke();
          }
          for(let ri=1;ri<=2;ri++){
            ctx.beginPath();ctx.arc(0,0,ri*5,0,Math.PI*2);ctx.stroke();
          }
        }
        // Spider body
        ctx.fillStyle='rgba(18,12,6,.92)';
        ctx.beginPath();ctx.ellipse(0,0,5,4,0,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.ellipse(0,-4,3.5,3,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(180,25,15,1)';
        ctx.beginPath();ctx.arc(-1.5,-5,1,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.arc(1.5,-5,1,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='rgba(14,9,4,.75)';ctx.lineWidth=.9;
        for(let l=0;l<4;l++){
          const lsw=Math.sin(flickerT*6+l)*.3;
          ctx.beginPath();ctx.moveTo(-2,0);ctx.quadraticCurveTo(-8,lsw*6,-11,lsw*9);ctx.stroke();
          ctx.beginPath();ctx.moveTo(2,0);ctx.quadraticCurveTo(8,lsw*6,11,lsw*9);ctx.stroke();
        }
        ctx.restore();
      }
    }

    // ── RATS — sparse random appearances ─────────────────
    // 30s cycle. Rats appear in only 3 short windows out of 30s.
    // Between windows: no rats at all.
    const ratCycle=flickerT%30;
    const ratWindows=[
      // [start, end, isAlbino, mode]
      [2,    5,    false, 'lr'],   // brown left→right
      [13,   16,   true,  'fwd'],  // albino toward viewer
      [24,   27,   false, 'rl'],   // brown right→left
    ];

    const drawRat=(ratX,ratY,ratScale,ratAngle,ratFlipX,isAlbino)=>{
      if(ratX<-30||ratX>W+30||ratY<BB-20||ratY>H+10)return;
      ctx.save();
      ctx.translate(ratX,ratY);ctx.rotate(ratAngle);
      if(ratFlipX)ctx.scale(-1,1);
      ctx.scale(ratScale,ratScale);
      const legSwing2=Math.sin(flickerT*10)*4; // slower legs
      const bodyCol=isAlbino?'rgba(232,222,210,.95)':'rgba(68,52,32,.96)';
      const bellyCol=isAlbino?'rgba(252,238,232,.45)':'rgba(105,82,50,.50)';
      const eyeCol=isAlbino?'rgba(220,20,20,1)':'rgba(210,25,15,1)';
      const earCol=isAlbino?'rgba(218,168,158,.82)':'rgba(88,48,38,.82)';
      const tailCol=isAlbino?'rgba(208,188,178,.82)':'rgba(55,40,25,.85)';
      // Shadow
      ctx.fillStyle='rgba(0,0,0,.22)';
      ctx.beginPath();ctx.ellipse(1,13,14,4,0,0,Math.PI*2);ctx.fill();
      // Tail
      ctx.strokeStyle=tailCol;ctx.lineWidth=2;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(-14,2);
      ctx.bezierCurveTo(-26,12,-36,5,-40,-2);ctx.stroke();
      // Body
      ctx.fillStyle=bodyCol;
      ctx.beginPath();ctx.ellipse(0,0,16,9,.12,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=bellyCol;
      ctx.beginPath();ctx.ellipse(1,3,10,5,.12,0,Math.PI*2);ctx.fill();
      // Head
      ctx.fillStyle=bodyCol;
      ctx.beginPath();ctx.ellipse(15,-3,9,7,.28,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(23,-2,4,3,.1,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=isAlbino?'rgba(238,138,138,.88)':'rgba(178,55,55,.88)';
      ctx.beginPath();ctx.arc(26,-2,1.8,0,Math.PI*2);ctx.fill();
      // Whiskers
      ctx.strokeStyle=isAlbino?'rgba(198,178,158,.52)':'rgba(198,178,138,.52)';ctx.lineWidth=.6;
      [[-1,0],[0,-2],[1,-4]].forEach(([dy,da])=>{
        ctx.beginPath();ctx.moveTo(22,-2+dy);ctx.lineTo(32,-1+dy+da);ctx.stroke();
        ctx.beginPath();ctx.moveTo(22,-2+dy);ctx.lineTo(32,-3+dy-da);ctx.stroke();
      });
      ctx.fillStyle=eyeCol;ctx.beginPath();ctx.arc(17,-7,2.2,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,200,200,.45)';ctx.beginPath();ctx.arc(16,-8,0.8,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=earCol;ctx.beginPath();ctx.ellipse(12,-11,5,3.5,-.4,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=isAlbino?'rgba(178,158,148,.65)':'rgba(52,38,22,.78)';ctx.lineWidth=1.5;
      [[-8],[0],[8],[14]].forEach(([lx],i)=>{
        const sw=Math.sin(flickerT*10+i*1.6)*legSwing2;
        ctx.beginPath();ctx.moveTo(lx,6);ctx.lineTo(lx-1,16+sw);ctx.stroke();
      });
      ctx.restore();
    };

    ratWindows.forEach(([start,end,isAlbino,mode])=>{
      if(ratCycle<start||ratCycle>end)return;
      const p=(ratCycle-start)/(end-start);
      let rx,ry,rs=1,ra=0,rfx=false;
      if(mode==='lr'){rx=-20+p*(W+40);ry=H-44+Math.sin(p*Math.PI*5)*3;rfx=false;}
      else if(mode==='rl'){rx=W+20-p*(W+40);ry=H-52+Math.sin(p*Math.PI*4)*3;rfx=true;}
      else if(mode==='fwd'){rx=VX+Math.sin(p*Math.PI*3)*45;ry=BB+30+p*(H-BB-80);rs=0.5+p*0.7;ra=Math.sin(p*Math.PI*3)*.2;rfx=p>.5;}
      drawRat(rx,ry,rs,ra,rfx,isAlbino);
    });

    // ── CANOPIC JARS & SCARABS (floor dressing)
    const drawJar=(jx,jy,sc)=>{
      const bh=56*sc;
      ctx.beginPath();ctx.ellipse(jx,jy,11*sc,4*sc,0,0,Math.PI*2);
      ctx.fillStyle='#8a6020';ctx.strokeStyle='#3a2008';ctx.lineWidth=.8;ctx.fill();ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(jx-11*sc,jy);
      ctx.bezierCurveTo(jx-13*sc,jy-18*sc,jx-9*sc,jy-46*sc,jx,jy-bh);
      ctx.bezierCurveTo(jx+9*sc,jy-46*sc,jx+13*sc,jy-18*sc,jx+11*sc,jy);
      ctx.closePath();ctx.fillStyle='#5a3e12';ctx.fill();ctx.stroke();
      ctx.strokeStyle='#c8a030';ctx.lineWidth=1.1*sc;
      [-10,-24,-40].forEach(dy=>{ctx.beginPath();ctx.ellipse(jx,jy+dy*sc,Math.max(2,(7+dy*.1)*sc),2.2*sc,0,0,Math.PI*2);ctx.stroke();});
      ctx.fillStyle='rgba(200,150,50,.6)';ctx.font=`${6*sc}px serif`;
      ctx.fillText('𓂀',jx-4*sc,jy-28*sc);
      const hy=jy-bh-7*sc;
      ctx.fillStyle='#8a6020';ctx.strokeStyle='#4a3010';ctx.lineWidth=.7*sc;
      ctx.beginPath();ctx.ellipse(jx,hy,7*sc,9*sc,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    };
    drawJar(52,H-28,1.1);drawJar(70,H-24,0.88);drawJar(85,H-20,0.70);
    [[290,H-20,8,4],[320,H-22,6,3],[268,H-18,5,3.5],[352,H-30,7,4]].forEach(([x,y,rx,ry])=>{
      ctx.fillStyle='rgba(200,160,30,.65)';ctx.strokeStyle='rgba(150,110,20,.75)';ctx.lineWidth=.6;
      ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    });

    // ── CANDELABRA (tall single post, left side) ──────────
    {
      const cx=58, cy=H-20;
      const fl2=.7+Math.sin(flickerT*5.8)*.3;
      // Base
      ctx.fillStyle='#6a4a18';ctx.strokeStyle='#8a6020';ctx.lineWidth=.8;
      ctx.beginPath();ctx.ellipse(cx,cy,12,4,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      // Stem — tall post
      ctx.strokeStyle='#7a5818';ctx.lineWidth=3;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,cy-90);ctx.stroke();
      // Mid crossbar
      ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(cx-14,cy-55);ctx.lineTo(cx+14,cy-55);ctx.stroke();
      // Top crossbar
      ctx.beginPath();ctx.moveTo(cx-10,cy-82);ctx.lineTo(cx+10,cy-82);ctx.stroke();
      // 3 candle cups
      [[cx,cy-90],[cx-14,cy-55],[cx+14,cy-55]].forEach(([cx2,cy2],i)=>{
        // Cup
        ctx.fillStyle='#8a6820';ctx.strokeStyle='#c8a030';ctx.lineWidth=.8;
        ctx.beginPath();ctx.moveTo(cx2-5,cy2+2);ctx.lineTo(cx2-3,cy2+8);ctx.lineTo(cx2+3,cy2+8);ctx.lineTo(cx2+5,cy2+2);ctx.closePath();ctx.fill();ctx.stroke();
        // Candle
        ctx.fillStyle='#e8dcc0';ctx.strokeStyle='#c8b890';ctx.lineWidth=.5;
        ctx.beginPath();ctx.roundRect(cx2-3,cy2-14,6,14,1);ctx.fill();ctx.stroke();
        // Wax drips
        ctx.fillStyle='rgba(240,230,200,.6)';
        ctx.beginPath();ctx.ellipse(cx2-2,cy2,1.5,3,.3,0,Math.PI*2);ctx.fill();
        // Flame
        const fs2=.8+Math.sin(flickerT*9+i*1.4)*.2;
        const fa=.7+Math.sin(flickerT*6+i)*.3;
        // Glow halo
        const fg=ctx.createRadialGradient(cx2,cy2-16,0,cx2,cy2-16,18);
        fg.addColorStop(0,`rgba(220,160,40,${.22*fl2})`);fg.addColorStop(1,'rgba(220,160,40,0)');
        ctx.fillStyle=fg;ctx.beginPath();ctx.arc(cx2,cy2-16,18,0,Math.PI*2);ctx.fill();
        // Flame body
        ctx.fillStyle=`rgba(220,150,20,${fa})`;
        ctx.beginPath();ctx.ellipse(cx2,cy2-20,2.5*fs2,5,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=`rgba(255,220,80,${fa*.9})`;
        ctx.beginPath();ctx.ellipse(cx2,cy2-22,1.5*fs2,3.5,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=`rgba(255,250,200,${fa*.7})`;
        ctx.beginPath();ctx.ellipse(cx2,cy2-24,1*fs2,2,0,0,Math.PI*2);ctx.fill();
      });
      // Post light glow on floor
      const pg=ctx.createRadialGradient(cx,cy,0,cx,cy,50);
      pg.addColorStop(0,`rgba(220,160,40,${.12*fl2})`);pg.addColorStop(1,'rgba(220,160,40,0)');
      ctx.fillStyle=pg;ctx.beginPath();ctx.arc(cx,cy,50,0,Math.PI*2);ctx.fill();
    }

    // ── THRONE WITH CROWN (temptation) — side/dead-end rooms
    const hasThroneRoom=room.type==='dead-end'||room.type==='side';
    if(hasThroneRoom){
      const tx=W*.72, ty=H*.64;
      // Throne shadow
      ctx.fillStyle='rgba(0,0,0,.35)';
      ctx.beginPath();ctx.ellipse(tx,ty+8,28,8,0,0,Math.PI*2);ctx.fill();
      // Seat
      const tg=ctx.createLinearGradient(tx-24,ty,tx+24,ty+30);
      tg.addColorStop(0,'#4a3010');tg.addColorStop(1,'#2a1808');
      ctx.fillStyle=tg;ctx.strokeStyle='#8a6020';ctx.lineWidth=1;
      ctx.beginPath();ctx.roundRect(tx-24,ty,48,22,3);ctx.fill();ctx.stroke();
      // Back rest
      ctx.beginPath();ctx.roundRect(tx-22,ty-48,44,50,4);
      const tbg=ctx.createLinearGradient(tx-22,ty-48,tx+22,ty-48);
      tbg.addColorStop(0,'#3a2010');tbg.addColorStop(.5,'#5a3a18');tbg.addColorStop(1,'#3a2010');
      ctx.fillStyle=tbg;ctx.fill();ctx.stroke();
      // Gold details on throne
      ctx.strokeStyle='rgba(200,160,40,.55)';ctx.lineWidth=.8;
      ctx.beginPath();ctx.roundRect(tx-18,ty-44,36,44,3);ctx.stroke();
      [[tx-20,ty-20],[tx+20,ty-20],[tx-20,ty+4],[tx+20,ty+4]].forEach(([px2,py2])=>{
        ctx.fillStyle='#c8a030';ctx.beginPath();ctx.arc(px2,py2,3.5,0,Math.PI*2);ctx.fill();
      });
      // Armrests
      ctx.fillStyle='#4a3010';ctx.strokeStyle='#8a6020';ctx.lineWidth=.8;
      ctx.beginPath();ctx.roundRect(tx-28,ty-8,8,24,2);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.roundRect(tx+20,ty-8,8,24,2);ctx.fill();ctx.stroke();
      // Crown sitting on throne
      const crY=ty-62;
      // Crown glow
      const crG=ctx.createRadialGradient(tx,crY,0,tx,crY,26);
      crG.addColorStop(0,`rgba(220,180,40,${.25+Math.sin(flickerT*2.8)*.12})`);
      crG.addColorStop(1,'rgba(220,180,40,0)');
      ctx.fillStyle=crG;ctx.beginPath();ctx.arc(tx,crY,26,0,Math.PI*2);ctx.fill();
      // Crown base band
      ctx.fillStyle='#c8a020';ctx.strokeStyle='#8a6010';ctx.lineWidth=.8;
      ctx.beginPath();ctx.roundRect(tx-16,crY-4,32,12,2);ctx.fill();ctx.stroke();
      // Crown points (5 points)
      const pts=[[-14,-16],[-8,-22],[0,-26],[8,-22],[14,-16]];
      pts.forEach(([dx,dy])=>{
        ctx.beginPath();
        ctx.moveTo(tx+dx,crY-4);
        ctx.lineTo(tx+dx-3,crY+dy);
        ctx.lineTo(tx+dx,crY+dy-4);
        ctx.lineTo(tx+dx+3,crY+dy);
        ctx.lineTo(tx+dx+6,crY-4);
        ctx.fillStyle='#c8a020';ctx.fill();ctx.strokeStyle='#8a6010';ctx.lineWidth=.6;ctx.stroke();
      });
      // Gems on crown
      [[tx-10,crY+2,'#c0392b'],[tx,crY+2,'#1a6fa8'],[tx+10,crY+2,'#6c3483']].forEach(([gx,gy,gc])=>{
        ctx.fillStyle=gc;ctx.beginPath();ctx.arc(gx,gy,3,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,.4)';ctx.beginPath();ctx.arc(gx-1,gy-1,1,0,Math.PI*2);ctx.fill();
      });
    }

    // ── GOLD TREASURE PILE (temptation) ───────────────────
    // Draw gold coins, goblets, and a small chest in corner
    {
      const gx=room.type==='dead-end'?W*.28:W*.82, gy=H-32;
      // Coin pile shadow
      ctx.fillStyle='rgba(0,0,0,.3)';
      ctx.beginPath();ctx.ellipse(gx,gy+6,30,9,0,0,Math.PI*2);ctx.fill();
      // Scattered coins
      const coinPositions=[
        [gx-18,gy+2,9,4],[gx-8,gy-2,11,5],[gx+2,gy,10,4.5],
        [gx+14,gy+3,8,4],[gx-14,gy+8,7,3.5],[gx+6,gy+7,9,4],
        [gx-22,gy+10,6,3],[gx+20,gy+8,7,3.5],
      ];
      coinPositions.forEach(([cx2,cy2,rx2,ry2],i)=>{
        // Coin body
        ctx.fillStyle=i%3===0?'#c8a020':i%3===1?'#d4aa28':'#b89018';
        ctx.strokeStyle='rgba(100,75,10,.5)';ctx.lineWidth=.5;
        ctx.beginPath();ctx.ellipse(cx2,cy2,rx2,ry2,0,0,Math.PI*2);ctx.fill();ctx.stroke();
        // Highlight
        ctx.fillStyle='rgba(255,230,100,.3)';
        ctx.beginPath();ctx.ellipse(cx2-rx2*.3,cy2-ry2*.2,rx2*.4,ry2*.35,-.2,0,Math.PI*2);ctx.fill();
        // Glyph
        if(rx2>8){ctx.fillStyle='rgba(100,75,10,.35)';ctx.font='7px serif';ctx.fillText('𓏏',cx2-4,cy2+3);}
      });
      // Goblet
      const gobx=gx-24,goby=gy-18;
      ctx.fillStyle='#c8a020';ctx.strokeStyle='#8a6810';ctx.lineWidth=.8;
      ctx.beginPath();ctx.moveTo(gobx-6,goby+18);ctx.lineTo(gobx-8,goby);ctx.lineTo(gobx+8,goby);ctx.lineTo(gobx+6,goby+18);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.ellipse(gobx,goby,8,4,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.ellipse(gobx,goby+18,6,3,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      // Red wine spill
      ctx.fillStyle='rgba(120,20,20,.55)';
      ctx.beginPath();ctx.ellipse(gobx+8,goby+12,8,4,.3,0,Math.PI*2);ctx.fill();
      // Gem glints
      const treasureGlow=ctx.createRadialGradient(gx,gy,0,gx,gy,40);
      treasureGlow.addColorStop(0,`rgba(220,180,40,${.14+Math.sin(flickerT*2)*.07})`);
      treasureGlow.addColorStop(1,'rgba(220,180,40,0)');
      ctx.fillStyle=treasureGlow;ctx.beginPath();ctx.arc(gx,gy,40,0,Math.PI*2);ctx.fill();
    }

    // ── SANDY TEXTURE
    for(let i=0;i<70;i++){
      const sx=30+((i*137.5)%330),sy=BB+20+((i*79)%(H-BB-30));
      ctx.fillStyle=`rgba(196,148,50,${.06+((i*41)%20)*.005})`;
      ctx.beginPath();ctx.arc(sx,sy,.3+((i*53)%8)*.08,0,Math.PI*2);ctx.fill();
    }
    // Floor crack
    ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=1.1;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(196,BB);ctx.lineTo(193,BB+80);ctx.lineTo(197,BB+160);ctx.lineTo(191,BB+250);ctx.lineTo(195,H-20);ctx.stroke();
    ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(193,BB+80);ctx.lineTo(205,BB+100);ctx.stroke();
    ctx.beginPath();ctx.moveTo(197,BB+160);ctx.lineTo(185,BB+185);ctx.stroke();

    // ── ROCKS ─────────────────────────────────────────────
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
    room.rocks&&room.rocks.forEach(rock=>{
      const rx=rock.x*W,ry=rock.y*H;
      const isCracked=cracked[rock.id];
      const isGemRock=rock.type==='gem';
      const si=rock.id.charCodeAt(1)%5;
      const rockType=rock.type||'normal';

      // Shadow
      ctx.beginPath();ctx.ellipse(rx+2,ry+5,23,8,0,0,Math.PI*2);
      ctx.fillStyle='rgba(0,0,0,.42)';ctx.fill();

      if(!isCracked){
        // Variety by type
        const baseColors={
          normal:['#6a4e2a','#7a5a30','#5a3e1e','#8a6838','#4a3018'],
          mossy:['#4a6a2a','#5a7a30','#3a5a1e','#6a7838','#3a5018'],
          carved:['#5a4a3a','#6a5a40','#4a3a28','#7a6848','#3a2e20'],
          glowing:['#4a3a1e','#5a4a2a','#3a2e14','#6a5828','#2a2010'],
          gem:['#6a4e2a','#7a5a30','#5a3e1e','#8a6838','#4a3018'],
        };
        const cols=baseColors[rockType]||baseColors.normal;
        ctx.fillStyle=cols[si];
        ctx.beginPath();ctx.ellipse(rx+3,ry+4,22,14,.15,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=cols[si].replace('6a','7a');
        ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=1;
        ctx.beginPath();ctx.ellipse(rx,ry,22,14,.15,0,Math.PI*2);ctx.fill();ctx.stroke();
        ctx.fillStyle='rgba(190,155,80,.18)';
        ctx.beginPath();ctx.ellipse(rx-6,ry-5,9,6,-.3,0,Math.PI*2);ctx.fill();

        // Type-specific details
        if(rockType==='mossy'){
          ctx.fillStyle='rgba(60,100,40,.45)';
          ctx.beginPath();ctx.ellipse(rx-4,ry-3,8,4,.4,0,Math.PI*2);ctx.fill();
          ctx.beginPath();ctx.ellipse(rx+5,ry-5,5,3,-.2,0,Math.PI*2);ctx.fill();
        }
        if(rockType==='carved'){
          ctx.strokeStyle='rgba(200,160,50,.4)';ctx.lineWidth=.7;
          ctx.beginPath();ctx.moveTo(rx-8,ry-2);ctx.lineTo(rx,ry-8);ctx.lineTo(rx+8,ry-2);ctx.stroke();
          ctx.fillStyle='rgba(200,160,50,.2)';ctx.font='8px serif';
          ctx.fillText('𓂀',rx-4,ry+2);
        }
        if(rockType==='glowing'||isGemRock){
          const ch=rock.chakra!==undefined?CHAKRAS[rock.chakra]:CHAKRAS[0];
          const gAlpha=.15+Math.sin(flickerT*3)*.08;
          const gGlow=ctx.createRadialGradient(rx,ry,0,rx,ry,28);
          gGlow.addColorStop(0,`rgba(${hexRgb(ch.glow).r},${hexRgb(ch.glow).g},${hexRgb(ch.glow).b},${gAlpha})`);
          gGlow.addColorStop(1,'rgba(0,0,0,0)');
          ctx.fillStyle=gGlow;ctx.beginPath();ctx.arc(rx,ry,28,0,Math.PI*2);ctx.fill();
        }
        // Cracks
        ctx.strokeStyle='rgba(0,0,0,.28)';ctx.lineWidth=.8;
        ctx.beginPath();ctx.moveTo(rx-9,ry-2);ctx.quadraticCurveTo(rx,ry-6,rx+9,ry-2);ctx.stroke();
        ctx.beginPath();ctx.moveTo(rx-12,ry+3);ctx.quadraticCurveTo(rx,ry+6,rx+12,ry+3);ctx.stroke();
      } else {
        // Cracked halves
        ctx.beginPath();
        ctx.moveTo(rx-22,ry);ctx.lineTo(rx-4,ry-12);ctx.lineTo(rx+4,ry);ctx.lineTo(rx+22,ry);
        ctx.lineTo(rx+22,ry+10);ctx.lineTo(rx-22,ry+10);ctx.closePath();
        ctx.fillStyle='#261a0c';ctx.strokeStyle='rgba(0,0,0,.55)';ctx.lineWidth=1;ctx.fill();ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(rx-22,ry-2);ctx.lineTo(rx-4,ry-14);ctx.lineTo(rx+4,ry-2);ctx.lineTo(rx+22,ry-2);
        ctx.lineTo(rx+22,ry-12);ctx.lineTo(rx-22,ry-12);ctx.closePath();
        ctx.fillStyle='#1e1408';ctx.fill();ctx.stroke();

        // Gold inside some cracked rocks (based on rock id hash)
        const goldChance=(rock.id.charCodeAt(0)+rock.id.charCodeAt(1))%4;
        if(!isGemRock&&goldChance===0){
          // Small gold coin cluster inside the crack
          [[rx-5,ry-4],[rx+3,ry-6],[rx-1,ry-2]].forEach(([cx2,cy2],gi)=>{
            ctx.fillStyle=`rgba(${200+gi*8},${160+gi*5},${30+gi*4},.85)`;
            ctx.strokeStyle='rgba(120,90,10,.5)';ctx.lineWidth=.5;
            ctx.beginPath();ctx.ellipse(cx2,cy2,4.5,3,0,0,Math.PI*2);ctx.fill();ctx.stroke();
            ctx.fillStyle='rgba(255,230,100,.3)';
            ctx.beginPath();ctx.ellipse(cx2-1.5,cy2-1,1.5,1,-.2,0,Math.PI*2);ctx.fill();
          });
          const goldGlow=ctx.createRadialGradient(rx,ry-4,0,rx,ry-4,18);
          goldGlow.addColorStop(0,'rgba(220,180,40,.28)');goldGlow.addColorStop(1,'rgba(220,180,40,0)');
          ctx.fillStyle=goldGlow;ctx.beginPath();ctx.arc(rx,ry-4,18,0,Math.PI*2);ctx.fill();
        }
        // Small gems/crystals inside some rocks
        if(!isGemRock&&goldChance===2){
          const crysColor=['#9b59b6','#3498db','#27ae60'][si%3];
          [[rx-6,ry-5],[rx+5,ry-7],[rx,ry-3]].forEach(([cx2,cy2],ci)=>{
            ctx.fillStyle=crysColor;ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=.4;
            ctx.beginPath();ctx.moveTo(cx2,cy2-5);ctx.lineTo(cx2+3,cy2);ctx.lineTo(cx2,cy2+2);ctx.lineTo(cx2-3,cy2);ctx.closePath();
            ctx.fill();ctx.stroke();
          });
        }

        if(isGemRock){
          const ch=CHAKRAS[rock.chakra||0];
          const{r:gr,g:gg,b:gb}=hexRgb(ch.glow);
          ctx.beginPath();
          ctx.moveTo(rx,ry-22);ctx.lineTo(rx+10,ry-10);ctx.lineTo(rx+8,ry+2);
          ctx.lineTo(rx,ry+6);ctx.lineTo(rx-8,ry+2);ctx.lineTo(rx-10,ry-10);ctx.closePath();
          ctx.fillStyle=ch.color;ctx.strokeStyle=ch.glow;ctx.lineWidth=.8;ctx.fill();ctx.stroke();
          ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=.5;
          ctx.beginPath();ctx.moveTo(rx,ry-22);ctx.lineTo(rx,ry+6);ctx.stroke();
          ctx.beginPath();ctx.moveTo(rx-10,ry-10);ctx.lineTo(rx+10,ry-10);ctx.stroke();
          ctx.beginPath();ctx.moveTo(rx,ry-22);ctx.lineTo(rx+10,ry-10);ctx.lineTo(rx,ry-12);ctx.closePath();
          ctx.fillStyle='rgba(255,255,255,.3)';ctx.fill();
          const gemGlow=ctx.createRadialGradient(rx,ry-8,0,rx,ry-8,32);
          gemGlow.addColorStop(0,`rgba(${gr},${gg},${gb},.42)`);
          gemGlow.addColorStop(1,`rgba(${gr},${gg},${gb},0)`);
          ctx.fillStyle=gemGlow;ctx.beginPath();ctx.arc(rx,ry-8,32,0,Math.PI*2);ctx.fill();
        }
      }
    });

    // ── FREE GEM (not in rock, just resting)
    if(room.gem&&!collectedGems[room.gem.id]){
      const gx=room.gem.x*W,gy=room.gem.y*H;
      const ch=CHAKRAS[room.gem.chakra];
      const{r:gr,g:gg,b:gb}=hexRgb(ch.glow);
      const bob=Math.sin(flickerT*2.2)*4;
      ctx.beginPath();
      ctx.moveTo(gx,gy-16+bob);ctx.lineTo(gx+9,gy-7+bob);ctx.lineTo(gx+7,gy+3+bob);
      ctx.lineTo(gx,gy+7+bob);ctx.lineTo(gx-7,gy+3+bob);ctx.lineTo(gx-9,gy-7+bob);ctx.closePath();
      ctx.fillStyle=ch.color;ctx.strokeStyle=ch.glow;ctx.lineWidth=1;ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=.6;
      ctx.beginPath();ctx.moveTo(gx,gy-16+bob);ctx.lineTo(gx,gy+7+bob);ctx.stroke();
      ctx.beginPath();ctx.moveTo(gx-9,gy-7+bob);ctx.lineTo(gx+9,gy-7+bob);ctx.stroke();
      ctx.beginPath();ctx.moveTo(gx,gy-16+bob);ctx.lineTo(gx+9,gy-7+bob);ctx.lineTo(gx,gy-8+bob);ctx.closePath();
      ctx.fillStyle='rgba(255,255,255,.32)';ctx.fill();
      const gg2=ctx.createRadialGradient(gx,gy+bob,0,gx,gy+bob,36);
      gg2.addColorStop(0,`rgba(${gr},${gg},${gb},.45)`);
      gg2.addColorStop(1,`rgba(${gr},${gg},${gb},0)`);
      ctx.fillStyle=gg2;ctx.beginPath();ctx.arc(gx,gy+bob,36,0,Math.PI*2);ctx.fill();
    }

    // ── KEY ITEM ──────────────────────────────────────────
    if(room.keyItem&&!heldKeys[room.keyItem.id]){
      const kx=room.keyItem.x*W,ky=room.keyItem.y*H;
      const bob=Math.sin(flickerT*1.8+1)*3;
      // Key shaft
      ctx.strokeStyle='rgba(200,160,40,.9)';ctx.lineWidth=2.5;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(kx,ky-12+bob);ctx.lineTo(kx,ky+8+bob);ctx.stroke();
      // Key bow
      ctx.strokeStyle='rgba(220,180,60,.85)';ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(kx,ky-12+bob,6,0,Math.PI*2);ctx.stroke();
      // Teeth
      ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(kx+2,ky+2+bob);ctx.lineTo(kx+6,ky+2+bob);ctx.stroke();
      ctx.beginPath();ctx.moveTo(kx+2,ky+5+bob);ctx.lineTo(kx+5,ky+5+bob);ctx.stroke();
      // Glow
      const kg=ctx.createRadialGradient(kx,ky+bob,0,kx,ky+bob,28);
      kg.addColorStop(0,'rgba(220,180,60,.3)');kg.addColorStop(1,'rgba(220,180,60,0)');
      ctx.fillStyle=kg;ctx.beginPath();ctx.arc(kx,ky+bob,28,0,Math.PI*2);ctx.fill();
    }

    // ── LOCKED CHEST ─────────────────────────────────────
    if(room.lockedChest){
      const lc=room.lockedChest;
      const lcx=lc.x*W,lcy=lc.y*H;
      const isOpen=opened[lc.id];
      const hasKey=heldKeys[lc.requiresKey];
      const cw=56,ch3=44;
      ctx.fillStyle='rgba(0,0,0,.4)';
      ctx.beginPath();ctx.ellipse(lcx,lcy+ch3/2+5,cw*.55,7,0,0,Math.PI*2);ctx.fill();
      const cbg=ctx.createLinearGradient(lcx-cw/2,lcy,lcx+cw/2,lcy+ch3/2);
      cbg.addColorStop(0,'#2a1a0a');cbg.addColorStop(.5,'#3e2410');cbg.addColorStop(1,'#1e1206');
      ctx.fillStyle=cbg;ctx.strokeStyle=hasKey?'rgba(220,180,60,.6)':'rgba(100,80,40,.4)';ctx.lineWidth=1.2;
      ctx.beginPath();ctx.roundRect(lcx-cw/2,lcy,cw,ch3/2,2);ctx.fill();ctx.stroke();
      ctx.save();
      if(isOpen){ctx.translate(lcx-cw/2,lcy);ctx.rotate(-Math.PI*.72);ctx.translate(-(lcx-cw/2),-lcy);}
      ctx.fillStyle='#3a2010';ctx.strokeStyle=hasKey?'rgba(220,180,60,.5)':'rgba(80,60,30,.4)';ctx.lineWidth=1;
      ctx.beginPath();ctx.roundRect(lcx-cw/2,lcy-ch3/2,cw,ch3/2,2);ctx.fill();ctx.stroke();
      ctx.restore();
      // Lock
      if(!isOpen){
        ctx.fillStyle=hasKey?'rgba(220,180,60,.8)':'rgba(60,50,30,.8)';
        ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=.8;
        ctx.beginPath();ctx.roundRect(lcx-7,lcy-6,14,11,2);ctx.fill();ctx.stroke();
        ctx.strokeStyle=hasKey?'rgba(255,220,80,.8)':'rgba(120,100,60,.5)';ctx.lineWidth=1.5;
        ctx.beginPath();ctx.arc(lcx,lcy-8,4,Math.PI,Math.PI*2);ctx.stroke();
        ctx.beginPath();ctx.moveTo(lcx-4,lcy-8);ctx.lineTo(lcx-4,lcy-4);ctx.stroke();
        ctx.beginPath();ctx.moveTo(lcx+4,lcy-8);ctx.lineTo(lcx+4,lcy-4);ctx.stroke();
        if(!hasKey){
          // Chains
          ctx.strokeStyle='rgba(80,65,35,.55)';ctx.lineWidth=1.5;
          ctx.beginPath();ctx.moveTo(lcx-cw/2,lcy+2);ctx.lineTo(lcx+cw/2,lcy+2);ctx.stroke();
          for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(lcx-cw/2+6+i*12,lcy+2,3,0,Math.PI*2);ctx.stroke();}
        }
      }
      if(!isOpen&&hasKey){
        const t=flickerT;
        const g2=ctx.createRadialGradient(lcx,lcy,0,lcx,lcy,32);
        g2.addColorStop(0,`rgba(220,180,60,${.2+Math.sin(t*3)*.12})`);
        g2.addColorStop(1,'rgba(220,180,60,0)');
        ctx.fillStyle=g2;ctx.beginPath();ctx.arc(lcx,lcy,32,0,Math.PI*2);ctx.fill();
      }
    }

    // ── REGULAR CHEST ─────────────────────────────────────
    if(room.chest){
      const chest=room.chest;
      const chx=chest.x?chest.x*W:VX,chy=chest.y?chest.y*H:H*.78;
      const isOpen=opened[chest.id];
      const cw=58,ch4=46;
      ctx.fillStyle='rgba(0,0,0,.45)';
      ctx.beginPath();ctx.ellipse(chx,chy+ch4/2+5,cw*.57,8,0,0,Math.PI*2);ctx.fill();
      const cbg=ctx.createLinearGradient(chx-cw/2,chy,chx+cw/2,chy+ch4/2);
      cbg.addColorStop(0,'#3a2010');cbg.addColorStop(.5,'#4e2e14');cbg.addColorStop(1,'#2a1808');
      ctx.fillStyle=cbg;ctx.strokeStyle='#7a5020';ctx.lineWidth=1;
      ctx.beginPath();ctx.roundRect(chx-cw/2,chy,cw,ch4/2,2);ctx.fill();ctx.stroke();
      ctx.save();
      if(isOpen){ctx.translate(chx-cw/2,chy);ctx.rotate(-Math.PI*.72);ctx.translate(-(chx-cw/2),-chy);}
      const lidg=ctx.createLinearGradient(chx-cw/2,chy-ch4/2,chx+cw/2,chy);
      lidg.addColorStop(0,'#5a3818');lidg.addColorStop(1,'#4a2e10');
      ctx.fillStyle=lidg;ctx.strokeStyle='#8a5a28';ctx.lineWidth=1;
      ctx.beginPath();ctx.roundRect(chx-cw/2,chy-ch4/2,cw,ch4/2,2);ctx.fill();ctx.stroke();
      ctx.restore();
      ctx.fillStyle=isOpen?chakraColor:'#8a6a28';ctx.strokeStyle='#2a1a08';ctx.lineWidth=.6;
      ctx.beginPath();ctx.roundRect(chx-6,chy-4,12,10,2);ctx.fill();ctx.stroke();
      ctx.fillStyle=isOpen?'rgba(255,255,255,.7)':'#1a0e06';
      ctx.beginPath();ctx.arc(chx,chy+1,2.5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#9a7830';
      [[chx-cw/2+4,chy+4],[chx+cw/2-4,chy+4],[chx-cw/2+4,chy+ch4/2-4],[chx+cw/2-4,chy+ch4/2-4]].forEach(([sx,sy])=>{
        ctx.beginPath();ctx.arc(sx,sy,3,0,Math.PI*2);ctx.fill();
      });
      if(isOpen){
        const og=ctx.createRadialGradient(chx,chy,0,chx,chy,38);
        og.addColorStop(0,`rgba(${cc.r},${cc.g},${cc.b},.4)`);og.addColorStop(1,`rgba(${cc.r},${cc.g},${cc.b},0)`);
        ctx.fillStyle=og;ctx.beginPath();ctx.arc(chx,chy,38,0,Math.PI*2);ctx.fill();
      }
    }

    // ── PORTAL SPIRAL — drawn last so it's on top of everything ──
    if(isPortal){
      const t=flickerT;
      const px=VX, py=VY+10;
      const rot=t*0.8;
      const pulse=.7+Math.sin(t*2.2)*.3;
      ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
      // Repaint back wall dark first
      ctx.fillStyle='#080502';ctx.fillRect(BL,BT,BR-BL,BB-BT);
      // Outer glow
      const portalGlow=ctx.createRadialGradient(px,py,0,px,py,55);
      portalGlow.addColorStop(0,`rgba(180,30,10,${.4*pulse})`);
      portalGlow.addColorStop(.5,`rgba(140,20,8,${.2*pulse})`);
      portalGlow.addColorStop(1,'rgba(120,10,5,0)');
      ctx.fillStyle=portalGlow;ctx.beginPath();ctx.arc(px,py,55,0,Math.PI*2);ctx.fill();
      const phi=1.6180339887;
      ctx.save();ctx.translate(px,py);ctx.rotate(rot);
      for(let arm=0;arm<12;arm++){
        const armAngle=(arm/12)*Math.PI*2;
        ctx.save();ctx.rotate(armAngle);
        ctx.strokeStyle=`rgba(${220-arm*5},${60+arm*4},${20+arm*3},${(.7+Math.sin(t*1.8+arm*.5)*.2)*pulse})`;
        ctx.lineWidth=.8+arm*.04;
        ctx.beginPath();
        let r2=1.5,angle2=0;
        ctx.moveTo(r2*Math.cos(angle2),r2*Math.sin(angle2));
        for(let i=0;i<60;i++){
          angle2+=0.18;r2*=Math.pow(phi,0.18/(Math.PI*2));
          if(r2>32)break;
          ctx.lineTo(r2*Math.cos(angle2),r2*Math.sin(angle2));
        }
        ctx.stroke();ctx.restore();
      }
      for(let ring=1;ring<=5;ring++){
        const ringR=ring*5*pulse;
        const ringAlpha=(.5-ring*.08)+Math.sin(t*2+ring)*.1;
        ctx.strokeStyle=`rgba(220,80,30,${Math.max(0,ringAlpha)})`;
        ctx.lineWidth=ring===1?1.5:.6;
        ctx.beginPath();ctx.arc(0,0,ringR,0,Math.PI*2);ctx.stroke();
      }
      for(let n=0;n<12;n++){
        const na=(n/12)*Math.PI*2+rot*.5;
        const nr=18+Math.sin(t*3+n*.8)*2;
        const nx=nr*Math.cos(na),ny=nr*Math.sin(na);
        const nodeAlpha=.55+Math.sin(t*2.5+n*.6)*.25;
        ctx.fillStyle=`rgba(240,120,40,${nodeAlpha})`;
        ctx.beginPath();ctx.arc(nx,ny,2,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle=`rgba(200,80,30,${nodeAlpha*.5})`;ctx.lineWidth=.5;
        ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(nx*.6,ny*.6);ctx.stroke();
      }
      const coreAlpha=.8+Math.sin(t*4)*.2;
      const coreGrad=ctx.createRadialGradient(0,0,0,0,0,7);
      coreGrad.addColorStop(0,`rgba(255,220,180,${coreAlpha})`);
      coreGrad.addColorStop(.5,`rgba(220,80,30,${coreAlpha*.8})`);
      coreGrad.addColorStop(1,'rgba(180,30,10,0)');
      ctx.fillStyle=coreGrad;ctx.beginPath();ctx.arc(0,0,7,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }

    // ── VIGNETTE — subtle, center transparent
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
    const vg=ctx.createRadialGradient(W/2,H*.65,40,W/2,H*.55,Math.max(W,H)*.75);
    vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(.6,'rgba(0,0,0,.08)');vg.addColorStop(1,'rgba(0,0,0,.45)');
    ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
    const topg=ctx.createLinearGradient(0,0,0,70);
    topg.addColorStop(0,'rgba(0,0,0,.55)');topg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=topg;ctx.fillRect(0,0,W,70);

  },[room,roomId,cracked,gemFound,opened,collectedGems,heldKeys,chakraColor,flickerT]);

  useEffect(()=>{draw();},[draw]);

  const handleClick=useCallback((e)=>{
    const cv=canvasRef.current; if(!cv)return;
    const rect=cv.getBoundingClientRect();
    const mx=(e.clientX-rect.left)*(W/rect.width);
    const my=(e.clientY-rect.top)*(H/rect.height);

    // Treasure pile tap — temptation warning
    {
      const gx=(room.type==='dead-end'?W*.28:W*.82), gy=H-32;
      if(Math.hypot(mx-gx,my-gy)<42){onTemptation('treasure');return;}
    }
    // Throne/crown tap — temptation warning
    if(room.type==='dead-end'||room.type==='side'){
      const tx=W*.72,ty=H*.64;
      if(mx>tx-30&&mx<tx+30&&my>ty-70&&my<ty+30){onTemptation('throne');return;}
    }

    // Portal tap (back wall area)
    if(room.type==='portal'){
      if(mx>BL&&mx<BR&&my>BT&&my<BB+60){onPortalTap();return;}
    }
    // Rocks
    if(room.rocks){
      for(const rock of room.rocks){
        const rx=rock.x*W,ry=rock.y*H;
        if(Math.hypot(mx-rx,my-ry)<30&&!cracked[rock.id]){onRockClick(rock);return;}
      }
    }
    // Free gem
    if(room.gem&&!collectedGems[room.gem.id]){
      const gx=room.gem.x*W,gy=room.gem.y*H;
      if(Math.hypot(mx-gx,my-gy)<28){onGemClick(room.gem);return;}
    }
    // Key item
    if(room.keyItem&&!heldKeys[room.keyItem.id]){
      const kx=room.keyItem.x*W,ky=room.keyItem.y*H;
      if(Math.hypot(mx-kx,my-ky)<28){onKeyClick(room.keyItem);return;}
    }
    // Locked chest
    if(room.lockedChest&&!opened[room.lockedChest.id]){
      const lcx=room.lockedChest.x*W,lcy=room.lockedChest.y*H;
      if(mx>lcx-34&&mx<lcx+34&&my>lcy-34&&my<lcy+34){onChestClick({...room.lockedChest,locked:true});return;}
    }
    // Regular chest
    if(room.chest&&!opened[room.chest.id]){
      const chx=(room.chest.x||.5)*W,chy=(room.chest.y||.78)*H;
      if(mx>chx-34&&mx<chx+34&&my>chy-34&&my<chy+34){onChestClick(room.chest);return;}
    }
  },[room,cracked,opened,collectedGems,heldKeys,onRockClick,onChestClick,onGemClick,onKeyClick]);

  // ── INTERACTIVE HOTSPOTS ──────────────────────────────────────
  // Real HTML tap targets layered exactly over the canvas, one per
  // interactive object. Generous size + a pulsing ring so the player
  // can SEE what to touch and reliably hit it (esp. on phones).
  const hotspots=[];
  (room.rocks||[]).forEach((rock,i)=>{
    if(!cracked[rock.id]) hotspots.push({key:'rk_'+rock.id,x:(rock.x??(.3+i*.2)),y:(rock.y??.8),kind:rock.type==='gem'?'gem':'rock',onClick:()=>onRockClick(rock)});
  });
  if(room.gem&&!collectedGems[room.gem.id])
    hotspots.push({key:'gm_'+room.gem.id,x:(room.gem.x??.5),y:(room.gem.y??.62),kind:'gem',onClick:()=>onGemClick(room.gem)});
  if(room.keyItem&&!heldKeys[room.keyItem.id])
    hotspots.push({key:'ky_'+room.keyItem.id,x:(room.keyItem.x??.5),y:(room.keyItem.y??.7),kind:'key',onClick:()=>onKeyClick(room.keyItem)});
  if(room.lockedChest&&!opened[room.lockedChest.id])
    hotspots.push({key:'lc_'+room.lockedChest.id,x:(room.lockedChest.x??.5),y:(room.lockedChest.y??.78),kind:'chest',onClick:()=>onChestClick({...room.lockedChest,locked:true})});
  if(room.chest&&!opened[room.chest.id])
    hotspots.push({key:'ch_'+room.chest.id,x:(room.chest.x??.5),y:(room.chest.y??.78),kind:'chest',onClick:()=>onChestClick(room.chest)});
  if(room.type==='portal')
    hotspots.push({key:'portal',x:(BL+BR)/2/W,y:(BT+BB)/2/H,kind:'portal',onClick:()=>onPortalTap()});

  const HS={
    rock:{size:54,ring:'rgba(200,180,150,0.45)',dot:'rgba(210,190,160,0.22)',label:'crack'},
    gem:{size:58,ring:'rgba(120,230,200,0.8)',dot:'rgba(120,230,200,0.28)',label:'collect'},
    key:{size:58,ring:'rgba(240,200,90,0.85)',dot:'rgba(240,200,90,0.3)',label:'take'},
    chest:{size:66,ring:'rgba(240,190,90,0.8)',dot:'rgba(240,190,90,0.26)',label:'open'},
    portal:{size:120,ring:'rgba(220,90,50,0.8)',dot:'rgba(220,90,50,0.22)',label:'enter'},
  };

  return (
    <div style={{position:'relative',height:'100%',width:'auto',flexShrink:0}}>
      <style>{`
        @keyframes hs-pulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.55}50%{transform:translate(-50%,-50%) scale(1.18);opacity:1}}
        .hs-btn{position:absolute;border:none;background:none;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;}
        .hs-ring{position:absolute;left:50%;top:50%;border-radius:50%;border:2px solid var(--rc);box-shadow:0 0 12px var(--rc),inset 0 0 10px var(--dc);animation:hs-pulse 1.9s ease-in-out infinite;pointer-events:none;}
        .hs-core{width:7px;height:7px;border-radius:50%;background:var(--rc);box-shadow:0 0 8px var(--rc);}
        .hs-btn:active .hs-ring{animation:none;transform:translate(-50%,-50%) scale(.86);}
      `}</style>
      <canvas ref={canvasRef} width={W} height={H}
        onClick={handleClick}
        style={{display:'block',height:'100%',width:'auto',aspectRatio:`${W} / ${H}`,cursor:'pointer'}}/>
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        {hotspots.map(h=>{
          const c=HS[h.kind]||HS.rock;
          return (
            <button key={h.key} className="hs-btn" onClick={(e)=>{e.stopPropagation();h.onClick();}}
              aria-label={c.label}
              style={{left:`${h.x*100}%`,top:`${h.y*100}%`,width:c.size,height:c.size,pointerEvents:'all','--rc':c.ring,'--dc':c.dot}}>
              <span className="hs-ring" style={{width:c.size,height:c.size}}/>
              <span className="hs-core"/>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── D-PAD ─────────────────────────────────────────────────────
function DPad({exits,onMove,disabled}) {
  const Btn=({dir,label})=>{
    const avail=!!exits[dir];
    return (
      <button
        onPointerDown={(e)=>{e.stopPropagation();if(avail&&!disabled)onMove(dir);}}
        style={{
          width:60,height:60,borderRadius:14,
          background:avail?'rgba(220,140,30,.18)':'rgba(255,255,255,.04)',
          border:`1.5px solid ${avail?'rgba(220,140,30,.55)':'rgba(255,255,255,.07)'}`,
          color:avail?'#e8a820':'rgba(255,255,255,.12)',
          fontSize:24,cursor:avail&&!disabled?'pointer':'default',
          display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:avail?'0 2px 14px rgba(220,140,30,.22)':'none',
          transition:'all .18s',WebkitTapHighlightColor:'transparent',
          touchAction:'manipulation',userSelect:'none',
        }}
      >{label}</button>
    );
  };
  return (
    <div style={{display:'grid',gridTemplateColumns:'60px 60px 60px',gridTemplateRows:'60px 60px',gap:10,alignItems:'center',justifyItems:'center'}}>
      <div/><Btn dir="forward" label="↑"/><div/>
      <Btn dir="left" label="←"/><Btn dir="back" label="↓"/><Btn dir="right" label="→"/>
    </div>
  );
}

// ── QUESTION OVERLAY ──────────────────────────────────────────
// Extra wrong-answer prompts so pool varies each visit
const WRONG_REFLECTIONS=[
  'The still point does not move. Try again.',
  'Look again — the answer came before the question.',
  'Not that path. The model already gave you the key.',
  'The wave is not the watcher. Return to the center.',
  'Polarity divides. The observer unifies. Look once more.',
];
function QuestionOverlay({question,onAnswer,onExit,onCancel}) {
  const [chosen,setChosen]=useState(null);
  const [shake,setShake]=useState(false);
  const [wrongMsg]=useState(WRONG_REFLECTIONS[Math.floor(Math.random()*WRONG_REFLECTIONS.length)]);
  // Randomise choice order once on mount
  const [shuffled]=useState(()=>[...question.choices].sort(()=>Math.random()-.5));
  const pick=c=>{
    setChosen(c);
    if(!c.correct){setShake(true);setTimeout(()=>setShake(false),700);}
    else setTimeout(()=>onAnswer(true),900);
  };
  return (
    <div style={{position:'absolute',inset:0,background:'rgba(4,2,1,.93)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:30,padding:'0 22px'}}>
      <style>{`@keyframes qsh{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`}</style>
      <div style={{color:'rgba(220,168,32,.55)',fontSize:10,letterSpacing:'.14em',textTransform:'uppercase',marginBottom:14,fontFamily:'DM Sans,sans-serif',fontStyle:'normal'}}>The Path Requires an Answer</div>
      <div style={{color:'rgba(240,228,200,.9)',fontSize:14,fontFamily:'Playfair Display,serif',fontStyle:'italic',textAlign:'center',lineHeight:1.68,marginBottom:28}}>{question.text}</div>
      <div style={{display:'flex',gap:14,animation:shake?'qsh .65s ease':'none'}}>
        {shuffled.map((c,i)=>{
          const isCh=chosen?.symbol===c.symbol,isW=isCh&&!c.correct,isR=isCh&&c.correct;
          return (
            <div key={i} onClick={()=>!chosen&&pick(c)} style={{
              width:80,padding:'15px 8px',borderRadius:14,textAlign:'center',cursor:chosen?'default':'pointer',
              border:`1px solid ${isR?'#e8a820':isW?'#c03030':'rgba(220,168,32,.28)'}`,
              background:isR?'rgba(220,168,32,.12)':isW?'rgba(192,48,48,.1)':'rgba(220,168,32,.04)',
              transition:'all .28s',
            }}>
              <div style={{fontSize:26,color:isR?'#e8a820':isW?'#c03030':'rgba(220,168,32,.72)',marginBottom:7}}>{c.symbol}</div>
              <div style={{color:'rgba(200,180,140,.55)',fontSize:10,fontFamily:'DM Sans,sans-serif'}}>{c.label}</div>
            </div>
          );
        })}
      </div>
      {chosen&&!chosen.correct&&(
        <div style={{marginTop:18,textAlign:'center'}}>
          <div style={{color:'rgba(220,168,32,.65)',fontSize:13,fontFamily:'Playfair Display,serif',fontStyle:'italic',marginBottom:14,lineHeight:1.6}}>{wrongMsg}</div>
          <div style={{display:'flex',gap:12,justifyContent:'center'}}>
            <div onClick={()=>setChosen(null)} style={{border:'1px solid rgba(220,168,32,.35)',borderRadius:8,padding:'8px 18px',color:'rgba(220,168,32,.7)',fontSize:12,cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}>Try again</div>
            <div onClick={onExit} style={{border:'1px solid rgba(180,60,30,.35)',borderRadius:8,padding:'8px 18px',color:'rgba(180,100,60,.7)',fontSize:12,cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}>← Surface</div>
          </div>
        </div>
      )}
      {/* Always offer a way back so the junction is never a trap */}
      {!chosen&&(
        <div onClick={onCancel} style={{marginTop:26,color:'rgba(220,168,32,.5)',fontSize:12,cursor:'pointer',fontFamily:'DM Sans,sans-serif',letterSpacing:'.04em',borderBottom:'1px solid rgba(220,168,32,.2)',paddingBottom:2}}>
          ← step back to the junction
        </div>
      )}
    </div>
  );
}

// ── CLUE POPUP ───────────────────────────────────────────────
function CluePopup({text,onClose}) {
  return (
    <div style={{position:'absolute',inset:0,background:'rgba(4,2,1,.9)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:30,padding:'0 30px'}}>
      <div style={{background:'#1e1508',border:'1px solid rgba(220,168,32,.32)',borderRadius:16,padding:'22px 20px',maxWidth:295,width:'100%'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
          <span style={{color:'rgba(220,168,32,.9)',fontSize:14,lineHeight:1}}>📜</span>
          <span style={{color:'rgba(220,168,32,.8)',fontSize:10,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:600,fontFamily:'DM Sans,sans-serif',fontStyle:'normal'}}>Clue</span>
        </div>
        <p style={{color:'rgba(240,228,200,.88)',fontSize:13,fontFamily:'Playfair Display,serif',fontStyle:'italic',lineHeight:1.72,marginBottom:20,margin:'0 0 20px'}}>{text}</p>
        <div onClick={onClose} style={{color:'rgba(220,168,32,.6)',fontSize:12,cursor:'pointer',textAlign:'center',padding:'8px 0',borderTop:'1px solid rgba(220,168,32,.15)',fontFamily:'DM Sans,sans-serif',fontStyle:'normal'}}>
          close · continue
        </div>
      </div>
    </div>
  );
}

// ── KEY PICKUP POPUP ──────────────────────────────────────────
function KeyPickup({keyItem,onClose}) {
  return (
    <div style={{position:'absolute',inset:0,background:'rgba(4,2,1,.9)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:30,padding:'0 30px'}}>
      <div style={{background:'#1e1508',border:'1px solid rgba(220,180,60,.4)',borderRadius:16,padding:'24px 20px',maxWidth:295,width:'100%',textAlign:'center'}}>
        <div style={{fontSize:32,marginBottom:12,filter:'drop-shadow(0 0 8px rgba(220,180,60,.6))'}}>🗝️</div>
        <div style={{color:'rgba(220,180,60,.9)',fontSize:11,letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600,marginBottom:6}}>Key Found</div>
        <div style={{color:'rgba(240,228,200,.92)',fontSize:16,fontFamily:'Playfair Display,serif',fontWeight:600,marginBottom:8}}>{keyItem.label}</div>
        <div style={{color:'rgba(200,180,140,.65)',fontSize:12,fontStyle:'italic',lineHeight:1.6,marginBottom:20}}>{keyItem.desc}</div>
        <div onClick={onClose} style={{background:'rgba(220,180,60,.15)',border:'1px solid rgba(220,180,60,.35)',borderRadius:8,padding:'10px',color:'rgba(220,180,60,.85)',fontSize:12,cursor:'pointer'}}>
          Pocket the key
        </div>
      </div>
    </div>
  );
}

// ── GEM COLLECT POPUP ─────────────────────────────────────────
function GemCollect({chakra,onClose}) {
  const ch=CHAKRAS[chakra];
  return (
    <div style={{position:'absolute',inset:0,background:'rgba(4,2,1,.93)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:30}}>
      <style>{`@keyframes gem-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @keyframes gem-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}`}</style>
      <div style={{marginBottom:18,animation:'gem-pulse 1.4s ease infinite'}}>
        <svg width="56" height="64" viewBox="0 0 24 28" style={{filter:`drop-shadow(0 0 12px ${ch.glow}) drop-shadow(0 0 24px ${ch.glow}60)`}}>
          <polygon points="12,2 21,8 21,20 12,26 3,20 3,8" fill={ch.color} opacity=".95"/>
          <polygon points="12,2 21,8 12,7" fill="rgba(255,255,255,.6)"/>
          <polygon points="3,8 12,7 12,2" fill={ch.color} opacity=".7"/>
          <line x1="12" y1="2" x2="12" y2="26" stroke="rgba(255,255,255,.25)" strokeWidth=".6"/>
          <line x1="3" y1="14" x2="21" y2="14" stroke="rgba(255,255,255,.18)" strokeWidth=".6"/>
        </svg>
      </div>
      <div style={{color:ch.glow,fontSize:10,letterSpacing:'.14em',textTransform:'uppercase',marginBottom:6}}>Gem Found</div>
      <div style={{color:'rgba(240,228,200,.95)',fontSize:22,fontFamily:'Playfair Display,serif',marginBottom:4}}>{ch.gem}</div>
      <div style={{color:'rgba(200,180,140,.6)',fontSize:12,fontStyle:'italic',marginBottom:24,fontFamily:'Playfair Display,serif'}}>{ch.name} frequency · unlocking</div>
      <div onClick={onClose} style={{border:`1px solid ${ch.color}50`,borderRadius:10,padding:'10px 26px',color:ch.glow,fontSize:12,cursor:'pointer',background:`rgba(${hexRgbStr(ch.color)},.1)`}}>
        Carry it with you
      </div>
    </div>
  );
}

function hexRgbStr(h){
  if(!h||h.length<7)return'200,160,50';
  return`${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)}`;
}

// ── TEMPTATION POPUP ─────────────────────────────────────────
const TEMPTATION_MSGS={
  treasure:[
    'What glitters here is not yours to keep — not yet. The one who hoards before they understand loses the path entirely.',
    'Gold without wisdom is just weight. The treasure you seek cannot be held in hands.',
    'Over-indulgence dulls the frequency. The gems you carry are worth more than all this gold combined.',
    'Every coin here is a distraction wearing the face of reward. The real reward is further in.',
    'You came for something that cannot be spent. Leave this. Keep walking.',
  ],
  throne:[
    'A crown on an empty chair. Sit, and the chair owns you. Power sought before understanding becomes a cage.',
    'The throne is a temptation — a symbol of arrival before the journey is complete. Walk past it.',
    'What would you be king of? The room is a dead end. The crown leads nowhere the real path goes.',
    'Authority without the frequency behind it is theatre. The real throne is the observer seat — and it has no armrests.',
    'Someone left this here. Notice that. Then notice you almost sat down.',
  ],
};
function TemptationPopup({type,onClose}) {
  const isTreasure=type==='treasure';
  const pool=TEMPTATION_MSGS[type]||TEMPTATION_MSGS.treasure;
  const [msg]=useState(pool[Math.floor(Math.random()*pool.length)]);
  return (
    <div style={{position:'absolute',inset:0,background:'rgba(4,2,1,.92)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:30,padding:'0 28px'}}>
      <div style={{background:'#1a1008',border:'1px solid rgba(180,40,20,.35)',borderRadius:16,padding:'24px 20px',maxWidth:295,width:'100%'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
          <span style={{fontSize:20,lineHeight:1}}>{isTreasure?'💰':'👑'}</span>
          <span style={{color:'rgba(200,60,30,.85)',fontSize:10,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:600,fontFamily:'DM Sans,sans-serif',fontStyle:'normal'}}>
            {isTreasure?'Temptation':'The Empty Throne'}
          </span>
        </div>
        <p style={{color:'rgba(240,220,190,.88)',fontSize:13,fontFamily:'Playfair Display,serif',fontStyle:'italic',lineHeight:1.72,margin:'0 0 22px'}}>{msg}</p>
        <div onClick={onClose} style={{color:'rgba(200,60,30,.6)',fontSize:12,cursor:'pointer',textAlign:'center',padding:'8px 0',borderTop:'1px solid rgba(180,40,20,.18)',fontFamily:'DM Sans,sans-serif',fontStyle:'normal'}}>
          Leave it. Continue.
        </div>
      </div>
    </div>
  );
}

// ── PORTAL SCREEN ─────────────────────────────────────────────
function PortalScreen({collectedGems,onEnter,onBack}) {
  const total=Object.keys(collectedGems).length;
  const needed=7;
  const ready=total>=needed;
  return (
    <div style={{position:'absolute',inset:0,background:'rgba(4,2,1,.96)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:30,padding:'0 28px'}}>
      <style>{`@keyframes orb-pulse{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.12);opacity:1}} @keyframes orb-ring{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={{position:'relative',width:100,height:100,marginBottom:24,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{width:70,height:70,borderRadius:'50%',
          background:ready?'radial-gradient(circle,rgba(220,80,40,.9),rgba(160,20,10,.6))':'radial-gradient(circle,rgba(80,60,40,.5),rgba(40,30,20,.4))',
          boxShadow:ready?'0 0 40px rgba(200,50,20,.6),0 0 80px rgba(200,50,20,.2)':'none',
          animation:ready?'orb-pulse 2.2s ease infinite':'none',
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:28,
        }}>
          {ready?'🌀':'⭕'}
        </div>
        {ready&&(
          <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{width:88,height:88,borderRadius:'50%',border:'1px solid rgba(220,80,40,.4)',animation:'orb-ring 8s linear infinite'}}/>
            <div style={{position:'absolute',width:98,height:98,borderRadius:'50%',border:'1px dashed rgba(220,80,40,.2)',animation:'orb-ring 14s linear infinite reverse'}}/>
          </div>
        )}
      </div>
      <div style={{color:'rgba(220,80,40,.8)',fontSize:10,letterSpacing:'.16em',textTransform:'uppercase',marginBottom:10}}>The Portal</div>
      <div style={{color:'rgba(240,228,200,.9)',fontSize:16,fontFamily:'Playfair Display,serif',textAlign:'center',lineHeight:1.65,marginBottom:20}}>
        {ready?'All seven frequencies are yours.\nThe portal recognises you.':'Collect all seven chakra gems\nto open the way forward.'}
      </div>
      <div style={{display:'flex',gap:6,marginBottom:22}}>
        {CHAKRAS.map((c,i)=>{
          const have=Object.values(collectedGems).some(g=>g.chakra===i);
          return (
            <div key={i} style={{width:10,height:10,borderRadius:'50%',
              background:have?c.color:'rgba(255,255,255,.08)',
              boxShadow:have?`0 0 8px ${c.glow}`:'none',
              transition:'all .6s',
            }}/>
          );
        })}
      </div>
      <div style={{color:'rgba(200,180,140,.55)',fontSize:11,marginBottom:24}}>
        {total} / {needed} frequencies gathered
      </div>
      {ready?(
        <div onClick={onEnter} style={{background:'rgba(200,50,20,.2)',border:'1px solid rgba(220,80,40,.5)',borderRadius:12,padding:'13px 32px',color:'rgba(230,120,60,.9)',fontSize:14,cursor:'pointer',fontFamily:'Playfair Display,serif',fontStyle:'italic'}}>
          Enter the Portal
        </div>
      ):(
        <div onClick={onBack} style={{color:'rgba(220,168,32,.5)',fontSize:12,cursor:'pointer',fontStyle:'italic',fontFamily:'Playfair Display,serif'}}>
          ← Return and search deeper
        </div>
      )}
    </div>
  );
}

// ── FLOATING ORBS ─────────────────────────────────────────────
function FloatingOrbs({collectedGems,flickerT}) {
  const gems=Object.values(collectedGems);
  if(gems.length===0)return null;
  return (
    <div style={{position:'absolute',bottom:30,left:14,display:'flex',gap:4,zIndex:10,pointerEvents:'none'}}>
      {gems.map((g,i)=>{
        const ch=CHAKRAS[g.chakra];
        const bob=Math.sin(flickerT*2.2+i*.9)*3;
        return (
          <div key={i} style={{
            width:18,height:18,borderRadius:'50%',
            background:`radial-gradient(circle,${ch.glow}80,${ch.color})`,
            border:`1px solid ${ch.glow}60`,
            boxShadow:`0 0 8px ${ch.glow}80`,
            transform:`translateY(${bob}px)`,
            transition:'transform .1s',
          }}/>
        );
      })}
    </div>
  );
}

// ── KEY INVENTORY ─────────────────────────────────────────────
function KeyInventory({heldKeys}) {
  const keys=Object.values(heldKeys);
  if(keys.length===0)return null;
  return (
    <div style={{position:'absolute',top:52,right:12,display:'flex',flexDirection:'column',gap:3,zIndex:10,pointerEvents:'none'}}>
      {keys.map((k,i)=>(
        <div key={i} style={{
          background:'rgba(10,6,2,.85)',border:'1px solid rgba(220,180,60,.3)',
          borderRadius:6,padding:'2px 6px',display:'flex',gap:4,alignItems:'center',
        }}>
          <span style={{fontSize:10}}>🗝️</span>
          <span style={{color:'rgba(220,180,60,.7)',fontSize:9}}>{k.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── KEY REVEAL ────────────────────────────────────────────────
function KeyReveal({chakraIdx,onClaim}) {
  const ch=CHAKRAS[Math.min(chakraIdx,6)];
  return (
    <div style={{position:'absolute',inset:0,background:'rgba(4,2,1,.96)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:30,padding:'0 32px'}}>
      <div style={{marginBottom:22}}>
        <svg width="60" height="75" viewBox="0 0 24 30" style={{filter:`drop-shadow(0 0 14px ${ch.glow}) drop-shadow(0 0 28px ${ch.glow}40)`}}>
          <polygon points="12,2 20,9 23,17 12,28 1,17 4,9" fill={ch.color} opacity=".92"/>
          <polygon points="12,2 20,9 12,8" fill="rgba(255,255,255,.65)" opacity=".7"/>
          <polygon points="4,9 12,8 1,17" fill={ch.color} opacity=".65"/>
          <line x1="12" y1="2" x2="12" y2="28" stroke="rgba(255,255,255,.2)" strokeWidth=".5"/>
        </svg>
      </div>
      <div style={{color:ch.glow,fontSize:10,letterSpacing:'.15em',textTransform:'uppercase',marginBottom:8}}>Chakra Key Unlocked</div>
      <div style={{color:'rgba(240,228,200,.95)',fontSize:22,fontFamily:'Playfair Display,serif',marginBottom:5}}>{ch.name}</div>
      <div style={{color:'rgba(200,180,140,.65)',fontSize:13,fontStyle:'italic',marginBottom:28,fontFamily:'Playfair Display,serif'}}>{ch.gem} · {ch.name.toLowerCase()} frequency found</div>
      <div onClick={onClaim} style={{border:`1px solid ${ch.color}`,borderRadius:12,padding:'12px 30px',color:ch.glow,fontSize:13,cursor:'pointer',letterSpacing:'.07em',background:`rgba(${hexRgbStr(ch.color)},.1)`}}>
        Claim · Return to Surface
      </div>
    </div>
  );
}

// ── MAIN GAME ROOM ────────────────────────────────────────────
function GameRoom({onExit,onCollect,initChakra=0}) {
  const [phase,setPhase]=useState('clearing');
  const [roomId,setRoomId]=useState('entry');
  const [cracked,setCracked]=useState({});
  const [opened,setOpened]=useState({});
  const [trans,setTrans]=useState(false);
  const [showQ,setShowQ]=useState(false);
  const [pendingDir,setPending]=useState(null);
  const [clue,setClue]=useState(null);
  const [keyPickup,setKeyPickup]=useState(null);
  const [gemCollect,setGemCollect]=useState(null);
  const [showPortal,setShowPortal]=useState(false);
  const [temptation,setTemptation]=useState(null);
  const [heldKeys,setHeldKeys]=useState({});
  const [collectedGems,setCollectedGems]=useState({});
  const [chakraIdx,setChakraIdx]=useState(initChakra);
  const [avelion,setAvelion]=useState(false);
  const [flickerT,setFlickerT]=useState(0);
  const animRef=useRef(null);

  useEffect(()=>{
    let start=null;
    const tick=t=>{
      if(!start)start=t;
      setFlickerT(((t-start)/1000)%20);
      animRef.current=requestAnimationFrame(tick);
    };
    animRef.current=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(animRef.current);
  },[]);

  const room=ROOMS[roomId];
  const cc=CHAKRAS[Math.min(chakraIdx,6)];

  // Push a collected item to the Pad phone's inventory (deduped by id there).
  const addToInventory=(item)=>{
    try{ window.dispatchEvent(new CustomEvent('pad:inv-add',{detail:item})); }catch(e){}
    if(onCollect)onCollect(item);
  };

  const navigate=dir=>{
    if(trans)return;
    // At the dungeon entrance, "back" (↓) ascends the staircase to the Pad.
    if(dir==='back'&&!room.exits.back){ onExit&&onExit(); return; }
    const next=room.exits[dir];
    if(!next)return;
    // Only the FORWARD (deeper) path is gated by the riddle. Side turns and
    // back are always free, so the player can never be trapped at a junction.
    if(room.type==='crossroads'&&dir==='forward'){setPending(dir);setShowQ(true);return;}
    goTo(next);
  };
  const goTo=id=>{setTrans(true);setTimeout(()=>{setRoomId(id);setTrans(false);},380);};
  const answerQ=correct=>{setShowQ(false);if(correct&&pendingDir)goTo(room.exits[pendingDir]);setPending(null);};

  const crackRock=rock=>{
    if(cracked[rock.id])return;
    setCracked(c=>({...c,[rock.id]:true}));
    if(rock.type==='gem'){
      setTimeout(()=>setGemCollect({chakra:rock.chakra,id:rock.id+'_gem'}),400);
    }
  };

  const collectFreeGem=gem=>{
    if(collectedGems[gem.id])return;
    setGemCollect({chakra:gem.chakra,id:gem.id});
  };

  const pickupKey=keyItem=>{
    if(heldKeys[keyItem.id])return;
    setKeyPickup(keyItem);
  };

  const confirmGem=(gemObj)=>{
    const newGems={...collectedGems,[gemObj.id]:{chakra:gemObj.chakra}};
    setCollectedGems(newGems);
    setChakraIdx(Math.max(chakraIdx,gemObj.chakra));
    const ch=CHAKRAS[gemObj.chakra];
    addToInventory({id:gemObj.id, name:`${ch.gem} · ${ch.name}`, type:'fragment', icon:'◈'});
    setGemCollect(null);
  };

  const openChest=chest=>{
    if(opened[chest.id])return;
    if(chest.locked){
      if(!heldKeys[chest.requiresKey]){
        setClue(`This chest is sealed with iron. You need the ${chest.requiresKey==='k1'?'Scarab Key':chest.requiresKey==='k2'?'Iron Key':chest.requiresKey==='k3'?'Crystal Key':'Crown Key'} to open it.`);
        return;
      }
      setOpened(o=>({...o,[chest.id]:true}));
      if(chest.gem){
        setTimeout(()=>setGemCollect({chakra:chest.gem.chakra,id:chest.id+'_gem'}),500);
      }
      if(chest.scroll){setClue(chest.scroll);addToInventory({id:'scroll_'+chest.id, name:'Scroll of Knowing', type:'symbol', icon:'📜', body:chest.scroll});}
      return;
    }
    setOpened(o=>({...o,[chest.id]:true}));
    if(chest.scroll){setClue(chest.scroll);addToInventory({id:'scroll_'+chest.id, name:'Scroll of Knowing', type:'symbol', icon:'📜', body:chest.scroll});}
  };

  // Portal tap
  const handlePortalTap=()=>{
    if(room.type==='portal')setShowPortal(true);
  };

  const hints={
    entry:['Tap the rocks to crack them open.','Something stirs in the dust. Move forward when ready.'],
    hall_1:['A chest waits ahead — tap it to open.','The symbols hold answers. Keep moving.'],
    junction_1:['Three paths. The still point is the observer — not one of the twelve.','Think about what does not move when everything else does.'],
    side_scarab:['Tap all the rocks here. Something is hidden.','A key might open something deeper in the tomb.'],
    side_anubis:['The jackal watches. Check behind the rocks.','A gem may rest in this chamber — look carefully.'],
    gem_1:['Five rocks. One holds the Ruby.','The red glow will guide you.'],
    hall_2:['A locked chest here — you need the right key.','Check the side chambers for keys before returning.'],
    junction_2:['Opinion is not one of the Five Absolutes.','Time, Space, Energy, Matter, Consciousness — those are the five.'],
    side_deep_left:['Search carefully — a key is hidden in this room.','The Iron Key unlocks something in the Solar Chamber.'],
    side_deep_right:['A green gem rests here. Tap it.','The Heart frequency — found in stillness.'],
    gem_3:['The Solar Chamber. The Citrine is in one of these rocks.','The Iron Key opens the locked chest too.'],
    hall_3:['Keep walking. The deep junction is ahead.','The walls breathe — this passage is alive.'],
    junction_3:['Three paths again. The Feel-Back Loop returns — not as loss but completion.','G to A — the return is a gift.'],
    side_throat:['Blue stone walls. A key rests here for the violet passage.','A gem also waits — look carefully.'],
    side_eye:['The Crystal Key from the blue chamber opens this chest.','The Third Eye sees with knowing, not light.'],
    gem_5:['The Throat Chamber. Five pillars. One gem in the rocks.','Listen as you walk — the frequency shifts here.'],
    final_hall:['The Crown Key from the portal chamber unlocks this chest.','You must visit the portal room first.'],
    portal_chamber:['Collect all seven gems to open the portal.','A key rests here — and the Crown gem.'],
  };

  if(phase==='clearing'){
    return <div style={{position:'absolute',inset:0,zIndex:20,overflow:'hidden'}}><SootClear onComplete={()=>setPhase('hallway')}/></div>;
  }

  const blocked=trans||showQ||!!clue||!!keyPickup||!!gemCollect||showPortal||!!temptation;

  return (
    <div style={{position:'absolute',inset:0,zIndex:20,display:'flex',flexDirection:'column',background:'#040201',overflow:'hidden'}}>
      <style>{`@keyframes fade-up{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Canvas scene */}
      <div style={{flex:1,position:'relative',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',opacity:trans?0:1,transition:'opacity .35s'}}>
        <TombCanvas
          room={room} roomId={roomId} cracked={cracked} gemFound={false} opened={opened}
          collectedGems={collectedGems} heldKeys={heldKeys}
          chakraColor={cc.color} flickerT={flickerT}
          onRockClick={crackRock} onChestClick={openChest}
          onGemClick={collectFreeGem} onKeyClick={pickupKey}
          onTemptation={setTemptation}
          onPortalTap={handlePortalTap}
        />

        {/* Top HUD */}
        <div style={{position:'absolute',top:0,left:0,right:0,padding:'10px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'linear-gradient(180deg,rgba(0,0,0,.78),transparent)',pointerEvents:'none',zIndex:10}}>
          <button onClick={onExit} style={{background:'rgba(220,168,32,.12)',border:'1px solid rgba(220,168,32,.4)',color:'rgba(235,196,90,.95)',fontSize:13,cursor:'pointer',fontStyle:'italic',padding:'9px 16px',borderRadius:20,fontFamily:'Playfair Display,serif',pointerEvents:'all',display:'flex',alignItems:'center',gap:6,minHeight:38}}>↑ Surface</button>
          <div style={{display:'flex',gap:4}}>
            {CHAKRAS.map((c,i)=>{
              const have=Object.values(collectedGems).some(g=>g.chakra===i);
              return <div key={i} style={{width:7,height:7,borderRadius:'50%',background:have?c.color:'rgba(255,255,255,.07)',transition:'all 1s',boxShadow:have?`0 0 8px ${c.glow}`:'none'}}/>;
            })}
          </div>
          <div style={{color:'rgba(220,168,32,.38)',fontSize:10,pointerEvents:'none'}}>{room.title}</div>
        </div>

        {/* Atmosphere text */}
        <div style={{position:'absolute',bottom:6,left:0,right:0,textAlign:'center',color:'rgba(220,168,32,.75)',fontSize:12,fontStyle:'italic',fontFamily:'Playfair Display,serif',background:'linear-gradient(transparent,rgba(4,2,1,.58))',padding:'10px 22px',pointerEvents:'none'}}>
          {room.type==='portal'?<span style={{color:'rgba(200,80,40,.8)'}}>↑ Tap the portal to approach it</span>:room.atmos}
        </div>

        {/* Floating gem orbs */}
        <FloatingOrbs collectedGems={collectedGems} flickerT={flickerT}/>

        {/* Key inventory */}
        <KeyInventory heldKeys={heldKeys}/>

        {/* Avelion guide */}
        <div style={{position:'absolute',bottom:22,right:14,zIndex:10}}>
          <div onClick={()=>setAvelion(a=>!a)} style={{cursor:'pointer',opacity:.75}}>
            <Lantern brightness={.55} size={38} color="#c4a45a"/>
          </div>
          {avelion&&(
            <div style={{position:'absolute',bottom:'115%',right:0,width:186,background:'rgba(10,6,2,.97)',border:'1px solid rgba(220,168,32,.25)',borderRadius:11,padding:'12px 14px',animation:'fade-up .25s ease forwards',zIndex:20}}>
              <div style={{color:'rgba(220,168,32,.55)',fontSize:9,letterSpacing:'.1em',textTransform:'uppercase',marginBottom:6}}>Avelion</div>
              <div style={{color:'rgba(220,168,32,.88)',fontSize:12,fontStyle:'italic',fontFamily:'Playfair Display,serif',lineHeight:1.6}}>
                {(hints[roomId]||['Look carefully. The answer is already here.'])[Math.floor(Math.random()*(hints[roomId]?.length||1))]}
              </div>
              <div onClick={()=>setAvelion(false)} style={{color:'rgba(220,168,32,.4)',fontSize:10,cursor:'pointer',marginTop:8,textAlign:'right'}}>close</div>
            </div>
          )}
        </div>

        {/* Overlays */}
        {showQ&&room.question&&<QuestionOverlay question={room.question} onAnswer={answerQ} onCancel={()=>{setShowQ(false);setPending(null);}} onExit={()=>{setShowQ(false);setPending(null);onExit&&onExit();}}/>}
        {clue&&<CluePopup text={clue} onClose={()=>setClue(null)}/>}
        {keyPickup&&<KeyPickup keyItem={keyPickup} onClose={()=>{setHeldKeys(k=>({...k,[keyPickup.id]:keyPickup}));addToInventory({id:keyPickup.id,name:keyPickup.label,type:'key',icon:'🗝️',body:keyPickup.desc});setKeyPickup(null);}}/>}
        {gemCollect&&<GemCollect chakra={gemCollect.chakra} onClose={()=>confirmGem(gemCollect)}/>}
        {showPortal&&<PortalScreen collectedGems={collectedGems} onEnter={()=>{onExit&&onExit();}} onBack={()=>setShowPortal(false)}/> }
        {temptation&&<TemptationPopup type={temptation} onClose={()=>setTemptation(null)}/>}
      </div>

      {/* D-pad */}
      <div style={{flexShrink:0,height:148,background:'rgba(4,2,1,.97)',borderTop:'1px solid rgba(220,168,32,.12)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',zIndex:25}}>
        <DPad exits={{...room.exits, back: room.exits.back || '__surface'}} onMove={navigate} disabled={blocked}/>
      </div>
    </div>
  );
}

Object.assign(window,{GameRoom,Lantern,CHAKRAS});
