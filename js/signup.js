// js/signup.js

import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
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
    const signupForm = document.getElementById('signup-form');
    const googleSignupButton = document.getElementById('google-signup-button');
    const authMessage = document.getElementById('auth-message');

    // Function to display messages
    const updateMessage = (message, isSuccess) => {
        authMessage.textContent = message;
        authMessage.style.color = isSuccess ? '#00c6a7' : '#ff4d4f';
    };

    // Email/Password signup
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = signupForm.email.value;
            const password = signupForm.password.value;
            const confirmPassword = signupForm['confirm-password'].value;

            if (password !== confirmPassword) {
                updateMessage('كلمة المرور وتأكيدها غير متطابقين.', false);
                return;
            }

            updateMessage('جاري إنشاء الحساب...', false);

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Create a user document in Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    email: user.email,
                    username: user.email.split('@')[0],
                    createdAt: new Date()
                });

                updateMessage('تم إنشاء الحساب بنجاح! جاري التوجيه...', true);
                console.log("User signed up:", user);
                window.location.href = 'dashboard.html';
            } catch (error) {
                let errorMessage = "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.";
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = "البريد الإلكتروني مستخدم بالفعل. يرجى تسجيل الدخول.";
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = "البريد الإلكتروني غير صالح.";
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = "كلمة المرور ضعيفة جداً. يجب أن تتكون من 6 أحرف على الأقل.";
                }
                updateMessage(errorMessage, false);
                console.error("Signup error:", error);
            }
        });
    }

    // Google signup
    if (googleSignupButton) {
        googleSignupButton.addEventListener('click', async () => {
            const provider = new GoogleAuthProvider();
            updateMessage('جاري إنشاء حساب باستخدام جوجل...', false);

            try {
                const userCredential = await signInWithPopup(auth, provider);
                const user = userCredential.user;

                // Create a user document in Firestore for Google sign-up
                await setDoc(doc(db, 'users', user.uid), {
                    email: user.email,
                    username: user.displayName || user.email.split('@')[0],
                    photoURL: user.photoURL,
                    createdAt: new Date()
                }, { merge: true });
                
                updateMessage('تم إنشاء الحساب بنجاح! جاري التوجيه...', true);
                console.log("Google signed up user:", user);
                window.location.href = 'dashboard.html';
            } catch (error) {
                let errorMessage = "فشل إنشاء الحساب باستخدام جوجل.";
                if (error.code === 'auth/popup-closed-by-user') {
                    errorMessage = 'تم إغلاق نافذة التسجيل.';
                } else if (error.code === 'auth/credential-already-in-use') {
                    errorMessage = 'هذا الحساب مرتبط بالفعل بحساب آخر.';
                }
                updateMessage(errorMessage, false);
                console.error("Google signup error:", error);
            }
        });
    }
});
