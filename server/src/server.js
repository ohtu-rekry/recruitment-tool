const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const createError = require('http-errors')
const morgan = require('morgan')
const celebrate = require('celebrate')

const loginRouter = require('./controllers/loginRouter')
const recruiterRouter = require('./controllers/recruiterRouter')
const jobPostingRouter = require('./controllers/jobPostingRouter')
const jobApplicationRouter = require('./controllers/jobApplicationRouter')
const { tokenExtractor } = require('../utils/middleware')
const { jobPostingValidator, jobApplicationValidator, loginValidator, recruiterValidator } = require('./validators/validators')

const PORT = process.env.port || 8080
const HOST = '0.0.0.0'

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(tokenExtractor)

app.post('/api/login', loginValidator, loginRouter)
app.use('/api/login', loginRouter)

app.post('/api/recruiter', recruiterValidator, recruiterRouter)
app.use('/api/recruiter', recruiterRouter)

app.use('/api/jobposting', jobPostingValidator, jobPostingRouter)
app.get('/api/jobposting', jobPostingRouter)

app.use('/api/jobapplication', jobApplicationValidator, jobApplicationRouter)
app.get('/api/jobapplication', jobApplicationRouter)

app.use(celebrate.errors())

app.use((req, res, next) => {
  return next(createError(400, 'Invalid request, something went wrong'))
})

app.use((error, req, res) => {
  res.status(error.status || 500)
  res.json({
    error: error.message
  })
})

const server = http.createServer(app)

if (!module.parent) {
  server.listen(PORT, () => {
    console.log(`Running on http://${HOST}:${PORT}`)
  })
}

module.exports = { app, server }