const router = require('express').Router()
const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDefinition = {
  openapi: '3.0.0',
  info: { 
      title: 'OURCAT',
      version: '1.0.0',
      description: '우리 고양이를 위한 api'
  },
  host: '/',
  servers: [
      {url: '/'}
  ],
  securitySchemes: {
      jwt: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
      }
  },
  security: [ { jwt: [] } ]
};

const options = {
  swaggerDefinition,
  apis: [ 'routes/*.yml', 'routes/*/*.yml']
};
const swaggerSpec = swaggerJSDoc(options);

router.use('/', swaggerUi.serveWithOptions({cacheControl: false}))
router.get('/', swaggerUi.setup(swaggerSpec))


module.exports = router;