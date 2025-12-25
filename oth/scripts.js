/* ========== CONFIGURATION ========== */
const GOOGLE_SEARCH_URL = "https://www.google.com/search?q=";

/* ========== DOM ELEMENTS ========== */
const clockDisplay = document.getElementById("clock-display");
const dateDisplay = document.getElementById("date-display");
const greetingDisplay = document.getElementById("greeting-display");
const searchInput = document.getElementById("search-input");
const suggestionsBox = document.getElementById("suggestions");
const sliderTrack = document.getElementById("slider-track");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

/* ========== TIME & DATE ========== */
function updateTime() {
    const now = new Date();
    
    // Clock (24h format for pro look)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockDisplay.textContent = `${hours}:${minutes}`;

    // Date (e.g., "Mon, 25 Dec")
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    dateDisplay.textContent = now.toLocaleDateString('en-US', options);

    // Dynamic Greeting
    const h = now.getHours();
    let msg = "Welcome back";
    if (h < 12) msg = "Good morning";
    else if (h < 18) msg = "Good afternoon";
    else msg = "Good evening";

    if (auth.currentUser) {
        const firstName = auth.currentUser.displayName.split(' ')[0];
        greetingDisplay.textContent = `${msg}, ${firstName}.`;
    } else {
        greetingDisplay.textContent = `${msg}.`;
    }
}
setInterval(updateTime, 1000);
updateTime();

/* ========== SEARCH ========== */
function searchGoogle() {
    const val = searchInput.value.trim();
    if (!val) return;
    
    // Smart URL detection
    if (val.includes('.') && !val.includes(' ')) {
        const url = val.startsWith('http') ? val : `https://${val}`;
        window.location.href = url;
    } else {
        window.location.href = `${GOOGLE_SEARCH_URL}${encodeURIComponent(val)}`;
    }
}

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchGoogle();
});

/* ========== SLIDER CONTROLS ========== */
let currentPage = 0;

function updateSlider() {
    // 0 = 0%, 1 = -50%
    sliderTrack.style.transform = `translateX(${currentPage * -50}%)`;
    
    // Toggle Button States
    if (currentPage === 0) {
        prevBtn.classList.add('disabled');
        nextBtn.classList.remove('disabled');
    } else {
        prevBtn.classList.remove('disabled');
        nextBtn.classList.add('disabled');
    }
}

nextBtn.addEventListener('click', () => {
    currentPage = 1;
    updateSlider();
});

prevBtn.addEventListener('click', () => {
    currentPage = 0;
    updateSlider();
});

/* ========== FIREBASE AUTH ========== */
const googleBtn = document.getElementById("google-signin-btn");
const userInfo = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");
const userName = document.getElementById("user-name");
const userPic = document.getElementById("user-pic");

function updateUI(user) {
    if (user) {
        googleBtn.classList.add("hidden");
        userInfo.classList.remove("hidden");
        userName.textContent = user.displayName;
        userPic.src = user.photoURL;
        updateTime(); // Refresh greeting
    } else {
        googleBtn.classList.remove("hidden");
        userInfo.classList.add("hidden");
    }
}

auth.onAuthStateChanged(user => {
    updateUI(user);
    if(user) {
        // Optional: User tracking or settings save
        db.ref("users/" + user.uid).update({ lastLogin: new Date().toISOString() });
    }
});

googleBtn.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(console.error);
});

logoutBtn.addEventListener("click", () => auth.signOut());