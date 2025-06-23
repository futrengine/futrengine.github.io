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

let allLinks = [];
let currentIndex = 0;
const pageSize = 5;

function switchTab(id) {
  document.querySelectorAll('.section').forEach(div => div.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  const err = document.getElementById("loginError");

  if (u === "Jachu21" && p === "212007") {
    document.getElementById("loginSection").classList.add("hidden");
    document.querySelector(".sidebar").style.display = "flex";
    switchTab('dashboard');
    renderStats();
    loadLinks();
    loadBanned();
  } else {
    err.innerText = "❌ Wrong username or password.";
  }
}

function logout() {
  location.reload();
}

function renderStats() {
  db.ref("links").once("value").then(snap => {
    const all = snap.val() || {};
    const list = Object.entries(all);
    const today = list.filter(([k, v]) => {
      const d = new Date(v.createdAt);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    });
    document.getElementById("statsCards").innerHTML = `
      <div>🔗 Total Links: <b>${list.length}</b></div>
      <div>📅 Today: <b>${today.length}</b></div>
    `;
    const last5 = list.slice(-5).reverse().map(([a, v]) =>
      `<li>${a} → <a href="${v.url}" target="_blank">${v.url}</a></li>`).join("");
    document.getElementById("recentLinks").innerHTML = last5 || "<i>No recent links.</i>";
  });
}

function loadLinks() {
  db.ref("links").once("value").then(snap => {
    allLinks = Object.entries(snap.val() || {});
    currentIndex = 0;
    renderBatch();
  });
}

function renderBatch() {
  const now = Date.now();
  const rows = allLinks.slice(currentIndex, currentIndex + pageSize);
  const table = document.getElementById("urlTable");
  table.innerHTML = "";

  rows.forEach(([alias, data]) => {
    const url = `${location.origin}/file/?alias=${alias}`;
    const exp = data.expiresAt ? new Date(data.expiresAt).toLocaleString() : "♾️ No Limit";

    db.ref("clicks/" + alias).once("value").then(cSnap => {
      const clicks = cSnap.exists() ? Object.keys(cSnap.val()).length : 0;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${alias}</td>
        <td><a href="${data.url}" target="_blank">${data.url}</a></td>
        <td>${clicks}</td>
        <td>${exp}</td>
        <td><a href="${url}" target="_blank">${url}</a></td>
        <td><img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=80x80"></td>
        <td>
          <button onclick="deleteLink('${alias}')">🗑️</button>
          <button onclick="showDetails('${alias}', this)">📈</button>
        </td>
      `;
      table.appendChild(tr);
    });
  });

  const totalPages = Math.ceil(allLinks.length / pageSize);
  const currentPage = Math.floor(currentIndex / pageSize) + 1;
  document.getElementById("pageInfo").innerText = `Page ${currentPage} of ${totalPages}`;
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
  if (confirm("Delete link " + alias + "?")) {
    db.ref("links/" + alias).remove();
    db.ref("clicks/" + alias).remove();
    loadLinks();
  }
}

function showDetails(alias, btn) {
  const tr = btn.closest("tr");
  const next = tr.nextElementSibling;
  if (next && next.classList.contains("details-row")) return next.remove();

  db.ref("clicks/" + alias).once("value").then(snap => {
    const div = document.createElement("tr");
    div.className = "details-row";
    const td = document.createElement("td");
    td.colSpan = 7;
    const data = snap.val();
    td.innerHTML = data
      ? Object.values(data).map(d => `
        <div class="click-details">
          <b>Time:</b> ${new Date(d.timestamp).toLocaleString()}<br/>
          <b>Country:</b> ${d.country || 'N/A'} | <b>IP:</b> ${d.ip || 'N/A'}<br/>
          <b>Device:</b> ${d.device || 'N/A'}
        </div>`).join("")
      : "<i>No click data.</i>";
    div.appendChild(td);
    tr.parentNode.insertBefore(div, tr.nextSibling);
  });
}

function banIP() {
  const ip = document.getElementById("banIp").value.trim();
  if (!ip) return alert("Enter an IP");
  db.ref("banned/" + ip).set(true).then(() => {
    alert("✅ Banned " + ip);
    loadBanned();
  });
}

function unbanIP() {
  const ip = document.getElementById("banIp").value.trim();
  if (!ip) return alert("Enter an IP");
  db.ref("banned/" + ip).remove().then(() => {
    alert("✅ Unbanned " + ip);
    loadBanned();
  });
}

function loadBanned() {
  db.ref("banned").once("value").then(snap => {
    const banned = Object.keys(snap.val() || {});
    document.getElementById("bannedList").innerHTML = banned.map(ip => `<li>${ip}</li>`).join("");
  });
}
