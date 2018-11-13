const Sequelize = require('sequelize')
const productionEnv = process.env.NODE_ENV === 'production'

if (!productionEnv) {
  require('dotenv').config()
} else {
  require('../config/config')
}

const databaseURL = productionEnv
  ? process.env.DATABASE_URL
  : `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

let sequelize = new Sequelize(databaseURL, {
  logging: false
})

const models = {
  Recruiter: sequelize.import('./recruiter'),
  JobPosting: sequelize.import('./jobposting'),
  JobApplication: sequelize.import('./jobapplication'),
  PostingStage: sequelize.import('./postingstage'),
  ApplicationComment: sequelize.import('./applicationcomment')
}


Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models)
  }
})

sequelize.sync({
}).then(() => {
  console.log('Tables created')
}).catch(error => {
  console.log(`${error} when creating tables for database`)
})

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports = models