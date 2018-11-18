const jobApplicationRouter = require('express-promise-router')()
const { jwtMiddleware } = require('../../utils/middleware')
<<<<<<< HEAD
const { JobApplication, PostingStage, JobPosting, ApplicationComment } = require('../../db/models')
=======
const { Storage } = require('@google-cloud/storage')
const Multer = require('multer')
const format = require('util').format
const jwt = require('jsonwebtoken')
const { JobApplication, PostingStage, JobPosting, Recruiter, ApplicationComment } = require('../../db/models')
>>>>>>> Core functionality for sending files to gcloud
const {
  jobApplicationValidator,
  applicationPatchValidator,
  applicationCommentValidator } = require('../../utils/validators')

<<<<<<< HEAD
=======
const storage = new Storage({
  projectId: 'emblica-212815'
})
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
})

>>>>>>> Core functionality for sending files to gcloud
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
      }]
  })
  response.json(jobApplications)
})


jobApplicationRouter.post('/', jobApplicationValidator, async (req, res) => {
  const body = req.body

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

jobApplicationRouter.post('/:id/comment', jwtMiddleware, applicationCommentValidator, async (request, response) => {
  const decodedToken = request.user

  const jobApplication = await JobApplication.findOne({
    where: {
      id: request.params.id
    }
  })

  if (!jobApplication) {
    return response.status(404).json({ error: 'Invalid job application ID' })
  }

  const newComment = await ApplicationComment.create({
    comment: request.body.comment,
    jobApplicationId: request.params.id,
    recruiterId: decodedToken.id,
    recruiterUsername: decodedToken.username
  })

  response.status(201).json(newComment)

})

jobApplicationRouter.get('/:id/comment', jwtMiddleware, async (request, response) => {
  try {
    const id = request.params.id

    const comments = await ApplicationComment.findAll({
      where: {
        jobApplicationId: id
      }
    })
    response.json(comments)
  } catch (error) {
    throw error
  }
})

jobApplicationRouter.get('/upload', multer.single('file'), async (req, res, next) => {
  const myBucket = storage.bucket('rekrysofta')
  let file = myBucket.file('testi3.txt')
  console.log(file)
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