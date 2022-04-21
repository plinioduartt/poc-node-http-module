import IUserRepository from '@/src/domain/users/repositories/user.repository';
import User from '../../../domain/users/entities/user.entity';
import CustomError from '../../../errors/CustomError';
import IUserService from './user.interface';

export default class UserService implements IUserService {
  private readonly userRepository: IUserRepository;
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async listAll(params: any): Promise<any[]> {
    const users = await this.userRepository.listAll(params);
    return users || [];
  }

  async getOneById(id: string): Promise<any> {
    const user = await this.userRepository.getOneById(id);

    if (!user) {
      throw new CustomError({ status: 404, message: 'User not found.' });
    }

    return user;
  }

  async create(data: any): Promise<any> {
    const newUser = new User(data);
    const { errors, isValid } = newUser.isValid();

    if (!isValid) {
      throw new CustomError({ status: 400, message: errors.join(" ") });
    }

    const persistedUser = await this.userRepository.create(newUser);
    return persistedUser;
  }

  async update(id: string, data: any): Promise<any> {
    const userExists = await this.userRepository.getOneById(id);

    if (!userExists) {
      throw new CustomError({ status: 404, message: 'User not found.' });
    }

    const user = await this.userRepository.update(id, data);
    return user;
  }

  async delete(id: string): Promise<void> {
    const userExists = await this.userRepository.getOneById(id);

    if (!userExists) {
      throw new CustomError({ status: 404, message: 'User not found.' });
    }

    await this.userRepository.delete(id);
  }
}