export function validateTaskInput(title) {
  if (!title || !title.trim()) {
    return 'Task title is required.';
  }

  if (title.trim().length < 3) {
    return 'Task title should be at least 3 characters.';
  }

  return null;
}

export function validateScheduleInput(title, day, time) {
  if (!title || !day || !time) {
    return 'Please complete all schedule fields.';
  }

  return null;
}

export function validateResourceInput(query) {
  if (!query || !query.trim()) {
    return 'Please type a topic first.';
  }

  return null;
}
