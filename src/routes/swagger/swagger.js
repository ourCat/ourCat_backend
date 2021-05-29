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
    { url: '/' }
  ],
  components: {
    securitySchemes: {
      token: {
        type: 'http',
        scheme: 'Bearer',
      }
    }
  },
  // security: [{ token: [] }]
}

const options = {
  swaggerDefinition,
  apis: [ 'src/routes/*.yml', 'src/routes/*/*.yml']
}
const swaggerSpec = swaggerJSDoc(options)

router.use('/', swaggerUi.serveWithOptions({cacheControl: false}))
router.get('/', swaggerUi.setup(swaggerSpec))


module.exports = router