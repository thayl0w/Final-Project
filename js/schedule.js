import { load, save, STORAGE_KEYS } from './storage.js';
import { validateScheduleInput } from './validation.js';

let schedules = load(STORAGE_KEYS.schedules, []);
const dayOrder = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7
};

export function getSchedules() {
  return schedules;
}

export function addSchedule(title, day, time) {
  const error = validateScheduleInput(title, day, time);
  if (error) {
    return { error };
  }

  schedules.push({
    id: crypto.randomUUID(),
    title: title.trim(),
    day,
    time
  });

  sortSchedules();

  persist();
  return { ok: true };
}

export function deleteSchedule(id) {
  schedules = schedules.filter((entry) => entry.id !== id);
  persist();
}

export function updateSchedule(id, updates) {
  const error = validateScheduleInput(updates.title, updates.day, updates.time);
  if (error) {
    return { error };
  }

  schedules = schedules.map((entry) => entry.id === id ? {
    ...entry,
    title: updates.title.trim(),
    day: updates.day,
    time: updates.time
  } : entry);

  sortSchedules();
  persist();
  return { ok: true };
}

function sortSchedules() {
  schedules.sort((a, b) => {
    if (a.day === b.day) {
      return a.time.localeCompare(b.time);
    }
    return (dayOrder[a.day] || 99) - (dayOrder[b.day] || 99);
  });
}

function persist() {
  save(STORAGE_KEYS.schedules, schedules);
}
