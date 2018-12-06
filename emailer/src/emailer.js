const pg = require('pg')
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
    `SELECT * FROM "JobApplications"
    LEFT JOIN "PostingStages"
    ON "PostingStages"."id" = "JobApplications"."postingStageId"
    WHERE "JobApplications"."updatedAt" <= now() - interval '1 week'
    AND "PostingStages"."stageName" NOT IN ('${finalStages[0]}', '${finalStages[1]}')`
  ).catch(e => {
    console.log(e)
  })

  await client.end()

  return result
}

getInactiveApplications().then(applc => console.log(applc))