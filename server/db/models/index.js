const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require(`${__dirname}/../config/config.js`)[env]

let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable])
} else {
  sequelize = new Sequelize(
    config.database, config.username, config.password, config
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