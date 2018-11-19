const jobApplicationRouter = require('express').Router()
const { jwtMiddleware } = require('../../utils/middleware')
const fs = require('fs')
const http = require('http')
const { Storage } = require('@google-cloud/storage')
const Multer = require('multer')
const format = require('util').format
const jwt = require('jsonwebtoken')
const { JobApplication, PostingStage, JobPosting, Recruiter, ApplicationComment } = require('../../db/models')
const {
  jobApplicationValidator,
  applicationPatchValidator,
  applicationCommentValidator } = require('../../utils/validators')

const storage = new Storage({
  projectId: 'emblica-212815'
})
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
})

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

jobApplicationRouter.get('/upload', async (req, res) => {

  const bucket = storage.bucket('rekrysofta')
  const file = bucket.file('kannu.jpg')

  file.createReadStream()
    .on('error', (err) => {
      console.log('err ' + err)
    })
    .on('end', () => {
      console.log('success')
    })
    .pipe(res)
})

jobApplicationRouter.post('/upload', multer.single('file'), async (req, res, next) => {
  const bucket = storage.bucket('rekrysofta')
  if (!req.file) {
    res.status(400).send('No file uploaded')
    return
  }

  const blob = bucket.file(req.file.originalname)
  const blobStream = blob.createWriteStream()

  blobStream.on('error', (err) => {
    next(err)
  })

  blobStream.on('finish', () => {
    const publicUrl = format(`gs://${bucket.name}/${blob.name}`)
    res.status(200).send(publicUrl)
  })
  blobStream.end(req.file.buffer)
})

module.exports = jobApplicationRouter