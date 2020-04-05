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
import Leaderboards from './Pages/Leaderboards'
import Help from './Pages/Help'
// import TestPage from './Pages/TestPage'
import Multiplayer from './Pages/Multiplayer'
import ForgotPassword from './Pages/ForgotPassword'
import ResetPassword from './Pages/ResetPassword'

import './App.css'

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
        <Route exact path="/leaderboards">
          <LoggedInNav/>
          <Leaderboards/>
        </Route>
      </Switch>

      <Switch>
        <Route exact path="/help">
          <LoggedInNav/>
          <Help/>
        </Route>
      </Switch>
    
      <Switch>
        <Route exact path="/forgotPassword">
          <Navbar/>
          <ForgotPassword/>
        </Route>
      </Switch>

      <Switch>
        <Route exact path="/reset/:token">
          <Navbar/>
          <ResetPassword/>
        </Route>
      </Switch>

      <Switch>
        <Route exact path="/multiplayer">
          <LoggedInNav/>
          <Multiplayer/>
        </Route>
      </Switch>

    </Router>
  );
}

export default App;
