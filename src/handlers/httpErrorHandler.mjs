import configs from '../utils/configs.mjs';

function httpErrorHandler(error, response) {
  response.writeHead(error.status, configs.DEFAULT_CONTENT_TYPE);
  response.write(error.message);
  response.end();
}

export default httpErrorHandler;