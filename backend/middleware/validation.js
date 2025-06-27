const validateTask = (req, res, next) => {
  const { text } = req.body;
  
  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'El campo "text" es requerido y debe ser una cadena de texto'
    });
  }

  if (text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'El texto de la tarea no puede estar vacío'
    });
  }

  if (text.length > 500) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'El texto de la tarea no puede exceder los 500 caracteres'
    });
  }

  // Sanitizar el texto
  req.body.text = text.trim();
  next();
};

const validateTaskId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'El ID de la tarea debe ser un número válido'
    });
  }

  req.params.id = parseInt(id);
  next();
};

module.exports = {
  validateTask,
  validateTaskId
}; 