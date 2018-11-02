const jobPostingRouter = require('express-promise-router')()
const { JobPosting, Recruiter, PostingStage, JobApplication } = require('../../db/models')
const jwt = require('jsonwebtoken')
const { jwtMiddleware } = require('../../utils/middleware')
const { jobPostingValidator } = require('../../utils/validators')
const moment = require('moment')
const momentTz = require('moment-timezone')


function validateDate(date) {
  if (date === undefined) {
    return null
  }

  date = moment().startOf('day')
  const timeZone = 'Europe/Helsinki'
  return momentTz.tz(date, 'YYYY-MM-DD', timeZone)
}

jobPostingRouter.get('/', async (req, res) => {
  if (req.token !== null) {
    return await JobPosting.findAll().then(jobpostings => res.json(jobpostings))
  }

  return 'lol'
})

jobPostingRouter.post('/', jwtMiddleware, jobPostingValidator, async (req, res) => {
  const body = req.body
  const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET)

  const recruiter = await Recruiter.findOne({
    where: {
      username: decodedToken.username
    }
  })

  const showFrom = validateDate(body.showFrom)
  const showTo = validateDate(body.showTo)

  const posting = await JobPosting.create({
    title: body.title,
    content: body.content,
    recruiterId: recruiter.id,
    showFrom: showFrom,
    showTo: showTo
  })

  try {
    await Promise.all(body.stages.map((stage, index) =>
      PostingStage.create({
        stageName: stage.stageName,
        orderNumber: index,
        jobPostingId: posting.id
      })
    ))
    res.status(201).json(posting)
  } catch (error) {
    await JobPosting.destroy({
      where: { id: posting.id }
    })
    console.log(error)
    throw error
  }
})

jobPostingRouter.get('/:id/applicants', jwtMiddleware, async (req, res) => {
  try {
    const postId = req.params.id

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

    res.status(200).json(stagesWithApplicants)
  } catch (error) {
    throw error
  }
})

module.exports = jobPostingRouter
