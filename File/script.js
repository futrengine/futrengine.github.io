function saveAlias() {
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

    // Save the alias in a JSON file for GitHub Actions
    let blob = new Blob([JSON.stringify(aliasData, null, 2)], { type: "application/json" });
    let downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "alias.json";
    downloadLink.click();

    document.getElementById("result").innerHTML = `
        <p>File saved! Please upload <b>alias.json</b> to the repo.</p>`;
}