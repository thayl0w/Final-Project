const STORAGE_KEYS = {
  tasks: 'sbp_tasks',
  schedules: 'sbp_schedules',
  theme: 'sbp_theme',
  youtubeKey: 'sbp_youtube_key',
  timerSessions: 'sbp_timer_sessions',
  users: 'sbp_users',
  session: 'sbp_session'
};

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function remove(key) {
  localStorage.removeItem(key);
}

export { STORAGE_KEYS };
