import { IUser } from "./user.type";

class User {
  public readonly _id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly age: number;
  public readonly status: string;
  public readonly city: string;
  public readonly uf: string;

  constructor({
    name,
    email,
    age,
    status,
    city,
    uf
  }: IUser) {
    this.name = name;
    this.email = email;
    this.age = age;
    this.status = status;
    this.city = city;
    this.uf = uf;
  }

 isValid() {
    const propertyNames = Object.getOwnPropertyNames(this);
    const errors = propertyNames
      .map(property => !!this[property as keyof IUser] ? null : `property ${property} is missing.`)
      .filter(item => !!item);

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export default User;