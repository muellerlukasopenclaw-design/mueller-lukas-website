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

  // Mobile Menu Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', 
        navLinks.classList.contains('active'));
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