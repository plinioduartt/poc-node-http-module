import { IHttpRequest } from "@/src/http/request/types/request.type";
import responseHandler from "../../../http/response/handlers/responseHandler";
import { IHttpResponse } from "../../../http/response/types/response.type";
import IUserService from "../services/user.interface";

export default class UserController {
  private readonly userService: IUserService;
  constructor(userService: IUserService) {
    this.userService = userService;
  }

  async listAll(request: IHttpRequest, response: IHttpResponse) {
    const searchParams = request.searchParams;
    const { offset, limit } = searchParams;

    const users = await this.userService.listAll(searchParams);
    const responseData = {
      data: {
        users
      },
      offset,
      limit,
    };

    return responseHandler({ statusCode: 200, data: responseData, response });
  }

  async getOneById(request: IHttpRequest, response: IHttpResponse) {
    const { id } = request.pathParams;

    const user = await this.userService.getOneById(id);

    const responseData = {
      data: {
        user
      }
    };

    return responseHandler({ statusCode: 200, data: responseData, response });
  }

  async create(request: IHttpRequest, response: IHttpResponse) {
    const data = request.body;
    const newUser = await this.userService.create(data);
    const responseData = {
      message: `Usuário criado com sucesso.`,
      data: {
        user: newUser
      }
    };

    return responseHandler({ statusCode: 201, data: responseData, response });
  }

  async update(request: IHttpRequest, response: IHttpResponse) {
    const { id } = request.pathParams;

    const data = request.body;
    const updatedUser = await this.userService.update(id, data);
    const responseData = {
      message: `Usuário #${id} atualizado com sucesso.`,
      data: {
        user: updatedUser
      }
    };

    return responseHandler({ statusCode: 200, data: responseData, response });
  }

  async delete(request: IHttpRequest, response: IHttpResponse) {
    const { id } = request.pathParams;

    await this.userService.delete(id);

    const responseData = {
      message: `Usuário #${id} deletado com sucesso.`,
      data: null
    };

    return responseHandler({ statusCode: 204, data: responseData, response });
  }
}