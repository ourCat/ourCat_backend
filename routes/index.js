const router = require('express').Router();
const swagger = require('./swagger/swagger')

router.use('/', swagger)

module.exports = router;
