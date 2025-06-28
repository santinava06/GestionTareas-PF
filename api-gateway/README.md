# API Gateway

Este API Gateway centraliza todas las peticiones del frontend a los diferentes microservicios.

## Funcionalidades
- Enrutamiento de peticiones a microservicios
- Balanceo de carga básico
- Manejo de errores centralizado
- Logging de peticiones
- CORS centralizado

## Microservicios conectados
- Tasks Service (puerto 4001)
- Categories Service (puerto 4002)
- Statistics Service (puerto 4003)

## Estructura
- routes/
- middleware/
- config/
- server.js
- package.json 