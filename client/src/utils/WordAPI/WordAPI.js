import axios from 'axios'

const WordAPI = {
  // check word in database
  getWord: (word) => axios.post('/words', word)

}

export default WordAPI