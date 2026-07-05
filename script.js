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

    function closeMobileMenu() {
        if (!navList || !navToggle) return;
        navList.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    }

    function openMobileMenu() {
        if (!navList || !navToggle) return;
        navList.classList.add('active');
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
    }

    if (navToggle && navList) {
        navToggle.setAttribute('aria-expanded', 'false');

        function toggleMobileMenu(e) {
            e.preventDefault();
            e.stopPropagation();
            if (navList.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }

        navToggle.addEventListener('click', toggleMobileMenu);

        navList.querySelectorAll('.nav__link').forEach(function(link) {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('click', function(e) {
            if (!navList.classList.contains('active')) return;
            if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
                closeMobileMenu();
            }
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMobileMenu();
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
    
    // ==========================================================================
    // Console Message
    // ==========================================================================
    
    console.log('%c Причал 45 ', 'background: #4a3728; color: #f5e6d3; font-size: 20px; padding: 10px;');
    console.log('%c Ваша гавань спокойствия и отдыха ', 'color: #1a6b8a; font-size: 14px;');
    console.log('%c Анапа, станица Благовещенская ', 'color: #6b5a4e; font-size: 12px;');

})();

