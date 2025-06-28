# Microservices

Esta carpeta contiene los microservicios independientes de la aplicación. Cada microservicio tiene su propio código, dependencias y base de datos.

## Microservicios Disponibles

### 1. Tasks Microservice (Puerto 4001)
- **Propósito**: Gestión completa de tareas (CRUD)
- **Base de datos**: `tasks.db`
- **Endpoints principales**:
  - `GET /api/tasks` - Obtener todas las tareas
  - `POST /api/tasks` - Crear nueva tarea
  - `PUT /api/tasks/:id` - Actualizar tarea
  - `DELETE /api/tasks/:id` - Eliminar tarea
  - `PATCH /api/tasks/:id/toggle` - Alternar estado

### 2. Categories Microservice (Puerto 4002)
- **Propósito**: Gestión de categorías para organizar tareas
- **Base de datos**: `categories.db`
- **Endpoints principales**:
  - `GET /api/categories` - Obtener todas las categorías con contador de tareas
  - `POST /api/categories` - Crear nueva categoría
  - `PUT /api/categories/:id` - Actualizar categoría
  - `DELETE /api/categories/:id` - Eliminar categoría
  - `POST /api/categories/:categoryId/tasks/:taskId` - Asignar categoría a tarea
  - `DELETE /api/categories/:categoryId/tasks/:taskId` - Remover categoría de tarea

### 3. Statistics Microservice (Puerto 4003)
- **Propósito**: Estadísticas y métricas de tareas y categorías
- **Base de datos**: `statistics.db`
- **Endpoints principales**:
  - `GET /api/statistics` - Obtener todas las estadísticas
  - `GET /api/statistics/tasks` - Estadísticas generales de tareas
  - `GET /api/statistics/categories` - Estadísticas por categoría
  - `GET /api/statistics/daily` - Tareas por día
  - `GET /api/statistics/productivity` - Productividad por hora
  - `GET /api/statistics/oldest-pending` - Tareas más antiguas pendientes
  - `GET /api/statistics/recently-completed` - Tareas completadas recientemente
  - `GET /api/statistics/summary` - Resumen de actividad

## Cómo ejecutar los microservicios

1. **Tasks Microservice**:
   ```bash
   cd microservices/tasks
   npm install
   npm start
   ```

2. **Categories Microservice**:
   ```bash
   cd microservices/categories
   npm install
   npm start
   ```

3. **Statistics Microservice**:
   ```bash
   cd microservices/statistics
   npm install
   npm start
   ```

## Comunicación entre microservicios

Los microservicios se comunican a través de HTTP REST APIs. Cada uno es independiente y puede funcionar por separado.

## Próximos pasos

- Implementar un API Gateway para centralizar las peticiones
- Agregar autenticación y autorización
- Implementar comunicación asíncrona con mensajería
- Agregar monitoreo y logging centralizado 