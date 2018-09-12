const express = require('express')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser')

const PORT = process.env.port || 8080
const HOST = '0.0.0.0'

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => [
  res.send('Hello world! \n')
])

app.get('/api/users', (req,res) => {
  res.send('USER PAGE')
})

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Running on http://${HOST}:${PORT}`)
})

module.exports = { app, server }