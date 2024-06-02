// global variables
let users = [];
let currentUser = null;

// load users from file
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

// save users to file
function saveUsers() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'users.txt', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(users));
}

// sign up functionality
document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const user = { username, password, email };
    users.push(user);
    saveUsers();
    document.getElementById('signup-error').innerHTML = 'Sign up successful!';
});

// sign in functionality
document.getElementById('signin-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            currentUser = users[i];
            document.getElementById('signin-error').innerHTML = 'Sign in successful!';
            break;
        }
    }
});

// load blog posts
function loadBlogPosts() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'blogposts.txt', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const blogPosts = JSON.parse(xhr.responseText);
            const blogPostsHTML = '';
            for (let i = 0; i < blogPosts.length; i++) {
                blogPostsHTML += `
                    <div class="blog-post">
                        <h2>${blogPosts[i].title}</h2>
                        <p>${blogPosts[i].content}</p>
                    </div>
                `;
            }
            document.getElementById('blog-posts').innerHTML = blogPostsHTML;
        }
    };
    xhr.send();
}

// create new blog post
function createBlogPost() {
    const title = prompt('Enter title:');
    const content = prompt('Enter content:');
    const blogPost = { title, content };
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'blogposts.txt', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(blogPost));
    loadBlogPosts();
}

// load users and blog posts on page load
loadUsers();
loadBlogPosts();

// add event listener to create new blog post button
document.getElementById('create-blog-post').addEventListener('click', createBlogPost);
