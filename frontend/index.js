const API_URL = 'http://localhost:3000/api/tasks';
const CATEGORY_URL = 'http://localhost:3000/api/categories';
const STATS_URL = 'http://localhost:3000/api/statistics';

// DOM Elements
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const categorySelect = document.getElementById('category-select');
const categoryFilter = document.getElementById('category-filter');
const prioritySelect = document.getElementById('priority-select');
const priorityFilter = document.getElementById('priority-filter');
const tagsInput = document.getElementById('tags-input');
const tagFilter = document.getElementById('tag-filter');
const clearFilterBtn = document.getElementById('clear-filter');
const statsPanel = document.getElementById('stats-panel');
const themeToggle = document.getElementById('theme-toggle');

// Modal Elements
const deleteModal = document.getElementById('delete-modal');
const modalClose = document.getElementById('modal-close');
const btnCancel = document.getElementById('btn-cancel');
const btnConfirm = document.getElementById('btn-confirm');
const taskTextPreview = document.getElementById('task-text-preview');

// Validate DOM elements
if (!form || !input || !list || !categorySelect || !categoryFilter || !prioritySelect || !priorityFilter || !tagsInput || !tagFilter || !clearFilterBtn || !statsPanel || !deleteModal || !themeToggle) {
  console.error('Required DOM elements not found');
  alert('Error: Could not load interface elements');
}

// Application State
let allTasks = [];
let currentFilters = {
  category: '',
  priority: '',
  tag: ''
};
let taskToDelete = null;

// Theme System
const themes = {
  light: {
    icon: '🌙',
    name: 'dark'
  },
  dark: {
    icon: '☀️',
    name: 'light'
  }
};

let currentTheme = localStorage.getItem('theme') || 'light';

// Theme Management
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', currentTheme);
  
  document.body.setAttribute('data-theme', currentTheme === 'dark' ? 'dark' : '');
  
  const themeIcon = themeToggle.querySelector('.theme-icon');
  themeIcon.textContent = themes[currentTheme].icon;
  
  const themeName = currentTheme === 'dark' ? 'dark' : 'light';
  showNotification(`${themeName} theme activated`, 'info');
}

function initTheme() {
  document.body.setAttribute('data-theme', currentTheme === 'dark' ? 'dark' : '');
  
  const themeIcon = themeToggle.querySelector('.theme-icon');
  themeIcon.textContent = themes[currentTheme].icon;
  
  themeToggle.addEventListener('click', toggleTheme);
}

// Notification System
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    border-radius: 5px;
    color: white;
    z-index: 1000;
    ${type === 'error' ? 'background-color: #f44336;' : 
      type === 'success' ? 'background-color: #4CAF50;' : 
      'background-color: #2196F3;'}
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// API Error Handling
async function handleApiError(response) {
  let errorMessage = 'API Error';
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || errorMessage;
  } catch (e) {
    console.error('Error parsing error response:', e);
  }
  
  throw new Error(errorMessage);
}

