var googleSearchURL = "https://www.google.com/search?q=";

// Function to show search suggestions
function showSuggestions(value) {
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';

    if (value.length >= 3) {
        const predefinedSuggestions = [
            { name: 'YouTube', logo: 'https://futrengine.github.io/images/youtube-logo.png', link: 'https://www.youtube.com' },
            { name: 'Gmail', logo: 'https://futrengine.github.io/images/gmail-logo.png', link: 'https://mail.google.com' },
            { name: 'Drive', logo: 'https://futrengine.github.io/images/drive-logo.png', link: 'https://drive.google.com' },
            { name: 'Google', logo: 'https://futrengine.github.io/images/google-logo.png', link: 'https://www.google.com' }
        ];

        predefinedSuggestions.forEach(suggestion => {
            if (suggestion.name.toLowerCase().includes(value.toLowerCase())) {
                const suggestionElement = document.createElement('a');
                suggestionElement.href = suggestion.link;
                suggestionElement.classList.add('suggestion');

                const logoImg = document.createElement('img');
                logoImg.src = suggestion.logo;
                logoImg.alt = suggestion.name + ' Logo';
                suggestionElement.appendChild(logoImg);

                const nameSpan = document.createElement('span');
                nameSpan.textContent = suggestion.name;
                suggestionElement.appendChild(nameSpan);

                suggestions.appendChild(suggestionElement);
            }
        });
document.getElementById("search-input").addEventListener("focus", function() {
    this.style.transition = "0.3s";
    this.style.boxShadow = "0px 0px 10px rgba(255, 65, 108, 0.5)";
});

document.getElementById("search-input").addEventListener("blur", function() {
    this.style.boxShadow = "none";
});

document.querySelectorAll(".service-button").forEach(button => {
    button.addEventListener("mouseover", () => {
        button.style.transform = "scale(1.1)";
    });
    button.addEventListener("mouseleave", () => {
        button.style.transform = "scale(1)";
    });
});        
        
        

        suggestions.style.display = 'block';
    } else {
        suggestions.style.display = 'none';
    }
}

// Function to search Google
function searchGoogle() {
    const searchInput = document.getElementById('search-input').value;

    if (searchInput.trim() === '') {
        alert('Search is empty. Please enter a search query.');
    } else {
        const searchQuery = encodeURIComponent(searchInput);
        const fullGoogleSearchURL = `${googleSearchURL}${searchQuery}`;
        window.location.href = fullGoogleSearchURL;
    }
}

// Function to generate a 6-digit personal ID
function generateUserID() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to sign up
function signUp() {
    const name = document.getElementById('sign-up-name').value;
    const phone = document.getElementById('sign-up-phone').value;
    const email = document.getElementById('sign-up-email').value;
    const password = document.getElementById('sign-up-password').value;
    const messageElement = document.getElementById('sign-up-message');

    if (name && phone && email && password) {
        const userData = { name, phone, email, password, userID: generateUserID() };
        localStorage.setItem(email, JSON.stringify(userData));
        localStorage.setItem(phone, JSON.stringify(userData));

        messageElement.textContent = 'Sign Up Successful!';
        messageElement.style.color = 'green';

        setTimeout(() => {
            window.location.href = 'sign-in.html';
        }, 1000);
    } else {
        messageElement.textContent = 'Please fill in all fields.';
        messageElement.style.color = 'red';
    }
}

// Function to sign in
function signIn() {
    const identifier = document.getElementById('sign-in-identifier').value;
    const password = document.getElementById('sign-in-password').value;
    const messageElement = document.getElementById('sign-in-message');

    const storedData = JSON.parse(localStorage.getItem(identifier));

    if (storedData && storedData.password === password) {
        sessionStorage.setItem('loggedInUser', identifier);
        messageElement.textContent = 'Sign In Successful!';
        messageElement.style.color = 'green';

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        messageElement.textContent = 'Invalid credentials. Please sign up first!';
        messageElement.style.color = 'red';
    }
}

// Function to check login status
function checkLoginStatus() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');

    if (loggedInUser) {
        const userData = JSON.parse(localStorage.getItem(loggedInUser));
        authButtons.style.display = 'none';
        userInfo.style.display = 'block';
        document.getElementById('user-email').textContent = `Welcome, ${userData.name}`;
        document.getElementById('user-id').textContent = `ID: ${userData.userID}`;
    } else {
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
    }
}

// Function to sign out
function signOut() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}

// Ensure login status is checked on page load
document.addEventListener('DOMContentLoaded', checkLoginStatus);

document.getElementById("search-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchGoogle();
    }
});

