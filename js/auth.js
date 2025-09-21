// Firebase configuration - Using your provided data
const firebaseConfig = {
  apiKey: "AIzaSyBV2kUxnxoqnE1wBEZKhNwkKYaAL14R1QY",
  authDomain: "mt-siganls.firebaseapp.com",
  projectId: "mt-siganls",
  storageBucket: "mt-siganls.firebasestorage.app",
  -  messagingSenderId: "84758913270",
  appId: "1:84758913270:web:c22d6aebcdf4f897f80cd7"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth();

// Check if a user is logged in
function checkLoginStatus() {
    auth.onAuthStateChanged((user) => {
        const authButtons = document.getElementById("auth-buttons");
        const userProfileActions = document.getElementById("user-profile-actions");
        const userNameHeader = document.getElementById("user-name-header");
        const userAvatarHeader = document.getElementById("user-avatar-header");
        const dashboardPage = document.body.classList.contains('dashboard-page');

        if (user) {
            // User is signed in.
            if (authButtons) authButtons.classList.add("hidden");
            if (userProfileActions) userProfileActions.classList.remove("hidden");
            if (userNameHeader) userNameHeader.textContent = user.displayName || user.email;
            if (userAvatarHeader) userAvatarHeader.src = user.photoURL || "images/default-avatar.jpg";
            
            // Populate dashboard with user data
            if (dashboardPage) {
                const userNameDashboard = document.getElementById("user-name-dashboard");
                const userEmailDashboard = document.getElementById("user-email-dashboard");
                const userIdDashboard = document.getElementById("user-id-dashboard");

                if (userNameDashboard) userNameDashboard.textContent = user.displayName || user.email;
                if (userEmailDashboard) userEmailDashboard.textContent = user.email;
                if (userIdDashboard) userIdDashboard.textContent = `UID: ${user.uid}`;
            }

            // Redirect if not on dashboard page
            if (!dashboardPage && window.location.pathname.endsWith("login.html")) {
                window.location.href = "dashboard.html";
            }

        } else {
            // User is signed out.
            if (authButtons) authButtons.classList.remove("hidden");
            if (userProfileActions) userProfileActions.classList.add("hidden");
            // Redirect to login page if on a protected page
            if (dashboardPage) {
                window.location.href = "login.html";
            }
        }
    });
}

// Function to handle login
function handleLogin(email, password) {
    const errorMessage = document.getElementById("error-message");
    if (errorMessage) errorMessage.classList.add("hidden");

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in successfully
            const user = userCredential.user;
            console.log("تم تسجيل الدخول بنجاح:", user.email);
            window.location.href = "dashboard.html"; // Redirect to dashboard
        })
        .catch((error) => {
            // Handle errors
            let message = "حدث خطأ غير متوقع. حاول مرة أخرى.";
            switch (error.code) {
                case "auth/invalid-email":
                case "auth/user-not-found":
                case "auth/wrong-password":
                    message = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
                    break;
                case "auth/user-disabled":
                    message = "تم تعطيل حسابك.";
                    break;
            }
            if (errorMessage) {
                errorMessage.textContent = message;
                errorMessage.classList.remove("hidden");
            }
            console.error("خطأ في تسجيل الدخول:", error.code, error.message);
        });
}

// Function to handle logout
function handleLogout() {
    auth.signOut().then(() => {
        console.log("تم تسجيل الخروج بنجاح.");
        window.location.href = "index.html"; // Redirect to home page
    }).catch((error) => {
        console.error("خطأ في تسجيل الخروج:", error.message);
    });
}

// Event Listeners for login and logout
document.addEventListener("DOMContentLoaded", () => {
    checkLoginStatus();

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            handleLogin(email, password);
        });
    }

    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", handleLogout);
    }
});
