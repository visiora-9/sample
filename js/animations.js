/**
 * Animations JavaScript File - New Version
 * Handles animations and effects with performance optimizations
 */

// Run this script immediately
(function() {
  console.log('Animations script executing');
  
  // Initialize animations on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready, preparing animations');
    
    // Define isMobile for use throughout the script
    const isMobile = window.innerWidth < 768;
    
    // If on mobile, add mobile class to body for CSS optimizations
    if (isMobile) {
      document.body.classList.add('is-mobile');
    }
    
    // Wait for preloader to close or start immediately if no preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      // Watch for preloader to be hidden
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.target.classList.contains('hidden')) {
            console.log('Preloader hidden, starting animations');
            observer.disconnect();
            startAllAnimations();
          }
        });
      });
      
      observer.observe(preloader, { attributes: true, attributeFilter: ['class'] });
      
      // Backup plan - start animations after 2 seconds on mobile, 3 seconds on desktop
      setTimeout(function() {
        if (!preloader.classList.contains('hidden')) {
          console.log('Forcing animations start after timeout');
          startAllAnimations();
        }
      }, isMobile ? 2000 : 3000);
    } else {
      // No preloader, start immediately
      startAllAnimations();
    }
  });
  
  // Main function to start all animations
  function startAllAnimations() {
    // Check if we're on mobile
    const isMobile = window.innerWidth < 768;
    
    // 1. Force split the hero text
    splitAndAnimateHeroText();
    
    // 2. Create hero particles
    createHeroParticles();
    
    // 3. Animate other elements, but with delay on mobile
    setTimeout(() => {
      animateOtherElements();
    }, isMobile ? 300 : 0);
    
    // 4. Set up scroll animations with performance optimizations
    setTimeout(() => {
      setupScrollAnimations();
    }, isMobile ? 500 : 100);
  }
  
  // Split and animate hero text explicitly
  function splitAndAnimateHeroText() {
    console.log('Splitting and animating hero text');
    
    // Get hero elements
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroCta = document.querySelector('.hero-cta');
    const heroScroll = document.querySelector('.hero-scroll');
    
    // Check if we're on mobile for performance optimization
    const isMobile = window.innerWidth < 768;
    
    // Check if GSAP is available
    if (window.gsap) {
      // Animation for Hero Title - character by character
      if (heroTitle) {
        // On mobile, use simpler animations
        if (isMobile) {
          // Use line by line animation instead of character by character for better readability
          const lines = heroTitle.querySelectorAll('.line');
          if (lines.length > 0) {
            gsap.fromTo(lines, 
              { opacity: 0, y: 20 },
              { 
                opacity: 1, 
                y: 0, 
                duration: 0.6, 
                stagger: 0.15,
                ease: "power2.out" 
              }
            );
          } else {
            gsap.to(heroTitle, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power1.out"
            });
          }
          
          heroTitle.classList.add('revealed');
        } else {
          // Desktop full animations - character based
          // Get lines
          const lines = heroTitle.querySelectorAll('.line');
          if (lines.length > 0) {
            lines.forEach((line, lineIndex) => {
              // Store original content
              const originalText = line.innerHTML;
              
              // Split text into characters wrapped in spans
              let newHTML = '';
              for (let i = 0; i < originalText.length; i++) {
                // Skip HTML tags
                if (originalText[i] === '<') {
                  let tagEnd = originalText.indexOf('>', i);
                  if (tagEnd !== -1) {
                    newHTML += originalText.substring(i, tagEnd + 1);
                    i = tagEnd;
                    continue;
                  }
                } 
                
                // Handle spaces
                if (originalText[i] === ' ') {
                  newHTML += ' ';
                  continue;
                }
                
                // Wrap character in span
                newHTML += `<span class="char" style="opacity: 0; transform: translateY(100%); display: inline-block;">${originalText[i]}</span>`;
              }
              
              // Apply new HTML
              line.innerHTML = newHTML;
              
              // Animate characters
              const chars = line.querySelectorAll('.char');
              gsap.to(chars, {
                opacity: 1,
                y: 0,
                stagger: 0.03,
                duration: 0.8,
                ease: "power2.out",
                delay: 0.3 + (lineIndex * 0.2)
              });
            });
          } else {
            // No lines, apply animation directly to hero title
            heroTitle.style.opacity = 1;
            heroTitle.style.transform = 'none';
          }
        }
      }
      
      // Animation for Hero Description - simplified for better performance on mobile
      if (heroDescription) {
        if (isMobile) {
          // Simpler animation for mobile
          gsap.fromTo(heroDescription, 
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: 0.2,
              ease: "power1.out"
            }
          );
          
          heroDescription.classList.add('revealed');
        } else {
          // Full animation for desktop
          // Store original content
          const originalText = heroDescription.innerHTML;
          let newHTML = '';
          
          // Split text into characters wrapped in spans
          for (let i = 0; i < originalText.length; i++) {
            // Skip HTML tags
            if (originalText[i] === '<') {
              let tagEnd = originalText.indexOf('>', i);
              if (tagEnd !== -1) {
                newHTML += originalText.substring(i, tagEnd + 1);
                i = tagEnd;
                continue;
              }
            }
            
            // Handle spaces
            if (originalText[i] === ' ') {
              newHTML += ' ';
              continue;
            }
            
            // Wrap character in span
            newHTML += `<span class="char" style="opacity: 0; transform: translateY(100%); display: inline-block;">${originalText[i]}</span>`;
          }
          
          // Apply new HTML
          heroDescription.innerHTML = newHTML;
          
          // Animate characters
          const chars = heroDescription.querySelectorAll('.char');
          gsap.to(chars, {
            opacity: 1,
            y: 0,
            stagger: 0.01,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.8
          });
        }
      }
      
      // Animate CTA buttons - same for mobile and desktop
      if (heroCta) {
        gsap.fromTo(heroCta, 
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.7, 
            ease: "power2.out", 
            delay: isMobile ? 0.4 : 0.8 
          }
        );
      }
      
      // Animate scroll indicator
      if (heroScroll) {
        gsap.fromTo(heroScroll,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.7, 
            ease: "power2.out", 
            delay: isMobile ? 0.5 : 1.0 
          }
        );
      }
    } else {
      // Fallback if GSAP is not available
      console.log('GSAP not available, using CSS animations');
      if (heroTitle) heroTitle.classList.add('revealed');
      if (heroDescription) heroDescription.classList.add('revealed');
      if (heroCta) heroCta.classList.add('revealed');
      if (heroScroll) heroScroll.classList.add('revealed');
    }
  }
  
  // Create hero particles
  function createHeroParticles() {
    console.log('Creating hero particles');
    
    const heroParticles = document.querySelector('.hero-particles');
    if (!heroParticles) return;
    
    // Clear existing particles if any
    heroParticles.innerHTML = '';
    
    // Determine number of particles based on screen width - more particles for better effect
    const width = window.innerWidth;
    // Increase the particle count by increasing the density factor
    const particleCount = Math.min(150, Math.max(50, Math.floor(width / 15))); // Doubled density from width/30 to width/15, increased min from 30 to 50, max from 80 to 150
    
    // Track mouse position for cursor interaction
    let mouseX = 0;
    let mouseY = 0;
    
    // Add mouse move listener to track cursor position
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    // Store particles for animation
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      // Random size
      const size = Math.random() * 4 + 1;
      
      // Random animation delay and duration for more natural movement
      const animDelay = Math.random() * 5;
      const animDuration = Math.random() * 10 + 10;
      
      // Set styles
      particle.style.cssText = `
        position: absolute;
        top: ${posY}%;
        left: ${posX}%;
        width: ${size}px;
        height: ${size}px;
        background-color: ${Math.random() > 0.7 ? 'var(--color-primary)' : '#ffffff'};
        border-radius: 50%;
        opacity: ${Math.random() * 0.5 + 0.1};
        animation-delay: ${animDelay}s;
        animation-duration: ${animDuration}s;
        will-change: transform;
        transition: transform 0.3s ease-out;
      `;
      
      heroParticles.appendChild(particle);
      
      // Store particle with its properties for animation
      particles.push({
        element: particle,
        x: posX,
        y: posY,
        size: size,
        baseX: posX, // Base position to return to
        baseY: posY,
        speedFactor: Math.random() * 0.6 + 0.2 // Random response speed to cursor
      });
    }
    
    // Animation function to handle cursor interaction
    function animateParticles() {
      // Get hero section dimensions and position
      const heroSection = document.querySelector('.hero-section');
      if (!heroSection) return;
      
      const heroRect = heroSection.getBoundingClientRect();
      
      // Only animate if mouse is within hero section
      if (
        mouseX >= heroRect.left && 
        mouseX <= heroRect.right && 
        mouseY >= heroRect.top && 
        mouseY <= heroRect.bottom
      ) {
        // Calculate relative mouse position within hero
        const relativeX = (mouseX - heroRect.left) / heroRect.width * 100;
        const relativeY = (mouseY - heroRect.top) / heroRect.height * 100;
        
        particles.forEach(particle => {
          // Calculate distance from mouse to particle (in percentage space)
          const distX = relativeX - particle.x;
          const distY = relativeY - particle.y;
          const distance = Math.sqrt(distX * distX + distY * distY);
          
          // Influence radius (larger particles have bigger radius)
          const radius = 30 + particle.size * 5;
          
          if (distance < radius) {
            // Calculate attraction strength (closer = stronger)
            const strength = (radius - distance) / radius * particle.speedFactor;
            
            // Move particle towards cursor
            const moveX = distX * strength * 0.3; // Scale down movement
            const moveY = distY * strength * 0.3;
            
            // Apply movement with transform for better performance
            particle.element.style.transform = `translate(${moveX}px, ${moveY}px)`;
          } else {
            // Return to base position
            particle.element.style.transform = 'translate(0px, 0px)';
          }
        });
      } else {
        // Return all particles to base position when cursor is outside hero
        particles.forEach(particle => {
          particle.element.style.transform = 'translate(0px, 0px)';
        });
      }
      
      // Continue animation loop
      requestAnimationFrame(animateParticles);
    }
    
    // Start animation loop
    animateParticles();
    
    // Animate particles with GSAP if available
    if (window.gsap) {
      particles.forEach(particle => {
        gsap.to(particle.element, {
          x: Math.random() * 100 - 50,
          y: Math.random() * 100 - 50,
          duration: Math.random() * 20 + 20,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });
    }
  }
  
  // Animate other elements
  function animateOtherElements() {
    console.log('Animating other elements');
    
    // Get all sections
    const sections = document.querySelectorAll('section:not(#hero)');
    
    // Check if we're on mobile for optimization
    const isMobile = window.innerWidth < 768;
    
    // Set up observer for sections with mobile optimization
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log(`Section ${entry.target.id} is now visible`);
          
          // Optimize animation timing on mobile
          const animDelay = isMobile ? 0 : 0.2;
          const animDuration = isMobile ? 0.5 : 0.8;
          const staggerAmount = isMobile ? 0.05 : 0.15;
          
          // Animate section title
          const sectionTitle = entry.target.querySelector('.section-title');
          if (sectionTitle && window.gsap) {
            gsap.fromTo(sectionTitle,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: animDuration, ease: "power2.out" }
            );
          }
          
          // Contact section special handling for mobile
          if (entry.target.id === 'contact') {
            const contactForm = entry.target.querySelector('.contact-form');
            const contactInfo = entry.target.querySelector('.contact-info');
            
            if (contactForm && window.gsap) {
              gsap.fromTo(contactForm,
                { opacity: 0, y: 30 },
                { 
                  opacity: 1, 
                  y: 0, 
                  duration: animDuration,
                  ease: "power2.out",
                  delay: animDelay
                }
              );
            }
            
            if (contactInfo && window.gsap) {
              gsap.fromTo(contactInfo,
                { opacity: 0, y: 30 },
                { 
                  opacity: 1, 
                  y: 0, 
                  duration: animDuration,
                  ease: "power2.out" 
                }
              );
            }
            
            // Make form inputs more responsive
            const formInputs = entry.target.querySelectorAll('.form-input');
            if (formInputs.length && isMobile) {
              formInputs.forEach(input => {
                input.setAttribute('inputmode', input.type === 'email' ? 'email' : 'text');
              });
            }
          }
          
          // Animate service items with stagger
          const serviceItems = entry.target.querySelectorAll('.service-item');
          if (serviceItems.length > 0 && window.gsap) {
            gsap.fromTo(serviceItems,
              { opacity: 0, y: 30 },
              { 
                opacity: 1, 
                y: 0, 
                duration: animDuration, 
                stagger: staggerAmount, 
                ease: "power2.out" 
              }
            );
          }
          
          // Animate work items with stagger
          const workItems = entry.target.querySelectorAll('.work-item');
          if (workItems.length > 0 && window.gsap) {
            gsap.fromTo(workItems,
              { opacity: 0, y: 30 },
              { 
                opacity: 1, 
                y: 0, 
                duration: animDuration, 
                stagger: staggerAmount, 
                ease: "power2.out" 
              }
            );
          }
          
          // Unobserve once animated
          sectionObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: isMobile ? 0.05 : 0.15, // Lower threshold for mobile for earlier detection
      rootMargin: isMobile ? "-50px 0px" : "-100px 0px" // Smaller offset on mobile
    });
    
    // Observe all sections
    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }
  
  // Setup scroll animations with mobile optimizations
  function setupScrollAnimations() {
    console.log('Scroll animations disabled to allow button functionality');
    console.log('Setting up scroll animations - ANCHOR LINKS HANDLING REMOVED');
    
    // Check if we're on mobile
    const isMobile = window.innerWidth < 768;
    
    // Only do parallax on non-mobile devices
    if (!isMobile) {
      // Animate parallax elements on scroll
      const parallaxElements = document.querySelectorAll('[data-speed]');
      if (parallaxElements.length > 0 && window.gsap && window.ScrollTrigger) {
        parallaxElements.forEach(element => {
          const speed = parseFloat(element.getAttribute('data-speed')) * 0.5;
          
          gsap.to(element, {
            y: () => window.innerHeight * speed * -0.1,
            ease: "none",
            scrollTrigger: {
              trigger: element.closest('section'),
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5
            }
          });
        });
      }
    }
  }
})();

