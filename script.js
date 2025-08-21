// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functions
  initMobileMenu();
  initScrollAnimations();
  initSmoothScrolling();
  initThemeToggle();
  initCounters();
  initFormHandling();
  initCertificateHandlers();
  setCurrentYear();
  
  // Add loading state
  document.body.classList.add('loaded');
});

// Mobile Menu Toggle
function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIcon = document.getElementById('menuIcon');
  
  if (menuBtn && mobileMenu && menuIcon) {
    menuBtn.addEventListener('click', function() {
      const isOpen = !mobileMenu.classList.contains('hidden');
      
      // Toggle menu visibility
      mobileMenu.classList.toggle('hidden');
      
      // Animate hamburger icon
      if (isOpen) {
        // Close animation
        menuIcon.style.transform = 'rotate(0deg)';
        menuIcon.innerHTML = '<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>';
      } else {
        // Open animation
        menuIcon.style.transform = 'rotate(90deg)';
        menuIcon.innerHTML = '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>';
      }
      
      // Add accessibility
      menuBtn.setAttribute('aria-expanded', !isOpen);
    });
    
    // Close mobile menu when clicking on navigation links
    const mobileNavLinks = mobileMenu.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
        menuIcon.style.transform = 'rotate(0deg)';
        menuIcon.innerHTML = '<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>';
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// Scroll Animations
function initScrollAnimations() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Observe elements with animation classes
  const animatedElements = document.querySelectorAll('.section-fade, .project-card, .certificate-card');
  animatedElements.forEach(el => observer.observe(el));
  
  // Add staggered animation delay to project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
  });

  // Add staggered animation delay to certificate cards
  const certificateCards = document.querySelectorAll('.certificate-card');
  certificateCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.15}s`;
  });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update active nav link
        updateActiveNavLink(targetId);
      }
    });
  });
  
  // Update active nav on scroll
  window.addEventListener('scroll', throttle(updateActiveNavOnScroll, 100));
}

// Theme Toggle
function initThemeToggle() {
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const THEME_KEY = 'afif-theme';
  
  if (!themeBtn) return;
  
  // Get initial theme
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem(THEME_KEY);
  const isDark = saved ? saved === 'dark' : prefersDark || true;
  
  // Apply initial theme
  applyTheme(isDark);
  
  // Theme toggle event
  themeBtn.addEventListener('click', function() {
    const currentlyDark = document.body.classList.contains('bg-ink-900');
    const newTheme = !currentlyDark;
    
    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme ? 'dark' : 'light');
    
    // Add click animation
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = 'scale(1)';
    }, 150);
  });
  
  function applyTheme(dark) {
    document.body.classList.toggle('text-slate-100', dark);
    document.body.classList.toggle('text-slate-900', !dark);
    document.body.classList.toggle('bg-white', !dark);
    document.body.classList.toggle('bg-ink-900', dark);
    
    // Update theme button text
    themeBtn.textContent = dark ? 'light mode' : 'dark mode';
  }
}

// Animated Counters
function initCounters() {
  const counters = document.querySelectorAll('#projCount');
  
  const observerOptions = {
    threshold: 0.5
  };
  
  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.textContent);
  let current = 0;
  const increment = target / 30; // 30 frames
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 50);
}

// Certificate Handlers
function initCertificateHandlers() {
  const certificateBtns = document.querySelectorAll('.certificate-btn');
  
  certificateBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const action = this.textContent.trim();
      const certificateCard = this.closest('.certificate-card');
      const certificateTitle = certificateCard.querySelector('h3').textContent;
      
      if (action === 'view') {
        showCertificateModal(certificateTitle);
      } else if (action === 'verify') {
        showNotification(`Verifying ${certificateTitle}...`, 'info');
        // Simulate verification process
        setTimeout(() => {
          showNotification('Certificate verified successfully!', 'success');
        }, 2000);
      }
      
      // Add click animation
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
    });
  });
}

function showCertificateModal(title) {
  // Create modal backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4';
  backdrop.style.opacity = '0';
  
  // Create modal content
  const modal = document.createElement('div');
  modal.className = 'bg-ink-800 rounded-2xl border border-white/10 p-6 max-w-md w-full transform scale-95 transition-all duration-300';
  
  modal.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-semibold">${title}</h3>
      <button class="close-modal rounded-lg p-2 hover:bg-white/5 transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="1.6"/>
          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="1.6"/>
        </svg>
      </button>
    </div>
    <div class="bg-white/5 rounded-xl p-4 mb-4 text-center">
      <div class="w-16 h-16 bg-gradient-to-tr from-accent-600 to-accent-400 rounded-xl mx-auto mb-3 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="white" stroke-width="1.6"/>
          <polyline points="14,2 14,8 20,8" stroke="white" stroke-width="1.6"/>
        </svg>
      </div>
      <p class="text-sm text-slate-400">Certificate preview would appear here</p>
    </div>
    <div class="flex gap-3">
      <button class="flex-1 bg-accent-500 text-ink-900 rounded-xl px-4 py-2 font-medium hover:bg-accent-400 transition-colors">Download PDF</button>
      <button class="close-modal flex-1 border border-white/10 rounded-xl px-4 py-2 hover:bg-white/5 transition-colors">Close</button>
    </div>
  `;
  
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
  
  // Animate in
  requestAnimationFrame(() => {
    backdrop.style.opacity = '1';
    modal.style.transform = 'scale(1)';
  });
  
  // Close handlers
  const closeBtns = backdrop.querySelectorAll('.close-modal');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => closeCertificateModal(backdrop));
  });
  
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeCertificateModal(backdrop);
    }
  });
}

