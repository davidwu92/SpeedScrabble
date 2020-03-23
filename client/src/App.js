import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import Navbar from './Components/Navbar'
import LoggedInNav from './Components/LoggedInNav'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import SpeedScrabble from './Pages/SpeedScrabble'
import Help from './Pages/Help'

import './app.css'

function App() {
  return (
    <Router>
    <Switch>
      <Route exact path="/">
        <Navbar/>
        <Home />
      </Route>
    </Switch>
    
    <Switch>
      <Route exact path="/login">
        <Navbar/>
        <Login />
      </Route>
    </Switch>
    
    <Switch>
      <Route exact path="/register">
        <Navbar/>
        <Register />
      </Route>
    </Switch>

    <Switch>
      <Route exact path="/speedscrabble">
        <LoggedInNav/>
        <SpeedScrabble/>
      </Route>
    </Switch>

    <Switch>
      <Route exact path="/help">
        <LoggedInNav/>
        <Help/>
      </Route>
    </Switch>

  </Router>
  );
}

export default App;
