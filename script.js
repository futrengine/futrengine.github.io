// Global variables
let users = [];

// Load users from file
function loadUsers() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'users.txt', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            users = JSON.parse(xhr.responseText);
        }
    };
    xhr.send();
}

// Sign in functionality
document.getElementById('signin-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if user exists
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        // Sign in successful
        document.getElementById('signin-error').innerHTML = '';
        // Redirect to home page or any other page
        window.location.href = 'index.html';
    } else {
        // Sign in failed
        document.getElementById('signin-error').innerHTML = 'User not found or incorrect password. Please sign up or try again.';
    }
});

// Load users from file when the page loads
loadUsers();


// Save users to file
function saveUsers() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'users.txt', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(users));
}

// Sign up functionality
document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    // Check if all fields are filled
    if (username && password && email) {
        const user = { username, password, email };
        users.push(user);
        saveUsers();

        // Show sign up success message and redirect to sign in page
        document.getElementById('signup-error').innerHTML = 'Sign up successful! Please sign in.';
        setTimeout(() => {
            window.location.href = 'signin.html';
        }, 2000); // redirect after 2 seconds
    } else {
        document.getElementById('signup-error').innerHTML = 'Please fill all fields.';
    }
});


document.getElementById('home-link').addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.getElementById('signup-link').addEventListener('click', () => {
    window.location.href = 'signup.html';
});

document.getElementById('signin-link').addEventListener('click', () => {
    window.location.href = 'signin.html';
});


