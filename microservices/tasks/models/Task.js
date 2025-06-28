const { db } = require('../database/db');
const axios = require('axios');

class Task {
  static async findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks ORDER BY created_at DESC', [], async (err, rows) => {
        if (err) reject(err);
        else {
          const tasks = rows.map(row => ({ 
            ...row, 
            done: Boolean(row.done),
            tags: row.tags ? JSON.parse(row.tags) : []
          }));
          
          // Para tareas con category_id, intentar obtener el nombre de la categoría
          for (let task of tasks) {
            if (task.category_id) {
              try {
                const response = await axios.get(`http://localhost:4002/api/categories/${task.category_id}`);
                if (response.data.success) {
                  task.categoryName = response.data.data.name;
                }
              } catch (error) {
                console.error(`Error getting category name for ID ${task.category_id}:`, error.message);
              }
            }
          }
          
          resolve(tasks);
        }
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM tasks WHERE id = ?', [id], async (err, row) => {
        if (err) reject(err);
        else if (!row) reject(new Error('Tarea no encontrada'));
        else {
          const task = { 
            ...row, 
            done: Boolean(row.done),
            tags: row.tags ? JSON.parse(row.tags) : []
          };
          
          // Si tiene category_id, intentar obtener el nombre de la categoría
          if (task.category_id) {
            try {
              const response = await axios.get(`http://localhost:4002/api/categories/${task.category_id}`);
              if (response.data.success) {
                task.categoryName = response.data.data.name;
              }
            } catch (error) {
              console.error(`Error getting category name for ID ${task.category_id}:`, error.message);
            }
          }
          
          resolve(task);
        }
      });
    });
  }

  static async create(text, categoryId = null, priority = 'medium', tags = []) {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const tagsJson = JSON.stringify(tags);
      
      db.run(
        'INSERT INTO tasks (text, done, category_id, priority, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [text, 0, categoryId, priority, tagsJson, now, now],
        async function (err) {
          if (err) reject(err);
          else {
            const task = { 
              id: this.lastID, 
              text, 
              done: false, 
              category_id: categoryId,
              priority,
              tags,
              created_at: now, 
              updated_at: now 
            };
            
            // Si tiene categoryId, intentar obtener el nombre de la categoría
            if (categoryId) {
              try {
                const response = await axios.get(`http://localhost:4002/api/categories/${categoryId}`);
                if (response.data.success) {
                  task.categoryName = response.data.data.name;
                }
              } catch (error) {
                console.error(`Error getting category name for ID ${categoryId}:`, error.message);
              }
            }
            
            resolve(task);
          }
        }
      );
    });
  }

  static async update(id, updates) {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const { text, done, categoryId, priority, tags } = updates;
      
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
      
      if (categoryId !== undefined) {
        query += ', category_id = ?';
        params.push(categoryId);
      }
      
      if (priority !== undefined) {
        query += ', priority = ?';
        params.push(priority);
      }
      
      if (tags !== undefined) {
        query += ', tags = ?';
        params.push(JSON.stringify(tags));
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