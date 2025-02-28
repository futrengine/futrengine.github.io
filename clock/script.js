document.addEventListener("DOMContentLoaded", function () {
    // Request notification permission on page load
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted.");
            }
        });
    }

    // CLOCK FUNCTION
    function updateClock() {
        let now = new Date();
        document.getElementById("clock").innerText = now.toLocaleTimeString();
    }
    setInterval(updateClock, 1000);

    // TAB SWITCHING FUNCTIONALITY
    function showTab(tabId) {
        document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
        document.getElementById(tabId).classList.add("active");
    }

    document.getElementById("alarm-tab").addEventListener("click", () => showTab("alarm"));
    document.getElementById("timer-tab").addEventListener("click", () => showTab("timer"));
    document.getElementById("stopwatch-tab").addEventListener("click", () => showTab("stopwatch"));

    showTab("alarm"); // Show Alarm tab by default

    // NOTIFICATION FUNCTION
    function showNotification(title, message) {
        if (Notification.permission === "granted") {
            new Notification(title, { body: message, icon: "https://futrengine.github.io/images/alarm-icon.png" });
        } else {
            console.log("Notifications are blocked.");
        }
    }

    // ALARM FUNCTIONALITY
    let alarmTime = null;
    let alarmTimeout;
    let alarmSound = document.getElementById("alarm-sound");

    function checkAlarm() {
        if (alarmTime) {
            let now = new Date();
            let currentTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
            if (alarmTime === currentTime) {
                alarmSound.play();
                showNotification("⏰ Alarm!", "Your alarm is ringing!");
                clearAlarm();
            }
        }
        alarmTimeout = setTimeout(checkAlarm, 1000);
    }

    document.getElementById("set-alarm").addEventListener("click", function () {
        alarmTime = document.getElementById("alarm-time").value;
        document.getElementById("alarm-message").innerText = `Alarm set for ${alarmTime}`;
        checkAlarm();
    });

    function clearAlarm() {
        alarmTime = null;
        clearTimeout(alarmTimeout);
        document.getElementById("alarm-message").innerText = "Alarm Cleared";
    }
    document.getElementById("clear-alarm").addEventListener("click", clearAlarm);

    // TIMER FUNCTIONALITY
    let timerInterval;

    function startTimer() {
        let minutes = parseInt(document.getElementById("timer-minutes").value) || 0;
        let seconds = parseInt(document.getElementById("timer-seconds").value) || 0;
        let totalTime = minutes * 60 + seconds;

        function updateTimer() {
            if (totalTime <= 0) {
                clearInterval(timerInterval);
                alarmSound.play();
                showNotification("⏳ Timer Finished!", "Your countdown has ended!");
            } else {
                totalTime--;
                let mins = Math.floor(totalTime / 60).toString().padStart(2, "0");
                let secs = (totalTime % 60).toString().padStart(2, "0");
                document.getElementById("timer-display").innerText = `${mins}:${secs}`;
            }
        }

        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
    }
    document.getElementById("start-timer").addEventListener("click", startTimer);

    // STOPWATCH FUNCTIONALITY
    let stopwatchTime = 0;
    let stopwatchInterval;

    function startStopwatch() {
        clearInterval(stopwatchInterval);
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            let mins = Math.floor(stopwatchTime / 6000).toString().padStart(2, "0");
            let secs = Math.floor((stopwatchTime % 6000) / 100).toString().padStart(2, "0");
            let ms = (stopwatchTime % 100).toString().padStart(2, "0");
            document.getElementById("stopwatch-display").innerText = `${mins}:${secs}.${ms}`;
        }, 10);
    }
    document.getElementById("start-stopwatch").addEventListener("click", startStopwatch);
});
