const bcrypt = require('bcryptjs')
const recruiterRouter = require('express-promise-router')()
const { Recruiter } = require('../../db/models')
const { jwtMiddleware } = require('../../utils/middleware')
const { recruiterValidator } = require('../../utils/validators')

recruiterRouter.get('/', jwtMiddleware, async (req, res) => {
  const existingUsers = await Recruiter.findAll({})
  res.json(existingUsers)
})

recruiterRouter.post('/', jwtMiddleware, recruiterValidator, async (req, res) => {
  const body = req.body

  const existingUser = await Recruiter.find({ where: { username: body.username } })
  if (existingUser) {
    return res.status(400).json({ error: 'This username already exists.' })
  }

  const hashedPassword = await bcrypt.hash(body.password, 10)

  const recruiter = await Recruiter.create({
    username: body.username,
    password: hashedPassword
  })

  res.json(recruiter)
})

module.exports = recruiterRouter