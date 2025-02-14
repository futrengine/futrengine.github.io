let selectedPlatform = "";
let redirectURL = {
    "Google": "https://www.accounts.google.com",
    "Instagram": "https://www.instagram.com/kammu.in/",
    "WhatsApp": "https://web.whatsapp.com",
    "Facebook": "https://www.facebook.com",
    "Twitter": "https://twitter.com"
};



function goToPage(platform) {
    selectedPlatform = platform;
    document.getElementById("homePage").style.display = "none";
    document.getElementById("inputPage").style.display = "block";
    
    document.getElementById("platformName").innerText = `Hacking ${platform}`;
    if (platform === "WhatsApp") {
        document.getElementById("inputLabel").innerText = "Enter Target Phone Number (with country code):";
        document.getElementById("username").placeholder = "+1234567890";
    } else {
        document.getElementById("inputLabel").innerText = "Enter Target Username:";
        document.getElementById("username").placeholder = "Enter username";
    }
}

function startHacking() {
    let username = document.getElementById("username").value.trim();
    if (username === "") {
        alert("Enter a valid username or phone number!");
        return;
    }

    document.getElementById("inputPage").style.display = "none";
    document.getElementById("loadingScreen").style.display = "block";

    let progressBar = document.getElementById("progressBar");
    let width = 0;
    let interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            showResult(username);
        } else {
            width += 10; // Fake progress in 10 sec
            progressBar.style.width = width + "%";
        }
    }, 1000);
}

function showResult(username) {
    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("resultPage").style.display = "block";

    let password = generatePassword(username);
    let details;

    if (selectedPlatform === "WhatsApp") {
        details = `<p>Phone Number: <b>${username}</b></p>
                   <p>OTP: <b>${password}</b></p>`;
    } else {
        details = `<p>Username: <b>${username}</b></p>
                   <p>Password: <b>${password}</b></p>`;
    }

    document.getElementById("hackedDetails").innerHTML = details;
}

function generatePassword(username) {
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = username.substring(0, 3);

    for (let i = 0; i < 5; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return selectedPlatform === "WhatsApp" ? Math.floor(100000 + Math.random() * 900000) : password;
}

function redirect() {
    window.location.href = redirectURL[selectedPlatform];
}
