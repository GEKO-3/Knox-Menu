// Load menu from JSON
async function loadMenu() {
    try {
        const response = await fetch('menu.json');
        const data = await response.json();
        renderNavbar(data.categories);
        renderMenu(data.categories);
    } catch (error) {
        console.error('Error loading menu:', error);
    }
}

// Render category navigation bar
function renderNavbar(categories) {
    const navbarContent = document.querySelector('.navbar-content');
    navbarContent.innerHTML = '';

    categories.forEach(category => {
        const link = document.createElement('a');
        link.href = `#${category.id}`;
        link.textContent = category.name;
        navbarContent.appendChild(link);
    });
}

// Render menu dynamically
function renderMenu(categories) {
    const menuSection = document.getElementById('menu');
    menuSection.innerHTML = '';

    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-section';
        categoryDiv.id = category.id;
        categoryDiv.setAttribute('data-bg', category.background);

        categoryDiv.innerHTML = `
            <div class="category-header animate-on-scroll">
                <h2>${category.name}</h2>
                <p>${category.description}</p>
                ${category.categoryAddons ? `
                    <div class="category-addons">
                        <span class="addons-label">Add-ons available:</span>
                        <div class="category-addons-list">
                            ${category.categoryAddons.map(addon => `
                                <span class="addon-badge">${addon.name} +${addon.price}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
            <ul class="menu-list">
                ${category.items.map(item => `
                    <li class="menu-item animate-on-scroll">
                        <div class="item-header">
                            <span class="price">${item.price}</span>
                            <h3>${item.name}</h3>
                        </div>
                        <p>${item.description}</p>
                        ${item.variations ? `
                            <div class="variations">
                                ${item.variations.map(variation => `
                                    <div class="variation-item">
                                        <span class="variation-name">${variation.name}</span>
                                        <span class="variation-price">${variation.price}</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </li>
                `).join('')}
            </ul>
        `;

        menuSection.appendChild(categoryDiv);
    });

    // Re-initialize observers after content is loaded
    initializeObservers();
}

// Initialize intersection observers
function initializeObservers() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .category-header, .menu-item');
    animatedElements.forEach(el => observer.observe(el));

    const categorySections = document.querySelectorAll('.category-section');
    categorySections.forEach(section => observer.observe(section));
}

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

// Create observer for general animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add active class to category sections for enhanced background effect
            if (entry.target.classList.contains('category-section')) {
                entry.target.classList.add('active');
            }
        }
    });
}, observerOptions);

// Load menu on page load
window.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    initHamburgerMenu();
});

// Initialize hamburger menu
function initHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navbarContent = document.querySelector('.navbar-content');

    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navbarContent.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.navbar-content a').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            navbarContent.classList.remove('active');
        });
    });
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// Add dynamic background color change on scroll
let lastScrollTop = 0;
const categoryBgs = document.querySelectorAll('[data-bg]');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    categoryBgs.forEach(section => {
        const rect = section.getBoundingClientRect();
        const inView = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
        
        if (inView) {
            // Enhance the background when section is in center of viewport
            section.style.backgroundSize = '120% 120%';
        } else {
            section.style.backgroundSize = '100% 100%';
        }
    });
    
    lastScrollTop = scrollTop;
});

// Add floating animation to menu items on hover
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = '';
        }, 10);
    });
});

// Add ripple effect on menu item click
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(210, 105, 30, 0.5)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.left = e.clientX - this.getBoundingClientRect().left - 10 + 'px';
        ripple.style.top = e.clientY - this.getBoundingClientRect().top - 10 + 'px';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Add cursor trail effect (optional - can be removed if too much)
let cursorTrail = [];
const trailLength = 10;

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) { // Only on desktop
        cursorTrail.push({ x: e.clientX, y: e.clientY });
        
        if (cursorTrail.length > trailLength) {
            cursorTrail.shift();
        }
    }
});

// Performance optimization: debounce scroll events
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

// Apply debounce to scroll-heavy operations
const debouncedScroll = debounce(() => {
    // Additional scroll operations can go here
}, 50);

window.addEventListener('scroll', debouncedScroll);

console.log('🍵 Knox Menu loaded successfully!');
