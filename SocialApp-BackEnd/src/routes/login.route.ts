import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.model';
import { Request, Response, NextFunction } from 'express';

// Create user
export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, email, password } = req.body;
  try {
    // Check if the user exists
    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return; // Exit the function after sending the response
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Get user profile
export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.params;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return; // Exit the function after sending the response
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user profile' });
  }
};

// List all users (Admin-only)
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users' });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.params;
  const { username, email, avatar, bio, role } = req.body;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { username, email, avatar, bio, role },
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return; // Exit the function after sending the response
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.params;
  try {
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      res.status(404).json({ message: 'User not found' });
      return; // Exit the function after sending the response
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

export default {
    createUser,
    getUserProfile,
    getAllUsers,
    updateUser,
    deleteUser,
  };