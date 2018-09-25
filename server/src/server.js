const express = require('express')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser')

const recruiterRouter = require('../controllers/recruiterRouter')
const jobpostingRouter = require('./controllers/jobpostingRouter')

const PORT = process.env.port || 8080
const HOST = '0.0.0.0'

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello world! \n')
})

app.use('/api/recruiters', recruiterRouter)
app.use('/api/jobposting', jobpostingRouter)

const server = http.createServer(app)

if(!module.parent) {
  server.listen(PORT, () => {
    console.log(`Running on http://${HOST}:${PORT}`)
  })
}

module.exports = { app, server }