/*
 * Lukas Müller - Personal Website JS
 * Scroll Animations, Smooth Interactions, Modern Effects
 * No external dependencies
 */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  // Preloader ausblenden
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 800);
    });
  }
  
  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealLeftElements = document.querySelectorAll('.reveal-left');
  const revealRightElements = document.querySelectorAll('.reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));
  revealLeftElements.forEach((el) => revealObserver.observe(el));
  revealRightElements.forEach((el) => revealObserver.observe(el));

  // Navigation Scroll Effect
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // Mobile Menu Toggle mit Accessibility
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = navLinks ? navLinks.querySelectorAll('a') : [];
  
  if (navToggle && navLinks) {
    let lastFocusedElement = null;
    
    function openMobileMenu() {
      navLinks.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Menü schließen');
      lastFocusedElement = document.activeElement;
      if (navLinkItems.length > 0) {
        navLinkItems[0].focus();
      }
      document.addEventListener('keydown', handleMobileKeyDown);
      document.addEventListener('click', handleClickOutside);
    }
    
    function closeMobileMenu() {
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Menü öffnen');
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
      document.removeEventListener('keydown', handleMobileKeyDown);
      document.removeEventListener('click', handleClickOutside);
    }
    
    function handleMobileKeyDown(e) {
      if (e.key === 'Escape') {
        closeMobileMenu();
        return;
      }
      
      if (e.key === 'Tab' && navLinks.classList.contains('active')) {
        const firstLink = navLinkItems[0];
        const lastLink = navLinkItems[navLinkItems.length - 1];
        
        if (e.shiftKey && document.activeElement === firstLink) {
          e.preventDefault();
          lastLink.focus();
        } else if (!e.shiftKey && document.activeElement === lastLink) {
          e.preventDefault();
          firstLink.focus();
        }
      }
    }
    
    function handleClickOutside(e) {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        closeMobileMenu();
      }
    }
    
    navToggle.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length <= 1) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Skill Item Hover Effect
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateY(-2px)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateY(0)';
    });
  });

  // Console greeting
  console.log('%cLukas Müller', 'font-size: 24px; font-weight: bold; color: #00d4ff;');
  console.log('%cWelcome to my personal website', 'font-size: 14px; color: #666;');
  console.log('%c→ IT Leadership | DevOps | Strategy', 'font-size: 12px; color: #999;');
}