const { useState, useEffect, useRef, useCallback } = React;

// ═══ AUDIO ═══
let audioCtx = null, soundOn = false;
function beep(f = 440, d = 0.1, t = 'square') {
    if (!soundOn || !audioCtx) return;
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = t; o.frequency.setValueAtTime(f, audioCtx.currentTime);
    g.gain.setValueAtTime(0.06, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + d);
    o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + d);
}
const sfx = { click: () => beep(700, .05), hover: () => beep(500, .03, 'sine'), achieve: () => { beep(523, .15); setTimeout(() => beep(659, .15), 150); setTimeout(() => beep(784, .3), 300) }, type: () => beep(420 + Math.random() * 180, .02, 'sine') };

// ═══ ROAD BG ═══
function RoadBg() {
    const ref = useRef(null);
    useEffect(() => {
        const c = ref.current, ctx = c.getContext('2d');
        let off = 0, scrollSpd = 0, lastSY = 0, raf;
        const stars = Array.from({ length: 50 }, () => ({ x: Math.random() * 2e3, y: Math.random() * 2e3, r: .4 + Math.random() * .8, a: .15 + Math.random() * .25, t: Math.random() * 6.28 }));
        const trees = Array.from({ length: 20 }, () => ({ y: Math.random() * 3e3, e: ['🌲', '🌳', '🏠', '⛽', '🏢'][Math.floor(Math.random() * 5)], s: 12 + Math.random() * 8, side: Math.random() > .5 ? 1 : -1 }));
        function resize() { c.width = innerWidth; c.height = innerHeight }
        function onScroll() { scrollSpd = Math.abs(scrollY - lastSY); lastSY = scrollY }
        resize(); addEventListener('resize', resize); addEventListener('scroll', onScroll);
        function draw() {
            const W = c.width, H = c.height; ctx.clearRect(0, 0, W, H);
            off += 1.5 + scrollSpd * .3; scrollSpd *= .92;
            const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#06061a'); sky.addColorStop(1, '#100e30');
            ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
            stars.forEach(s => { s.t += .015; ctx.beginPath(); ctx.arc(s.x % W, s.y % H, s.r, 0, 6.28); ctx.fillStyle = `rgba(200,190,255,${s.a * (.6 + Math.sin(s.t) * .4)})`; ctx.fill() });
            const rw = Math.min(200, W * .2), rx = W / 2 - rw / 2;
            ctx.fillStyle = '#151228'; ctx.fillRect(rx - 25, 0, rw + 50, H);
            ctx.fillStyle = '#1a1840'; ctx.fillRect(rx, 0, rw, H);
            ctx.strokeStyle = 'rgba(168,85,247,.3)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(rx, 0); ctx.lineTo(rx, H); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(rx + rw, 0); ctx.lineTo(rx + rw, H); ctx.stroke();
            const dl = 35, tt = 60;
            ctx.strokeStyle = 'rgba(168,85,247,.15)'; ctx.lineWidth = 1.5;
            for (let y = -(off % tt); y < H; y += tt) { ctx.beginPath(); ctx.moveTo(W / 2, y); ctx.lineTo(W / 2, y + dl); ctx.stroke() }
            trees.forEach(t => { const sy = ((t.y - off * .25) % 3e3 + 3e3) % 3e3 / 3e3 * H; ctx.font = `${t.s}px serif`; ctx.textAlign = 'center'; ctx.globalAlpha = .4; ctx.fillText(t.e, t.side > 0 ? rx + rw + 40 : rx - 40, sy); ctx.globalAlpha = 1 });
            raf = requestAnimationFrame(draw);
        }
        draw();
        return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('scroll', onScroll) };
    }, []);
    return <canvas ref={ref} className="road-canvas" />;
}

// ═══ LOADER ═══
function Loader({ onDone }) {
    const [pct, setPct] = useState(0);
    useEffect(() => {
        let p = 0; const i = setInterval(() => { p += Math.random() * 14 + 3; if (p >= 100) { p = 100; clearInterval(i); setTimeout(onDone, 500) } setPct(Math.min(100, Math.floor(p))) }, 100);
        return () => clearInterval(i);
    }, []);
    return <div className="loader"><div className="loader-content" style={{ textAlign: 'center' }}>
        <div className="loader-car">🏎️</div>
        <div className="loader-title">STARTING ENGINE...</div>
        <div className="loader-bar"><div className="loader-fill" style={{ width: pct + '%' }} /></div>
        <div className="loader-pct">{pct}%</div>
        <div className="loader-tip">TIP: Play 4 different mini-games in the arcade!</div>
    </div></div>;
}

