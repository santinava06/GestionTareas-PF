const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear conexión a la base de datos de estadísticas
const dbPath = path.join(__dirname, 'statistics.db');
const db = new sqlite3.Database(dbPath);

// Función para cerrar la base de datos
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Función para obtener estadísticas desde otras bases de datos
const getTaskStats = () => {
  return new Promise((resolve, reject) => {
    // Aquí se conectaría a la base de datos de tareas
    // Por ahora, simulamos la conexión
    resolve();
  });
};

module.exports = { db, closeDatabase, getTaskStats }; 