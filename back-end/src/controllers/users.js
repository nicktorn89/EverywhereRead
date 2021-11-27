const bcrypt = require('bcrypt');
const passport = require('passport');
const { existsAsync, getAsync, setAsync, hSetAsync, incrAsync } = require('../redisClient');
const saltRounds = 10;

const users = (app) => {
  app.post(
    '/rest/login',
    passport.authenticate('local'),
    (_req, res) => {
      return res.status(200).send({ redirect: '/reader' });
    },
  );

  app.post('/rest/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password || email.length <= 0 || password.length <= 0) {
      return res.status(400).send('Password or email was not provided');
    }

    try {
      bcrypt.hash(password, saltRounds, async (error, hash) => {
        if (error) return res.status(500).send('Error while signup');

        const isEmailExist = await existsAsync(`emails:${email}`);

        if (isEmailExist) {
          return res.status(400).send('Email was already registered');
        }

        const oldUserId = await existsAsync('users:');

        if (!oldUserId) {
          await setAsync('users:', '10000');
        } else {
          await incrAsync('users:');
        }

        const currentUserId = await getAsync('users:');

        await setAsync(`emails:${email}`, currentUserId);
        await hSetAsync(`users:${currentUserId}`, 'email', email, 'name', '', 'password', hash);

        res.send(200);
      });
    } catch (error) {
      console.error('Error while sign up', error);

      return res.status(500).send();
    }
  });
};

module.exports = users;
