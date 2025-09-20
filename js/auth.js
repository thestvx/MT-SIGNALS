// A simple "mock" user data for testing purposes
const MOCK_USER = {
    email: "test@example.com",
    password: "password123",
    name: "مستخدم تجريبي",
    id: "user_12345",
};

// Check if a user is logged in
function checkLoginStatus() {
    const user = localStorage.getItem("loggedInUser");
    const authButtons = document.getElementById("auth-buttons");
    const userProfileActions = document.getElementById("user-profile-actions");
    const userNameHeader = document.getElementById("user-name-header");
    const userAvatarHeader = document.getElementById("user-avatar-header");
    const dashboardPage = document.body.classList.contains('dashboard-page');

    if (user) {
        if (authButtons) authButtons.classList.add("hidden");
        if (userProfileActions) userProfileActions.classList.remove("hidden");
        const userData = JSON.parse(user);
        if (userNameHeader) userNameHeader.textContent = userData.name;
        if (userAvatarHeader) userAvatarHeader.src = userData.avatar || "images/default-avatar.jpg";
        
        // Populate dashboard with user data
        if (dashboardPage) {
            const userNameDashboard = document.getElementById("user-name-dashboard");
            const userEmailDashboard = document.getElementById("user-email-dashboard");
            const userIdDashboard = document.getElementById("user-id-dashboard");

            if (userNameDashboard) userNameDashboard.textContent = userData.name;
            if (userEmailDashboard) userEmailDashboard.textContent = userData.email;
            if (userIdDashboard) userIdDashboard.textContent = `ID: ${userData.id}`;
        }
    } else {
        if (authButtons) authButtons.classList.remove("hidden");
        if (userProfileActions) userProfileActions.classList.add("hidden");
        // Redirect to login page if on a protected page
        if (dashboardPage) {
            window.location.href = "login.html";
        }
    }
}

// Function to handle login
function handleLogin(email, password) {
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
        // Successful login
        const userToStore = {
            name: MOCK_USER.name,
            email: MOCK_USER.email,
            id: MOCK_USER.id,
            avatar: "images/default-avatar.jpg" // You can add a specific avatar URL here
        };
        localStorage.setItem("loggedInUser", JSON.stringify(userToStore));
        window.location.href = "dashboard.html"; // Redirect to the dashboard
    } else {
        // Failed login
        alert("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
    }
}

// Function to handle logout
function handleLogout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html"; // Redirect to the home page
}

// Event Listeners for login and logout
document.addEventListener("DOMContentLoaded", () => {
    checkLoginStatus();

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent the form from submitting and reloading the page

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