function closeCertificateModal(backdrop) {
  const modal = backdrop.querySelector('.bg-ink-800');
  backdrop.style.opacity = '0';
  modal.style.transform = 'scale(0.95)';
  
  setTimeout(() => {
    document.body.removeChild(backdrop);
  }, 300);
}

// Form Handling
function initFormHandling() {
  const form = document.querySelector('form');
  const inputs = form?.querySelectorAll('input, textarea');
  
  if (!form || !inputs) return;
  
  // Add focus/blur effects to form inputs
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'scale(1.01)';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'scale(1)';
    });
    
    // Real-time validation
    input.addEventListener('input', function() {
      validateInput(this);
    });
  });
  
  // Form submission
  form.addEventListener('submit', function(e) {
    let isValid = true;
    
    inputs.forEach(input => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      e.preventDefault();
      showNotification('Mohon isi semua field yang diperlukan', 'error');
    } else {
      showNotification('Pesan berhasil dikirim!', 'success');
    }
  });
}

function validateInput(input) {
  const value = input.value.trim();
  const isRequired = input.hasAttribute('required');
  const isEmail = input.type === 'email';
  
  let isValid = true;
  
  // Reset styles
  input.style.borderColor = '';
  
  // Required validation
  if (isRequired && !value) {
    isValid = false;
  }
  
  // Email validation
  if (isEmail && value && !isValidEmail(value)) {
    isValid = false;
  }
  
  // Apply styles
  if (!isValid) {
    input.style.borderColor = '#ef4444';
  } else if (value) {
    input.style.borderColor = '#22d3ee';
  }
  
  return isValid;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-green-500' : 
                  type === 'info' ? 'bg-blue-500' : 'bg-red-500';
  
  notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all duration-300 transform translate-x-full ${bgColor}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Animate out and remove
  setTimeout(() => {
    notification.style.transform = 'translateX(full)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Utility Functions
function updateActiveNavLink(targetId) {
  const navLinks = document.querySelectorAll('.navlink');
  navLinks.forEach(link => {
    link.classList.remove('text-accent-400');
    if (link.getAttribute('href') === targetId) {
      link.classList.add('text-accent-400');
    }
  });
}

function updateActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.scrollY + window.innerHeight / 3;
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  if (current) {
    updateActiveNavLink('#' + current);
  }
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

function setCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Error handling
window.addEventListener('error', function(e) {
  console.error('Portfolio error:', e.error);
});

// Performance monitoring
window.addEventListener('load', function() {
  // Log load time for debugging
  if (window.performance && window.performance.timing) {
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    console.log('Portfolio loaded in:', loadTime + 'ms');
  }
});