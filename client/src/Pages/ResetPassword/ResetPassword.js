import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { useParams, Link } from 'react-router-dom'

const ResetPassword = () => {

const [resetState, setResetState] = useState({
  username: '',
  password: '',
  confirmPassword: '',
  update: false,
  isLoading: true,
  error: false
})

const title = {
  pageTitle: 'Password Reset Screen'
}
  let { token } = useParams()

useEffect(() => {
  axios.get('/reset', { params: {
    resetPasswordToken: token
  }})
  .then(response => {
    console.log(response)
    if (response.data.message === 'password reset link a-ok') {
      setResetState({ ...resetState,
        username: response.data.username,
        update: false,
        isLoading: false,
        error: false
      })
      
    } else {
      setResetState({ ...resetState,
        update: false,
        isLoading: false,
        error: true
      })
    }
  })
  .catch(error => {
    console.log(error.data)
  })

}, [])

resetState.handleInputChange = event => {
  setResetState({ ...resetState, [event.target.name]: event.target.value})
}

resetState.updatePassword = e => {
  e.preventDefault()
  axios.put('/updatePasswordViaEmail', {
    username: resetState.username,
    password: resetState.password
    })
    .then(response => {
      console.log(response.data)
      if (response.data.message === 'password updated') {
        setResetState({ ...resetState,
          updated: true,
          error: false
        })
      } else {
        setResetState({ ...resetState,
          updated: false,
          error: true
        })
      }
    })
    .catch(error => {
      console.log(error.data)
    })
  }

  // email errors
  if (resetState.error) {
  return (
    <div>
      <h1>{title.pageTitle}</h1>
      <div>
        <h4>Problem resetting password. Please send another reset link.</h4>
        <h6><Link to="/">Go Home</Link></h6>
        <h6><Link to="/forgotPassword">Forgot Password?</Link></h6>
      </div>
    </div>
  )
} 
if (resetState.isLoading) {
  return(
    <div>
      <div>Loading User Data...</div>
    </div>
  )
}


  return (
    <div>
      <h1>{title.pageTitle}</h1>
      <form action="" className="col s12">
        <div className="input-field">
          <input
            placeholder="password"
            type="text"
            id="password"
            name="password"
            value={resetState.password}
            onChange={resetState.handleInputChange}
          />
          <label htmlFor="password"></label>
        </div>
        <button
          onClick={resetState.updatePassword}
          className="btn black waves-effect waves-light col s12"
          type="submit"
          name="action"
        >
          Update Password
          <i className="material-icons right">send</i>
        </button>
      </form>

      {resetState.updated && (
        <div>
          <p>
            Your password has been successfully reset, please try logging in
            again.
          </p>
          <h6>
            <Link to="/login">Forgot Password?</Link>
          </h6>
        </div>
      )}
      <h6>
        <Link to="/">Go Home</Link>
      </h6>
    </div>
  )
}

export default ResetPassword