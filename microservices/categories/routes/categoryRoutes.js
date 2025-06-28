const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { validateCategory, validateCategoryId } = require('../middleware/validation');

// GET /api/categories - Obtener todas las categorías
router.get('/', categoryController.getCategories);

// POST /api/categories - Crear una nueva categoría
router.post('/', validateCategory, categoryController.createCategory);

// GET /api/categories/:id - Obtener una categoría específica
router.get('/:id', validateCategoryId, categoryController.getCategory);

// PUT /api/categories/:id - Actualizar una categoría
router.put('/:id', validateCategoryId, validateCategory, categoryController.updateCategory);

// DELETE /api/categories/:id - Eliminar una categoría
router.delete('/:id', validateCategoryId, categoryController.deleteCategory);

// POST /api/categories/:categoryId/tasks/:taskId - Asignar categoría a tarea
router.post('/:categoryId/tasks/:taskId', validateCategoryId, categoryController.assignToTask);

// DELETE /api/categories/:categoryId/tasks/:taskId - Remover categoría de tarea
router.delete('/:categoryId/tasks/:taskId', validateCategoryId, categoryController.removeFromTask);

module.exports = router; 