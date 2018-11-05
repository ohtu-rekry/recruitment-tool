const bcrypt = require('bcryptjs')
const recruiterRouter = require('express').Router()
const { Recruiter } = require('../../db/models')
const { jwtMiddleware } = require('../../utils/middleware')
const { recruiterValidator } = require('../../utils/validators')

recruiterRouter.get('/', jwtMiddleware, async (req, res) => {
  try {
    const existingUsers = await Recruiter.findAll({})
    res.json(existingUsers)

  } catch (error) {
    throw error
  }
})

recruiterRouter.post('/', recruiterValidator, async (req, res) => {
  try {
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
  } catch (error) {
    throw error
  }
})

module.exports = recruiterRouter