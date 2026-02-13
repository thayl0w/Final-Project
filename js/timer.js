import { load, save, STORAGE_KEYS } from './storage.js';

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

let mode = 'focus';
let remainingSeconds = FOCUS_SECONDS;
let running = false;
let timerId = null;

const timerSessions = load(STORAGE_KEYS.timerSessions, { focusCompleted: 0 });

export function getTimerState() {
  return {
    mode,
    remainingSeconds,
    running,
    focusCompleted: timerSessions.focusCompleted
  };
}

export function startTimer(onTick, onSwitch) {
  if (running) {
    return;
  }

  running = true;
  timerId = setInterval(() => {
    remainingSeconds -= 1;

    if (remainingSeconds <= 0) {
      if (mode === 'focus') {
        timerSessions.focusCompleted += 1;
        save(STORAGE_KEYS.timerSessions, timerSessions);
      }

      mode = mode === 'focus' ? 'break' : 'focus';
      remainingSeconds = mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;
      onSwitch?.(mode);
    }

    onTick?.(getTimerState());
  }, 1000);
}

export function pauseTimer() {
  if (!running) {
    return;
  }

  running = false;
  clearInterval(timerId);
  timerId = null;
}

export function resetTimer(onTick) {
  pauseTimer();
  mode = 'focus';
  remainingSeconds = FOCUS_SECONDS;
  onTick?.(getTimerState());
}

export function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
