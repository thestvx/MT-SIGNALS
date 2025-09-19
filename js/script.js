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

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Function to initialize Particles.js
function initializeParticles() {
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

// Function to handle Firebase authentication
function handleAuth() {
    // Firebase initialization is already in the HTML file
    const auth = firebase.auth();
    const db = firebase.firestore();

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const googleLoginButton = document.getElementById('google-login');
    const googleSignupButton = document.getElementById('google-signup');
    const errorMessage = document.getElementById('error-message');

    // Login with Email and Password
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            errorMessage.textContent = '';

            try {
                await auth.signInWithEmailAndPassword(email, password);
                window.location.href = 'index.html';
            } catch (error) {
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    errorMessage.textContent = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
                } else {
                    errorMessage.textContent = 'حدث خطأ في تسجيل الدخول. يرجى المحاولة لاحقًا.';
                    console.error('Login Error:', error);
                }
            }
        });
    }

    // Signup with Email and Password
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            errorMessage.textContent = '';

            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                await db.collection('users').doc(user.uid).set({
                    username: username,
                    email: email,
                    created_at: firebase.firestore.FieldValue.serverTimestamp()
                });

                window.location.href = 'index.html';
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage.textContent = 'هذا البريد الإلكتروني مستخدم بالفعل.';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage.textContent = 'كلمة المرور ضعيفة جدًا، يجب أن تكون 6 أحرف على الأقل.';
                } else {
                    errorMessage.textContent = 'حدث خطأ في إنشاء الحساب. يرجى المحاولة لاحقًا.';
                    console.error('Signup Error:', error);
                }
            }
        });
    }

    // Google Login/Signup
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const handleGoogleAuth = async (button) => {
        if (button) {
            button.addEventListener('click', async () => {
                errorMessage.textContent = '';
                try {
                    const result = await auth.signInWithPopup(googleProvider);
                    const user = result.user;

                    // Check if user document already exists
                    const userDoc = await db.collection('users').doc(user.uid).get();
                    if (!userDoc.exists) {
                        await db.collection('users').doc(user.uid).set({
                            username: user.displayName,
                            email: user.email,
                            created_at: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    }

                    window.location.href = 'index.html';
                } catch (error) {
                    console.error('Google Auth Error:', error);
                    errorMessage.textContent = 'فشل التسجيل باستخدام جوجل. يرجى المحاولة مرة أخرى.';
                }
            });
        }
    };

    handleGoogleAuth(googleLoginButton);
    handleGoogleAuth(googleSignupButton);
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
    AOS.init({
        duration: 1000,
        once: true,
    });

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

    // Handle Firebase auth
    handleAuth();
});
