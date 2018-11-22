const supertest = require('supertest')
const bcrypt = require('bcryptjs')

const { app, server } = require('../src/server')
const api = supertest(app)
const { Recruiter, JobPosting, JobApplication, PostingStage, ApplicationComment, sequelize, Sequelize } = require('../db/models')

beforeAll(async () => {
  await sequelize.sync({ logging: false })
    .catch(() => {
      console.log('Another model synchronizing process has already started')
    })
})

describe('CREATE OR CHANGE JOBAPPLICATION', async () => {
  let jobPostingId = null
  let token = null
  let firstPostingStage, secondPostingStage

  const testRecruiter = {
    username: 'recruiteradminjobapplicationtest',
    password: 'fsdGSDjugs22'
  }
  const testJobPosting = {
    title: 'Data scientist',
    content: 'Looking for data expert',
    stages: [{ stageName: 'application-test-stage1' }, { stageName: 'application-test-stage2' }]
  }

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(testRecruiter.password, 10)
    await Recruiter.create({
      username: testRecruiter.username,
      password: passwordHash
    })

    const loginResponse = await api.post('/api/login').send(testRecruiter)
    token = `Bearer ${loginResponse.body.token}`

    const jobpostingResponse
      = await api
        .post('/api/jobposting')
        .set('authorization', token)
        .send(testJobPosting)

    jobPostingId = jobpostingResponse.body.id

    firstPostingStage = await PostingStage.findOne({
      where: {
        jobPostingId,
        orderNumber: 0
      }
    })

    secondPostingStage = await PostingStage.findOne({
      where: {
        jobPostingId,
        orderNumber: 1
      }
    })

  })

  describe('POST', () => {

    test('jobApplicant can post new jobApplication', async () => {

      const newJobApplication = {
        applicantName: 'Mikko',
        applicantEmail: 'mikko@mallikas.fi',
        jobPostingId: jobPostingId
      }

      const response = await api
        .post('/api/jobapplication')
        .send(newJobApplication)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(response.body.postingStageId).toEqual(firstPostingStage.id)
    })
  })

  describe('PATCH', () => {
    let jobApplicationId

    beforeEach(async () => {
      const newJobApplication = {
        applicantName: 'Roope Ankka',
        applicantEmail: 'roope@ankka.fi',
        jobPostingId: jobPostingId
      }

      const jobApplicationResponse = await api.post('/api/jobapplication').send(newJobApplication)
      jobApplicationId = jobApplicationResponse.body.id
    })

    test('logged in user can move a jobApplication to another posting stage', async () => {
      const jobApplicationChange = {
        jobApplicationId,
        postingStageId: secondPostingStage.id
      }

      const response = await api
        .patch('/api/jobapplication')
        .send(jobApplicationChange)
        .set('authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.postingStageId).toEqual(secondPostingStage.id)
    })

    describe('cannot change posting stage of job application', async () => {

      test('if user is not logged in', async () => {
        const jobApplicationChange = {
          jobApplicationId,
          postingStageId: secondPostingStage.id
        }

        await api
          .patch('/api/jobapplication')
          .send(jobApplicationChange)
          .expect(401)
          .expect('Content-Type', /application\/json/)
      })

      test('without jobApplicationID', async () => {
        const jobApplicationChange = {
          postingStageId: secondPostingStage.id
        }

        const response = await api
          .patch('/api/jobapplication')
          .send(jobApplicationChange)
          .set('authorization', token)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual({ error: 'jobApplicationId is required' })
      })

      test('without postingStageId', async () => {
        const jobApplicationChange = {
          jobApplicationId
        }

        const response = await api
          .patch('/api/jobapplication')
          .send(jobApplicationChange)
          .set('authorization', token)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual({ error: 'postingStageId is required' })
      })

      test('if posting stage does not exist in database', async () => {
        const jobApplicationChange = {
          jobApplicationId,
          postingStageId: -1
        }

        const response = await api
          .patch('/api/jobapplication')
          .send(jobApplicationChange)
          .set('authorization', token)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual({ error: 'Could not find posting stage' })
      })
    })

    afterEach(async () => {
      await JobApplication.destroy({
        where: {
          id: jobApplicationId
        }
      })
    })
  })

  afterAll(async () => {
    await Recruiter.destroy({
      where: {
        username: 'recruiteradminjobapplicationtest'
      }
    })

    await JobApplication.destroy({
      where: {
        applicantName: 'Mikko'
      }
    })

    await PostingStage.destroy({
      where: {
        stageName: 'application-test-stage1'
      }
    })

    await PostingStage.destroy({
      where: {
        stageName: 'application-test-stage2'
      }
    })

    await JobPosting.destroy({
      where: {
        title: 'Data scientist'
      }
    })
    await JobPosting.destroy({
      where: {
        content: 'POTUS NEEDED'
      }
    })
  })
})

