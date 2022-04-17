const express = require('express');
const session = require('express-session');

const bodyParser = require('body-parser');
const compression = require('compression');

const cookieParser = require('cookie-parser');
const errorHandler = require('errorhandler');

const morgan = require('morgan');

const http = require('http');
const path = require('path');
const os = require('os');
const { redisClient } = require('./redisClient');
const RedisStore = require('connect-redis')(session);

const { routes } = require('./routes');
const { controllers } = require('./controllers');
const passport = require('./passportInit');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  store: new RedisStore({
    client: redisClient,
  }),
  secret: 'good-password',
  resave: false,
  saveUninitialized: false
}));

const port = '3000';

app.set('port', port);

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

app.use('/public', express.static(path.join(__dirname + '/../public/'), { maxAge: ONE_DAY }));

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
