// ============================================
// Overcode - JavaScript
// Interactive features and animations
// ============================================

(function() {
    'use strict';

    // ============================================
    // Particles Animation
    // ============================================
    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        
        // Set canvas size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particle class
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
                
                // Wrap around edges
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
        
        // Create particles
        function createParticles() {
            const particleCount = Math.min(30, Math.floor(window.innerWidth / 40));
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Draw connections
            particles.forEach((particle, i) => {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[j].x - particle.x;
                    const dy = particles[j].y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(108, 60, 249, ${0.1 * (1 - distance / 150)})`;
                        ctx.stroke();
                    }
                }
            });
            
            animationId = requestAnimationFrame(animate);
        }
        
        // Check for reduced motion preference
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            createParticles();
            animate();
        }
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
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
        
        // Sticky header on scroll
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
            
            lastScroll = currentScroll;
        });
        
        // Mobile menu toggle
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
        
        // Close mobile menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('nav__menu--open');
                navToggle.classList.remove('nav__toggle--open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80;
                    const targetPos = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPos,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // Scroll Reveal Animation
    // ============================================
    function initScrollReveal() {
        const reveals = document.querySelectorAll('[data-reveal]');
        
        if (!reveals.length) return;
        
        const revealOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('reveal');
                    }, index * 50);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, revealOptions);
        
        reveals.forEach(el => {
            revealObserver.observe(el);
        });
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
                // Update active button
                filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
                btn.classList.add('filter-btn--active');
                
                const filter = btn.dataset.filter;
                let visibleIndex = 0;
                
                portfolioCards.forEach((card) => {
                    const category = card.dataset.category;
                    const shouldShow = filter === 'all' || category === filter;
                    
                    if (shouldShow) {
                        // Show with stagger
                        card.classList.remove('hidden');
                        card.classList.remove('hide');
                        
                        setTimeout(() => {
                            card.classList.add('fade-in');
                            
                            // Remove animation class after it completes
                            setTimeout(() => {
                                card.classList.remove('fade-in');
                            }, 500);
                        }, visibleIndex * 100);
                        
                        visibleIndex++;
                    } else {
                        // Hide immediately
                        card.classList.remove('fade-in');
                        card.classList.add('hide');
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ============================================
    // Form Validation
    // ============================================
    function initFormValidation() {
        const form = document.querySelector('.contact__form');
        
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            // Get form fields
            const name = form.querySelector('#name');
            const email = form.querySelector('#email');
            const message = form.querySelector('#message');
            
            // Simple validation
            let isValid = true;
            
            if (!name.value.trim()) {
                showError(name, 'Por favor, insira seu nome');
                isValid = false;
                e.preventDefault();
            } else {
                removeError(name);
            }
            
            if (!isValidEmail(email.value)) {
                showError(email, 'Por favor, insira um e-mail válido');
                isValid = false;
                e.preventDefault();
            } else {
                removeError(email);
            }
            
            if (!message.value.trim()) {
                showError(message, 'Por favor, insira uma mensagem');
                isValid = false;
                e.preventDefault();
            } else {
                removeError(message);
            }
            
            // If valid, form will submit naturally to Formspree
            if (isValid) {
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
            }
        });
        
        function isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        function showError(field, message) {
            removeError(field);
            
            const error = document.createElement('span');
            error.className = 'form__error';
            error.textContent = message;
            error.style.color = '#ff6b6b';
            error.style.fontSize = '0.875rem';
            error.style.marginTop = '0.25rem';
            error.style.display = 'block';
            
            field.parentElement.appendChild(error);
            field.style.borderColor = '#ff6b6b';
        }
        
        function removeError(field) {
            const error = field.parentElement.querySelector('.form__error');
            if (error) {
                error.remove();
            }
            field.style.borderColor = '';
        }
    }

    // ============================================
    // Parallax Effects
    // ============================================
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.hero__glow, .hero__grid');
        
        if (!parallaxElements.length) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach((el) => {
                const speed = el.classList.contains('hero__glow') ? 0.5 : 0.3;
                const yPos = -(scrolled * speed);
                el.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }

    // ============================================
    // Button Ripple Effect
    // ============================================
    function initRipple() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // ============================================
    // FAQ Accordion Enhancement
    // ============================================
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq__item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq__question');
            
            if (!question) return;
            
            question.addEventListener('click', function(e) {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.hasAttribute('open')) {
                        otherItem.removeAttribute('open');
                    }
                });
            });
        });
    }

    // ============================================
    // Performance Monitor
    // ============================================
    function initPerformanceMonitor() {
        if (window.performance && performance.timing) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const timing = performance.timing;
                    const loadTime = timing.loadEventEnd - timing.navigationStart;
                    
                    if (loadTime < 1000) {
                        console.log(`⚡ Overcode: Página carregada em ${loadTime}ms - Performance Absurda!`);
                    }
                }, 0);
            });
        }
    }

    // ============================================
    // Animations CSS
    // ============================================
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // Initialize Everything
    // ============================================
    function init() {
        // Add animation styles
        addAnimationStyles();
        
        // Core features
        initParticles();
        initNav();
        initScrollReveal();
        initFilters();
        initFormValidation();
        initParallax();
        initRipple();
        initFAQ();
        initPerformanceMonitor();
        
        // Log ready
        console.log('🚀 Overcode: Site inicializado com sucesso!');
    }

    // Wait for DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();