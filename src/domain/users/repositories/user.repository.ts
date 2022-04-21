import { IUser } from "../entities/user.type";

export default interface IUserRepository {
  listAll(params: any): Promise<IUser[] | void>;
  getOneById(id: string): Promise<IUser | void>;
  create(data: IUser): Promise<IUser | void>;
  update(id: string, data: IUser): Promise<IUser | void>;
  delete(id: string): Promise<void>;
}