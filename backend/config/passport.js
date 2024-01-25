const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/user'); 

// Local strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    let user = await User.findOne({ email });

    // If the user does not exist, create a new user
    if (!user) {
      const hashedPassword = bcrypt.hashSync(password, 10); // You can adjust the salt rounds

      // Create a new user
      user = await User.create({
        email: email,
        password: hashedPassword
      });
    } else {
      // If the user exists, check the password
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: 'Incorrect password' });
      }
    }

    // If everything is successful, return the user
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5005/auth/google/callback",
  scope: ['profile', 'email'] 
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = await User.create({ googleId: profile.id, email: profile.emails[0].value, password: 'GoogleAuth' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.user._id);

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
