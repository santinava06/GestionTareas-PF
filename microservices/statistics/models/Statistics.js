const tasksService = require('../services/tasksService');
const categoriesService = require('../services/categoriesService');

class Statistics {
  // Estadísticas generales de tareas
  static async getTaskStatistics() {
    try {
      const tasks = await tasksService.getAllTasks();
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.done).length;
      const pendingTasks = totalTasks - completedTasks;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100 * 100) / 100 : 0;

      return {
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        pending_tasks: pendingTasks,
        completion_rate: completionRate
      };
    } catch (error) {
      console.error('Error getting task statistics:', error);
      throw error;
    }
  }

  // Estadísticas por categoría
  static async getCategoryStatistics() {
    try {
      const categories = await categoriesService.getAllCategories();
      const tasks = await tasksService.getAllTasks();
      
      return categories.map(category => {
        const categoryTasks = tasks.filter(task => task.category_id === category.id);
        const completedTasks = categoryTasks.filter(task => task.done).length;
        const totalTasks = categoryTasks.length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100 * 100) / 100 : 0;
        
        return {
          id: category.id,
          name: category.name,
          color: category.color,
          total_tasks: totalTasks,
          completed_tasks: completedTasks,
          pending_tasks: totalTasks - completedTasks,
          completion_rate: completionRate
        };
      });
    } catch (error) {
      console.error('Error getting category statistics:', error);
      throw error;
    }
  }

  // Tareas creadas por día (últimos 7 días)
  static async getTasksByDay(days = 7) {
    try {
      const tasks = await tasksService.getAllTasks();
      const now = new Date();
      const daysAgo = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
      
      const tasksByDay = {};
      
      // Inicializar todos los días con 0
      for (let i = 0; i < days; i++) {
        const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
        const dateStr = date.toISOString().split('T')[0];
        tasksByDay[dateStr] = {
          date: dateStr,
          tasks_created: 0,
          tasks_completed: 0
        };
      }
      
      // Contar tareas por día
      tasks.forEach(task => {
        const taskDate = new Date(task.created_at);
        if (taskDate >= daysAgo) {
          const dateStr = taskDate.toISOString().split('T')[0];
          if (tasksByDay[dateStr]) {
            tasksByDay[dateStr].tasks_created++;
            if (task.done) {
              tasksByDay[dateStr].tasks_completed++;
            }
          }
        }
      });
      
      return Object.values(tasksByDay).reverse();
    } catch (error) {
      console.error('Error getting tasks by day:', error);
      throw error;
    }
  }

  // Productividad por hora del día
  static async getProductivityByHour() {
    try {
      const tasks = await tasksService.getAllTasks();
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      
      const hourlyStats = {};
      
      // Inicializar todas las horas con 0
      for (let hour = 0; hour < 24; hour++) {
        hourlyStats[hour] = {
          hour: hour,
          tasks_created: 0
        };
      }
      
      // Contar tareas por hora
      tasks.forEach(task => {
        const taskDate = new Date(task.created_at);
        if (taskDate >= thirtyDaysAgo) {
          const hour = taskDate.getHours();
          if (hourlyStats[hour]) {
            hourlyStats[hour].tasks_created++;
          }
        }
      });
      
      return Object.values(hourlyStats);
    } catch (error) {
      console.error('Error getting productivity by hour:', error);
      throw error;
    }
  }

  // Tareas más antiguas sin completar
  static async getOldestPendingTasks(limit = 5) {
    try {
      const tasks = await tasksService.getAllTasks();
      const pendingTasks = tasks.filter(task => !task.done);
      
      pendingTasks.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      
      return pendingTasks.slice(0, limit).map(task => {
        const daysOld = Math.round((new Date() - new Date(task.created_at)) / (1000 * 60 * 60 * 24) * 10) / 10;
        return {
          id: task.id,
          text: task.text,
          created_at: task.created_at,
          updated_at: task.updated_at,
          days_old: daysOld
        };
      });
    } catch (error) {
      console.error('Error getting oldest pending tasks:', error);
      throw error;
    }
  }

  // Tareas completadas recientemente
  static async getRecentlyCompletedTasks(limit = 5) {
    try {
      const tasks = await tasksService.getAllTasks();
      const completedTasks = tasks.filter(task => task.done);
      
      completedTasks.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      
      return completedTasks.slice(0, limit).map(task => {
        const daysToComplete = Math.round((new Date(task.updated_at) - new Date(task.created_at)) / (1000 * 60 * 60 * 24) * 10) / 10;
        return {
          id: task.id,
          text: task.text,
          created_at: task.created_at,
          updated_at: task.updated_at,
          days_to_complete: daysToComplete
        };
      });
    } catch (error) {
      console.error('Error getting recently completed tasks:', error);
      throw error;
    }
  }

  // Resumen de actividad
  static async getActivitySummary() {
    try {
      const tasks = await tasksService.getAllTasks();
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.done).length;
      const pendingTasks = totalTasks - completedTasks;
      
      // Calcular días activos
      const activeDays = new Set();
      tasks.forEach(task => {
        const date = new Date(task.created_at).toISOString().split('T')[0];
        activeDays.add(date);
      });
      
      // Calcular promedio de días para completar
      const completedTasksWithTime = tasks.filter(task => task.done);
      let totalDaysToComplete = 0;
      completedTasksWithTime.forEach(task => {
        totalDaysToComplete += (new Date(task.updated_at) - new Date(task.created_at)) / (1000 * 60 * 60 * 24);
      });
      const avgDaysToComplete = completedTasksWithTime.length > 0 
        ? Math.round((totalDaysToComplete / completedTasksWithTime.length) * 10) / 10 
        : 0;

      return {
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        pending_tasks: pendingTasks,
        active_days: activeDays.size,
        avg_days_to_complete: avgDaysToComplete
      };
    } catch (error) {
      console.error('Error getting activity summary:', error);
      throw error;
    }
  }
}

module.exports = Statistics; 