describe('GET all applications', async() => {

  const testRecruiter = {
    username: 'get-applications-test-recruiter1',
    password: 'fsdGSDjugs22'
  }
  let jobPostings, postingStages, token, applications, comments

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(testRecruiter.password, 10)
    const recruiter = await Recruiter.create({
      username: testRecruiter.username,
      password: passwordHash
    })

    const createdPostings = await JobPosting.bulkCreate([{
      id: 9879879,
      title: 'jobposting-test-example-title1',
      content: 'jobposting-test-example-content1',
      recruiterId: recruiter.id
    }, {
      id: 678698,
      title: 'jobposting-test-example-title2',
      content: 'jobposting-test-example-content2',
      recruiterId: recruiter.id
    }])

    jobPostings = createdPostings.map(posting => ({
      id: posting.id,
      title: posting.title,
      content: posting.content,
      recruiterId: posting.recruiterId,
      createdAt: posting.createdAt,
      updatedAt: posting.updatedAt
    }))

    const createdStages = await PostingStage.bulkCreate([{
      id: 3749821,
      stageName: 'posting-test-example-stage1',
      orderNumber: 0,
      jobPostingId: jobPostings[0].id
    },
    {
      id: 1436872,
      stageName: 'posting-test-example-stage2',
      orderNumber: 1,
      jobPostingId: jobPostings[0].id
    },
    {
      id: 78953203,
      stageName: 'posting-test-example-stage3',
      orderNumber: 2,
      jobPostingId: jobPostings[0].id
    },
    {
      id: 9032075,
      stageName: 'posting-test-example-stage4',
      orderNumber: 0,
      jobPostingId: jobPostings[1].id
    }])

    postingStages = createdStages.map(stage => ({
      id: stage.id,
      stageName: stage.stageName,
      orderNumber: stage.orderNumber,
      jobPostingId: stage.jobPostingId,
      createdAt: stage.createdAt,
      updatedAt: stage.updatedAt
    }))

    applications = await JobApplication.bulkCreate([{
      id: 6239856,
      applicantName: 'jobposting-test-example-applicant1',
      applicantEmail: 'jobposting-test@example.email1',
      postingStageId: postingStages[0].id
    }, {
      id: 90379275,
      applicantName: 'jobposting-test-example-applicant2',
      applicantEmail: 'jobposting-test@example.email2',
      postingStageId: postingStages[0].id
    }, {
      id: 98237743,
      applicantName: 'jobposting-test-example-applicant3',
      applicantEmail: 'jobposting-test@example.email3',
      postingStageId: postingStages[1].id
    }, {
      id: 32482436,
      applicantName: 'jobposting-test-example-applicant4',
      applicantEmail: 'jobposting-test@example.email4',
      postingStageId: postingStages[1].id
    }], { returning: true })

    comments = await ApplicationComment.bulkCreate([{
      comment: 'jobapplication-test-example-comment1',
      recruiterId: recruiter.id,
      jobApplicationId: applications[0].id
    }, {
      comment: 'jobapplication-test-example-comment2',
      recruiterId: recruiter.id,
      jobApplicationId: applications[0].id
    }], { returning: true })
      .map(c => c.dataValues)

    const response = await api.post('/api/login').send(testRecruiter)
    token = `Bearer ${response.body.token}`
  })

  describe('when user is logged in', async () => {

    test('all applications are returned', async () => {

      const allApplications = await JobApplication.findAll()
      const response = await api
        .get('/api/jobapplication')
        .set('authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const testSpecificResponse = response.body.filter(appl =>
        allApplications.map(a => a.id).includes(appl.id))

      expect(testSpecificResponse).toHaveLength(allApplications.length)
      expect(testSpecificResponse.map(appl => appl.id).sort((a, b) => a - b))
        .toEqual(allApplications.map(appl => appl.id).sort((a, b) => a - b))
    })

    test('returned applications include the posting stage they are in', async () => {

      const response = await api
        .get('/api/jobapplication')
        .set('authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const application = response.body.filter(appl => appl.id === applications[0].id)

      expect(application).toHaveLength(1)
      expect(application[0].postingStageId).toBe(postingStages[0].id)
      expect(application[0].PostingStage.id).toBe(postingStages[0].id)
      expect(application[0].PostingStage.jobPostingId).toBe(postingStages[0].jobPostingId)
      expect(application[0].PostingStage.stageName).toBe(postingStages[0].stageName)
      expect(application[0].PostingStage.orderNumber).toBe(postingStages[0].orderNumber)
    })

    test('returned applications include the job posting the belong to', async () => {

      const response = await api
        .get('/api/jobapplication')
        .set('authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const application = response.body.filter(appl => appl.id === applications[0].id)
      expect(application).toHaveLength(1)
      expect(application[0].PostingStage.jobPostingId).toBe(postingStages[0].jobPostingId)

      const posting = application[0].PostingStage.JobPosting
      expect(posting.title).toBe(jobPostings[0].title)
      expect(posting.content).toBe(jobPostings[0].content)
      expect(posting.id).toBe(jobPostings[0].id)
      expect(posting.recruiterId).toBe(jobPostings[0].recruiterId)
    })

    test('returned applications include comments', async () => {

      const response = await api
        .get('/api/jobapplication')
        .set('authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const application = response.body.find(appl => appl.id === applications[0].id)
      expect(application.applicationComments).toHaveLength(comments.length)

      const returnedComments = application.applicationComments.map( comment => comment.comment )
      expect(returnedComments).toContain(comments[0].comment)
      expect(returnedComments).toContain(comments[1].comment)
    })

    test('posting stages without applications are not returned', async () => {

      const response = await api
        .get('/api/jobapplication')
        .set('authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const stage = response.body.filter(appl =>
        appl.PostingStage.id === postingStages[2].id
      )
      expect(stage).toHaveLength(0)
    })

    test('job postings without applications are not returned', async () => {

      const response = await api
        .get('/api/jobapplication')
        .set('authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const posting = response.body.filter(appl =>
        appl.PostingStage.JobPosting.id === jobPostings[1].id
      )
      expect(posting).toHaveLength(0)
    })
  })

  test('when user is not logged in no applications are returned', async () => {

    const response = await api
      .get('/api/jobapplication')
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({ error: 'No authorization token was found' })
  })

  afterAll(async () => {

    await ApplicationComment.destroy({
      where: {
        id: {
          [Sequelize.Op.in]: comments.map(comment => comment.id)
        }
      }
    })

    await JobApplication.destroy({
      where: {
        id: {
          [Sequelize.Op.in]: applications.map(application => application.id)
        }
      }
    })
    await PostingStage.destroy({
      where: {
        id: {
          [Sequelize.Op.in]: postingStages.map(stage => stage.id)
        }
      }
    })
    await JobPosting.destroy({
      where: {
        id: {
          [Sequelize.Op.in]: jobPostings.map(posting => posting.id)
        }
      }
    })
    await Recruiter.destroy({
      where: {
        username: testRecruiter.username
      }
    })
  })
})

describe('POST a comment to an application', async () => {

  const testRecruiter = {
    username: 'post-comment-test-username',
    password: 'fsdGSDjugs22'
  }
  const validComment = {
    comment: 'A valid comment on a job application'
  }
  let jobPosting, token, application

  beforeAll(async () => {

    const passwordHash = await bcrypt.hash(testRecruiter.password, 10)
    await Recruiter.create({
      username: testRecruiter.username,
      password: passwordHash
    })

    let response = await api.post('/api/login').send(testRecruiter)
    token = `Bearer ${response.body.token}`

    response = await api
      .post('/api/jobposting')
      .set('authorization', token)
      .send({
        title: 'jobposting-test-example-title1',
        content: 'jobposting-test-example-content1',
        stages: [{
          stageName: 'jobposting-test-example-stage1'
        },
        {
          stageName: 'jobposting-test-example-stage2'
        },
        {
          stageName: 'jobposting-test-example-stage3'
        }]
      })

    jobPosting = response.body

    response = await api
      .post('/api/jobapplication')
      .set('authorization', token)
      .send({
        applicantName: 'jobposting-test-example-applicant',
        applicantEmail: 'jobposting-test@example.email',
        jobPostingId: jobPosting.id
      })

    application = response.body
  })

  test('when user is not logged in is unsuccessful', async () => {
    const response = await api
      .post(`/api/jobapplication/${application.id}/comment`)
      .send('A valid comment')
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({ error: 'No authorization token was found' })
  })

  describe('when user is logged in', async () => {

    test('succeeds with a valid application id and non-empty comment', async () => {
      const response = await api
        .post(`/api/jobapplication/${application.id}/comment`)
        .set('authorization', token)
        .send(validComment)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      console.log(response.body)
      console.log(response.body)
      console.log(response.body)
      console.log(response.body)
      console.log(response.body)
      expect(response.body.comment).toEqual(validComment.comment)
      expect(response.body.jobApplicationId).toEqual(application.id)
    })

    test('is unsuccessful if comment is empty', async () => {

      const response = await api
        .post(`/api/jobapplication/${application.id}/comment`)
        .set('authorization', token)
        .send({ comment: '' })
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.body).toEqual({ error: 'comment is not allowed to be empty' })
    })

    test('is unsuccessful if a comment consisting only of whitespace is sent', async () => {

      const response = await api
        .post(`/api/jobapplication/${application.id}/comment`)
        .set('authorization', token)
        .send({ comment: '   ' })
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.body).toEqual({ error: 'comment is not allowed to be empty' })
    })

    test('is unsuccessful if ID of application is invalid or nonexistent', async () => {

      const response = await api
        .post('/api/jobapplication/0000/comment')
        .set('authorization', token)
        .send({ comment: 'A valid comment' })
        .expect(404)
        .expect('Content-Type', /application\/json/)

      expect(response.body).toEqual({ error: 'Invalid job application ID' })
    })
  })

  afterAll(async () => {

    await ApplicationComment.destroy({
      where: {
        comment: validComment.comment
      }
    })
    await JobApplication.destroy({
      where: {
        id: application.id
      }
    })
    await PostingStage.destroy({
      where: {
        jobPostingId: jobPosting.id
      }
    })
    await JobPosting.destroy({
      where: {
        id: jobPosting.id
      }
    })
    await Recruiter.destroy({
      where: {
        username: testRecruiter.username
      }
    })
  })
})

afterAll(async () => {
  await server.close()
  await sequelize.close()
})
