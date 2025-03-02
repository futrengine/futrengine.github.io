const GITHUB_USERNAME = "futrengine";  
const PUBLIC_REPO = "futrengine.github.io"; // Public repo
const PRIVATE_REPO = "ap"; // Private repo storing API key
const BRANCH = "main";  

async function getGitHubToken() {
    let url = `https://raw.githubusercontent.com/futrengine/ap/refs/heads/main/secrets.json?token=GHSAT0AAAAAAC6UI4KDG2BDJBBAV4EMSYRGZ6DVPUA`;

    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch token");

        let data = await response.json();
        return data.GITHUB_TOKEN;
    } catch (error) {
        console.error("Error fetching API token:", error);
        return null;
    }
}

async function generateRedirect() {
    let url = document.getElementById("longUrl").value.trim();
    let alias = document.getElementById("alias").value.trim();
    
    if (!url || !alias) {
        alert("Please enter both a URL and an alias.");
        return;
    }

    let aliasData = {
        alias: alias,
        url: url
    };

    let base64Content = btoa(JSON.stringify(aliasData, null, 2));
    let apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${PUBLIC_REPO}/contents/alias.json`;

    let token = await getGitHubToken();
    if (!token) {
        alert("Failed to fetch secure token.");
        return;
    }

    let response = await fetch(apiUrl, {
        headers: { "Authorization": `token ${token}` }
    });
    let fileData = await response.json();
    let sha = fileData.sha || null;

    let uploadResponse = await fetch(apiUrl, {
        method: "PUT",
        headers: {
            "Authorization": `token ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: `Updated alias.json with ${alias}`,
            content: base64Content,
            branch: BRANCH,
            sha: sha
        })
    });

    let result = await uploadResponse.json();
    
    if (uploadResponse.ok) {
        document.getElementById("result").innerHTML = `
            <p>Shortened URL will be ready soon at:</p>
            <a href="https://${GITHUB_USERNAME}.github.io/File/${alias}.html" target="_blank">
                https://${GITHUB_USERNAME}.github.io/File/${alias}.html
            </a>`;
    } else {
        alert("Failed to update alias.json: " + result.message);
    }
}
