import React, { useState, useEffect } from 'react'
import ScoreAPI from '../../utils/ScoreAPI'

const { allScores } = ScoreAPI

const Leaderboards = () => {

  const [leaderBoard, setLeaderBoard] = useState({
    score: []
  })

  useEffect(() => {
    allScores()
      .then(({ data }) => {
        setLeaderBoard({ ...leaderBoard, score: data})
      })
      .catch(e => console.error(e))
  }, [])

  console.log(leaderBoard.score.map(obj => obj.userLink))


  return(
    <div>
    <h1>Leaderboards Page</h1>
    {leaderBoard.score.map(obj => 
      <>
      <p>{obj.userLink.username}</p>
      <p>{obj.score}</p>
      </>
      )}
    </div>
  )
}
export default Leaderboards