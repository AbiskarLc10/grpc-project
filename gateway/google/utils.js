const { google } = require("googleapis");
const people = google.people("v1");

async function getUserInfo(oauth2Client) {
  const res = await people.people.get({
    resourceName: "people/me",
    auth: oauth2Client,
    personFields: "names,birthdays,addresses",
  });

  console.log(res);
  return res.data;
}

module.exports = { getUserInfo };
