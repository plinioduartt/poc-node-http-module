import UserSchema from "../schemas/user.schema.mjs";

export class UserRepository {
  constructor() { }

  async listAll(params) {
    const users = await UserSchema.find();
    return users;
  }

  async getOneById(id) {

  }

  async create(data) {
    const user = new UserSchema(data);
    await user.save();
    return user;
  }

  async update(id, data) {

  }

  async delete(id) {

  }
}