// API Request Handler
async function apiRequest(url, options = {}) {
  try {
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Utility Functions
function processTags(tagsString) {
  if (!tagsString || !tagsString.trim()) return [];
  return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
}

// Cargar categorías y poblar los selects
async function loadCategories() {
  try {
    const response = await apiRequest(CATEGORY_URL);
    if (response.success) {
      // Limpiar y poblar ambos selects
      categorySelect.innerHTML = '<option value="">📂 Sin categoría</option>';
      categoryFilter.innerHTML = '<option value="">📋 Todas las tareas</option>';
      
      response.data.forEach(cat => {
        // Para el select de crear tarea
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
        
        // Para el filtro
        const filterOption = document.createElement('option');
        filterOption.value = cat.id;
        filterOption.textContent = cat.name;
        categoryFilter.appendChild(filterOption);
      });
    }
  } catch (error) {
    showNotification('Error al cargar categorías: ' + error.message, 'error');
  }
}

// Crear nueva tarea
if (form) {
  form.addEventListener('submit', async (e) => {
    console.log('📝 Formulario enviado - previniendo recarga...');
    e.preventDefault(); // Prevenir recarga de página
    e.stopPropagation(); // Prevenir propagación
    
    const text = input.value.trim();
    const categoryId = categorySelect.value || null;
    const priority = prioritySelect.value;
    const tags = processTags(tagsInput.value);
    
    if (!text) {
      showNotification('Por favor ingresa el texto de la tarea', 'error');
      return;
    }
    
    try {
      showNotification('Creando tarea...', 'info');
      const body = { 
        text, 
        categoryId: categoryId ? Number(categoryId) : null,
        priority,
        tags
      };
      
      const response = await apiRequest(API_URL, {
        method: 'POST',
        body: JSON.stringify(body)
      });
      
      if (response.success) {
        // Agregar la nueva tarea al array global
        allTasks.unshift(response.data); 
        
        // Limpiar formulario
        input.value = '';
        categorySelect.value = '';
        prioritySelect.value = 'medium';
        tagsInput.value = '';
        
        // Re-renderizar solo si la tarea debe mostrarse con el filtro actual
        renderFilteredTasks();
        
        // Marcar la primera tarea como nueva para animación
        const firstTask = list.querySelector('.task-item');
        if (firstTask) {
          firstTask.classList.add('new-task');
          setTimeout(() => {
            firstTask.classList.remove('new-task');
          }, 500);
        }
        
        // Actualizar estadísticas sin recargar
        await loadStats();
        
        showNotification('Tarea creada exitosamente', 'success');
      } else {
        showNotification('Error al crear la tarea', 'error');
      }
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    }
    
    return false;
  });
}

// Cargar todas las tareas
async function loadTasks() {
  try {
    console.log('Loading tasks...');
    showNotification('Cargando tareas...', 'info');
    
    const response = await apiRequest(API_URL);
    
    if (response.success) {
      allTasks = response.data;
      renderFilteredTasks();
      showNotification('Tareas cargadas exitosamente', 'success');
    } else {
      showNotification('Error al cargar las tareas', 'error');
    }
  } catch (error) {
    showNotification('Error al cargar tareas: ' + error.message, 'error');
  }
}

// Renderizar tareas filtradas
function renderFilteredTasks() {
  console.log('Rendering filtered tasks...', { allTasks, currentFilters });
  
  let filteredTasks = allTasks;
  
  // Aplicar filtros
  if (currentFilters.category) {
    filteredTasks = filteredTasks.filter(task => task.category_id == currentFilters.category);
  }
  
  if (currentFilters.priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === currentFilters.priority);
  }
  
  if (currentFilters.tag) {
    filteredTasks = filteredTasks.filter(task => 
      task.tags && task.tags.some(tag => 
        tag.toLowerCase().includes(currentFilters.tag.toLowerCase())
      )
    );
  }
  
  console.log('Filtered tasks:', filteredTasks);
  
  // Limpiar lista
  list.innerHTML = '';
  
  if (filteredTasks.length === 0) {
    list.innerHTML = '<li style="text-align: center; padding: 40px; color: #6b7280; font-style: italic;">No hay tareas que mostrar</li>';
    return;
  }
  
  // Renderizar tareas filtradas
  filteredTasks.forEach(task => {
    const li = renderTask(task);
    list.appendChild(li);
  });
}

// Renderizar una tarea individual
function renderTask(task) {
  const li = document.createElement('li');
  li.className = `task-item ${task.done ? 'done' : ''} priority-${task.priority || 'medium'}`;
  li.dataset.taskId = task.id;
  
  const priorityLabels = {
    high: '🔴 Alta',
    medium: '🟡 Media', 
    low: '🟢 Baja'
  };
  
  li.innerHTML = `
    <div class="task-content">
      <div class="task-header">
        <span class="task-text ${task.done ? 'completed' : ''}">${task.text}</span>
        ${task.categoryName ? `<span class="task-category">📂 ${task.categoryName}</span>` : ''}
        <span class="task-priority ${task.priority || 'medium'}">${priorityLabels[task.priority || 'medium']}</span>
      </div>
      ${task.tags && task.tags.length > 0 ? `
        <div class="task-tags">
          ${task.tags.map(tag => `<span class="task-tag">🏷️ ${tag}</span>`).join('')}
        </div>
      ` : ''}
    </div>
    <div class="task-actions">
      <button class="toggle-btn" data-task-id="${task.id}">
        ${task.done ? '↩️ Deshacer' : '✅ Completar'}
      </button>
      <button class="delete-btn" data-task-id="${task.id}">
        🗑️ Eliminar
      </button>
    </div>
  `;
  
  // Agregar event listeners a los botones
  const toggleBtn = li.querySelector('.toggle-btn');
  const deleteBtn = li.querySelector('.delete-btn');
  
  toggleBtn.addEventListener('click', () => toggleTask(task.id));
  deleteBtn.addEventListener('click', () => showDeleteModal(task));
  
  return li;
}

// Cargar estadísticas
async function loadStats() {
  try {
    const response = await apiRequest(STATS_URL);
    if (response.success) {
      const stats = response.data;
      const taskStats = stats.taskStatistics;
      const categoryStats = stats.categoryStatistics;
      
      statsPanel.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 25px;">
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; border-radius: 15px; text-align: center; border: 2px solid #d1fae5; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
            <h3 style="margin: 0 0 15px 0; color: #166534; font-size: 1.1em;">📊 Total Tareas</h3>
            <div style="font-size: 2.5em; font-weight: bold; color: #22c55e;">${taskStats.total_tasks}</div>
          </div>
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; border-radius: 15px; text-align: center; border: 2px solid #d1fae5; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
            <h3 style="margin: 0 0 15px 0; color: #166534; font-size: 1.1em;">✅ Completadas</h3>
            <div style="font-size: 2.5em; font-weight: bold; color: #16a34a;">${taskStats.completed_tasks}</div>
          </div>
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; border-radius: 15px; text-align: center; border: 2px solid #d1fae5; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
            <h3 style="margin: 0 0 15px 0; color: #166534; font-size: 1.1em;">⏳ Pendientes</h3>
            <div style="font-size: 2.5em; font-weight: bold; color: #f59e0b;">${taskStats.pending_tasks}</div>
          </div>
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; border-radius: 15px; text-align: center; border: 2px solid #d1fae5; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
            <h3 style="margin: 0 0 15px 0; color: #166534; font-size: 1.1em;">📈 Tasa de Completado</h3>
            <div style="font-size: 2.5em; font-weight: bold; color: #059669;">${taskStats.completion_rate}%</div>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; border-radius: 15px; border: 2px solid #d1fae5; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          <h3 style="margin: 0 0 20px 0; color: #166534; font-size: 1.2em; display: flex; align-items: center; gap: 10px;">
            📂 Tareas por Categoría
          </h3>
          ${categoryStats && categoryStats.length > 0 ? 
            `<ul style="list-style: none; padding: 0; margin: 0;">
              ${categoryStats.map(cat => `
                <li style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #d1fae5; align-items: center;">
                  <span style="color: #374151; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                    <span style="width: 12px; height: 12px; border-radius: 50%; background: ${cat.color || '#22c55e'};"></span>
                    ${cat.name || 'Sin categoría'}
                  </span>
                  <span style="font-weight: bold; color: #22c55e; background: white; padding: 6px 12px; border-radius: 20px; font-size: 0.9em; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    ${cat.total_tasks} tareas
                  </span>
                </li>
              `).join('')}
            </ul>` : 
            '<p style="color: #6b7280; margin: 0; text-align: center; padding: 20px;">No hay tareas categorizadas</p>'
          }
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
    statsPanel.innerHTML = '<div style="color: #dc2626; padding: 20px; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 15px; border: 2px solid #fecaca; text-align: center;">❌ Error al cargar estadísticas</div>';
  }
}

// Inicialización
async function init() {
  initTheme(); // Inicializar tema primero
  await loadCategories();
  await loadTasks();
  await loadStats();
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing...');
  init();
});

// Debug: Verificar que el script se cargó
console.log('Frontend script loaded successfully');

// Event listeners para el filtro
if (categoryFilter) {
  categoryFilter.addEventListener('change', (e) => {
    currentFilters.category = e.target.value;
    renderFilteredTasks();
    showNotification(`Filtrado por: ${e.target.options[e.target.selectedIndex].text}`, 'info');
  });
}

if (priorityFilter) {
  priorityFilter.addEventListener('change', (e) => {
    currentFilters.priority = e.target.value;
    renderFilteredTasks();
    showNotification(`Filtrado por: ${e.target.options[e.target.selectedIndex].text}`, 'info');
  });
}

if (tagFilter) {
  tagFilter.addEventListener('input', (e) => {
    currentFilters.tag = e.target.value;
    renderFilteredTasks();
    showNotification(`Filtrado por: ${e.target.value}`, 'info');
  });
}

if (clearFilterBtn) {
  clearFilterBtn.addEventListener('click', () => {
    currentFilters = {
      category: '',
      priority: '',
      tag: ''
    };
    categoryFilter.value = '';
    priorityFilter.value = '';
    tagFilter.value = '';
    renderFilteredTasks();
    showNotification('Filtro limpiado', 'info');
  });
}

// Funciones del modal
function showDeleteModal(task) {
  taskToDelete = task;
  taskTextPreview.textContent = task.text;
  deleteModal.classList.add('show');
  
  // Prevenir scroll del body
  document.body.style.overflow = 'hidden';
}

function hideDeleteModal() {
  deleteModal.classList.remove('show');
  taskToDelete = null;
  
  // Restaurar scroll del body
  document.body.style.overflow = 'auto';
}

// Event listeners del modal
if (modalClose) {
  modalClose.addEventListener('click', hideDeleteModal);
}

if (btnCancel) {
  btnCancel.addEventListener('click', hideDeleteModal);
}

if (btnConfirm) {
  btnConfirm.addEventListener('click', async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete);
      hideDeleteModal();
    }
  });
}

