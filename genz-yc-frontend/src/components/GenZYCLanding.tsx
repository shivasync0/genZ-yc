import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import '../styles/GenZYCLanding.css';

const GenZYCLanding: React.FC = () => {
  const navigate = useNavigate();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const globalBgRef = useRef<HTMLCanvasElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const curRingRef = useRef<HTMLDivElement>(null);
  const progFillRef = useRef<HTMLDivElement>(null);
  const starsRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const dustRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    /* ═══════════════════════════════════════
       CUSTOM CURSOR
    ═══════════════════════════════════════ */
    const cur = curRef.current;
    const ring = curRingRef.current;
    let mx = 0, my = 0, rx = 0, ry = 0;
    let cursorAnimFrame: number;

    if (cur && ring && window.matchMedia('(pointer:fine)').matches) {
      cur.style.display = 'block';
      ring.style.display = 'block';
      document.body.style.cursor = 'none';

      const handleMouseMove = (e: MouseEvent) => {
        mx = e.clientX;
        my = e.clientY;
        cur.style.left = mx + 'px';
        cur.style.top = my + 'px';
      };
      document.addEventListener('mousemove', handleMouseMove);

      const animRing = () => {
        rx += (mx - rx) * 0.1;
        ry += (my - ry) * 0.1;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        cursorAnimFrame = requestAnimationFrame(animRing);
      };
      animRing();

      const interactables = document.querySelectorAll('button, a, .snd');
      interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cur.style.width = '18px'; cur.style.height = '18px'; cur.style.background = 'var(--p2)';
          ring.style.width = '44px'; ring.style.height = '44px';
        });
        el.addEventListener('mouseleave', () => {
          cur.style.width = '9px'; cur.style.height = '9px'; cur.style.background = 'var(--p)';
          ring.style.width = '34px'; ring.style.height = '34px';
        });
      });
    }

    /* ═══════════════════════════════════════
       THREE.JS — GLOBAL 3D BACKGROUND
    ═══════════════════════════════════════ */
    let R: THREE.WebGLRenderer | null = null;
    let raf3d: number;
    
    if (globalBgRef.current) {
      R = new THREE.WebGLRenderer({ canvas: globalBgRef.current, alpha: true, antialias: true });
      R.setClearColor(0x000000, 0); // Transparent
      R.setPixelRatio(Math.min(devicePixelRatio, 2));

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0a0a0a, 0.025);

      const cam = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
      cam.position.set(0, 0, 16);

      const resize = () => {
        R!.setSize(window.innerWidth, window.innerHeight);
        cam.aspect = window.innerWidth / window.innerHeight;
        cam.updateProjectionMatrix();
      };
      window.addEventListener('resize', resize);
      resize();

      const nodes: any[] = [];
      const matMain = new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222, emissiveIntensity: 0.4, transparent: true, opacity: 0.85, shininess: 80 });
      const matSec = new THREE.MeshPhongMaterial({ color: 0x444444, emissive: 0x111111, emissiveIntensity: 0.3, transparent: true, opacity: 0.6, shininess: 60 });

      const scrollDepth = 45;

      // 1) Glowing Nodes
      for (let i = 0; i < 75; i++) {
        const isMain = Math.random() > 0.75;
        const r = isMain ? Math.random() * 1.2 + 0.8 : Math.random() * 0.6 + 0.3;
        const geo = new THREE.SphereGeometry(r, 24, 24);
        const m = new THREE.Mesh(geo, isMain ? matMain : matSec);

        const glowMat = new THREE.MeshBasicMaterial({ color: isMain ? 0xffffff : 0x888888, transparent: true, opacity: 0.05, side: THREE.BackSide });
        const glow = new THREE.Mesh(new THREE.SphereGeometry(r * 1.15, 24, 24), glowMat);
        m.add(glow);

        const x = (Math.random() - 0.5) * 28;
        const y = (Math.random() * scrollDepth) - (scrollDepth * 0.85);
        const z = (Math.random() - 0.5) * 15 - 2;

        m.position.set(x, y, z);
        scene.add(m);

        nodes.push({ m, ox: x, oy: y, oz: z, ph: Math.random() * Math.PI * 2, sp: 0.2 + Math.random() * 0.5 });
      }

      // 2) Deep Background Star/Dust Particles
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(300 * 3);
      for (let i = 0; i < 900; i += 3) {
        pPos[i] = (Math.random() - 0.5) * 50;
        pPos[i + 1] = (Math.random() * scrollDepth * 1.5) - scrollDepth;
        pPos[i + 2] = (Math.random() - 0.5) * 30 - 10;
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 0.08, transparent: true, opacity: 0.3 });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // 3) Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const pl1 = new THREE.PointLight(0xffffff, 2.5, 30);
      scene.add(pl1);

      let pmx = 0, pmy = 0, tpmx = 0, tpmy = 0;
      const handle3DMouseMove = (e: MouseEvent) => {
        tpmx = (e.clientX / window.innerWidth) * 2 - 1;
        tpmy = -(e.clientY / window.innerHeight) * 2 + 1;
      };
      document.addEventListener('mousemove', handle3DMouseMove);

      let targetCamY = 0;

      const tick = () => {
        raf3d = requestAnimationFrame(tick);
        const t = performance.now() * 0.001;

        pmx += (tpmx - pmx) * 0.05;
        pmy += (tpmy - pmy) * 0.05;

        if (scrollerRef.current) {
          const maxScroll = scrollerRef.current.scrollHeight - scrollerRef.current.clientHeight;
          const scrollPct = maxScroll > 0 ? scrollerRef.current.scrollTop / maxScroll : 0;
          targetCamY = -scrollPct * scrollDepth;
        }

        cam.position.y += (targetCamY - cam.position.y) * 0.12;
        cam.position.x += (pmx * 2 - cam.position.x) * 0.1;
        cam.rotation.x = pmy * 0.05;
        cam.rotation.y = -pmx * 0.05;

        pl1.position.set(cam.position.x + 2, cam.position.y + 2, cam.position.z - 2);

        nodes.forEach(n => {
          n.m.position.x = n.ox + Math.sin(t * n.sp * 0.6 + n.ph) * 0.4;
          n.m.position.y = n.oy + Math.cos(t * n.sp * 0.5 + n.ph) * 0.3;
          n.m.rotation.y = t * 0.15 * n.sp;
          n.m.rotation.x = t * 0.12 * n.sp;
        });

        particles.rotation.y = t * 0.02;

        R!.render(scene, cam);
      };
      tick();
    }

    /* ═══════════════════════════════════════
       STAR FIELDS (2D Canvas Layer)
    ═══════════════════════════════════════ */
    const resizers: ResizeObserver[] = [];
    starsRefs.current.forEach(c => {
      if (!c) return;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      const draw = () => {
        c.width = c.offsetWidth;
        c.height = c.offsetHeight;
        ctx.clearRect(0, 0, c.width, c.height);
        const n = Math.floor((c.width * c.height) / 3200);
        for (let j = 0; j < n; j++) {
          const x = Math.random() * c.width, y = Math.random() * c.height;
          const r = Math.random() * 0.9 + 0.15, op = Math.random() * 0.3 + 0.05;
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${op})`; ctx.fill();
        }
      };
      draw();
      const ro = new ResizeObserver(draw);
      ro.observe(c);
      resizers.push(ro);
    });

    /* ═══════════════════════════════════════
       DUST PARTICLES
    ═══════════════════════════════════════ */
    dustRefs.current.forEach(d => {
      if (!d) return;
      d.innerHTML = ''; // clear for HMR
      for (let j = 0; j < 22; j++) {
        const el = document.createElement('div'); el.className = 'dp';
        const x = Math.random() * 100, y = Math.random() * 100;
        const tx = (Math.random() - 0.5) * 52, ty = -(Math.random() * 46 + 8);
        const s = (Math.random() * 1.4 + 0.7) + 'px';
        el.style.cssText = `--x:${x}%;--y:${y}%;--tx:${tx}px;--ty:${ty}px;--s:${s};--d:${6 + Math.random() * 9}s;--dl:${Math.random() * 6}s;background:rgba(255,255,255,0.4)`;
        d.appendChild(el);
      }
    });

    /* ═══════════════════════════════════════
       SCROLL REVEAL & SWEEP LINES
    ═══════════════════════════════════════ */
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.sr,.srr,.srs').forEach(el => revealObs.observe(el));

    const sweepObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('go'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.page').forEach(p => {
      const sweep = p.querySelector('.sweep');
      if (sweep) sweepObs.observe(p);
    });

    /* ═══════════════════════════════════════
       SCROLL PROGRESS BAR + NAV DOTS
    ═══════════════════════════════════════ */
    const handleScroll = () => {
      if (scrollerRef.current && progFillRef.current) {
        const h = scrollerRef.current.scrollHeight - scrollerRef.current.clientHeight;
        progFillRef.current.style.width = (h > 0 ? (scrollerRef.current.scrollTop / h) * 100 : 0) + '%';
      }
    };
    if (scrollerRef.current) scrollerRef.current.addEventListener('scroll', handleScroll, { passive: true });

    const pages = Array.from(document.querySelectorAll('.page'));
    const sndEls = document.querySelectorAll('.snd');
    const dotObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio > 0.45) {
          const idx = pages.indexOf(e.target as Element);
          sndEls.forEach((d, i) => d.classList.toggle('active', i === idx));
        }
      });
    }, { threshold: 0.45, root: scrollerRef.current });
    pages.forEach(p => dotObs.observe(p));

    sndEls.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        if (pages[i]) pages[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    /* ═══════════════════════════════════════
       MOUSE PARALLAX ON VISUAL COLUMNS
    ═══════════════════════════════════════ */
    const parallaxCleanups: (() => void)[] = [];
    pages.forEach(page => {
      const vis = page.querySelector('.col-vis') as HTMLElement;
      if (!vis) return;
      
      const moveHandler = (e: Event) => {
        const me = e as MouseEvent;
        const rc = page.getBoundingClientRect();
        const cx = (me.clientX - rc.left) / rc.width - 0.5;
        const cy = (me.clientY - rc.top) / rc.height - 0.5;
        vis.style.transition = 'transform .1s ease-out';
        vis.style.transform = `translate(${cx * 12}px,${cy * 8}px)`;
      };
      
      const leaveHandler = () => {
        vis.style.transition = 'transform .65s cubic-bezier(.16,1,.3,1)';
        vis.style.transform = 'translate(0,0)';
      };

      page.addEventListener('mousemove', moveHandler);
      page.addEventListener('mouseleave', leaveHandler);
      
      parallaxCleanups.push(() => {
        page.removeEventListener('mousemove', moveHandler);
        page.removeEventListener('mouseleave', leaveHandler);
      });
    });

    return () => {
      document.body.style.cursor = 'auto';
      cancelAnimationFrame(cursorAnimFrame);
      cancelAnimationFrame(raf3d);
      if (R) R.dispose();
      resizers.forEach(ro => ro.disconnect());
      revealObs.disconnect();
      sweepObs.disconnect();
      dotObs.disconnect();
      if (scrollerRef.current) scrollerRef.current.removeEventListener('scroll', handleScroll);
      parallaxCleanups.forEach(c => c());
    };
  }, []);

  return (
    <div className="genzyc-wrapper">
      <div id="cur" ref={curRef}></div>
      <div id="cur-ring" ref={curRingRef}></div>

      <canvas id="global-3d-bg" ref={globalBgRef}></canvas>

      <div id="prog-bar"><div id="prog-fill" ref={progFillRef}></div></div>

      <div id="snav">
        <div className="snd active" title="Discovery"></div>
        <div className="snd" title="The Problem"></div>
        <div className="snd" title="Matching"></div>
        <div className="snd" title="Validation"></div>
        <div className="snd" title="Execution"></div>
        <div className="snd" title="Outcome"></div>
      </div>

      <nav className="genzyc-nav">
        <div className="logo">Match by Minds</div>
        <div className="nav-links">
          <a href="#p1">Discovery</a>
          <a href="#p3">Matching</a>
          <a href="#p4">Sprints</a>
          <a href="#p6">Outcome</a>
        </div>
        <button className="nav-pill" onClick={() => navigate('/auth')}>Get Early Access</button>
      </nav>

      <div id="scroller" ref={scrollerRef}>

        <section className="page pg1" id="p1">
          <canvas className="stars" ref={el => starsRefs.current[0] = el}></canvas>
          <div className="dust" ref={el => dustRefs.current[0] = el}></div>
          <div className="sweep" id="sw1"></div>

          <div className="page-inner">
            <div className="col-text" style={{ paddingTop: 'var(--nav-h)' }}>
              <div className="plabel">
                <span className="plabel-num">01</span>
                <span className="plabel-txt">Discovery</span>
              </div>
              <h1 className="sr">
                Find a <span className="ac">Cofounder.</span><br/>
                Prove the <span className="ac">Chemistry.</span><br/>
                <span style={{ fontSize: '.75em', color: 'rgba(238,234,255,.7)' }}>Build Before You Commit.</span>
              </h1>
              <p className="sr d2">The only platform to match, test, and build<br/>with the right cofounder — before you commit.</p>
              <div className="btn-row sr d3">
                <button className="btn" onClick={() => navigate('/auth')}>Start Trial Sprint</button>
                <button className="btn-ghost">
                  <svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" stroke="rgba(255,255,255,.25)" strokeWidth="1.2" fill="none"/><path d="M10 8.5L15.5 12L10 15.5V8.5Z" fill="rgba(255,255,255,.6)"/></svg>
                  Watch how it works
                </button>
              </div>
              <div className="scroll-hint sr d5">
                <div className="sw"><div className="sd"></div></div>
                Scroll to explore
              </div>
            </div>

            <div className="col-vis"></div>

            <div className="col-divider"></div>
            <div className="connector-dot" style={{ '--dl': '0s' } as any}></div>
          </div>

          <div className="pg-num"><span>01</span> / 06 — Discovery</div>
        </section>

        <section className="page pg2" id="p2">
          <canvas className="stars" ref={el => starsRefs.current[1] = el}></canvas>
          <div className="dust" ref={el => dustRefs.current[1] = el}></div>
          <div className="sweep" id="sw2"></div>

          <div className="page-inner">
            <div className="col-text" style={{ paddingTop: 'var(--nav-h)' }}>
              <div className="plabel">
                <span className="plabel-num">02</span>
                <span className="plabel-txt">The Problem</span>
              </div>
              <h2 className="sr">
                Builders are everywhere.<br/>
                <span className="fade">But most never meet<br/>the right team.</span>
              </h2>
              <div style={{ marginTop: '1.4rem' }}>
                <p className="li-item sr d2">→ Endless searching, no signal.</p>
                <p className="li-item sr d3">→ Wrong matches, wasted time.</p>
                <p className="li-item sr d3">→ Conversations go nowhere.</p>
                <p className="li-item sr d4">→ Great ideas never get built.</p>
              </div>
              <div className="stats-row sr d5">
                <div className="stat">
                  <span className="stat-val">9<span>0%</span></span>
                  <span className="stat-label">of cofounders<br/>split within 2 yrs</span>
                </div>
                <div className="stat">
                  <span className="stat-val">3<span>x</span></span>
                  <span className="stat-label">more likely to fail<br/>without right team</span>
                </div>
                <div className="stat">
                  <span className="stat-val">#<span>1</span></span>
                  <span className="stat-label">startup killer<br/>is team mismatch</span>
                </div>
              </div>
            </div>

            <div className="col-vis"></div>

            <div className="col-divider"></div>
          </div>

          <div className="pg-num"><span>02</span> / 06 — The Problem</div>
        </section>

        <section className="page pg3" id="p3">
          <canvas className="stars" ref={el => starsRefs.current[2] = el}></canvas>
          <div className="dust" ref={el => dustRefs.current[2] = el}></div>
          <div className="sweep" id="sw3"></div>

          <div className="page-inner">
            <div className="col-text" style={{ paddingTop: 'var(--nav-h)' }}>
              <div className="plabel">
                <span className="plabel-num">03</span>
                <span className="plabel-txt">Matching</span>
              </div>
              <h2 className="sr">Match by Minds.<br/>Not just skills.</h2>
              <p className="sr d2" style={{ marginTop: '1rem' }}>We connect you based on deep compatibility — work style, communication, ambition, values, and vision. Not just what you know, but how you build.</p>
              <div className="feature-pills sr d3">
                <span className="pill">Work Style</span>
                <span className="pill">Values Alignment</span>
                <span className="pill">Ambition Level</span>
                <span className="pill">Communication</span>
                <span className="pill">Risk Appetite</span>
                <span className="pill">Domain Focus</span>
              </div>
            </div>

            <div className="col-vis">
              <div className="net-wrap srr">
                <svg viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="gl"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  </defs>
                  <g filter="url(#gl)">
                    <line x1="170" y1="170" x2="278" y2="70" stroke="rgba(140,102,255,.52)" strokeWidth="1" strokeDasharray="5 4"><animate attributeName="stroke-opacity" values=".52;.88;.52" dur="2.8s" repeatCount="indefinite"/></line>
                    <line x1="170" y1="170" x2="68" y2="90" stroke="rgba(140,102,255,.46)" strokeWidth="1" strokeDasharray="5 4"><animate attributeName="stroke-opacity" values=".42;.78;.42" dur="3.4s" repeatCount="indefinite"/></line>
                    <line x1="170" y1="170" x2="302" y2="204" stroke="rgba(140,102,255,.52)" strokeWidth="1" strokeDasharray="5 4"><animate attributeName="stroke-opacity" values=".46;.82;.46" dur="2.5s" repeatCount="indefinite"/></line>
                    <line x1="170" y1="170" x2="52" y2="235" stroke="rgba(140,102,255,.46)" strokeWidth="1" strokeDasharray="5 4"><animate attributeName="stroke-opacity" values=".36;.72;.36" dur="4s" repeatCount="indefinite"/></line>
                    <line x1="170" y1="170" x2="184" y2="305" stroke="rgba(140,102,255,.52)" strokeWidth="1" strokeDasharray="5 4"><animate attributeName="stroke-opacity" values=".46;.82;.46" dur="3.1s" repeatCount="indefinite"/></line>
                    <line x1="170" y1="170" x2="264" y2="285" stroke="rgba(140,102,255,.4)" strokeWidth="1" strokeDasharray="5 4"><animate attributeName="stroke-opacity" values=".32;.66;.32" dur="3.7s" repeatCount="indefinite"/></line>
                  </g>
                  <circle r="2.5" fill="rgba(205,175,255,.88)" filter="url(#gl)"><animateMotion dur="2.8s" repeatCount="indefinite" path="M170,170 L278,70"/><animate attributeName="opacity" values="0;1;0" dur="2.8s" repeatCount="indefinite"/></circle>
                  <circle r="2.2" fill="rgba(205,175,255,.78)" filter="url(#gl)"><animateMotion dur="3.4s" repeatCount="indefinite" path="M170,170 L68,90"/><animate attributeName="opacity" values="0;.9;0" dur="3.4s" repeatCount="indefinite"/></circle>
                  <circle r="2.5" fill="rgba(190,155,255,.82)" filter="url(#gl)"><animateMotion dur="2.5s" repeatCount="indefinite" path="M170,170 L302,204"/><animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite"/></circle>
                  <circle r="2.2" fill="rgba(205,175,255,.72)" filter="url(#gl)"><animateMotion dur="4s" repeatCount="indefinite" path="M170,170 L52,235"/><animate attributeName="opacity" values="0;.88;0" dur="4s" repeatCount="indefinite"/></circle>
                  <circle r="2.5" fill="rgba(195,162,255,.82)" filter="url(#gl)"><animateMotion dur="3.1s" repeatCount="indefinite" path="M170,170 L184,305"/><animate attributeName="opacity" values="0;1;0" dur="3.1s" repeatCount="indefinite"/></circle>
                </svg>
                <div className="nnode" style={{ left: '50%', top: '50%', zIndex: 5 }}><div className="nbub nbub-c" style={{ width: '82px', height: '82px', '--d': '5.2s' } as any}><div className="nicon nicon-c"></div></div></div>
                <div className="nnode" style={{ left: '82%', top: '20.5%' }}><div className="nbub" style={{ width: '56px', height: '56px', '--d': '6.2s', '--dl': '.5s', '--mx': '5px', '--my': '-7px', '--mx2': '-4px', '--my2': '5px' } as any}><div className="nicon"></div></div></div>
                <div className="nnode" style={{ left: '20%', top: '26.5%' }}><div className="nbub" style={{ width: '48px', height: '48px', '--d': '7.4s', '--dl': '1s', '--mx': '-5px', '--my': '6px', '--mx2': '4px', '--my2': '-4px' } as any}><div className="nicon"></div></div></div>
                <div className="nnode" style={{ left: '89%', top: '60%' }}><div className="nbub" style={{ width: '60px', height: '60px', '--d': '5.8s', '--dl': '1.4s', '--mx': '6px', '--my': '5px', '--mx2': '-4px', '--my2': '-6px' } as any}><div className="nicon"></div></div></div>
                <div className="nnode" style={{ left: '15%', top: '69%' }}><div className="nbub" style={{ width: '52px', height: '52px', '--d': '6.8s', '--dl': '.8s', '--mx': '-6px', '--my': '5px', '--mx2': '4px', '--my2': '-5px' } as any}><div className="nicon"></div></div></div>
                <div className="nnode" style={{ left: '54%', top: '89.5%' }}><div className="nbub" style={{ width: '44px', height: '44px', '--d': '7.2s', '--dl': '1.8s', '--mx': '4px', '--my': '6px', '--mx2': '-3px', '--my2': '-4px' } as any}><div className="nicon"></div></div></div>
                <div className="nnode" style={{ left: '78%', top: '84%' }}><div className="nbub" style={{ width: '38px', height: '38px', '--d': '8.2s', '--dl': '2.2s', '--mx': '-4px', '--my': '-5px', '--mx2': '3px', '--my2': '4px' } as any}><div className="nicon"></div></div></div>
              </div>
            </div>

            <div className="col-divider"></div>
            <div className="connector-dot" style={{ '--dl': '.4s' } as any}></div>
          </div>

          <div className="pg-num"><span>03</span> / 06 — Matching</div>
        </section>

        <section className="page pg4" id="p4">
          <canvas className="stars" ref={el => starsRefs.current[3] = el}></canvas>
          <div className="dust" ref={el => dustRefs.current[3] = el}></div>
          <div className="sweep" id="sw4"></div>

          <div className="page-inner">
            <div className="col-text" style={{ paddingTop: 'var(--nav-h)' }}>
              <div className="plabel">
                <span className="plabel-num">04</span>
                <span className="plabel-txt">Validation</span>
              </div>
              <h2 className="sr">Test before<br/>you commit.</h2>
              <p className="sr d2" style={{ marginTop: '1rem' }}>Work on real tasks together in a time-boxed sprint. No pressure, no commitment — just real collaboration with real signal.</p>
              <div style={{ marginTop: '1.5rem' }}>
                <p className="li-item sr d3">✓ 7-day trial sprints</p>
                <p className="li-item sr d4">✓ Shared kanban workspace</p>
                <p className="li-item sr d5">✓ Async + sync collaboration</p>
                <p className="li-item sr d6">✓ Chemistry score at the end</p>
              </div>
            </div>

            <div className="col-vis">
              <div className="kb-outer">
                <div className="kb-tilt srr">
                  <div className="kb-shadow"></div>
                  <div className="kb-card">
                    <div className="kb-h">Trial Sprint · Week 1</div>
                    <div className="kb-cols">
                      <div className="kb-col">
                        <div className="kb-ct">To Do<div className="kb-b">4</div></div>
                        <div className="kb-item">Build landing page<div className="avs"><span className="av vp"></span><span className="av vb"></span><span className="kp">+2</span></div></div>
                        <div className="kb-item">Talk to 10 users<div className="avs"><span className="av vp"></span><span className="av vp"></span><span className="kp">+2</span></div></div>
                        <div className="kb-item">Create prototype<div className="avs"><span className="av vb"></span><span className="kp">+2</span></div></div>
                        <div className="kb-item">Add analytics<div className="avs"><span className="av vp"></span><span className="av vb"></span><span className="kp">+2</span></div></div>
                      </div>
                      <div className="kb-col">
                        <div className="kb-ct">In Progress<div className="kb-b">2</div></div>
                        <div className="kb-item">Design feedback flow<div className="avs"><span className="av vp"></span><span className="av vb"></span><span className="kp">+2</span></div></div>
                        <div className="kb-item">Implement auth<div className="avs"><span className="av vb"></span><span className="av vp"></span><span className="kp">+2</span></div></div>
                      </div>
                      <div className="kb-col">
                        <div className="kb-ct">Done<div className="kb-b">2</div></div>
                        <div className="kb-item"><div className="kb-row">Define problem<div className="kchk">✓</div></div><div className="avs"><span className="av vp"></span><span className="av vb"></span></div></div>
                        <div className="kb-item"><div className="kb-row">Setup database<div className="kchk">✓</div></div><div className="avs"><span className="av vb"></span></div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-divider"></div>
          </div>

          <div className="pg-num"><span>04</span> / 06 — Validation</div>
        </section>

        <section className="page pg5" id="p5">
          <canvas className="stars" ref={el => starsRefs.current[4] = el}></canvas>
          <div className="dust" ref={el => dustRefs.current[4] = el}></div>
          <div className="sweep" id="sw5"></div>

          <div className="page-inner">
            <div className="col-text" style={{ paddingTop: 'var(--nav-h)' }}>
              <div className="plabel">
                <span className="plabel-num">05</span>
                <span className="plabel-txt">Execution</span>
              </div>
              <h2 className="sr">Build together.<br/>Before you decide.</h2>
              <p className="sr d2" style={{ marginTop: '1rem' }}>Move fast. Collaborate. Ship something real. See if you're the right team for the long run — before making it official.</p>
              <div style={{ marginTop: '1.5rem' }}>
                <p className="li-item sr d3">→ Ship a real MVP together</p>
                <p className="li-item sr d4">→ See how you handle pressure</p>
                <p className="li-item sr d5">→ Discover your build rhythm</p>
              </div>
            </div>

            <div className="col-vis">
              <div className="kb-outer" style={{ perspective: '1050px' }}>
                <div className="srr" style={{ width: 'min(400px,38vw)', position: 'relative', animation: 'kbF2 5.8s ease-in-out infinite', transformStyle: 'preserve-3d' }}>
                  <div style={{ position: 'absolute', bottom: '-28px', left: '8%', right: '8%', height: '56px', background: 'radial-gradient(ellipse at 50% 0%,rgba(100,66,255,.5) 0%,rgba(68,48,218,.16) 55%,transparent 80%)', filter: 'blur(16px)', zIndex: -1 }}></div>
                  <div className="kb-card">
                    <div className="kb-h">Trial Sprint · Week 2</div>
                    <div className="kb-cols">
                      <div className="kb-col">
                        <div className="kb-ct">To Do<div className="kb-b">2</div></div>
                        <div className="kb-item">Add analytics<div className="avs"><span className="av vp"></span><span className="av vb"></span><span className="kp">+2</span></div></div>
                        <div className="kb-item">Prepare pitch deck<div className="avs"><span className="av vb"></span><span className="av vp"></span><span className="kp">+2</span></div></div>
                      </div>
                      <div className="kb-col">
                        <div className="kb-ct">In Progress<div className="kb-b">2</div></div>
                        <div className="kb-item">Build landing page<div className="avs"><span className="av vp"></span><span className="kp">+2</span></div></div>
                        <div className="kb-item">Refine onboarding<div className="avs"><span className="av vb"></span><span className="av vp"></span><span className="kp">+2</span></div></div>
                      </div>
                      <div className="kb-col">
                        <div className="kb-ct">Done<div className="kb-b">3</div></div>
                        <div className="kb-item"><div className="kb-row">Talk to users<div className="kchk">✓</div></div><div className="avs"><span className="av vp"></span><span className="av vb"></span></div></div>
                        <div className="kb-item"><div className="kb-row">Create prototype<div className="kchk">✓</div></div><div className="avs"><span className="av vb"></span></div></div>
                        <div className="kb-item"><div className="kb-row">Setup database<div className="kchk">✓</div></div><div className="avs"><span className="av vp"></span></div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-divider"></div>
            <div className="connector-dot" style={{ '--dl': '.8s' } as any}></div>
          </div>

          <div className="pg-num"><span>05</span> / 06 — Execution</div>
        </section>

        <section className="page pg6" id="p6">
          <canvas className="stars" ref={el => starsRefs.current[5] = el}></canvas>
          <div className="dust" ref={el => dustRefs.current[5] = el}></div>
          <div className="sweep" id="sw6"></div>

          <div className="page-inner">
            <div className="col-text" style={{ paddingTop: 'var(--nav-h)' }}>
              <div className="plabel">
                <span className="plabel-num">06</span>
                <span className="plabel-txt">Outcome</span>
              </div>
              <h2 className="sr">Find your cofounder.<br/>Start your startup.</h2>
              <div style={{ marginTop: '1.4rem' }}>
                <p className="li-item sr d2">✦ Real connection.</p>
                <p className="li-item sr d3">✦ Real validation.</p>
                <p className="li-item sr d4">✦ Real progress.</p>
              </div>
              <p className="sr d4" style={{ marginTop: '1.4rem', fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.8, maxWidth: '340px' }}>Stop guessing. Stop wasting months on the wrong person. Match by Minds gives you proof before the commitment.</p>
              <button className="btn sr d5" style={{ marginTop: '1.8rem' }} onClick={() => navigate('/auth')}>Start Your First Sprint →</button>
              <p className="sr d6" style={{ marginTop: '.9rem', fontSize: '.66rem', color: 'var(--dim)' }}>Free to start · No credit card required</p>
            </div>

            <div className="col-vis">
              <div className="orb-scene">
                <div className="ring" style={{ width: '240px', height: '240px', '--d': '13s' } as any}></div>
                <div className="ring rev" style={{ width: '178px', height: '178px', '--d': '9.5s' } as any}></div>
                <div className="ring" style={{ width: '295px', height: '295px', '--d': '17s', borderColor: 'rgba(100,80,200,.07)' } as any}></div>
                <div className="orb-pair srs">
                  <div className="orb-col">
                    <div className="orb orb-p"><div className="oav"></div></div>
                    <div className="orb-base"></div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 -4px', paddingBottom: '14px' }}>
                    <div className="beam"></div>
                  </div>
                  <div className="orb-col">
                    <div className="orb orb-b" style={{ animationDelay: '.88s' }}><div className="oav oav-b"></div></div>
                    <div className="orb-base orb-base-b"></div>
                  </div>
                </div>
                <div className="outcome-glow"></div>
              </div>
            </div>

            <div className="col-divider"></div>
          </div>

          <div className="pg-num"><span>06</span> / 06 — Outcome</div>
        </section>

      </div>
    </div>
  );
};

export default GenZYCLanding;
