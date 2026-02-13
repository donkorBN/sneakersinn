// =============================================
// App — Navigation, Animations, Interactions
// =============================================

export function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

export function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');
    const body = document.body;

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('active');
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close when clicking a link
    mobileMenu.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });
    }
}

export function initScrollReveal() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal:not(.revealed)').forEach((el) => observer.observe(el));
}

export function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

export function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach((link) => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html') || (currentPage === '/' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

export function initApp() {
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initSmoothScroll();
    setActiveNavLink();
    // initCountdown(); // Removed as requested
    initPixel();
}

export function initCountdown() {
    const countdown = document.getElementById('countdown');
    if (!countdown) return;

    // Set deadline to 3 days from now
    // In a real app, this would come from the backend or config
    let deadline = localStorage.getItem('sneakersinn_drop_deadline');
    if (!deadline || new Date(deadline) < new Date()) {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        date.setHours(9, 0, 0, 0); // 9 AM
        deadline = date.toISOString();
        localStorage.setItem('sneakersinn_drop_deadline', deadline);
    }

    const targetDate = new Date(deadline).getTime();

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            // Expired, reset or show message
            // For demo, just restart loop
            localStorage.removeItem('sneakersinn_drop_deadline');
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minsEl = document.getElementById('minutes');
        const secsEl = document.getElementById('seconds');

        if (daysEl) daysEl.innerText = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
        if (minsEl) minsEl.innerText = minutes.toString().padStart(2, '0');
        if (secsEl) secsEl.innerText = seconds.toString().padStart(2, '0');
    };

    updateTimer();
    setInterval(updateTimer, 1000);
}


export function initPixel() {
    // Basic Meta Pixel Loader
    const pixelId = CONFIG.PIXEL_ID;
    if (!pixelId || pixelId === "YOUR_PIXEL_ID") return;

    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
            n.callMethod ?
                n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
    }(window, document, 'script',
        'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', pixelId);
    fbq('track', 'PageView');
}

import { CONFIG } from './config.js';
