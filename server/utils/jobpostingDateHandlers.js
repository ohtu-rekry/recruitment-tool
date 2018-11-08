const moment = require('moment')
const momentTz = require('moment-timezone')

const { JobPosting } = require('../db/models')

function validateDate(date) {
  if (date === undefined) {
    return null
  }
  const timeZone = 'Europe/Helsinki'
  return momentTz.tz(date, 'YYYY-MM-DD', timeZone)
}

async function handleJobPostingsForAdmin() {
  const jobpostings = await JobPosting.findAll({}).then(postings => postings.map(jobposting => jobposting.get({ plain: true })))

  const now = moment().startOf('day')
  jobpostings.forEach(jobposting => {
    if (moment(now).isSameOrAfter(jobposting.showFrom) && moment(now).isSameOrBefore(jobposting.showTo)) {
      jobposting.isHidden = false
    } else {
      jobposting.isHidden = true
    }
  })
  return jobpostings
}

async function handleJobPostingsForGuest() {
  const jobpostings = await JobPosting.findAll({}).then(postings => postings.map(jobposting => jobposting.get({ plain: true })))

  const now = moment().startOf('day')

  let filtered = jobpostings.filter(jobposting => {
    return now.isBetween(jobposting.showFrom, jobposting.showTo, 'day', '[)')
  })
  return filtered
}


module.exports = { validateDate, handleJobPostingsForAdmin, handleJobPostingsForGuest }