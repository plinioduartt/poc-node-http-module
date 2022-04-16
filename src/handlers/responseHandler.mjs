import configs from "../utils/configs.mjs";

function responseHandler({ statusCode, data, response }) {
  response.writeHead(statusCode || configs.DEFAULT_STATUS_CODE, configs.DEFAULT_CONTENT_TYPE);
  response.write(JSON.stringify(data));
  return response.end();
}

export default responseHandler;