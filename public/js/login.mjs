document.addEventListener('DOMContentLoaded', () => {
    // Alternar formularios login/registro
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (switchToRegister && switchToLogin) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.classList.add('is-hidden');
            registerForm.classList.remove('is-hidden');
        });

        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.classList.add('is-hidden');
            loginForm.classList.remove('is-hidden');
        });
    }

    // Mostrar/ocultar contraseña
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function () {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Validación de correo (mensaje debajo)
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');

    if (emailInput && emailError) {
        emailInput.addEventListener('blur', function () {
            const value = emailInput.value;
            const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            emailError.style.display = valid ? 'none' : 'block';
        });
    }

    // Validación de contraseña
    const passwordInput = document.getElementById('password');
    const passwordHelp = document.getElementById('passwordHelp');

    if (passwordInput) {
        passwordInput.addEventListener('blur', function () {
            const value = this.value;
            const valid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value);
            if (!valid && passwordHelp) {
                passwordHelp.style.color = 'red';
            } else if (passwordHelp) {
                passwordHelp.style.color = 'green';
            }
        });

        passwordInput.addEventListener('focus', () => {
            if (passwordHelp) passwordHelp.style.display = 'block';
        });

        passwordInput.addEventListener('blur', () => {
            if (passwordHelp) passwordHelp.style.display = 'none';
        });
    }
});
