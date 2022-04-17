import User from '../../../domain/users/entities/user.entity.mjs';

export class UserService {
  userRepository;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async listAll(params) {
    const users = await this.userRepository.listAll(params);
    return users;
  }

  async getOneById(id) {
    const user = await this.userRepository.getOneById(id);
    return user;
  }

  async create(data) {
    const newUser = new User(data);
    const { errors, isValid } = newUser.isValid();

    if (!isValid) {
      throw new Error(errors.join(" "));
    }

    const persistedUser = await this.userRepository.create(newUser);
    return persistedUser;
  }

  async update(id, data) {
    const user = await this.userRepository.update(id, data);
    return user;
  }

  async delete(id) {
    await this.userRepository.delete(id);
  }
}