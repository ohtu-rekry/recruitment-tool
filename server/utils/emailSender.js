const nodemailer = require('nodemailer')

const emailSender = (jobPosting, applicantName) => {

  try {
    let root, mailConfig
    if (process.env.NODE_ENV === 'production') {
      root = process.env.SITE_URL
      mailConfig = {
        host: 'smtp.sendgrid.net',
        port: 587,
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

    let transporter = nodemailer.createTransport(mailConfig)

    const emailAddress = 'Recruitment tool <careers@emblica.com>'
    const emailSubject = `New application for ${jobPosting.title}`
    const emailText =
      `A new application, from applicant ${applicantName}, for "${jobPosting.title}" was received.
        \n${root}/position/${jobPosting.id}`

    transporter.sendMail({
      from: emailAddress,
      to: emailAddress,
      subject: emailSubject,
      text: emailText
    })

  } catch (e) {
    console.log(e)
  }
}

module.exports = { emailSender }