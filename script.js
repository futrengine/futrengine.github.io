// script.js
const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const country = document.getElementById('country').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    // Store data in local storage (for demonstration purposes)
    const userData = {
        name,
        email,
        phone,
        country,
        password,
    };
    localStorage.setItem('user', JSON.stringify(userData));

    alert('Sign-up successful! You can now proceed to sign in.');
    // Redirect to sign-in page (create a separate HTML file for sign-in)
    window.location.href = 'signin.html';
});
