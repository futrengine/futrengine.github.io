// Global variables
let users = [];

// Load users from file
async function loadUsers() {
    try {
        const response = await fetch('users.txt');
        const userData = await response.json();
        users = userData;
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Save users to file
async function saveUsers() {
    try {
        const response = await fetch('users.txt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(users),
        });
        console.log('Users saved successfully!');
    } catch (error) {
        console.error('Error saving users:', error);
    }
}

// Sign in functionality
document.getElementById('signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // TO DO: Implement password hashing and salting
    const user = users.find((user) => user.username === username && user.password === password);
    if (user) {
        console.log('Signed in successfully!');
        // TO DO: Implement authentication and authorization
        window.location.href = 'index.html';
    } else {
        document.getElementById('signin-error').innerHTML = 'Invalid username or password';
    }
});

// Sign up functionality
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    // TO DO: Implement password hashing and salting
    const newUser = { username, password, email };
    users.push(newUser);
    await saveUsers();
    console.log('Signed up successfully!');
    // TO DO: Implement authentication and authorization
    window.location.href = 'index.html';
});

loadUsers();

// Toggle sign in and sign up popups
document.getElementById('signin-btn').addEventListener('click', () => {
    document.getElementById('signin-popup').classList.toggle('active');
});

document.getElementById('signup-btn').addEventListener('click', () => {
    document.getElementById('signup-popup').classList.toggle('active');
});

document.getElementById('signin-link').addEventListener('click', () => {
    document.getElementById('signin-popup').classList.toggle('active');
    document.getElementById('signup-popup').classList.remove('active');
});

document.getElementById('signup-link').addEventListener('click', () => {
    document.getElementById('signup-popup').classList.toggle('active');
    document.getElementById('signin-popup').classList.remove('active');
});



loadUsers();

document.getElementById('new-post-btn').addEventListener('click', () => {
    window.location.href = 'newpost.html';
});
                                                        
