import mockedUsersData from '../../../utils/mockedUsersData.mjs';
import UserController from './users.controller.mjs';
import UserService from '../services/user.service.mjs';
import { jest } from '@jest/globals';

jest.setTimeout(50000)

function UserControllerFactory() {
  const mockedUserRepository = {
    listAll: jest.fn().mockImplementation(() => {
      return mockedUsersData;
    }),
    getOneById: jest.fn().mockImplementation(id => {     
      return mockedUsersData.filter(item => item._id.toString() === id.toString())[0] || null;
    }),
    create: jest.fn().mockImplementation((data) => {
      return {
        _id: "sa3r23r32r",
        name: data.name,
        email: data.email,
        age: data.age,
        status: data.status,
        city: data.city,
        uf: data.uf,
      };
    }),
    update: jest.fn().mockImplementation((id, data) => {
      return {
        _id: id,
        name: data.name,
        email: data.email,
        age: data.age,
        status: data.status,
        city: data.city,
        uf: data.uf,
      };
    }),
    delete: jest.fn().mockImplementation((id) => {
      return true;
    })
  };
  const userService = new UserService(mockedUserRepository);
  return new UserController(userService);
}

function HttpFactory() {
  const request = jest.fn().mockImplementation(() => {
    return {
      body: {},
      searchParams: {
        offset: 1,
        limit: 10
      },
      pathParams: {
        id: 'defaultUserId'
      }
    }
  });

  const response = jest.fn().mockImplementation(() => {
    let headers = {};
    let status = 200;
    let responseData = {};
    return {
      status,
      headers,
      data: responseData,
      writeHead: (statusCode, content_type) => {
        status = statusCode;
        headers.status = statusCode;
        headers.content_type = content_type;
        return true;
      },
      write: (data) => {
        responseData = data;
        return true;
      },
      end: () => {
        return responseData;
      },
    }
  });

  return {
    request,
    response
  }
}

