import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { ConnectionOptions } from 'node:tls';

class DBInitializer {
  private _mongoServerInstance: MongoMemoryServer;
  constructor() { }

  async open() {
    this._mongoServerInstance = await MongoMemoryServer.create();
    const uri = this._mongoServerInstance.getUri();
    mongoose.connect(uri, {
      useNewUrlParser: true,
      dbName: process.env.DB_NAME,
      useUnifiedTopology: true,
    } as ConnectionOptions);
  }

  async close() {
    await mongoose.disconnect();
    await this._mongoServerInstance.stop();
  }
}

export default new DBInitializer();