document.addEventListener('DOMContentLoaded', function() {
    const signupBtn = document.getElementById('signup-btn');
    const signinBtn = document.getElementById('signin-btn');
    const signoutBtn = document.getElementById('signout-btn');
    const newPostLink = document.getElementById('new-post-link');
    const newPostSection = document.getElementById('new-post');
    const newPostForm = document.getElementById('new-post-form');
    const blogPostsSection = document.getElementById('blog-posts');

    function isUserLoggedIn() {
        return !!localStorage.getItem('loggedInUser');
    }

    function getLoggedInUser() {
        return JSON.parse(localStorage.getItem('loggedInUser'));
    }

    if (!isUserLoggedIn()) {
        signoutBtn.style.display = 'none';
        newPostLink.style.display = 'none';
    } else {
        signupBtn.style.display = 'none';
        signinBtn.style.display = 'none';
        signoutBtn.style.display = 'inline-block';
        newPostLink.style.display = 'inline-block';
    }

    signoutBtn.addEventListener('click', function() {
        localStorage.removeItem('loggedInUser');
        window.location.reload();
    });

    newPostLink.addEventListener('click', function() {
        newPostSection.style.display = 'block';
        blogPostsSection.style.display = 'none';
    });

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
            newPostSection.style.display = 'none';
            blogPostsSection.style.display = 'block';
        });
    }

    const signupForm = document.getElementById('sign-up-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match');
                return;
            }

            const user = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                country: document.getElementById('country').value,
                password: password
            };

            let users = JSON.parse(localStorage.getItem('users')) || [];
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
        });
    }

    const signinForm = document.getElementById('sign-in-form');
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === username && u.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }
});
