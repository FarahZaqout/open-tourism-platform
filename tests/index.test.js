const test = require('tape')
// const server = require('../src/server.js')
// const supertest = require('supertest')
// ^For when we start testing, require in server and supertest

test('Check tape is working', t => {
  t.equal(1, 1, 'One is one')
  t.end()
})
