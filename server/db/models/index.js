const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require(`${__dirname}/../config/config.js`)[env]

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const DB_NAME = process.env.DB_NAME
const DB_PASS = process.env.DB_PASS

let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable])
} else {
  sequelize = new Sequelize(
    `postgres://${DB_NAME}:${DB_PASS}@localhost/ohturekry`
  )
}

const models = {
  Recruiter: sequelize.import('./recruiter'),
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