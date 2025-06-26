
// Seleccionamos los elementos del DOM
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

// Inicializamos un array para almacenar las tareas
// y cargamos las tareas guardadas en localStorage al cargar la página
let tasks = [];
window.addEventListener('DOMContentLoaded', () => {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    tasks.forEach(task => renderTask(task));
  }
});
// Agregamos un evento al formulario para manejar el envío de nuevas tareas
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const taskText = input.value.trim();
  if (taskText !== '') {
    const newTask = { text: taskText, done: false };
    tasks.push(newTask);
    saveTasks();
    renderTask(newTask);
    input.value = '';
  }
});
// Funciones para manejar las tareas
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
// Función para renderizar una tarea en la lista
// y agregar el evento para marcarla como completada o eliminarla
function renderTask(task) {
  const li = document.createElement('li');
  li.textContent = task.text;

  if (task.done) {
    li.classList.add('done');
  }
// Agregamos un evento al elemento li para marcar la tarea como completada o eliminarla al hacer clic
  li.addEventListener('click', () => {
    task.done = !task.done;
    li.classList.toggle('done');
    saveTasks();
  });
// Creamos un botón para eliminar la tarea
  const delBtn = document.createElement('button');
  delBtn.textContent = 'Eliminar';
  delBtn.classList.add('delete-btn');
  delBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    list.removeChild(li);
    tasks = tasks.filter(t => t !== task);
    saveTasks();
  });
  li.appendChild(delBtn);
  list.appendChild(li);
}
