const { createClient } = require("redis");

const client = createClient({
  username: "default",
  password: "SCcbv3ZI79gDFHenLgMjjAGEXXkKJ1dR",
  socket: {
    host: "redis-18758.c245.us-east-1-3.ec2.redns.redis-cloud.com",
    port: 18758,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", (data) => {
  console.log("Connected to redis server successfully");
});


module.exports = client;
