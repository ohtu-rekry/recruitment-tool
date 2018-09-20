const Sequelize = require('sequelize')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let sequelize = new Sequelize(
  `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`
)

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