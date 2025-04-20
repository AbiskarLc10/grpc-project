const client = require("./redisclient");

const CheckDataInRedisDatabase = async (key) => {
  try {
    const redisCachedData = await client.get(key);

    console.log(redisCachedData);
    if (redisCachedData) {
      return JSON.parse(redisCachedData);
    }

    return null;
  } catch (error) {
    throw error;
  }
};

const AddUserToRedis = async (userData, userId) => {
  try {
    await client.setEx(
      `user:${userId}`,
      3600,
      JSON.stringify(userData, null, 2)
    );
  } catch (error) {
    console.error(`Redis setEx failed for User: ${key}`, error);
    throw error;
  }
};

const AddBooksToRedis = async (books, key) => {
  try {
    await client.setEx(key, 3600, JSON.stringify(books));
  } catch (error) {
    console.error(`Redis setEx failed for key: ${key}`, error);
    throw error;
  }
};

const AddReviewsToRedis = async (reviews, key) => {
  try {
    await client.setEx(key, 3600, JSON.stringify(reviews));
  } catch (error) {
    console.error(`Redis setEx failed for reviews key: ${key}`, error);
    throw error;
  }
};

module.exports = {
  CheckDataInRedisDatabase,
  AddUserToRedis,
  AddBooksToRedis,
  AddReviewsToRedis,
};
