const { celebrate, Joi } = require('celebrate')

const jobPostingValidator = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().max(255),
    content: Joi.string().required(),
    stages: Joi.array().min(1).required(),
  }),
})

const jobApplicationValidator = celebrate({
  body: Joi.object().keys({
    applicantName: Joi.string().required(),
    applicantEmail: Joi.string().email().required(),
    jobPostingId: Joi.number().integer().required()
  })
})

const validators = {
  jobPostingValidator,
  jobApplicationValidator
}

module.exports = validators