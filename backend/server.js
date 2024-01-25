const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const cors = require('cors');
require('dotenv').config();

const app = express();
// Rest of your code...

app.use(passport.initialize());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
  //useNewUrlParser: true, 
  //useUnifiedTopology: true
 });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Passport.js setup
require('./config/passport');
const routes = require('./routes');
// Routes
app.use('/', routes);

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
