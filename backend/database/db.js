const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'tasks.db'), (err) => {
  if (err) console.error('Error al conectar:', err.message);
  else console.log('Conectado a la base de datos SQLite.');
});

// Crear tabla si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      done INTEGER DEFAULT 0
    )
  `);
});

module.exports = db;
