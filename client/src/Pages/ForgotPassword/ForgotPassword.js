import React, { useState, useEffect } from 'react'
import UserAPI from '../../utils/UserAPI'

const { sendForgot } = UserAPI

const ForgotPassword = () => {

const [forgotState, setForgotState] = useState({
  email: '',
  showError: false,
  messageFromServer: '',
  showNullError: false
})

forgotState.handleInputChange = event => {
  setForgotState({ ...forgotState, [event.target.name]: event.target.value })
}

forgotState.sendEmail = e => {
  e.preventDefault()
  if (forgotState.email === '') {
    setForgotState({
      ...forgotState,
      showError: false,
      messageFromServer: '',
      showNullError: true
    })
  } else {
    let email = {
      email: forgotState.email
    }
    sendForgot(email)
      .then(response => {
        console.log(response)
        if (response.data === 'email not in db') {
          setForgotState({
            ...forgotState,
            showError: true,
            messageFromServer: '',
            showNullError: false
          })
        } else if (response.data === 'recovery email sent') {
          setForgotState({
            ...forgotState,
            showError: false,
            messageFromServer: 'recovery email sent',
            email: '',
            showNullError: false
          })
        }
      })
      .catch(e => console.error(e.data))
  }
}
  


  return (
    <div className="row">
      <form action="" className="col s12">
        <h3>Forgot Password</h3>
        <div className="input-field">
          <input
            placeholder="EmailAddress"
            type="text"
            id="email"
            name="email"
            value={forgotState.email}
            onChange={forgotState.handleInputChange}
          />
          <label htmlFor="email"></label>
        </div>
        <button
          onClick={forgotState.sendEmail}
          className="btn black waves-effect waves-light col s12"
          type="submit"
          name="action"
        >
          Send Password Reset Email
          <i className="material-icons right">send</i>
        </button>
      </form>
      {forgotState.showNullError && (
        <div>
          <h3>The email address cannot be left blank</h3>
        </div>
      )}
      {forgotState.showError && (
        <div>
          <h3>
            That email address isn't recognized. Please try again or{' '}
            <a href={'/register'}>Register</a> for a new account.
          </h3>
        </div>
      )}
      {forgotState.messageFromServer === 'recovery email sent' && (
        <div>
          <h3>Password Reset Email Successfully Sent!</h3>
        </div>
      )}
      <h5>
        <a href={'/'}>Home</a>
      </h5>
    </div>
  )
}

export default ForgotPassword