// Cerrar modal al hacer clic fuera de él
if (deleteModal) {
  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      hideDeleteModal();
    }
  });
}

// Cerrar modal con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && deleteModal.classList.contains('show')) {
    hideDeleteModal();
  }
});

// Función para eliminar tarea
async function deleteTask(task) {
  const li = document.querySelector(`[data-task-id="${task.id}"]`);
  
  try {
    // Mostrar indicador de carga
    li.classList.add('updating');
    
    console.log('Deleting task:', task.id);
    const response = await apiRequest(`${API_URL}/${task.id}`, {
      method: 'DELETE'
    });

    if (response.success) {
      // Remover la tarea del array global
      allTasks = allTasks.filter(t => t.id !== task.id);
      
      // Animación de eliminación
      li.classList.add('deleting');
      
      setTimeout(() => {
        // Re-renderizar solo si es necesario
        renderFilteredTasks();
      }, 300);
      
      // Actualizar estadísticas sin recargar
      await loadStats();
      
      showNotification('Tarea eliminada', 'success');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    showNotification(error.message, 'error');
    // Restaurar elemento en caso de error
    li.classList.remove('updating');
  }
}

// Función para alternar estado de tarea
async function toggleTask(taskId) {
  const li = document.querySelector(`[data-task-id="${taskId}"]`);
  
  try {
    // Mostrar indicador de carga
    li.classList.add('updating');
    
    console.log('Toggling task:', taskId);
    const response = await apiRequest(`${API_URL}/${taskId}/toggle`, {
      method: 'PATCH'
    });

    if (response.success) {
      // Actualizar la tarea en el array global
      const taskIndex = allTasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        allTasks[taskIndex] = response.data;
      }
      
      // Actualizar solo este elemento en lugar de re-renderizar todo
      updateTaskElement(li, response.data);
      
      // Actualizar estadísticas sin recargar
      await loadStats();
      
      showNotification('Estado actualizado', 'success');
    }
  } catch (error) {
    console.error('Error toggling task:', error);
    showNotification(error.message, 'error');
  } finally {
    // Restaurar elemento
    li.classList.remove('updating');
  }
}

