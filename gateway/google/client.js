require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const oauth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: "http://localhost:8000/api/auth/google/callback",
});

module.exports = oauth2Client;
