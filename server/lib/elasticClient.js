const { Client } = require('@elastic/elasticsearch');
const elkclient = new Client({
  node: 'https://my-elasticsearch-project-f48d31.es.us-east-1.aws.elastic.cloud:443',
  auth: {
    apiKey: 'Mk05STQ1Y0I5Zmt5UmUwcGFXSXA6OERKV3l2Q3lHTzUtWWNnUVdtTUJWdw==',
  },
  serverMode: 'serverless',
});

const insertTestData = async () => {
  try {
    const res = await elkclient.search({
      index: 'store',
      body: {
        query: {
          match_all: {},
        },
      },
    });
    console.log(res.hits.hits);
  } catch (error) {
    console.log(error);
  }
};

// insertTestData()

module.exports = elkclient;
