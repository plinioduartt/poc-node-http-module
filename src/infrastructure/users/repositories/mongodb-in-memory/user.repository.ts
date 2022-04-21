import UserSchema from "../../schemas/mongodb-in-memory/user.schema";
import mongoose from 'mongoose';
import pkg from 'lodash';
import CustomError from "../../../../errors/CustomError";
import { IUser } from "../../../../domain/users/entities/user.type";
import IUserRepository from "@/src/domain/users/repositories/user.repository";
const { omit } = pkg;

export default class UserRepository implements IUserRepository {
  constructor() { }

  async listAll(params: any): Promise<IUser[] | void> {
    try {
      const users = await UserSchema.find();
      return users;
    } catch (error: any) {
      throw new CustomError({
        status: error.status || 500,
        message: error.message || "Internal server error."
      });
    }
  }

  async getOneById(id: string): Promise<IUser | void> {
    if (!mongoose.isValidObjectId(id)) {
      throw new CustomError({ status: 400, message: 'Invalid ID format.' });
    }

    try {
      const foundUser = await UserSchema.findOne({ _id: new mongoose.Types.ObjectId(id) })
      return foundUser;
    } catch (error: any) {
      throw new CustomError({
        status: error.status || 500,
        message: error.message || "Internal server error."
      });
    }
  }

  async create(data: IUser): Promise<IUser | void> {
    try {
      const user = new UserSchema(data);
      await user.save();
      return user;
    } catch (error: any) {
      throw new CustomError({
        status: error.status || 500,
        message: error.message || "Internal server error."
      });
    }
  }

  async update(id: string, data: IUser): Promise<IUser | void> {
    if (!mongoose.isValidObjectId(id)) {
      throw new CustomError({ status: 400, message: 'Invalid ID format.' });
    }

    try {
      const user = await UserSchema.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, omit(data, ['operation']), { new: true });
      return user;
    } catch (error: any) {
      throw new CustomError({
        status: error.status || 500,
        message: error.message || "Internal server error."
      });
    }
  }

  async delete(id: string): Promise<void> {
    if (!mongoose.isValidObjectId(id)) {
      throw new CustomError({ status: 400, message: 'Invalid ID format.' });
    }

    try {
      await UserSchema.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
      return;
    } catch (error: any) {
      throw new CustomError({
        status: error.status || 500,
        message: error.message || "Internal server error."
      });
    }
  }
}