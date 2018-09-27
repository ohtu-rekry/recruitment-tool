const supertest = require('supertest')
const { app, server } = require('../src/server')
const api = supertest(app)
const { JobPosting, sequelize } = require('../db/models')

beforeAll(async () => {
  await sequelize.sync({ logging: false })
    .catch(() => {
      console.log('Another model synchronizing process has already started')
    })
})
describe('GET method', async () => {
  beforeAll(async () => {
    await JobPosting.create({
      title: 'frontend developer',
      content: '1 years of experience',
      recruiterId: 1
    })
    await JobPosting.create({
      title: 'backend developer',
      content: '102 years of experience',
      recruiterId: 1
    })
    await JobPosting.create({
      title: 'php developer',
      content: 'reconsider your life',
      recruiterId: 1
    })
  })
  test('can get jobpostings without being authentication', async () => {
    const response = await api
      .get('/api/jobposting')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length === 3)
  })
  afterAll(async () => {
    await JobPosting.destroy({
      where: {
        recruiterId: 1
      }
    })
  })
})

afterAll(async () => {
  await server.close()
  await sequelize.close()
})