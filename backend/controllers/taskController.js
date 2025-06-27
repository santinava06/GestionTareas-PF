const Task = require('../models/Task');
const ResponseHandler = require('../utils/responseHandler');

// Obtener todas las tareas
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findAll();
    ResponseHandler.success(res, tasks, 'Tareas obtenidas exitosamente');
  } catch (error) {
    next(error);
  }
};

// Obtener una tarea específica
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    ResponseHandler.success(res, task, 'Tarea obtenida exitosamente');
  } catch (error) {
    if (error.message === 'Tarea no encontrada') {
      ResponseHandler.notFound(res, 'Tarea no encontrada');
    } else {
      next(error);
    }
  }
};

// Crear una nueva tarea
exports.createTask = async (req, res, next) => {
  try {
    const { text } = req.body;
    const newTask = await Task.create(text);
    ResponseHandler.created(res, newTask, 'Tarea creada exitosamente');
  } catch (error) {
    next(error);
  }
};

// Actualizar una tarea
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Validar que solo se actualicen campos permitidos
    const allowedFields = ['text', 'done'];
    const filteredUpdates = {};
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }
    
    const updatedTask = await Task.update(id, filteredUpdates);
    ResponseHandler.success(res, updatedTask, 'Tarea actualizada exitosamente');
  } catch (error) {
    if (error.message === 'Tarea no encontrada') {
      ResponseHandler.notFound(res, 'Tarea no encontrada');
    } else {
      next(error);
    }
  }
};

// Alternar estado de completado
exports.toggleTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.toggle(id);
    ResponseHandler.success(res, updatedTask, 'Estado de tarea actualizado');
  } catch (error) {
    if (error.message === 'Tarea no encontrada') {
      ResponseHandler.notFound(res, 'Tarea no encontrada');
    } else {
      next(error);
    }
  }
};

// Eliminar una tarea
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Task.delete(id);
    ResponseHandler.success(res, null, 'Tarea eliminada exitosamente');
  } catch (error) {
    if (error.message === 'Tarea no encontrada') {
      ResponseHandler.notFound(res, 'Tarea no encontrada');
    } else {
      next(error);
    }
  }
};
