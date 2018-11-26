const moment = require('moment')
const momentTz = require('moment-timezone')

const { JobPosting } = require('../db/models')

function validateDate(date) {
  if (date === undefined || date === null) {
    return null
  }
  const timeZone = 'Europe/Helsinki'
  return momentTz.tz(date, 'YYYY-MM-DD', timeZone)
}

function formatDate(date) {
  if (date === null) {
    return null
  }
  let momentObj = moment(date, 'YYYY-MM-DD')
  return momentObj.format('YYYY-MM-DD')
}

async function handleJobPostingsForAdmin() {
  const jobpostings = await JobPosting.findAll({}).then(postings => postings.map(jobposting => jobposting.get({ plain: true })))

  const now = moment().startOf('day')
  jobpostings.forEach(jobposting => {
    if (moment(now).isSameOrAfter(jobposting.showFrom) && moment(now).isSameOrBefore(jobposting.showTo)
      || ((jobposting.showFrom !== null && moment(now).isSameOrAfter(jobposting.showFrom)) && jobposting.showTo === null)) {
      jobposting.isHidden = false
    } else {
      jobposting.isHidden = true
    }
    jobposting.showFrom = formatDate(jobposting.showFrom)
    jobposting.showTo = formatDate(jobposting.showTo)
  })
  return jobpostings
}

async function handleJobPostingsForGuest() {
  const jobpostings = await JobPosting.findAll({}).then(postings => postings.map(jobposting => jobposting.get({ plain: true })))

  const now = moment().startOf('day')

  let filtered = jobpostings.filter(jobposting => {
    return now.isBetween(jobposting.showFrom, jobposting.showTo, 'day', '[)')
      || ((jobposting.showFrom !== null && moment(now).isSameOrAfter(jobposting.showFrom)) && jobposting.showTo === null)
  })
  return filtered
}


module.exports = { validateDate, handleJobPostingsForAdmin, handleJobPostingsForGuest }
