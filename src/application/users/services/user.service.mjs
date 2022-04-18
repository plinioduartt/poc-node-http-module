import mongoose from 'mongoose';
import User from '../../../domain/users/entities/user.entity.mjs';
import customError from '../../../handlers/customError.mjs';

export default class UserService {
  userRepository;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async listAll(params) {
    const users = await this.userRepository.listAll(params);
    return users;
  }

  async getOneById(id) {
    if (!mongoose.isValidObjectId(id)) {
      return customError(400, 'Invalid ID format.');
    }

    const user = await this.userRepository.getOneById(mongoose.Types.ObjectId(id));

    if (!user) {
      return customError(404, 'User not found.');
    }
    return user;
  }

  async create(data) {
    const newUser = new User(data);
    const { errors, isValid } = newUser.isValid();

    if (!isValid) {
      return customError(400, errors.join(" "));
    }

    const persistedUser = await this.userRepository.create(newUser);
    return persistedUser;
  }

  async update(id, data) {
    if (!mongoose.isValidObjectId(id)) {
      return customError(400, 'Invalid ID format.');
    }

    const userExists = await this.userRepository.getOneById(mongoose.Types.ObjectId(id));

    if (!userExists) {
      return customError(404, 'User not found.');
    }
    const user = await this.userRepository.update(id, data);
    return user;
  }

  async delete(id) {
    if (!mongoose.isValidObjectId(id)) {
      return customError(400, 'Invalid ID format.');
    }

    const userExists = await this.userRepository.getOneById(mongoose.Types.ObjectId(id));
    if (!userExists) {
      return customError(404, 'User not found.');
    }
    await this.userRepository.delete(id);
  }
}