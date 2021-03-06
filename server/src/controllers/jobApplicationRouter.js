const jobApplicationRouter = require('express-promise-router')()
const { jwtMiddleware } = require('../../utils/middleware')
const { JobApplication, PostingStage, JobPosting, ApplicationComment, Attachment } = require('../../db/models')
const { emailSender } = require('../../utils/emailSender')
const {
  jobApplicationValidator,
  applicationPatchValidator,
  applicationCommentValidator } = require('../../utils/validators')
const { handleAttachmentSending } = require('../../utils/attachmentHandler')

jobApplicationRouter.get('/', jwtMiddleware, async (request, response) => {
  const jobApplications = await JobApplication.findAll({
    include: [
      {
        model: PostingStage,
        include: [{
          model: JobPosting
        }]
      },
      {
        model: ApplicationComment,
        as: 'applicationComments'
      },
      {
        model: Attachment,
        as: 'attachments'
      }]
  })
  response.json(jobApplications)
})

jobApplicationRouter.post('/', jobApplicationValidator, async (req, res) => {

  const body = req.body
  let attachments = []

  const firstPostingStage = await PostingStage.findOne({
    where: {
      jobPostingId: body.jobPostingId,
      orderNumber: 0
    }
  })

  if (!firstPostingStage) {
    return res.status(400).json({ error: 'Could not find posting stage' })
  }

  const jobApplication = await JobApplication.create({
    applicantName: body.applicantName,
    applicantEmail: body.applicantEmail,
    postingStageId: firstPostingStage.id
  })

  if (body.attachments.length > 0) {
    attachments = await handleAttachmentSending(body.attachments)
    await attachments.forEach(attachment => {
      Attachment.create({
        path: attachment,
        jobApplicationId: jobApplication.id
      })
    })
  }

  const jobPosting = await JobPosting.findOne({
    where: {
      id: body.jobPostingId
    }
  })

  emailSender(jobPosting.dataValues, body.applicantName)
  res.status(201).json(jobApplication)

})

jobApplicationRouter.patch('/', jwtMiddleware, applicationPatchValidator, async (req, res) => {
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

  const updatedRows = resultOfUpdate[0]
  if (updatedRows !== 1) {
    return res.status(500).json({ error: 'Did not update posting stage of job application' })
  }

  res.status(200).json(resultOfUpdate[1][0])

})

jobApplicationRouter.post('/:id/comment', jwtMiddleware, applicationCommentValidator, async (req, res) => {
  const decodedToken = req.user
  const body = req.body
  let attachments = []


  const jobApplication = await JobApplication.findOne({
    where: {
      id: req.params.id
    }
  })

  if (!jobApplication) {
    return res.status(404).json({ error: 'Invalid job application ID' })
  }

  const newComment = await ApplicationComment.create({
    comment: body.comment,
    jobApplicationId: req.params.id,
    recruiterId: decodedToken.id,
    recruiterUsername: decodedToken.username
  })

  if (body.attachments.length > 0) {
    attachments = await handleAttachmentSending(body.attachments)
    await attachments.forEach(attachment => {
      Attachment.create({
        path: attachment,
        applicationCommentId: newComment.id
      })
    })
  }
  res.status(201).json(newComment)
})

jobApplicationRouter.get('/:id/comment', jwtMiddleware, async (request, response) => {
  try {
    const id = request.params.id

    const comments = await ApplicationComment.findAll({
      where: {
        jobApplicationId: id
      },
      include: [
        {
          model: Attachment,
          as: 'attachments'
        }
      ]
    })
    response.json(comments)
  } catch (error) {
    throw error
  }
})

module.exports = jobApplicationRouter