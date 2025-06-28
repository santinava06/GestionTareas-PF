const axios = require('axios');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const CATEGORIES_SERVICE_URL = config[env].services.categories.url;

class CategoriesService {
  constructor() {
    this.baseURL = CATEGORIES_SERVICE_URL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Obtener todas las categorías con contador de tareas
  async getAllCategories() {
    try {
      const response = await this.client.get('/api/categories');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      throw new Error('No se pudieron obtener las categorías');
    }
  }

  // Obtener una categoría específica
  async getCategoryById(id) {
    try {
      const response = await this.client.get(`/api/categories/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error.message);
      throw new Error('No se pudo obtener la categoría');
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

module.exports = new CategoriesService(); 