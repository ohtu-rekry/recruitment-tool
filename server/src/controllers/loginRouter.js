const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const { Recruiter } = require('../../db/models')

loginRouter.post('/', async (req, res) => {
  const login = req.body
  const recruiter = await Recruiter.findOne({ where: { username: login.username } })
  let passwordCheck = false

  if (!recruiter) {
    return res.status(401).send({ error: 'Username does not exist.' })
  }

  if (login) {
    passwordCheck = await bcrypt.compare(login.password, recruiter.password)
  }

  if ( !passwordCheck ) {
    return res.status(401).send({ error: 'Wrong username or password.' })
  }

  const userForToken = {
    username: recruiter.username,
    id: recruiter._id
  }

  const token = jwt.sign(userForToken, process.env.JWT_SECRET)
  res.status(200).send({ token, username: recruiter.username })
})

module.exports = loginRouter
