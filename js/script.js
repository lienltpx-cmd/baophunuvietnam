// ===================================
// SCROLL TO TOP BUTTON
// ===================================
const scrollTopBtn = document.getElementById('scrollTopBtn');

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// Scroll to top on click
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
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

// ===================================
// CONTACT FORM HANDLING
// ===================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        position: document.getElementById('position').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    // Show success message
    showNotification('success', 'Gửi thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.');

    // Reset form
    contactForm.reset();

    // Log form data (in production, send to server)
    console.log('Form Data:', formData);
});

// ===================================
// NOTIFICATION SYSTEM
// ===================================
function showNotification(type, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;

    // Add animation keyframes
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.innerHTML = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .notification-content i {
                font-size: 1.5rem;
            }
        `;
        document.head.appendChild(style);
    }

    // Add to body
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ===================================
// FORM VALIDATION
// ===================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{10,11}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Real-time form validation
document.getElementById('email').addEventListener('blur', function () {
    if (this.value && !validateEmail(this.value)) {
        this.style.borderColor = '#EF4444';
        showNotification('error', 'Email không hợp lệ');
    } else {
        this.style.borderColor = '';
    }
});

document.getElementById('phone').addEventListener('blur', function () {
    if (this.value && !validatePhone(this.value)) {
        this.style.borderColor = '#EF4444';
        showNotification('error', 'Số điện thoại không hợp lệ');
    } else {
        this.style.borderColor = '';
    }
});

// ===================================
// SCROLL ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Observer for .fade-up elements (adds 'visible' class)
const fadeUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add delay based on data-delay attribute
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay * 150);
        }
    });
}, observerOptions);

// Observer for other elements (inline styles)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Observe all .fade-up elements
    const fadeUpElements = document.querySelectorAll('.fade-up');
    fadeUpElements.forEach(el => {
        fadeUpObserver.observe(el);
    });

    // Observe other animated elements (legacy support)
    const animatedElements = document.querySelectorAll(`
        .service-card,
        .result-card,
        .benefit-item,
        .roadmap-item,
        .challenge-item,
        .proof-card
    `);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// ===================================
// COUNTER ANIMATION FOR NUMBERS
// ===================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ===================================
// PRICING HIGHLIGHT
// ===================================
document.querySelectorAll('.pricing-column').forEach(column => {
    column.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
    });

    column.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });
});

// ===================================
// HEADER SCROLL EFFECT
// ===================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// ===================================
// MOBILE MENU OPTIMIZATION
// ===================================
function isMobile() {
    return window.innerWidth < 768;
}

// Adjust animations for mobile
if (isMobile()) {
    document.documentElement.style.setProperty('scroll-behavior', 'smooth');
}

// ===================================
// PRINT PAGE OPTIMIZATION
// ===================================
window.addEventListener('beforeprint', () => {
    document.querySelectorAll('.scroll-top-btn').forEach(el => {
        el.style.display = 'none';
    });
});

window.addEventListener('afterprint', () => {
    document.querySelectorAll('.scroll-top-btn').forEach(el => {
        el.style.display = '';
    });
});

// ===================================
// LAZY LOADING FOR IMAGES
// ===================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===================================
// PERFORMANCE MONITORING
// ===================================
window.addEventListener('load', () => {
    // Check if Performance API is available
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.domContentLoadedEventEnd -
            window.performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    }
});

// ===================================
// COPY EMAIL/PHONE ON CLICK
// ===================================
document.querySelectorAll('.info-item').forEach(item => {
    item.addEventListener('click', function () {
        const text = this.querySelector('p').textContent;
        const email = text.match(/[\w.-]+@[\w.-]+\.\w+/);
        const phone = text.match(/\d{4}\s\d{3}\s\d{3}/);

        if (email || phone) {
            navigator.clipboard.writeText(email ? email[0] : phone[0]).then(() => {
                showNotification('success', `Đã sao chép: ${email ? email[0] : phone[0]}`);
            });
        }
    });
});

// ===================================
// CTA BUTTON CLICK TRACKING
// ===================================
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function (e) {
        const buttonText = this.textContent.trim();
        console.log(`Button clicked: ${buttonText}`);

        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);

        ripple.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: ripple-effect 0.6s ease-out;
            pointer-events: none;
        `;

        // Add ripple animation
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.innerHTML = `
                @keyframes ripple-effect {
                    to {
                        width: 100px;
                        height: 100px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => ripple.remove(), 600);
    });
});

// ===================================
// ACCESSIBILITY IMPROVEMENTS
// ===================================
// Focus trap for modal (if needed in future)
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%c🚀 Vinalink SEO Foundation', 'color: #E30613; font-size: 20px; font-weight: bold;');
console.log('%cĐề xuất Chiến lược SEO cho Báo Phụ nữ Việt Nam', 'color: #1F3D7A; font-size: 14px;');
console.log('%c---', 'color: #999;');
console.log('Developed with ❤️ for phunuvietnam.vn');