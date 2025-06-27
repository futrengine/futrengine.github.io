async function download() {
  const url = document.getElementById("instaUrl").value.trim();
  const output = document.getElementById("output");

  if (!url.includes("instagram.com")) {
    output.innerHTML = "❌ Invalid Instagram link!";
    return;
  }

  output.innerHTML = "⏳ Fetching media link…";

  try {
    const res = await fetch("https://insta-api-futr.onrender.com/api/instagram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    if (!res.ok) {
      const err = await res.json();
      output.innerHTML = `❗️ Error: ${err.error || res.statusText}`;
      return;
    }

    const data = await res.json();
    if (data.media) {
      output.innerHTML = `
        ✅ <a href="${data.media}" target="_blank" download>Download Media</a>
      `;
    } else {
      output.innerHTML = "⚠️ No media detected in that link.";
    }

  } catch (e) {
    console.error("Fetch error:", e);
    output.innerHTML = "🚨 Network Error: " + e.message;
  }
}