// ═══ NAVBAR ═══
function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState('hero');
    const [menuOpen, setMenuOpen] = useState(false);
    const links = [['hero', 'HOME', '1'], ['about', 'PROFILE', '2'], ['skills', 'SKILLS', '3'], ['projects', 'PROJECTS', '4'], ['education', 'EDU', '5'], ['contact', 'CONTACT', '6']];
    useEffect(() => {
        const h = () => {
            setScrolled(scrollY > 50);
            let c = 'hero'; document.querySelectorAll('.section,.hero').forEach(s => { if (scrollY >= s.offsetTop - 150) c = s.id }); setActive(c);
        };
        addEventListener('scroll', h);
        const k = e => { const m = { '1': 'hero', '2': 'about', '3': 'skills', '4': 'projects', '5': 'education', '6': 'contact' }; if (m[e.key]) { e.preventDefault(); document.getElementById(m[e.key])?.scrollIntoView({ behavior: 'smooth' }); sfx.click() } };
        addEventListener('keydown', k);
        return () => { removeEventListener('scroll', h); removeEventListener('keydown', k) };
    }, []);
    return <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-brand">
            <div className="brand-badge"><span>KT</span></div>
            <div><div className="brand-name">KARAN THAKUR</div><div className="xp-bar"><div className="xp-fill" /></div><div className="brand-sub">LVL 22 — GAME PROGRAMMER</div></div>
        </div>
        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
            {links.map(([id, label, key]) => <li key={id}><a href={`#${id}`} className={`nav-link${active === id ? ' active' : ''}`} onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); sfx.click() }}><span className="hk">{key}</span>{label}</a></li>)}
        </ul>
        <button className={`hamburger${menuOpen ? ' active' : ''}`} onClick={() => { setMenuOpen(!menuOpen); sfx.click() }}><span /><span /><span /></button>
    </nav>;
}

// ═══ GAME ARCADE ═══
function GameArcade() {
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const [score, setScore] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [msg, setMsg] = useState('');
    const gameInfo = { name: '🧱 BREAKOUT', w: 480, h: 360, keys: 'Mouse to move paddle' };

    const startGame = useCallback(() => {
        const c = canvasRef.current; if (!c) return;
        c.width = gameInfo.w; c.height = gameInfo.h;
        if (engineRef.current?.stop) engineRef.current.stop();
        const eng = new GameEngines.Pong(c);
        engineRef.current = eng;
        eng.start(s => { setScore(s); sfx.click() }, s => { setPlaying(false); setMsg(`GAME OVER! Score: ${s}`); sfx.achieve() });
        setPlaying(true); setScore(0); setMsg('');
    }, []);

    useEffect(() => {
        const m = e => { if (engineRef.current?.running) engineRef.current.movePaddle(e.clientX) };
        addEventListener('mousemove', m);
        return () => { removeEventListener('mousemove', m) };
    }, []);

    return <div style={{ marginTop: 30 }}>
        <div className="game-area">
            <div className="game-hud">
                <span className="hud-item">🏆 {score}</span>
                <span className="hud-item">{gameInfo.name}</span>
            </div>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            {!playing && <div className="game-overlay">
                <h3>{msg || gameInfo.name}</h3>
                {msg && <p style={{ color: '#fbbf24' }}>Score: {score}</p>}
                <p>Controls: {gameInfo.keys}</p>
                <button className="game-start-btn" onClick={startGame}>{msg ? '🔄 RETRY' : '▶ START'}</button>
                <div className="game-instructions">Press START then move your mouse to control the paddle</div>
            </div>}
        </div>
    </div>;
}

