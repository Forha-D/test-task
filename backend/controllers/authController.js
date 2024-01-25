const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authController = {};

authController.login = (req, res) => {
    // Use passport.authenticate middleware to handle the login
    passport.authenticate('local', async (err, user, info) => {
      try {
        if (err) {
          return res.status(500).json({ message: 'Internal Server Error' });
        }
  
        if (!user) {
          return res.status(200).json({ message: info.message || 'Authentication failed' });
        }
  
        // Save user information to the database
        await saveUserToDatabase(user);
  
        // If authentication is successful, create a JWT token
        const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
        // Send the token in the response
        res.json({ token });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    })(req, res);
  };
  
  // Helper function to save user information to the database
  async function saveUserToDatabase(user) {
    try {
      // Check if the user already exists in the database based on their email
      const existingUser = await User.findOne({ email: user.email });
  
      // If the user doesn't exist, create a new user in the database
      if (!existingUser) {
        await User.create({ email: user.email, password: 'LocalAuth' });
      }
  
    // update the user record with additional data if needed
      // user.name = req.body.name;
      // user.save();
    } catch (error) {
      console.error('Error saving user to the database:', error);
      // Handle the error based on your application's requirements
    }
  }
  

authController.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

authController.googleAuthCallback = passport.authenticate('google', { failureRedirect: '/' }, (req, res) => {
  console.log('Google Auth Callback Triggered');
    try {
      if (req.user) {
        // If user authenticated successfully with Google
  
        // Generate a JWT token for the user
        const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET);
  
        // Redirect to a page with the JWT token as a query parameter
        res.redirect(`/login-success?token=${token}`);
      } else {
        console.log('User authentication failed.');
        res.redirect('/login-failure');
      }
    } catch (error) {
      console.error('Error during Google authentication callback:', error);
      res.redirect('/login-failure');
    }
});



authController.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

module.exports = authController;
