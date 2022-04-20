import mockedUsersData from '../../../utils/mockedUsersData.mjs';
import UserController from './users.controller.mjs';
import UserService from '../services/user.service.mjs';
import { jest } from '@jest/globals';
import customError from '../../../handlers/customError.mjs';
import mockedUserRepository from '../../../utils/mockedUserRepository.mjs';

jest.mock('../../../infrastructure/users/repositories/mongodb-in-memory/user.repository.mjs');

jest.setTimeout(50000);

function UserControllerFactory() {
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
  const userController = new UserControllerFactory();
  let mockedHttp = new HttpFactory();
  let mockedRequest = mockedHttp.request();
  let mockedResponse = mockedHttp.response();

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('List all ==> Should return a array of users with properties for pagination handling', async () => {
    // arrange

    // act
    const response = await userController.listAll(mockedRequest, mockedResponse);
    const parsedResponse = JSON.parse(response);

    // asserts
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

  test('Get one by id ==> Should return a specific user by id', async () => {
    // arrange
    mockedRequest.pathParams.id = mockedUsersData[0]._id;

    // act
    const response = await userController.getOneById(mockedRequest, mockedResponse);
    const parsedResponse = JSON.parse(response);

    // asserts
    expect(parsedResponse).toHaveProperty('data');
    expect(parsedResponse.data).toHaveProperty('user');
    expect(parsedResponse.data.user).toHaveProperty('_id');
    expect(parsedResponse.data.user).toHaveProperty('name');
    expect(parsedResponse.data.user).toHaveProperty('email');
    expect(parsedResponse.data.user).toHaveProperty('age');
    expect(parsedResponse.data.user).toHaveProperty('city');
    expect(parsedResponse.data.user).toHaveProperty('uf');
  });

  test('Create user ==> Should create a new user when called with valid properties', async () => {
    // arrange
    mockedRequest.body = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      age: 23,
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };

    // act
    const response = await userController.create(mockedRequest, mockedResponse);
    const parsedResponse = JSON.parse(response);

    // asserts
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

  test('Update user ==> Should return a updated user', async () => {
    // arrange
    mockedRequest.pathParams.id = mockedUsersData[0]._id;
    mockedRequest.body = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      age: 23,
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };

    // act
    const response = await userController.update(mockedRequest, mockedResponse);
    const parsedResponse = JSON.parse(response);

    // asserts
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

  test('Delete user ==> Should delete a user', async () => {
    // arrange
    mockedRequest.pathParams.id = mockedUsersData[0]._id;

    // act
    const response = await userController.delete(mockedRequest, mockedResponse);
    const parsedReponse = JSON.parse(response);

    // asserts
    expect(parsedReponse).toHaveProperty('message');
    expect(parsedReponse.message).toBe(`Usuário #${mockedUsersData[0]._id} deletado com sucesso.`);
  });
});

describe('User controller expected errors', () => {
  const userController = new UserControllerFactory();
  let mockedHttp = new HttpFactory();
  let mockedRequest = mockedHttp.request();
  let mockedResponse = mockedHttp.response();

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('Get one by id NOT FOUND ==> Should throw not found error', async () => {
    // arrange
    mockedRequest.pathParams.id = '625cbd647715858f53fadcea';

    // act
    const request = async () => await userController.getOneById(mockedRequest, mockedResponse);

    // asserts
    await expect(request)
      .rejects.toThrowError(JSON.stringify({ error: { status: 404, message: 'User not found.' } }));
  });

  test('Get one by id INVALID ID FORMAT ==> Should throw not found error', async () => {
    // arrange
    mockedRequest.pathParams.id = 'invalidId';
    mockedUserRepository.getOneById = jest.fn()
      .mockRejectedValueOnce(() => customError(400, "Invalid ID format."));

    // act
    const request = async () => await userController.getOneById(mockedRequest, mockedResponse);

    // asserts
    await expect(request)
      .rejects.toThrowError(JSON.stringify({ error: { status: 400, message: 'Invalid ID format.' } }));
  });

  test('Create user INVALID PROPERTIES ==> Should throw a error when called with invalid properties', async () => {
    // arrange
    mockedRequest.body = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };

    // act
    const request = async () => await userController.create(mockedRequest, mockedResponse);

    // asserts
    await expect(request)
      .rejects.toThrowError(JSON.stringify({ error: { status: 400, message: "property age is missing." } }));
  });

  test('Update user NOT FOUND ==> Should throw not found error', async () => {
    // arrange
    mockedRequest.pathParams.id = '625cbd647715858f53fadcea';
    mockedRequest.body = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      age: 23,
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };

    // act
    const request = async () => await userController.update(mockedRequest, mockedResponse);

    // asserts
    await expect(request)
      .rejects.toThrowError(JSON.stringify({ error: { status: 404, message: 'User not found.' } }));
  });

  test('Update user INVALID ID FORMAT ==> Should throw invalid id format error', async () => {
    // arrange
    mockedRequest.pathParams.id = 'invalidId';
    mockedRequest.body = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      age: 23,
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };
    /** 
     * for deleting a user, first, the service checks if the user exists with a getOnebyId method
     * */
    mockedUserRepository.getOneById = jest.fn()
      .mockRejectedValueOnce(() => customError(400, "Invalid ID format."));

    // act
    const request = async () => await userController.update(mockedRequest, mockedResponse);

    // asserts
    await expect(request)
      .rejects.toThrowError(JSON.stringify({ error: { status: 400, message: 'Invalid ID format.' } }));
  });

  test('Delete user NOT FOUND ==> Should throw not found error', async () => {
    // arrange
    mockedRequest.pathParams.id = '625cbd647715858f53fadcea';

    // act
    const request = async () => await userController.delete(mockedRequest, mockedResponse);

    // asserts
    await expect(request)
      .rejects.toThrowError(JSON.stringify({ error: { status: 404, message: 'User not found.' } }));
  });

  test('Delete user INVALID ID FORMAT ==> Should throw invalid id format error', async () => {
    // arrange
    mockedRequest.pathParams.id = 'invalidId';
    /** 
     * for deleting a user, first, the service checks if the user exists with a getOnebyId method
     * */
    mockedUserRepository.getOneById = jest.fn()
      .mockRejectedValueOnce(() => customError(400, "Invalid ID format."));

    // act
    const request = async () => await userController.delete(mockedRequest, mockedResponse);

    // asserts
    await expect(request)
      .rejects.toThrowError(JSON.stringify({ error: { status: 400, message: 'Invalid ID format.' } }));
  });
});