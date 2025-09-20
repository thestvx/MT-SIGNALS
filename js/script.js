// A single object to manage all global selectors
const selectors = {
  body: document.body,
  mainHeader: document.querySelector('.main-header'),
  mainNav: document.querySelector('.main-nav'),
  splashScreen: document.getElementById('splash-screen'),
  themeToggleButton: document.getElementById('theme-toggle-button'),
  menuToggleButton: document.querySelector('.menu-toggle-button'),
};

// Function to toggle between dark and light themes
function toggleTheme() {
  const currentTheme = selectors.body.dataset.theme;
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  selectors.body.dataset.theme = newTheme;
  localStorage.setItem('theme', newTheme);
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
    // Check if the href matches the current path
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
    particlesJS('particles-js', {
      "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#ffffff" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": true },
        "size": { "value": 5, "random": true },
        "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
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

// Function to handle the splash screen
function handleSplashScreen() {
  if (selectors.splashScreen) {
    setTimeout(() => {
      selectors.splashScreen.classList.add('fade-out');
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
});
