const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const boom = require('boom')
const qs = require('querystring')
const isProduction = process.env.NODE_ENV === 'production'

const User = require('../models/User')
const Client = require('../models/auth/Client')
const roles = require('../constants/roles.js')
const { auth: authErr } = require('../constants/errors.json')

const makeLoggedInToken = user => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      },
      (err, token) => {
        if (err) return reject(err)

        resolve(token)
      }
    )
  })
}

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {isSecure: isProduction, httpOnly: isProduction})
}

const registerNewUser = (data) => {
  if (data.password !== data['confirm-password']) {
    return Promise.reject(boom.badRequest(authErr.PASSWORDSDONOTMATCH))
  }
  return User.findOne({ username: data.username }).then(notNewUsername => {
    if (notNewUsername) {
      return Promise.reject(boom.badRequest(authErr.USERNAMEEXISTS))
    }
    return bcrypt.hash(data.password, 12)
  }).then(passwordHash => {
    const { email, username, imageUrl } = data
    const en = data.name_en
      ? {
        name: data.name_en,
        organisationName: data.organisationName_en,
        organisationDescription: data.organisationDescription_en
      }
      : null
    const ar = data.name_ar
      ? {
        name: data.name_ar,
        organisationName: data.organisationName_ar,
        organisationDescription: data.organisationDescription_ar
      }
      : null
    return User.create(
      {
        username,
        password: passwordHash,
        role: roles.BASIC,
        email,
        imageUrl,
        ar,
        en
      }
    )
  })
}

const sessionController = module.exports = {}

sessionController.getRegisterPage = (req, res) => {
  if (req.query && req.query.client && req.query.return_to) {
    return res.render('register', {
      client: req.query.client,
      return_to: qs.escape(req.query.return_to)
    })
  }
  res.render('register')
}

sessionController.registerAndLogOn = (req, res, next) => {
  registerNewUser(req.body)
    .then(makeLoggedInToken)
    .then(token => {
      setTokenCookie(res, token)
      if (req.query && req.query.return_to) {
        return res.redirect(req.query.return_to)
      }
      res.send('registered!')
    }).catch(next)
}

sessionController.getLoginPage = (req, res) => {
  if (req.query && req.query.client_id && req.query.return_to) {
    return Client.findById(req.query.client_id)
      .then(client => {
        res.render('login', {
          client: client.name,
          return_to: qs.escape(req.query.return_to)
        })
      })
      .catch(() => res.render('login'))
  }
  res.render('login')
}

sessionController.login = (req, res, next) => {
  User.findOne({ username: req.body.username }).then(existingUser => {
    if (!existingUser) {
      return Promise.reject(boom.badRequest(authErr.WRONGUSERORPW))
    }
    return bcrypt.compare(req.body.password, existingUser.password).then(match => {
      if (!match) {
        return Promise.reject(boom.badRequest(authErr.WRONGUSERORPW))
      }
      return existingUser
    })
  })
  .then(makeLoggedInToken)
  .then(token => {
    setTokenCookie(res, token)
    if (req.query && req.query.return_to) {
      return res.redirect(req.query.return_to)
    }
    res.send('success')
  }).catch(next)
}

module.exports.makeLoggedInToken = makeLoggedInToken
