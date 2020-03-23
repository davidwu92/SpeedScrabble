//Pages/Home.js LANDING PAGE
import React from 'react'
import { useHistory } from 'react-router-dom'
import './home.css'

const Home = () => {
  const history = useHistory()

  const toLoginPage = () => {
    history.push('/login')
  }

  return (
    <>
      <div className="white-text center-align">
        <div className="row">
          <h2 className="white-text">Welcome to Speed Scrabble</h2>
          <button className="btn btn-large purple"onClick={toLoginPage}>Get Started</button>
        </div>
      </div>
    </>
  )
}
export default Home