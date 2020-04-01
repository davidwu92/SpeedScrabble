const { Score, User } = require('../models')

module.exports = app => {

  // GET ALL SCORES for Leaderboard
  app.get('/scores', (req, res) => {
    Score.find().sort({ score: -1 }).limit(10)
      .populate('userLink')
      .then(scores => res.json(scores))
      .catch(e => console.error(e))
  })

  //GET USER SCORES
  app.get('/scores/:id', (req, res) => {
    Score.find({ userLink: req.params.id })
      .populate('userLink')
      .then(userLink => res.json(userLink))
      .catch(e => console.error(e))
  })

  // POST SCORE
  app.post('/scores', (req, res) => {
    const { formationScore, time, score, words, userLink } = req.body
    Score.create({ formationScore, time, score, words, userLink })
      .then(score => {
        User.updateOne({ _id: userLink}, { $push: { scores: score }})
          .then(() => res.sendStatus(200))
          .catch(e => console.error(e))
      })
      .catch(e => console.error(e))
  })
}