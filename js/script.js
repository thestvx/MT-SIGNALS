// Function to toggle between dark and light themes
function toggleTheme() {
    const body = document.body;
    body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', body.dataset.theme);
}

// Function to handle the sticky header
function handleHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Function to handle the mobile menu toggle
function toggleMenu() {
    const mainNav = document.querySelector('.main-nav');
    mainNav.classList.toggle('show');
}

// Function to highlight the active page in the navigation menu
function setActiveLink() {
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    
    // Remove 'active' class from all links first
    navLinks.forEach(link => link.classList.remove('active'));

    // Then add the class to the active link only
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
}

// Function to initialize Particles.js
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle"
                },
                "opacity": {
                    "value": 0.5
                },
                "size": {
                    "value": 5,
                    "random": true
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 6
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "repulse"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                }
            },
            "retina_detect": true
        });
    }
}

// Function to handle the theme on page load
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.dataset.theme = savedTheme;
    }
}

// New function to handle the splash screen
function handleSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
        }, 5000); // 5 seconds
    }
}

// Event listeners for page load and interactions
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initializeTheme();

    // Handle the splash screen
    handleSplashScreen();

    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }

    // Initialize Particles.js
    initializeParticles();

    // Set active navigation link
    setActiveLink();

    // Handle header scroll
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Call once on load

    // Handle theme toggle
    const themeToggleButton = document.getElementById('theme-toggle-button');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }

    // Handle mobile menu toggle
    const menuToggleButton = document.querySelector('.menu-toggle-button');
    if (menuToggleButton) {
        menuToggleButton.addEventListener('click', toggleMenu);
    }
});
