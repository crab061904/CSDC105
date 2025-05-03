import dotenv from 'dotenv';  // Import dotenv
dotenv.config();  // Load environment variables from the .env file

import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import methodOverride from 'method-override';
import userRoutes from './routes/user.route';

// Initialize the app
const app = express();

// Middleware for parsing application/json
app.use(express.json());

// Middleware for logging requests
app.use(morgan('dev'));

// Middleware for supporting HTTP methods like PUT and DELETE from forms
app.use(methodOverride('_method'));

// Check if MONGO_URI is available in the environment variables
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in .env file');
}

if (!process.env.SECRET_KEY) {
  throw new Error('SECRET_KEY is not defined in .env file');
}

// Routes for user management
app.use('/api/users', userRoutes);

// MongoDB connection using async/await for better error handling
const connectDB = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to the database!');
    console.log('MONGO_URI:', process.env.MONGO_URI); // Log to verify connection string
    console.log('SECRET_KEY:', process.env.SECRET_KEY); // Log to verify secret key

    // Start the server after successful database connection
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('Connection Failed!', error);
    process.exit(1); // Exit the process with a non-zero status code if MongoDB connection fails
  }
};

// Call the connectDB function to establish the connection
connectDB();
