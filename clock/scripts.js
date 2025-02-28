document.addEventListener("DOMContentLoaded", function() {
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

    // Add event listeners for tab buttons
    document.getElementById("alarm-tab").addEventListener("click", () => showTab("alarm"));
    document.getElementById("timer-tab").addEventListener("click", () => showTab("timer"));
    document.getElementById("stopwatch-tab").addEventListener("click", () => showTab("stopwatch"));

    showTab("alarm"); // Show Alarm tab by default

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
                alert("⏰ Alarm Time!");
                clearAlarm();
            }
        }
        alarmTimeout = setTimeout(checkAlarm, 1000);
    }

    document.getElementById("set-alarm").addEventListener("click", function() {
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
                alert("🎉 Timer Finished!");
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
});
