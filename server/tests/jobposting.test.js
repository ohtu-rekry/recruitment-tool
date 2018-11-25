const supertest = require('supertest')
const { app, server } = require('../src/server')
const api = supertest(app)
const bcrypt = require('bcryptjs')
const { JobPosting, sequelize, Recruiter, PostingStage, JobApplication, Sequelize } = require('../db/models')
const moment = require('moment')
const { tooLongTitle } = require('../utils/jobpostingTestUtils')


beforeAll(async () => {
  await sequelize.sync({ logging: false })
    .catch(() => {
      console.log('Another model synchronizing process has already started')
    })
})

describe('POST and GET method successful', async () => {
  let token = null
  const testRecruiter = {
    username: 'recruiteradminjobpostingtest',
    password: 'fsdGSDjugs22'
  }

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(testRecruiter.password, 10)
    await Recruiter.create({
      username: testRecruiter.username,
      password: passwordHash
    })

    const response = await api.post('/api/login').send(testRecruiter)
    token = `Bearer ${response.body.token}`
  })

  test('a valid job posting is created with correct timestamps and returned to all user types', async () => {
    const newPosting = {
      title: 'Front-End Developer',
      content: 'Come here',
      stages: [{ stageName: 'Applied' }, { stageName: 'Interview 1' }, { stageName: 'Exercise' }, { stageName: 'Interview 2' }],
      showFrom: '2018-10-10',
      showTo: '2050-11-11'
    }

    await api
      .post('/api/jobposting')
      .send(newPosting)
      .set('Authorization', token)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('a valid job posting is created with correct timestamps and returned to only admins', async () => {
    const newPosting = {
      title: 'Data guy',
      content: 'Come here',
      stages: [{ stageName: 'Applied' }, { stageName: 'Interview 1' }, { stageName: 'Exercise' }, { stageName: 'Interview 2' }],
      showFrom: null,
      showTo: null
    }

    await api
      .post('/api/jobposting')
      .send(newPosting)
      .set('Authorization', token)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('get job posting for all users', async () => {

    const newPosting = {
      title: 'Front-End Developer'
    }

    const response = await api
      .get('/api/jobposting')
      .expect(200)

    expect(JSON.stringify(response.body)).toContain(newPosting.title)
  })

  test('get job posting for only admins', async () => {

    const newPosting = {
      title: 'Data guy'
    }

    const response = await api
      .get('/api/jobposting')
      .set('Authorization', token)
      .expect(200)

    expect(JSON.stringify(response.body)).toContain(newPosting.title)
  })

  afterAll(async () => {
    await JobPosting.destroy({
      where: {
        title: 'Front-End Developer'
      },
    })
    await JobPosting.destroy({
      where: {
        title: 'Data guy'
      }
    })
  })

})

describe('POST method', async () => {

  let token = null
  const testRecruiter = {
    username: 'recruiteradminjobpostingtest',
    password: 'fsdGSDjugs22'
  }

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(testRecruiter.password, 10)
    await Recruiter.create({
      username: testRecruiter.username,
      password: passwordHash
    })

    const response = await api.post('/api/login').send(testRecruiter)
    token = `Bearer ${response.body.token}`
  })

  const showFromDate = moment().subtract(5, 'days').format('YYYY/MM/DD')
  const showToDate = moment().add(100, 'years').format('YYYY/MM/DD')

  test('a valid job posting can be created if user is logged in', async () => {
    const newPosting = {
      title: 'Senior Java Developer',
      content: 'We are looking for someone with a minimum of 5 years of experience coding with Java',
      stages: [{ stageName: 'application-test-stage1' }, { stageName: 'application-test-stage2' }, { stageName: 'application-test-stage3' }],
      showFrom: showFromDate,
      showTo: showToDate
    }

    await api
      .post('/api/jobposting')
      .send(newPosting)
      .set('authorization', token)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('a valid posting cannot be created if user is not logged in', async () => {
    const newPosting = {
      title: 'Junior Front End Developer',
      content: 'If you are interested in learning new technologies for front-end development, then this is the job for you',
      stages: [{ stageName: 'Applied' }, { stageName: 'Interview 1' }, { stageName: 'Exercise' }, { stageName: 'Interview 2' }]
    }

    await api
      .post('/api/jobposting')
      .send(newPosting)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('a posting cannot be created without a title', async () => {
    const newPosting = {
      content: 'Our development team is missing an experienced UI designer',
      stages: [{ stageName: 'Applied' }, { stageName: 'Interview 1' }, { stageName: 'Exercise' }, { stageName: 'Interview 2' }]
    }

    const response = await api
      .post('/api/jobposting')
      .send(newPosting)
      .set('authorization', token)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({ error: 'title is required' })
  })

  test('a posting cannot be created without content', async () => {
    const newPosting = {
      title: 'UI designer',
      stages: [{ stageName: 'Applied' }, { stageName: 'Interview 1' }, { stageName: 'Exercise' }, { stageName: 'Interview 2' }]
    }

    const response = await api
      .post('/api/jobposting')
      .send(newPosting)
      .set('Authorization', token)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({ error: 'content is required' })
  })

  test('a posting cannot be created without stages', async () => {
    const newPosting = {
      title: 'Senior Java Developer',
      content: 'We are looking for someone with a minimum of 5 years of experience coding with Java'
    }

    const response = await api
      .post('/api/jobposting')
      .send(newPosting)
      .set('Authorization', token)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({ error: 'stages is required' })
  })

  test('a posting cannot be created with a title longer than 255 chars', async () => {
    const newPosting = {
      title: tooLongTitle,
      content: 'We need you',
      stages: [{ stageName: 'Applied' }, { stageName: 'Interview 1' }, { stageName: 'Exercise' }, { stageName: 'Interview 2' }]
    }

    const response = await api
      .post('/api/jobposting')
      .send(newPosting)
      .set('Authorization', token)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({
      error: 'title length must be less than or equal to 255 characters long'
    })
  })

  test('a posting cannot be created with less than one stage', async () => {
    const newPosting = {
      title: 'Senior Java Developer',
      content: 'We are looking for someone with a minimum of 5 years of experience coding with Java',
      stages: [],
      showFrom: 'Thu Nov 08 2018 10:03:15 GMT+0200 (Eastern)',
      showTo: 'Sat Nov 10 2018 03:00:00 GMT+0200'
    }

    const response = await api
      .post('/api/jobposting')
      .send(newPosting)
      .set('Authorization', token)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({ error: 'stages must contain at least 3 items' })
  })

  test('a posting cannot be created so that showFrom is null and showTo is not', async () => {
    const newPosting = {
      title: 'Front-End Developer',
      content: 'Come here',
      stages: [{ stageName: 'Applied' }, { stageName: 'Interview 1' }, { stageName: 'Exercise' }, { stageName: 'Interview 2' }],
      showFrom: null,
      showTo: 2018 - 11 - 11
    }

    const response = await api
      .post('/api/jobposting')
      .send(newPosting)
      .set('Authorization', token)
      .expect(400)
      .expect('Content-Type', /application\/json/)


    expect(response.body).toEqual({ error: 'If showFrom is null then showTo must be null as well' })

  })

  afterAll(async () => {
    await PostingStage.destroy({
      where: {
        stageName: 'jobposting-test-example-stage1'
      }
    })
    await PostingStage.destroy({
      where: {
        stageName: 'jobposting-test-example-stage2'
      }
    })
    await JobPosting.destroy({
      where: {
        title: 'Senior Java Developer'
      }
    })
    await JobPosting.destroy({
      where: {
        title: 'Junior Front End Developer'
      }
    })
    await Recruiter.destroy({
      where: {
        username: testRecruiter.username
      }
    })
    await JobPosting.destroy({
      where: {
        title: 'Full-Stack Developer'
      }
    })
  })
})

describe('GET single job posting', async ()  => {

  let token, jobPostingId
  const testStageName = 'the best stage ever'
  const testRecruiter = {
    username: 'recruiteradminjobpostingtest',
    password: 'fsdGSDjugs22'
  }
  const testJobPosting = {
    title: 'awesome job',
    content: 'thrilling description',
    stages: [{ stageName: 'Applied' }, { stageName: testStageName }, { stageName: 'Accepted' }, { stageName: 'Rejected' }]
  }

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(testRecruiter.password, 10)
    await Recruiter.create({
      username: testRecruiter.username,
      password: passwordHash
    })

    const response = await api.post('/api/login').send(testRecruiter)
    token = `Bearer ${response.body.token}`

    const jobPostingResponse = await api.post('/api/jobposting').send(testJobPosting).set('Authorization', token)
    jobPostingId = jobPostingResponse.body.id
  })

  test('logged in user can fetch job posting with posting stages', async () => {

    const response = await api
      .get(`/api/jobposting/${jobPostingId}`)
      .set('Authorization', token)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(JSON.stringify(response.body)).toContain(testJobPosting.title)
    expect(JSON.stringify(response.body)).toContain(testStageName)
  })

  test('job posting cannot be fetched when user is not logged in', async () => {
    await api
      .get(`/api/jobposting/${jobPostingId}`)
      .expect(401)
  })

  afterAll(async () => {
    await PostingStage.destroy({
      where: {
        jobPostingId
      }
    })
    await JobPosting.destroy({
      where: {
        id: jobPostingId
      }
    })
    await Recruiter.destroy({
      where: {
        username: testRecruiter.username
      }
    })
  })
})

describe('PUT method', async () => {

  let token = null
  const testRecruiter = {
    username: 'recruiteradminjobpostingtest',
    password: 'fsdGSDjugs22'
  }
  let jobPostings = []
  let postingStages = []

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(testRecruiter.password, 10)
    const recruiter = await Recruiter.create({
      username: testRecruiter.username,
      password: passwordHash
    })

    const createdPostings = await JobPosting.bulkCreate([{
      id: 98798792,
      title: 'jobposting-test-example-title1',
      content: 'jobposting-test-example-content1',
      recruiterId: recruiter.id
    }, {
      id: 6786982,
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
      id: 37498212,
      stageName: 'jobposting-test-example-stage1',
      orderNumber: 0,
      jobPostingId: jobPostings[0].id
    },
    {
      id: 14368722,
      stageName: 'jobposting-test-example-stage2',
      orderNumber: 1,
      jobPostingId: jobPostings[0].id
    }])

    postingStages = createdStages.map(stage => ({
      id: stage.id,
      stageName: stage.stageName,
      orderNumber: stage.orderNumber,
      jobPostingId: stage.jobPostingId,
      createdAt: stage.createdAt,
      updatedAt: stage.updatedAt
    }))

    await JobApplication.create({
      applicantName: 'jobposting-test-example-applicant11',
      applicantEmail: 'jobposting-test@example.email1',
      postingStageId: postingStages[0].id
    })

    const response = await api.post('/api/login').send(testRecruiter)
    token = `Bearer ${response.body.token}`
  })

  describe('when user is logged in', async () => {

    test('title can be edited', async () => {
      const modifiedPosting = {
        ...jobPostings[0],
        title: 'jobposting-test-example-title3',
        stages: [postingStages[0], postingStages[1]]
      }

      const response = await api
        .put(`/api/jobposting/${modifiedPosting.id}`)
        .send(modifiedPosting)
        .set('authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.id).toEqual(jobPostings[0].id)
      expect(response.body.title).toEqual(modifiedPosting.title)
    })

    test('content can be edited', async () => {
      const modifiedPosting = {
        ...jobPostings[0],
        content: 'jobposting-test-example-content3',
        stages: [postingStages[0], postingStages[1]]
      }

      const response = await api
        .put(`/api/jobposting/${modifiedPosting.id}`)
        .send(modifiedPosting)
        .set('authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.id).toEqual(jobPostings[0].id)
      expect(response.body.content).toEqual(modifiedPosting.content)
    })

    test('title cannot be emptied', async () => {
      const modifiedPosting = {
        ...jobPostings[0],
        title: '',
        stages: [postingStages[0], postingStages[1]]
      }

      const response = await api
        .put(`/api/jobposting/${modifiedPosting.id}`)
        .send(modifiedPosting)
        .set('authorization', token)
        .expect(400)

      expect(response.body).toEqual({ error: 'title is not allowed to be empty' })
    })

    test('content cannot be emptied', async () => {
      const modifiedPosting = {
        ...jobPostings[0],
        content: '',
        stages: [postingStages[0], postingStages[1]]
      }

      const response = await api
        .put(`/api/jobposting/${modifiedPosting.id}`)
        .send(modifiedPosting)
        .set('authorization', token)
        .expect(400)

      expect(response.body).toEqual({ error: 'content is not allowed to be empty' })
    })

    test('new stage can be added', async () => {
      const modifiedPosting = {
        ...jobPostings[0],
        stages: [postingStages[0], postingStages[1], {
          stageName: 'jobposting-test-example-stage5',
          orderNumber: 4
        }]
      }

      const response = await api
        .put(`/api/jobposting/${modifiedPosting.id}`)
        .send(modifiedPosting)
        .set('authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.id).toEqual(modifiedPosting.id)
      expect(response.body.stages).toHaveLength(3)
    })

    test('a stage can be deleted', async () => {
      const modifiedPosting = {
        ...jobPostings[0],
        stages: [postingStages[0]]
      }

      const response = await api
        .put(`/api/jobposting/${modifiedPosting.id}`)
        .send(modifiedPosting)
        .set('authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.id).toEqual(modifiedPosting.id)
      expect(response.body.stages).toHaveLength(1)
    })

    test('all stages cannot be deleted', async () => {
      const modifiedPosting = {
        ...jobPostings[1],
        stages: []
      }

      const response = await api
        .put(`/api/jobposting/${modifiedPosting.id}`)
        .send(modifiedPosting)
        .set('authorization', token)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.body).toEqual({ error: 'stages must contain at least 1 items' })
    })

    test('stage which has linked applicants cannot be deleted', async () => {
      const modifiedPosting = {
        ...jobPostings[0],
        stages: [{
          stageName: 'jobposting-test-example-stage6',
          orderNumber: 5
        }]
      }

      const response = await api
        .put(`/api/jobposting/${modifiedPosting.id}`)
        .send(modifiedPosting)
        .set('authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.stages.filter(stage =>
        stage.id === postingStages[0].id)).toHaveLength(1)
    })
  })

  describe('when user is not logged in', async () => {

    test('posting cannot be edited', async () => {
      const modifiedPosting = {
        ...jobPostings[0],
        title: 'jobposting-test-example-title5'
      }

      const response = await api
        .put(`/api/jobposting/${modifiedPosting.id}`)
        .send(modifiedPosting)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      expect(response.body).toEqual({ error: 'No authorization token was found' })
    })
  })

  afterAll(async () => {
    await JobApplication.destroy({
      where: {
        applicantName: 'jobposting-test-example-applicant11'
      }
    })

    await PostingStage.destroy({
      where: {
        stageName: {
          [Sequelize.Op.like]: 'jobposting-test-example%'
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

afterAll(async () => {
  await server.close()
  await sequelize.close()
})
