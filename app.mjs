import http from 'http';
import requestHandler from './src/handlers/requestHandler.mjs';
import initializeRoutes from './src/initializers/routesInitializer.mjs';
import dotenv from 'dotenv';
import DBInitializer from './src/infrastructure/databases/mongodb-in-memory/dbInitializer.mjs';

dotenv.config();
await initializeRoutes();
await DBInitializer.open();

export default http.createServer(requestHandler);