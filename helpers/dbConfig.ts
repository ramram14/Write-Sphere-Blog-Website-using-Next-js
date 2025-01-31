import mongoose from 'mongoose';

let isConnected = false;

export default async function connectDb() {
  if (isConnected) {
    console.log('Already connected to the database');
    return;
  }


  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL!,);
    connection.connection.on('connected', () => {

      isConnected = connection.connection.readyState === 1;
      console.log('MongoDB connected: ', connection.connection.host);
    })
  } catch (error: unknown) {
    console.log('MongoDB connection error:', error);
    process.exit(1);
  }
}