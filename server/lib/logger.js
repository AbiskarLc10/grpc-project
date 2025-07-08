const winston = require('winston');
const { format } = winston;
const elkclient = require('./elasticClient');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const esTransportOpts = {
  level: 'info',
  client: elkclient,
  indexPrefix: 'app-logs',
};

const esTransport = new ElasticsearchTransport(esTransportOpts);
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize({
          all: true,
        })
      ),
    }),
    new winston.transports.File({
      filename: 'logs/db.log',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
      level: 'info',
    }),
    esTransport,
  ],
});


esTransport.on('error', (error) => {
  console.error('Elasticsearch Transport Error:', error);
});

esTransport.on('logged', (info) => {
  console.log('Log sent to Elasticsearch:', info);
});

winston.exceptions.handle(
  new winston.transports.Console({ format: winston.format.simple() }),
  new winston.transports.File({ filename: 'logs/exceptions.log' })
);

module.exports = logger;
