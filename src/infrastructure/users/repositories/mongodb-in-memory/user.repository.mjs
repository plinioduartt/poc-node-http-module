import customError from "../../../../handlers/customError.mjs";
import UserSchema from "../../schemas/mongodb-in-memory/user.schema.mjs";
import pkg from 'lodash';
const { omit } = pkg;

export default class UserRepository {
  constructor() { }

  async listAll(params) {
    try {
      const users = await UserSchema.find();
      return users;
    } catch (error) {
      return customError(500, error.message);
    }
  }

  async getOneById(id) {
    try {
      const foundUser = await UserSchema.findOne({ _id: id })
      return foundUser;
    } catch (error) {
      return customError(500, error.message);
    }
  }

  async create(data) {
    try {
      const user = new UserSchema(data);
      await user.save();
      return user;
    } catch (error) {
      return customError(500, error.message);
    }
  }

  async update(id, data) {
    try {
      const user = await UserSchema.findOneAndUpdate({ _id: id }, omit(data, ['operation']), { new: true });
      return user;
    } catch (error) {
      return customError(500, error.message);
    }
  }

  async delete(id) {
    try {
      await UserSchema.deleteOne({ _id: id });
      return true;
    } catch (error) {
      return customError(500, error.message);
    }
  }
}