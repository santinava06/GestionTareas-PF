module.exports = {
  development: {
    port: process.env.PORT || 3000,
    services: {
      tasks: {
        url: 'http://localhost:4001',
        healthCheck: '/'
      },
      categories: {
        url: 'http://localhost:4002',
        healthCheck: '/'
      },
      statistics: {
        url: 'http://localhost:4003',
        healthCheck: '/'
      }
    },
    cors: {
      origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
      credentials: true
    }
  },
  production: {
    port: process.env.PORT || 3000,
    services: {
      tasks: {
        url: process.env.TASKS_SERVICE_URL || 'http://localhost:4001',
        healthCheck: '/'
      },
      categories: {
        url: process.env.CATEGORIES_SERVICE_URL || 'http://localhost:4002',
        healthCheck: '/'
      },
      statistics: {
        url: process.env.STATISTICS_SERVICE_URL || 'http://localhost:4003',
        healthCheck: '/'
      }
    },
    cors: {
      origin: process.env.FRONTEND_URL || ['http://localhost:5500'],
      credentials: true
    }
  }
}; 