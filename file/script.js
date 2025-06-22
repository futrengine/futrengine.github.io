// ✅ Firebase Config
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

// ✅ Show/Hide Loader
function showLoader(show = true) {
  document.getElementById("loader").style.display = show ? "flex" : "none";
}

// ✅ Show Result Box with Animation
function updateResultBox(message, isSuccess = true) {
  const box = document.getElementById("result");
  box.className = "result-box " + (isSuccess ? "success" : "error");
  box.innerHTML = message;
}

// ✅ Validate with URL Constructor
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

// ✅ Expiry Time Conversion
function getExpiryTimestamp(option, custom) {
  if (option === "custom" && custom) {
    return new Date(custom).getTime();
  }
  const now = Date.now();
  switch (option) {
    case "1h": return now + 3600000;
    case "1d": return now + 86400000;
    case "7d": return now + 604800000;
    default: return null;
  }
}

// ✅ Handle Expiry Dropdown
function handleExpiryChange() {
  const expiry = document.getElementById("expiry").value;
  const customInput = document.getElementById("customExpiry");
  customInput.style.display = expiry === "custom" ? "block" : "none";
}

// ✅ Copy to Clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("✅ Link copied to clipboard!");
  }).catch(() => {
    alert("❌ Failed to copy. Try manually.");
  });
}

// ✅ Main Shorten Function
function shorten() {
  let longUrl = document.getElementById("longUrl").value.trim();
  let alias = document.getElementById("customAlias").value.trim();
  const password = document.getElementById("linkPassword").value.trim();
  const expiryOpt = document.getElementById("expiry").value;
  const customExpiry = document.getElementById("customExpiry").value;
  const resultBox = document.getElementById("result");

  // Reset result
  resultBox.className = "result-box";
  resultBox.innerHTML = "";

  // Prepend https if needed
  if (!longUrl.startsWith("http://") && !longUrl.startsWith("https://")) {
    longUrl = "https://" + longUrl;
  }

  // Validate long URL
  if (!isValidUrl(longUrl)) {
    updateResultBox("❌ Invalid URL. Please enter a valid one like https://...", false);
    return;
  }

  // Auto-generate alias if blank
  if (!alias) {
    const random = Math.floor(1000 + Math.random() * 9000);
    alias = "link" + random;
    document.getElementById("customAlias").value = alias;
  }

  // Alias pattern check
  if (!alias.match(/^[a-zA-Z0-9_-]+$/)) {
    updateResultBox("❌ Alias must contain only letters, numbers, _ or -", false);
    return;
  }

  const ref = db.ref("links/" + alias);
  showLoader(true);

  ref.once("value").then(snapshot => {
    if (snapshot.exists()) {
      showLoader(false);
      updateResultBox("❌ Alias already taken. Try another.", false);
    } else {
      const expiryTimestamp = getExpiryTimestamp(expiryOpt, customExpiry);

      ref.set({
        url: longUrl,
        password: password || null,
        createdAt: Date.now(),
        expiresAt: expiryTimestamp || null
      }, error => {
        showLoader(false);
        if (error) {
          updateResultBox("❌ Failed to save link. Try again.", false);
        } else {
          const shortUrl = `${location.origin}/file/?alias=${alias}`;
          updateResultBox(`
            ✅ Your short link:<br>
            <a href="${shortUrl}" target="_blank">${shortUrl}</a><br><br>
            <button class="button" onclick="copyToClipboard('${shortUrl}')">📋 Copy</button><br><br>
            <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(shortUrl)}&size=150x150" alt="QR Code" />
          `, true);
        }
      });
    }
  });
}
