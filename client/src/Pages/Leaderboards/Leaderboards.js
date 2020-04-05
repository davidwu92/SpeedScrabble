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
        console.log(data)
        setLeaderBoard({ ...leaderBoard, score: data})
      })
      .catch(e => console.error(e))
  }, [])

  console.log(leaderBoard.score.map(obj => obj.userLink))


  return (
    <>
    <h1 className="center white-text">TOP 10 Leaderboard</h1>
    <div className="row center">
      <table className="centered responsive-table">
        <thead>
          <tr className="blue lighten-4 blue-grey-text text-darken-4">
            {/* <th>Game #</th> */}
            <th>Player</th>
            <th>Board Score</th>
            <th>Time</th>
            <th>Final Score</th>
            <th>Words</th>
          </tr>
        </thead>
        <tbody>
          {leaderBoard.score.map((object, index) => (
                <tr>
                  {/* <td>{index+1}</td> */}
                  <td>{object.userLink.username}</td>
                  <td>{object.formationScore}</td>
                  <td>{object.time} seconds</td>
                  <td>{object.score}</td>
                  <td>{object.words}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
    </>
  )
}
export default Leaderboards