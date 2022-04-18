import responseHandler from "../../../handlers/responseHandler.mjs";

export default class UserController {
  userService;
  constructor(userService) {
    this.userService = userService;
  }

  async listAll(request, response) {
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

    return responseHandler({ status: 200, data: responseData, response });
  }

  async getOneById(request, response) {
    const { id } = request.pathParams;

    const user = await this.userService.getOneById(id);

    const responseData = {
      data: {
        user
      }
    };

    return responseHandler({ status: 200, data: responseData, response });
  }

  async create(request, response) {
    const data = request.body;
    const newUser = await this.userService.create(data);
    const responseData = {
      message: `Usuário criado com sucesso.`,
      data: {
        user: newUser
      }
    };

    return responseHandler({ status: 201, data: responseData, response });
  }

  async update(request, response) {
    const { id } = request.pathParams;

    const data = request.body;
    const updatedUser = await this.userService.update(id, data);
    const responseData = {
      message: `Usuário #${id} atualizado com sucesso.`,
      data: {
        user: updatedUser
      }
    };

    return responseHandler({ status: 200, data: responseData, response });
  }

  async delete(request, response) {
    const { id } = request.pathParams;

    await this.userService.delete(id);

    const responseData = {
      message: `Usuário #${id} deletado com sucesso.`,
      data: null
    };

    return responseHandler({ status: 204, data: responseData, response });
  }
}