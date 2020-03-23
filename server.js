require('dotenv').config()
const express = require('express')
const {join} = require('path')
const app = express()

//DEPLOYING TO HEROKU
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"))
} 

//middlewares
app.use(express.static(join(__dirname, 'client', 'build')))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//MONGODB
const mongoURI = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost/paymentTrackerdb'
const mongoose = require('mongoose')
const conn = mongoose.createConnection(mongoURI, {
  // these methods are rarely used
  useNewUrlParser: true,
  useUnifiedTopology: true
})
 
//routes
require('./routes')(app)

//connect to the database and listen on a port
require('mongoose')
  .connect(process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost/speedScrabbledb', {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(process.env.PORT || 3001)
  })
  .catch(e => console.error(e))
