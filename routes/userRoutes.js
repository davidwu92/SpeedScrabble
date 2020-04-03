const { User } = require('../models')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const BCRYPT_SALT_ROUNDS = 12
const bcrypt = require('bcrypt')

const passportFacebook = require('passport-facebook')
const FacebookStrategy = passportFacebook.Strategy


module.exports = app => {
  // Register new user
  app.post('/users', (req, res) => {
      const { username, email, resetPasswordToken, resetPasswordExpires, password } = req.body
      const scores = []
      //setting default preferences here.
      // User.register(new User({username, email, scores}), req.body.password,
      //   e=>{
      //     if (e){console.error(e)}
      //     res.sendStatus(200)
      //   }
      // )
      bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
        if (password === '') {
          res.send('password cant be left blank')
        } else if (password.length <= 3) {
          res.send('need more')
        } else {
          User.create({
            email,
            username,
            password: hashedPassword,
          })
            .then(() => res.sendStatus(200))
            .catch(e => {
              if (e) {
                res.json({
                  success: false,
                  message: 'Your account could not be saved. Error: ',
                  e
                })
              }
            })
        }
      })
  })
  
  // Login route
  app.post('/login', (req, res) => {
    User.findOne({ username: req.body.username })
      .then(user => {
        if (user === null) {
          console.log('no user')
          res.sendStatus(200)
          return
        }
        bcrypt.compare(req.body.password, user.password).then(response => {
          if (response !== true) {
            console.log('passwords do not match')
            res.sendStatus(200)
            return 
          }
          console.log('user found & authenticated')
          res.json({
            token: jwt.sign({ id: user._id }, process.env.SECRET)
          })
          return 
        })
      })
    // User.authenticate()(req.body.username, req.body.password, (e, user)=>{
    //   if(e){console.error(e)}
    //   res.json(user ? {token: jwt.sign({id:user._id}, process.env.SECRET)
    //   } : user)
    // })
  })

  //GET USER INFO (for login)
  app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { _id } = req.user
    User.findById(_id)
      .then(user => res.json(user)) //only serve up this array to front end.
      .catch(e => console.error(e))
  })

  // GET My Info (for color preferences)
    app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
      const { _id } = req.user
      User.findById(_id)
        .then(user => res.json(user)) //only serve up this array to front end.
        .catch(e => console.error(e))
    })
  
    // EDIT COLOR PREFERENCES
    app.put('/users/:id', (req, res) => {
      User.findByIdAndUpdate(req.params.id, { $set: req.body })
        .then(() => res.sendStatus(200))
        .catch(e => console.error(e))
    })

  ///////////////
  // TEST CODE //
  ///////////////
  
  // Test route for the GoogleStrategy
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login']},
    function( req, res) {
      console.log('Hello')
    })
  )
  // Google Oauth 2.0 callback route
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
      res.redirect('/mycalendar')
    }
  )

// TEST CODE for FACEBOOK

app.get('/auth/facebook', passport.authenticate('facebook'))

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  return res.status(200).cookie('jwt', signToken(req.user), {
    httpOnly: true
  })
  .redirect('/')
})

}
