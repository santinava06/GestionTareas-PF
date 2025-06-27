const { db } = require('../database/db');

class Task {
  static async findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks ORDER BY created_at DESC', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => ({ ...row, done: Boolean(row.done) })));
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else if (!row) reject(new Error('Tarea no encontrada'));
        else resolve({ ...row, done: Boolean(row.done) });
      });
    });
  }

  static async create(text) {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      db.run(
        'INSERT INTO tasks (text, done, created_at, updated_at) VALUES (?, ?, ?, ?)',
        [text, 0, now, now],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, text, done: false, created_at: now, updated_at: now });
        }
      );
    });
  }

  static async update(id, updates) {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const { text, done } = updates;
      
      let query = 'UPDATE tasks SET updated_at = ?';
      let params = [now];
      
      if (text !== undefined) {
        query += ', text = ?';
        params.push(text);
      }
      
      if (done !== undefined) {
        query += ', done = ?';
        params.push(done ? 1 : 0);
      }
      
      query += ' WHERE id = ?';
      params.push(id);
      
      db.run(query, params, function (err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Tarea no encontrada'));
        else resolve({ id, ...updates, updated_at: now });
      });
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Tarea no encontrada'));
        else resolve({ success: true });
      });
    });
  }

  static async toggle(id) {
    const task = await this.findById(id);
    const newDone = !task.done;
    return await this.update(id, { done: newDone });
  }
}

module.exports = Task; 