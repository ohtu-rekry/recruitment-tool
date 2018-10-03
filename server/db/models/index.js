const Sequelize = require('sequelize')
const productionEnv = process.env.NODE_ENV === 'production'

if (!productionEnv) {
  require('dotenv').config()
}

const databaseURL = productionEnv
  ? process.env.DATABASE_URL
  : `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`

let sequelize = new Sequelize(databaseURL)

const models = {
  Recruiter: sequelize.import('./recruiter'),
  JobPosting: sequelize.import('./jobposting')
}


Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models)
  }
})

sequelize.sync()
  .then(() => {
    console.log('Tables created')
  })

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports = models