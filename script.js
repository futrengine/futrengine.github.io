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



// Sign in and sign up functionality
const signInForm = document.getElementById('signin-form');
const signUpForm = document.getElementById('signup-form');
const signInError = document.getElementById('signin-error');
const signUpError = document.getElementById('signup-error');

// Common form handling function for sign-in and sign-up
async function handleFormSubmit(form, errorElement, isSignUp) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username ||!password) {
      errorElement.innerHTML = 'Please enter a username and password.';
      return;
    }

    if (isSignUp) {
      const email = document.getElementById('email').value;
      const newUser = { username, password, email };
      users.push(newUser);
      await saveUsers();
      console.log('Signed up successfully!');
    } else {
      const user = users.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        console.log('Signed in successfully!');
        // TO DO: Implement authentication and authorization
        window.location.href = 'index.html';
      } else {
        errorElement.innerHTML = 'Invalid username or password';
      }
    }
  });
}

// Initialize sign-in and sign-up functionality
handleFormSubmit(signInForm, signInError, false);
handleFormSubmit(signUpForm, signUpError, true);

// Load users when the script is loaded
loadUsers();

// Toggle sign-in and sign-up popups
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

// Display blog posts on home page
const postList = document.getElementById('post-list');
const posts = JSON.parse(localStorage.getItem('posts')) || [];

posts.forEach((post) => {
  const postListItem = document.createElement('li');
  postListItem.textContent = post.title;
  postListItem.dataset.postContent = post.content;
  postList.appendChild(postListItem);
});

postList.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const postContent = e.target.dataset.postContent;
    alert(postContent); // Display full post content in an alert box
  }
});

// New post functionality
document.getElementById('new-post-btn').addEventListener('click', () => {
  window.location.href = 'newpost.html';
});

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

// Sign up functionality
const signUpForm = document.getElementById('signup-form');
const signUpError = document.getElementById('signup-error');

// Handle sign-up form submission
async function handleSignUpSubmit() {
  signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
      signUpError.innerHTML = 'Please enter a username, email, and password.';
      return;
    }

    const newUser = { username, email, password };
    users.push(newUser);
    await saveUsers();
    console.log('Signed up successfully!');
    window.location.href = 'index.html';
  });
}

// Initialize sign-up functionality
handleSignUpSubmit();

// Load users when the script is loaded
loadUsers();
