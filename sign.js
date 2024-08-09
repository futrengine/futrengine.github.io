const GITHUB_REPO = 'futrengine/sigcred';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/users.json`;
const GITHUB_TOKEN = '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'; // Create a personal access token from GitHub

// Function to get the content of the users.json file from GitHub
async function fetchUserData() {
    try {
        const response = await fetch(GITHUB_API_URL, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });
        const data = await response.json();
        const content = atob(data.content);
        return JSON.parse(content);
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

// Function to update the users.json file in GitHub
async function updateUserData(updatedUsers) {
    try {
        const userData = await fetchUserData();
        const sha = userData.sha;
        const updatedContent = btoa(JSON.stringify(updatedUsers));

        await fetch(GITHUB_API_URL, {
            method: 'PUT',
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: 'Update user data',
                content: updatedContent,
                sha: sha
            })
        });
    } catch (error) {
        console.error('Error updating user data:', error);
    }
}

// Function to sign up
async function signUp() {
    const email = document.getElementById('sign-up-email').value;
    const password = document.getElementById('sign-up-password').value;
    const messageElement = document.getElementById('sign-up-message');

    const users = await fetchUserData() || [];

    if (users.find(user => user.email === email)) {
        messageElement.textContent = 'Email is already registered.';
        messageElement.style.color = 'red';
        return;
    }

    const newUser = { email, password };
    users.push(newUser);

    await updateUserData(users);

    messageElement.textContent = 'Sign Up Successful!';
    messageElement.style.color = 'green';
    setTimeout(() => {
        window.location.href = 'sign-in.html';
    }, 1000);
}

// Function to sign in
async function signIn() {
    const email = document.getElementById('sign-in-email').value;
    const password = document.getElementById('sign-in-password').value;
    const messageElement = document.getElementById('sign-in-message');

    const users = await fetchUserData();

    if (!users || !users.find(user => user.email === email && user.password === password)) {
        messageElement.textContent = 'Incorrect email or password.';
        messageElement.style.color = 'red';
        return;
    }

    messageElement.textContent = 'Sign In Successful!';
    messageElement.style.color = 'green';
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}
