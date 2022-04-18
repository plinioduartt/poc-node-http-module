import UserService from './user.service.mjs';
import mockedUsersData from '../../../utils/mockedUsersData.mjs';
import { jest } from '@jest/globals';

function UserServiceFactory() {
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
  return new UserService(mockedUserRepository);
}

describe('User service', () => {
  it('List all ==> Should return an array of users', async () => {
    const userService = new UserServiceFactory();
    const params = {};
    const users = await userService.listAll(params);
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

  it('Get one by id ==> Should return a specific user by id', async () => {
    const userService = new UserServiceFactory();
    const id = mockedUsersData[0]._id;
    const user = await userService.getOneById(id);
    expect(user).toHaveProperty('_id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('age');
    expect(user).toHaveProperty('status');
    expect(user).toHaveProperty('city');
    expect(user).toHaveProperty('uf');
  });

  it('Get one by id NOT FOUND ==> Should throw not found error', async () => {
    const userService = new UserServiceFactory();
    const id = '625cbd647715858f53fadcea';
    await expect(async () => await userService.getOneById(id))
      .rejects.toThrowError(JSON.stringify({ status: 404, message: 'User not found.' }));
  });

  it('Get one by id INVALID ID FORMAT ==> Should throw invalid format error', async () => {
    const userService = new UserServiceFactory();
    const id = 'invalidId';
    await expect(async () => await userService.getOneById(id))
      .rejects.toThrowError(JSON.stringify({ status: 400, message: 'Invalid ID format.' }));
  });

  it('Create user ==> Should return a new user', async () => {
    const userService = new UserServiceFactory();
    const data = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      age: 23,
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };
    const user = await userService.create(data);
    expect(user).toHaveProperty('_id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('age');
    expect(user).toHaveProperty('status');
    expect(user).toHaveProperty('city');
    expect(user).toHaveProperty('uf');
  });

  it('Create user with validation error ==> Should return a error when create new user with invalid fields', async () => {
    const userService = new UserServiceFactory();
    const dataWithoutAge = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };
    await expect(async () => await userService.create(dataWithoutAge))
      .rejects.toThrowError('property age is missing.');
  });

  it('Update user ==> Should return a updated user', async () => {
    const userService = new UserServiceFactory();
    const id = mockedUsersData[0]._id;
    const data = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      age: 23,
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };
    const user = await userService.update(id, data);
    expect(user).toHaveProperty('_id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('age');
    expect(user).toHaveProperty('status');
    expect(user).toHaveProperty('city');
    expect(user).toHaveProperty('uf');
  });

  it('Update user NOT FOUND ==> Should throw not found error', async () => {
    const userService = new UserServiceFactory();
    const id = '625cbd647715858f53fadcea';
    const data = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      age: 23,
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };
    await expect(async () => await userService.update(id, data))
      .rejects.toThrowError(JSON.stringify({ status: 404, message: 'User not found.' }));
  });

  it('Update user INVALID ID FORMAT ==> Should throw invalid format error', async () => {
    const userService = new UserServiceFactory();
    const id = 'invalidId';
    const data = {
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      age: 23,
      status: 'ENABLED',
      city: 'Paulínia',
      uf: 'SP'
    };
    await expect(async () => await userService.update(id, data))
      .rejects.toThrowError(JSON.stringify({ status: 400, message: 'Invalid ID format.' }));
  });

  it('Delete user ==> Should delete a user by id', async () => {
    const userService = new UserServiceFactory();
    const id = mockedUsersData[0]._id;
    await expect(async () => await userService.delete(id))
      .toBeTruthy();
  });

  it('Delete user NOT FOUND ==> Should throw not found error', async () => {
    const userService = new UserServiceFactory();
    const id = '625cbd647715858f53fadcea';
    await expect(async () => await userService.delete(id))
      .rejects.toThrowError(JSON.stringify({ status: 404, message: 'User not found.' }));
  });

  it('Delete user INVALID ID FORMAT ==> Should throw invalid format error', async () => {
    const userService = new UserServiceFactory();
    const id = 'invalidId';
    await expect(async () => await userService.delete(id))
      .rejects.toThrowError(JSON.stringify({ status: 400, message: 'Invalid ID format.' }));
  });
});