//models/index.js
const { model, Schema } = require('mongoose')

const User = require('./User.js')(model, Schema)
const Score = require('./Score.js')(model, Schema)
const Word = require('./Word.js')(model, Schema)

module.exports = { User, Score, Word }