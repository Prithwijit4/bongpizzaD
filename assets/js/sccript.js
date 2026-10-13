(() => {
    'use strict';
    const LINKS = {
        zomato: '',
        swiggy: '',
    };
    const MOBILE_BREAKPOINT = 768;
    const HEADER_HEIGHT = 70;
    const $ = (sel, root = document) => root.querySelector(sel); const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const header = $('header');
    const navLinks = $('#navLinks');
    const hamburger = $('#hamburger');
    const hamburgerIcon = hamburger ? $('i', hamburger) : null;

    const scrollToTarget = (target) => {
        if (!target) return;
        const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
        window.scrollTo({ top, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
    };

    const isMenuOpen = () => navLinks.classList.contains('active');

    const setMenu = (open) => {
        navLinks.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
        if (hamburgerIcon) {
            hamburgerIcon.classList.toggle('fa-bars', !open);
            hamburgerIcon.classList.toggle('fa-xmark', open);
        }
    };

    const initNav = () => {
        if (!navLinks || !hamburger) return;

        hamburger.setAttribute('role', 'button');
        hamburger.setAttribute('tabindex', '0');
        hamburger.setAttribute('aria-controls', 'navLinks');
        hamburger.setAttribute('aria-expanded', 'false');

        hamburger.addEventListener('click', () => setMenu(!isMenuOpen()));
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setMenu(!isMenuOpen());
            }
        });

        navLinks.addEventListener('click', (e) => {
            if (e.target.closest('a')) setMenu(false);
        });

        document.addEventListener('click', (e) => {
            if (isMenuOpen() && !e.target.closest('#navLinks') && !e.target.closest('#hamburger')) {
                setMenu(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen()) {
                setMenu(false);
                hamburger.focus();
            }
        });

        window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT + 1}px)`).addEventListener('change', (e) => {
            if (e.matches) setMenu(false);
        });
    };

    const initHeaderScroll = () => {
        if (!header) return;
        let ticking = false;

        const update = () => {
            header.classList.toggle('scrolled', window.scrollY > 10);
            ticking = false;
        };

        window.addEventListener(
            'scroll',
            () => {
                if (!ticking) {
                    ticking = true;
                    requestAnimationFrame(update);
                }
            },
            { passive: true }
        );
        update();
    };

    const initActiveLink = () => {
        if (!navLinks || !('IntersectionObserver' in window)) return;

        const linkById = new Map();
        $$('a[href^="#"]', navLinks).forEach((a) => {
            const id = a.getAttribute('href').slice(1);
            if (id && document.getElementById(id)) linkById.set(id, a);
        });
        if (!linkById.size) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    linkById.forEach((a) => a.classList.remove('is-active'));
                    const link = linkById.get(entry.target.id);
                    if (link) link.classList.add('is-active');
                });
            },
            { rootMargin: `-${HEADER_HEIGHT}px 0px -55% 0px`, threshold: 0 }
        );

        linkById.forEach((_, id) => observer.observe(document.getElementById(id)));
    };

    const initAnchors = () => {
        document.addEventListener('click', (e) => {
            const a = e.target.closest('a[href^="#"]');
            if (!a) return;
            const id = a.getAttribute('href').slice(1);
            const target = id ? document.getElementById(id) : null;
            if (!target) return;
            e.preventDefault();
            scrollToTarget(target);
            history.replaceState(null, '', `#${id}`);
        });
    };

    const initButtons = () => {
        const menuSection = $('#menu');
        const storeSection = $('.store-section');          $$('.explore-menu, .order-button').forEach((btn) =>
            btn.addEventListener('click', () => {
                setMenu(false);
                scrollToTarget(menuSection);
            })
        );

        const findStore = $('.find-store');
        if (findStore) findStore.addEventListener('click', () => scrollToTarget(storeSection));

        const openLink = (url) => {
            if (url) window.open(url, '_blank', 'noopener,noreferrer');
        };
        const zomato = $('.zomato-btn');
        const swiggy = $('.swiggy-btn');
        if (zomato) zomato.addEventListener('click', () => openLink(LINKS.zomato));
        if (swiggy) swiggy.addEventListener('click', () => openLink(LINKS.swiggy));
    };

    let toastEl = null;
    let toastTimer = 0;

    const showToast = (message) => {
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'toast';
            toastEl.setAttribute('role', 'status');
            toastEl.setAttribute('aria-live', 'polite');
            document.body.appendChild(toastEl);
        }
        toastEl.textContent = message;
        void toastEl.offsetWidth;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1800);
    };

    const initCart = () => {
        const menu = $('.menu-card');
        if (!menu) return;

        menu.addEventListener('click', (e) => {
            const btn = e.target.closest('.add-btn');
            if (!btn) return;

            const card = btn.closest('.crd');
            const name = card ? $('h3', card)?.textContent.trim() : 'Item';
            const price = card ? $('.price', card)?.textContent.trim() : '';

            showToast(`${name} added${price ? ` · ${price}` : ''}`);

            btn.classList.add('added');
            setTimeout(() => btn.classList.remove('added'), 600);
        });
    };

    const initImages = () => {
        const heroImg = $('.hero-img');
        if (heroImg) {
            heroImg.setAttribute('fetchpriority', 'high');
            heroImg.setAttribute('decoding', 'async');
        }
        $$('img').forEach((img) => { if (img === heroImg) return; if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy'); if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async'); if (img.classList.contains('review-avatar')) img.setAttribute('referrerpolicy', 'no-referrer'); });          $$
('img[alt=""]').forEach((img) => img.setAttribute('aria-hidden', 'true'));
    };

    const init = () => {
        initNav();
        initHeaderScroll();
        initActiveLink();
        initAnchors();
        initButtons();
        initCart();
        initImages();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();