import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// تهيئة Firebase
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

const authButtonsContainer = document.getElementById('auth-buttons-container');
const authLinks = document.getElementById('auth-links');

// دالة تسجيل الخروج
const handleLogout = async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Error signing out: ", error);
    }
};

// دالة لعرض واجهة المستخدم للمستخدم المسجل دخوله
const renderUserUI = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    const photoURL = userData.photoURL || user.photoURL || 'https://via.placeholder.com/40';
    const displayName = userData.displayName || user.email.split('@')[0];

    authButtonsContainer.innerHTML = `
        <a href="dashboard.html" class="header-profile-link" title="${displayName}">
            <img id="header-profile-pic" class="header-profile-pic" src="${photoURL}" alt="صورة الملف الشخصي">
        </a>
        <button id="logout-button" class="button button-secondary">تسجيل الخروج</button>
    `;

    document.getElementById('logout-button').addEventListener('click', handleLogout);
};

// دالة لعرض واجهة المستخدم للمستخدم غير المسجل
const renderGuestUI = () => {
    authButtonsContainer.innerHTML = `
        <a href="login.html" class="button button-primary">الدخول</a>
        <a href="signup.html" class="button button-secondary">التسجيل</a>
    `;
};

// مراقبة حالة المصادقة
onAuthStateChanged(auth, (user) => {
    if (user) {
        // المستخدم مسجل دخوله
        renderUserUI(user);
    } else {
        // المستخدم غير مسجل دخوله
        renderGuestUI();
    }
});

// دالة للتحكم بالشاشة المؤقتة (splash screen)
const handleSplashScreen = () => {
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
        }, 5000); // 5 ثواني
    }
};

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', handleSplashScreen);
