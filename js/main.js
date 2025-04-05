/**
 * Main JavaScript File
 * Handles core functionality for the Visiora website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded - setting up anchor links');
  
  // Debug sections visibility
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const id = section.id;
    const display = window.getComputedStyle(section).display;
    const visibility = window.getComputedStyle(section).visibility;
    console.log(`Section ${id}: display=${display}, visibility=${visibility}`);
  });
  
  // Fix logo loading issues
  fixLogoImages();
  
  // Initialize preloader with shorter duration
  initFastPreloader();
  
  // Initialize simple navigation
  initSimpleNavigation();
  
  // Initialize mobile menu - direct implementation
  setupDirectMobileMenu();
  
  // Force services section to be visible
  forceServicesVisible();
  
  // Fix work section spacing issue
  fixWorkSectionSpacing();
  
  // Fix contact section spacing issue
  fixContactSectionSpacing();
  
  // FIX FOR BUTTONS - direct approach without cloning
  console.log('Setting up buttons with direct approach');
  
  // Get all anchor links to sections
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    // Log setup
    console.log('Setting up:', anchor.textContent, anchor.href);
    
    // Remove all existing event listeners
    const oldAnchor = anchor;
    const newAnchor = oldAnchor.cloneNode(true);
    
    if (oldAnchor.parentNode) {
      oldAnchor.parentNode.replaceChild(newAnchor, oldAnchor);
    }
    
    // Direct event handler
    newAnchor.onclick = function(e) {
      e.preventDefault();
      
      // Get the target section
      const targetId = this.getAttribute('href');
      console.log('Clicked button to', targetId);
      
      // Skip if href is empty or just '#'
      if (!targetId || targetId === '#') {
        console.log('Invalid target: empty or # only');
        return false;
      }
      
      // Find the target element
      const targetElement = document.querySelector(targetId);
      if (!targetElement) {
        console.warn('Target not found:', targetId);
        return false;
      }
      
      // Close mobile menu if open
      const mobileMenu = document.querySelector('.mobile-menu');
      const menuToggle = document.querySelector('.menu-toggle');
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
      
      // Scroll to the target using simpler method
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      return false;
    };
  });
  
  // Initialize other components with performance optimizations
  window.addEventListener('load', function() {
    // Use requestIdleCallback for non-critical initializations
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Initialize lazy loading
        initLazyLoading();
        
        // Initialize work filter
        initWorkFilter();
        
        // Initialize work videos
        initWorkVideos();
        
        // Initialize form validation
        initFormValidation();
      }, { timeout: 1000 });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(() => {
        initLazyLoading();
        initWorkFilter();
        initWorkVideos();
        initFormValidation();
      }, 1000);
    }
  });
  
  // Header scroll behavior
  initHeaderScroll();
  
  // Generate particles for hero
  generateParticles();
});

// Call particle generation on load
window.addEventListener('load', () => {
  // Re-run particles generation after page is fully loaded
  // This ensures it works even if there were issues during initial load
  generateParticles();
});

// Force services section to be visible
function forceServicesVisible() {
  const servicesSection = document.getElementById('services');
  if (servicesSection) {
    console.log('Found services section, ensuring visibility');
    servicesSection.style.display = 'block';
    servicesSection.style.visibility = 'visible';
    servicesSection.style.opacity = '1';
    servicesSection.style.zIndex = '10';
  } else {
    console.warn('Services section not found in DOM');
  }
}

// Fix all logo images with proper error handling
function fixLogoImages() {
  const logoImages = document.querySelectorAll('.logo-image');
  
  // Try to load the real logo from img directory
  const logoSrc = 'img/visiora_logo.png';
  const fallbackLogoSrc = 'visiora_logo.png';
  
  logoImages.forEach(img => {
    // Fix the source if needed
    if (!img.src.includes('img/')) {
      img.src = logoSrc;
    }
    
    // Display text logo in case image fails
    img.onerror = function() {
      console.log('Logo image failed to load, showing text fallback');
      
      // Hide the failed image
      this.style.display = 'none';
      
      // Show the text fallback
      const parent = this.parentElement;
      const span = parent.querySelector('span');
      if (span) {
        span.style.display = 'block';
      } else {
        // Create fallback if no span exists
        const textLogo = document.createElement('span');
        textLogo.textContent = "VISIORA";
        textLogo.style.fontFamily = "var(--font-primary)";
        textLogo.style.fontSize = "1.5rem";
        textLogo.style.fontWeight = "800";
        textLogo.style.color = "#ffffff";
        textLogo.style.display = "block";
        parent.appendChild(textLogo);
      }
      
      // Try alternate path as last resort
      if (this.src.includes('img/')) {
        const altImg = new Image();
        altImg.onload = () => {
          this.src = fallbackLogoSrc;
          this.style.display = 'block';
          if (span) span.style.display = 'none';
        };
        altImg.src = fallbackLogoSrc;
      }
    };
    
    // Also check if already loaded but broken
    if (img.complete && (img.naturalWidth < 5 || img.naturalHeight < 5)) {
      img.onerror();
    }
  });
}

// Fast preloader initialization
function initFastPreloader() {
  const preloader = document.querySelector('.preloader');
  const loaderProgress = document.querySelector('.loader-progress');
  const counterNumber = document.querySelector('.counter-number');
  
  if (!preloader) return;
  
  // Make sure body has loading class and prevent scrolling
  document.body.classList.add('loading');
  
  // Prevent scrolling while preloader is active
  document.body.style.overflow = 'hidden';
  document.body.style.height = '100%';
  
  // Add a small top bar that shows progress
  const topBar = document.createElement('div');
  topBar.className = 'preloader-top-bar';
  topBar.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 4px;
    background-color: var(--color-primary);
    z-index: 10001;
    transition: width 0.3s ease-out;
  `;
  document.body.appendChild(topBar);
  
  // Fast preloader to immediately show content
  let loadProgress = 0;
  const progressInterval = setInterval(() => {
    loadProgress += 5; // Slower progress to allow animations to load
    
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(progressInterval);
      
      // Hide preloader after a short delay to ensure animations are ready
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.remove('loading');
        
        // Re-enable scrolling when preloader is hidden
        document.body.style.overflow = '';
        document.body.style.height = '';
        
        // Remove top bar after transition
        setTimeout(() => {
          if (topBar.parentNode) {
            topBar.parentNode.removeChild(topBar);
          }
        }, 300);
      }, 300);
    }
    
    // Update loader visuals
    if (loaderProgress) loaderProgress.style.width = `${loadProgress}%`;
    if (counterNumber) counterNumber.textContent = loadProgress;
    topBar.style.width = `${loadProgress}%`;
  }, 100); // Slightly slower updates for smoother animation
  
  // Fail-safe: Hide preloader after max 5 seconds
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('hidden')) {
      clearInterval(progressInterval);
      if (loaderProgress) loaderProgress.style.width = '100%';
      if (counterNumber) counterNumber.textContent = '100';
      topBar.style.width = '100%';
      
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.remove('loading');
        
        // Re-enable scrolling in fail-safe case too
        document.body.style.overflow = '';
        document.body.style.height = '';
        
        // Remove top bar after transition
        setTimeout(() => {
          if (topBar.parentNode) {
            topBar.parentNode.removeChild(topBar);
          }
        }, 300);
      }, 300);
    }
  }, 5000);
}

// Simplified navigation initialization
function initSimpleNavigation() {
  const header = document.querySelector('.site-header');
  
  if (!header) return;
  
  // Use passive scroll listener for better performance
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
  
  // Initialize on page load
  if (window.pageYOffset > 50) {
    header.classList.add('scrolled');
  }
}

// Direct mobile menu implementation with minimal dependencies
function setupDirectMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const body = document.body;
  
  if (!menuToggle || !mobileMenu) {
    console.warn('Mobile menu elements not found for direct setup');
    return;
  }
  
  console.log('Setting up mobile menu with direct implementation');
  
  // Ensure menu toggle is visible
  menuToggle.style.display = 'flex';
  
  // Remove any existing click listeners to avoid duplicates
  const newMenuToggle = menuToggle.cloneNode(true);
  menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
  
  // Make sure the hamburger has exactly three spans for the lines
  const hamburger = newMenuToggle.querySelector('.hamburger');
  if (hamburger) {
    // Reset hamburger HTML to ensure it has exactly three spans
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    console.log('Hamburger menu structure reset with three spans');
  }
  
  // Add event listener to new toggle button
  newMenuToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle active classes
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    body.classList.toggle('menu-open');
    
    console.log('Direct menu toggle - active:', mobileMenu.classList.contains('active'));
  });
  
  // Close menu when clicking a link
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      newMenuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      body.classList.remove('menu-open');
    });
  });
}

// Initialize form validation
function initFormValidation() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const formElements = contactForm.elements;
      
      // Basic validation
      for (let i = 0; i < formElements.length; i++) {
        if (formElements[i].required && !formElements[i].value.trim()) {
          isValid = false;
          formElements[i].classList.add('error');
        } else {
          formElements[i].classList.remove('error');
        }
      }
      
      if (isValid) {
        // Simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        setTimeout(() => {
          submitButton.textContent = 'Message Sent!';
          
          // Reset form
          contactForm.reset();
          
          // Reset button after delay
          setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
          }, 3000);
        }, 1500);
      }
    });
  }
}

// Initialize lazy loading for images
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('.lazy-image');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    lazyImages.forEach(img => {
      img.src = img.dataset.src || img.src;
      img.classList.add('loaded');
    });
  }
}

// Initialize work filter
function initWorkFilter() {
  const filterButtons = document.querySelectorAll('.filter-button');
  const workItems = document.querySelectorAll('.work-item');
  
  // Set active filter
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Show/hide work items based on filter
      workItems.forEach(item => {
        const categories = item.getAttribute('data-category').split(' ');
        
        // Special handling for "all" filter to only show items with "all" category
        if (filterValue === 'all') {
          if (categories.includes('all')) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        } 
        // For other filters, show only items in that category
        else if (categories.includes(filterValue)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
  
  // Initialize with "all" filter active
  const allFilter = document.querySelector('.filter-button[data-filter="all"]');
  if (allFilter) {
    // Trigger click on page load
    setTimeout(() => {
      allFilter.click();
    }, 100);
  }
}

// Initialize videos in work items
function initWorkVideos() {
  const workItems = document.querySelectorAll('.work-item');
  const isMobile = window.innerWidth < 768;
  
  workItems.forEach(item => {
    const video = item.querySelector('video');
    if (!video) return; // Skip if no video
    
    // Ensure video is sized correctly
    video.setAttribute('playsinline', ''); // Better mobile handling
    video.muted = true;
    video.loop = true;
    
    // Handle direct video click (most reliable)
    video.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Direct video element clicked');
      
      toggleVideoPlayback(this, item);
      return false;
    });
    
    // Handle video container click
    const workImage = item.querySelector('.work-image');
    if (workImage) {
      workImage.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Video container clicked');
        
        toggleVideoPlayback(video, item);
        return false;
      });
    }
    
    // Prevent parent link navigation when clicking on video
    const workLink = item.querySelector('.work-link');
    if (workLink) {
      workLink.addEventListener('click', function(e) {
        const videoRect = video.getBoundingClientRect();
        const isInsideVideo = (
          e.clientX >= videoRect.left &&
          e.clientX <= videoRect.right &&
          e.clientY >= videoRect.top &&
          e.clientY <= videoRect.bottom
        );
        
        if (isInsideVideo) {
          e.preventDefault();
          e.stopPropagation();
          console.log('Prevented link navigation - clicking video');
          
          toggleVideoPlayback(video, item);
          return false;
        }
      });
    }
    
    // For mobile - also add touch events for better mobile response
    if (isMobile) {
      video.addEventListener('touchstart', function(e) {
        e.preventDefault();
        console.log('Video touch event');
        toggleVideoPlayback(this, item);
        return false;
      });
      
      if (workImage) {
        workImage.addEventListener('touchstart', function(e) {
          e.preventDefault();
          console.log('Image container touch event');
          toggleVideoPlayback(video, item);
          return false;
        });
      }
    }
    
    // Keep hover behavior for desktop
    if (!isMobile) {
      // Play on hover (desktop only)
      item.addEventListener('mouseenter', () => {
        if (video.paused) {
          video.play().catch(e => console.log('Hover play error:', e));
          item.classList.add('playing');
        }
      });
      
      // Pause when mouse leaves
      item.addEventListener('mouseleave', () => {
        if (!video.paused) {
          video.pause();
          item.classList.remove('playing');
        }
      });
    }
  });
  
  // Helper function to toggle video playback
  function toggleVideoPlayback(videoElement, containerItem) {
    if (!videoElement) return;
    
    if (videoElement.paused) {
      // Pause all other videos first
      document.querySelectorAll('.work-item video').forEach(v => {
        if (v !== videoElement) {
          v.pause();
          v.closest('.work-item').classList.remove('playing');
        }
      });
      
      // Play this video with better error handling
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('✓ Video playback started successfully');
          containerItem.classList.add('playing');
        }).catch(err => {
          console.error('✗ Video play error:', err);
          // Try again with autoplay challenges in mind
          videoElement.muted = true; // Ensure it's muted
          
          videoElement.play().then(() => {
            console.log('✓ Video playing muted after retry');
            containerItem.classList.add('playing');
          }).catch(e => {
            console.error('✗✗ Still cannot play video:', e);
            alert('Please tap again to play the video. Your browser may be blocking autoplay.');
          });
        });
      }
    } else {
      videoElement.pause();
      containerItem.classList.remove('playing');
      console.log('■ Video paused');
    }
  }
  
  // Set up loadedmetadata event for all videos
  document.querySelectorAll('.work-item video').forEach(video => {
    // Ensure video fits properly when loaded
    video.addEventListener('loadedmetadata', () => {
      // Check aspect ratio of the video
      const videoRatio = video.videoWidth / video.videoHeight;
      if (videoRatio > 1.5) { // Landscape video
        video.style.objectFit = 'contain'; 
      }
    });
  });
  
  // Handle window resize to adapt video behavior based on screen size
  window.addEventListener('resize', () => {
    const newIsMobile = window.innerWidth < 768;
    if (newIsMobile !== isMobile) {
      // Refresh the video behaviors if device type changes
      // This requires page reload to properly reset event listeners
      if (document.readyState === 'complete') {
        window.location.reload();
      }
    }
  });
  
  console.log(`Work videos initialized (${isMobile ? 'mobile' : 'desktop'} mode)`);
}

// Header scroll behavior
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  const scrollThreshold = 50;
  
  // Apply transparent background at top, blur effect when scrolled
  function updateHeaderOnScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
      // Add blur backdrop and subtle background
      header.style.backdropFilter = 'blur(10px)';
      header.style.webkitBackdropFilter = 'blur(10px)';
      header.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    } else {
      header.classList.remove('scrolled');
      // Remove blur and background when at top
      header.style.backdropFilter = 'blur(0px)';
      header.style.webkitBackdropFilter = 'blur(0px)';
      header.style.backgroundColor = 'transparent';
    }
  }
  
  // Initial check
  updateHeaderOnScroll();
  
  // Add event listener
  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
}

// Generate particles for hero section with advanced physics and parallax effect
function generateParticles() {
  const heroParticles = document.querySelector('.hero-particles');
  if (!heroParticles) return;
  
  // Clear existing particles
  heroParticles.innerHTML = '';
  
  // Check if mobile device
  const isMobile = window.innerWidth < 768;
  
  // Physics configuration
  const physics = {
    particleCount: isMobile ? 40 : 120,   // 40 for mobile (20 blue + 20 white), 120 for desktop
    mouseRadius: isMobile ? 200 : 400,    // Adjusted radius for mobile
    mouseForce: isMobile ? 0.8 : 0.6,     // Increased force on mobile for more dramatic effect
    friction: 0.85,                       // Kept fast for both
    maxSpeed: isMobile ? 60 : 80,         // Fast speed for both
    returnForce: isMobile ? 0.025 : 0.02, // Slightly stronger for mobile
    randomForce: isMobile ? 0.1 : 0.08,   // Increased for mobile to ensure movement
    parallaxFactor: isMobile ? 0.2 : 0.15, // More pronounced on mobile
    parallaxEasing: isMobile ? 0.25 : 0.2  // Faster response on mobile
  };
  
  // Mouse position tracking
  const mouse = {
    x: undefined,
    y: undefined,
    vx: 0,
    vy: 0,
    lastX: 0,
    lastY: 0,
    parallaxX: 0,          // Target parallax offset X
    parallaxY: 0,          // Target parallax offset Y
    currentParallaxX: 0,   // Current parallax offset X (for smooth transition)
    currentParallaxY: 0    // Current parallax offset Y (for smooth transition)
  };
  
  // Track mouse movement with velocity
  window.addEventListener('mousemove', (e) => {
    // Store previous position to calculate velocity
    mouse.lastX = mouse.x || e.clientX;
    mouse.lastY = mouse.y || e.clientY;
    
    // Update current position
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Calculate velocity (mouse speed)
    mouse.vx = mouse.x - mouse.lastX;
    mouse.vy = mouse.y - mouse.lastY;
    
    // Calculate parallax offsets based on mouse position relative to window center
    const windowCenterX = window.innerWidth / 2;
    const windowCenterY = window.innerHeight / 2;
    
    // Calculate mouse distance from center (normalized to -1 to 1)
    const normalizedX = (mouse.x - windowCenterX) / windowCenterX;
    const normalizedY = (mouse.y - windowCenterY) / windowCenterY;
    
    // Set target parallax values (opposite direction of mouse movement)
    mouse.parallaxX = -normalizedX * physics.parallaxFactor * window.innerWidth;
    mouse.parallaxY = -normalizedY * physics.parallaxFactor * window.innerHeight;
  });
  
  // Handle touch for mobile
  window.addEventListener('touchmove', (e) => {
    if (e.touches[0]) {
      mouse.lastX = mouse.x || e.touches[0].clientX;
      mouse.lastY = mouse.y || e.touches[0].clientY;
      
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      
      mouse.vx = mouse.x - mouse.lastX;
      mouse.vy = mouse.y - mouse.lastY;
      
      // Calculate parallax for touch as well
      const windowCenterX = window.innerWidth / 2;
      const windowCenterY = window.innerHeight / 2;
      
      const normalizedX = (mouse.x - windowCenterX) / windowCenterX;
      const normalizedY = (mouse.y - windowCenterY) / windowCenterY;
      
      // Enhanced parallax factor for mobile (more noticeable movement)
      const mobileFactor = physics.parallaxFactor * 1.5;
      mouse.parallaxX = -normalizedX * mobileFactor * window.innerWidth;
      mouse.parallaxY = -normalizedY * mobileFactor * window.innerHeight;
    }
  });
  
  // Add gyroscope support for mobile parallax
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      // Only use gyroscope when no touch is happening
      if (mouse.x === undefined) {
        // Use beta (x-axis) and gamma (y-axis) for tilt-based parallax
        const tiltX = e.gamma || 0; // Left/right tilt (-90 to 90)
        const tiltY = e.beta || 0;  // Front/back tilt (-180 to 180)
        
        // Normalize tilt values to -1 to 1
        const normalizedX = Math.max(Math.min(tiltX / 45, 1), -1);
        const normalizedY = Math.max(Math.min(tiltY / 45, 1), -1);
        
        // Apply tilt-based parallax (increased factor for more visible effect)
        const tiltFactor = physics.parallaxFactor * 1.2;
        mouse.parallaxX = -normalizedX * tiltFactor * window.innerWidth;
        mouse.parallaxY = -normalizedY * tiltFactor * window.innerHeight;
      }
    }, true);
  }
  
  // Reset parallax when mouse/touch leaves the window
  window.addEventListener('mouseleave', () => {
    mouse.parallaxX = 0;
    mouse.parallaxY = 0;
  });
  
  // Static colors (no transitions to prevent flashing)
  const colors = [
    { r: 0, g: 70, b: 255, a: 0.8 },    // Blue with higher opacity for mobile
    { r: 255, g: 255, b: 255, a: 0.9 }  // Pure white with higher opacity for mobile
  ];
  
  // Particle array
  const particles = [];
  
  // Calculate half count for equal distribution
  const halfCount = Math.floor(physics.particleCount / 2);
  
  // Create particles with equal blue and white distribution
  for (let i = 0; i < physics.particleCount; i++) {
    // Create particle DOM element
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Size with consistency - larger on mobile for better visibility
    const size = isMobile ? (3 + Math.random() * 7) : (2 + Math.random() * 6);
    
    // Initial position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Alternate between blue and white
    const colorIndex = i < halfCount ? 0 : 1; // First half blue, second half white
    const color = colors[colorIndex];
    
    // Set styles - NO transitions to prevent flashing
    particle.style.cssText = `
      position: absolute;
      top: ${y}%;
      left: ${x}%;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background-color: rgba(${color.r}, ${color.g}, ${color.b}, ${color.a});
      will-change: transform;
      pointer-events: none;
      opacity: ${color.a};
      filter: blur(${colorIndex === 0 ? '0' : '0.8px'}); /* Add slight blur to white particles for glow effect */
      z-index: 2; /* Ensure particles are visible on mobile */
      display: block !important; /* Force display for mobile */
    `;
    
    // Add to DOM
    heroParticles.appendChild(particle);
    
    // Parallax depth factor - different particles move at different speeds
    const parallaxDepth = 0.5 + Math.random() * 0.8; // Increased parallax depth for more visible movement
    
    // Particle physics properties
    particles.push({
      element: particle,
      x: x,
      y: y,
      originX: x,
      originY: y,
      size: size,
      color: color, // Static color - never changes
      vx: 0,
      vy: 0,
      force: isMobile ? (0.2 + Math.random() * 0.2) : (0.15 + Math.random() * 0.15), // Higher force on mobile
      friction: physics.friction,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: isMobile ? (0.01 + Math.random() * 0.015) : (0.005 + Math.random() * 0.01), // Faster angle speed on mobile
      parallaxDepth: parallaxDepth // Each particle has different parallax depth
    });
  }
  
  // Animation function with simplified physics to prevent flashing
  function animate() {
    // Get hero dimensions for calculations
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    const heroRect = heroSection.getBoundingClientRect();
    
    // Smooth parallax movement with easing
    mouse.currentParallaxX += (mouse.parallaxX - mouse.currentParallaxX) * physics.parallaxEasing;
    mouse.currentParallaxY += (mouse.parallaxY - mouse.currentParallaxY) * physics.parallaxEasing;
    
    // Process each particle
    particles.forEach(particle => {
      // Default forces - always apply
      let fx = 0; // Force x-component
      let fy = 0; // Force y-component
      
      // Return force - pulls particle back to origin
      const dx = particle.originX - particle.x;
      const dy = particle.originY - particle.y;
      fx += dx * physics.returnForce * particle.force;
      fy += dy * physics.returnForce * particle.force;
      
      // Natural movement - makes particles drift in a natural way
      particle.angle += particle.angleSpeed;
      fx += Math.cos(particle.angle) * physics.randomForce * particle.force;
      fy += Math.sin(particle.angle) * physics.randomForce * particle.force;
      
      // Mouse interaction - only if mouse is defined
      if (mouse.x !== undefined && mouse.y !== undefined) {
        const expandedRange = isMobile ? 200 : 150; // Larger range on mobile
        
        if (
          mouse.x >= heroRect.left - expandedRange && 
          mouse.x <= heroRect.right + expandedRange && 
          mouse.y >= heroRect.top - expandedRange && 
          mouse.y <= heroRect.bottom + expandedRange
        ) {
          // Convert mouse position to percentage within hero
          const mouseXPercent = ((mouse.x - heroRect.left) / heroRect.width) * 100;
          const mouseYPercent = ((mouse.y - heroRect.top) / heroRect.height) * 100;
          
          // Distance from mouse to particle
          const mdx = mouseXPercent - particle.x;
          const mdy = mouseYPercent - particle.y;
          const distance = Math.sqrt(mdx * mdx + mdy * mdy);
          
          // Convert to pixel distance for more accurate calculations
          const pixelDistance = distance * heroRect.width / 100;
          
          // Make particles run away from cursor
          if (pixelDistance < physics.mouseRadius) {
            // Direction vector (normalized)
            const dirX = mdx / distance;
            const dirY = mdy / distance;
            
            // Distance factor - closer particles flee faster
            const repelStrength = Math.pow((physics.mouseRadius - pixelDistance) / physics.mouseRadius, 1.2);
            
            // Add mouse speed for stronger effect when moving fast
            const mouseSpeed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
            const speedFactor = 1 + Math.min(2, mouseSpeed / 10);
            
            // Apply repulsion force
            fx -= dirX * repelStrength * physics.mouseForce * particle.force * speedFactor * 2;
            fy -= dirY * repelStrength * physics.mouseForce * particle.force * speedFactor * 2;
          }
        }
      }
      
      // Apply forces to velocity
      particle.vx += fx;
      particle.vy += fy;
      
      // Apply friction
      particle.vx *= particle.friction;
      particle.vy *= particle.friction;
      
      // Limit max speed
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (speed > physics.maxSpeed) {
        const ratio = physics.maxSpeed / speed;
        particle.vx *= ratio;
        particle.vy *= ratio;
      }
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Boundary checks
      if (particle.x < -20) particle.x = -20;
      if (particle.x > 120) particle.x = 120;
      if (particle.y < -20) particle.y = -20;
      if (particle.y > 120) particle.y = 120;
      
      // Calculate parallax offset based on particle depth
      const parallaxOffsetX = mouse.currentParallaxX * particle.parallaxDepth / 80; // Adjusted divisor for larger movement
      const parallaxOffsetY = mouse.currentParallaxY * particle.parallaxDepth / 80;
      
      // Apply transform combining particle physics movement with parallax effect
      // Using translate3d for hardware acceleration with much higher movement multiplier
      particle.element.style.transform = `translate3d(${particle.vx * 1.0 + parallaxOffsetX}px, ${particle.vy * 1.0 + parallaxOffsetY}px, 0)`;
    });
    
    // Continue animation loop with requestAnimationFrame for optimal performance
    requestAnimationFrame(animate);
  }
  
  // Start the animation loop
  animate();
  
  console.log(`Created ${physics.particleCount} particles (${isMobile ? 'mobile' : 'desktop'} mode)`);
}

// Fix spacing between About and Work sections for mobile view
function fixWorkSectionSpacing() {
  if (window.innerWidth <= 767) {
    const workSection = document.getElementById('work');
    const aboutSection = document.getElementById('about');
    
    if (workSection && aboutSection) {
      console.log('Applying work section spacing fix for mobile');
      
      // Force zero margin between sections
      workSection.style.marginTop = '0';
      aboutSection.style.marginBottom = '0';
      
      // Set consistent padding
      workSection.style.paddingTop = '20px';
      aboutSection.style.paddingBottom = '20px';
      
      // Add a small helper div if needed to prevent browser margin collapsing
      const spacerExists = document.getElementById('section-spacer');
      if (!spacerExists) {
        const spacer = document.createElement('div');
        spacer.id = 'section-spacer';
        spacer.style.height = '1px';
        spacer.style.width = '100%';
        spacer.style.padding = '0';
        spacer.style.margin = '0';
        spacer.style.background = 'transparent';
        
        // Insert between about and work sections
        aboutSection.parentNode.insertBefore(spacer, workSection);
      }
    }
  }
}

// Fix spacing above the contact section for both mobile and desktop
function fixContactSectionSpacing() {
  const contactSection = document.getElementById('contact');
  const servicesSection = document.getElementById('services');
  const workSection = document.getElementById('work');
  
  if (contactSection) {
    console.log('Applying contact section spacing fix');
    
    // Force zero margin between services and contact sections
    contactSection.style.marginTop = '0';
    contactSection.style.paddingTop = window.innerWidth <= 767 ? '20px' : '40px';
    
    // Add CSS directly to fix contact section spacing
    const style = document.createElement('style');
    style.id = 'contact-section-fix';
    style.textContent = `
      #contact, .contact-section {
        margin-top: 0 !important;
        padding-top: ${window.innerWidth <= 767 ? '20px' : '40px'} !important;
      }
      
      #services, .services-section {
        margin-bottom: 0 !important;
        padding-bottom: ${window.innerWidth <= 767 ? '20px' : '40px'} !important;
      }
    `;
    
    // Remove any existing style with this ID
    const existingStyle = document.getElementById('contact-section-fix');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Add the new style
    document.head.appendChild(style);
    
    // If services section exists, fix its bottom spacing
    if (servicesSection) {
      servicesSection.style.marginBottom = '0';
      servicesSection.style.paddingBottom = window.innerWidth <= 767 ? '20px' : '40px';
    }
    
    // Add a small helper div to prevent browser margin collapsing
    const spacerExists = document.getElementById('services-contact-spacer');
    if (!spacerExists && servicesSection) {
      const spacer = document.createElement('div');
      spacer.id = 'services-contact-spacer';
      spacer.style.height = '1px';
      spacer.style.width = '100%';
      spacer.style.padding = '0';
      spacer.style.margin = '0';
      spacer.style.background = 'transparent';
      
      // Insert between services and contact sections
      servicesSection.parentNode.insertBefore(spacer, contactSection);
    }
  }
}

// Call the fixes on window load and resize to ensure they apply
window.addEventListener('load', fixWorkSectionSpacing);
window.addEventListener('load', fixContactSectionSpacing);
window.addEventListener('resize', fixWorkSectionSpacing);
window.addEventListener('resize', fixContactSectionSpacing);

// Add an extra handler to fix contact section spacing when scrolling to it
document.querySelector('#contactBtn')?.addEventListener('click', function() {
  // Short delay to ensure scroll completes first
  setTimeout(fixContactSectionSpacing, 100);
}); 