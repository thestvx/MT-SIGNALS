// A single object to manage all global selectors
const selectors = {
    body: document.body,
    mainHeader: document.querySelector('.main-header'),
    mainNav: document.querySelector('.main-nav'),
    themeToggleButton: document.getElementById('theme-toggle-button'),
    menuToggleButton: document.querySelector('.menu-toggle-button'),
    splashScreen: document.getElementById('splash-screen'),
    allModals: document.querySelectorAll('.modal'),
    modalCloseButtons: document.querySelectorAll('[data-dismiss="modal"]'),
    authButtonsContainer: document.getElementById('auth-buttons-container'),
    userLoggedIn: document.getElementById('user-logged-in'),
    userLoggedOut: document.getElementById('user-logged-out'),
};

// Function to toggle between dark and light themes
function toggleTheme() {
    const currentTheme = selectors.body.dataset.theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    selectors.body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    updateParticlesTheme(newTheme);
}

// Function to update Particles.js theme
function updateParticlesTheme(theme) {
    if (typeof particlesJS !== 'undefined' && window.particles) {
        const particleColor = theme === 'dark' ? '#ffffff' : '#000000';
        window.particles.particles.color.value = particleColor;
        window.particles.particles.line_linked.color = particleColor;
        window.particles.fn.particlesDraw();
    }
}

// Function to handle the sticky header on scroll
function handleHeaderScroll() {
    if (window.scrollY > 50) {
        selectors.mainHeader.classList.add('scrolled');
    } else {
        selectors.mainHeader.classList.remove('scrolled');
    }
}

// Function to handle the mobile menu toggle
function toggleMenu() {
    selectors.mainNav.classList.toggle('show');
}

// Function to highlight the active page in the navigation menu
function setActiveLink() {
    const currentPath = window.location.pathname.split('/').pop();
    const allLinks = document.querySelectorAll('.main-nav a, .auth-buttons a');

    allLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath || (linkPath === 'index.html' && currentPath === '')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Function to initialize Particles.js
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        const theme = localStorage.getItem('theme') || 'dark';
        const particleColor = theme === 'dark' ? '#ffffff' : '#000000';

        window.particles = particlesJS('particles-js', {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": particleColor },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": true },
                "size": { "value": 5, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": particleColor, "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 6 }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "repulse" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                }
            },
            "retina_detect": true
        });
    } else {
        console.warn('Particles.js library not found. Skipping initialization.');
    }
}

// Function to handle the theme on page load
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && selectors.body) {
        selectors.body.dataset.theme = savedTheme;
    }
}

// Function to manage user login state (simulated)
function manageUserLoginState(isLoggedIn) {
    if (selectors.userLoggedIn && selectors.userLoggedOut) {
        if (isLoggedIn) {
            selectors.userLoggedIn.style.display = 'flex';
            selectors.userLoggedOut.style.display = 'none';
        } else {
            selectors.userLoggedIn.style.display = 'none';
            selectors.userLoggedOut.style.display = 'flex';
        }
    }
}

// Event listeners for page load and interactions
document.addEventListener('DOMContentLoaded', () => {
    // Hide splash screen after a short delay
    if (selectors.splashScreen) {
        setTimeout(() => {
            selectors.splashScreen.classList.add('fade-out');
            setTimeout(() => selectors.splashScreen.remove(), 500);
        }, 1500);
    }

    // Initialize theme
    initializeTheme();

    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
        });
    } else {
        console.warn('AOS library not found. Skipping animations.');
    }

    // Initialize Particles.js
    initializeParticles();

    // Set active navigation link
    setActiveLink();

    // Handle header scroll
    if (selectors.mainHeader) {
        window.addEventListener('scroll', handleHeaderScroll);
        handleHeaderScroll();
    }

    // Handle theme toggle
    if (selectors.themeToggleButton) {
        selectors.themeToggleButton.addEventListener('click', toggleTheme);
    }

    // Handle mobile menu toggle
    if (selectors.menuToggleButton) {
        selectors.menuToggleButton.addEventListener('click', () => {
            toggleMenu();
            // Close dropdown menu if open
            if (selectors.userDropdownMenu && selectors.userDropdownMenu.classList.contains('show')) {
                selectors.userDropdownMenu.classList.remove('show');
            }
        });
    }

    // Handle clicks outside menu/dropdown to close them
    document.addEventListener('click', (event) => {
        const clickedInsideMenu = selectors.mainNav.contains(event.target) || selectors.menuToggleButton.contains(event.target);
        if (selectors.mainNav.classList.contains('show') && !clickedInsideMenu) {
            selectors.mainNav.classList.remove('show');
        }
    });

    // Dummy function call to simulate user login state
    manageUserLoginState(false); // Change to 'true' to simulate a logged-in user
});

// A dummy logout function for demonstration
function handleLogout() {
    // Replace with actual logout logic (e.g., clearing session/token)
    console.log('User logged out.');
    manageUserLoginState(false);
}
