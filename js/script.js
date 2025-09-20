// A single object to manage all global selectors
const selectors = {
    body: document.body,
    mainHeader: document.querySelector('.main-header'),
    mainNav: document.querySelector('.main-nav'),
    themeToggleButton: document.getElementById('theme-toggle-button'),
    menuToggleButton: document.querySelector('.menu-toggle-button'),
    loginModal: document.getElementById('login-modal'),
    signupModal: document.getElementById('signup-modal'),
    loginModalToggle: document.getElementById('login-modal-toggle'),
    signupModalToggle: document.getElementById('signup-modal-toggle'),
    userDropdownToggle: document.getElementById('user-dropdown-toggle'),
    userDropdownMenu: document.getElementById('user-dropdown-menu'),
    allModals: document.querySelectorAll('.modal'),
    modalCloseButtons: document.querySelectorAll('[data-dismiss="modal"]'),
    authButtonsContainer: document.getElementById('auth-buttons-container'),
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
    if (typeof particlesJS !== 'undefined') {
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
    if (selectors.userDropdownMenu && selectors.userDropdownMenu.classList.contains('show')) {
        selectors.userDropdownMenu.classList.remove('show');
    }
}

// Function to highlight the active page in the navigation menu
function setActiveLink() {
    const currentPath = window.location.pathname.split('/').pop();
    const allLinks = document.querySelectorAll('.main-nav a, #auth-buttons-container a');

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
        const theme = localStorage.getItem('theme') || 'light';
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

// Function to show a modal
function showModal(modalElement) {
    if (modalElement) {
        modalElement.style.display = 'block';
        setTimeout(() => modalElement.classList.add('show'), 10);
    }
}

// Function to hide all modals
function hideAllModals() {
    selectors.allModals.forEach(modal => {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    });
}

// Function to toggle the user dropdown menu
function toggleUserDropdown() {
    if (selectors.userDropdownMenu) {
        selectors.userDropdownMenu.classList.toggle('show');
        if (selectors.mainNav && selectors.mainNav.classList.contains('show')) {
            selectors.mainNav.classList.remove('show');
        }
    }
}

// Function to manage user login state (simulated)
function manageUserLoginState(isLoggedIn) {
    const userLoggedIn = document.getElementById('user-logged-in');
    const userLoggedOut = document.getElementById('user-logged-out');

    if (userLoggedIn && userLoggedOut) {
        if (isLoggedIn) {
            userLoggedIn.style.display = 'flex';
            userLoggedOut.style.display = 'none';
        } else {
            userLoggedIn.style.display = 'none';
            userLoggedOut.style.display = 'flex';
        }
    }
}

// Event listeners for page load and interactions
document.addEventListener('DOMContentLoaded', () => {
    // Hide splash screen after a short delay
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            setTimeout(() => splashScreen.remove(), 500);
        }, 1500); // 1.5 seconds delay
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
        handleHeaderScroll(); // Call once on load
    }

    // Handle theme toggle
    if (selectors.themeToggleButton) {
        selectors.themeToggleButton.addEventListener('click', toggleTheme);
    }

    // Handle mobile menu toggle
    if (selectors.menuToggleButton) {
        selectors.menuToggleButton.addEventListener('click', toggleMenu);
    }

    // Handle modal toggles
    if (selectors.loginModalToggle) {
        selectors.loginModalToggle.addEventListener('click', () => showModal(selectors.loginModal));
    }
    if (selectors.signupModalToggle) {
        selectors.signupModalToggle.addEventListener('click', () => showModal(selectors.signupModal));
    }
    selectors.modalCloseButtons.forEach(button => {
        button.addEventListener('click', hideAllModals);
    });

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            hideAllModals();
        }
    });

    // Handle user dropdown toggle
    if (selectors.userDropdownToggle) {
        selectors.userDropdownToggle.addEventListener('click', toggleUserDropdown);
    }
    
    // Close dropdown when clicking outside
    window.addEventListener('click', (event) => {
        if (!event.target.matches('#user-dropdown-toggle') && !event.target.closest('#user-dropdown-toggle')) {
            if (selectors.userDropdownMenu && selectors.userDropdownMenu.classList.contains('show')) {
                selectors.userDropdownMenu.classList.remove('show');
            }
        }
    });

    // Dummy function call to simulate user login state
    // Replace this with actual backend logic
    manageUserLoginState(false); // Change to 'true' to simulate a logged-in user
});
