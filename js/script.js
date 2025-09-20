import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, getDocs, where } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBV2kUxnxoqnE1wBEZKhNwkKYaAL14R1QY",
    authDomain: "mt-siganls.firebaseapp.com",
    projectId: "mt-siganls",
    storageBucket: "mt-siganls.firebasestorage.app",
    messagingSenderId: "84758913270",
    appId: "1:84758913270:web:c22d6aebcdf4f897f80cd7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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

let swiper;

// Function to fetch and display testimonials
async function fetchTestimonials() {
    const testimonialsContainer = document.getElementById('testimonials-container');
    if (!testimonialsContainer) return;

    try {
        const testimonialsQuery = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(testimonialsQuery);
        
        testimonialsContainer.innerHTML = ''; // Clear previous content

        if (querySnapshot.empty) {
            testimonialsContainer.innerHTML = `<p class="no-testimonials-message swiper-slide">كن أول من يضيف رأيه حول المنصة!</p>`;
        } else {
            querySnapshot.forEach((doc) => {
                const testimonial = doc.data();
                const testimonialCard = `
                    <div class="swiper-slide testimonial-slide">
                        <div class="card testimonial-card">
                            <div class="testimonial-header">
                                <img src="${testimonial.photoURL || 'https://via.placeholder.com/60'}" alt="${testimonial.username}" class="testimonial-avatar">
                                <h4>${testimonial.username}</h4>
                            </div>
                            <p class="testimonial-comment">${testimonial.comment}</p>
                        </div>
                    </div>
                `;
                testimonialsContainer.innerHTML += testimonialCard;
            });
        }
        
        // Initialize Swiper after content is loaded
        if (swiper) {
            swiper.destroy(true, true);
        }
        swiper = new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 50,
                },
            },
            centeredSlides: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
        });

    } catch (error) {
        console.error("Error fetching testimonials:", error);
        testimonialsContainer.innerHTML = `<p class="error-message swiper-slide">فشل في تحميل الآراء. يرجى المحاولة لاحقاً.</p>`;
    }
}

// Function to handle testimonial submission
async function handleTestimonialSubmission(e, user) {
    e.preventDefault();
    const form = e.target;
    const testimonialText = form['testimonial-text'].value.trim();
    const messageElement = document.getElementById('testimonial-message');

    if (!testimonialText) {
        messageElement.textContent = 'الرأي لا يمكن أن يكون فارغًا.';
        messageElement.style.color = '#ff4d4f';
        return;
    }
    
    messageElement.textContent = 'جاري إرسال الرأي...';
    messageElement.style.color = '#007BFF';

    try {
        // Check if user already has a testimonial
        const userTestimonialsQuery = query(collection(db, 'testimonials'), where('userId', '==', user.uid));
        const existingTestimonials = await getDocs(userTestimonialsQuery);
        
        if (!existingTestimonials.empty) {
            messageElement.textContent = 'لقد قمت بإضافة رأيك بالفعل. يمكنك إضافة رأي واحد فقط.';
            messageElement.style.color = '#ff4d4f';
            return;
        }

        await addDoc(collection(db, 'testimonials'), {
            userId: user.uid,
            username: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL || null,
            comment: testimonialText,
            createdAt: serverTimestamp()
        });
        
        messageElement.textContent = 'تم إضافة رأيك بنجاح!';
        messageElement.style.color = '#00c6a7';
        form.reset(); // Clear the form
        fetchTestimonials(); // Refresh the testimonials list
        // Hide the form after submission
        const addTestimonialContainer = document.getElementById('add-testimonial-form-container');
        addTestimonialContainer.classList.add('hidden');

    } catch (error) {
        console.error("Error adding testimonial:", error);
        messageElement.textContent = 'فشل في إضافة الرأي. حاول مرة أخرى.';
        messageElement.style.color = '#ff4d4f';
    }
}

// Check auth state and update UI accordingly
function updateTestimonialsUI(user) {
    const addTestimonialContainer = document.getElementById('add-testimonial-form-container');
    const addTestimonialForm = document.getElementById('add-testimonial-form');

    if (user) {
        // Check if user has already left a testimonial
        const userTestimonialsQuery = query(collection(db, 'testimonials'), where('userId', '==', user.uid));
        getDocs(userTestimonialsQuery).then(snapshot => {
            if (snapshot.empty) {
                // User has no testimonial, show the form
                if (addTestimonialContainer) {
                    addTestimonialContainer.classList.remove('hidden');
                }
                if (addTestimonialForm) {
                    addTestimonialForm.addEventListener('submit', (e) => handleTestimonialSubmission(e, user), { once: true });
                }
            } else {
                // User has a testimonial, hide the form
                if (addTestimonialContainer) {
                    addTestimonialContainer.classList.add('hidden');
                }
            }
        }).catch(error => {
            console.error("Error checking user testimonial:", error);
            // In case of error, still hide the form to be safe
            if (addTestimonialContainer) {
                addTestimonialContainer.classList.add('hidden');
            }
        });
    } else {
        // User is not logged in, hide the form
        if (addTestimonialContainer) {
            addTestimonialContainer.classList.add('hidden');
        }
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
    
    // Check auth state for testimonials section
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        onAuthStateChanged(auth, updateTestimonialsUI);

        // Always fetch and display testimonials on the home page
        fetchTestimonials();
    }
});
