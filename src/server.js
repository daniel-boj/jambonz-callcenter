const { app, wss } = require('./app');
const http = require('http');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// WebSocket server attachment
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(PORT, () => {
  console.log(`\n🟢 Servidor de IA escuchando en http://localhost:${PORT}`);
  console.log(`🔵 WebSocket listo en ws://localhost:${PORT}\n`);
});

// Manejo de errores del servidor
server.on('error', (error) => {
  console.error('🟠 Server error:', error);
});

// Manejo de cierre
process.on('SIGINT', () => {
  server.close(() => {
    console.log('\n🔴 Servidor cerrado');
    process.exit(0);
  });
});
