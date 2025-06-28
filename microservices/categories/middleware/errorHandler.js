const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: err.message,
      details: err.details
    });
  }

  // Error de base de datos
  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({
      success: false,
      error: 'Database Constraint Error',
      message: 'Los datos proporcionados violan las restricciones de la base de datos'
    });
  }

  // Error interno del servidor
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Ha ocurrido un error interno del servidor' 
      : err.message
  });
};

module.exports = errorHandler; 