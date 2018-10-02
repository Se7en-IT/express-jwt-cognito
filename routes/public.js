const router = require('express').Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const CognitoService = require('../services/cognito.js')

passport.use(new LocalStrategy(
  async function (username, password, done) {
    try {
      let result = await CognitoService.login(username, password)
      done(null, {
        'username': username,
        'idToken': result.idToken,
        'accessToken': result.accessToken,
        'refreshToken': result.refreshToken
      })
    } catch (ex) {
      done(ex)
    }
  }
))

/* routes */
router.post('/login', passport.authenticate('local', { session: false }), function (req, res, next) {
  const token = jwt.sign(req.user, process.env.JWT_SECRET)
  res.json({
    token
  })
})

module.exports = router
