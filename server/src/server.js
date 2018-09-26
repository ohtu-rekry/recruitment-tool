const express = require('express')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser')

const loginRouter = require('./controllers/loginRouter')
const recruiterRouter = require('./controllers/recruiterRouter')
const jobPostingRouter = require('./controllers/jobPostingRouter')
const jobApplicationRouter = require('./controllers/jobApplicationRouter')
const { tokenExtractor } = require('../utils/middleware')

const PORT = process.env.port || 8080
const HOST = '0.0.0.0'

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(tokenExtractor)

app.get('/', (req, res) => {
  res.send('Hello world! \n')
})

app.use('/api/login', loginRouter)
app.use('/api/recruiter', recruiterRouter)
app.use('/api/jobposting', jobPostingRouter)
app.use('/api/jobapplication', jobApplicationRouter)

const server = http.createServer(app)

if (!module.parent) {
  server.listen(PORT, () => {
    console.log(`Running on http://${HOST}:${PORT}`)
  })
}

module.exports = { app, server }