function togglePlay(audioId) {
    var audio = document.getElementById(audioId);
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

function seekBack(audioId) {
    var audio = document.getElementById(audioId);
    audio.currentTime -= 10;
}

function seekForward(audioId) {
    var audio = document.getElementById(audioId);
    audio.currentTime += 10;
}

function updateSeek(audioId, seekBarId) {
    var audio = document.getElementById(audioId);
    var seekBar = document.getElementById(seekBarId);
    seekBar.value = (audio.currentTime / audio.duration) * 100;
}

function seekAudio(audioId, value) {
    var audio = document.getElementById(audioId);
    audio.currentTime = (value / 100) * audio.duration;
}
