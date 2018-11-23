const expressJwt = require('express-jwt')

const jwtMiddleware = expressJwt({ secret: process.env.JWT_SECRET })

module.exports = { jwtMiddleware }