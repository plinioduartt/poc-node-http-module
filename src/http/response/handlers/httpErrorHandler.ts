import { CustomErrorType } from '../../../errors/CustomError';
import configs from '../../../utils/configs';
import { IHttpResponse } from '../types/response.type';

function httpErrorHandler(error: CustomErrorType, response: IHttpResponse) {
  response.writeHead(error.status, configs.DEFAULT_CONTENT_TYPE);
  response.write(error.message);
  response.end();
}

export default httpErrorHandler;