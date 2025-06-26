const db = require('../database/db');

// Obtener todas las tareas
exports.getTasks = (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => ({ ...r, done: Boolean(r.done) })));
  });
};

// Agregar una tarea
exports.addTask = (req, res) => {
  const { text } = req.body;
  db.run('INSERT INTO tasks (text) VALUES (?)', [text], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, text, done: false });
  });
};

// Alternar completado
exports.toggleTask = (req, res) => {
  const id = req.params.id;
  db.get('SELECT done FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Tarea no encontrada' });

    const newDone = row.done ? 0 : 1;
    db.run('UPDATE tasks SET done = ? WHERE id = ?', [newDone, id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: Number(id), done: Boolean(newDone) });
    });
  });
};

// Eliminar tarea
exports.deleteTask = (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
};
