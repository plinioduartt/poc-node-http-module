import http, { Server, ServerOptions } from 'http';
import requestHandler from './src/http/request/handlers/requestHandler';
import initializeRoutes from './src/initializers/routesInitializer';
import DBInitializer from './src/infrastructure/databases/mongodb-in-memory/dbInitializer';
import dotenv from 'dotenv';

dotenv.config();
(async () => await initializeRoutes())();
(async () => await DBInitializer.open())();

export default http.createServer(requestHandler as ServerOptions) as Server;