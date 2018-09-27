const router = require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(
  function (username, password, done) {
    done(null, username === 'admin' ? {
      'id': 7
    } : false)
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
