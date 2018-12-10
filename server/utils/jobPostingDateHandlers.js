const moment = require('moment')
const momentTz = require('moment-timezone')

const { JobPosting } = require('../db/models')

const nowIsAfterFrom = (showFrom, showTo, now) => {
  return showFrom && !showTo && moment(now).isSameOrAfter(showFrom)
}

const nowIsBetweenFromTo = (showFrom, showTo, now) => {
  return showFrom && showTo && now.isBetween(showFrom, showTo, 'day', '[]')
}

function validateDate(date) {
  if (date === undefined || date === null) {
    return null
  }
  const timeZone = 'Europe/Helsinki'
  return momentTz.tz(date, 'DD.MM.YYYY', timeZone)
}

function formatDate(date) {
  if (date === null) {
    return null
  }
  let momentObj = moment(date, 'DD.MM.YYYY')
  return momentObj.format('DD.MM.YYYY')
}

async function handleJobPostingsForAdmin() {
  const jobpostings = await JobPosting.findAll({}).map(jobposting => jobposting.dataValues)

  const now = validateDate(moment().startOf('day'))

  jobpostings.forEach(jobposting => {
    const from = validateDate(jobposting.showFrom)
    const to = validateDate(jobposting.showTo)

    jobposting.isHidden =
      !(nowIsBetweenFromTo(from, to, now)
      || nowIsAfterFrom(from, to, now))

    jobposting.showFrom = formatDate(from)
    jobposting.showTo = formatDate(to)
  })
  return jobpostings
}

async function handleJobPostingsForGuest() {
  const jobpostings = await JobPosting.findAll({}).then(postings => postings.map(jobposting => jobposting.get({ plain: true })))

  const now = validateDate(moment().startOf('day'))

  let filtered = jobpostings.filter(jobposting => {
    const from = validateDate(jobposting.showFrom)
    const to = validateDate(jobposting.showTo)

    return nowIsBetweenFromTo(from, to, now)
      || nowIsAfterFrom(from, to, now)
  })
  return filtered
}


module.exports = { validateDate, handleJobPostingsForAdmin, handleJobPostingsForGuest }
