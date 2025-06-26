const API_URL = 'http://localhost:3000/api/tasks';

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const newTask = await res.json();
    renderTask(newTask);
    input.value = '';
  }
});

async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  tasks.forEach(renderTask);
}

function renderTask(task) {
  const li = document.createElement('li');
  li.textContent = task.text;
  if (task.done) li.classList.add('done');

  li.addEventListener('click', async () => {
    await fetch(`${API_URL}/${task.id}`, { method: 'PUT' });
    li.classList.toggle('done');
  });

  const btn = document.createElement('button');
  btn.textContent = 'Eliminar';
  btn.classList.add('delete-btn');
  btn.addEventListener('click', async (e) => {
    e.stopPropagation();
    await fetch(`${API_URL}/${task.id}`, { method: 'DELETE' });
    li.remove();
  });

  li.appendChild(btn);
  list.appendChild(li);
}

document.addEventListener('DOMContentLoaded', loadTasks);
