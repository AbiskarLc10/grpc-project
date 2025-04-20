const client = require("./redisclient");

const CheckAndUpdateRedisDatabase = async (userId) => {
  try {
    const userCachedData = await client.get(userId);

    console.log(userCachedData);
    if (userCachedData) {
      return JSON.parse(userCachedData);
    }

    return null;
  } catch (error) {
    throw error;
  }
};

const AddUserToRedis = async (userData, userId) => {
  try {
    await client.setEx(`user:${userId}`, 3600, JSON.stringify(userData));
  } catch (error) {
    throw error;
  }
};

const AddBooksToRedis = async (books, key) => {
  try {
    await client.setEx(key, 3600, JSON.stringify(books));
  } catch (error) {
    throw error;
  }
};

const CheckBooksInCache = async (key) => {
  try {
    const booksInCache = await client.get(key);

    if (booksInCache) {
      return JSON.parse(booksInCache);
    }
    return null;
  } catch (error) {}
};
module.exports = {
  CheckAndUpdateRedisDatabase,
  AddUserToRedis,
  AddBooksToRedis,
  CheckBooksInCache,
};