// Initialize animations with performance improvements
function initAnimations() {
  // Only initialize if we're not on a low-end device
  if (!document.documentElement.classList.contains('low-end-device')) {
    // Use requestIdleCallback for non-critical animations
    requestIdleCallback(() => {
      initOptimizedHeroParticles();
      initSmoothScrollWithFallback();
      initReducedParallaxEffects();
      initLightweightTextEffects();
    }, { timeout: 1000 });
  } else {
    // Use minimal animations for low-end devices
    initMinimalAnimations();
  }
}

// Reduced particle system for hero section
function initOptimizedHeroParticles() {
  console.log('Initializing optimized hero particles');
  
  const heroParticles = document.querySelector('.hero-particles');
  if (!heroParticles) return;
  
  // Clear existing particles
  heroParticles.innerHTML = '';
  
  // Determine number of particles based on screen width for optimization
  const width = window.innerWidth;
  // We're increasing the particle count but still keeping it optimized based on device
  const isMobile = width < 768;
  const particleCount = isMobile 
    ? Math.min(80, Math.max(40, Math.floor(width / 15))) // Increased for mobile (from 60/30/width/20)
    : Math.min(180, Math.max(80, Math.floor(width / 10))); // Increased for desktop (from 100/50/width/15)
  
  console.log(`Creating ${particleCount} optimized particles for hero section`);
  
  // Track mouse/touch position for interaction
  let pointerX = 0;
  let pointerY = 0;
  
  // Add mouse move listener to track cursor position
  document.addEventListener('mousemove', (e) => {
    pointerX = e.clientX;
    pointerY = e.clientY;
  });
  
  // Add touch move listener for mobile devices
  document.addEventListener('touchmove', (e) => {
    if (e.touches[0]) {
      pointerX = e.touches[0].clientX;
      pointerY = e.touches[0].clientY;
    }
  });
  
  // Store particles for animation
  const particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Slightly smaller sizes for better performance
    const size = Math.random() * 3 + 1;
    
    // Random animation delay
    const animDelay = Math.random() * 5;
    
    // Efficient inline styles
    particle.style.cssText = `
      position: absolute;
      top: ${posY}%;
      left: ${posX}%;
      width: ${size}px;
      height: ${size}px;
      background-color: ${Math.random() > 0.7 ? 'var(--color-primary)' : '#ffffff'};
      border-radius: 50%;
      opacity: ${Math.random() * 0.5 + 0.1};
      animation-delay: ${animDelay}s;
      animation-duration: ${15 + Math.random() * 10}s;
      will-change: transform;
      transition: transform 0.3s ease-out;
    `;
    
    heroParticles.appendChild(particle);
    
    // Store particle data for interaction
    particles.push({
      element: particle,
      x: posX,
      y: posY,
      size: size,
      speedFactor: Math.random() * 0.5 + 0.1 // Optimized for performance
    });
  }
  
  // Animation function for cursor interaction - optimized for performance
  function animateParticles() {
    // Only run on non-mobile devices or if touch is active
    if (!isMobile || pointerX !== 0) {
      // Get hero section dimensions
      const heroSection = document.querySelector('.hero-section');
      if (!heroSection) return;
      
      const heroRect = heroSection.getBoundingClientRect();
      
      // Check if pointer is within hero section
      if (
        pointerX >= heroRect.left && 
        pointerX <= heroRect.right && 
        pointerY >= heroRect.top && 
        pointerY <= heroRect.bottom
      ) {
        // Calculate relative pointer position
        const relativeX = (pointerX - heroRect.left) / heroRect.width * 100;
        const relativeY = (pointerY - heroRect.top) / heroRect.height * 100;
        
        // Performance optimization: only update visible particles
        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i];
          
          // Calculate distance from pointer
          const distX = relativeX - particle.x;
          const distY = relativeY - particle.y;
          const distance = Math.sqrt(distX * distX + distY * distY);
          
          // Only move particles within a certain radius (optimized)
          const radius = 20 + particle.size * 3; // Smaller radius for better performance
          
          if (distance < radius) {
            // Optimize calculation for performance
            const strength = Math.max(0, (radius - distance) / radius) * particle.speedFactor;
            const moveX = distX * strength * 0.2;
            const moveY = distY * strength * 0.2;
            
            // Apply movement
            particle.element.style.transform = `translate(${moveX}px, ${moveY}px)`;
          } else if (particle.element.style.transform !== '') {
            // Only reset if needed
            particle.element.style.transform = '';
          }
        }
      } else {
        // Optimize: only reset transforms that are set
        for (let i = 0; i < particles.length; i++) {
          if (particles[i].element.style.transform !== '') {
            particles[i].element.style.transform = '';
          }
        }
      }
    }
    
    // Continue animation loop with throttling for performance
    requestAnimationFrame(animateParticles);
  }
  
  // Start animation loop
  animateParticles();
  
  return true;
}

