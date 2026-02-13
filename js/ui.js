import { formatTime } from './timer.js';

const dayIndex = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6
};

export function renderTasks(taskListEl, tasks, handlers) {
  taskListEl.innerHTML = '';

  if (!tasks.length) {
    taskListEl.innerHTML = '<li class="task-item"><div class="task-content"><p class="task-title">No tasks yet.</p></div></li>';
    return;
  }

  tasks.forEach((task) => {
    const node = document.createElement('li');
    node.className = 'task-item';

    const label = document.createElement('label');
    label.className = 'task-check';

    const toggleInput = document.createElement('input');
    toggleInput.className = 'toggle-input';
    toggleInput.type = 'checkbox';
    label.appendChild(toggleInput);

    const content = document.createElement('div');
    content.className = 'task-content';

    const titleEl = document.createElement('p');
    titleEl.className = 'task-title';

    const metaEl = document.createElement('p');
    metaEl.className = 'task-meta';

    content.appendChild(titleEl);
    content.appendChild(metaEl);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'edit-btn ghost-btn';
    editBtn.textContent = 'Edit';

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn ghost-btn';
    deleteBtn.textContent = 'Delete';

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    node.appendChild(label);
    node.appendChild(content);
    node.appendChild(actions);

    titleEl.textContent = task.title;
    metaEl.textContent = [task.subject || 'General', task.dueDate ? `Due: ${task.dueDate}` : 'No due date'].join(' | ');

    node.classList.toggle('done', task.done);
    toggleInput.checked = task.done;

    toggleInput.addEventListener('change', () => handlers.onToggle(task.id));
    deleteBtn.addEventListener('click', () => handlers.onDelete(task.id));
    editBtn.addEventListener('click', () => handlers.onEdit(task));

    taskListEl.appendChild(node);
  });
}

export function renderSchedules(scheduleListEl, schedules, onDelete, onEdit) {
  scheduleListEl.innerHTML = '';

  if (!schedules.length) {
    scheduleListEl.innerHTML = '<li class="schedule-item"><p class="schedule-main">No schedule sessions yet.</p></li>';
    return;
  }

  schedules.forEach((entry) => {
    const node = document.createElement('li');
    node.className = 'schedule-item';

    const main = document.createElement('p');
    main.className = 'schedule-main';
    main.textContent = `${entry.day} ${entry.time} - ${entry.title}`;
    if (onEdit) {
      main.style.cursor = 'pointer';
      main.title = 'Click to edit';
      main.addEventListener('click', () => onEdit(entry));
    }
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-schedule-btn ghost-btn';
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => onDelete(entry.id));

    node.appendChild(main);
    node.appendChild(deleteBtn);
    scheduleListEl.appendChild(node);
  });
}

export function renderScheduleGrid(container, schedules, onEdit) {
  container.innerHTML = '';

  schedules.slice(0, 8).forEach((entry, idx) => {
    const day = dayIndex[entry.day] ?? 0;
    const [hourString] = (entry.time || '08:00').split(':');
    const hour = Number(hourString);

    const block = document.createElement('article');
    block.className = 'schedule-block';
    block.style.width = '13%';
    block.style.left = `${1 + (day * 14.2)}%`;

    const topBand = Math.min(Math.max(((hour - 6) / 14) * 100, 0), 82);
    block.style.top = `${topBand}%`;
    block.style.height = '18%';

    if (idx % 2 === 1) {
      block.style.transform = 'translateY(6px)';
    }

    block.dataset.id = entry.id;
    block.title = `${entry.day} ${entry.time} - ${entry.title}`;
    block.textContent = `${entry.time} ${entry.title}`;
    if (onEdit) {
      block.style.cursor = 'pointer';
      block.addEventListener('click', (event) => {
        event.stopPropagation();
        onEdit(entry);
      });
    }
    container.appendChild(block);
  });
}

export function renderProgress(tasks, progressEls) {
  const doneCount = tasks.filter((task) => task.done).length;
  const rate = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  if (progressEls.rate) {
    progressEls.rate.textContent = `${rate}%`;
  }

  if (progressEls.fill) {
    progressEls.fill.style.width = `${rate}%`;
  }
}

export function renderTimer(timerModeEl, timerDisplayEl, timerState) {
  timerModeEl.textContent = timerState.mode === 'focus' ? 'Mode: Focus' : 'Mode: Break';
  timerDisplayEl.textContent = formatTime(timerState.remainingSeconds);
}

export function renderQuote(quoteTextEl, quoteAuthorEl, quote) {
  quoteTextEl.textContent = quote.content;
  quoteAuthorEl.textContent = `- ${quote.author}`;
}

export function renderResources(container, result) {
  container.innerHTML = '';

  if (!result.items.length && !result.warning) {
    container.innerHTML = '<p>No results found.</p>';
    return;
  }

  if (result.warning) {
    const note = document.createElement('p');
    note.textContent = result.warning;
    container.appendChild(note);
  }

  result.items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'resource-card';

    card.innerHTML = `
      <div class="play-placeholder">Play</div>
      <div>
        <h4>${item.title}</h4>
        <p>${item.channel}</p>
        <a href="${item.url}" target="_blank" rel="noopener noreferrer">Open video</a>
      </div>
    `;

    container.appendChild(card);
  });
}
