require('../config.js')
const tape = require('tape')
const dbConnection = require('../src/db/connect.js')

dbConnection.once('open', () => {
  require('./controllers/user.test.js')
  tape.onFinish(() => {
    dbConnection.close()
  })
})

dbConnection.on('error', err => {
  throw err
})
