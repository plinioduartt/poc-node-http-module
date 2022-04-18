import customError from "../../../../handlers/customError.mjs";
import UserSchema from "../../schemas/mongodb-in-memory/user.schema.mjs";
import mongoose from 'mongoose';
import pkg from 'lodash';
const { omit } = pkg;

export default class UserRepository {
  constructor() { }

  async listAll(params) {
    try {
      const users = await UserSchema.find();
      return users;
    } catch (error) {
      return customError(error.status || 500, error.message || "Internal server error.");
    }
  }

  async getOneById(id) {
    if (!mongoose.isValidObjectId(id)) {
      return customError(400, 'Invalid ID format.');
    }

    try {
      const foundUser = await UserSchema.findOne({ _id: mongoose.Types.ObjectId(id) })
      return foundUser;
    } catch (error) {
      return customError(error.status || 500, error.message || "Internal server error.");
    }
  }

  async create(data) {
    try {
      const user = new UserSchema(data);
      await user.save();
      return user;
    } catch (error) {
      return customError(error.status || 500, error.message || "Internal server error.");
    }
  }

  async update(id, data) {
    if (!mongoose.isValidObjectId(id)) {
      return customError(400, 'Invalid ID format.');
    }

    try {
      const user = await UserSchema.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, omit(data, ['operation']), { new: true });
      return user;
    } catch (error) {
      return customError(error.status || 500, error.message || "Internal server error.");
    }
  }

  async delete(id) {
    if (!mongoose.isValidObjectId(id)) {
      return customError(400, 'Invalid ID format.');
    }

    try {
      await UserSchema.deleteOne({ _id: mongoose.Types.ObjectId(id) });
      return true;
    } catch (error) {
      return customError(error.status || 500, error.message || "Internal server error.");
    }
  }
}