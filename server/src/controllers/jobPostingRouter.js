const jobPostingRouter = require('express-promise-router')()
const jwt = require('jsonwebtoken')
const { JobPosting, Recruiter, PostingStage, JobApplication } = require('../../db/models')
const { jwtMiddleware } = require('../../utils/middleware')
const { jobPostingValidator, postingPutValidator } = require('../../utils/validators')
const Sequelize = require('sequelize')
const { validateDate, handleJobPostingsForAdmin, handleJobPostingsForGuest } = require('../../utils/jobPostingDateHandlers')

jobPostingRouter.get('/', async (req, res) => {
  let jobPostings
  if (req.token !== null) {
    jobPostings = await handleJobPostingsForAdmin()
  } else {
    jobPostings = await handleJobPostingsForGuest()
  }
  return res.status(200).json(jobPostings)
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

  if (showFrom === null && showTo !== null) {
    return res.status(400).json({ error: 'If showFrom is null then showTo must be null as well' })
  }

  const posting = await JobPosting.create({
    title: body.title,
    content: body.content,
    recruiterId: recruiter.id,
    showFrom: showFrom,
    showTo: showTo
  })

  try {
    await Promise.all(
      body.stages
        .filter(stage => stage.stageName)
        .map((stage, index) =>
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

jobPostingRouter.put('/:id', jwtMiddleware, postingPutValidator, async (request, response) => {

  try {
    const body = request.body
    const postingId = request.params.id
    const posting = await JobPosting.findById(postingId)

    if (!posting) {
      return response.status(400).json({ error: 'Invalid job posting ID' })
    }

    const existingStages = await PostingStage.findAll({
      where: {
        id: {
          [Sequelize.Op.in]:
            body.stages
              .filter(stage => stage.id)
              .map(stage => stage.id)
        }
      }
    })

    const newStages = body.stages.filter(stage =>
      !(existingStages
        .map(existing => existing.id)
        .includes(stage.id)))

    const deletedStages = await PostingStage.findAll({
      where: {
        jobPostingId: postingId,
        id: {
          [Sequelize.Op.notIn]:
            body.stages
              .filter(stage => stage.id)
              .map(stage => stage.id)
        }
      },
      include: ['jobApplications']
    })

    const updatedPosting = await posting.update({
      title: body.title,
      content: body.content,
      showFrom: body.showFrom,
      showTo: body.showTo
    })

    await Promise.all(
      newStages
        .filter(stage => stage.stageName)
        .map((stage, index) =>
          PostingStage.create({
            stageName: stage.stageName,
            orderNumber: stage.orderNumber || index,
            jobPostingId: postingId
          })
        ))

    await Promise.all(deletedStages
      .filter(stage => stage.jobApplications.length === 0)
      .map((stage) =>
        PostingStage.destroy({
          where: {
            id: stage.id
          }
        })
      ))

    response.status(200).json({
      ...updatedPosting.toJSON(),
      stages: await PostingStage.findAll({
        where: { jobPostingId: postingId }
      })
    })

  } catch (error) {
    throw error
  }
})

module.exports = jobPostingRouter