describe('User controller', () => {
  it('List all ==> Should return a array of users with properties for pagination handling', async () => {
    const userController = new UserControllerFactory();
    let mockedHttp = new HttpFactory();
    let mockedRequest = mockedHttp.request();
    let mockedResponse = mockedHttp.response();
    const response = await userController.listAll(mockedRequest, mockedResponse);
    const parsedResponse = JSON.parse(response);

    expect(parsedResponse).toHaveProperty('data');
    expect(parsedResponse).toHaveProperty('offset');
    expect(parsedResponse).toHaveProperty('limit');
    expect(parsedResponse.data).toHaveProperty('users');
    expect(parsedResponse.data.users).toEqual(expect.arrayContaining(mockedUsersData));
    expect(parsedResponse.data.users[0]).toHaveProperty('_id');
    expect(parsedResponse.data.users[0]).toHaveProperty('name');
    expect(parsedResponse.data.users[0]).toHaveProperty('email');
    expect(parsedResponse.data.users[0]).toHaveProperty('age');
    expect(parsedResponse.data.users[0]).toHaveProperty('city');
    expect(parsedResponse.data.users[0]).toHaveProperty('uf');
  });

  it('Get one by id ==> Should return a specific user by id', async () => {
    const userController = new UserControllerFactory();
    let mockedHttp = new HttpFactory();
    let mockedRequest = mockedHttp.request();
    let mockedResponse = mockedHttp.response();
    mockedRequest.pathParams.id = mockedUsersData[0]._id;
    const response = await userController.getOneById(mockedRequest, mockedResponse);
    const parsedResponse = JSON.parse(response);

    expect(parsedResponse).toHaveProperty('data');
    expect(parsedResponse.data).toHaveProperty('user');
    expect(parsedResponse.data.user).toHaveProperty('_id');
    expect(parsedResponse.data.user).toHaveProperty('name');
    expect(parsedResponse.data.user).toHaveProperty('email');
    expect(parsedResponse.data.user).toHaveProperty('age');
    expect(parsedResponse.data.user).toHaveProperty('city');
    expect(parsedResponse.data.user).toHaveProperty('uf');
  });

  it('Get one by id NOT FOUND ==> Should throw not found error', async () => {
    const userController = new UserControllerFactory();
    let mockedHttp = new HttpFactory();
    let mockedRequest = await mockedHttp.request();
    let mockedResponse = await mockedHttp.response();
    mockedRequest.pathParams.id = '625cbd647715858f53fadcea';

    await expect(async () => await userController.getOneById(mockedRequest, mockedResponse))
      .rejects.toThrowError(JSON.stringify({ status: 404, message: 'User not found.' }));
  });

  it('Get one by id INVALID ID FORMAT ==> Should throw not found error', async () => {
    const userController = new UserControllerFactory();
    let mockedHttp = new HttpFactory();
    let mockedRequest = mockedHttp.request();
    let mockedResponse = mockedHttp.response();
    mockedRequest.pathParams.id = 'invalidId';

    await expect(async () => await userController.getOneById(mockedRequest, mockedResponse))
      .rejects.toThrowError(JSON.stringify({ status: 400, message: 'Invalid ID format.' }));
  });

  it('Create user ==> Should create a new user when called with valid properties', async () => {
    const userController = new UserControllerFactory();
    let mockedHttp = new HttpFactory();
    let mockedRequest = mockedHttp.request();
    let mockedResponse = mockedHttp.response();
    mockedRequest.body = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      age: 23,
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };

    const response = await userController.create(mockedRequest, mockedResponse);

    const parsedResponse = JSON.parse(response);

    expect(parsedResponse).toHaveProperty('data');
    expect(parsedResponse.data).toHaveProperty('user');
    expect(parsedResponse.data.user).toHaveProperty('_id');
    expect(parsedResponse.data.user).toHaveProperty('name');
    expect(parsedResponse.data.user).toHaveProperty('email');
    expect(parsedResponse.data.user).toHaveProperty('age');
    expect(parsedResponse.data.user).toHaveProperty('status');
    expect(parsedResponse.data.user).toHaveProperty('city');
    expect(parsedResponse.data.user).toHaveProperty('uf');
  });

  test('Create user INVALID PROPERTIES ==> Should throw a error when called with invalid properties', async () => {
    const userController = new UserControllerFactory();
    let mockedHttp = new HttpFactory();
    let mockedRequest = mockedHttp.request();
    let mockedResponse = mockedHttp.response();
    mockedRequest.body = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };

    const expectedError = JSON.stringify({ status: 400, message: "property age is missing." });
    await expect(async () =>
      await userController.create(mockedRequest, mockedResponse)
    ).rejects.toThrowError(expectedError);
  });

  it('Update user ==> Should return a updated user', async () => {
    const userController = new UserControllerFactory();
    let mockedHttp = new HttpFactory();
    let mockedRequest = mockedHttp.request();
    let mockedResponse = mockedHttp.response();
    mockedRequest.pathParams.id = mockedUsersData[0]._id;
    mockedRequest.body = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      age: 23,
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };

    const response = await userController.update(mockedRequest, mockedResponse);

    const parsedResponse = JSON.parse(response);

    expect(parsedResponse).toHaveProperty('data');
    expect(parsedResponse.data).toHaveProperty('user');
    expect(parsedResponse.data.user).toHaveProperty('_id');
    expect(parsedResponse.data.user).toHaveProperty('name');
    expect(parsedResponse.data.user).toHaveProperty('email');
    expect(parsedResponse.data.user).toHaveProperty('age');
    expect(parsedResponse.data.user).toHaveProperty('status');
    expect(parsedResponse.data.user).toHaveProperty('city');
    expect(parsedResponse.data.user).toHaveProperty('uf');
  });

  it('Update user NOT FOUND ==> Should throw not found error', async () => {
    const userController = new UserControllerFactory();
    let mockedHttp = new HttpFactory();
    let mockedRequest = await mockedHttp.request();
    let mockedResponse = await mockedHttp.response();
    mockedRequest.pathParams.id = '625cbd647715858f53fadcea';
    mockedRequest.body = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      age: 23,
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };

    await expect(async () => await userController.update(mockedRequest, mockedResponse))
      .rejects.toThrowError(JSON.stringify({ status: 404, message: 'User not found.' }));
  });

  it('Update user INVALID ID FORMAT ==> Should throw invalid id format error', async () => {
    const userController = new UserControllerFactory();
    let mockedHttp = new HttpFactory();
    let mockedRequest = await mockedHttp.request();
    let mockedResponse = await mockedHttp.response();
    mockedRequest.pathParams.id = 'invalidId';
    mockedRequest.body = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      age: 23,
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };

    await expect(async () => await userController.update(mockedRequest, mockedResponse))
      .rejects.toThrowError(JSON.stringify({ status: 400, message: 'Invalid ID format.' }));
  });

  it('Delete user ==> Should delete a user', async () => {
    const userController = new UserControllerFactory();
    let mockedHttp = new HttpFactory();
    let mockedRequest = mockedHttp.request();
    let mockedResponse = mockedHttp.response();
    mockedRequest.pathParams.id = mockedUsersData[0]._id;
    const response = await userController.delete(mockedRequest, mockedResponse);
    const parsedReponse = JSON.parse(response);

    expect(parsedReponse).toHaveProperty('message');
    expect(parsedReponse.message).toBe(`Usuário #${mockedUsersData[0]._id} deletado com sucesso.`);  
  });

  it('Delete user NOT FOUND ==> Should throw not found error', async () => {
    const userController = new UserControllerFactory();
    let mockedHttp = new HttpFactory();
    let mockedRequest = mockedHttp.request();
    let mockedResponse = mockedHttp.response();
    mockedRequest.pathParams.id = '625cbd647715858f53fadcea';

    await expect(async () => await userController.delete(mockedRequest, mockedResponse))
      .rejects.toThrowError(JSON.stringify({ status: 404, message: 'User not found.' }));
  });

  it('Delete user INVALID ID FORMAT ==> Should throw invalid id format error', async () => {
    const userController = new UserControllerFactory();
    let mockedHttp = new HttpFactory();
    let mockedRequest = mockedHttp.request();
    let mockedResponse = mockedHttp.response();
    mockedRequest.pathParams.id = 'invalidId';

    await expect(async () => await userController.delete(mockedRequest, mockedResponse))
      .rejects.toThrowError(JSON.stringify({ status: 400, message: 'Invalid ID format.' }));
  });
});