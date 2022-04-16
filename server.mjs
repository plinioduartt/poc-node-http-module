import http from 'http';
import requestHandler from './src/handlers/requestHandler.mjs';
import initializeRoutes from './src/initializers/routesInitializer.mjs';
const SERVER_PORT = 8000;

const httpServer = http.createServer(requestHandler);
await initializeRoutes();

httpServer.listen(
  SERVER_PORT,
  () => console.log(`Server is running on port ${SERVER_PORT}`)
)