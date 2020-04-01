import axios from 'axios'

const ScoreAPI = {
  // get all score:
  allScores: () => axios.get('/scores'),

  // get USER scores:
  getScores: (userId) => axios.get(`/scores/${userId}`),

  // post score:
  addScore: (score) => axios.post('/scores', score)
}

export default ScoreAPI