const jobApplicationRouter = require('express').Router()
const { jwtMiddleware } = require('../../utils/middleware')
const { JobApplication, PostingStage, JobPosting, Recruiter, ApplicationComment } = require('../../db/models')
const {
  jobApplicationValidator,
  applicationPatchValidator,
  applicationCommentValidator } = require('../../utils/validators')

const jwt = require('jsonwebtoken')

jobApplicationRouter.get('/', jwtMiddleware, async (request, response) => {
  try {
    const jobApplications = await JobApplication.findAll({
      include: [{
        model: PostingStage,
        include: [{
          model: JobPosting
        }]
      }]
    })
    response.json(jobApplications)
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

jobApplicationRouter.patch('/', jwtMiddleware, applicationPatchValidator, async (req, res) => {
  try {
    const jobApplicationId = req.body.jobApplicationId
    const postingStageId = req.body.postingStageId

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

  } catch (error) {
    throw error
  }
})

jobApplicationRouter.post('/:id/comment', jwtMiddleware, applicationCommentValidator, async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.JWT_SECRET)
    const recruiter = await Recruiter.findOne({
      where: {
        username: decodedToken.username
      }
    })

    const jobApplication = await JobApplication.findOne({
      where: {
        id: request.params.id
      }
    })

    if (!jobApplication) {
      return response.status(400).json({ error: 'Invalid job application ID' })
    }

    const newComment = await ApplicationComment.create({
      comment: request.body.comment,
      jobApplicationId: request.params.id,
      recruiterId: recruiter.id
    })

    response.status(201).json(newComment)

  } catch (error) {
    throw error
  }
})

module.exports = jobApplicationRouter