import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.model';
import { Request, Response, NextFunction } from 'express';

const secretKey = 'yourSecretKey';  // Replace this with an environment variable

// Corrected login handler with async and Promise<void>
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await UserModel.findOne({ email });
    
    // If user doesn't exist, return an error response
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    
    // If password doesn't match, return an error response
    if (!isMatch) {
     res.status(400).json({ message: 'Invalid credentials' });
     return
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });

    // Send the token in the response
    res.status(200).json({ token });
  } catch (err) {
    // Send error response and avoid returning res
    res.status(500).json({ message: 'Error logging in' });
  }
};

export default {
   loginUser
  };
