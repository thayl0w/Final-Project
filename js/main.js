import { STORAGE_KEYS, load, save } from './storage.js';
import { initTheme } from './theme.js';
import { addTask, deleteTask, editTask, getTasks, toggleTask } from './tasks.js';
import { addSchedule, deleteSchedule, getSchedules } from './schedule.js';
import { getTimerState, pauseTimer, resetTimer, startTimer } from './timer.js';
import { fetchQuote, searchYouTubeVideos } from './api.js';
import {
  renderProgress,
  renderQuote,
  renderResources,
  renderScheduleGrid,
  renderSchedules,
  renderTasks,
  renderTimer
} from './ui.js';
import { validateResourceInput } from './validation.js';

const taskForm = document.querySelector('#taskForm');
const addTaskQuickBtn = document.querySelector('#addTaskQuickBtn');
const taskTitle = document.querySelector('#taskTitle');
const taskSubject = document.querySelector('#taskSubject');
const taskDue = document.querySelector('#taskDue');
const taskList = document.querySelector('#taskList');
const filterButtons = document.querySelectorAll('.filter-btn');
const topNavLinks = document.querySelectorAll('.top-nav a');

const scheduleForm = document.querySelector('#scheduleForm');
const addScheduleQuickBtn = document.querySelector('#addScheduleQuickBtn');
const scheduleTitle = document.querySelector('#scheduleTitle');
const scheduleDay = document.querySelector('#scheduleDay');
const scheduleTime = document.querySelector('#scheduleTime');
const scheduleList = document.querySelector('#scheduleList');
const scheduleGrid = document.querySelector('#scheduleGrid');

const timerMode = document.querySelector('#timerMode');
const timerDisplay = document.querySelector('#timerDisplay');
const startTimerBtn = document.querySelector('#startTimerBtn');
const pauseTimerBtn = document.querySelector('#pauseTimerBtn');
const resetTimerBtn = document.querySelector('#resetTimerBtn');

const progressRate = document.querySelector('#progressRate');
const progressFill = document.querySelector('#progressFill');

const quoteText = document.querySelector('#quoteText');
const quoteAuthor = document.querySelector('#quoteAuthor');
const newQuoteBtn = document.querySelector('#newQuoteBtn');

const themeToggle = document.querySelector('#themeToggle');

const resourceForm = document.querySelector('#resourceForm');
const resourceQuery = document.querySelector('#resourceQuery');
const youtubeKey = document.querySelector('#youtubeKey');
const resourceResults = document.querySelector('#resourceResults');

youtubeKey.value = load(STORAGE_KEYS.youtubeKey, '');

let activeFilter = 'all';

taskForm.style.display = 'none';
scheduleForm.style.display = 'none';

initTheme(themeToggle);

addTaskQuickBtn.addEventListener('click', () => {
  taskForm.style.display = taskForm.style.display === 'none' ? 'grid' : 'none';
  if (taskForm.style.display === 'grid') {
    taskTitle.focus();
  }
});

addScheduleQuickBtn.addEventListener('click', () => {
  scheduleForm.style.display = scheduleForm.style.display === 'none' ? 'grid' : 'none';
  if (scheduleForm.style.display === 'grid') {
    scheduleTitle.focus();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    refreshTasks();
  });
});

topNavLinks.forEach((link) => {
  link.addEventListener('click', () => {
    topNavLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const result = addTask(taskTitle.value, taskSubject.value, taskDue.value);

  if (result.error) {
    alert(result.error);
    return;
  }

  taskForm.reset();
  taskForm.style.display = 'none';
  refreshTasks();
});

scheduleForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const result = addSchedule(scheduleTitle.value, scheduleDay.value, scheduleTime.value);

  if (result.error) {
    alert(result.error);
    return;
  }

  scheduleForm.reset();
  scheduleForm.style.display = 'none';
  refreshSchedules();
});

startTimerBtn.addEventListener('click', () => {
  startTimer(refreshTimer, refreshTimer);
});

pauseTimerBtn.addEventListener('click', () => {
  pauseTimer();
  refreshTimer();
});

resetTimerBtn.addEventListener('click', () => {
  resetTimer(refreshTimer);
});

newQuoteBtn.addEventListener('click', async () => {
  const quote = await fetchQuote();
  renderQuote(quoteText, quoteAuthor, quote);
});

resourceForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const query = resourceQuery.value.trim();
  const validationError = validateResourceInput(query);
  if (validationError) {
    alert(validationError);
    return;
  }

  const key = youtubeKey.value.trim();
  save(STORAGE_KEYS.youtubeKey, key);

  resourceResults.innerHTML = '<p>Searching...</p>';

  try {
    const result = await searchYouTubeVideos(query, key);
    renderResources(resourceResults, result);
  } catch (error) {
    resourceResults.innerHTML = `<p>${error.message}</p>`;
  }
});

function refreshTasks() {
  const allTasks = getTasks();
  const visibleTasks = allTasks.filter((task) => {
    if (activeFilter === 'active') return !task.done;
    if (activeFilter === 'completed') return task.done;
    return true;
  });

  renderTasks(taskList, visibleTasks, {
    onToggle(id) {
      toggleTask(id);
      refreshTasks();
    },
    onDelete(id) {
      deleteTask(id);
      refreshTasks();
    },
    onEdit(task) {
      const newTitle = prompt('Edit task title', task.title);
      if (newTitle === null) return;
      const newSubject = prompt('Edit subject', task.subject || '');
      if (newSubject === null) return;
      const newDueDate = prompt('Edit due date (YYYY-MM-DD)', task.dueDate || '');
      if (newDueDate === null) return;

      const result = editTask(task.id, {
        title: newTitle,
        subject: newSubject,
        dueDate: newDueDate
      });

      if (result.error) {
        alert(result.error);
      }

      refreshTasks();
    }
  });

  renderProgress(allTasks, {
    rate: progressRate,
    fill: progressFill
  });
}

function refreshSchedules() {
  const schedules = getSchedules();
  renderSchedules(scheduleList, schedules, (id) => {
    deleteSchedule(id);
    refreshSchedules();
  });
  renderScheduleGrid(scheduleGrid, schedules);
}

function refreshTimer() {
  renderTimer(timerMode, timerDisplay, getTimerState());
}

async function init() {
  refreshTasks();
  refreshSchedules();
  refreshTimer();
  const quote = await fetchQuote();
  renderQuote(quoteText, quoteAuthor, quote);
}

init();