// Optimized smooth scrolling
function initSmoothScrollWithFallback() {
  // Use simpler, more performant approach to avoid lag
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile menu if open
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          menuToggle.classList.remove('active');
        }
        
        // Use simpler scrollTo instead of scrollIntoView for better performance
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Optimize ScrollTrigger if it exists
  if (window.gsap && window.ScrollTrigger) {
    // Configure for better performance
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
    });
    
    // Use a throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          ScrollTrigger.update();
          scrollTimeout = null;
        }, 200); // Less frequent updates
      }
    }, { passive: true });
  }
}

// Reduced parallax effects
function initReducedParallaxEffects() {
  if (!window.gsap || !window.ScrollTrigger) return;
  
  // Use IntersectionObserver for better performance
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        
        // Only animate elements within visible sections
        const parallaxElements = section.querySelectorAll('[data-speed]');
        parallaxElements.forEach(element => {
          const speed = parseFloat(element.getAttribute('data-speed')) * 0.5; // Reduce speed by half
          
          gsap.to(element, {
            y: (i, target) => {
              // Limit the maximum movement
              return Math.min(50, -window.innerHeight * speed * 0.1);
            },
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
              once: false
            }
          });
        });
        
        // Unobserve after setting up animations
        sectionObserver.unobserve(section);
      }
    });
  }, observerOptions);
  
  // Observe all sections
  document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
  });
}

