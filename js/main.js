document.addEventListener('DOMContentLoaded', () => {
    console.log('MM Digital App Initialized');

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (menuBtn && navMenu) {
        const toggleMenu = () => {
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', !isExpanded);
            menuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        };

        const closeMenu = () => {
            menuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
        };

        menuBtn.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section h2, .timeline-item, .demo-preview, .price-card, .contact-form').forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });
});

/* =========================================
   HERO ANIMATION SYSTEM
   ========================================= */
class HeroAnimation {
    constructor() {
        this.canvas = document.getElementById('heroCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };

        // Configuration
        this.config = {
            particleColor: 'rgba(56, 189, 248, ', // Base color (Tailwind sky-400)
            lineColor: 'rgba(56, 189, 248, ',
            particleCount: window.innerWidth < 768 ? 40 : 80,
            connectionDistance: 120,
            mouseDistance: 180
        };

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Re-check particle count on resize
        this.config.particleCount = window.innerWidth < 768 ? 40 : 80;
        if (this.particles.length < this.config.particleCount) {
            this.createParticles(true); // Add missing
        } else if (this.particles.length > this.config.particleCount) {
            this.particles.splice(this.config.particleCount); // Remove excess
        }
    }

    createParticles(addOnly = false) {
        const targetCount = this.config.particleCount;
        const currentCount = addOnly ? this.particles.length : 0;

        if (!addOnly) this.particles = [];

        for (let i = currentCount; i < targetCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.resize());

        window.addEventListener('mousemove', (e) => {
            // Adjust mouse position relative to canvas (if canvas is not full screen, but here it is)
            // Also account for scroll if needed, but hero is usually fixed/absolute at top
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    drawLines(p, i) {
        // Connect to other particles
        for (let j = i + 1; j < this.particles.length; j++) {
            const p2 = this.particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.config.connectionDistance) {
                const opacity = 1 - (distance / this.config.connectionDistance);
                this.ctx.strokeStyle = this.config.lineColor + (opacity * 0.15) + ')';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();
            }
        }

        // Connect to mouse
        if (this.mouse.x != null) {
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.config.mouseDistance) {
                const opacity = 1 - (distance / this.config.mouseDistance);
                this.ctx.strokeStyle = this.config.lineColor + (opacity * 0.3) + ')';
                this.ctx.lineWidth = 1.5;
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();

                // Gentle attraction
                if (distance > 50) { // Don't collapse completely
                    p.x -= dx * 0.01;
                    p.y -= dy * 0.01;
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Draw particle
            this.ctx.fillStyle = this.config.particleColor + p.opacity + ')';
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw connections
            this.drawLines(p, i);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize Animation
document.addEventListener('DOMContentLoaded', () => {
    new HeroAnimation();
});
