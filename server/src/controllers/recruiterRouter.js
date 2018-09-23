const bcrypt = require('bcryptjs')
const recruiterRouter = require('express').Router()
const { Recruiter } = require('../../db/models')

recruiterRouter.get('/', async (req, res) => {
  try {
    const existingUsers = await Recruiter.findAll({})
    res.json(existingUsers)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something went wrong...' })
  }
})

recruiterRouter.post('/', async (req, res) => {
  try {
    const body = req.body

    const existingUser = await Recruiter.find({ where: { username: body.username } })
    if (existingUser) {
      return res.status(400).json({ error: 'This username already exists.' })
    }

    if (body.password.length < 3) {
      return res.status(400).json({ error: 'Password must include minimum 3 characters.' })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const recruiter = await Recruiter.create({
      username: body.username,
      password: hashedPassword
    })

    res.json(recruiter)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something went wrong...' })
  }
})

module.exports = recruiterRouter