const { Score, User } = require('../models')

module.exports = app => {

  //GET SCORES
  app.get('/scores/:id', (req, res) => {
    Score.find({ userLink: req.params.id })
      .populate('userLink')
      .then(userLink => res.json(userLink))
      .catch(e => console.error(e))
  })

  // POST SCORE
  app.post('/scores', (req, res) => {
    
    const { score, startingHand, userLink } = req.body
    Score.create({ score, startingHand, userLink })
      .then(score => {
        User.updateOne({ _id: userLink}, { $push: { scores: score }})
          .then(() => res.sendStatus(200))
          .catch(e => console.error(e))
      })
      .catch(e => console.error(e))
  })
}