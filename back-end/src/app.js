const express = require('express');
const session = require('express-session');

const redisClient = require('./redisClient');
const connectRedis = require('connect-redis');

const bodyParser = require('body-parser');
const compression = require('compression');

const cookieParser = require('cookie-parser');
const errorHandler = require('errorhandler');

const morgan = require('morgan');

const http = require('http');
const path = require('path');
const os = require('os');
const { routes } = require('./routes');
const { controllers } = require('./controllers');

const oneDay = 1000 * 60 * 60 * 24;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const RedisStore = connectRedis(session);

let store = new RedisStore({ client: redisClient });

const bcrypt = require('bcrypt');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

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
        const isUserExist = await redisClient.exists(`emails:${email}`);

        const wrongCredentialsMessage = 'Provided email or password is not found.';

        if (!isUserExist) {
          return done(null, false, { message: wrongCredentialsMessage });
        }

        const userId = await redisClient.get(`emails:${email}`);

        const hashedUserPassword = await redisClient.hGet(`users:${userId}`, 'password');

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

const port = '3000';

app.set('port', port);

app.use(session({
  store,
  secret: 'good-password',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: oneDay,
    httpOnly: false,
  },
}));

const viewsDir = __dirname + '/views';

app.set('views', viewsDir);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

const devEnv = app.get('env') === 'development';
app.use(morgan(devEnv ? 'dev' : 'combined'));

app.use(cookieParser());

app.use(compression());

app.use(passport.initialize());
app.use(passport.session());

const ONE_DAY = 86400000;

app.use('/views', express.static(__dirname + '/views', { maxAge: ONE_DAY }));
app.use('/js', express.static(__dirname + '/views/js', { maxAge: ONE_DAY }));
app.use('/css', express.static(__dirname + '/views/css', { maxAge: ONE_DAY }));
app.use('/img', express.static(__dirname + '/views/img', { maxAge: ONE_DAY }));

const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir, { maxAge: ONE_DAY }));

routes(app);
controllers(app);

if (devEnv) app.use(errorHandler());

app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

http.createServer(app).listen(port, () => {
  console.log('App server running at http://' + os.hostname() + ':' + port);
});

module.exports = passport;
