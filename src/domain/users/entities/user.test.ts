import User from './user.entity';
import { omit } from 'lodash';
import { IUser } from './user.type';

describe("User Entity", () => {
  it("should create a valid User instance", () => {
    // arrange
    const testUser = new User({ name: "Test user", email: 'test@gmail.com', age: 23, status: 'ENABLED', city: 'Paulínia', uf: 'SP' } as IUser);

    // act
    const { isValid } = testUser.isValid();

    // asserts
    expect(isValid).toBeTruthy();
    expect(testUser).toBeInstanceOf(User);
    expect(testUser).toHaveProperty('name');
    expect(testUser).toHaveProperty('email');
    expect(testUser).toHaveProperty('age');
    expect(testUser).toHaveProperty('status');
    expect(testUser).toHaveProperty('city');
    expect(testUser).toHaveProperty('uf');
  });

  it("should return an error when missing a property", () => {
    // arrange
    const data: IUser = { name: "Test user", email: 'test@gmail.com', age: 23, status: 'ENABLED', city: 'Paulínia', uf: 'SP' };
    const testUser = new User(omit(data, ['age']) as IUser);

    // act
    const { isValid, errors } = testUser.isValid();

    // asserts
    expect(isValid).toBeFalsy();
    expect(errors).toEqual(expect.arrayContaining(["property age is missing."]));
  });
});