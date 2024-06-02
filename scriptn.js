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
