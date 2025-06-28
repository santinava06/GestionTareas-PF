const validateCategory = (req, res, next) => {
  const { name, color } = req.body;
  
  if (!name || typeof name !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'El campo "name" es requerido y debe ser una cadena de texto'
    });
  }

  if (name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'El nombre de la categoría no puede estar vacío'
    });
  }

  if (name.length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'El nombre de la categoría no puede exceder los 100 caracteres'
    });
  }

  // Validar color si se proporciona
  if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'El color debe ser un código hexadecimal válido (ej: #007bff)'
    });
  }

  // Sanitizar el nombre
  req.body.name = name.trim();
  next();
};

const validateCategoryId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'El ID de la categoría debe ser un número válido'
    });
  }

  req.params.id = parseInt(id);
  next();
};

module.exports = {
  validateCategory,
  validateCategoryId
}; 