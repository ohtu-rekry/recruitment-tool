const jobPostingRouter = require('express').Router()
const { JobPosting, Recruiter, PostingStage } = require('../../db/models')
const jwt = require('jsonwebtoken')

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

    if (!body.title) {
      return response.status(400).json({ error: 'Title must be defined' })
    }

    if (!body.content) {
      return response.status(400).json({ error: 'Content must be defined' })
    }

    if (!body.stages) {
      return response.status(400).json({ error: 'Stages must be defined' })
    }

    if (body.title.length > 255) {
      return response.status(400).json({
        error: `Title is too long, ${body.title.length} chars, when max is 255`
      })
    }

    if (body.stages.length < 1) {
      return response.status(400).json({ error: 'The job posting has to have at least one posting stage' })
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
        stageName: stage,
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

module.exports = jobPostingRouter
