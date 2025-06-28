const { spawn } = require('child_process');
const path = require('path');

// Configuración de servicios
const services = [
  {
    name: 'API Gateway',
    path: './api-gateway',
    command: 'npm',
    args: ['start']
  },
  {
    name: 'Tasks Service',
    path: './microservices/tasks',
    command: 'npm',
    args: ['start']
  },
  {
    name: 'Categories Service',
    path: './microservices/categories',
    command: 'npm',
    args: ['start']
  },
  {
    name: 'Statistics Service',
    path: './microservices/statistics',
    command: 'npm',
    args: ['start']
  }
];

// Función para iniciar un servicio
function startService(service) {
  console.log(`🚀 Starting ${service.name}...`);
  
  const child = spawn(service.command, service.args, {
    cwd: path.resolve(service.path),
    stdio: 'inherit',
    shell: true
  });

  child.on('error', (error) => {
    console.error(`❌ Error starting ${service.name}:`, error.message);
  });

  child.on('close', (code) => {
    console.log(`🔴 ${service.name} stopped with code ${code}`);
  });

  return child;
}

// Función para manejar la terminación del proceso
function handleExit() {
  console.log('\n🛑 Shutting down all services...');
  process.exit(0);
}

// Manejar señales de terminación
process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);

// Iniciar todos los servicios
console.log('🎯 Starting all microservices and API Gateway...\n');

const processes = services.map(startService);

console.log('\n✅ All services started!');
console.log('📊 Services running:');
console.log('   - API Gateway: http://localhost:3000');
console.log('   - Tasks Service: http://localhost:4001');
console.log('   - Categories Service: http://localhost:4002');
console.log('   - Statistics Service: http://localhost:4003');
console.log('\n🔄 Press Ctrl+C to stop all services'); 