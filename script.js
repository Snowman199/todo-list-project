const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

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
