async function download() {
  const url = document.getElementById("instaUrl").value;
  const output = document.getElementById("output");

  if (!url.includes("instagram.com")) {
    output.innerHTML = "❌ Invalid Instagram link!";
    return;
  }

  output.innerHTML = "⏳ Fetching download link...";

  try {
    const res = await fetch("https://3ef2889e-1afd-4f09-b501-ebbed725ecfd-00-2oh5jrkyumor0.sisko.replit.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await res.json();

    if (data.media) {
      output.innerHTML = `
        ✅ <a href="${data.media}" target="_blank" download>Click here to download</a>
      `;
    } else {
      output.innerHTML = "❌ Could not fetch media.";
    }
  } catch (e) {
    output.innerHTML = "🚨 Error: " + e.message;
  }
}
