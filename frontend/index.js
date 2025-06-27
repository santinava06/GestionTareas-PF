const API_URL = 'http://localhost:3000/api/tasks';

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Función para manejar errores de la API
async function handleApiError(response) {
  const errorData = await response.json();
  throw new Error(errorData.message || 'Error en la API');
}

// Función para hacer requests a la API
async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

// Crear nueva tarea
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  
  if (!text) {
    showNotification('Por favor ingresa el texto de la tarea', 'error');
    return;
  }

  try {
    const response = await apiRequest(API_URL, {
      method: 'POST',
      body: JSON.stringify({ text })
    });

    if (response.success) {
      renderTask(response.data);
      input.value = '';
      showNotification('Tarea creada exitosamente', 'success');
    }
  } catch (error) {
    showNotification(error.message, 'error');
  }
});

// Cargar todas las tareas
async function loadTasks() {
  try {
    const response = await apiRequest(API_URL);
    
    if (response.success) {
      list.innerHTML = ''; // Limpiar lista
      response.data.forEach(renderTask);
    }
  } catch (error) {
    showNotification('Error al cargar las tareas: ' + error.message, 'error');
  }
}

// Renderizar una tarea
function renderTask(task) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.dataset.taskId = task.id;
  
  const textSpan = document.createElement('span');
  textSpan.className = 'task-text';
  textSpan.textContent = task.text;
  
  if (task.done) {
    li.classList.add('done');
    textSpan.classList.add('completed');
  }

  // Click para alternar estado
  li.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) return;
    
    try {
      const response = await apiRequest(`${API_URL}/${task.id}/toggle`, {
        method: 'PATCH'
      });

      if (response.success) {
        li.classList.toggle('done');
        textSpan.classList.toggle('completed');
        showNotification('Estado actualizado', 'success');
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });

  // Botón eliminar
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Eliminar';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      return;
    }

    try {
      const response = await apiRequest(`${API_URL}/${task.id}`, {
        method: 'DELETE'
      });

      if (response.success) {
        li.remove();
        showNotification('Tarea eliminada', 'success');
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });

  li.appendChild(textSpan);
  li.appendChild(deleteBtn);
  list.appendChild(li);
}

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', loadTasks);
