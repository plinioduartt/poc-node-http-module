import User from "./user.entity.mjs";

describe("User Entity", () => {
  it("should create a valid User instance", () => {
    const testUser = new User({ name: "Test user", email: 'test@gmail.com', age: 23, status: 'ENABLED', city: 'Paulínia', uf: 'SP' });
    expect(testUser).toBeInstanceOf(User);
    expect(testUser).toHaveProperty('name');
    expect(testUser).toHaveProperty('email');
    expect(testUser).toHaveProperty('age');
    expect(testUser).toHaveProperty('status');
    expect(testUser).toHaveProperty('city');
    expect(testUser).toHaveProperty('uf');
  });
});

describe("User Entity", () => {
  it("should return an error when missing a property", () => {
    const testUser = new User({ name: "Test user", email: 'test@gmail.com', status: 'ENABLED', city: 'Paulínia', uf: 'SP' });
    expect(testUser).toBeInstanceOf(User);
    expect(testUser).toHaveProperty('name');
    expect(testUser).toHaveProperty('email');
    expect(testUser).not.toHaveProperty('age');
    expect(testUser).toHaveProperty('status');
    expect(testUser).toHaveProperty('city');
    expect(testUser).toHaveProperty('uf');
  });
});