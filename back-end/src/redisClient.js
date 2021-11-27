const redis = require('redis');
const { promisify } = require('util');

let redisClient = redis.createClient(
  {
    url: 'redis://localhost:6379',
  },
);

redisClient.on('error', function (error) {
  console.error('Error with redis client', error);
});

const getAsync = promisify(redisClient.get).bind(redisClient);
const existsAsync = promisify(redisClient.exists).bind(redisClient);

const hgetAsync = promisify(redisClient.hget).bind(redisClient);

const setAsync = promisify(redisClient.set).bind(redisClient);
const hSetAsync = promisify(redisClient.hset).bind(redisClient);

const incrAsync = promisify(redisClient.incr).bind(redisClient);

module.exports = {
  redisClient,

  getAsync,
  existsAsync,
  hgetAsync,
  setAsync,
  hSetAsync,
  incrAsync,
};
