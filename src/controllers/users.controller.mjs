import configs from "../utils/config.mjs";

export class UserController {
  constructor() { }

  listAll(request, response) {
    const res = {
      data: {
        users: [
          { id: '123', name: "Plínio Duarte" }
        ]
      }
    };
    
    response.writeHead(configs.DEFAULT_STATUS_CODE, configs.DEFAULT_CONTENT_TYPE);
    response.write(JSON.stringify(res));
    return response.end();
  }

  getOneById(request, response) {
    const { id } = request.pathParams;

    const res = {
      data: {
        id
      }
    };

    response.writeHead(configs.DEFAULT_STATUS_CODE, configs.DEFAULT_CONTENT_TYPE);
    response.write(JSON.stringify(res));
    return response.end();
  }

  create(request, response) {
    const data = request.body;
    console.log('request ==> ', request);
    console.log('data ==> ', data);

    const res = {
      data: {
        user: data
      }
    };

    response.writeHead(201, configs.DEFAULT_CONTENT_TYPE);
    response.write(JSON.stringify(res));
    return response.end();
  }
}