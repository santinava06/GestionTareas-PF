const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { validateTask, validateTaskId } = require('../middleware/validation');

// GET /api/tasks - Obtener todas las tareas
router.get('/', taskController.getTasks);

// POST /api/tasks - Crear una nueva tarea
router.post('/', validateTask, taskController.createTask);

// PATCH /api/tasks/:id/toggle - Alternar estado de completado (debe ir antes que /:id)
router.patch('/:id/toggle', validateTaskId, taskController.toggleTask);

// GET /api/tasks/:id - Obtener una tarea específica
router.get('/:id', validateTaskId, taskController.getTask);

// PUT /api/tasks/:id - Actualizar una tarea
router.put('/:id', validateTaskId, validateTask, taskController.updateTask);

// DELETE /api/tasks/:id - Eliminar una tarea
router.delete('/:id', validateTaskId, taskController.deleteTask);

module.exports = router;
