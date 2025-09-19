// js/dashboard.js

import { getAuth, onAuthStateChanged, updatePassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
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

document.addEventListener('DOMContentLoaded', () => {
    const userInfoEl = document.getElementById('user-info');
    const passwordChangeForm = document.getElementById('password-change-form');
    const newPasswordInput = document.getElementById('new-password');
    const passwordMessageEl = document.getElementById('password-message');

    // Check auth state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, display user info
            const username = user.displayName || user.email;
            userInfoEl.innerHTML = `
                <p><strong>البريد الإلكتروني:</strong> ${user.email}</p>
                <p><strong>اسم المستخدم:</strong> ${username.split('@')[0]}</p>
            `;
        } else {
            // No user is signed in, redirect to login
            window.location.href = 'login.html';
        }
    });

    // Handle password change form submission
    if (passwordChangeForm) {
        passwordChangeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPassword = newPasswordInput.value;
            const user = auth.currentUser;
            
            passwordMessageEl.textContent = 'جاري المعالجة...';
            passwordMessageEl.style.color = '#fff';

            if (user) {
                try {
                    await updatePassword(user, newPassword);
                    passwordMessageEl.textContent = 'تم تغيير كلمة المرور بنجاح. قد تحتاج إلى تسجيل الدخول مرة أخرى.';
                    passwordMessageEl.style.color = '#00c6a7';
                } catch (error) {
                    let errorMessage = 'فشل تغيير كلمة المرور. يرجى تسجيل الدخول مرة أخرى.';
                    if (error.code === 'auth/requires-recent-login') {
                        errorMessage = 'لأسباب أمنية، يرجى تسجيل الخروج ثم الدخول مرة أخرى لإجراء هذا التغيير.';
                    }
                    passwordMessageEl.textContent = errorMessage;
                    passwordMessageEl.style.color = '#ff4d4f';
                }
            }
        });
    }
    
    // Initialize AOS animations
    AOS.init({
        duration: 1000,
        once: true,
    });
});
