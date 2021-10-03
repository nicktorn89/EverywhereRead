const redis = require('redis');

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
  db: 1,
});

console.log('redisClient', redisClient);

redisClient.on('error', console.log);

redisClient.connect();

module.exports = redisClient;
