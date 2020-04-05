const { User } = require('../models')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const BCRYPT_SALT_ROUNDS = 10

require('dotenv').config()

const nodemailer = require('nodemailer')

module.exports = app => {
  // update password via email
  app.put('/updatePasswordViaEmail', (req, res, next) => {
    User.findOne({
      username: req.body.username
    })
      .then(user => {
        if (user !== null) {
          console.log('user exists in db')
          console.log(req.body.password)
          bcrypt
            .hash(req.body.password, BCRYPT_SALT_ROUNDS)
            .then(hashedPassword => {
              bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
                  // Store hash in your password DB.
                  console.log(hashedPassword)
                  user.password = hashedPassword
                  user.salt = salt
                  user.has = hash
                  // user.resetPasswordToken = null
                  // user.resetPasswordExpires = null

                  user.save()
                });
              });
            })
            .then(() => {

              console.log('password updated')
              res.status(200).send({ message: 'password updated' })
            })
        } else {
          console.log('no user exists in db to update')
          res.status(404).json('no user exists in db to update')
        }
      })
  })

  // reset password and update
  app.get('/reset', (req, res, next) => {
    console.log(req.query.resetPasswordToken)
    User.findOne({
      resetPasswordToken: req.query.resetPasswordToken,
      // change this out later
      resetPasswordExpires: {
        $gt: Date.now()
      }
    })
      .then(user => {
        console.log(user)
        if (user === null) {
          console.log('password reset link is invalid or has expired')
          res.json('password reset link is invalid or has expired')
        } else {
          res.status(200).send({
            username: user.username,
            message: 'password reset link a-ok'
          })
        }
      })
  })

  // send forgot password email
  app.post('/forgotPassword', (req, res) => {
    if (req.body.email === undefined) {
      res.status(200).json('email require')
      return
    }
    User.findOne({
      email: req.body.email
    })
      .then((user) => {
        if (user === null) {
          console.error('email not in database')
          res.status(200).json('email not in db')
          return
        } else {
          const token = crypto.randomBytes(20).toString('hex')

          user.resetPasswordToken = token
          user.resetPasswordExpires = Date.now() + 3600000

          user.save()

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: `${process.env.EMAIL_ADDRESS}`,
              pass: `${process.env.EMAIL_PASSWORD}`
            }
          })

          const mailOptions = {
            from: 'harmonizedevteam@gmail.com',
            to: `${user.email}`,
            subject: 'Link To Reset Password',
          }
          mailOptions.text = (process.env.NODE_ENV === 'production') ?
            'You have received this email because you (or someone else) requested a password reset for your Harmonize account. \n\n'
            + 'Please click on the following link or paste this into your browser within one hour of receiving this email to reset your password: \n\n'
            + `https://salty-dawn-09701.herokuapp.com/reset/${token}\n\n`
            + 'If you did not request this, ignore this email and your password will remain unchanged. \n'
            :
            'You have received this email because you (or someone else) requested a password reset for your Harmonize account. \n\n'
            + 'Please click on the following link or paste this into your browser within one hour of receiving this email to reset your password: \n\n'
            + `http://localhost:3000/reset/${token}\n\n`
            + 'If you did not request this, ignore this email and your password will remain unchanged. \n'

          console.log('sending mail')
          res.status(200).json('recovery email sent')

          transporter.sendMail(mailOptions, (err, reponse) => {
            if (err) {
              console.error('there was an error: ', err)
            } else {
              console.log('here is the res: ', response)
              res.status(200).json('recovery email sent')
              return
            }
          })

        }
      })
  })

}