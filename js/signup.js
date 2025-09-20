import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signupForm = document.getElementById('signup-form');
const googleSignupBtn = document.getElementById('google-signup');
const messageElement = document.getElementById('signup-message');

// Function to save user data to Firestore
async function saveUserData(user, username) {
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
        email: user.email,
        username: username,
        createdAt: new Date()
    });
}

// Function to handle email/password signup
async function handleSignup(e) {
    e.preventDefault();
    const username = signupForm['username'].value.trim();
    const email = signupForm['email'].value.trim();
    const password = signupForm['password'].value.trim();

    if (!username || !email || !password) {
        messageElement.textContent = 'الرجاء تعبئة جميع الحقول.';
        return;
    }

    messageElement.textContent = 'جاري إنشاء الحساب...';
    messageElement.style.color = '#007BFF';

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Set the display name and a default photo URL
        await updateProfile(user, {
            displayName: username,
            photoURL: "images/default-avatar.png" // المسار الجديد للصورة الافتراضية
        });

        // Save user data to Firestore
        await saveUserData(user, username);
        
        messageElement.textContent = 'تم إنشاء الحساب بنجاح! سيتم تحويلك إلى لوحة التحكم.';
        messageElement.style.color = '#00c6a7';
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);

    } catch (error) {
        console.error("Signup failed:", error);
        let errorMessage = 'فشل إنشاء الحساب. حاول مرة أخرى.';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'هذا البريد الإلكتروني مستخدم بالفعل.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'كلمة المرور ضعيفة جداً. يجب أن تتكون من 6 أحرف على الأقل.';
        }
        messageElement.textContent = errorMessage;
        messageElement.style.color = '#ff4d4f';
    }
}

// Function to handle Google signup
async function handleGoogleSignup() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user is new or existing
        if (result._tokenResponse.isNewUser) {
            // New user, save data to Firestore
            await saveUserData(user, user.displayName || user.email.split('@')[0]);
        }

        window.location.href = "index.html";

    } catch (error) {
        console.error("Google signup failed:", error);
        messageElement.textContent = 'فشل تسجيل الدخول باستخدام جوجل. حاول مرة أخرى.';
        messageElement.style.color = '#ff4d4f';
    }
}

// Event listeners
if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
}

if (googleSignupBtn) {
    googleSignupBtn.addEventListener('click', handleGoogleSignup);
}
