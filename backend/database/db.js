const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear conexión a la base de datos
const dbPath = path.join(__dirname, 'tasks.db');
const db = new sqlite3.Database(dbPath);

// Crear tabla si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      done INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Crear índices para mejorar el rendimiento
  db.run('CREATE INDEX IF NOT EXISTS idx_tasks_done ON tasks(done)');
  db.run('CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at)');
});

// Función para cerrar la base de datos
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

module.exports = { db, closeDatabase };
