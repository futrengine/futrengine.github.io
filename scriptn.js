const submitPost = document.getElementById('submit-post');
const postContent = document.getElementById('post-content');

submitPost.addEventListener('click', () => {
    const postTitle = document.querySelector('.post-title').textContent;
    const postText = postContent.value;

    // Create a new blog post object
    const newPost = {
        title: postTitle,
        content: postText
    };

    // Save the post to local storage (or send to server)
    localStorage.setItem('newPost', JSON.stringify(newPost));

    // Clear the form
    postContent.value = '';
});

const submitPost = document.getElementById('submit-post');
const postContent = document.getElementById('post-content');

submitPost.addEventListener('click', () => {
    const postTitle = document.querySelector('.post-title').textContent;
    const postText = postContent.value;

    // Create a new blog post object
    const newPost = {
        title: postTitle,
        content: postText,
        timestamp: Date.now()
    };

    // Save the post to local storage
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    // Redirect to home page
    window.location.href = 'index.html';
});
