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
    const formPlaceholders = {
        th: {
            'form-name': 'ชื่อ / หน่วยงาน',
            'form-email': 'example@domain.com',
            'form-subject': 'เช่น บรรยาย เวิร์กช็อป งานเขียน',
            'form-message': 'เล่าโจทย์ ผู้ฟัง รูปแบบ ช่วงเวลา และข้อจำกัดด้านความลับหรือผลประโยชน์ทับซ้อนที่ควรรู้...'
        },
        en: {
            'form-name': 'Name / Organization',
            'form-email': 'example@domain.com',
            'form-subject': 'e.g. Talk, Workshop, Writing Inquiry',
            'form-message': 'Share the topic, audience, format, timeline, and any confidentiality or conflict considerations...'
        }
    };

    const updateFormPlaceholders = (lang) => {
        const placeholders = formPlaceholders[lang] || formPlaceholders.th;

        Object.entries(placeholders).forEach(([id, placeholder]) => {
            const field = document.getElementById(id);
            if (field) {
                field.setAttribute('placeholder', placeholder);
            }
        });
    };

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

        updateFormPlaceholders(lang);
        updateContactFeedback();
    };

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
       6. CONTACT FORM (HTTPS SUBMISSION)
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    const submitButton = document.getElementById('btn-form-submit');
    const formStatus = document.getElementById('form-status');
    let contactState = '';
    let isSubmitting = false;
    const contactFeedback = {
        th: {
            sending: 'กำลังส่งข้อความ กรุณารอสักครู่...',
            success: 'ระบบรับข้อความเพื่อจัดส่งแล้ว ขอบคุณที่ติดต่อครับ หากยังไม่ได้รับการตอบกลับ สามารถส่งอีเมลโดยตรงได้ครับ',
            error: 'ยังยืนยันการส่งข้อความไม่ได้ ข้อมูลที่กรอกยังอยู่ หากต้องการติดต่อทันที กรุณาส่งอีเมลโดยตรงด้านล่างครับ',
            sendingLabel: 'กำลังส่ง...',
            submitLabel: 'ส่งรายละเอียดเบื้องต้น'
        },
        en: {
            sending: 'Sending your message. Please wait...',
            success: 'Your message has been accepted for delivery. Thank you for getting in touch. If you do not receive a reply, you can email me directly.',
            error: 'We could not confirm submission. Your details are still here. For immediate contact, please use the direct email link below.',
            sendingLabel: 'Sending...',
            submitLabel: 'Send Brief'
        }
    };

    function updateContactFeedback() {
        if (!submitButton || !formStatus) return;

        const lang = body.classList.contains('lang-en') ? 'en' : 'th';
        formStatus.hidden = !contactState;
        formStatus.textContent = contactFeedback[lang][contactState] || '';
        formStatus.dataset.state = contactState;
        ['th', 'en'].forEach(language => {
            submitButton.querySelector(`.lang-${language}`).textContent =
                contactFeedback[language][isSubmitting ? 'sendingLabel' : 'submitLabel'];
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (isSubmitting || !contactForm.reportValidity()) return;

            const formData = new FormData(contactForm);
            if (String(formData.get('_honey') || '').trim()) return;

            const editableFields = contactForm.querySelectorAll('.form-input, .form-textarea');
            formData.set('_subject', `Portfolio inquiry: ${formData.get('subject')}`);
            isSubmitting = true;
            contactState = 'sending';
            submitButton.disabled = true;
            contactForm.setAttribute('aria-busy', 'true');
            editableFields.forEach(field => { field.readOnly = true; });
            updateContactFeedback();

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 20000);

            try {
                const endpoint = new URL(contactForm.action);
                if (endpoint.protocol !== 'https:' || endpoint.hostname !== 'formsubmit.co') {
                    throw new Error('Invalid contact endpoint');
                }
                endpoint.pathname = `/ajax${endpoint.pathname}`;
                const response = await fetch(endpoint.href, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: formData,
                    signal: controller.signal,
                    credentials: 'omit'
                });
                const result = await response.json();
                if (!response.ok || (result.success !== true && result.success !== 'true')) {
                    throw new Error('Submission was not confirmed');
                }
                contactState = 'success';
                contactForm.reset();
            } catch {
                contactState = 'error';
            } finally {
                clearTimeout(timeout);
                isSubmitting = false;
                submitButton.disabled = false;
                contactForm.removeAttribute('aria-busy');
                editableFields.forEach(field => { field.readOnly = false; });
                updateContactFeedback();
            }
        });
    }

    const savedLang = localStorage.getItem('lang') || 'th';
    setLanguage(savedLang);
});
