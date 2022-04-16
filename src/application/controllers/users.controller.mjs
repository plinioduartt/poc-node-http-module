import responseHandler from "../../handlers/responseHandler.mjs";

export class UserController {
  constructor() { }

  async listAll(request, response) {
    const searchParams = request.searchParams;
    const { offset, limit } = searchParams;

    const responseData = {
      data: {
        users: [
          { id: '123', name: "Plínio Duarte" }
        ]
      },
      offset,
      limit,
    };

    return responseHandler({ status: 200, data: responseData, response });
  }

  async getOneById(request, response) {
    const { id } = request.pathParams;

    const responseData = {
      data: {
        id
      }
    };

    return responseHandler({ status: 200, data: responseData, response });
  }

  async create(request, response) {
    const data = request.body;

    const responseData = {
      message: `Usuário criado com sucesso.`,
      data: {
        user: data
      }
    };

    return responseHandler({ status: 201, data: responseData, response });
  }

  async update(request, response) {
    const { id } = request.pathParams;
    const data = request.body;

    const responseData = {
      message: `Usuário #${id} atualizado com sucesso.`,
      data: {
        user: { id, ...data }
      }
    };

    return responseHandler({ status: 200, data: responseData, response });
  }

  async delete(request, response) {
    const { id } = request.pathParams;

    const responseData = {
      message: `Usuário #${id} deletado com sucesso.`,
      data: null
    };

    return responseHandler({ status: 204, data: responseData, response });
  }
}