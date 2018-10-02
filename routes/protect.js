const router = require('express').Router()
const passport = require('passport')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const CognitoService = require('../services/cognito.js')

/* middleware */
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async function (jwtPayload, done) {
  try {
    done(null, await CognitoService.getSession(jwtPayload))
  } catch (err) {
    done(err)
  }
}))

router.use(passport.authenticate('jwt', { session: false }))

/* routes */
router.get('/user', function (req, res) {
  res.json(req.user)
})

module.exports = router
