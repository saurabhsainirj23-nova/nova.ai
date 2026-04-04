document.addEventListener('DOMContentLoaded', () => {
})
let timer
let isRunning = false
let currentSession = 'Work'
let pomodoroCount = 0
let timeLeft = 0

let workDuration = 25 * 60
let shortBreakDuration = 5 * 60
let longBreakDuration = 15 * 60
let cyclesBeforeLongBreak = 4

function applySettings() {
  workDuration = parseInt(document.getElementById('workInput').value) * 60
  shortBreakDuration = parseInt(document.getElementById('shortInput').value) * 60
  longBreakDuration = parseInt(document.getElementById('longInput').value) * 60
  cyclesBeforeLongBreak = parseInt(document.getElementById('cycleInput').value)
  resetTimer()
}

function updateDisplay() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const seconds = String(timeLeft % 60).padStart(2, '0')
  document.getElementById('countdown').textContent = `${minutes}:${seconds}`
  document.getElementById('sessionType').textContent = `Session: ${currentSession}`
}

function updateProgress() {
  let progress = ''
  for (let i = 0; i < cyclesBeforeLongBreak; i++) {
    progress += i < pomodoroCount ? '🔴 ' : '⚪ '
  }
  document.getElementById('pomodoroProgress').textContent = progress.trim()
}

function startTimer() {
  if (isRunning) return

  if (timeLeft <= 0) {
    if (currentSession === 'Work') timeLeft = workDuration;
    else if (currentSession === 'Short Break') timeLeft = shortBreakDuration;
    else if (currentSession === 'Long Break') timeLeft = longBreakDuration;
  }

  isRunning = true;
  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      isRunning = false;
      handleSessionEnd();
    }
  }, 1000)
}

function pauseTimer() {
  clearInterval(timer)
  isRunning = false
}

function resetTimer() {
  clearInterval(timer)
  isRunning = false
  currentSession = 'Work'
  pomodoroCount = 0
  timeLeft = workDuration
  updateDisplay()
  updateProgress()
}

function handleSessionEnd() {
  if (currentSession === 'Work') {
    pomodoroCount++;
    if (pomodoroCount % cyclesBeforeLongBreak === 0) {
      currentSession = 'Long Break'
      timeLeft = longBreakDuration
    } else {
      currentSession = 'Short Break'
      timeLeft = shortBreakDuration
    }
  } else {
    currentSession = 'Work'
    timeLeft = workDuration
  }

  updateProgress()
  updateDisplay()
  startTimer()
}

// Attach button listeners
document.getElementById('startBtn').addEventListener('click', startTimer)
document.getElementById('pauseBtn').addEventListener('click', pauseTimer)
document.getElementById('resetBtn').addEventListener('click', resetTimer)
document.getElementById('applySettingsBtn').addEventListener('click', applySettings)

resetTimer()