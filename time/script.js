function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  document.querySelector('.hours').textContent = hours;
  document.querySelector('.minutes').textContent = minutes;
  document.querySelector('.seconds').textContent = seconds;
  document.querySelector('.milliseconds').textContent = milliseconds.toString().padStart(3, '0');
}

setInterval(updateClock, 10); // Update every 10 milliseconds
