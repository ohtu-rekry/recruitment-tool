const jobApplicationRouter = require('express').Router()
const { jwtMiddleware } = require('../../utils/middleware')
const { JobApplication, PostingStage } = require('../../db/models')
const { jobApplicationValidator } = require('../../utils/validators')

jobApplicationRouter.get('/', jwtMiddleware, async (req, res) => {
  try {
    const jobApplications = await JobApplication.findAll({})
    res.json(jobApplications)
  } catch (error) {
    throw error
  }
})

jobApplicationRouter.post('/', jobApplicationValidator, async (req, res) => {
  try {
    const body = req.body

    const firstPostingStage = await PostingStage.findOne({
      where : {
        jobPostingId: body.jobPostingId,
        orderNumber: 0
      }
    })

    if(!firstPostingStage) {
      return res.status(500).json({ error: 'Could not find posting stage' })
    }

    const jobApplication = await JobApplication.create({
      applicantName: body.applicantName,
      applicantEmail: body.applicantEmail,
      postingStageId: firstPostingStage.id
    })

    res.status(201).json(jobApplication)

  } catch (error) {
    throw error
  }
})

module.exports = jobApplicationRouter