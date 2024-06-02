document.addEventListener('DOMContentLoaded', function() {
    const signUpForm = document.getElementById('sign-up-form');
    const signInForm = document.getElementById('sign-in-form');
    const newPostForm = document.getElementById('new-post-form');
    const newPostLink = document.getElementById('new-post-link');
    const blogPostsSection = document.getElementById('blog-posts');
    const newPostSection = document.getElementById('new-post');
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Toggle new post section visibility
    newPostLink.addEventListener('click', function() {
        if (isUserLoggedIn()) {
            newPostSection.classList.add('active');
            blogPostsSection.classList.remove('active');
        } else {
            alert('You need to sign in to post a blog.');
        }
    });

    // Handle sign-up form submission
    if (signUpForm) {
        signUpForm.addEventListener('submit', function(e) {
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

            const newUser = { name, email, phone, country, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            alert('User signed up successfully!');
            signUpForm.reset();
            window.location.href = 'signin.html';
        });
    }

    // Handle sign-in form submission
    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const user = users.find(user => user.email === username && user.password === password);
            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                alert('User signed in successfully!');
                signInForm.reset();
                window.location.href = 'index.html';
            } else {
                alert('Invalid username or password.');
            }
        });
    }

    // Handle new post form submission
    if (newPostForm) {
        newPostForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const title = document.getElementById('post-title').value;
            const content = document.getElementById('post-content').value;
            const postSection = document.getElementById('blog-posts');

            const newPost = document.createElement('article');
            newPost.className = 'post';

            const postTitle = document.createElement('h2');
            postTitle.textContent = title;

            const postDate = document.createElement('p');
            postDate.innerHTML = `Posted on <time datetime="${new Date().toISOString()}">${new Date().toLocaleDateString()}</time> by ${getLoggedInUser().name}`;

            const postContent = document.createElement('p');
            postContent.textContent = content;

            newPost.appendChild(postTitle);
            newPost.appendChild(postDate);
            newPost.appendChild(postContent);

            postSection.appendChild(newPost);

            newPostForm.reset();
            newPostSection.classList.remove('active');
            blogPostsSection.classList.add('active');
        });
    }

    // Check if a user is logged in
    function isUserLoggedIn() {
        return !!localStorage.getItem('loggedInUser');
    }

    // Get the logged-in user's details
    function getLoggedInUser() {
        return JSON.parse(localStorage.getItem('loggedInUser'));
    }
});
