const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/getInstaMedia", async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: "No URL provided" });

  try {
    const instaLink = "https://saveig.app/api/ajaxSearch";
    const response = await axios.post(instaLink, new URLSearchParams({
      q: url,
      t: "media"
    }), {
      headers: {
        "Origin": "https://saveig.app",
        "Referer": "https://saveig.app/",
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const match = response.data.match(/href="([^"]+\.(mp4|jpg|jpeg))"/);

    if (!match) return res.status(500).json({ error: "No media found" });

    res.json({ media: match[1] });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Server running on ${PORT}`));
