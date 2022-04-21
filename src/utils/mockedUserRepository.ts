import mockedUsersData from "./mockedUsersData";
import { jest } from '@jest/globals';

export default {
  listAll: jest.fn().mockImplementation(() => {
    return mockedUsersData;
  }),
  getOneById: jest.fn().mockImplementation((id: any) => {
    return mockedUsersData.filter(item => item._id.toString() === id.toString())[0] || null;
  }),
  create: jest.fn().mockImplementation((data: any) => {
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
  update: jest.fn().mockImplementation((id, data: any) => {
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
  delete: jest.fn().mockImplementation(() => {
    return true;
  })
};