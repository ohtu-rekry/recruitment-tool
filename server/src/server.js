const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const celebrate = require('celebrate')

const loginRouter = require('./controllers/loginRouter')
const recruiterRouter = require('./controllers/recruiterRouter')
const jobPostingRouter = require('./controllers/jobPostingRouter')
const jobApplicationRouter = require('./controllers/jobApplicationRouter')
const { tokenExtractor } = require('../utils/middleware')

const PORT = process.env.port || 8080
const HOST = '0.0.0.0'

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/recruiter', recruiterRouter)
app.use('/api/jobposting', jobPostingRouter)
app.use('/api/jobapplication', jobApplicationRouter)

/* eslint-disable-next-line */
app.use((error, req, res, next) => {
  if (celebrate.isCelebrate(error)) {
    const message = error.details[0].message.replace(/[^a-zA-Z1-9 ]/g, "")
    res.status(400)
    res.json({
      error: message
    })
  } else {
    res.status(error.status || 500)
    res.json({
      error: error.message
    })
  }
})

const server = http.createServer(app)

if (!module.parent) {
  server.listen(PORT, () => {
    console.log(`Running on http://${HOST}:${PORT}`)
  })
}

module.exports = { app, server }