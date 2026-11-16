"use strict";

const modes = {
  focus: {
    seconds: 25 * 60,
    label: "Time to focus",
    completed: "Focus session complete. Time for a break!"
  },
  short: {
    seconds: 5 * 60,
    label: "Take a short break",
    completed: "Short break complete. Ready to focus?"
  },
  long: {
    seconds: 15 * 60,
    label: "Enjoy a longer rest",
    completed: "Long break complete. Ready for a fresh start?"
  }
};

const timerDisplay = document.querySelector("#timer");
const modeLabel = document.querySelector("#mode-label");
const progress = document.querySelector("#progress");
const startPauseButton = document.querySelector("#start-pause");
const resetButton = document.querySelector("#reset");
const statusDisplay = document.querySelector("#status");
const sessionCountDisplay = document.querySelector("#session-count");
const modeButtons = document.querySelectorAll("[data-mode]");

const SESSION_COUNT_KEY = "ruyiPomodoroCompletedFocusSessions";

let completedFocusSessions = loadCompletedFocusSessions();
let currentMode = "focus";
let remainingMilliseconds = modes[currentMode].seconds * 1000;
let deadline = 0;
let intervalId = null;
let running = false;

function loadCompletedFocusSessions() {
  try {
    const savedCount = Number.parseInt(
      window.localStorage.getItem(SESSION_COUNT_KEY) ?? "0",
      10
    );

    return Number.isFinite(savedCount) && savedCount > 0 ? savedCount : 0;
  } catch {
    return 0;
  }
}

function saveCompletedFocusSessions() {
  try {
    window.localStorage.setItem(
      SESSION_COUNT_KEY,
      String(completedFocusSessions)
    );
  } catch {
    // The counter still works for this app session if storage is unavailable.
  }
}

function formatTime(milliseconds) {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function render() {
  const formattedTime = formatTime(remainingMilliseconds);
  const totalSeconds = modes[currentMode].seconds;

  timerDisplay.textContent = formattedTime;
  sessionCountDisplay.textContent = String(completedFocusSessions);
  modeLabel.textContent = modes[currentMode].label;
  progress.max = totalSeconds;
  progress.value = totalSeconds - remainingMilliseconds / 1000;

  if (remainingMilliseconds === 0) {
    document.title = "Session complete | Focus Timer";
  } else {
    document.title = `${formattedTime} | Focus Timer`;
  }

  if (running) {
    startPauseButton.textContent = "Pause";
  } else if (remainingMilliseconds === 0) {
    startPauseButton.textContent = "Start again";
  } else if (remainingMilliseconds < totalSeconds * 1000) {
    startPauseButton.textContent = "Resume";
  } else {
    startPauseButton.textContent = "Start";
  }

  modeButtons.forEach((button) => {
    const selected = button.dataset.mode === currentMode;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function stopInterval() {
  window.clearInterval(intervalId);
  intervalId = null;
  running = false;
}

function finishSession() {
  stopInterval();

  if (currentMode === "focus") {
    completedFocusSessions += 1;
    saveCompletedFocusSessions();
  }

  remainingMilliseconds = 0;
  statusDisplay.textContent = modes[currentMode].completed;
  render();
}

function updateTimer() {
  if (!running) {
    return;
  }

  remainingMilliseconds = Math.max(0, deadline - Date.now());

  if (remainingMilliseconds === 0) {
    finishSession();
    return;
  }

  render();
}

function startTimer() {
  if (remainingMilliseconds === 0) {
    remainingMilliseconds = modes[currentMode].seconds * 1000;
  }

  deadline = Date.now() + remainingMilliseconds;
  running = true;
  statusDisplay.textContent =
    currentMode === "focus"
      ? "You’ve got this. One task at a time."
      : "Step away, stretch, and recharge.";

  intervalId = window.setInterval(updateTimer, 250);
  render();
}

function pauseTimer() {
  updateTimer();

  // Updating may finish a session before the pause is applied.
  if (!running) {
    return;
  }

  stopInterval();
  statusDisplay.textContent = "Paused. Continue when you’re ready.";
  render();
}

function resetTimer() {
  stopInterval();
  remainingMilliseconds = modes[currentMode].seconds * 1000;
  statusDisplay.textContent = "Ready when you are.";
  render();
}

function selectMode(mode) {
  if (mode === currentMode || !Object.hasOwn(modes, mode)) {
    return;
  }

  currentMode = mode;
  resetTimer();
}

startPauseButton.addEventListener("click", () => {
  if (running) {
    pauseTimer();
  } else {
    startTimer();
  }
});

resetButton.addEventListener("click", resetTimer);

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectMode(button.dataset.mode);
  });
});

// Refresh immediately when returning to the tab.
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    updateTimer();
  }
});

render();