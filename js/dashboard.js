// js/dashboard.js

import { getAuth, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
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

// Cloudinary configuration - استبدل القيم الخاصة بك هنا
const CLOUDINARY_CLOUD_NAME = 'dtkp2a1cp';
const CLOUDINARY_UPLOAD_PRESET = 'MT SIGNALS';

document.addEventListener('DOMContentLoaded', () => {
    const userInfoEl = document.getElementById('user-info');
    const profileImageEl = document.getElementById('profile-avatar');
    const passwordChangeForm = document.getElementById('password-change-form');
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');
    const passwordMessageEl = document.getElementById('password-message');
    const avatarUploadInput = document.getElementById('avatar-upload');
    const avatarMessageEl = document.getElementById('avatar-message');
    const subscriptionStatusEl = document.getElementById('subscription-status');
    const usernameChangeForm = document.getElementById('username-change-form');
    const newUsernameInput = document.getElementById('new-username');
    const usernameMessageEl = document.getElementById('username-message');

    // دالة لتحديث رسائل الحالة
    const updateStatusMessage = (element, message, isSuccess) => {
        if (element) {
            element.textContent = message;
            element.style.color = isSuccess ? '#00c6a7' : '#ff4d4f';
        }
    };

    // دالة لرفع الصورة إلى Cloudinary
    async function uploadImageToCloudinary(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('فشل رفع الصورة إلى Cloudinary.');
        }

        const data = await response.json();
        return data.secure_url;
    }

    // Check auth state and fetch user data from Firestore
    onAuthStateChanged(auth, async (user) => {
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

            // Fetch and display user's subscription status from Firestore
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.subscription) {
                        subscriptionStatusEl.textContent = `لديك اشتراك حالي: ${userData.subscription}`;
                        subscriptionStatusEl.style.color = '#00c6a7';
                    } else {
                        subscriptionStatusEl.textContent = 'لا يوجد لديك اشتراك حالي.';
                        subscriptionStatusEl.style.color = '#ff4d4f';
                    }
                }
            } catch (error) {
                console.error('Error fetching subscription status:', error);
                subscriptionStatusEl.textContent = 'فشل في تحميل حالة الاشتراك.';
                subscriptionStatusEl.style.color = '#ff4d4f';
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
                updateStatusMessage(passwordMessageEl, 'كلمة المرور الجديدة وتأكيدها غير متطابقين.', false);
                return;
            }

            updateStatusMessage(passwordMessageEl, 'جاري المعالجة...', false);

            if (user) {
                try {
                    const credential = EmailAuthProvider.credential(user.email, currentPassword);
                    await reauthenticateWithCredential(user, credential);
                    await updatePassword(user, newPassword);
                    updateStatusMessage(passwordMessageEl, 'تم تغيير كلمة المرور بنجاح. قد تحتاج إلى تسجيل الدخول مرة أخرى.', true);
                } catch (error) {
                    let errorMessage = 'فشل تغيير كلمة المرور. يرجى التأكد من كلمة المرور الحالية.';
                    if (error.code === 'auth/wrong-password') {
                        errorMessage = 'كلمة المرور الحالية غير صحيحة.';
                    } else if (error.code === 'auth/requires-recent-login') {
                        errorMessage = 'لأسباب أمنية، يرجى تسجيل الخروج ثم الدخول مرة أخرى لإجراء هذا التغيير.';
                    } else if (error.code === 'auth/weak-password') {
                        errorMessage = 'كلمة المرور الجديدة ضعيفة جداً.';
                    }
                    updateStatusMessage(passwordMessageEl, errorMessage, false);
                }
            }
        });
    }

    // Handle avatar upload
    if (avatarUploadInput) {
        avatarUploadInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            updateStatusMessage(avatarMessageEl, 'جاري رفع الصورة...', false);

            try {
                const imageUrl = await uploadImageToCloudinary(file);
                
                // تحديث رابط الصورة في Firebase Auth
                await updateProfile(auth.currentUser, { photoURL: imageUrl });
                
                // تحديث رابط الصورة في Firestore
                const userRef = doc(db, 'users', auth.currentUser.uid);
                await updateDoc(userRef, { photoURL: imageUrl });
                
                // تحديث واجهة المستخدم
                document.getElementById('profile-avatar').src = imageUrl;
                updateStatusMessage(avatarMessageEl, 'تم تحديث الصورة بنجاح!', true);

            } catch (error) {
                console.error('حدث خطأ في عملية رفع أو تحديث الصورة:', error);
                updateStatusMessage(avatarMessageEl, 'فشل تحديث الصورة. حاول مرة أخرى.', false);
            }
        });
    }

    // Handle username change form submission
    if (usernameChangeForm) {
        usernameChangeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newUsername = newUsernameInput.value;
            const user = auth.currentUser;

            if (!newUsername || newUsername.trim() === '') {
                updateStatusMessage(usernameMessageEl, 'اسم المستخدم لا يمكن أن يكون فارغًا.', false);
                return;
            }

            updateStatusMessage(usernameMessageEl, 'جاري تحديث اسم المستخدم...', false);

            if (user) {
                try {
                    // تحديث اسم المستخدم في Firebase Auth
                    await updateProfile(user, { displayName: newUsername });
                    
                    // تحديث اسم المستخدم في Firestore
                    const userRef = doc(db, 'users', user.uid);
                    await updateDoc(userRef, { username: newUsername });

                    // تحديث واجهة المستخدم
                    document.getElementById('user-info').querySelector('p:last-of-type').innerHTML = `<strong>اسم المستخدم:</strong> ${newUsername}`;
                    
                    updateStatusMessage(usernameMessageEl, 'تم تحديث اسم المستخدم بنجاح!', true);
                } catch (error) {
                    console.error('حدث خطأ في تحديث اسم المستخدم:', error);
                    updateStatusMessage(usernameMessageEl, 'فشل تحديث اسم المستخدم. حاول مرة أخرى.', false);
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
