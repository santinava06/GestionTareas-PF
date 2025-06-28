const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');

const env = process.env.NODE_ENV || 'development';
const PORT = config[env].port;

const app = express();

app.use(express.json());
app.use(cors(config[env].cors));

app.use('/api/tasks', taskRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Microservicio de Tareas funcionando');
});

app.listen(PORT, () => {
  console.log(`Tasks Microservice running on port ${PORT}`);
}); 