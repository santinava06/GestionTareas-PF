const express = require('express');
const cors = require('cors');
const axios = require('axios');
const config = require('./config/config');
const { logger, errorLogger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const env = process.env.NODE_ENV || 'development';
const PORT = config[env].port;

const app = express();

// Middleware de logging
app.use(logger);

// CORS
app.use(cors(config[env].cors));

// Parse JSON
app.use(express.json());

// Health check del API Gateway
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      tasks: config[env].services.tasks.url,
      categories: config[env].services.categories.url,
      statistics: config[env].services.statistics.url
    }
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'API Gateway funcionando',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      tasks: '/api/tasks',
      categories: '/api/categories',
      statistics: '/api/statistics'
    }
  });
});

// Forward requests to tasks service
app.all('/api/tasks*', async (req, res) => {
  try {
    console.log(`[Tasks Forward] ${req.method} ${req.url} -> ${config[env].services.tasks.url}${req.url}`);
    
    const response = await axios({
      method: req.method,
      url: `${config[env].services.tasks.url}${req.url}`,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      },
      timeout: 10000
    });
    
    console.log(`[Tasks Forward] Response: ${response.status} for ${req.method} ${req.url}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Tasks Service Error:', error.message);
    res.status(503).json({
      success: false,
      error: 'Tasks Service Unavailable',
      message: 'El servicio de tareas no está disponible'
    });
  }
});

// Forward requests to categories service
app.all('/api/categories*', async (req, res) => {
  try {
    console.log(`[Categories Forward] ${req.method} ${req.url} -> ${config[env].services.categories.url}${req.url}`);
    
    const response = await axios({
      method: req.method,
      url: `${config[env].services.categories.url}${req.url}`,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      },
      timeout: 10000
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Categories Service Error:', error.message);
    res.status(503).json({
      success: false,
      error: 'Categories Service Unavailable',
      message: 'El servicio de categorías no está disponible'
    });
  }
});

// Forward requests to statistics service
app.all('/api/statistics*', async (req, res) => {
  try {
    console.log(`[Statistics Forward] ${req.method} ${req.url} -> ${config[env].services.statistics.url}${req.url}`);
    
    const response = await axios({
      method: req.method,
      url: `${config[env].services.statistics.url}${req.url}`,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      },
      timeout: 10000
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Statistics Service Error:', error.message);
    res.status(503).json({
      success: false,
      error: 'Statistics Service Unavailable',
      message: 'El servicio de estadísticas no está disponible'
    });
  }
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'La ruta solicitada no existe',
    timestamp: new Date().toISOString()
  });
});

// Middleware de logging de errores
app.use(errorLogger);

// Middleware de manejo de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📊 Services configured:`);
  console.log(`   - Tasks: ${config[env].services.tasks.url}`);
  console.log(`   - Categories: ${config[env].services.categories.url}`);
  console.log(`   - Statistics: ${config[env].services.statistics.url}`);
}); 