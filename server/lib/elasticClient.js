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
  const res = await elkclient.index({
    index: 'app-logs',
    document: {
      message: 'Test log',
      timestamp: new Date().toISOString(),
    },
  });
  console.log('Index response:', res);
  } catch (error) {
    console.log(error);
  }
};

// insertTestData()

module.exports = elkclient;
