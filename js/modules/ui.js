/* =========================================
   UI & INTERACTION MODULE
   ========================================= */

export const initUI = () => {
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initContactForm();
};

const initMobileMenu = () => {
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
        navMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                closeMenu();
            }
        });
    }
};

const initSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                });
            }
        });
    });
};

const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document
        .querySelectorAll('section h2, .timeline-item, .demo-preview, .price-card, .contact-form, .animate-on-scroll')
        .forEach((el) => {
            if (!el.classList.contains('animate-on-scroll')) {
                el.classList.add('fade-in-up');
            }
            observer.observe(el);
        });
};

const initContactForm = () => {
    const form = document.querySelector('.contact-form');
    if (!form) {
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;

        try {
            btn.textContent = 'Enviando...';
            btn.disabled = true;

            // Simulate network request
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // In a real app, we would fetch() here
            // const response = await fetch('/api/contact', { ... });
            // if (!response.ok) throw new Error('Network response was not ok');

            // Success feedback
            btn.textContent = '¡Mensaje Enviado!';
            btn.style.backgroundColor = '#10b981'; // Success green
            form.reset();

            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.backgroundColor = '';
            }, 3000);
        } catch (error) {
            console.error('Error sending message:', error);
            btn.textContent = 'Error. Intente nuevamente.';
            btn.style.backgroundColor = '#ef4444'; // Error red

            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.backgroundColor = '';
            }, 3000);
        }
    });
};
