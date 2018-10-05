const jobApplicationRouter = require('express').Router()
const { JobApplication, JobPosting } = require('../../db/models')

jobApplicationRouter.get('/', async (req, res) => {
  const jobApplications = await JobApplication.findAll({})
  res.json(jobApplications)
})

jobApplicationRouter.post('/', async (req, res) => {
  try {
    const body = req.body

    if (!body.applicantName) {
      return res.status(400).json({ error: 'Applicant name must be defined' })
    }

    if (!body.applicantEmail) {
      return res.status(400).json({ error: 'Applicant email must be defined' })
    }

    const jobApplication = await JobApplication.create({
      applicantName: body.applicantName,
      applicantEmail: body.applicantEmail,
      jobPostingId: body.jobPostingId
    }, { include: [JobPosting] })

    res.status(201).json(jobApplication)

  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'Something went fucked up' })
  }
})

module.exports = jobApplicationRouter