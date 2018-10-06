const jobPostingRouter = require('express').Router()
const { JobPosting, Recruiter, PostingStage, JobApplication } = require('../../db/models')
const jwt = require('jsonwebtoken')

const validateBody = (body) => {
  try {

    if (!body.title) {
      return 'Title must be defined'
    }

    if (!body.content) {
      return 'Content must be defined'
    }

    if (!body.stages) {
      return 'Stages must be defined'
    }

    if (body.title.length > 255) {
      return `Title is too long, ${body.title.length} chars, when max is 255`
    }

    if (body.stages.length < 1) {
      return 'The job posting has to have at least one posting stage'
    }

    return null
  }
  catch (e) {
    throw e
  }
}

jobPostingRouter.get('/', async (req, res) => {
  JobPosting.findAll().then(jobpostings => res.json(jobpostings))
})

jobPostingRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    if (!token || !decodedToken.username) {
      console.log(token)
      console.log(decodedToken)
      return response.status(401).json({ error: 'Operation unauthorized' })
    }

    const errorMessage = validateBody(body)
    if (errorMessage) {
      return response.status(400).json({ error: errorMessage })
    }

    const recruiter = await Recruiter.findOne({
      where: {
        username: decodedToken.username
      }
    })

    if (!recruiter) {
      return response.status(500).json({ error: 'Logged in user not found in database' })
    }

    const posting = await JobPosting.create({
      title: body.title,
      content: body.content,
      recruiterId: recruiter.id
    })

    await Promise.all(body.stages.map((stage, index) =>
      PostingStage.create({
        stageName: stage.stageName,
        orderNumber: index,
        jobPostingId: posting.id
      })
    )).catch(error => {
      console.log(error)
      JobPosting.destroy({
        where: { id: posting.id }
      })
      throw new Error('PostingStageError')
    })

    response.status(201).json(posting)

  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      response.status(401).json({ error: exception.message })

    } else if (exception.name === 'Error' && exception.message === 'PostingStageError') {
      response.status(400).json({ error: 'Could not create posting stages' })

    } else {
      console.log(exception)
      response.status(500).json({ error: 'Something went wrong..' })
    }
  }
})

jobPostingRouter.get('/:id/applicants', async (request, response) => {
  try {
    const token = request.token
    const id = request.params.id

    if (!token) {
      return response.status(401).json({ error: 'Operation unauthorized' })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    if (!decodedToken.username) {
      return response.status(401).json({ error: 'Operation unauthorized' })
    }

    const applicants = await JobApplication.findAll({
      where: {
        jobPostingId: id
      }
    })

    response.status(200).json(applicants)
  } catch (error) {
    console.log(error)
  }
})

module.exports = jobPostingRouter
