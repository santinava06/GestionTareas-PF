const Category = require('../models/Category');
const ResponseHandler = require('../utils/responseHandler');

// Obtener todas las categorías
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.getCategoriesWithTaskCount();
    ResponseHandler.success(res, categories, 'Categorías obtenidas exitosamente');
  } catch (error) {
    next(error);
  }
};

// Obtener una categoría específica
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    const taskCount = await Category.getTaskCount(req.params.id);
    const categoryWithCount = { ...category, task_count: taskCount };
    ResponseHandler.success(res, categoryWithCount, 'Categoría obtenida exitosamente');
  } catch (error) {
    if (error.message === 'Categoría no encontrada') {
      ResponseHandler.notFound(res, 'Categoría no encontrada');
    } else {
      next(error);
    }
  }
};

// Crear una nueva categoría
exports.createCategory = async (req, res, next) => {
  try {
    const { name, color } = req.body;
    const newCategory = await Category.create(name, color);
    ResponseHandler.created(res, newCategory, 'Categoría creada exitosamente');
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      ResponseHandler.conflict(res, 'Ya existe una categoría con ese nombre');
    } else {
      next(error);
    }
  }
};

// Actualizar una categoría
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Validar que solo se actualicen campos permitidos
    const allowedFields = ['name', 'color'];
    const filteredUpdates = {};
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }
    
    const updatedCategory = await Category.update(id, filteredUpdates);
    ResponseHandler.success(res, updatedCategory, 'Categoría actualizada exitosamente');
  } catch (error) {
    if (error.message === 'Categoría no encontrada') {
      ResponseHandler.notFound(res, 'Categoría no encontrada');
    } else if (error.code === 'SQLITE_CONSTRAINT') {
      ResponseHandler.conflict(res, 'Ya existe una categoría con ese nombre');
    } else {
      next(error);
    }
  }
};

// Eliminar una categoría
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Category.delete(id);
    ResponseHandler.success(res, null, 'Categoría eliminada exitosamente');
  } catch (error) {
    if (error.message === 'Categoría no encontrada') {
      ResponseHandler.notFound(res, 'Categoría no encontrada');
    } else {
      next(error);
    }
  }
};

// Asignar categoría a una tarea
exports.assignToTask = async (req, res, next) => {
  try {
    const { categoryId, taskId } = req.params;
    const result = await Category.assignToTask(categoryId, taskId);
    ResponseHandler.success(res, result, 'Categoría asignada a la tarea exitosamente');
  } catch (error) {
    next(error);
  }
};

// Remover categoría de una tarea
exports.removeFromTask = async (req, res, next) => {
  try {
    const { categoryId, taskId } = req.params;
    const result = await Category.removeFromTask(categoryId, taskId);
    ResponseHandler.success(res, result, 'Categoría removida de la tarea exitosamente');
  } catch (error) {
    next(error);
  }
}; 