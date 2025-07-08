const { createClient } = require("redis");

const client = createClient({
  "username": "default",
  "password": "GuvR1lr09NFzoCmN25ZBLKiKUG1rfbga",
  "socket": {
    "host": "redis-15223.c62.us-east-1-4.ec2.redns.redis-cloud.com",
    "port": 15223
  }
});


client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", (data) => {
  console.log("Connected to redis server successfully");
});


module.exports = client;
