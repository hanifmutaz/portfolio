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
  initCertificateModal();
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

// Certificate Modal Functions
function initCertificateModal() {
  const modal = document.getElementById('certificateModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const closeModal = document.getElementById('closeModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  // Certificate view buttons
  const viewBtns = document.querySelectorAll('.certificate-view-btn');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const card = this.closest('.certificate-card');
      const img = card.querySelector('.certificate-image');
      const title = card.querySelector('h3').textContent;
      
      modalImage.src = img.src;
      modalImage.alt = img.alt;
      modalTitle.textContent = title;
      
      // Show modal with animation
      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.style.opacity = '1';
      }, 10);
    });
  });

  // Certificate card click to open modal
  const certificateCards = document.querySelectorAll('.certificate-card');
  certificateCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't open modal if clicking on buttons
      if (e.target.closest('.certificate-btn')) return;
      
      const img = this.querySelector('.certificate-image');
      const title = this.querySelector('h3').textContent;
      
      modalImage.src = img.src;
      modalImage.alt = img.alt;
      modalTitle.textContent = title;
      
      // Show modal with animation
      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.style.opacity = '1';
      }, 10);
    });
  });

  // Close modal functions
  function closeModalFunc() {
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  }

  closeModal.addEventListener('click', closeModalFunc);
  closeModalBtn.addEventListener('click', closeModalFunc);
  
  // Close on backdrop click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModalFunc();
    }
  });

  // ESC key to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModalFunc();
    }
  });

  // Download functionality
  downloadBtn.addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = modalImage.src;
    link.download = modalTitle.textContent + '.jpg';
    link.click();
    
    showNotification('Certificate download started!', 'success');
  });
}

// Certificate Handlers
function initCertificateHandlers() {
  const certificateBtns = document.querySelectorAll('.certificate-btn:not(.certificate-view-btn)');
  
  certificateBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (this.classList.contains('verify-link')) return;
      e.preventDefault();
      e.stopPropagation();
      
      const action = this.textContent.trim();
      const certificateCard = this.closest('.certificate-card');
      const certificateTitle = certificateCard.querySelector('h3').textContent;
      
      if (action === 'verify') {
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
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
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