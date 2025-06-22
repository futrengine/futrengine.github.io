const btn = document.getElementById('spinBtn');
const resultBox = document.getElementById('resultBox');

const rewards = ["10 Coins", "Extra Spin", "Try Again", "💸 100 Coins", "🎁 Jackpot!"];

btn.onclick = () => {
  const win = rewards[Math.floor(Math.random() * rewards.length)];
  resultBox.innerHTML = `🎉 You won: <b>${win}</b>`;
  // Send data to server (Firebase or wherever)
};
