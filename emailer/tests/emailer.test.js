const { client } = require('../src/emailer')

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