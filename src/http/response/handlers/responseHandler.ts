import configs from "../../../utils/configs";
import { IHttpResponse } from "../types/response.type";

interface IResponseHandler {
  statusCode: number;
  data: unknown,
  response: IHttpResponse
}

function responseHandler({ statusCode, data, response }: IResponseHandler) {
  response.writeHead(statusCode || configs.DEFAULT_STATUS_CODE, configs.DEFAULT_CONTENT_TYPE);
  response.write(JSON.stringify(data));
  return response.end();
}

export default responseHandler;