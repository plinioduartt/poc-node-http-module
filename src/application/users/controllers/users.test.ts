import mockedUsersData from '../../../utils/mockedUsersData';
import UserController from './users.controller';
import UserService from '../services/user.service';
import { jest } from '@jest/globals';
import mockedUserRepository from '../../../utils/mockedUserRepository';
import CustomError from '../../../errors/CustomError';
import { IUser } from '@/src/domain/users/entities/user.type';
import { GetJsonApiResponse } from '@/src/http/response/types/json-api/get.type';
import { CreateJsonApiResponse } from '@/src/http/response/types/json-api/create.type';
import { DeleteJsonApiResponse } from '@/src/http/response/types/json-api/delete.type';
import { IHttpRequest } from '@/src/http/request/types/request.type';
import { IHttpResponse } from '@/src/http/response/types/response.type';
import IUserRepository from '@/src/domain/users/repositories/user.repository';

jest.mock('../../../domain/users/repositories/user.repository');

jest.setTimeout(50000);

function userControllerFactory() {
  const userService = new UserService(mockedUserRepository as IUserRepository);
  return new UserController(userService);
}

function httpFactory() {
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
    let headers: any = {};
    let status = 200;
    let responseData: any = {};
    return {
      status,
      headers,
      data: responseData,
      writeHead: (statusCode: number, content_type: string) => {
        status = statusCode;
        headers.status = statusCode;
        headers.content_type = content_type;
        return true;
      },
      write: (data: IUser) => {
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
  const userController = userControllerFactory();
  let mockedHttp = httpFactory();
  let mockedRequest = mockedHttp.request() as IHttpRequest;
  let mockedResponse = mockedHttp.response() as IHttpResponse;

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('List all ==> Should return a array of users with properties for pagination handling', async () => {
    // arrange

    // act
    const response: unknown = await userController.listAll(mockedRequest, mockedResponse);
    const parsedResponse: GetJsonApiResponse = JSON.parse(response as string);

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
    const response: unknown = await userController.getOneById(mockedRequest, mockedResponse);
    const parsedResponse: GetJsonApiResponse = JSON.parse(response as string);

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
    } as IUser;

    // act
    const response: unknown = await userController.create(mockedRequest, mockedResponse);
    const parsedResponse: CreateJsonApiResponse = JSON.parse(response as string);

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
    } as IUser;

    // act
    const response: unknown = await userController.update(mockedRequest, mockedResponse);
    const parsedResponse: CreateJsonApiResponse = JSON.parse(response as string);

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
    const response: unknown = await userController.delete(mockedRequest, mockedResponse);
    const parsedReponse: DeleteJsonApiResponse = JSON.parse(response as string);

    // asserts
    expect(parsedReponse).toHaveProperty('message');
    expect(parsedReponse.message).toBe(`Usuário #${mockedUsersData[0]._id} deletado com sucesso.`);
  });
});

describe('User controller expected errors', () => {
  const userController = userControllerFactory();
  let mockedHttp = httpFactory();
  let mockedRequest = mockedHttp.request() as IHttpRequest;
  let mockedResponse = mockedHttp.response() as IHttpResponse;

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
      .mockRejectedValueOnce(() => {
        throw new CustomError({ status: 400, message: "Invalid ID format." });
      });

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
    } as IUser;

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
    } as IUser;

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
    } as IUser;
    /** 
     * for deleting a user, first, the service checks if the user exists with a getOnebyId method
     * */
    mockedUserRepository.getOneById = jest.fn()
      .mockRejectedValueOnce(() => {
        throw new CustomError({ status: 400, message: "Invalid ID format." });
      });

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
      .mockRejectedValueOnce(() => {
        throw new CustomError({ status: 400, message: "Invalid ID format." });
      });

    // act
    const request = async () => await userController.delete(mockedRequest, mockedResponse);

    // asserts
    await expect(request)
      .rejects.toThrowError(JSON.stringify({ error: { status: 400, message: 'Invalid ID format.' } }));
  });
});