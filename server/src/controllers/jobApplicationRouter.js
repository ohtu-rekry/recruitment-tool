const jobApplicationRouter = require('express').Router()
const { JobApplication, PostingStage, Recruiter } = require('../../db/models')
const jwt = require('jsonwebtoken')

jobApplicationRouter.get('/', async (req, res) => {
  try {

    const token = req.token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    if (!token || !decodedToken.username) {
      console.log(token)
      console.log(decodedToken)
      return res.status(401).json({ error: 'Operation unauthorized' })
    }

    const recruiter = await Recruiter.findOne({
      where: {
        username: decodedToken.username
      }
    })

    if (!recruiter) {
      return res.status(500).json({ error: 'Logged in user not found in database' })
    }

    const jobApplications = await JobApplication.findAll({})
    res.json(jobApplications)
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      res.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      res.status(500).json({ error: 'Something went wrong..' })
    }
  }
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

    if (!body.jobPostingId) {
      return res.status(400).json({ error: 'Application must be connected to a job posting' })
    }

    const postingStages = await PostingStage.findAll({ where: { jobPostingId: body.jobPostingId } })

    if (postingStages.length === 0) {
      return res.status(400).json({ error: 'Job posting has no defined application stages' })
    }

    if (postingStages.length > 1) {
      postingStages.sort((s1, s2) => s1.id < s2.id)
    }

    //To be fixed when database tables and connections are fixed
    const jobApplication = await JobApplication.create({
      applicantName: body.applicantName,
      applicantEmail: body.applicantEmail,
      postingStageId: postingStages[0].id
    })

    res.status(201).json(jobApplication)

  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'Something went wrong with new job application' })
  }
})

module.exports = jobApplicationRouter