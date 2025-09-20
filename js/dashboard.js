// js/dashboard.js

import { getAuth, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

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
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', () => {
    const userInfoEl = document.getElementById('user-info');
    const profileImageEl = document.getElementById('profile-image');
    const passwordChangeForm = document.getElementById('password-change-form');
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');
    const passwordMessageEl = document.getElementById('password-message');
    const avatarForm = document.getElementById('avatar-form');
    const avatarUploadInput = document.getElementById('avatar-upload');
    const avatarMessageEl = document.getElementById('avatar-message');

    // Check auth state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, display user info
            const username = user.displayName || user.email;
            userInfoEl.innerHTML = `
                <p><strong>البريد الإلكتروني:</strong> ${user.email}</p>
                <p><strong>اسم المستخدم:</strong> ${username.split('@')[0]}</p>
            `;
            // Display user profile picture
            if (user.photoURL) {
                profileImageEl.src = user.photoURL;
            } else {
                profileImageEl.src = 'https://via.placeholder.com/150'; // Default image
            }
        } else {
            // No user is signed in, redirect to login
            window.location.href = 'login.html';
        }
    });

    // Handle password change form submission
    if (passwordChangeForm) {
        passwordChangeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentPassword = currentPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const confirmNewPassword = confirmNewPasswordInput.value;
            const user = auth.currentUser;

            if (newPassword !== confirmNewPassword) {
                passwordMessageEl.textContent = 'كلمة المرور الجديدة وتأكيدها غير متطابقين.';
                passwordMessageEl.style.color = '#ff4d4f';
                return;
            }

            passwordMessageEl.textContent = 'جاري المعالجة...';
            passwordMessageEl.style.color = '#fff';

            if (user) {
                try {
                    const credential = EmailAuthProvider.credential(user.email, currentPassword);
                    await reauthenticateWithCredential(user, credential);
                    await updatePassword(user, newPassword);
                    passwordMessageEl.textContent = 'تم تغيير كلمة المرور بنجاح. قد تحتاج إلى تسجيل الدخول مرة أخرى.';
                    passwordMessageEl.style.color = '#00c6a7';
                } catch (error) {
                    let errorMessage = 'فشل تغيير كلمة المرور. يرجى التأكد من كلمة المرور الحالية.';
                    if (error.code === 'auth/wrong-password') {
                        errorMessage = 'كلمة المرور الحالية غير صحيحة.';
                    } else if (error.code === 'auth/requires-recent-login') {
                        errorMessage = 'لأسباب أمنية، يرجى تسجيل الخروج ثم الدخول مرة أخرى لإجراء هذا التغيير.';
                    } else if (error.code === 'auth/weak-password') {
                        errorMessage = 'كلمة المرور الجديدة ضعيفة جداً.';
                    }
                    passwordMessageEl.textContent = errorMessage;
                    passwordMessageEl.style.color = '#ff4d4f';
                }
            }
        });
    }

    // Handle avatar upload form submission
    if (avatarForm) {
        avatarForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const file = avatarUploadInput.files[0];
            const user = auth.currentUser;

            if (!file) {
                avatarMessageEl.textContent = 'الرجاء اختيار صورة أولاً.';
                avatarMessageEl.style.color = '#ff4d4f';
                return;
            }

            avatarMessageEl.textContent = 'جاري رفع الصورة...';
            avatarMessageEl.style.color = '#fff';

            if (user) {
                try {
                    const storageRef = ref(storage, `users/${user.uid}/profile_picture`);
                    await uploadBytes(storageRef, file);
                    const photoURL = await getDownloadURL(storageRef);
                    await updateProfile(user, { photoURL: photoURL });
                    profileImageEl.src = photoURL;
                    avatarMessageEl.textContent = 'تم تغيير صورة الملف الشخصي بنجاح.';
                    avatarMessageEl.style.color = '#00c6a7';
                } catch (error) {
                    avatarMessageEl.textContent = 'فشل في رفع الصورة. يرجى المحاولة مرة أخرى.';
                    avatarMessageEl.style.color = '#ff4d4f';
                    console.error('Error uploading avatar:', error);
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
