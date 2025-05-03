import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserModel } from '../models/User.model'; // Import the User model

dotenv.config();

const secretKey = process.env.SECRET_KEY || 'your-default-secret-key';

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'No token provided, access denied.' });
    return;
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, secretKey);

    // Type narrowing to ensure 'decoded' is a JwtPayload
    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
      // Now decoded is treated as JwtPayload
      const user = await UserModel.findById(decoded.id); // Assuming 'id' is part of the decoded JWT payload

      if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }

      // Attach the user to req object
      req.user = user;  // This requires a custom declaration for `user` on `Request` interface

      next();
    } else {
      res.status(400).json({ message: 'Invalid token.' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
