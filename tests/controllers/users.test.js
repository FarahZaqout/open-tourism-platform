const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const User = require('../../src/models/User.js')
const { dropCollectionAndEnd } = require('../helpers/index.js')
const { validUser1, validUser2 } = require('../fixtures/users.json')

tape('test /users when nothing in database', (t) => {
  supertest(server)
    .get('/users')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.length, 0, 'should initially return empty array')
      dropCollectionAndEnd(User, t)
    })
})

tape('test /users when one user in database', t => {
  // add mock user to database using mongoose ORM
  const mockUser = new User(validUser1)
  mockUser.save()
    .then(() => {
      supertest(server)
        .get('/users')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          // check our get path returns that user correctly
          t.ok(res.body.length, 'response body should have length property')
          t.equal(res.body.length, 1, 'response body should be an array with length 1')
          t.equal(res.body[0].username, validUser1.username, 'correct username is returned')
          dropCollectionAndEnd(User, t)
        })
    })
    .catch(err => t.end(err))
})

tape('test /users GET returns longer list', t => {
  User.create(validUser1, validUser2)
    .then(() => {
      supertest(server)
        .get('/users')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          // check our get path returns that user correctly
          t.equal(res.body.length, 2, 'response body should be an array with length 1')
          t.ok(res.body.map((user) => user.username).includes(validUser1.username), 'mattlub has been added')
          t.ok(res.body.map((user) => user.username).includes(validUser2.username), 'm4v15 has been added')
          dropCollectionAndEnd(User, t)
        })
    })
    .catch(err => t.end(err))
})
