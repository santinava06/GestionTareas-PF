module.exports = {
  development: {
    port: process.env.PORT || 4003,
    database: {
      path: './database/statistics.db'
    },
    services: {
      tasks: {
        url: 'http://localhost:4001'
      },
      categories: {
        url: 'http://localhost:4002'
      }
    },
    cors: {
      origin: true,
      credentials: true
    }
  },
  production: {
    port: process.env.PORT || 4003,
    database: {
      path: process.env.DATABASE_PATH || './database/statistics.db'
    },
    services: {
      tasks: {
        url: process.env.TASKS_SERVICE_URL || 'http://localhost:4001'
      },
      categories: {
        url: process.env.CATEGORIES_SERVICE_URL || 'http://localhost:4002'
      }
    },
    cors: {
      origin: process.env.FRONTEND_URL || ['http://localhost:5500', 'http://127.0.0.1:5500'],
      credentials: true
    }
  }
}; 