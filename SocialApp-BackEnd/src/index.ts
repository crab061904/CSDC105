require('dotenv').config();  // Make sure this is at the very top
const methodOverride = require('method-override');
const morgan = require('morgan');
import express from 'express';
import mongoose from 'mongoose';
import { createUser, getUserProfile, getAllUsers, updateUser, deleteUser, loginUser } from './routes/index';
import { verifyToken } from './middleware/index';

const app = express();
app.use(express.json()); // for parsing application/json

// Check if MONGO_URI is available in the environment variables
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in .env file');
}

// User routes
app.post('/user/create', createUser);  // Register
app.post('/login', loginUser);  // Login

// CRUD operations (protected routes)
app.get('/users', verifyToken, getAllUsers); // List all users (Admin only)
app.get('/user/:userId', verifyToken, getUserProfile);  // Get profile by ID
app.put('/user/:userId', verifyToken, updateUser); // Update user
app.delete('/user/:userId', verifyToken, deleteUser); // Delete user

mongoose
  .connect(process.env.MONGO_URI,)
  .then(() => {
    console.log('Connected to database!');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.log('Connection Failed!', error);
  });
