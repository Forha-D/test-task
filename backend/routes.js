const express = require('express');
const passport = require('passport');
const authController = require('./controllers/authController');

const router = express.Router();

router.post('/login', passport.authenticate('local', { session: false }), authController.login);
router.get('/auth/google', authController.googleAuth);

router.options('/auth/google/callback', (req, res) => {
    res.status(200).end();
  });

router.route('/auth/google/callback')
  .get(passport.authenticate('google', { session: false }), authController.googleAuthCallback)
  .post(passport.authenticate('google', { session: false }), authController.googleAuthCallback);

router.get('/logout', authController.logout);

module.exports = router;
