module.exports = {
  development: {
    port: process.env.PORT || 4002,
    database: {
      path: './database/categories.db'
    },
    cors: {
      origin: true,
      credentials: true
    }
  },
  production: {
    port: process.env.PORT || 4002,
    database: {
      path: process.env.DATABASE_PATH || './database/categories.db'
    },
    cors: {
      origin: process.env.FRONTEND_URL || ['http://localhost:5500', 'http://127.0.0.1:5500'],
      credentials: true
    }
  }
}; 