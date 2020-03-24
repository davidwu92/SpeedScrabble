import React from 'react'
// import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

const LoggedinNav = () => {

  const logout = (e) => {
    e.preventDefault()
    localStorage.clear('token')
  }

  return (
    <nav id="bottomNav" className="nav-extended black">
      <div className="nav-wrapper" id="navWrapper">
      <div className="brand-logo" id="navTitle">Speed Scrabble</div>
      </div>
      <div className="nav-content">
        <ul className="tabs tabs-transparent">
          <li id="hovEffect" className="tab left"><Link to="/speedscrabble">New Game <i className="fas fa-pencil-alt tiny"></i></Link></li>
          <li id="hovEffect" className="tab left"><Link to="/multiplayer">Multiplayer <i className="fas fa-pencil-alt tiny"></i></Link></li>
          <li id="hovEffect" className="tab"><Link to="/help">Help <i className="fas fa-question-circle tiny"></i></Link></li>
          <li id="hovEffect" className="tab"><Link to="/test">Test Page</Link></li>
          <li id="hovEffect" className="tab right" onClick={logout}><Link to="/"><i className="fas fa-sign-out-alt"></i></Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default LoggedinNav