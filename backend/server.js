const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar configuración y middleware
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

// Importar rutas
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env];

// Middleware de logging
app.use(logger);

// Configuración de CORS
app.use(cors(currentConfig.cors));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Headers de seguridad básicos
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Rutas de la API
app.use('/api/tasks', taskRoutes);

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: env
  });
});

// Ruta para documentación de la API
app.get('/api', (req, res) => {
  res.json({
    name: 'API de Gestión de Tareas',
    version: '2.0.0',
    description: 'API RESTful para gestión de tareas',
    endpoints: {
      tasks: {
        'GET /api/tasks': 'Obtener todas las tareas',
        'GET /api/tasks/:id': 'Obtener una tarea específica',
        'POST /api/tasks': 'Crear una nueva tarea',
        'PUT /api/tasks/:id': 'Actualizar una tarea',
        'PATCH /api/tasks/:id/toggle': 'Alternar estado de completado',
        'DELETE /api/tasks/:id': 'Eliminar una tarea'
      }
    }
  });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
const PORT = currentConfig.port;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Entorno: ${env}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(` API docs: http://localhost:${PORT}/api`);
});
