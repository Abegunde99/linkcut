const redis = require('redis');

// Create a Redis client instance
const redisClient = redis.createClient(
  6379        // Replace with your Redis server port
  // Add any other configuration options as needed
);

// Handle Redis client connection events
redisClient.on('connect', () => {
  console.log('Connected to Redis server');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Function to safely close the Redis client
const closeRedisClient = () => {
    redisClient.quit((err) => {
        if (err) {
            console.error('Error closing Redis client:', err);
        } else {
            console.log('Redis client closed');
        }
    });
};

// Gracefully handle process termination
process.on('SIGINT', () => {
  closeRedisClient();
  process.exit();
});

// Example usage
// redisClient.get('key', (err, value) => {
//   if (err) {
//     console.error('Error retrieving value from Redis:', err);
//   } else {
//     console.log('Retrieved value:', value);
//   }
// });

// Close Redis client when it is no longer needed
// closeRedisClient();

module.exports = { redisClient, closeRedisClient };