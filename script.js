/* ================================================
   KARAN THAKUR — PORTFOLIO SCRIPT
   Clean, Professional, No-Framework
   ================================================ */

// ── Project Data ──
const projects = [
    {
        icon: '🏔️',
        title: 'Boomerang',
        sub: '3D Game — Unity — 2025',
        status: 'completed',
        statusLabel: 'Completed',
        desc: '3D obstacle game where players cross a river using stepping stones. Features timing-based gameplay with realistic physics interactions built in Unity.',
        role: 'Game Programmer',
        tools: 'Unity, C#, Blender',
        features: [
            'Timing-based stepping stone mechanics',
            'Physics-driven player movement',
            'Smooth camera follow system'
        ],
        tags: ['Unity', 'C#', 'Physics', '3D'],
        github: 'https://github.com/Karan-Thakur69281112233/Boomerang',
        thumbnail: 'assets/boomerang.png',
        video: null
    },
    {
        icon: '🦊',
        title: 'Fangs & Wings',
        sub: '2D Survival Game — Unity — 2025',
        status: 'completed',
        statusLabel: 'Completed',
        desc: 'Fangs & Wings is a 2D survival game centered around dual-character control, where the player manages both a fox on the ground and an eagle in the air. The objective is to survive against continuous waves of attacking bats that target the fox. While the fox must be carefully moved to avoid danger, the eagle acts as the primary defense, eliminating enemies before they reach their target.',
        role: 'Game Programmer',
        tools: 'Unity, C#',
        features: [
            'Dual-character control system',
            'Fixed interval bat enemy waves',
            'Coordination and multitasking gameplay'
        ],
        tags: ['Unity', 'C#', '2D', 'Survival'],
        github: 'https://github.com/Karan-Thakur69281112233/fangs-and-wings',
        thumbnail: 'assets/Fangs & Wings.png',
        video: null
    }
];

// ── Skills Data ──
const skillCategories = [
    {
        icon: '💻',
        title: 'Programming',
        skills: ['C', 'C++', 'C#']
    },
    {
        icon: '🎮',
        title: 'Game Dev',
        skills: ['Unity', 'Unreal (Basic)']
    },
    {
        icon: '🎨',
        title: 'Tools',
        skills: ['Blender', 'Photoshop']
    },
    {
        icon: '🌐',
        title: 'Additional',
        skills: ['JavaScript', 'HTML / CSS', 'React']
    }
];

// ── Render Projects ──
function renderProjects() {
    const container = document.getElementById('projectsList');
    if (!container) return;

    container.innerHTML = projects.map((p, i) => {
        const hasMedia = p.thumbnail || p.video;
        const mediaClass = (p.thumbnail && p.video) ? '' : ' single';

        return `
        <div class="project-card reveal" style="transition-delay: ${i * 0.1}s">
            <div class="project-card-inner">
                <div class="project-header">
                    <div class="project-title-group">
                        <h3 class="project-title">${p.title}</h3>
                        <span class="project-sub">${p.sub}</span>
                    </div>
                    <span class="project-status ${p.status}">${p.statusLabel}</span>
                </div>

                <div class="project-media single">
                    <div class="project-thumbnail">
                        ${p.thumbnail
                            ? `<img src="${p.thumbnail}" alt="${p.title} screenshot" class="thumbnail-img">`
                            : `<div class="thumbnail-placeholder">${p.icon}</div>`
                        }
                    </div>
                </div>

                <p class="project-desc">${p.desc}</p>

                <div class="project-role-tools">
                    <div class="role-tool-item">
                        <span class="rt-label">Role</span>
                        <span class="rt-value">${p.role}</span>
                    </div>
                    <div class="role-tool-item">
                        <span class="rt-label">Tools</span>
                        <span class="rt-value">${p.tools}</span>
                    </div>
                </div>

                <ul class="project-features">
                    ${p.features.map(f => `<li>${f}</li>`).join('')}
                </ul>

                <div class="project-footer">
                    <a href="${p.github}" target="_blank" rel="noopener" class="btn-github" id="github-${p.title.toLowerCase().replace(/\s+/g, '-')}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        GitHub
                    </a>
                    <div class="project-tags">
                        ${p.tags.map(t => `<span>${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ── Render Skills ──
function renderSkills() {
    const grid = document.getElementById('skillsGrid');
    if (!grid) return;

    grid.innerHTML = skillCategories.map((cat, i) => `
        <div class="skill-category reveal" style="transition-delay: ${i * 0.08}s">
            <div class="skill-cat-icon">${cat.icon}</div>
            <h3 class="skill-cat-title">${cat.title}</h3>
            <div class="skill-items">
                ${cat.skills.map(s => `
                    <div class="skill-item">
                        <div class="skill-item-dot"></div>
                        <span>${s}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// ── Typing Effect ──
function initTypingEffect() {
    const el = document.getElementById('typedText');
    if (!el) return;

    const phrases = ['Game Programmer', 'Unity Developer', 'Level Designer', 'Indie Dev'];
    let phraseIdx = 0, charIdx = 0, isDeleting = false;

    function type() {
        const current = phrases[phraseIdx];

        if (isDeleting) {
            el.textContent = current.substring(0, --charIdx);
        } else {
            el.textContent = current.substring(0, ++charIdx);
        }

        let speed = isDeleting ? 35 : 70;

        if (!isDeleting && charIdx === current.length) {
            speed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    type();
}

// ── Particle Canvas ──
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(150, Math.floor(canvas.width * canvas.height / 8000));
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 2.0 + 1.0,
                alpha: 1, // unused anyway
                color: Math.random() > 0.5
                    ? `rgba(139, 92, 246, ${Math.random() * 0.4 + 0.4})`
                    : `rgba(59, 130, 246, ${Math.random() * 0.4 + 0.3})`
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Mouse interaction
            const dxMouse = p.x - mouse.x;
            const dyMouse = p.y - mouse.y;
            const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
            
            if (distMouse < 250) {
                // Connection to mouse
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(139, 92, 246, ${0.6 * (1 - distMouse / 250)})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
                
                // Slight repulsion
                const force = (250 - distMouse) / 250;
                p.x += (dxMouse / distMouse) * force * 2.5;
                p.y += (dyMouse / distMouse) * force * 2.5;
            }

            // Wrap
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 160) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 160)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        });

        animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });
}

// ── Navigation ──
function initNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
    });

    // Close on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('open');
        });
    });

    // Active section tracking
    const sections = document.querySelectorAll('.section, .hero');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 200) current = s.id;
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    });
}

// ── Scroll Reveal ──
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal, .section-header, .about-grid, .contact-content, .resume-content').forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
        observer.observe(el);
    });
}

// ── Smooth Scroll ──
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    renderSkills();
    initTypingEffect();
    initParticles();
    initNav();
    initReveal();
    initSmoothScroll();
});
