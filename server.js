require('dotenv').config()
const express = require('express')
const { join } = require('path')
const app = express()
// passport modules
const passport = require('passport')
const { Strategy } = require('passport-local')

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const {User} = require('./models')
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt')

// facebook modules
const passportFacebook = require('passport-facebook')
const FacebookStrategy = passportFacebook.Strategy

//DEPLOYING TO HEROKU
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"))
}

//MONGODB
const mongoURI = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost/speedscrabbledb'
const mongoose = require('mongoose')
const conn = mongoose.createConnection(mongoURI, {
  // these methods are rarely used
  useNewUrlParser: true,
  useUnifiedTopology: true
})

//middleware
app.use(express.static(join(__dirname, 'client', 'build')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Passport Boilerplate code
passport.use(new Strategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// grabbing the token authentication process
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET
  }, ({ id }, cb) => User.findById(id)
      .then(user => cb(null, user))
      .catch(e => cb(e))
    )
)

// Facebook with Passport

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost/3000/auth/facebook/callback"
},

function(accessToken, refreshToken, profile, cb) {
  User.findOne({ facebookId: profile.id }, function (err, user) {
    return cb(err, user)
    })
  }
))

// GoogleStrategy with Passport
passport.use(new GoogleStrategy({
  clientID: '116685853039-25srr7221cqiuooi0d3parj8l92rp1p4.apps.googleusercontent.com',
  clientSecret: 'cv8xqBKLu0tRhYDo6z8CyFxe',
  callbackURL: 'https://www.google.com'
},
function (accessToken, refreshToken, profile, cb) {
  User.findOne({ googleId: profile.id })
    .then(user => cb(null, user))
    .catch(e => cb(e))
}
))

//routes
require('./routes')(app)

//Catches all; sends any routes NOT found in the server directly into our home.
app.get('*', (req, res) => res.sendFile(join(__dirname, 'client', 'build', 'index.html')))

//connect to the database and listen on a port
require('mongoose')
  .connect(process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost/speedscrabbledb', {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(process.env.PORT || 3001)
  })
  .catch(e => console.error(e))
