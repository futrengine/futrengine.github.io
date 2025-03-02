const GITHUB_USERNAME = "futrengine";  // Replace with your GitHub username
const REPO_NAME = "futrengine.github.io";       // Your GitHub Pages repo
const BRANCH = "main";                          // Usually 'main' or 'master'
const FOLDER = "File";                          // Folder to store files
const GITHUB_TOKEN = "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"; // Add your GitHub PAT here

async function generateRedirect() {
    let url = document.getElementById("longUrl").value.trim();
    let alias = document.getElementById("alias").value.trim();
    
    if (!url || !alias) {
        alert("Please enter both a URL and an alias.");
        return;
    }

    let redirectPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url='${url}'">
    <title>Redirecting...</title>
    <script>window.location.href = "${url}";</script>
</head>
<body>
    <p>Redirecting to <a href="${url}">${url}</a>...</p>
</body>
</html>`;

    let fileName = `${FOLDER}/${alias}.html`; // Path inside repo

    uploadToGitHub(fileName, redirectPage);
}

async function uploadToGitHub(path, content) {
    let apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${path}`;

    // Convert content to Base64 (GitHub API requires it)
    let base64Content = btoa(unescape(encodeURIComponent(content)));

    // Check if file already exists
    let response = await fetch(apiUrl, {
        headers: { "Authorization": `token ${GITHUB_TOKEN}` }
    });
    let fileData = await response.json();
    let sha = fileData.sha || null; // If file exists, get SHA for updating

    // Upload file to GitHub
    let uploadResponse = await fetch(apiUrl, {
        method: "PUT",
        headers: {
            "Authorization": `token ${GITHUB_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: `Added redirect file for ${path}`,
            content: base64Content,
            branch: BRANCH,
            sha: sha // Needed for overwriting existing file
        })
    });

    let result = await uploadResponse.json();
    
    if (uploadResponse.ok) {
        let fileUrl = `https://${GITHUB_USERNAME}.github.io/${path}`;
        document.getElementById("result").innerHTML = `
            <p>Shortened URL created: <a href="${fileUrl}" target="_blank">${fileUrl}</a></p>`;
    } else {
        alert("Failed to upload file: " + result.message);
    }
}
