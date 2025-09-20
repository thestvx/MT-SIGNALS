// js/header.js

// استيراد مكتبات Firebase اللازمة
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

// Your Firebase configuration - استخدم نفس الإعدادات الموجودة في ملفاتك الأخرى
const firebaseConfig = {
    apiKey: "AIzaSyBV2kUxnxoqnE1wBEZKhNwkKYaAL14R1QY",
    authDomain: "mt-siganls.firebaseapp.com",
    projectId: "mt-siganls",
    storageBucket: "mt-siganls.firebasestorage.app",
    messagingSenderId: "84758913270",
    appId: "1:84758913270:web:c22d6aebcdf4f897f80cd7"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    const authButtonsContainer = document.getElementById('auth-buttons-container');
    const mainNavUl = document.getElementById('main-nav-ul');
    const menuToggleBtn = document.querySelector('.menu-toggle-button');
    const mainNav = document.querySelector('.main-nav');
    const headerRight = document.querySelector('.header-right');

    // الدالة المسؤولة عن تحديث الشريط العلوي بناءً على حالة المصادقة
    onAuthStateChanged(auth, (user) => {
        // إزالة أي عناصر مستخدم سابقة لتجنب التكرار
        const existingUserProfileActions = document.querySelector('.user-profile-actions');
        if(existingUserProfileActions) {
            existingUserProfileActions.remove();
        }

        if (user) {
            // المستخدم مسجل الدخول
            // إخفاء أزرار الدخول والتسجيل
            if (authButtonsContainer) {
                authButtonsContainer.classList.add('hidden');
            }

            // إنشاء وعرض صورة المستخدم وزر لوحة التحكم وزر تسجيل الخروج
            const loggedInMarkup = `
                <div class="user-profile-actions">
                    <a href="dashboard.html" class="dashboard-link">
                        <img src="${user.photoURL || 'https://via.placeholder.com/40'}" alt="صورة الملف الشخصي" class="profile-avatar-small">
                        <span>لوحة التحكم</span>
                    </a>
                    <button id="logout-button" class="button button-danger">تسجيل الخروج</button>
                </div>
            `;
            
            if (headerRight) {
                // استخدام insertAdjacentHTML بدلاً من prepend لتحكم أفضل
                headerRight.insertAdjacentHTML('afterbegin', loggedInMarkup);
            }

            // إضافة مستمع لحدث زر تسجيل الخروج
            const logoutButton = document.getElementById('logout-button');
            if (logoutButton) {
                logoutButton.addEventListener('click', async () => {
                    try {
                        await signOut(auth);
                        window.location.href = 'index.html'; // إعادة التوجيه للصفحة الرئيسية بعد تسجيل الخروج
                    } catch (error) {
                        console.error("Error signing out: ", error);
                        alert("فشل تسجيل الخروج، يرجى المحاولة مرة أخرى.");
                    }
                });
            }

        } else {
            // المستخدم غير مسجل الدخول
            // عرض أزرار الدخول والتسجيل
            if (authButtonsContainer) {
                authButtonsContainer.classList.remove('hidden');
            }
        }
    });

    // تبديل قائمة التنقل للجوال
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', (event) => {
        const isClickInsideMenu = mainNav.contains(event.target) || menuToggleBtn.contains(event.target);
        if (!isClickInsideMenu && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
        }
    });

    // إغلاق القائمة عند تغيير حجم الشاشة
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            mainNav.classList.remove('active');
        }
    });
});
