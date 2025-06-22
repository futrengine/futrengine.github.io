const firebaseConfig = {
  apiKey: "AIzaSyBKA3bxy1caa0QiGrn6AihtxufiO7xxTnI",
  authDomain: "futrshortener-7acf0.firebaseapp.com",
  databaseURL: "https://futrshortener-7acf0-default-rtdb.firebaseio.com",
  projectId: "futrshortener-7acf0",
  storageBucket: "futrshortener-7acf0.appspot.com",
  messagingSenderId: "863839648409",
  appId: "1:863839648409:web:d20ae154fe1c9dc1b19608",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function getExpiryTimestamp(option, custom) {
  if (custom) return new Date(custom).getTime();
  const now = Date.now();
  switch (option) {
    case "1h": return now + 3600000;
    case "1d": return now + 86400000;
    case "7d": return now + 604800000;
    default: return null;
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("✅ Link copied to clipboard!");
  });
}

function shorten() {
  const longUrlInput = document.getElementById("longUrl").value.trim();
  const alias = document.getElementById("customAlias").value.trim();
  const password = document.getElementById("linkPassword").value.trim();
  const expiryOpt = document.getElementById("expiry").value;
  const customExpiry = document.getElementById("customExpiry").value;
  const resultBox = document.getElementById("result");

  resultBox.className = "result-box"; // Reset classes
  resultBox.innerHTML = ""; // Clear output

  // Validate URL format
  const urlRegex = /^(https?:\/\/)?(www\.)?[a-z0-9\-]+(\.[a-z]{2,})(\/\S*)?$/i;
  if (!urlRegex.test(longUrlInput)) {
    resultBox.classList.add("error");
    resultBox.innerText = "❌ Invalid URL. Must start with http://, https:// or www.";
    return;
  }

  // Prepend https:// if not included
  let longUrl = longUrlInput;
  if (!longUrl.startsWith("http://") && !longUrl.startsWith("https://")) {
    longUrl = "https://" + longUrl;
  }

  if (!longUrl || !alias) {
    resultBox.classList.add("error");
    resultBox.innerText = "❌ Please enter both URL and alias.";
    return;
  }

  if (!alias.match(/^[a-zA-Z0-9_-]+$/)) {
    resultBox.classList.add("error");
    resultBox.innerText = "❌ Alias must contain only letters, numbers, _ or -";
    return;
  }


  const ref = db.ref("links/" + alias);

  ref.once("value").then(snapshot => {
    if (snapshot.exists()) {
      resultBox.innerText = "❌ Alias already taken. Try another.";
    } else {
      const expiryTimestamp = getExpiryTimestamp(expiryOpt, customExpiry);

      ref.set({
        url: longUrl,
        password: password || null,
        createdAt: Date.now(),
        expiresAt: expiryTimestamp || null
      }, error => {
        if (error) {
          resultBox.innerText = "❌ Failed to save link. Try again.";
        } else {
          const shortUrl = `${location.origin}/file/?alias=${alias}`;
          resultBox.innerHTML = `
            ✅ Your short link:<br>
            <a href="${shortUrl}" target="_blank">${shortUrl}</a><br><br>
            <button class="button" onclick="copyToClipboard('${shortUrl}')">📋 Copy</button><br><br>
            <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(shortUrl)}&size=150x150" alt="QR Code" />
          `;
        }
      });
    }
  });
}

function handleExpiryChange() {
  const expiryValue = document.getElementById("expiry").value;
  const customInput = document.getElementById("customExpiry");
  customInput.style.display = expiryValue === "custom" ? "block" : "none";
}


