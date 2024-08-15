

// Replace 'your_timezone' with the desired time zone
const timezone = 'Asia/Kolkata';

function displayTime() {
    const now = new Date();
    const options = { timeZone: timezone };
    const formattedTime = now.toLocaleTimeString('en-US', options);
    document.getElementById('time').textContent = formattedTime;
}

setInterval(displayTime, 1000); // Update time every second
