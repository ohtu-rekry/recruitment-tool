const expressJwt = require('express-jwt')

const tokenExtractor = (request, response, next) => {
  const auth = request.get('authorization')
  let token = null

  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    token = auth.substring(7)
  }

  request.token = token
  next()
}

const jwtMiddleware = expressJwt({ secret: process.env.JWT_SECRET })

module.exports = { tokenExtractor, jwtMiddleware }