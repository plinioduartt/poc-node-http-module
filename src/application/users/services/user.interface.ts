import { IUser } from "../../../domain/users/entities/user.type";

type ListAllParams = IUser & {}

export default interface IUserService {
  listAll(params: ListAllParams): Promise<IUser[] | void>;
  getOneById(id: string): Promise<IUser | void>;
  create(data: IUser): Promise<IUser | void>;
  update(id: string, data: IUser): Promise<IUser | void>;
  delete(id: string): Promise<IUser | void>;
}