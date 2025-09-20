// js/login.js

import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
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

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const googleLoginButton = document.getElementById('google-login-button');
    const authMessage = document.getElementById('auth-message');

    // Function to display messages
    const updateMessage = (message, isSuccess) => {
        authMessage.textContent = message;
        authMessage.style.color = isSuccess ? '#00c6a7' : '#ff4d4f';
    };

    // Email/Password login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            
            updateMessage('جاري تسجيل الدخول...', false);

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                updateMessage('تم تسجيل الدخول بنجاح!', true);
                console.log("Logged in user:", user);
                window.location.href = 'dashboard.html';
            } catch (error) {
                let errorMessage = "فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.";
                if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                    errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
                } else if (error.code === 'auth/too-many-requests') {
                    errorMessage = "تم حظر هذا الحساب مؤقتًا بسبب كثرة محاولات تسجيل الدخول الفاشلة. حاول مرة أخرى لاحقًا.";
                }
                updateMessage(errorMessage, false);
                console.error("Login error:", error);
            }
        });
    }

    // Google login
    if (googleLoginButton) {
        googleLoginButton.addEventListener('click', async () => {
            const provider = new GoogleAuthProvider();
            updateMessage('جاري تسجيل الدخول باستخدام جوجل...', false);

            try {
                const userCredential = await signInWithPopup(auth, provider);
                const user = userCredential.user;
                
                // Check if user already exists in Firestore
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    // Create new user document in Firestore for Google sign-in
                    await setDoc(userDocRef, {
                        email: user.email,
                        username: user.displayName || user.email.split('@')[0],
                        photoURL: user.photoURL,
                        createdAt: new Date()
                    }, { merge: true });
                }

                updateMessage('تم تسجيل الدخول بنجاح!', true);
                console.log("Google signed in user:", user);
                window.location.href = 'dashboard.html';
            } catch (error) {
                let errorMessage = "فشل تسجيل الدخول باستخدام جوجل.";
                if (error.code === 'auth/popup-closed-by-user') {
                    errorMessage = 'تم إغلاق نافذة تسجيل الدخول.';
                }
                updateMessage(errorMessage, false);
                console.error("Google login error:", error);
            }
        });
    }
});
