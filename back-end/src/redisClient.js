const redis = require('redis');

let redisClient = redis.createClient(
  {
    url: 'http://localhost:6379',
  },
);

redisClient.on('error', function(error) {
  console.error('Error with redis client', error);
});

module.exports = redisClient;
