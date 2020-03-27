//routes/index.js
module.exports = app => {
  require('./userRoutes.js')(app)
  require('./wordRoutes.js')(app)
}