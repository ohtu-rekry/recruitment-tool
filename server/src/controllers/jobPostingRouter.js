const jobPostingRouter = require('express-promise-router')()
const { JobPosting, PostingStage, JobApplication, ApplicationComment } = require('../../db/models')
const { jwtMiddleware, jwtNotRequired } = require('../../utils/middleware')
const { jobPostingValidator, postingPutValidator } = require('../../utils/validators')
const Sequelize = require('sequelize')
const { validateDate, handleJobPostingsForAdmin, handleJobPostingsForGuest } = require('../../utils/jobPostingDateHandlers')


jobPostingRouter.get('/', jwtNotRequired, async (req, res) => {
  let jobPostings
  if (req.user) {
    jobPostings = await handleJobPostingsForAdmin()
  } else {
    jobPostings = await handleJobPostingsForGuest()
  }
  return res.status(200).json(jobPostings)
})

jobPostingRouter.post('/', jwtMiddleware, jobPostingValidator, async (req, res) => {
  const body = req.body
  const decodedToken = req.user


  const showFrom = validateDate(body.showFrom)
  const showTo = validateDate(body.showTo)

  if (showFrom === null && showTo !== null) {
    return res.status(400).json({ error: 'If showFrom is null then showTo must be null as well' })
  }

  const posting = await JobPosting.create({
    title: body.title,
    content: body.content,
    showFrom: showFrom,
    showTo: showTo,
    recruiterId: decodedToken.id
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

jobPostingRouter.get('/:id/applicants', jwtMiddleware, async (request, response) => {
  const postId = request.params.id

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
        },
        include: [{
          model: ApplicationComment,
          as: 'applicationComments'
        }]
      })

      //TODO: jotain järkevää tähän alapuolelle. Mitä hittoa oikeesti :d
      const res = JSON.parse(JSON.stringify(stage))
      res.applicants = [...applicants]

      return res

    })
  )

  response.status(200).json(stagesWithApplicants)
})

jobPostingRouter.get('/:id', jwtMiddleware, async (request, response) => {
  const jobPostingId = request.params.id

  const jobPostingWithStages = await JobPosting.findOne({
    where: { id: jobPostingId },
    include: [{
      model: PostingStage,
      as: 'postingStages',
      include: [{
        model: JobApplication,
        as: 'jobApplications'
      }]
    }]
  })

  if (!jobPostingWithStages) {
    return response.status(404).json({ error: 'Invalid job posting ID' })
  }

  response.status(200).json(jobPostingWithStages)
})

jobPostingRouter.put('/:id', jwtMiddleware, postingPutValidator, async (request, response) => {

  const body = request.body
  const postingId = request.params.id
  const posting = await JobPosting.findById(postingId)

  if (!posting) {
    return response.status(404).json({ error: 'Invalid job posting ID' })
  }

  const existingStages = await PostingStage.findAll({
    where: {
      jobPostingId: postingId,
      id: {
        [Sequelize.Op.in]:
          body.stages
            .filter(stage => stage.id)
            .map(stage => stage.id)
      }
    }
  })

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

  const deletedStagesNoApplicants = deletedStages
    .map(stageModel => stageModel.dataValues)
    .filter(stage => stage.jobApplications.length > 0)
    .map(stage => stage.id)

  const stagesInUpdatedJobPosting
    = body.stages
      .filter(stage => stage.stageName)
      .filter(stage => !deletedStagesNoApplicants.includes(stage.id))

  const orderedStages = stagesInUpdatedJobPosting.map((stage, index) => ({ ...stage, order: index }))

  const existingOrNewStages = orderedStages.filter(stage =>
    !deletedStages
      .map(deleted => deleted.id)
      .includes(stage.id)
  )
  const newStages = existingOrNewStages.filter(stage =>
    !existingStages
      .map(existing => existing.id)
      .includes(stage.id))

  const updatedPosting = await posting.update({
    title: body.title,
    content: body.content,
    showFrom: body.showFrom,
    showTo: body.showTo
  })

  await Promise.all(deletedStages
    .filter(stage => stage.jobApplications.length === 0)
    .map((stage) =>
      PostingStage.destroy({
        where: {
          id: stage.id
        }
      })
    ))

  await Promise.all(orderedStages
    .filter(stage => existingStages.map(existing => existing.id).includes(stage.id))
    .map(stage => PostingStage.update(
      { orderNumber: stage.order },
      { where: { id: stage.id } }
    )))

  await Promise.all(
    newStages
      .map((stage) =>
        PostingStage.create({
          stageName: stage.stageName,
          orderNumber: stage.order,
          jobPostingId: postingId
        })
      ))

  response.status(200).json({
    ...updatedPosting.toJSON(),
    stages: await PostingStage.findAll({
      where: { jobPostingId: postingId }
    })
  })
})

module.exports = jobPostingRouter
