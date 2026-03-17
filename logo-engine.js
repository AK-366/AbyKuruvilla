// logo-engine.js — AK Cinematic Logo Engine

window.AKLogo = (function(){

  function createCanvas(w, h, zIndex){
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.style.cssText = `position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:${zIndex}`;
    return c;
  }

  function buildMark(size){
    const s = size / 200;
    return `<svg width="${size}" height="${size * 1.05}" viewBox="0 0 200 210"
      style="overflow:visible;display:block" id="ak-mark-svg">
      <defs>
        <filter id="ak-gf"><feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="ak-gs"><feGaussianBlur stdDeviation="9" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle id="ak-r3" cx="100" cy="100" r="88" fill="none" stroke="rgba(212,168,75,0.1)"
        stroke-width="0.5" stroke-dasharray="4 8" opacity="0"/>
      <circle id="ak-r2" cx="100" cy="100" r="72" fill="none" stroke="rgba(212,168,75,0.14)"
        stroke-width="0.5" opacity="0"/>
      <circle id="ak-r1" cx="100" cy="100" r="56" fill="none" stroke="rgba(212,168,75,0.22)"
        stroke-width="0.8" opacity="0"/>
      <g id="ak-orbit-a" opacity="0">
        <circle id="ak-od1" cx="188" cy="100" r="2.5" fill="rgba(212,168,75,0.75)" filter="url(#ak-gf)"/>
      </g>
      <g id="ak-orbit-b" opacity="0">
        <circle id="ak-od2" cx="100" cy="28" r="2" fill="rgba(240,201,122,0.6)" filter="url(#ak-gf)"/>
      </g>
      <g id="ak-glow-bg" opacity="0" filter="url(#ak-gs)">
        <path d="M100 26 L58 172" fill="none" stroke="rgba(212,168,75,0.28)" stroke-width="12" stroke-linecap="round"/>
        <path d="M100 26 L142 172" fill="none" stroke="rgba(212,168,75,0.28)" stroke-width="12" stroke-linecap="round"/>
      </g>
      <path id="ak-pa" d="M100 26 L58 172" fill="none" stroke="#d4a84b" stroke-width="5.8"
        stroke-linecap="round" stroke-dasharray="152" stroke-dashoffset="152"/>
      <path id="ak-pb" d="M100 26 L142 172" fill="none" stroke="#d4a84b" stroke-width="5.8"
        stroke-linecap="round" stroke-dasharray="152" stroke-dashoffset="152"/>
      <path id="ak-pc" d="M72 110 L115 110" fill="none" stroke="#d4a84b" stroke-width="4.2"
        stroke-linecap="round" stroke-dasharray="44" stroke-dashoffset="44"/>
      <path id="ak-pd" d="M115 110 L146 54" fill="none" stroke="#d4a84b" stroke-width="4.2"
        stroke-linecap="round" stroke-dasharray="72" stroke-dashoffset="72"/>
      <path id="ak-pe" d="M115 110 L150 172" fill="none" stroke="#d4a84b" stroke-width="4.2"
        stroke-linecap="round" stroke-dasharray="72" stroke-dashoffset="72"/>
      <g id="ak-serifs" opacity="0">
        <circle cx="100" cy="19" r="5" fill="#f5e07a" filter="url(#ak-gf)"/>
        <line x1="90" y1="26" x2="110" y2="26" stroke="#d4a84b" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="58"  cy="172" r="3.5" fill="#f5e07a" filter="url(#ak-gf)"/>
        <circle cx="142" cy="172" r="3.5" fill="#f5e07a" filter="url(#ak-gf)"/>
        <circle cx="150" cy="172" r="3"   fill="#f5e07a" filter="url(#ak-gf)"/>
        <circle cx="146" cy="54"  r="3"   fill="#f5e07a" filter="url(#ak-gf)"/>
      </g>
      <polygon id="ak-nib" points="100,182 114,166 100,158 86,166"
        fill="#d4a84b" opacity="0" filter="url(#ak-gf)"/>
      <line id="ak-nibs" x1="100" y1="167" x2="100" y2="180"
        stroke="#030303" stroke-width="1.3" stroke-linecap="round" opacity="0"/>
      <circle id="ak-apex" cx="100" cy="19" r="5" fill="transparent" opacity="0"/>
      <polygon id="ak-idiam" points="100,76 120,104 100,132 80,104"
        fill="none" stroke="rgba(212,168,75,0.22)" stroke-width="0.9" opacity="0"/>
    </svg>`;
  }

  function fi(id, delay, dur){
    setTimeout(()=>{
      const el = document.getElementById(id);
      if(el){ el.style.transition=`opacity ${dur}ms ease`; el.style.opacity='1'; }
    }, delay);
  }
  function dp(id, delay, dur){
    setTimeout(()=>{
      const el = document.getElementById(id);
      if(!el) return;
      el.style.transition=`stroke-dashoffset ${dur}ms cubic-bezier(0.16,1,0.3,1)`;
      el.style.strokeDashoffset='0';
    }, delay);
  }

  function launch(container, opts){
    opts = opts || {};
    const size       = opts.size       || 160;
    const particles  = opts.particles  !== false;
    const flare      = opts.flare      !== false;
    const sweep      = opts.sweep      !== false;
    const timeOffset = opts.delay      || 0;

    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;display:inline-flex;flex-direction:column;align-items:center';
    wrap.innerHTML = buildMark(size);
    container.appendChild(wrap);

    const svg = wrap.querySelector('#ak-mark-svg');

    // ── STROKE SEQUENCE ──
    const T = timeOffset;
    fi('ak-r3', T+80, 800); fi('ak-r2', T+200, 800); fi('ak-r1', T+320, 800);
    fi('ak-orbit-a', T+400, 600); fi('ak-orbit-b', T+600, 600);
    fi('ak-glow-bg', T+500, 900);
    dp('ak-pa', T+200, 580); dp('ak-pb', T+360, 580);
    dp('ak-pc', T+750, 380); dp('ak-pd', T+1000, 480); dp('ak-pe', T+1100, 480);
    fi('ak-serifs', T+1300, 500);
    fi('ak-idiam',  T+1100, 700);
    setTimeout(()=>{
      const n=document.getElementById('ak-nib');
      const ns=document.getElementById('ak-nibs');
      if(n){ n.style.cssText='opacity:1;transition:opacity 0.4s ease'; }
      if(ns){ ns.style.cssText='opacity:1;transition:opacity 0.3s ease 0.15s'; }
    }, T+1400);

    // ── ORBIT SPIN ──
    const od1 = document.getElementById('ak-od1');
    const od2 = document.getElementById('ak-od2');
    let oa=0, ob=0;
    (function spin(){
      oa+=0.4; ob-=0.25;
      const ra=oa*Math.PI/180, rb=ob*Math.PI/180;
      if(od1){ od1.setAttribute('cx',(100+88*Math.cos(ra)).toFixed(2)); od1.setAttribute('cy',(100+88*Math.sin(ra)).toFixed(2)); }
      if(od2){ od2.setAttribute('cx',(100+72*Math.cos(rb)).toFixed(2)); od2.setAttribute('cy',(100+72*Math.sin(rb)).toFixed(2)); }
      requestAnimationFrame(spin);
    })();

    // ── APEX BREATHE ──
    const apexC = document.getElementById('ak-apex');
    let bt=0;
    (function breathe(){
      bt+=0.022;
      const r=(5+Math.sin(bt)*0.7).toFixed(2);
      if(apexC){ apexC.setAttribute('r',r); }
      requestAnimationFrame(breathe);
    })();

    // ── HOVER TILT ──
    svg.addEventListener('mousemove', e=>{
      const r=svg.getBoundingClientRect();
      const dx=((e.clientX-r.left)/r.width -0.5)*18;
      const dy=((e.clientY-r.top) /r.height-0.5)*18;
      svg.style.transform=`perspective(500px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
      svg.style.transition='transform 0.08s linear';
    });
    svg.addEventListener('mouseleave',()=>{
      svg.style.transform='';
      svg.style.transition='transform 0.7s cubic-bezier(0.16,1,0.3,1)';
    });

    return wrap;
  }

  return { launch };
})();