// ═══ HERO ═══
function Hero() {
    const [typed, setTyped] = useState('');
    useEffect(() => {
        const phrases = ['GAME PROGRAMMER', 'UNITY DEVELOPER', 'LEVEL DESIGNER', 'INDIE DEV'];
        let pi = 0, ci = 0, del = false, t;
        function loop() {
            const p = phrases[pi];
            if (del) setTyped(p.substring(0, --ci));
            else setTyped(p.substring(0, ++ci));
            let spd = del ? 35 : 65;
            if (!del && ci === p.length) { spd = 2200; del = true }
            else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; spd = 500 }
            t = setTimeout(loop, spd);
        }
        loop(); return () => clearTimeout(t);
    }, []);
    return <section className="hero" id="hero">
        <div className="hero-content">
            <div className="hero-badge"><span className="badge-dot" />PLAYER ONE — READY</div>
            <h1 className="hero-name"><span className="n1">KARAN</span><span className="n2">THAKUR</span></h1>
            <div className="hero-typed"><span className="tb">&lt;</span><span className="typed-value">{typed}</span><span className="typed-cursor">|</span><span className="tb">/&gt;</span></div>
            <div className="hero-stats">
                <div className="hs"><span className="hs-val">4</span><span className="hs-label">PROJECTS</span></div>

                <div className="hs"><span className="hs-val">6+</span><span className="hs-label">LANGUAGES</span></div>
            </div>
            <div className="hero-keys"><span className="hkey"><kbd>1</kbd>-<kbd>6</kbd> Navigate</span><span className="hkey"><kbd>↓</kbd> Scroll</span></div>
            <div className="hero-btns">
                <a href="#skills" className="btn-p" onClick={e => { e.preventDefault(); document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) }}><span>▶</span> ARCADE & SKILLS</a>
                <a href="#contact" className="btn-o" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}><span>⌨</span> TERMINAL</a>
            </div>
        </div>
    </section>;
}

// ═══ SKILL DATA ═══
const skillsData = [
    { name: 'C', type: 'Language', exp: '2 Years', desc: 'Low-level systems programming. Memory management and raw performance.', icon: '⚔️' },
    { name: 'C++', type: 'Language', exp: '2 Years', desc: 'Backbone of AAA game engines. High-performance game logic and systems.', icon: '🗡️' },
    { name: 'C# / Unity', type: 'Primary Weapon', exp: '1 Year', desc: 'Primary weapon of choice. Powers all Unity game projects.', icon: '🔮' },
    { name: 'JavaScript', type: 'Language', exp: '2 Years', desc: 'Web interactivity, dynamic front-end experiences.', icon: '⚡' },
    { name: 'TypeScript', type: 'Language', exp: '2 Years', desc: 'Type-safe JavaScript for larger codebases.', icon: '🛡️' },
    { name: 'Unity', type: 'Game Engine', exp: '1 Year', desc: 'Core gameplay engine. Rendering, physics, prototyping.', icon: '🎮' },
    { name: 'Blender', type: '3D Tool', exp: '1 Year', desc: '3D modeling, sculpting, texturing, game assets.', icon: '🎨' },
    { name: 'Photoshop', type: '2D Tool', exp: '1 Year', desc: 'Textures, UI mockups, concept art.', icon: '🖌️' },
    { name: 'React', type: 'Framework', exp: '2 Years', desc: 'Frontend UI framework for web interfaces.', icon: '⚛️' },
    { name: 'OOP', type: 'Concept', exp: '2 Years', desc: 'Clean architecture, design patterns, SOLID.', icon: '📐' },
];

// ═══ REVEAL HOOK ═══
function useReveal(threshold = 0.12) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) setVis(true) }, { threshold, rootMargin: '0px 0px -40px 0px' });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, vis];
}

// ═══ ABOUT ═══
function About() {
    const [ref, vis] = useReveal();
    return <section className="section" id="about" ref={ref}>
        <div className="container">
            <div className={`sec-head reveal${vis ? ' vis' : ''}`}><span className="sh-line" /><h2>ABOUT ME</h2><span className="sh-line" /></div>
            <div className={`about-intro reveal${vis ? ' vis' : ''}`} style={{ transitionDelay: '.15s' }}>
                <p>I am a passionate <strong>Game Development</strong> student at <strong>Chitkara University</strong>, driven by a strong interest in creating interactive and engaging gaming experiences. I enjoy transforming ideas into playable games, focusing on both creativity and functionality.</p>
                <p>Alongside game development, I am enthusiastic about <strong>3D modeling in Blender</strong> and creating <strong>2D art</strong>, which allows me to bring my concepts to life visually. As a fresher in the game development field, I am constantly learning, experimenting, and improving my skills to grow as a developer.</p>
                <p>I am eager to explore new technologies, collaborate on exciting projects, and contribute to innovative game experiences.</p>
            </div>
        </div>
    </section>;
}

