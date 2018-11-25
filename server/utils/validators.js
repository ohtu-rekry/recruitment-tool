const { celebrate, Joi } = require('celebrate')

const jobPostingValidator = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().max(255),
    content: Joi.string().required(),
    stages: Joi.array().min(3).required(),
    showFrom: Joi.date().allow(null),
    showTo: Joi.date().allow(null)
  }),
})

const jobApplicationValidator = celebrate({
  body: Joi.object().keys({
    applicantName: Joi.string().required(),
    applicantEmail: Joi.string().email().required(),
    jobPostingId: Joi.number().integer().required(),
    attachments: Joi.array()
  })
})

const loginValidator = celebrate({
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required()
  })
})

const recruiterValidator = celebrate({
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required().min(3)
  })
})

const applicationPatchValidator = celebrate({
  body: Joi.object().keys({
    jobApplicationId: Joi.number().integer().required(),
    postingStageId: Joi.number().integer().required()
  })
})

const postingPutValidator = celebrate({
  body: Joi.object().keys({
    id: Joi.number().integer(),
    title: Joi.string().required().max(255),
    content: Joi.string().required(),
    stages: Joi.array().min(1).required(),
    recruiterId: Joi.number().integer(),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
  }),
})

const applicationCommentValidator = celebrate({
  body: Joi.object().keys({
    comment: Joi.string().trim(),
    attachments: Joi.array()
  })
})

const validators = {
  jobPostingValidator,
  jobApplicationValidator,
  loginValidator,
  recruiterValidator,
  applicationPatchValidator,
  postingPutValidator,
  applicationCommentValidator
}

module.exports = validators