import httpServer from './app';
import logger from './src/utils/logger';

const SERVER_PORT = process.env.PORT || 3000;

httpServer.listen(
  SERVER_PORT,
  () => logger.info(`server is running on port ${SERVER_PORT}`)
)