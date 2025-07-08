var googleSearchURL = "https://www.google.com/search?q=";

// Function to show search suggestions
function showSuggestions(value) {
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';

    if (value.length >= 3) {
        const predefinedSuggestions = [
            { name: 'YouTube', logo: '/images/youtube-logo.png', link: 'https://www.youtube.com' },
            { name: 'Gmail', logo: '/images/gmail-logo.png', link: 'https://mail.google.com' },
            { name: 'Drive', logo: '/images/drive-logo.png', link: 'https://drive.google.com' },
            { name: 'Google', logo: '/images/google-logo.png', link: 'https://www.google.com' }
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



// Function to check login status

// Function to sign out


// Ensure login status is checked on page load


document.getElementById("search-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchGoogle();
    }
});



document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("shortcut-container");
    const toggleButton = document.getElementById("next-button");
    let currentPage = 0;
    const totalPages = 2;

    function showPage(page) {
        const offset = page * -50;
        container.style.transition = "transform 0.3s ease-in-out";
        container.style.transform = `translateX(${offset}%)`;

        // Change button text based on current page
        if (page === totalPages - 1) {
            toggleButton.textContent = "Previous";
        } else {
            toggleButton.textContent = "Next";
        }
    }

    toggleButton.addEventListener("click", function () {
        if (currentPage === totalPages - 1) {
            currentPage = 0; // Go back to first page
        } else {
            currentPage = 1; // Move to next page
        }
        showPage(currentPage);
    });

    showPage(0);
});

const googleBtn = document.getElementById("google-signin-btn");
const userInfo = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const userPic = document.getElementById("user-pic");

// Google Sign In
googleBtn.addEventListener("click", async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    // Save user data to Firebase Realtime DB
    db.ref("users/" + user.uid).set({
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    });

    // Save in session
    sessionStorage.setItem("loggedInUser", user.uid);
    updateUI(user);
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    sessionStorage.removeItem("loggedInUser");
    userInfo.style.display = "none";
    googleBtn.style.display = "inline-block";
  });
});

// Check login status on page load
window.addEventListener("DOMContentLoaded", () => {
  auth.onAuthStateChanged(user => {
    if (user) {
      sessionStorage.setItem("loggedInUser", user.uid);
      updateUI(user);
    }
  });
});

function updateUI(user) {
  googleBtn.style.display = "none";
  userInfo.style.display = "flex";
  userName.textContent = user.displayName;
  userEmail.textContent = user.email;
  userPic.src = user.photoURL;
}