// Lightweight text animations
function initLightweightTextEffects() {
  const textElements = document.querySelectorAll('.split-text');
  
  // Use Intersection Observer for better performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  textElements.forEach(element => {
    observer.observe(element);
  });
}

// Minimal animations for low-end devices
function initMinimalAnimations() {
  // Add the revealed class to all elements that should animate
  document.querySelectorAll('.split-text, .reveal-element').forEach(element => {
    setTimeout(() => {
      element.classList.add('reveal', 'revealed');
    }, 300);
  });
  
  // Simple fade-in for sections
  document.querySelectorAll('.section-header, .service-item, .work-item').forEach(element => {
    element.style.opacity = '1';
    element.style.transform = 'none';
  });
}

// Initialize animations when page is loaded
window.addEventListener('load', function() {
  // Check if we should use animations
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    preloader.addEventListener('transitionend', function(e) {
      if (e.target === this && this.classList.contains('hidden')) {
        initAnimations();
      }
    });
  } else {
    // No preloader, initialize directly
    initAnimations();
  }
}, { once: true });

// Stop any GSAP animations
if (window.gsap) {
  window.gsap.globalTimeline.clear();
  
  if (window.ScrollTrigger) {
    window.ScrollTrigger.getAll().forEach(t => t.kill());
    window.ScrollTrigger.clearMatchMedia();
  }
}

