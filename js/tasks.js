import { load, save, STORAGE_KEYS } from './storage.js';
import { validateTaskInput } from './validation.js';

let tasks = load(STORAGE_KEYS.tasks, []);

export function getTasks() {
  return tasks;
}

export function addTask(title, subject, dueDate) {
  const error = validateTaskInput(title);
  if (error) {
    return { error };
  }

  const task = {
    id: crypto.randomUUID(),
    title: title.trim(),
    subject: subject.trim(),
    dueDate: dueDate || '',
    done: false,
    createdAt: Date.now()
  };

  tasks.unshift(task);
  persist();
  return { task };
}

export function toggleTask(id) {
  tasks = tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task);
  persist();
}

export function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  persist();
}

export function editTask(id, updates) {
  const error = validateTaskInput(updates.title);
  if (error) {
    return { error };
  }

  tasks = tasks.map((task) => task.id === id ? {
    ...task,
    title: updates.title.trim(),
    subject: (updates.subject || '').trim(),
    dueDate: updates.dueDate || task.dueDate
  } : task);

  persist();
  return { ok: true };
}

function persist() {
  save(STORAGE_KEYS.tasks, tasks);
}
