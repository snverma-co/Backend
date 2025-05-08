import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('❌ MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // console.log( MongoDB connected: ${mongoose.connection.name});

    // Optional connection status logging
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    throw err;
  }
};

export default connectDB;

// const connectDB = async () => {
//   try {

//     if (!process.env.MONGODB_URI) {
      
//       throw new Error('MongoDB connection string is not defined');
//     }

//     const options = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 30000,
//       socketTimeoutMS: 45000,
//       family: 4,
//       retryWrites: true,
//       w: 'majority',
//       dbName: 'website',
//       tls: true,
//       // tlsInsecure: true
//     };

//     await mongoose.connect(process.env.MONGODB_URI, options);
//     console.log('MongoDB connected successfully to:', mongoose.connection.name);
    
//     // Set up connection error handling
//     mongoose.connection.on('connecting', () => {
//       console.log('Connecting to MongoDB...');
//     });
    
//     mongoose.connection.on('connected', () => {
//       console.log('Connected to MongoDB');
//     });

//     mongoose.connection.on('error', (err) => {
//       console.log('error coming from  where')
//       console.error('MongoDB connection error:', err);
//     });

//     mongoose.connection.on('disconnected', () => {
  
//       console.log('MongoDB disconnected');
//     });
//   } catch (error) {
//     console.log('error coming from  catch')
//     console.error('MongoDB connection error:', error);
//     throw error;
//   }
// };

// export default connectDB;


