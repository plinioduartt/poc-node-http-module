
import configs from '../utils/config.mjs';

export default function errorHandler(error, response) {
  response.writeHead(error.status, configs.DEFAULT_CONTENT_TYPE);
  response.write(JSON.stringify(error));
  response.end();
}