// Función para actualizar solo un elemento de tarea
function updateTaskElement(li, updatedTask) {
  const priorityLabels = {
    high: '🔴 Alta',
    medium: '🟡 Media', 
    low: '🟢 Baja'
  };
  
  // Actualizar clases
  li.className = `task-item ${updatedTask.done ? 'done' : ''} priority-${updatedTask.priority || 'medium'}`;
  
  // Actualizar contenido
  li.innerHTML = `
    <div class="task-content">
      <div class="task-header">
        <span class="task-text ${updatedTask.done ? 'completed' : ''}">${updatedTask.text}</span>
        ${updatedTask.categoryName ? `<span class="task-category">📂 ${updatedTask.categoryName}</span>` : ''}
        <span class="task-priority ${updatedTask.priority || 'medium'}">${priorityLabels[updatedTask.priority || 'medium']}</span>
      </div>
      ${updatedTask.tags && updatedTask.tags.length > 0 ? `
        <div class="task-tags">
          ${updatedTask.tags.map(tag => `<span class="task-tag">🏷️ ${tag}</span>`).join('')}
        </div>
      ` : ''}
    </div>
    <div class="task-actions">
      <button class="toggle-btn" data-task-id="${updatedTask.id}">
        ${updatedTask.done ? '↩️ Deshacer' : '✅ Completar'}
      </button>
      <button class="delete-btn" data-task-id="${updatedTask.id}">
        🗑️ Eliminar
      </button>
    </div>
  `;
}