// ═══ SKILLS + ARCADE ═══
function Skills() {
    const [ref, vis] = useReveal();
    const [sel, setSel] = useState(null);
    const s = sel !== null ? skillsData[sel] : null;
    return <section className="section" id="skills" ref={ref}>
        <div className="container">
            <div className={`sec-head reveal${vis ? ' vis' : ''}`}><span className="sh-line" /><h2>SKILLS & ARCADE</h2><span className="sh-line" /></div>
            <div className={`reveal${vis ? ' vis' : ''}`}>
                <div className="skills-layout">
                    <div className="skills-grid">
                        {skillsData.map((sk, i) => <div key={i} className={`skill-card${sel === i ? ' active' : ''}`} onClick={() => { setSel(i); sfx.click() }} onMouseEnter={() => sfx.hover()}>
                            <div className="sk-icon">{sk.icon}</div><div className="sk-name">{sk.name}</div>
                        </div>)}
                    </div>
                    <div className="sk-detail">
                        <div className="sd-name">{s ? s.name : 'SELECT A SKILL'}</div>
                        {s && <div className="sd-badge">{s.exp}</div>}
                        <div className="sd-type">{s ? s.type.toUpperCase() : 'Click any card to inspect'}</div>
                        <p className="sd-desc">{s ? s.desc : 'Hover over or click on skill cards to see details.'}</p>
                    </div>
                </div>
                <GameArcade />
            </div>
        </div>
    </section>;
}

// ═══ PROJECTS ═══
const projects = [
    { icon: '🏔️', name: 'Boomerang', sub: '3D GAME — 2025', status: 'complete', ribbon: '✅ COMPLETED', desc: '3D obstacle game — cross a river using stepping stones. Timing-based gameplay with physics in Unity.', tags: ['Unity', 'C#', 'Physics', '3D'], xp: 90, img: '/assets/boomerang.png' },
    { icon: '🦊', name: 'Fangs & Wings', sub: '2D SURVIVAL GAME — 2025', status: 'complete', ribbon: '✅ COMPLETED', desc: 'Fangs & Wings is a 2D survival game centered around dual-character control, where the player manages both a fox on the ground and an eagle in the air. The objective is to survive against continuously attacking bats that target the fox. While the fox must be carefully moved to avoid danger, the eagle acts as the primary defense, eliminating enemies before they reach their target.', tags: ['Unity', 'C#', 'Enemy AI', '2D'], xp: 75, img: '/assets/fangs-and-wings.png' }
];

function Projects() {
    const [ref, vis] = useReveal();
    const [open, setOpen] = useState(-1);
    return <section className="section" id="projects" ref={ref}>
        <div className="container">
            <div className={`sec-head reveal${vis ? ' vis' : ''}`}><span className="sh-line" /><h2>PROJECT GARAGE</h2><span className="sh-line" /></div>
            <div className={`proj-list reveal${vis ? ' vis' : ''}`}>
                {projects.map((p, i) => <div key={i} className={`proj${open === i ? ' open' : ''}`}>
                    <div className={`proj-ribbon${p.status === 'proto' ? ' proto' : ''}${p.status === 'shipped' ? ' shipped' : ''}`}>{p.ribbon}</div>
                    <div className="proj-top" onClick={() => { setOpen(open === i ? -1 : i); sfx.click() }}>
                        <div className="proj-icon">{p.icon}</div><div className="proj-info"><h3>{p.name}</h3><span className="proj-sub">{p.sub}</span></div>
                    </div>
                    <div className="proj-body">{p.img && <div className="proj-screenshot"><img src={p.img} alt={p.name + ' screenshot'} className="proj-img" /></div>}<p>{p.desc}</p><div className="proj-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div><div className="proj-xp"><div className="xp-track"><div className="xp-bar" style={{ width: p.xp + '%' }} /></div><span>{p.xp * 10}/1000 XP</span></div></div>
                    <button className="proj-toggle" onClick={() => { setOpen(open === i ? -1 : i); sfx.click() }}>{open === i ? '▲ COLLAPSE' : '▼ DETAILS'}</button>
                </div>)}
            </div>
        </div>
    </section>;
}

// ═══ EDUCATION ═══
const eduData = [
    { icon: '🎓', title: 'Scholar of the Realm', desc: 'B.E. Computer Science — Chitkara University', sub: 'Game Development / CS', year: '2023-2027', badge: 'Ongoing ⭐' },
    { icon: '📚', title: 'Senior Adventurer', desc: 'Class XII — CBSE Mahavir Public School', year: '2022-2023', badge: '85%' },
    { icon: '🌟', title: 'First Steps', desc: 'Class X — DAV Public School Sundernagar', year: '2020-2021', badge: '90%' },
];

