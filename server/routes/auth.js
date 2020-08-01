const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc    Auth with Google
// @route   GET /auth/google
router.get(
  '/google',
  passport.authenticate('google', {
    accessType: 'offline',
    prompt: 'consent',
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
  })
);

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000' }),
  (req, res) => {
    res.redirect('http://localhost:3000');
  }
);

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('http://localhost:3000');
});

module.exports = router;
