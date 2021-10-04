const books = require('./books');
const users = require('./users');

function controllers (app) {
  // books(app);
  users(app);
}

module.exports = {
  controllers, 
};
