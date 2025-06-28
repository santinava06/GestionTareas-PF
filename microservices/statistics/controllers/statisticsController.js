const Statistics = require('../models/Statistics');
const ResponseHandler = require('../utils/responseHandler');
const tasksService = require('../services/tasksService');
const categoriesService = require('../services/categoriesService');

// Health check para verificar conectividad con otros servicios
exports.healthCheck = async (req, res, next) => {
  try {
    const [tasksHealth, categoriesHealth] = await Promise.allSettled([
      tasksService.healthCheck(),
      categoriesService.healthCheck()
    ]);

    const healthStatus = {
      service: 'Statistics Microservice',
      status: 'OK',
      timestamp: new Date().toISOString(),
      dependencies: {
        tasks: {
          status: tasksHealth.status === 'fulfilled' ? 'OK' : 'ERROR',
          message: tasksHealth.status === 'fulfilled' ? 'Connected' : 'Connection failed'
        },
        categories: {
          status: categoriesHealth.status === 'fulfilled' ? 'OK' : 'ERROR',
          message: categoriesHealth.status === 'fulfilled' ? 'Connected' : 'Connection failed'
        }
      }
    };

    const overallStatus = healthStatus.dependencies.tasks.status === 'OK' && 
                         healthStatus.dependencies.categories.status === 'OK' ? 200 : 503;

    res.status(overallStatus).json(healthStatus);
  } catch (error) {
    next(error);
  }
};

// Obtener estadísticas generales de tareas
exports.getTaskStatistics = async (req, res, next) => {
  try {
    const stats = await Statistics.getTaskStatistics();
    ResponseHandler.success(res, stats, 'Estadísticas de tareas obtenidas exitosamente');
  } catch (error) {
    next(error);
  }
};

// Obtener estadísticas por categoría
exports.getCategoryStatistics = async (req, res, next) => {
  try {
    const stats = await Statistics.getCategoryStatistics();
    ResponseHandler.success(res, stats, 'Estadísticas por categoría obtenidas exitosamente');
  } catch (error) {
    next(error);
  }
};

// Obtener tareas por día
exports.getTasksByDay = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const stats = await Statistics.getTasksByDay(parseInt(days));
    ResponseHandler.success(res, stats, 'Estadísticas por día obtenidas exitosamente');
  } catch (error) {
    next(error);
  }
};

// Obtener productividad por hora
exports.getProductivityByHour = async (req, res, next) => {
  try {
    const stats = await Statistics.getProductivityByHour();
    ResponseHandler.success(res, stats, 'Estadísticas de productividad por hora obtenidas exitosamente');
  } catch (error) {
    next(error);
  }
};

// Obtener tareas más antiguas pendientes
exports.getOldestPendingTasks = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const tasks = await Statistics.getOldestPendingTasks(parseInt(limit));
    ResponseHandler.success(res, tasks, 'Tareas más antiguas pendientes obtenidas exitosamente');
  } catch (error) {
    next(error);
  }
};

// Obtener tareas completadas recientemente
exports.getRecentlyCompletedTasks = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const tasks = await Statistics.getRecentlyCompletedTasks(parseInt(limit));
    ResponseHandler.success(res, tasks, 'Tareas completadas recientemente obtenidas exitosamente');
  } catch (error) {
    next(error);
  }
};

// Obtener resumen de actividad
exports.getActivitySummary = async (req, res, next) => {
  try {
    const summary = await Statistics.getActivitySummary();
    ResponseHandler.success(res, summary, 'Resumen de actividad obtenido exitosamente');
  } catch (error) {
    next(error);
  }
};

// Obtener todas las estadísticas en un solo endpoint
exports.getAllStatistics = async (req, res, next) => {
  try {
    const [
      taskStats,
      categoryStats,
      tasksByDay,
      productivityByHour,
      oldestPending,
      recentlyCompleted,
      activitySummary
    ] = await Promise.all([
      Statistics.getTaskStatistics(),
      Statistics.getCategoryStatistics(),
      Statistics.getTasksByDay(7),
      Statistics.getProductivityByHour(),
      Statistics.getOldestPendingTasks(5),
      Statistics.getRecentlyCompletedTasks(5),
      Statistics.getActivitySummary()
    ]);

    const allStats = {
      taskStatistics: taskStats,
      categoryStatistics: categoryStats,
      tasksByDay,
      productivityByHour,
      oldestPendingTasks: oldestPending,
      recentlyCompletedTasks: recentlyCompleted,
      activitySummary
    };

    ResponseHandler.success(res, allStats, 'Todas las estadísticas obtenidas exitosamente');
  } catch (error) {
    next(error);
  }
}; 