const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');
const categoryRoutes = require('./routes/categoryRoutes');

const env = process.env.NODE_ENV || 'development';
const PORT = config[env].port;

const app = express();

app.use(express.json());
app.use(cors(config[env].cors));

app.use('/api/categories', categoryRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Microservicio de Categorías funcionando');
});

app.listen(PORT, () => {
  console.log(`Categories Microservice running on port ${PORT}`);
}); 