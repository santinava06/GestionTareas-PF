const axios = require('axios');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const TASKS_SERVICE_URL = config[env].services.tasks.url;

class TasksService {
  constructor() {
    this.baseURL = TASKS_SERVICE_URL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Obtener todas las tareas
  async getAllTasks() {
    try {
      const response = await this.client.get('/api/tasks');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
      throw new Error('No se pudieron obtener las tareas');
    }
  }

  // Obtener una tarea específica
  async getTaskById(id) {
    try {
      const response = await this.client.get(`/api/tasks/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error.message);
      throw new Error('No se pudo obtener la tarea');
    }
  }

  // Verificar si el servicio está disponible
  async healthCheck() {
    try {
      const response = await this.client.get('/');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new TasksService(); 