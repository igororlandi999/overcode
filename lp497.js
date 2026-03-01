// ============================================
// Overcode — Landing Page R$497
// lp497.js
// ============================================

(function () {
    'use strict';

    // ============================================
    // Scroll suave para âncoras internas
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('.js-scroll').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || !href.startsWith('#')) return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (!target) return;

                const offset = 32; // margem do topo
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            });
        });
    }

    // ============================================
    // Scroll Reveal (IntersectionObserver)
    // ============================================
    function initReveal() {
        const els = document.querySelectorAll(
            '.deliver-item, .process__step, .audience-card, .faq__item, ' +
            '.exclusions__inner, .cta-final__inner, .form-section__inner, ' +
            '.section-title, .section-label'
        );

        if (!els.length) return;

        els.forEach(function (el) {
            el.setAttribute('data-reveal', '');
        });

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, idx) {
                if (entry.isIntersecting) {
                    const delay = Math.min(idx * 60, 300);
                    setTimeout(function () {
                        entry.target.classList.add('revealed');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        els.forEach(function (el) {
            observer.observe(el);
        });
    }

    // ============================================
    // Formatação automática do campo WhatsApp
    // ============================================
    function initPhoneMask() {
        const input = document.getElementById('whatsapp');
        if (!input) return;

        input.addEventListener('input', function () {
            let v = this.value.replace(/\D/g, '').substring(0, 11);
            if (v.length > 6) {
                v = '(' + v.substring(0, 2) + ') ' + v.substring(2, 7) + '-' + v.substring(7);
            } else if (v.length > 2) {
                v = '(' + v.substring(0, 2) + ') ' + v.substring(2);
            } else if (v.length > 0) {
                v = '(' + v;
            }
            this.value = v;
        });
    }

    // ============================================
    // Validação e envio do formulário
    // ============================================
    function initForm() {
        const form = document.getElementById('lp-form');
        const btn  = document.getElementById('submit-btn');
        const successMsg = document.getElementById('form-success');

        if (!form) return;

        // Campos obrigatórios
        const requiredFields = ['nome', 'whatsapp', 'nicho', 'objetivo'];

        // Remove erro ao digitar
        requiredFields.forEach(function (id) {
            const field = document.getElementById(id);
            if (!field) return;
            field.addEventListener('input', function () {
                clearError(this);
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            let valid = true;

            // Valida campos obrigatórios
            requiredFields.forEach(function (id) {
                const field = document.getElementById(id);
                if (!field) return;
                if (!field.value.trim()) {
                    showError(field, 'Campo obrigatório');
                    valid = false;
                } else {
                    clearError(field);
                }
            });

            // Valida e-mail caso preenchido (não é campo deste formulário, mas fica aqui como padrão)
            const emailField = document.getElementById('email');
            if (emailField && emailField.value.trim()) {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
                    showError(emailField, 'E-mail inválido');
                    valid = false;
                }
            }

            // Valida WhatsApp — mínimo 14 chars no formato mascarado
            const wpp = document.getElementById('whatsapp');
            if (wpp && wpp.value.trim().replace(/\D/g, '').length < 10) {
                showError(wpp, 'WhatsApp inválido');
                valid = false;
            }

            if (!valid) {
                // Faz scroll até o primeiro erro
                const firstError = form.querySelector('.error');
                if (firstError) {
                    const top = firstError.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
                return;
            }

            // Estado de carregamento
            btn.disabled = true;
            btn.classList.add('btn--loading');

            // Envio via fetch (Formspree)
            const data = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            })
            .then(function (res) {
                if (res.ok) {
                    // Sucesso
                    form.reset();
                    btn.style.display = 'none';
                    successMsg.classList.add('visible');

                    // Scroll até a mensagem de sucesso
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Rastreia evento de conversão (se pixels estiverem configurados)
                    trackConversion();
                } else {
                    return res.json().then(function (data) {
                        throw new Error(data.error || 'Erro no envio');
                    });
                }
            })
            .catch(function () {
                btn.disabled = false;
                btn.classList.remove('btn--loading');
                alert('Erro ao enviar. Por favor, tente novamente ou entre em contato pelo WhatsApp.');
            });
        });

        function showError(field, msg) {
            clearError(field);
            field.classList.add('error');
            const span = document.createElement('span');
            span.className = 'form__error-msg';
            span.textContent = msg;
            field.parentElement.appendChild(span);
        }

        function clearError(field) {
            field.classList.remove('error');
            const span = field.parentElement.querySelector('.form__error-msg');
            if (span) span.remove();
        }
    }

    // ============================================
    // Rastreamento de conversão
    // Dispara eventos para Meta Pixel e Google Ads
    // quando o formulário for enviado com sucesso
    // ============================================
    function trackConversion() {
        // Meta Pixel
        if (typeof fbq === 'function') {
            fbq('track', 'Lead');
        }

        // Google Ads / GA4
        if (typeof gtag === 'function') {
            gtag('event', 'generate_lead', {
                currency: 'BRL',
                value: 149 // valor da entrada
            });
        }

        // Google Tag Manager (dataLayer)
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({ event: 'form_submit_lp497' });
        }
    }

    // ============================================
    // FAQ — fecha outros ao abrir um
    // ============================================
    function initFAQ() {
        const items = document.querySelectorAll('.faq__item');
        items.forEach(function (item) {
            item.addEventListener('toggle', function () {
                if (this.open) {
                    items.forEach(function (other) {
                        if (other !== item) other.removeAttribute('open');
                    });
                }
            });
        });
    }

    // ============================================
    // Init
    // ============================================
    function init() {
        initSmoothScroll();
        initReveal();
        initPhoneMask();
        initForm();
        initFAQ();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();