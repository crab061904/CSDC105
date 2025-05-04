import express from 'express';
import passport from 'passport';

const router = express.Router();

// Route to start Google authentication
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],  // Request profile and email scopes
  })
);

// Google OAuth callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('Google Callback route hit');  // Debugging log
    res.redirect('/profile');  // Redirect to profile after successful login
  }
);

export default router;
