/* GAME ENGINES — Plain JS for canvas games */
window.GameEngines = {

    // ============ SNAKE GAME ============
    Snake: class {
        constructor(canvas) {
            this.c = canvas; this.x = canvas.getContext('2d');
            this.cols = 20; this.rows = 15;
            this.cellW = canvas.width / this.cols;
            this.cellH = canvas.height / this.rows;
            this.reset(); this.running = false;
        }
        reset() {
            this.snake = [{ x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }];
            this.dir = { x: 1, y: 0 }; this.nextDir = { x: 1, y: 0 };
            this.food = this.spawnFood(); this.score = 0; this.dead = false;
        }
        spawnFood() {
            let f;
            do { f = { x: Math.floor(Math.random() * this.cols), y: Math.floor(Math.random() * this.rows) }; }
            while (this.snake.some(s => s.x === f.x && s.y === f.y));
            return f;
        }
        setDir(dx, dy) {
            if (this.dir.x === -dx && this.dir.y === -dy) return;
            this.nextDir = { x: dx, y: dy };
        }
        start(onScore, onDie) {
            this.reset(); this.running = true; this.onScore = onScore; this.onDie = onDie;
            this.interval = setInterval(() => this.tick(), 120);
        }
        stop() { this.running = false; clearInterval(this.interval); }
        tick() {
            if (this.dead) return;
            this.dir = { ...this.nextDir };
            const head = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };
            if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows || this.snake.some(s => s.x === head.x && s.y === head.y)) {
                this.dead = true; this.running = false; clearInterval(this.interval);
                if (this.onDie) this.onDie(this.score); return;
            }
            this.snake.unshift(head);
            if (head.x === this.food.x && head.y === this.food.y) {
                this.score += 10; this.food = this.spawnFood();
                if (this.onScore) this.onScore(this.score);
            } else this.snake.pop();
            this.draw();
        }
        draw() {
            const { x: ctx, cellW: cw, cellH: ch } = this;
            ctx.fillStyle = '#0c0a24'; ctx.fillRect(0, 0, this.c.width, this.c.height);
            // Grid
            ctx.strokeStyle = 'rgba(168,85,247,0.04)'; ctx.lineWidth = 0.5;
            for (let i = 0; i <= this.cols; i++) { ctx.beginPath(); ctx.moveTo(i * cw, 0); ctx.lineTo(i * cw, this.c.height); ctx.stroke(); }
            for (let i = 0; i <= this.rows; i++) { ctx.beginPath(); ctx.moveTo(0, i * ch); ctx.lineTo(this.c.width, i * ch); ctx.stroke(); }
            // Snake
            this.snake.forEach((s, i) => {
                const t = i / this.snake.length;
                ctx.fillStyle = `hsl(${270 - t * 30},80%,${60 - t * 15}%)`;
                ctx.shadowColor = 'rgba(168,85,247,0.4)'; ctx.shadowBlur = i === 0 ? 10 : 4;
                ctx.beginPath(); ctx.roundRect(s.x * cw + 1, s.y * ch + 1, cw - 2, ch - 2, 3); ctx.fill();
                ctx.shadowBlur = 0;
            });
            // Food
            ctx.fillStyle = '#fbbf24'; ctx.shadowColor = 'rgba(251,191,36,0.5)'; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.arc(this.food.x * cw + cw / 2, this.food.y * ch + ch / 2, Math.min(cw, ch) / 3, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }
    },

    // ============ PONG GAME ============
    Pong: class {
        constructor(canvas) {
            this.c = canvas; this.x = canvas.getContext('2d');
            this.W = canvas.width; this.H = canvas.height;
            this.reset(); this.running = false;
        }
        reset() {
            this.paddle = { x: this.W / 2 - 30, w: 60, h: 10, y: this.H - 25 };
            this.ball = { x: this.W / 2, y: this.H / 2, r: 6, vx: 1.8 * (Math.random() > 0.5 ? 1 : -1), vy: -1.8 };
            this.bricks = []; this.score = 0; this.dead = false;
            const cols = 8, rows = 4, bw = this.W / cols - 4, bh = 14;
            for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
                this.bricks.push({ x: c * (bw + 4) + 2, y: r * (bh + 4) + 30, w: bw, h: bh, alive: true, hue: 260 + r * 20 });
            }
        }
        start(onScore, onDie) {
            this.reset(); this.running = true; this.onScore = onScore; this.onDie = onDie;
            this.loop();
        }
        stop() { this.running = false; }
        movePaddle(mouseX) {
            const rect = this.c.getBoundingClientRect();
            const scale = this.c.width / rect.width;
            this.paddle.x = (mouseX - rect.left) * scale - this.paddle.w / 2;
            this.paddle.x = Math.max(0, Math.min(this.W - this.paddle.w, this.paddle.x));
        }
        loop() {
            if (!this.running) return;
            this.update(); this.draw();
            requestAnimationFrame(() => this.loop());
        }
        update() {
            if (this.dead) return;
            const b = this.ball;
            b.x += b.vx; b.y += b.vy;
            // Walls
            if (b.x - b.r < 0 || b.x + b.r > this.W) b.vx *= -1;
            if (b.y - b.r < 0) b.vy *= -1;
            // Paddle
            const p = this.paddle;
            if (b.vy > 0 && b.y + b.r >= p.y && b.x > p.x && b.x < p.x + p.w) {
                b.vy = -Math.abs(b.vy) * 1.02;
                b.vx += (b.x - (p.x + p.w / 2)) * 0.1;
            }
            // Bricks
            this.bricks.forEach(br => {
                if (!br.alive) return;
                if (b.x + b.r > br.x && b.x - b.r < br.x + br.w && b.y + b.r > br.y && b.y - b.r < br.y + br.h) {
                    br.alive = false; b.vy *= -1;
                    this.score += 10;
                    if (this.onScore) this.onScore(this.score);
                }
            });
            // Die
            if (b.y > this.H + 10) {
                this.dead = true; this.running = false;
                if (this.onDie) this.onDie(this.score);
            }
            // Win
            if (this.bricks.every(br => !br.alive)) {
                this.dead = true; this.running = false;
                if (this.onDie) this.onDie(this.score);
            }
        }
        draw() {
            const ctx = this.x;
            ctx.fillStyle = '#0c0a24'; ctx.fillRect(0, 0, this.W, this.H);
            // Bricks
            this.bricks.forEach(br => {
                if (!br.alive) return;
                ctx.fillStyle = `hsl(${br.hue},70%,50%)`; ctx.shadowColor = `hsl(${br.hue},70%,50%)`; ctx.shadowBlur = 6;
                ctx.beginPath(); ctx.roundRect(br.x, br.y, br.w, br.h, 3); ctx.fill();
                ctx.shadowBlur = 0;
            });
            // Paddle
            const pg = ctx.createLinearGradient(this.paddle.x, 0, this.paddle.x + this.paddle.w, 0);
            pg.addColorStop(0, '#a855f7'); pg.addColorStop(1, '#3b82f6');
            ctx.fillStyle = pg; ctx.shadowColor = 'rgba(168,85,247,0.4)'; ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.roundRect(this.paddle.x, this.paddle.y, this.paddle.w, this.paddle.h, 4); ctx.fill();
            ctx.shadowBlur = 0;
            // Ball
            ctx.fillStyle = '#fbbf24'; ctx.shadowColor = 'rgba(251,191,36,0.5)'; ctx.shadowBlur = 12;
            ctx.beginPath(); ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }
    },

    // ============ FLAPPY GAME ============
    Flappy: class {
        constructor(canvas) {
            this.c = canvas; this.x = canvas.getContext('2d');
            this.W = canvas.width; this.H = canvas.height;
            this.reset(); this.running = false;
        }
        reset() {
            this.bird = { x: 80, y: this.H / 2, vy: 0, r: 10 };
            this.pipes = []; this.score = 0; this.dead = false;
            this.frame = 0; this.spawnCD = 0;
        }
        flap() { if (!this.dead) this.bird.vy = -4.2; }
        start(onScore, onDie) {
            this.reset(); this.running = true; this.onScore = onScore; this.onDie = onDie;
            this.loop();
        }
        stop() { this.running = false; }
        loop() {
            if (!this.running) return;
            this.update(); this.draw();
            requestAnimationFrame(() => this.loop());
        }
        update() {
            if (this.dead) return;
            this.frame++;
            const b = this.bird;
            b.vy += 0.18; b.y += b.vy;
            // Pipes
            this.spawnCD--;
            if (this.spawnCD <= 0) {
                const gap = 110 + Math.random() * 40;
                const topH = 40 + Math.random() * (this.H - gap - 80);
                this.pipes.push({ x: this.W, topH, gap, scored: false });
                this.spawnCD = 110;
            }
            this.pipes.forEach(p => {
                p.x -= 1.8;
                // Collision
                if (b.x + b.r > p.x && b.x - b.r < p.x + 36) {
                    if (b.y - b.r < p.topH || b.y + b.r > p.topH + p.gap) {
                        this.dead = true; this.running = false;
                        if (this.onDie) this.onDie(this.score);
                    }
                }
                if (!p.scored && p.x + 36 < b.x) {
                    p.scored = true; this.score++;
                    if (this.onScore) this.onScore(this.score);
                }
            });
            this.pipes = this.pipes.filter(p => p.x > -40);
            if (b.y > this.H || b.y < 0) {
                this.dead = true; this.running = false;
                if (this.onDie) this.onDie(this.score);
            }
        }
        draw() {
            const ctx = this.x;
            ctx.fillStyle = '#0c0a24'; ctx.fillRect(0, 0, this.W, this.H);
            // Pipes
            this.pipes.forEach(p => {
                const pg = ctx.createLinearGradient(p.x, 0, p.x + 36, 0);
                pg.addColorStop(0, '#2d2066'); pg.addColorStop(1, '#1a1548');
                ctx.fillStyle = pg;
                ctx.fillRect(p.x, 0, 36, p.topH);
                ctx.fillRect(p.x, p.topH + p.gap, 36, this.H);
                ctx.strokeStyle = 'rgba(168,85,247,0.3)'; ctx.lineWidth = 1.5;
                ctx.strokeRect(p.x, 0, 36, p.topH);
                ctx.strokeRect(p.x, p.topH + p.gap, 36, this.H);
            });
            // Bird
            const b = this.bird;
            ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(Math.min(b.vy * 0.06, 0.5));
            ctx.fillStyle = '#fbbf24'; ctx.shadowColor = 'rgba(251,191,36,0.5)'; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.arc(0, 0, b.r, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
            // Eye
            ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(3, -3, 3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#06061a'; ctx.beginPath(); ctx.arc(4, -3, 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        }
    },

    // ============ CAR DODGE GAME ============
    CarDodge: class {
        constructor(canvas) {
            this.c = canvas; this.x = canvas.getContext('2d');
            this.W = canvas.width; this.H = canvas.height;
            this.reset(); this.running = false;
        }
        reset() {
            this.lane = 1; this.cars = []; this.score = 0; this.dead = false;
            this.frame = 0; this.roadOff = 0;
        }
        setLane(dir) {
            if (dir < 0 && this.lane > 0) this.lane--;
            if (dir > 0 && this.lane < 2) this.lane++;
        }
        start(onScore, onDie) {
            this.reset(); this.running = true; this.onScore = onScore; this.onDie = onDie;
            this.loop();
        }
        stop() { this.running = false; }
        loop() {
            if (!this.running) return;
            this.update(); this.draw();
            requestAnimationFrame(() => this.loop());
        }
        update() {
            if (this.dead) return;
            this.frame++; this.roadOff += 4;
            if (this.frame % 50 === 0) {
                const lane = Math.floor(Math.random() * 3);
                const types = ['🚗', '🚙', '🚕', '🚌', '🚐'];
                this.cars.push({ lane, y: -30, type: types[Math.floor(Math.random() * types.length)], speed: 2.5 + Math.random() * 2, passed: false });
            }
            const roadW = this.W * 0.5, roadX = this.W / 2 - roadW / 2, laneW = roadW / 3;
            const lanes = [roadX + laneW * 0.5, roadX + laneW * 1.5, roadX + laneW * 2.5];
            const carY = this.H - 60;
            this.cars.forEach(c => {
                c.y += c.speed;
                if (!c.passed && c.lane === this.lane && Math.abs(c.y - carY) < 24) {
                    this.dead = true; this.running = false;
                    if (this.onDie) this.onDie(this.score);
                }
                if (!c.passed && c.y > carY + 30) { c.passed = true; this.score += 10; if (this.onScore) this.onScore(this.score); }
            });
            this.cars = this.cars.filter(c => c.y < this.H + 40);
        }
        draw() {
            const ctx = this.x;
            ctx.fillStyle = '#0c0a24'; ctx.fillRect(0, 0, this.W, this.H);
            const roadW = this.W * 0.5, roadX = this.W / 2 - roadW / 2, laneW = roadW / 3;
            const lanes = [roadX + laneW * 0.5, roadX + laneW * 1.5, roadX + laneW * 2.5];
            // Road
            ctx.fillStyle = '#1a1840'; ctx.fillRect(roadX, 0, roadW, this.H);
            ctx.strokeStyle = 'rgba(168,85,247,0.3)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(roadX, 0); ctx.lineTo(roadX, this.H); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(roadX + roadW, 0); ctx.lineTo(roadX + roadW, this.H); ctx.stroke();
            // Dashes
            const dl = 35, gl = 25, tt = dl + gl;
            ctx.strokeStyle = 'rgba(168,85,247,0.15)'; ctx.lineWidth = 1.5;
            for (let y = -(this.roadOff % tt); y < this.H; y += tt) {
                ctx.beginPath(); ctx.moveTo(roadX + laneW, y); ctx.lineTo(roadX + laneW, y + dl); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(roadX + laneW * 2, y); ctx.lineTo(roadX + laneW * 2, y + dl); ctx.stroke();
            }
            // Player car
            const carY = this.H - 60, carX = lanes[this.lane];
            ctx.save(); ctx.translate(carX, carY);
            ctx.beginPath(); ctx.roundRect(-12, -22, 24, 44, 5);
            const cg = ctx.createLinearGradient(0, -22, 0, 22); cg.addColorStop(0, '#a855f7'); cg.addColorStop(1, '#3b82f6');
            ctx.fillStyle = cg; ctx.shadowColor = 'rgba(168,85,247,0.4)'; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(96,165,250,0.3)'; ctx.beginPath(); ctx.roundRect(-7, -14, 14, 10, 2); ctx.fill();
            ctx.fillStyle = 'rgba(251,191,36,0.8)'; ctx.beginPath(); ctx.arc(-7, -20, 2.5, 0, Math.PI * 2); ctx.arc(7, -20, 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(251,113,133,0.7)'; ctx.beginPath(); ctx.arc(-7, 20, 2, 0, Math.PI * 2); ctx.arc(7, 20, 2, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
            // Traffic
            this.cars.forEach(c => { ctx.font = '24px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(c.type, lanes[c.lane], c.y); });
        }
    }
};
