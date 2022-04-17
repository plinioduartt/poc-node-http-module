class User {
  name;
  email;
  age;
  status;
  city;
  uf;
  constructor({
    name,
    email,
    age,
    status,
    city,
    uf
  }) {
    this._create({
      name,
      email,
      age,
      status,
      city,
      uf
    });
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

  _create(userData) {
    this.name = userData.name;
    this.email = userData.email;
    this.age = userData.age;
    this.status = userData.status;
    this.city = userData.city;
    this.uf = userData.uf;
  }
}

export default User;