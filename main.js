// Modern Academic Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initCarousel();
    initSmoothScrolling();
    initScrollAnimations();
    initHeaderScroll();
    initContactLinks();
});

// Carousel functionality
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const cards = document.querySelectorAll('.service-card');
    
    if (!track || !prevBtn || !nextBtn || !cards.length) return;
    
    let currentIndex = 0;
    
    function getMetrics() {
        const firstCard = cards[0];
        const containerWidth = track.parentElement.offsetWidth;
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
        const cardWidth = firstCard.getBoundingClientRect().width;
        const visibleCards = Math.max(1, Math.floor((containerWidth + gap) / (cardWidth + gap)));
        const maxIndex = Math.max(0, cards.length - visibleCards);
        return { cardWidth, gap, visibleCards, maxIndex };
    }
    
    // Auto-play carousel
    let autoPlayInterval = setInterval(nextSlide, 4000);
    
    function updateCarousel() {
        const { cardWidth, gap, maxIndex } = getMetrics();
        // Clamp index in case of resize
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        const translateX = -(currentIndex * (cardWidth + gap));
        track.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
    }
    
    function nextSlide() {
        const { maxIndex } = getMetrics();
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop back to start
        }
        updateCarousel();
    }
    
    function prevSlide() {
        const { maxIndex } = getMetrics();
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = maxIndex; // Loop to end
        }
        updateCarousel();
    }
    
    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });
    
    // Pause auto-play on hover
    track.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    track.addEventListener('mouseleave', () => {
        resetAutoPlay();
    });
    
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 4000);
    }
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoPlay();
        }
    }
    
    // Responsive handling
    window.addEventListener('resize', () => {
        updateCarousel();
    });
    
    // Initialize
    updateCarousel();
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loading');
                
                // Add stagger animation to service cards
                if (entry.target.classList.contains('service-card')) {
                    const cards = entry.target.parentElement.querySelectorAll('.service-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.transform = 'translateY(0)';
                            card.style.opacity = '1';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .contact-card, .expertise-item');
    animatedElements.forEach(element => {
        element.style.transform = 'translateY(20px)';
        element.style.opacity = '0';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        // Hide header on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Contact links functionality
function initContactLinks() {
    // WhatsApp link with custom message
    const whatsappLink = document.querySelector('a[href*="wa.me"]');
    if (whatsappLink) {
        const message = encodeURIComponent('Hello! I am interested in your academic writing services. Can you please provide more information?');
        const phone = '254733769950';
        // Use universal WhatsApp endpoint for better desktop/mobile compatibility
        whatsappLink.href = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
        whatsappLink.target = '_blank';
        whatsappLink.rel = 'noopener noreferrer';
        
        // Add click tracking
        whatsappLink.addEventListener('click', () => {
            console.log('WhatsApp contact initiated');
        });
    }
    
    // Facebook link
    const facebookLink = document.querySelector('a[href*="facebook.com"]');
    if (facebookLink) {
        facebookLink.target = '_blank';
        facebookLink.rel = 'noopener noreferrer';
        
        facebookLink.addEventListener('click', () => {
            console.log('Facebook profile visited');
        });
    }
    
    // Email link
    const emailLink = document.querySelector('a[href^="mailto"]');
    if (emailLink) {
        const subject = encodeURIComponent('Academic Writing Services Inquiry');
        const body = encodeURIComponent('Hello,\n\nI am interested in your academic writing services. Please provide more information about:\n\n- Pricing\n- Turnaround time\n- Revision policy\n- Payment methods\n\nThank you!');
        emailLink.href = `mailto:info@academicexcellence.com?subject=${subject}&body=${body}`;
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add floating animation to hero elements
function animateHeroElements() {
    const elements = document.querySelectorAll('.element');
    
    elements.forEach((element, index) => {
        const randomDelay = Math.random() * 2000;
        const randomDuration = 3000 + Math.random() * 2000;
        
        setInterval(() => {
            element.style.transform += ` rotate(${Math.random() * 10 - 5}deg)`;
        }, randomDuration);
    });
}

// Initialize hero animations (disabled to avoid transform conflicts with CSS float animation)
// setTimeout(animateHeroElements, 1000);

// Performance optimization
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.loading = 'lazy';
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
}

// Initialize image optimization
optimizeImages();

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key to close any modals or overlays
    if (e.key === 'Escape') {
        // Close any open elements
    }
    
    // Arrow keys for carousel navigation
    if (e.key === 'ArrowLeft') {
        const prevBtn = document.getElementById('prev-btn');
        if (prevBtn && document.activeElement.closest('.carousel-container')) {
            prevBtn.click();
        }
    }
    
    if (e.key === 'ArrowRight') {
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn && document.activeElement.closest('.carousel-container')) {
            nextBtn.click();
        }
    }
});

// Add progress indicator for page scroll
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #1e3a8a, #f59e0b);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize scroll progress
addScrollProgress();

// Add smooth reveal animations on scroll
function addRevealAnimations() {
    const revealElements = document.querySelectorAll('.section-title, .section-subtitle, .about-text');
    
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease-out';
    });
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.3 });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Initialize reveal animations
addRevealAnimations();

// Add click animations to buttons
function addButtonAnimations() {
    const buttons = document.querySelectorAll('button, .cta-button, .contact-link');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple animation CSS
const rippleCSS = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize button animations
addButtonAnimations();

console.log('Academic Excellence Hub website loaded successfully!');