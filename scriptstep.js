
const firebaseConfig = {
  apiKey: "AIzaSyBKA3bxy1caa0QiGrn6AihtxufiO7xxTnI",
  authDomain: "futrshortener-7acf0.firebaseapp.com",
  projectId: "futrshortener-7acf0",
  storageBucket: "futrshortener-7acf0.firebasestorage.app",
  messagingSenderId: "863839648409",
  appId: "1:863839648409:web:d20ae154fe1c9dc1b19608"
};

// Init
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.getElementById("shortenerForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const longUrl = document.getElementById("longUrl").value.trim();
  const customAlias = document.getElementById("customAlias").value.trim();

  if (!customAlias.match(/^[a-zA-Z0-9_-]+$/)) {
    return alert("❌ Invalid alias format");
  }

  const ref = db.ref("links/" + customAlias);

  ref.once("value", snapshot => {
    if (snapshot.exists()) {
      alert("❌ Alias already taken. Try another.");
    } else {
      ref.set({ url: longUrl }, err => {
        if (err) {
          alert("❌ Failed to shorten.");
        } else {
          document.getElementById("result").innerHTML = `
            ✅ Success! Your link:<br>
            <a href="file/${customAlias}" target="_blank">${location.origin}/file/${customAlias}</a>
          `;
        }
      });
    }
  });
});
