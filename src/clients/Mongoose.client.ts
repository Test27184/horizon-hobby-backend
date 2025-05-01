import mongoose from 'mongoose';

mongoose.set('strictQuery', false);
mongoose.set('runValidators', true);

mongoose.connection.on('connecting', () => {
  console.log('Connecting to MongoDB...');
});
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected!');
});
mongoose.connection.on('open', function () {
  console.log('MongoDB connection opened!');
});
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected!');
});
mongoose.connection.on('close', function () {
  console.log('Connection to MongoDB is closed');
});
mongoose.connection.on('error', error => {
  console.error('Error connecting to MongoDB: ' + error);
});

export const MongooseClient = {
  connect: async (debug = false) => {
    try {
      if (debug) {
        mongoose.set('debug', true);
      }

      await mongoose.connect(process.env.DB_CONNECTION_STRING as string, {
        dbName: process.env.DB_DATABASE,
      });
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
    return mongoose;
  },
  disconnect: async () => {
    try {
      await mongoose.connection.close();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
    return mongoose;
  },
  isConnected: () => Number(mongoose.connection.readyState) === 1,
};
