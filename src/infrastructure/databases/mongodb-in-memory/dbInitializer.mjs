import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

class DBInitializer {
  _mongoInstance;
  constructor() { }

  async open() {
    this._mongoInstance = await MongoMemoryServer.create();
    const uri = this._mongoInstance.getUri();
    mongoose.connect(uri, {
      useNewUrlParser: true,
      dbName: process.env.DB_NAME,
      useUnifiedTopology: true,
    });
  }

  async close() {
    await mongoose.disconnect();
    await this._mongoInstance.stop();
  }
}

export default new DBInitializer();