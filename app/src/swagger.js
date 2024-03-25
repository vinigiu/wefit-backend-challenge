const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = [
  './routes/index.ts',
];

const doc = {
    info: {
      title: 'User Registration API',
      description: 'Provides resources to interact with User Registration API',
    },
    host: "localhost:4568",
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
};

swaggerAutogen(outputFile, endpointsFiles, doc);