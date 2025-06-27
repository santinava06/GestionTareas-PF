const logger = (req, res, next) => {
  const start = Date.now();
  
  // Log al inicio de la request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Iniciando`);
  
  // Interceptar el final de la response
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
};

module.exports = logger; 