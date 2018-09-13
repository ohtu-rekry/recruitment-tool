const supertest = require('supertest')
const { app, server } = require('../src/server')
const api = supertest(app)

test('example test to run', async () => {
  await api
    .get('/')
    .expect(200)
    .expect('Hello world! \n')
})

afterAll(() => {
  server.close()
})