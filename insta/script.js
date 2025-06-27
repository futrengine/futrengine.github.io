async function download() {
  const url = document.getElementById("instaUrl").value;
  const output = document.getElementById("output");

  if (!url.includes("instagram.com")) {
    output.innerHTML = "❌ Invalid Instagram link!";
    return;
  }

  output.innerHTML = "⏳ Fetching download link...";

  try {
    const res = await fetch("https://sudomedia.onrender.com/api/instagram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await res.json();

    if (data.status === "success" && data.downloads.length) {
      const media = data.downloads[0].url;
      output.innerHTML = `
        ✅ <a href="${media}" target="_blank" download>Click here to download</a>
      `;
    } else {
      output.innerHTML = "❌ Could not fetch media.";
    }
  } catch (e) {
    console.error("Fetch error:", e);
    output.innerHTML = "🚨 Error: " + e.message;
  }
}