function Education() {
    const [ref, vis] = useReveal();
    const [toastQ, setToastQ] = useState([]);
    const [toastShow, setToastShow] = useState(false);
    const [toastText, setToastText] = useState('');
    const shown = useRef(new Set());

    useEffect(() => {
        if (!vis) return;
        eduData.forEach((e, i) => {
            if (!shown.current.has(i)) { shown.current.add(i); setTimeout(() => { setToastText(e.title); setToastShow(true); sfx.achieve(); setTimeout(() => setToastShow(false), 2500) }, i * 3000) }
        });
    }, [vis]);

    return <><section className="section" id="education" ref={ref}>
        <div className="container">
            <div className={`sec-head reveal${vis ? ' vis' : ''}`}><span className="sh-line" /><h2>EDUCATION</h2><span className="sh-line" /></div>
            <div className={`achiev-list reveal${vis ? ' vis' : ''}`}>
                {eduData.map((e, i) => <div className="achiev" key={i}>
                    <div className="achiev-icon">{e.icon}</div>
                    <div className="achiev-info"><h3>{e.title}</h3><p>{e.desc}</p>{e.sub && <p className="achiev-sub">{e.sub}</p>}<div className="achiev-meta"><span className="am-year">{e.year}</span><span className="am-badge">{e.badge}</span></div></div>
                </div>)}
            </div>
        </div>
    </section>
        <div className={`toast${toastShow ? ' show' : ''}`}><div className="toast-icon">🏆</div><div className="toast-body"><span className="toast-label">ACHIEVEMENT UNLOCKED</span><span className="toast-name">{toastText}</span></div></div>
    </>;
}

// ═══ TERMINAL ═══
function Terminal() {
    const [out, setOut] = useState(`<span class="t-accent">╔═══════════════════════════════════════╗
║  KARAN THAKUR — PORTFOLIO TERMINAL    ║
╚═══════════════════════════════════════╝</span>
<span class="t-green">Welcome!</span> Type <span class="t-green">'help'</span> for commands.\n\n`);
    const [val, setVal] = useState('');
    const screenRef = useRef(null);
    const cmds = {
        help: `<span class="t-accent">═══ COMMANDS ═══</span>\n  <span class="t-green">about</span>     — who is Karan\n  <span class="t-green">skills</span>    — tech stack\n  <span class="t-green">projects</span>  — quest log\n  <span class="t-green">contact</span>   — reach out\n  <span class="t-green">clear</span>     — clear\n  <span class="t-green">games</span>     — 🎮 arcade\n  <span class="t-green">secret</span>    — ???\n  <span class="t-green">matrix</span>    — enter matrix`,
        about: `<span class="t-accent">═══ KARAN THAKUR ═══</span>\nGame Design & Programming @ Chitkara University.\nUnity, level design, 3D assets.\n<span class="t-green">📍</span> Sundernagar, HP, India`,
        skills: `<span class="t-accent">═══ TECH ═══</span>\n<span class="t-green">Lang:</span> C • C++ • C# • JS • TS\n<span class="t-green">Engine:</span> Unity\n<span class="t-green">Tools:</span> Blender • Photoshop • React • AWS`,
        projects: `<span class="t-accent">═══ PROJECTS ═══</span>\n<span class="t-green">[★★★★☆]</span> Boomerang — 3D obstacle\n<span class="t-green">[★★★☆☆]</span> Forest Runner — 2D platformer\n<span class="t-green">[★★★★☆]</span> Office Wars — card game\n<span class="t-green">[★★★★★]</span> Hand Gesture PPT`,
        contact: `<span class="t-accent">═══ CONTACT ═══</span>\n<span class="t-green">📧</span> karan.snrhp@gmail.com\n<span class="t-green">📱</span> +91 6230269281\n<span class="t-green">📍</span> Sundernagar, HP`,
        games: `<span class="t-amber">🎮 ARCADE READY!</span>\nScroll up to the Skills section for 4 playable games:\n<span class="t-green">🐍 Snake • 🧱 Breakout • 🐤 Flappy • 🏎️ Car Dodge</span>`,
        secret: `<span class="t-accent">🎮 SECRET!</span>\nTry Konami: <span class="t-green">↑↑↓↓←→←→BA</span>\nAlso try: <span class="t-green">games</span>, <span class="t-green">matrix</span>`,
        matrix: (() => { let s = ''; for (let i = 0; i < 4; i++) { let r = ''; for (let j = 0; j < 40; j++)r += String.fromCharCode(0x30A0 + Math.random() * 96); s += `<span class="t-green">${r}</span>\n` } return s + `<span class="t-accent">Wake up, Neo...</span>` })(),
    };
    const run = cmd => {
        const c = cmd.trim().toLowerCase(); if (!c) return;
        let r;
        if (c === 'clear') { setOut(''); return }
        r = cmds[c] || `<span class="t-err">Unknown: '${c}'. Type 'help'.</span>`;
        setOut(p => p + `<span class="t-cmd">❯ ${c}</span>\n` + r + '\n\n');
        setTimeout(() => { if (screenRef.current) screenRef.current.scrollTop = screenRef.current.scrollHeight }, 50);
    };
    return <div className="contact-grid">
        <div className="terminal">
            <div className="term-bar"><div className="term-dots"><span className="td r" /><span className="td y" /><span className="td g" /></div><span className="term-title">karan@portfolio ~ bash</span></div>
            <div className="term-screen" ref={screenRef}>
                <div className="term-out" dangerouslySetInnerHTML={{ __html: out }} />
                <div className="term-in-line"><span className="term-prompt">❯</span><input className="term-input" value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { run(val); setVal(''); sfx.click() } }} placeholder='type "help"...' autoComplete="off" spellCheck={false} /></div>
            </div>
        </div>
        <div className="contact-info">
            <h3 className="ci-title">QUICK ACCESS</h3>
            <a href="mailto:karan.snrhp@gmail.com" className="ci-card"><span className="ci-icon">📧</span><div><span className="ci-label">EMAIL</span><span className="ci-val">karan.snrhp@gmail.com</span></div></a>
            <a href="tel:+916230269281" className="ci-card"><span className="ci-icon">📱</span><div><span className="ci-label">PHONE</span><span className="ci-val">+91 6230269281</span></div></a>
            <div className="ci-card"><span className="ci-icon">📍</span><div><span className="ci-label">LOCATION</span><span className="ci-val">Sundernagar, HP, India</span></div></div>
            <div className="ci-cmds"><div><code>help</code> — commands</div><div><code>games</code> — 🎮 arcade</div><div><code>secret</code> — ???</div></div>
        </div>
    </div>;
}

