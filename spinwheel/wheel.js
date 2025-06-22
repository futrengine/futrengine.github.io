import { db } from './firebase-config.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const rewards = [
  { label: "10 Coins", value: 10, color: "#f39c12" },
  { label: "50 Coins", value: 50, color: "#e74c3c" },
  { label: "Try Again", value: 0, color: "#95a5a6" },
  { label: "100 Coins", value: 100, color: "#16a085" },
  { label: "Jackpot!", value: 500, color: "#f1c40f" },
];

const tg = window.Telegram.WebApp;
const userId = tg.initDataUnsafe.user.id;
const today = new Date().toISOString().split('T')[0];

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const btn = document.getElementById('spinBtn');
const resultBox = document.getElementById('resultBox');

const arcSize = (2 * Math.PI) / rewards.length;
let currentAngle = 0, spinning = false;

function drawWheel() {
  ctx.clearRect(0, 0, 500, 500);
  ctx.font = 'bold 16px sans-serif';
  rewards.forEach((seg, i) => {
    const ang = currentAngle + i * arcSize;
    ctx.beginPath();
    ctx.fillStyle = seg.color;
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 250, ang, ang + arcSize);
    ctx.fill();
    ctx.save();
    ctx.translate(250 + Math.cos(ang + arcSize/2) * 180,
                  250 + Math.sin(ang + arcSize/2) * 180);
    ctx.rotate(ang + arcSize/2 + Math.PI/2);
    ctx.fillStyle = "#fff";
    ctx.fillText(seg.label, -ctx.measureText(seg.label).width/2, 0);
    ctx.restore();
  });
}

async function canSpin() {
  const snap = await getDoc(doc(db, 'users', userId + ''));
  return !snap.exists() || snap.data().lastSpin !== today;
}

async function recordSpin() {
  await setDoc(doc(db, 'users', userId + ''), { lastSpin: today }, { merge: true });
}

function pickReward() {
  return rewards[Math.floor(Math.random() * rewards.length)];
}

btn.onclick = async () => {
  if (spinning) return;
  if (!await canSpin()) {
    resultBox.textContent = "❌ You already spun today.";
    return;
  }
  spinning = true;
  await recordSpin();

  const reward = pickReward();
  const targetAngle = rewards.indexOf(reward) * arcSize + arcSize/2;
  const spins = 5;
  const finalAngle = (2 * Math.PI * spins) + (2 * Math.PI - targetAngle);

  const duration = 5000;
  const start = performance.now();

  function animate(now) {
    const t = Math.min((now - start) / duration, 1);
    currentAngle = t * finalAngle;
    drawWheel();
    if (t < 1) requestAnimationFrame(animate);
    else {
      resultBox.innerHTML = `🎉 You won: <b>${reward.label}</b>`;
      spinning = false;
    }
  }
  requestAnimationFrame(animate);
};

drawWheel();
