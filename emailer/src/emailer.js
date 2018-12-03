const pg = require('pg')
const nodemailer = require('nodemailer')

const productionEnv = process.env.NODE_ENV === 'production'

if (!productionEnv) {
  require('dotenv').config()
}

const databaseURL = productionEnv
  ? process.env.DATABASE_URL
  : `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

const client = new pg.Client(databaseURL)
const finalStages = ['Accepted', 'Rejected']

const getInactiveApplications = async () => {
  await client.connect()

  const result = await client.query(
    `SELECT "applicantName", "title", "jobPostingId"
    FROM "JobApplications"
    LEFT JOIN "PostingStages"
      ON "PostingStages"."id" = "JobApplications"."postingStageId"
    LEFT JOIN "JobPostings"
      ON "JobPostings"."id" = "PostingStages"."jobPostingId"
    WHERE "JobApplications"."updatedAt" <= now() - interval '1 week'
    AND "PostingStages"."stageName" NOT IN ('${finalStages[0]}', '${finalStages[1]}')`
  ).catch(e => {
    console.log(e)
  })

  await client.end()

  return result.rows
}

try {
  let root, mailConfig
  if (productionEnv) {
    root = process.env.SITE_URL
    mailConfig = {
      host: 'smtp.sendgrid.net',
      port: 587,
      pool: true,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_APIKEY
      }
    }
  } else {
    root = 'http://localhost:3000'
    mailConfig = {
      //logger: true,
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USERNAME,
        pass: process.env.ETHEREAL_PASSWORD
      }
    }
  }

  const emailAddress = 'Recruitment Tool <careers@emblica.com>'
  let transporter = nodemailer.createTransport(mailConfig, { to: emailAddress, from: emailAddress })

  const inactiveApplications = getInactiveApplications()
  inactiveApplications.then(res => res.map((application) => {
    const emailSubject = `Inactivity alert: ${application.title}`
    const emailText = `Inactivity alert: applicant ${application.applicantName} in "${application.title}".
                      \n${root}/position/${application.jobPostingId}`

    transporter.sendMail({
      subject: emailSubject,
      text: emailText
    })
  })).catch(e => console.log(e))

  transporter.close
} catch (e) {
  console.log(e)
}

module.exports = { getInactiveApplications, client, databaseURL }