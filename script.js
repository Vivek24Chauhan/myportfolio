// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    // initContactForm(); // Contact form now handled by Formspree
    initTypingEffect();
    initParallaxEffect();
    initSmoothScrolling();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        if (hamburger.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Reset hamburger bars
            const bars = hamburger.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    // Navbar scroll effect
    // window.addEventListener('scroll', function() {
    //     const navbar = document.querySelector('.navbar');
    //     if (window.scrollY > 50) {
    //         navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    //         navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    //     } else {
    //         navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    //         navbar.style.boxShadow = 'none';
    //     }
    // });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special animations for specific elements
                if (entry.target.classList.contains('stat')) {
                    animateCounter(entry.target);
                }
                
                if (entry.target.classList.contains('timeline-item')) {
                    animateTimelineItem(entry.target);
                }
                
                if (entry.target.classList.contains('project-card')) {
                    animateProjectCard(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
        .hero-text, .hero-image, .about-text, .skills-section,
        .stat, .timeline-item, .project-card, .achievement-card,
        .contact-item, .contact-form
    `);

    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Counter animation for stats
function animateCounter(element) {
    if (element.classList.contains('counted')) return; // Prevent re-animation
    element.classList.add('counted');
    const target = element.querySelector('h3');
    const finalNumber = target.textContent.replace(/[^0-9.]/g, '');
    const suffix = target.textContent.replace(/[0-9.]/g, '');
    
    let current = 0;
    const increment = finalNumber / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= finalNumber) {
            current = finalNumber;
            clearInterval(timer);
        }
        target.textContent = Math.floor(current) + suffix;
    }, 30);
}

// On page load, check if stats are already visible and animate if so
window.addEventListener('DOMContentLoaded', function() {
    const stats = document.querySelectorAll('.stat');
    stats.forEach(stat => {
        const rect = stat.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            animateCounter(stat);
        }
    });
});

// Timeline item animation
function animateTimelineItem(item) {
    item.style.transform = 'translateX(0)';
    item.style.opacity = '1';
}

// Project card animation
function animateProjectCard(card) {
    card.style.transform = 'translateY(0)';
    card.style.opacity = '1';
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Typing effect for hero title
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    
    let index = 0;
    const typeSpeed = 50;
    
    function typeWriter() {
        if (index < text.length) {
            heroTitle.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, typeSpeed);
        }
    }
    
    // Start typing effect after a delay
    setTimeout(typeWriter, 1000);
}

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (!hero || !heroContent) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (scrolled < hero.offsetHeight) {
            heroContent.style.transform = `translateY(${rate}px)`;
        }
    });
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
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility function to add CSS animations
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .skill-tag {
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .timeline-item {
            transform: translateX(-50px);
            opacity: 0;
            transition: all 0.6s ease;
        }
        
        .timeline-item:nth-child(even) {
            transform: translateX(50px);
        }
        
        .project-card {
            transform: translateY(30px);
            opacity: 0;
            transition: all 0.6s ease;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .notification-close:hover {
            opacity: 0.8;
        }
        
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize animation styles
addAnimationStyles();

// Loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add loading styles
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        body:not(.loaded) {
            overflow: hidden;
        }
        
        body:not(.loaded)::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        body:not(.loaded)::after {
            content: 'Loading...';
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 1.5rem;
            font-weight: 600;
            z-index: 10001;
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        body.loaded::before,
        body.loaded::after {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease;
        }
    `;
    document.head.appendChild(loadingStyle);
});

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Add rainbow animation to the gradient text
    const gradientText = document.querySelector('.gradient-text');
    if (gradientText) {
        gradientText.style.animation = 'rainbow 2s linear infinite';
        
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbow {
                0% { background: linear-gradient(135deg, #ff0000 0%, #ff8000 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                16% { background: linear-gradient(135deg, #ff8000 0%, #ffff00 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                32% { background: linear-gradient(135deg, #ffff00 0%, #80ff00 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                48% { background: linear-gradient(135deg, #80ff00 0%, #00ff80 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                64% { background: linear-gradient(135deg, #00ff80 0%, #0080ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                80% { background: linear-gradient(135deg, #0080ff 0%, #8000ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                100% { background: linear-gradient(135deg, #8000ff 0%, #ff0000 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            }
        `;
        document.head.appendChild(rainbowStyle);
        
        showNotification('🎉 Easter egg activated! You found the secret!', 'success');
        
        // Remove after 10 seconds
        setTimeout(() => {
            gradientText.style.animation = '';
            rainbowStyle.remove();
        }, 10000);
    }
}