const errorHandler = (err, req, res, next) => {
  console.error('API Gateway Error:', err);

  // Error de conexión a microservicio
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      success: false,
      error: 'Service Unavailable',
      message: 'El microservicio no está disponible en este momento',
      timestamp: new Date().toISOString()
    });
  }

  // Error de timeout
  if (err.code === 'ETIMEDOUT') {
    return res.status(504).json({
      success: false,
      error: 'Gateway Timeout',
      message: 'El microservicio tardó demasiado en responder',
      timestamp: new Date().toISOString()
    });
  }

  // Error interno del servidor
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Ha ocurrido un error interno del servidor' 
      : err.message,
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler; 