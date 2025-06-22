import { db } from './firebase-config.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const spinBtn = document.getElementById('spinBtn');
const resultBox = document.getElementById('resultBox');

const rewards = ["🎁 10 Coins", "💸 50 Coins", "😢 Try Again", "🎉 100 Coins", "🔥 JACKPOT!"];

const userId = Telegram.WebApp.initDataUnsafe?.user?.id || Math.floor(Math.random() * 9999999999);

async function canSpinToday() {
  const today = new Date().toISOString().split('T')[0];
  const docRef = doc(db, "users", userId.toString());
  const userSnap = await getDoc(docRef);
  if (userSnap.exists()) {
    return userSnap.data().lastSpin !== today;
  }
  return true;
}

async function updateSpinDate() {
  const today = new Date().toISOString().split('T')[0];
  await setDoc(doc(db, "users", userId.toString()), { lastSpin: today });
}

spinBtn.onclick = async () => {
  if (await canSpinToday()) {
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    resultBox.innerHTML = `🎉 You won: <b>${reward}</b>`;
    await updateSpinDate();
  } else {
    resultBox.innerHTML = `❌ You already spun today! Come back tomorrow.`;
  }
};
