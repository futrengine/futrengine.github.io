/* ========== CONFIGURATION ========== */
let selectedPlatform = "";
let targetUser = "";
const redirectURL = {
    "Google": "https://www.accounts.google.com",
    "Instagram": "https://www.instagram.com",
    "WhatsApp": "https://web.whatsapp.com",
    "Facebook": "https://www.facebook.com",
    "Twitter": "https://twitter.com",
    "Snapchat": "https://www.snapchat.com"
};

/* ========== NAVIGATION ========== */
function showStep(stepId) {
    document.querySelectorAll('.terminal-body').forEach(el => el.classList.add('hidden'));
    document.getElementById(stepId).classList.remove('hidden');
}

function selectTarget(platform) {
    selectedPlatform = platform;
    document.getElementById('target-display').innerText = platform;
    showStep('step-2');
}

function resetTool() {
    document.getElementById('username').value = "";
    document.getElementById('console-output').innerHTML = "";
    document.getElementById('progress-bar').style.width = "0%";
    showStep('step-1');
}

/* ========== HACKING LOGIC ========== */
function startAttack() {
    targetUser = document.getElementById('username').value.trim();
    if (!targetUser) {
        alert("ERROR: TARGET IDENTIFIER REQUIRED");
        return;
    }
    
    showStep('step-3');
    runConsoleLogs();
}

function runConsoleLogs() {
    const consoleBox = document.getElementById('console-output');
    const progressBar = document.getElementById('progress-bar');
    
    // Fake technical logs
    const logs = [
        `[INIT] Resolving host for ${selectedPlatform}...`,
        `[INFO] Target identified: ${targetUser}`,
        `[NET] Connecting to 192.168.0.1 via port 443...`,
        `[SUCCESS] Connection established.`,
        `[WARN] Firewall detected (Cloudflare).`,
        `[EXEC] Bypassing firewall using ProxyChain...`,
        `[SUCCESS] Bypass successful.`,
        `[SQL] Injecting payload: ' OR 1=1 --`,
        `[DATA] Dumping database table 'users'...`,
        `[INFO] Hashing algorithm detected: SHA-256`,
        `[BRUTE] Starting dictionary attack...`,
        `[BRUTE] Testing top 1000 passwords...`,
        `[BRUTE] Match found: [********]`,
        `[DECRYPT] Decrypting salt key...`,
        `[SUCCESS] Session token retrieved.`,
        `[FINAL] Cleaning up logs...`
    ];

    let i = 0;
    let width = 0;

    // Interval to print logs
    const interval = setInterval(() => {
        if (i < logs.length) {
            const p = document.createElement('div');
            p.className = 'log-entry';
            
            // Color coding logs
            if (logs[i].includes("WARN")) p.className += " log-warn";
            else if (logs[i].includes("ERROR")) p.className += " log-err";
            else if (logs[i].includes("SUCCESS")) p.className += " log-success";
            
            p.innerText = `> ${logs[i]}`;
            consoleBox.appendChild(p);
            consoleBox.scrollTop = consoleBox.scrollHeight; // Auto scroll
            
            i++;
            width += (100 / logs.length);
            progressBar.style.width = width + "%";
        } else {
            clearInterval(interval);
            setTimeout(() => showResult(), 1000);
        }
    }, 800); // Speed of logs (800ms per line)
}

/* ========== RESULTS ========== */
function showResult() {
    showStep('step-4');
    document.getElementById('res-user').innerText = targetUser;
    document.getElementById('res-pass').innerText = generateFakePass();
}

function generateFakePass() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
    let pass = "";
    for (let i = 0; i < 8; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
}

function redirect() {
    window.location.href = redirectURL[selectedPlatform] || "https://google.com";
}