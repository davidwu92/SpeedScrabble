const { Word } = require('../models')

module.exports = app => {
  // get words 
  app.post('/words', (req, res) => {
    Word.find({ word: { $in: req.body.word }})
      .then(word => res.json(word))
      .catch(e => console.error(e))
  })
}