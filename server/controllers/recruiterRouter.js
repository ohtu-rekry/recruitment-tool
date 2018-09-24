const bcrypt = require('bcryptjs')

const recruiterRouter = require('express').Router()
const { Recruiter } = require('../db/models')
recruiterRouter.get('/', (req, res) => {
  Recruiter.findAll().then(recruiters => res.json(recruiters))
})

recruiterRouter.post('/', async (req, res) => {
  const body = req.body
  const passwordHash = await bcrypt.hash(body.password, 10)
  Recruiter.create({
    username: body.username,
    password: passwordHash
  }).then(user => res.json(user))
})

module.exports = recruiterRouter
