
const firebaseConfig = {
  apiKey: "AIzaSyBKA3bxy1caa0QiGrn6AihtxufiO7xxTnI",
  authDomain: "futrshortener-7acf0.firebaseapp.com",
  databaseURL: "https://futrshortener-7acf0-default-rtdb.firebaseio.com",
  projectId: "futrshortener-7acf0",
  storageBucket: "futrshortener-7acf0.appspot.com",
  messagingSenderId: "863839648409",
  appId: "1:863839648409:web:d20ae154fe1c9dc1b19608"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let allLinks = [], currentIndex = 0, pageSize = 5;

function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if (u === "Jachu21" && p === "212007") {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    showSection("dashboard");
    loadStats();
    loadLatest();
  } else {
    document.getElementById("loginError").innerText = "❌ Invalid login.";
  }
}
function logout() {
  location.reload();
}
function showSection(id) {
  document.querySelectorAll('.panel-section').forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// ================= Dashboard
function loadStats() {
  db.ref("links").once("value").then(snapshot => {
    const all = snapshot.val() || {};
    let today = 0;
    const now = new Date().setHours(0,0,0,0);
    Object.values(all).forEach(l => {
      if (l.createdAt >= now) today++;
    });
    document.getElementById("stats").innerHTML = `
      <p>🔢 Total Links: ${Object.keys(all).length}</p>
      <p>📅 Today’s Links: ${today}</p>
    `;
  });
}
function loadLatest() {
  db.ref("links").orderByChild("createdAt").limitToLast(5).once("value").then(snapshot => {
    const links = Object.entries(snapshot.val() || {}).reverse();
    let html = `<h3>🆕 Latest Links</h3><ul>`;
    links.forEach(([alias, data]) => {
      html += `<li><a href="/file/?alias=${alias}" target="_blank">${alias}</a></li>`;
    });
    html += `</ul>`;
    document.getElementById("latestLinks").innerHTML = html;
  });
}

// ================= Manage URLs
function loadLinks() {
  db.ref("links").once("value").then(snapshot => {
    allLinks = Object.entries(snapshot.val() || {});
    currentIndex = 0;
    renderBatch();
  });
}
function renderBatch() {
  const tbody = document.getElementById("urlTable");
  tbody.innerHTML = "";
  const now = Date.now();
  const base = location.origin + "/file/?alias=";
  const batch = allLinks.slice(currentIndex, currentIndex + pageSize);

  batch.forEach(([alias, info]) => {
    db.ref("clicks/" + alias).once("value").then(snap => {
      const clicks = snap.exists() ? Object.keys(snap.val()).length : 0;
      const expired = info.expiresAt && now > info.expiresAt;
      const exp = info.expiresAt ? new Date(info.expiresAt).toLocaleString() + (expired ? " ❌ Expired" : "") : "♾️";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${alias}</td>
        <td><a href="${info.url}" target="_blank">${info.url}</a></td>
        <td>${clicks}</td>
        <td>${exp}</td>
        <td><a href="${base}${alias}" target="_blank">Short</a></td>
        <td><img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(base + alias)}&size=100x100"></td>
        <td>
          <button onclick="deleteLink('${alias}')">🗑️</button>
          <button onclick="showDetails('${alias}', this)">📈</button>
        </td>`;
      tbody.appendChild(tr);
    });
  });

  const pageInfo = document.getElementById("pageInfo");
  pageInfo.innerText = `Page ${Math.floor(currentIndex / pageSize) + 1}`;
}
function showNextBatch() {
  if (currentIndex + pageSize < allLinks.length) {
    currentIndex += pageSize;
    renderBatch();
  }
}
function showPrevBatch() {
  if (currentIndex >= pageSize) {
    currentIndex -= pageSize;
    renderBatch();
  }
}
function deleteLink(alias) {
  if (confirm("Delete " + alias + "?")) {
    db.ref("links/" + alias).remove();
    db.ref("clicks/" + alias).remove();
    loadLinks();
  }
}
function showDetails(alias, btn) {
  const tr = btn.closest("tr");
  const next = tr.nextElementSibling;
  if (next && next.classList.contains("details-row")) {
    next.remove();
    return;
  }

  db.ref("clicks/" + alias).once("value").then(snap => {
    const data = snap.val();
    const row = document.createElement("tr");
    row.classList.add("details-row");
    const td = document.createElement("td");
    td.colSpan = 7;
    td.innerHTML = data ? Object.values(data).map(c => `
      <div>
        <b>Time:</b> ${new Date(c.timestamp).toLocaleString()}<br/>
        <b>IP:</b> ${c.ip} | ${c.country || ''}, ${c.city || ''}<br/>
        <b>Device:</b> ${c.device}
      </div>
    `).join("<hr>") : "No Clicks Yet.";
    row.appendChild(td);
    tr.after(row);
  });
}

// ================== Ban IPs
function banIp() {
  const ip = document.getElementById("banIpInput").value.trim();
  if (ip) {
    db.ref("banned/" + ip).set(true).then(() => {
      alert("IP Banned.");
      loadBanList();
    });
  }
}
function loadBanList() {
  db.ref("banned").once("value").then(snap => {
    const list = snap.val() || {};
    const html = Object.keys(list).map(ip => `
      <li>${ip} <button onclick="unbanIp('${ip}')">❌ Unban</button></li>
    `).join("");
    document.getElementById("bannedList").innerHTML = html;
  });
}
function unbanIp(ip) {
  db.ref("banned/" + ip).remove().then(() => loadBanList());
}
