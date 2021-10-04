const bcrypt = require('bcrypt');
const passport = require('passport');
const redisClient = require('../redisClient');
const saltRounds = 10;

const users = (app) => {
  app.post(
    '/rest/login',
    passport.authenticate('local', { successRedirect: '/reader' }),
  );

  app.post('/rest/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password || email.length <= 0 || password.length <= 0) {
      return res.status(400).send('Password or email was not provided');
    }

    try {
      bcrypt.hash(password, saltRounds, async (error, hash) => {
        if (error) return res.status(500).send('Error while signup');

        const isEmailExist = await redisClient.exists(`emails:${email}`);

        if (isEmailExist) {
          return res.status(400).send('Email was already registered');
        }

        const oldUserId = await redisClient.exists('users:');

        if (!oldUserId) {
          await redisClient.set('users:', '10000');
        } else {
          await redisClient.incr('users:');
        }

        const currentUserId = await redisClient.get('users:');

        await redisClient.set(`emails:${email}`, currentUserId);
        await redisClient.hSet(`users:${currentUserId}`, { email, name: '', password: hash });

        res.send(200);
      });
    } catch (error) {
      console.error('Error while sign up', error);

      return res.status(500).send();
    }
  });
};

module.exports = users;
