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
}
