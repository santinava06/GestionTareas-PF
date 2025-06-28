class ResponseHandler {
  static success(res, data, message = 'Operación exitosa', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static error(res, message, statusCode = 500, error = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };

    if (error && process.env.NODE_ENV !== 'production') {
      response.error = error.message || error;
    }

    return res.status(statusCode).json(response);
  }

  static created(res, data, message = 'Recurso creado exitosamente') {
    return this.success(res, data, message, 201);
  }

  static notFound(res, message = 'Recurso no encontrado') {
    return this.error(res, message, 404);
  }

  static badRequest(res, message = 'Solicitud incorrecta') {
    return this.error(res, message, 400);
  }

  static unauthorized(res, message = 'No autorizado') {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = 'Acceso prohibido') {
    return this.error(res, message, 403);
  }

  static conflict(res, message = 'Conflicto con el estado actual del recurso') {
    return this.error(res, message, 409);
  }
}

module.exports = ResponseHandler; 