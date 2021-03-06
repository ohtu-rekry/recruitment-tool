const { Recruiter, sequelize } = require('../db/models')

beforeAll(async () => {
  await sequelize.sync({ logging: false })
    .catch(() => {
      console.log('Another model synchronizing process has already started')
    })
})

test('Travis configuration for postgresql works', async () => {
  const newUser = await Recruiter.create({
    username: 'testuser',
    password: 'verybadpassword'
  }).catch(err => {
    console.log(err)
  })

  expect(newUser.username).toEqual('testuser')
  expect(newUser.password).toEqual('verybadpassword')

  await Recruiter.destroy({
    where: {
      username: 'testuser'
    }
  })

  const foundUser = await Recruiter.findOne({
    where: {
      username: 'testuser'
    }
  })

  expect(foundUser).toBe(null)
})

afterAll(async () => {
  await sequelize.close()
})