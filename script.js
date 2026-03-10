// ============================================
// Overcode — JavaScript
// Interactive features and animations
// ============================================

(function() {
    'use strict';

    const isMobile = window.matchMedia('(max-width: 968px)').matches;

    // ============================================
    // Particles Animation — apenas desktop
    // ============================================
    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        // Desabilita em mobile: consome CPU e atrasa eventos de toque
        if (isMobile || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            canvas.style.display = 'none';
            return;
        }

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.3;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(108, 60, 249, ${this.opacity})`;
                ctx.fill();
            }
        }

        function createParticles() {
            const count = Math.min(30, Math.floor(window.innerWidth / 40));
            for (let i = 0; i < count; i++) particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            particles.forEach((p, i) => {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[j].x - p.x;
                    const dy = particles[j].y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(108, 60, 249, ${0.1 * (1 - dist / 150)})`;
                        ctx.stroke();
                    }
                }
            });
            animationId = requestAnimationFrame(animate);
        }

        createParticles();
        animate();

        window.addEventListener('beforeunload', () => {
            if (animationId) cancelAnimationFrame(animationId);
        });
    }

    // ============================================
    // Barra Promocional
    // ============================================
    function initPromoBar() {
        const bar = document.getElementById('promo-bar');
        const closeBtn = document.getElementById('promo-bar-close');
        if (!bar || !closeBtn) return;

        closeBtn.addEventListener('click', function() {
            bar.style.display = 'none';
            document.documentElement.style.setProperty('--promo-bar-height', '0px');
        });
    }

    // ============================================
    // Navigation
    // ============================================
    function initNav() {
        const header = document.querySelector('.header');
        const navToggle = document.querySelector('.nav__toggle');
        const navMenu = document.querySelector('.nav__menu');
        const navLinks = document.querySelectorAll('.nav__link');

        // passive: true evita delay de 300ms no scroll em mobile
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        }, { passive: true });

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                const isOpen = navMenu.classList.contains('nav__menu--open');
                if (isOpen) {
                    navMenu.classList.remove('nav__menu--open');
                    navToggle.classList.remove('nav__toggle--open');
                    navToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                } else {
                    navMenu.classList.add('nav__menu--open');
                    navToggle.classList.add('nav__toggle--open');
                    navToggle.setAttribute('aria-expanded', 'true');
                    document.body.style.overflow = 'hidden';
                }
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('nav__menu--open');
                if (navToggle) {
                    navToggle.classList.remove('nav__toggle--open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
                document.body.style.overflow = '';
            });
        });

        // Smooth scroll com offset correto
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                e.preventDefault();
                const target = document.querySelector(href);
                if (!target) return;

                const promoBarEl = document.getElementById('promo-bar');
                const promoBarH = (promoBarEl && promoBarEl.style.display !== 'none')
                    ? promoBarEl.offsetHeight : 0;
                const offset = 80 + promoBarH;

                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ============================================
    // Scroll Reveal
    // ============================================
    function initScrollReveal() {
        const reveals = document.querySelectorAll('[data-reveal]');
        if (!reveals.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('reveal');
                    }, index * 50);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        reveals.forEach(el => observer.observe(el));
    }

    // ============================================
    // Portfolio Filters
    // ============================================
    function initFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioCards = document.querySelectorAll('.portfolio-card');
        if (!filterBtns.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
                btn.classList.add('filter-btn--active');

                const filter = btn.dataset.filter;
                let visibleIndex = 0;

                portfolioCards.forEach(card => {
                    const shouldShow = filter === 'all' || card.dataset.category === filter;
                    if (shouldShow) {
                        card.classList.remove('hidden', 'hide');
                        setTimeout(() => {
                            card.classList.add('fade-in');
                            setTimeout(() => card.classList.remove('fade-in'), 500);
                        }, visibleIndex * 100);
                        visibleIndex++;
                    } else {
                        card.classList.remove('fade-in');
                        card.classList.add('hide', 'hidden');
                    }
                });
            });
        });
    }

    // ============================================
    // Form — envio assíncrono com feedback visual
    // ============================================
    function initForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const submitBtn = document.getElementById('submit-btn');
        const successMsg = document.getElementById('form-success');
        const errorMsg = document.getElementById('form-error');

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function showFieldError(field, msg) {
            removeFieldError(field);
            const error = document.createElement('span');
            error.className = 'form__error';
            error.textContent = msg;
            error.style.cssText = 'color:#ff8080;font-size:0.85rem;margin-top:0.35rem;display:block;';
            field.parentElement.appendChild(error);
            field.style.borderColor = '#ff6060';
        }

        function removeFieldError(field) {
            const error = field.parentElement.querySelector('.form__error');
            if (error) error.remove();
            field.style.borderColor = '';
        }

        function setLoading(loading) {
            submitBtn.disabled = loading;
            submitBtn.textContent = loading ? 'Enviando...' : 'Enviar mensagem';
        }

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = form.querySelector('#name');
            const email = form.querySelector('#email');
            const message = form.querySelector('#message');
            let isValid = true;

            successMsg.hidden = true;
            errorMsg.hidden = true;

            if (!name.value.trim()) {
                showFieldError(name, 'Por favor, insira seu nome');
                isValid = false;
            } else { removeFieldError(name); }

            if (!isValidEmail(email.value)) {
                showFieldError(email, 'Por favor, insira um e-mail válido');
                isValid = false;
            } else { removeFieldError(email); }

            if (!message.value.trim()) {
                showFieldError(message, 'Por favor, insira uma mensagem');
                isValid = false;
            } else { removeFieldError(message); }

            if (!isValid) return;

            setLoading(true);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    successMsg.hidden = false;
                    form.reset();
                } else {
                    errorMsg.hidden = false;
                }
            } catch (_) {
                errorMsg.hidden = false;
            } finally {
                setLoading(false);
            }
        });
    }

    // ============================================
    // Parallax — apenas desktop
    // Em mobile causa jank e atrasa toque
    // ============================================
    function initParallax() {
        if (isMobile) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const els = document.querySelectorAll('.hero__glow, .hero__grid');
        if (!els.length) return;

        let ticking = false;

        function update() {
            const scrolled = window.pageYOffset;
            els.forEach(el => {
                const speed = el.classList.contains('hero__glow') ? 0.5 : 0.3;
                el.style.transform = `translate3d(0, ${-(scrolled * speed)}px, 0)`;
            });
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================
    // Button Ripple — desabilitado em mobile
    // Cria DOM extra que atrasa eventos de toque
    // ============================================
    function initRipple() {
        if (isMobile) return;

        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const ripple = document.createElement('span');

                ripple.style.cssText = `
                    position:absolute;
                    width:${size}px;height:${size}px;
                    border-radius:50%;
                    background:rgba(255,255,255,0.2);
                    left:${e.clientX - rect.left - size / 2}px;
                    top:${e.clientY - rect.top - size / 2}px;
                    pointer-events:none;
                    transform:scale(0);
                    animation:ripple 0.6s ease-out;
                `;

                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // ============================================
    // FAQ Accordion
    // ============================================
    function initFAQ() {
        const items = document.querySelectorAll('.faq__item');
        items.forEach(item => {
            const question = item.querySelector('.faq__question');
            if (!question) return;
            question.addEventListener('click', () => {
                items.forEach(other => {
                    if (other !== item && other.hasAttribute('open')) {
                        other.removeAttribute('open');
                    }
                });
            });
        });
    }

    // ============================================
    // CSS de animação dinâmica (ripple)
    // ============================================
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `@keyframes ripple { to { transform: scale(4); opacity: 0; } }`;
        document.head.appendChild(style);
    }

    // ============================================
    // Touch delay fix — remove o delay de 300ms
    // em navegadores mobile antigos
    // ============================================
    function fixTouchDelay() {
        if (!isMobile) return;
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta && !meta.content.includes('touch-action')) {
            // touch-action: manipulation via CSS é suficiente
            const style = document.createElement('style');
            style.textContent = `
                a, button, [role="button"], .btn, .filter-btn, .faq__question,
                .nav__toggle, .nav__link, .nav__cta, .promo-bar__btn, .promo-bar__close {
                    touch-action: manipulation;
                    -webkit-tap-highlight-color: transparent;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ============================================
    // Init
    // ============================================
    function init() {
        fixTouchDelay();
        addAnimationStyles();
        initParticles();
        initPromoBar();
        initNav();
        initScrollReveal();
        initFilters();
        initForm();
        initParallax();
        initRipple();
        initFAQ();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();