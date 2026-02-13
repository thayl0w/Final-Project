import { initTheme } from './theme.js';
import { addSchedule, deleteSchedule, getSchedules, updateSchedule } from './schedule.js';
import { renderScheduleGrid, renderSchedules } from './ui.js';

const themeToggle = document.querySelector('#themeToggle');
const scheduleForm = document.querySelector('#scheduleForm');
const addScheduleQuickBtn = document.querySelector('#addScheduleQuickBtn');
const scheduleTitle = document.querySelector('#scheduleTitle');
const scheduleDay = document.querySelector('#scheduleDay');
const scheduleTime = document.querySelector('#scheduleTime');
const scheduleList = document.querySelector('#scheduleList');
const scheduleGrid = document.querySelector('#scheduleGrid');
const weekHead = document.querySelector('.week-head');

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

initTheme(themeToggle);

addScheduleQuickBtn.addEventListener('click', () => {
  scheduleTitle.focus();
  scheduleForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

weekHead.addEventListener('click', (event) => {
  const target = event.target.closest('[data-day]');
  if (!target) {
    return;
  }

  scheduleDay.value = target.dataset.day;
  scheduleTitle.focus();
});

scheduleGrid.addEventListener('click', (event) => {
  if (event.target.closest('.schedule-block')) {
    return;
  }

  const rect = scheduleGrid.getBoundingClientRect();
  const xRatio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 0.9999);
  const yRatio = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 0.9999);

  const dayIndex = Math.floor(xRatio * 7);
  const hour = Math.min(Math.max(6 + Math.floor(yRatio * 14), 0), 23);

  scheduleDay.value = dayNames[dayIndex] || 'Monday';
  scheduleTime.value = `${String(hour).padStart(2, '0')}:00`;
  scheduleTitle.focus();
});

scheduleForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const result = addSchedule(scheduleTitle.value, scheduleDay.value, scheduleTime.value);

  if (result.error) {
    alert(result.error);
    return;
  }

  scheduleForm.reset();
  refreshSchedules();
});

function refreshSchedules() {
  const schedules = getSchedules();

  renderSchedules(scheduleList, schedules, (id) => {
    deleteSchedule(id);
    refreshSchedules();
  }, (entry) => {
    editEntry(entry);
  });

  renderScheduleGrid(scheduleGrid, schedules, (entry) => {
    editEntry(entry);
  });
}

function editEntry(entry) {
  const newTitle = prompt('Edit session title', entry.title);
  if (newTitle === null) return;

  const newDay = prompt('Edit day (Monday-Sunday)', entry.day);
  if (newDay === null) return;

  const newTime = prompt('Edit time (HH:MM)', entry.time);
  if (newTime === null) return;

  const result = updateSchedule(entry.id, {
    title: newTitle,
    day: normalizeDay(newDay),
    time: normalizeTime(newTime)
  });

  if (result.error) {
    alert(result.error);
    return;
  }

  refreshSchedules();
}

function normalizeDay(rawDay) {
  const value = (rawDay || '').trim().toLowerCase();
  const shortMap = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday'
  };

  if (shortMap[value]) {
    return shortMap[value];
  }

  const match = dayNames.find((day) => day.toLowerCase() === value);
  return match || rawDay;
}

function normalizeTime(rawTime) {
  const value = (rawTime || '').trim();
  const shortMatch = value.match(/^(\d{1,2}):(\d{2})$/);
  if (shortMatch) {
    const hour = Number(shortMatch[1]);
    const minute = Number(shortMatch[2]);
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
  }
  return value;
}

refreshSchedules();
