const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const services = config[env].services;

// Proxy para el microservicio de tareas
const tasksProxy = createProxyMiddleware({
  target: services.tasks.url,
  changeOrigin: true,
  timeout: 10000, // 10 second timeout
  pathRewrite: {
    '^/api/tasks': '/api/tasks'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Tasks Proxy] ${req.method} ${req.url} -> ${services.tasks.url}${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[Tasks Proxy] Response: ${proxyRes.statusCode} for ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('Tasks Service Error:', err);
    res.status(503).json({
      success: false,
      error: 'Tasks Service Unavailable',
      message: 'El servicio de tareas no está disponible'
    });
  }
});

// Proxy para el microservicio de categorías
const categoriesProxy = createProxyMiddleware({
  target: services.categories.url,
  changeOrigin: true,
  pathRewrite: {
    '^/api/categories': '/api/categories'
  },
  onError: (err, req, res) => {
    console.error('Categories Service Error:', err);
    res.status(503).json({
      success: false,
      error: 'Categories Service Unavailable',
      message: 'El servicio de categorías no está disponible'
    });
  }
});

// Proxy para el microservicio de estadísticas
const statisticsProxy = createProxyMiddleware({
  target: services.statistics.url,
  changeOrigin: true,
  pathRewrite: {
    '^/api/statistics': '/api/statistics'
  },
  onError: (err, req, res) => {
    console.error('Statistics Service Error:', err);
    res.status(503).json({
      success: false,
      error: 'Statistics Service Unavailable',
      message: 'El servicio de estadísticas no está disponible'
    });
  }
});

module.exports = {
  tasksProxy,
  categoriesProxy,
  statisticsProxy
}; 