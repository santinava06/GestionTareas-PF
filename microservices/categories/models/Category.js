const { db } = require('../database/db');

class Category {
  static async findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM categories ORDER BY name ASC', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM categories WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else if (!row) reject(new Error('Categoría no encontrada'));
        else resolve(row);
      });
    });
  }

  static async create(name, color = '#007bff') {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      db.run(
        'INSERT INTO categories (name, color, created_at, updated_at) VALUES (?, ?, ?, ?)',
        [name, color, now, now],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, name, color, created_at: now, updated_at: now });
        }
      );
    });
  }

  static async update(id, updates) {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const { name, color } = updates;
      
      let query = 'UPDATE categories SET updated_at = ?';
      let params = [now];
      
      if (name !== undefined) {
        query += ', name = ?';
        params.push(name);
      }
      
      if (color !== undefined) {
        query += ', color = ?';
        params.push(color);
      }
      
      query += ' WHERE id = ?';
      params.push(id);
      
      db.run(query, params, function (err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Categoría no encontrada'));
        else resolve({ id, ...updates, updated_at: now });
      });
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM categories WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Categoría no encontrada'));
        else resolve({ success: true });
      });
    });
  }

  static async getTaskCount(categoryId) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT COUNT(*) as count FROM task_categories WHERE category_id = ?',
        [categoryId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row.count);
        }
      );
    });
  }

  static async assignToTask(categoryId, taskId) {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      db.run(
        'INSERT OR IGNORE INTO task_categories (task_id, category_id, created_at) VALUES (?, ?, ?)',
        [taskId, categoryId, now],
        function (err) {
          if (err) reject(err);
          else resolve({ success: true, changes: this.changes });
        }
      );
    });
  }

  static async removeFromTask(categoryId, taskId) {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM task_categories WHERE category_id = ? AND task_id = ?',
        [categoryId, taskId],
        function (err) {
          if (err) reject(err);
          else resolve({ success: true, changes: this.changes });
        }
      );
    });
  }

  static async getCategoriesWithTaskCount() {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT c.*, COUNT(tc.task_id) as task_count 
        FROM categories c 
        LEFT JOIN task_categories tc ON c.id = tc.category_id 
        GROUP BY c.id 
        ORDER BY c.name ASC
      `, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = Category; 