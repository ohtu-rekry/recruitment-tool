const jobPostingRouter = require('express-promise-router')()
const { JobPosting, Recruiter, PostingStage, JobApplication } = require('../../db/models')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')

jobPostingRouter.get('/', async (req, res) => {
  return Promise.resolve(JobPosting.findAll().then(jobpostings => res.json(jobpostings)))
})

jobPostingRouter.post('/', async (request, response) => {
    const body = request.body
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    if (!token || !decodedToken.username) {
      return response.status(401).json({ error: 'Operation unauthorized' })
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

    try {
      await Promise.all(body.stages.map((stage, index) =>
        PostingStage.create({
          stageName: stage.stageName,
          orderNumber: index,
          jobPostingId: posting.id
        })
      ))}
    catch (error) {
      console.log(error)
      JobPosting.destroy({
        where: { id: posting.id }
      })
      throw error
    }
})

jobPostingRouter.get('/:id/applicants', async (request, response) => {
  try {
    const token = request.token
    const postId = request.params.id

    if (!token) {
      return response.status(401).json({ error: 'Operation unauthorized' })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    if (!decodedToken.username) {
      return response.status(401).json({ error: 'Operation unauthorized' })
    }

    const stages = await PostingStage.findAll({
      where: {
        jobPostingId: postId
      }
    })

    const stagesWithApplicants = await Promise.all(
      stages.map(async stage => {
        const applicants = await JobApplication.findAll({
          where: {
            postingStageId: stage.id
          }
        })

        //TODO: jotain järkevää tähän alapuolelle. Mitä hittoa oikeesti :d
        const res = JSON.parse(JSON.stringify(stage))
        res.applicants = [...applicants]

        return res

      })
    )

    response.status(200).json(stagesWithApplicants)
  } catch (error) {
    console.log(error)
  }
})

module.exports = jobPostingRouter
