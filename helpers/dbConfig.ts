import mongoose from 'mongoose';

export default async function connectDb() {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL!);
    connection.connection.on('connected', () => {
      console.log('MongoDB connected: ', connection.connection.host);
    })
  } catch (error: unknown) {
    console.log('MongoDB connection error:', error);
    process.exit(1);
  }
}