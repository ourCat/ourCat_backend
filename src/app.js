/* eslint-disable @typescript-eslint/no-var-requires */
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const app = express()

require('app-module-path').addPath(__dirname)
const routes = require('./routes')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', routes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(function(err, req, res, next) {
  console.error(err)
  res.status(err.status || 500).json({error: err})
})

module.exports = app
