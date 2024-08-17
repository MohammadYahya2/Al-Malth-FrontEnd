function register() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const message = document.getElementById('reg-message');

    // تعبير منتظم للتحقق من صحة البريد الإلكتروني
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (name === '' || email === '' || password === '') {
        message.textContent = 'Please fill in all fields';
        return;
    }

    if (!emailPattern.test(email)) {
        message.textContent = 'Please enter a valid email address';
        return;
    }

    if (localStorage.getItem(email)) {
        message.textContent = 'Email already exists';
    } else {
        const user = {
            name: name,
            password: password
        };
        localStorage.setItem(email, JSON.stringify(user));
        message.textContent = 'Registration successful';
        localStorage.setItem('currentUser', email); // حفظ البريد الإلكتروني للمستخدم الحالي
        window.location.href = 'main.html'; // إعادة التوجيه إلى الصفحة الرئيسية
    }
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const message = document.getElementById('login-message');

    if (email === '' || password === '') {
        message.textContent = 'Please fill in all fields';
        return;
    }

    const user = JSON.parse(localStorage.getItem(email));
    if (user && user.password === password) {
        localStorage.setItem('currentUser', email);
        window.location.href = 'main.html';
    } else {
        message.textContent = 'Invalid email or password';
    }
}

function toggleLogin() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        // Log out the user
        localStorage.removeItem('currentUser');
        document.getElementById('userDropdown').textContent = 'User';
        document.getElementById('loginLogoutLink').textContent = 'Login';
        alert('You have been logged out.');
        // No redirect needed, just update UI
    } else {
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(localStorage.getItem(currentUser));
        if (user) {
            document.getElementById('userDropdown').textContent = user.name;
            document.getElementById('loginLogoutLink').textContent = 'Logout';
        }
    } else {
        document.getElementById('userDropdown').textContent = 'User';
        document.getElementById('loginLogoutLink').textContent = 'Login';
    }
}
