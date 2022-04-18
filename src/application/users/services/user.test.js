import UserService from './user.service.mjs';
import { jest } from '@jest/globals';
import mockedUsersData from '../../../utils/mockedUsersData.mjs';
import mockedUserRepository from '../../../utils/mockedUserRepository.mjs';
import customError from '../../../handlers/customError.mjs';

jest.mock('../../../infrastructure/users/repositories/mongodb-in-memory/user.repository.mjs');

jest.setTimeout(50000);

function UserServiceFactory() {
  return new UserService(mockedUserRepository);
}

describe('User service', () => {
  const userService = new UserServiceFactory();

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('List all ==> Should return an array of users', async () => {
    // arrange
    const params = {};

    // act
    const users = await userService.listAll(params);

    // asserts
    expect(users).toEqual(expect.arrayContaining(mockedUsersData));
    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toHaveProperty('_id');
    expect(users[0]).toHaveProperty('name');
    expect(users[0]).toHaveProperty('email');
    expect(users[0]).toHaveProperty('age');
    expect(users[0]).toHaveProperty('status');
    expect(users[0]).toHaveProperty('city');
    expect(users[0]).toHaveProperty('uf');
  });

  test('Get one by id ==> Should return a specific user by id', async () => {
    // arrange
    const id = mockedUsersData[0]._id;

    // act
    const user = await userService.getOneById(id);

    // asserts
    expect(user).toHaveProperty('_id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('age');
    expect(user).toHaveProperty('status');
    expect(user).toHaveProperty('city');
    expect(user).toHaveProperty('uf');
  });

  test('Create user ==> Should return a new user', async () => {
    // arrange
    const data = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      age: 23,
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };

    // act
    const user = await userService.create(data);

    // asserts
    expect(user).toHaveProperty('_id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('age');
    expect(user).toHaveProperty('status');
    expect(user).toHaveProperty('city');
    expect(user).toHaveProperty('uf');
  });

  test('Update user ==> Should return a updated user', async () => {
    // arrange
    const id = mockedUsersData[0]._id;
    const data = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      age: 23,
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };

    // act
    const user = await userService.update(id, data);

    // asserts
    expect(user).toHaveProperty('_id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('age');
    expect(user).toHaveProperty('status');
    expect(user).toHaveProperty('city');
    expect(user).toHaveProperty('uf');
  });

  test('Delete user ==> Should delete a user by id', async () => {
    // arrange
    const id = mockedUsersData[0]._id;

    // act
    await expect(async () => await userService.delete(id))

      // asserts
      .toBeTruthy();
  });
});

describe('User service expected errors', () => {
  const userService = new UserServiceFactory();

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('Get one by id NOT FOUND ==> Should throw not found error', async () => {
    // arrange
    const id = '625cbd647715858f53fadcea';

    // act
    await expect(async () => await userService.getOneById(id))

      // assert
      .rejects.toThrowError(JSON.stringify({ status: 404, message: 'User not found.' }));
  });

  test('Get one by id INVALID ID FORMAT ==> Should throw invalid format error', async () => {
    // arrange
    const id = 'invalidId';
    mockedUserRepository.getOneById = jest.fn()
      .mockRejectedValueOnce(() => customError(400, "Invalid ID format."));

    // act
    await expect(async () => await userService.getOneById(id))

      // asserts
      .rejects.toThrowError(JSON.stringify({ error: { status: 400, message: "Invalid ID format." } }));
  });

  test('Create user with validation error ==> Should return a error when create new user with invalid fields', async () => {
    // arrange
    const dataWithoutAge = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };

    // act
    await expect(async () => await userService.create(dataWithoutAge))

      // asserts
      .rejects.toThrowError('property age is missing.');
  });

  test('Update user NOT FOUND ==> Should throw not found error', async () => {
    // arrange
    const id = '625cbd647715858f53fadcea';
    const data = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      age: 23,
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };

    // act
    await expect(async () => await userService.update(id, data))

      // asserts
      .rejects.toThrowError(JSON.stringify({ status: 404, message: 'User not found.' }));
  });

  test('Update user INVALID ID FORMAT ==> Should throw invalid format error', async () => {
    // arrange
    const id = 'invalidId';
    const data = {
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
    await expect(async () => await userService.update(id, data))

      //assert
      .rejects.toThrowError(JSON.stringify({ error: { status: 400, message: "Invalid ID format." } }));
  });

  test('Delete user NOT FOUND ==> Should throw not found error', async () => {
    // arrange
    const id = '625cbd647715858f53fadcea';

    // act
    await expect(async () => await userService.delete(id))

      // asserts
      .rejects.toThrowError(JSON.stringify({ status: 404, message: 'User not found.' }));
  });

  test('Delete user INVALID ID FORMAT ==> Should throw invalid format error', async () => {
    // arrange
    const id = 'invalidId';
    /** 
      * for deleting a user, first, the service checks if the user exists with a getOnebyId method
    * */
    mockedUserRepository.getOneById = jest.fn()
      .mockRejectedValueOnce(() => customError(400, "Invalid ID format."));

    // act
    await expect(async () => await userService.delete(id))

      // asserts
      .rejects.toThrowError(JSON.stringify({ error: { status: 400, message: "Invalid ID format." } }));
  });
});