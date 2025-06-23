const firebaseConfig = {
  apiKey: "AIzaSyBKA3bxy1caa0QiGrn6AihtxufiO7xxTnI",
  authDomain: "futrshortener-7acf0.firebaseapp.com",
  databaseURL: "https://futrshortener-7acf0-default-rtdb.firebaseio.com",
  projectId: "futrshortener-7acf0",
  storageBucket: "futrshortener-7acf0.appspot.com",
  messagingSenderId: "863839648409",
  appId: "1:863839648409:web:d20ae154fe1c9dc1b19608",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Login logic
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === "Jachu21" && pass === "212007") {
    document.getElementById("loginPage").classList.add("hidden");
    switchPage("dashboard");
    loadDashboard();
    loadLinks();
    loadBannedIps();
  } else {
    document.getElementById("loginError").innerText = "❌ Invalid credentials!";
  }
}

function logout() {
  document.getElementById("loginPage").classList.remove("hidden");
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
}

// Navigation
function switchPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(pageId + "Page").classList.remove("hidden");
}

// Dashboard Data
function loadDashboard() {
  db.ref("links").once("value").then(snapshot => {
    const links = Object.entries(snapshot.val() || {});
    const summary = document.getElementById("summary");
    const last5 = links.slice(-5).reverse();
    document.getElementById("lastLinks").innerHTML = last5.map(([alias]) => `<li>${alias}</li>`).join("");
    const today = new Date().toDateString();
    const todayCount = links.filter(([_, d]) => new Date(d.createdAt).toDateString() === today).length;
    summary.innerHTML = `
      <p>🔗 Total Links: ${links.length}</p>
      <p>📆 Links Created Today: ${todayCount}</p>
    `;
    drawChart(todayCount, links.length);
  });
}

function drawChart(todayCount, totalCount) {
  const ctx = document.getElementById('analyticsChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Today', 'Total'],
      datasets: [{
        label: 'Links',
        data: [todayCount, totalCount - todayCount],
        backgroundColor: ['#3b82f6', '#64748b'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#fff' } } }
    }
  });
}

// Manage URLs
let allLinks = [];
let currentIndex = 0;
const pageSize = 5;

function loadLinks() {
  db.ref("links").once("value").then(snapshot => {
    allLinks = Object.entries(snapshot.val() || {});
    currentIndex = 0;
    renderBatch();
  });
}

function renderBatch() {
  const table = document.getElementById("urlTable");
  table.innerHTML = "";
  const batch = allLinks.slice(currentIndex, currentIndex + pageSize);
  const now = Date.now();

  batch.forEach(([alias, data]) => {
    const expired = data.expiresAt && now > data.expiresAt;
    const expiry = data.expiresAt ? new Date(data.expiresAt).toLocaleString() + (expired ? " ❌ Expired" : "") : "♾️";
    db.ref("clicks/" + alias).once("value").then(clickSnap => {
      const clicks = clickSnap.exists() ? Object.keys(clickSnap.val()).length : 0;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${alias}</td>
        <td><a href="${data.url}" target="_blank">${data.url}</a></td>
        <td>${clicks}</td>
        <td>${expiry}</td>
        <td><img src="https://api.qrserver.com/v1/create-qr-code/?data=${location.origin}/file/?alias=${alias}&size=100x100"></td>
        <td><button onclick="deleteLink('${alias}')" class="auth-button">Delete</button></td>
      `;
      table.appendChild(tr);
    });
  });

  const totalPages = Math.ceil(allLinks.length / pageSize);
  document.getElementById("pageInfo").innerText = `Page ${currentIndex / pageSize + 1} of ${totalPages}`;
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
  if (confirm("Delete this link?")) {
    db.ref("links/" + alias).remove();
    db.ref("clicks/" + alias).remove();
    loadLinks();
  }
}

// 🔒 Ban System
function banIp() {
  const ip = document.getElementById("banIpInput").value.trim();
  if (ip) {
    db.ref("banned/" + ip).set(true).then(() => {
      document.getElementById("banIpInput").value = "";
      loadBannedIps();
    });
  }
}

function unbanIp(ip) {
  db.ref("banned/" + ip).remove().then(loadBannedIps);
}

function loadBannedIps() {
  db.ref("banned").once("value").then(snapshot => {
    const list = document.getElementById("bannedList");
    list.innerHTML = "";
    const banned = snapshot.val() || {};
    Object.keys(banned).forEach(ip => {
      const li = document.createElement("li");
      li.innerHTML = `${ip} <button onclick="unbanIp('${ip}')" class="auth-button">Unban</button>`;
      list.appendChild(li);
    });
  });
}
