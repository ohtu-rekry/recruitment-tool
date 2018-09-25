const jobpostingRouter = require('express').Router()
const { JobPosting } = require('../../db/models')

jobpostingRouter.get('/', async (req, res) => {
  JobPosting.findAll().then(jobpostings => res.json(jobpostings))
})

module.exports = jobpostingRouter