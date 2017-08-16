const User = require('../models/User')
const roles = require('../constants/roles.js')
const { auth } = require('../constants/errors.json')
const boom = require('boom')

module.exports = {
  // Function to get the token, which will be decoded and used to populate req.user
  // atm it will check the headers, then query params, then cookies
  // We might need to get rid of the headers check if we end up putting the OAth token their?
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1]
    } else if (req.query && req.query.token) {
      return req.query.token
    } else if (req.cookies && req.cookies.token) {
      return req.cookies.token
    }
    return null
  },

  // function to check role of user matches minRole allowed on the route
  verifyRole: ({ minRole }) => user => {
    const userScope = user.scope

    if (minRole === roles.BASIC) return
    if (minRole === roles.ADMIN && userScope !== roles.BASIC) return
    if (minRole === roles.SUPER && userScope === roles.SUPER) return

    return Promise.reject(boom.unauthorized(auth.UNAUTHORIZED))
  },

// Check user from the token exists, and add their id to the req.user for potential use in permissioning
  addUserIdToSession: req => {
    return User.find({ username: req.user.username }).then(users => {
      if (users.length === 0) {
        return Promise.reject(boom.unauthorized(auth.UNAUTHORIZED))
      }

      req.user.id = users[0].id
      return req.user
    })
  }
}
