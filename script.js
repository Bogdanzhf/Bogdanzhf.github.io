/**
 * Причал 45 - Main JavaScript File
 * Гостиница в Анапе, станица Благовещенская
 */

(function() {
    'use strict';

    // ==========================================================================
    // Enable JS-dependent features
    // ==========================================================================
    
    // Add class to enable animations (content visible by default without JS)
    document.body.classList.add('js-loaded');

    // ==========================================================================
    // Copy Protection
    // ==========================================================================
    
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable text selection via keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+C, Ctrl+X, Ctrl+A, Ctrl+U, Ctrl+S, Ctrl+P
        if (e.ctrlKey && (
            e.keyCode === 67 || // C
            e.keyCode === 88 || // X
            e.keyCode === 65 || // A
            e.keyCode === 85 || // U
            e.keyCode === 83 || // S
            e.keyCode === 80    // P
        )) {
            e.preventDefault();
            return false;
        }
        
        // F12 - Developer Tools
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+I - Developer Tools
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+J - Console
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+C - Inspect Element
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }
    });

    // Disable drag on images
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // ==========================================================================
    // Header Scroll Effect
    // ==========================================================================
    
    const header = document.getElementById('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ==========================================================================
    // Mobile Navigation Toggle
    // ==========================================================================
    
    const navToggle = document.getElementById('navToggle');
    const navList = document.getElementById('navList');
    
    if (navToggle && navList) {
        navToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navList.querySelectorAll('.nav__link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navList.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
                navList.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // ==========================================================================
    // Scroll Animations
    // ==========================================================================
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(function(el) {
        observer.observe(el);
    });

    // ==========================================================================
    // Lightbox for Gallery
    // ==========================================================================
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    
    if (lightbox && lightboxImg && lightboxClose) {
        // Open lightbox
        document.querySelectorAll('.gallery-item').forEach(function(item) {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // Close lightbox
        lightboxClose.addEventListener('click', function() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close on background click
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ==========================================================================
    // Smooth Scroll for Anchor Links
    // ==========================================================================
    
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================================================
    // Online Visitors Counter (Simulated)
    // ==========================================================================
    
    const visitorCount = document.getElementById('visitorCount');
    
    if (visitorCount) {
        // Generate a pseudo-random visitor count based on time
        function getVisitorCount() {
            const now = new Date();
            const hour = now.getHours();
            const minute = now.getMinutes();
            
            // Base count varies by hour (more visitors during day)
            let baseCount;
            if (hour >= 9 && hour <= 21) {
                baseCount = 3 + Math.floor(Math.random() * 5); // 3-7 during day
            } else {
                baseCount = 1 + Math.floor(Math.random() * 2); // 1-2 at night
            }
            
            // Add some variance based on minute
            const variance = Math.floor((minute % 10) / 3);
            
            return baseCount + variance;
        }
        
        // Initial count
        visitorCount.textContent = getVisitorCount();
        
        // Update every 30 seconds
        setInterval(function() {
            visitorCount.textContent = getVisitorCount();
        }, 30000);
        
        // Using localStorage to maintain session
        const sessionKey = 'prichal45_session';
        let sessionId = localStorage.getItem(sessionKey);
        
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(sessionKey, sessionId);
        }
    }

    // ==========================================================================
    // Lazy Loading Images
    // ==========================================================================
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports lazy loading
        document.querySelectorAll('img[data-src]').forEach(function(img) {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (lazyImages.length > 0) {
            const lazyImageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        lazyImageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(function(img) {
                lazyImageObserver.observe(img);
            });
        }
    }

    // ==========================================================================
    // Phone Number Click Tracking
    // ==========================================================================
    
    document.querySelectorAll('a[href^="tel:"]').forEach(function(phoneLink) {
        phoneLink.addEventListener('click', function() {
            // Track phone clicks for analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    'event_category': 'contact',
                    'event_label': this.getAttribute('href')
                });
            }
            
            if (typeof ym !== 'undefined') {
                ym(00000000, 'reachGoal', 'phone_click');
            }
        });
    });

    // ==========================================================================
    // Console Message
    // ==========================================================================
    
    console.log('%c Причал 45 ', 'background: #4a3728; color: #f5e6d3; font-size: 20px; padding: 10px;');
    console.log('%c Ваша гавань спокойствия и отдыха ', 'color: #1a6b8a; font-size: 14px;');
    console.log('%c Анапа, станица Благовещенская ', 'color: #6b5a4e; font-size: 12px;');

})();

