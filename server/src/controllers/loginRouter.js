const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express-promise-router')()
const { Recruiter } = require('../../db/models')
const { loginValidator } = require('../../utils/validators')

loginRouter.post('/', loginValidator, async (req, res) => {
  const login = req.body
  const recruiter = await Recruiter.findOne({ where: { username: login.username } })

  if (!recruiter) {
    return res.status(401).send({ error: 'Wrong username or password.' })
  }

  if (login) {
    const passwordCheck = await bcrypt.compare(login.password, recruiter.password)
    if (!passwordCheck) return res.status(401).send({ error: 'Wrong username or password.' })
  }

  const userForToken = {
    username: recruiter.username,
    id: recruiter.id
  }

  const token = jwt.sign(userForToken, process.env.JWT_SECRET)
  res.status(200).send({ token, username: recruiter.username })
})

module.exports = loginRouter
