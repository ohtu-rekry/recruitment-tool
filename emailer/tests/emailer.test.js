const pg = require('pg')
const productionEnv = process.env.NODE_ENV === 'production'

if (!productionEnv) {
  require('dotenv').config()
}

const databaseURL = productionEnv
  ? process.env.DATABASE_URL
  : `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

const client = new pg.Client(databaseURL)

test('Emailer connects to database correctly', async () => {
  await client.connect()

  const result = await client.query(
    'SELECT 1 AS result'
  ).catch(e => {
    console.log(e)
  })

  await client.end()

  expect(result.rows.length).toBe(1)
  expect(result.rows[0].result).toBe(1)
})