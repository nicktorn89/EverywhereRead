const bcrypt = require('bcrypt');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { existsAsync, getAsync, hgetAsync } = require('./redisClient');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (username, done) {
  done(null, username);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const isUserExist = Boolean(await existsAsync(`emails:${email}`));

        const wrongCredentialsMessage = 'Provided email or password is not found.';

        if (!isUserExist) {
          return done(null, false, { message: wrongCredentialsMessage });
        }

        const userId = await getAsync(`emails:${email}`);

        const hashedUserPassword = await hgetAsync(`users:${userId}`, 'password');

        const isPasswordValid = await (
          new Promise((resolve, reject) => bcrypt.compare(password, hashedUserPassword, (err, result) => {
            if (err) reject(err);

            resolve(result);
          }))
        );

        if (isPasswordValid) {
          return done(null, userId);
        }

        return done(null, false);
      } catch (error) {
        return done(error);
      }
    }
  ),
);

module.exports = passport;
