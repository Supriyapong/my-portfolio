document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. THEME TOGGLE (DARK / LIGHT MODE)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference in localStorage, default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
    }

    // Toggle theme function
    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    });

    /* ==========================================================================
       1.5 BILINGUAL LANGUAGE SWITCHER (TH / EN)
       ========================================================================== */
    const langThBtn = document.getElementById('lang-th-btn');
    const langEnBtn = document.getElementById('lang-en-btn');
    const htmlElem = document.documentElement;

    // Function to set language
    const setLanguage = (lang) => {
        if (lang === 'en') {
            body.classList.remove('lang-th');
            body.classList.add('lang-en');
            htmlElem.setAttribute('lang', 'en');
            
            if (langThBtn && langEnBtn) {
                langThBtn.classList.remove('active');
                langEnBtn.classList.add('active');
            }
            
            localStorage.setItem('lang', 'en');
        } else {
            body.classList.remove('lang-en');
            body.classList.add('lang-th');
            htmlElem.setAttribute('lang', 'th');
            
            if (langThBtn && langEnBtn) {
                langEnBtn.classList.remove('active');
                langThBtn.classList.add('active');
            }
            
            localStorage.setItem('lang', 'th');
        }
    };

    // Check for saved language preference or default to th
    const savedLang = localStorage.getItem('lang') || 'th';
    setLanguage(savedLang);

    // Event listeners for buttons
    if (langThBtn && langEnBtn) {
        langThBtn.addEventListener('click', () => setLanguage('th'));
        langEnBtn.addEventListener('click', () => setLanguage('en'));
    }

    /* ==========================================================================
       2. MOBILE NAVIGATION MENU
       ========================================================================== */
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navMenuList = document.getElementById('nav-menu-list');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileNavToggle.addEventListener('click', () => {
        navMenuList.classList.toggle('open');
        const icon = mobileNavToggle.querySelector('i');
        if (navMenuList.classList.contains('open')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    // Close menu when clicking on any link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenuList.classList.remove('open');
            mobileNavToggle.querySelector('i').className = 'fa-solid fa-bars';
        });
    });

    /* ==========================================================================
       3. ACTIVE LINK HIGHLIGHTING ON SCROLL (INTERSECTION OBSERVER)
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section is in the middle of the screen
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    /* ==========================================================================
       5. SCROLL REVEAL ANIMATIONS (FADE-IN EFFECT FOR CARDS & BLOCKS)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.skill-card, .timeline-item, .framework-card, .edu-card, .training-card');
    
    // Set initial styles for animation elements
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before element enters viewport
        threshold: 0.05
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                // Once animated, we don't need to observe it anymore
                observer.unobserve(element);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ==========================================================================
       6. CONTACT FORM CUSTOM FEEDBACK (ALERT UPON MAIL SUBMISSION)
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Since action is "mailto:...", browser will open mail client.
            // We just show a friendly alert wishing them well and advising that it will open their mail client.
            if (body.classList.contains('lang-en')) {
                alert('Thank you for your interest! The system is opening your email client to send your message to supriyapong@hotmail.com.');
            } else {
                alert('ขอบคุณที่ให้ความสนใจติดต่อร่วมงานครับ! ระบบกำลังเปิดโปรแกรมส่งอีเมลในเครื่องของคุณเพื่อนำส่งข้อความไปยัง supriyapong@hotmail.com ครับ');
            }
        });
    }
});
