const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

// GET /api/statistics/health - Health check con dependencias
router.get('/health', statisticsController.healthCheck);

// GET /api/statistics - Obtener todas las estadísticas
router.get('/', statisticsController.getAllStatistics);

// GET /api/statistics/tasks - Estadísticas generales de tareas
router.get('/tasks', statisticsController.getTaskStatistics);

// GET /api/statistics/categories - Estadísticas por categoría
router.get('/categories', statisticsController.getCategoryStatistics);

// GET /api/statistics/daily - Tareas por día
router.get('/daily', statisticsController.getTasksByDay);

// GET /api/statistics/productivity - Productividad por hora
router.get('/productivity', statisticsController.getProductivityByHour);

// GET /api/statistics/oldest-pending - Tareas más antiguas pendientes
router.get('/oldest-pending', statisticsController.getOldestPendingTasks);

// GET /api/statistics/recently-completed - Tareas completadas recientemente
router.get('/recently-completed', statisticsController.getRecentlyCompletedTasks);

// GET /api/statistics/summary - Resumen de actividad
router.get('/summary', statisticsController.getActivitySummary);

module.exports = router; 