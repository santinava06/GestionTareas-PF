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
      category_id INTEGER,
      priority TEXT DEFAULT 'medium',
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Verificar y agregar columnas si no existen (para compatibilidad con bases de datos existentes)
  db.run("PRAGMA table_info(tasks)", (err, rows) => {
    if (!err && rows) {
      const columnNames = rows.map(row => row.name);
      
      // Agregar category_id si no existe
      if (!columnNames.includes('category_id')) {
        db.run('ALTER TABLE tasks ADD COLUMN category_id INTEGER');
        console.log('Columna category_id agregada a la tabla tasks');
      }
      
      // Agregar priority si no existe
      if (!columnNames.includes('priority')) {
        db.run('ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT "medium"');
        console.log('Columna priority agregada a la tabla tasks');
      }
      
      // Agregar tags si no existe
      if (!columnNames.includes('tags')) {
        db.run('ALTER TABLE tasks ADD COLUMN tags TEXT');
        console.log('Columna tags agregada a la tabla tasks');
      }
    }
  });
  
  // Crear índices para mejorar el rendimiento
  db.run('CREATE INDEX IF NOT EXISTS idx_tasks_done ON tasks(done)');
  db.run('CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at)');
  db.run('CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority)');
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