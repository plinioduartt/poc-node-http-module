
import configs from '../utils/configs.mjs';

function errorHandler(error, response) {
  response.writeHead(error.status, configs.DEFAULT_CONTENT_TYPE);
  response.write(JSON.stringify(error));
  response.end();
}

export default errorHandler;