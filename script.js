const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

const tipBtn = document.getElementById('tip-btn');
const tipText = document.getElementById('tip-text');
const aiBtn = document.getElementById('ai-btn');
const aiText = document.getElementById('ai-text');

const todos = [];

function render() {
  list.innerHTML = '';

  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.done ? 'done' : ''}`;

    const text = document.createElement('span');
    text.className = 'text';
    text.textContent = todo.text;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = todo.done ? 'Undo' : 'Done';
    toggleBtn.addEventListener('click', () => {
      todo.done = !todo.done;
      render();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      todos.splice(index, 1);
      render();
    });

    actions.append(toggleBtn, deleteBtn);
    li.append(text, actions);
    list.appendChild(li);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  todos.unshift({ text, done: false });
  input.value = '';
  input.focus();
  render();
});

const PRODUCTIVITY_TIPS = [
  'Do the hardest task first for 25 minutes.',
  'If a task takes less than 2 minutes, do it now.',
  'Break big tasks into the next smallest action.',
  'Set 3 priorities for the day, not 30.',
  'Batch similar tasks to reduce context switching.'
];

tipBtn.addEventListener('click', () => {
  tipBtn.disabled = true;
  tipText.textContent = 'Loading tip...';

  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * PRODUCTIVITY_TIPS.length);
    tipText.textContent = PRODUCTIVITY_TIPS[randomIndex];
    tipBtn.disabled = false;
  }, 200);
});

aiBtn.addEventListener('click', async () => {
  const task = input.value.trim();
  if (!task) {
    aiText.textContent = 'Please type a task first.';
    return;
  }

  aiBtn.disabled = true;
  aiText.textContent = 'Thinking...';

  try {
    const res = await fetch('/api/aiSuggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'AI request failed');

    const result = data.result || {};
    if (result.raw) {
      aiText.textContent = `AI: ${result.raw}`;
    } else {
      aiText.textContent = `Priority: ${result.priority || 'n/a'} • Est: ${result.estimateMinutes || '?'} min • First step: ${result.firstStep || 'n/a'}`;
    }
  } catch (err) {
    aiText.textContent = `AI unavailable: ${err.message}`;
  } finally {
    aiBtn.disabled = false;
  }
});
