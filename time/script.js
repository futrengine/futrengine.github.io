function displayTime() {
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata' };
    const formattedTime = now.toLocaleTimeString('en-IN', options);
    document.getElementById('time').textContent = formattedTime;
}

setInterval(displayTime, 1000); // Update every second
