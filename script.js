// Add event listeners to the forms
document.getElementById('signup-form').addEventListener('submit', handleSignup);
document.getElementById('signin-form').addEventListener('submit', handleSignin);

// Function to handle sign up
function handleSignup(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    // Add your sign up logic here
    console.log(`Sign up: ${username}, ${password}, ${email}`);
}

// Function to handle sign in
function handleSignin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // Add your sign in logic here
    console.log(`Sign in: ${username}, ${password}`);
}
