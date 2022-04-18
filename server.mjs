import httpServer from './app.mjs';
import logger from './src/utils/logger.mjs';

const SERVER_PORT = process.env.PORT || 3000;

httpServer.listen(
  SERVER_PORT,
  () => logger.info(`server is running on port ${SERVER_PORT}`)
)