// Prevent any scroll library initialization
const noop = function() {};
if (window.Lenis) window.Lenis = noop;

// Add check to avoid interference with button clicks
document.addEventListener('DOMContentLoaded', function() {
  console.log('Animations initialized without interfering with buttons');
  
  // Make sure we're not interfering with button clicks
  const heroButtons = document.querySelectorAll('.hero-cta a');
  heroButtons.forEach(button => {
    // Ensure animations don't prevent clicks
    button.style.pointerEvents = 'auto';
    button.style.position = 'relative';
    button.style.zIndex = '100';
  });
});

// Make sure we're not interfering with button clicks
document.addEventListener('DOMContentLoaded', function() {
  // Add debug logging
  console.log('Animation script loaded - checking for interference with buttons');
  
  // Check for any potential interference with hero buttons
  const heroButtons = document.querySelectorAll('.hero-cta a');
  heroButtons.forEach(button => {
    console.log('Ensuring animation doesn\'t block button:', button.id || button.textContent);
    
    // Make sure pointer events work
    button.style.pointerEvents = 'auto';
    button.style.position = 'relative';
    button.style.zIndex = '100';
    
    // Log any click handlers
    const buttonClone = button.cloneNode(true);
    console.log('Button has onclick:', !!button.onclick);
    
    // Make sure clicks are logged
    button.addEventListener('click', function(e) {
      console.log('Button clicked via extra handler:', button.id || button.textContent);
    });
  });
}); 