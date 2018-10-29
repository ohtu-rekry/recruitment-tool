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
      where: {
        jobPostingId: body.jobPostingId,
        orderNumber: 0
      }
    })

    if (!firstPostingStage) {
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

jobApplicationRouter.patch('/', async (req, res) => {
  try {
    const jobApplicationId = req.body.jobApplicationId
    const postingStageId = req.body.postingStageId

    const adminUsername = adminIsLoggedIn(req.token)
    if (!adminUsername) {
      return res.status(401).json({ error: 'Operation unauthorized' })
    }

    const recruiterExists = await recruiterFoundInDb(adminUsername)
    if (!recruiterExists) {
      return res.status(500).json({ error: 'Logged in user not found in database' })
    }

    if (!jobApplicationId) {
      return res.status(400).json({ error: 'Job application must be defined' })
    }

    if (!postingStageId) {
      return res.status(400).json({ error: 'Posting stage must be defined' })
    }

    const postingStage = await PostingStage.findOne({ where: { id: postingStageId } })
    if (!postingStage) {
      return res.status(400).json({ error: 'Could not find posting stage' })
    }

    const resultOfUpdate = await JobApplication.update(
      { postingStageId },
      { where: { id: jobApplicationId }, returning: true }
    )

    if (resultOfUpdate[0] !== 1) {
      return res.status(500).json({ error: 'Did not update posting stage of job application' })
    }

    res.status(200).json(resultOfUpdate[1][0])

  } catch (e) {
    if (e.name === 'JsonWebTokenError') {
      res.status(401).json({ error: e.message })
    } else {
      console.log(e)
      res.status(500).json({ error: 'Something went wrong when trying to change application' })
    }
  }
})

module.exports = jobApplicationRouter