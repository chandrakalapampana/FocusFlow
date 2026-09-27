// ==========================================
// FocusFlow - Pomodoro Timer
// ==========================================

let timerInterval = null;
let timerSeconds = 25 * 60;
let timerRunning = false;
let focusSessions = 0;


// ==========================================
// Get Timer Elements
// ==========================================

function getTimerElements() {

    const timerCircle =
        document.querySelector(".timer-circle");

    if (!timerCircle) {
        return null;
    }

    return {
        display: timerCircle.querySelector("strong"),
        sessionText: timerCircle.querySelector("small"),
        startButton: document.querySelector(
            ".timer-buttons button:first-child"
        ),
        resetButton: document.querySelector(
            ".timer-buttons button:nth-child(2)"
        ),
        status: document.querySelector(
            ".focus-card .status"
        ),
        progress: document.querySelector(
            ".focus-card .progress-bar span"
        )
    };
}


// ==========================================
// Format Time
// ==========================================

function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}


// ==========================================
// Update Timer Display
// ==========================================

function updateTimerDisplay() {

    const elements =
        getTimerElements();

    if (!elements) return;


    const formatted =
        formatTime(timerSeconds);


    if (elements.display) {
        elements.display.textContent =
            formatted;
    }


    if (elements.sessionText) {
        elements.sessionText.textContent =
            `${focusSessions} sessions`;
    }


    const progress =
        ((25 * 60 - timerSeconds) /
        (25 * 60)) * 100;


    if (elements.progress) {
        elements.progress.style.width =
            `${Math.max(0, progress)}%`;
    }


    document.title =
        `${formatted} • FocusFlow`;

}


// ==========================================
// Update Status
// ==========================================

function updateTimerStatus(message) {

    const elements =
        getTimerElements();

    if (!elements || !elements.status) {
        return;
    }

    elements.status.textContent =
        message;
}


// ==========================================
// Start Timer
// ==========================================

function startTimer() {

    if (timerRunning) return;

    timerRunning = true;

    updateTimerStatus("FOCUSING");

    const elements =
        getTimerElements();

    if (elements && elements.startButton) {
        elements.startButton.textContent =
            "⏸ Pause";
    }


    timerInterval =
        setInterval(() => {

            if (timerSeconds > 0) {

                timerSeconds--;

                updateTimerDisplay();

            } else {

                completeTimer();

            }

        }, 1000);

}


// ==========================================
// Pause Timer
// ==========================================

function pauseTimer() {

    timerRunning = false;

    clearInterval(timerInterval);

    timerInterval = null;

    updateTimerStatus("PAUSED");


    const elements =
        getTimerElements();

    if (elements && elements.startButton) {
        elements.startButton.textContent =
            "▶ Start";
    }

}


// ==========================================
// Reset Timer
// ==========================================

function resetTimer() {

    pauseTimer();

    timerSeconds =
        25 * 60;

    updateTimerDisplay();

    updateTimerStatus("READY");

    const elements =
        getTimerElements();

    if (elements && elements.startButton) {
        elements.startButton.textContent =
            "▶ Start";
    }

}


// ==========================================
// Timer Complete
// ==========================================

function completeTimer() {

    pauseTimer();

    timerSeconds = 0;

    focusSessions++;

    Storage.set(
        "focusflow_sessions",
        focusSessions
    );

    updateTimerDisplay();

    updateTimerStatus("COMPLETED 🎉");

    updateDashboardSessions();

    playTimerSound();


    setTimeout(() => {

        alert(
            "Focus session complete! 🎉\n\nTake a short break."
        );

        resetTimer();

    }, 100);

}


// ==========================================
// Timer Sound
// ==========================================

function playTimerSound() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) return;

        const audio =
            new AudioContext();

        const oscillator =
            audio.createOscillator();

        const gain =
            audio.createGain();

        oscillator.connect(gain);

        gain.connect(audio.destination);

        oscillator.frequency.value = 800;

        gain.gain.value = 0.15;

        oscillator.start();

        oscillator.stop(
            audio.currentTime + 0.4
        );

    } catch (error) {

        console.log(
            "Timer sound unavailable."
        );

    }

}


// ==========================================
// Dashboard Session Count
// ==========================================

function updateDashboardSessions() {

    const element =
        document.getElementById(
            "focusSessions"
        );

    if (element) {
        element.textContent =
            focusSessions;
    }

}


// ==========================================
// Setup Timer Buttons
// ==========================================

function setupTimerButtons() {

    const elements =
        getTimerElements();

    if (!elements) return;


    if (elements.startButton) {

        elements.startButton.addEventListener(
            "click",
            function() {

                if (timerRunning) {
                    pauseTimer();
                } else {
                    startTimer();
                }

            }
        );

    }


    if (elements.resetButton) {

        elements.resetButton.addEventListener(
            "click",
            resetTimer
        );

    }

}


// ==========================================
// Initialize Timer
// ==========================================

function initializeTimer() {

    focusSessions =
        Storage.get(
            "focusflow_sessions",
            0
        );

    updateTimerDisplay();

    updateDashboardSessions();

    setupTimerButtons();

}


// ==========================================
// Start
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeTimer
);