// ═══ CONTACT ═══
function Contact() {
    const [ref, vis] = useReveal();
    return <section className="section" id="contact" ref={ref}>
        <div className="container">
            <div className={`sec-head reveal${vis ? ' vis' : ''}`}><span className="sh-line" /><h2>PIT STOP — CONTACT</h2><span className="sh-line" /></div>
            <div className={`reveal${vis ? ' vis' : ''}`}><Terminal /></div>
        </div>
    </section>;
}

// ═══ KONAMI ═══
function Konami() {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let i = 0;
        const h = e => { if (e.key === seq[i]) { i++; if (i === seq.length) { setShow(true); sfx.achieve(); i = 0 } } else i = 0 };
        addEventListener('keydown', h); return () => removeEventListener('keydown', h);
    }, []);
    if (!show) return null;
    return <div className="konami-ov show"><div className="konami-box"><div className="konami-emoji">🏎️</div><h2>SECRET UNLOCKED!</h2><p>You found the Konami Code Easter Egg!</p><p className="konami-code">↑ ↑ ↓ ↓ ← → ← → B A</p><button className="konami-close" onClick={() => { setShow(false); sfx.click() }}>CONTINUE</button></div></div>;
}

// ═══ APP ═══
function App() {
    const [loaded, setLoaded] = useState(false);
    const [sndOn, setSndOn] = useState(false);
    return <>
        {!loaded && <Loader onDone={() => setLoaded(true)} />}
        <RoadBg />
        <button className="snd-btn" onClick={() => { soundOn = !soundOn; if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); setSndOn(soundOn) }}>{sndOn ? '🔊' : '🔇'}</button>
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Education />
        <Contact />
        <footer className="footer"><div className="container footer-inner"><span className="f-brand">⟨ KT /⟩</span><p>Designed & Built by Karan Thakur © 2025</p><p className="f-hint">// 4 PLAYABLE GAMES INSIDE — try ↑↑↓↓←→←→BA</p></div></footer>
        <Konami />
    </>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
