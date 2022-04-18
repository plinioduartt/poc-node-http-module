class User {
  constructor({
    name,
    email,
    age,
    status,
    city,
    uf
  }) {
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
      .map((property) => !!this[property] ? null : `property ${property} is missing.`)
      .filter(item => !!item);

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export default User;