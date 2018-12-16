import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Lock, Person, Visibility, VisibilityOff } from '@material-ui/icons'
import PropTypes from 'prop-types'

import * as actions from '../../redux/actions/actions'
import * as selectors from '../../redux/selectors/selectors'

export class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      username: '',
      password: ''
    }
  }

  toggleVisibility = () => {
    this.setState(prevState => ({
      visible: !prevState.visible
    }))
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleLogin = (e) => {
    e.preventDefault()
    const { username, password } = this.state
    this.props.login(username, password)

    this.setState({
      username: '',
      password: '',
      visible: false
    })
  }

  render() {
    const { visible, username, password } = this.state
    const { loginError } = this.props

    return (
      <form className='admin-login-card' onSubmit={this.handleLogin}>
        <div className='admin-login-card__title admin-login-card__text'>
          Login as admin
        </div>
        <div className='admin-login-card__username'>
          <Person className='admin-login-card__username_icon' />
          <div className='admin-login-card__username-container'>
            <input
              required
              className='admin-login-card__username-container_input'
              id='username'
              placeholder='Username'
              value={username}
              onChange={this.handleChange}
            ></input>
          </div>
        </div>
        <div className='admin-login-card__password'>
          <Lock className='admin-login-card__password_icon' />
          <div className='admin-login-card__password-container'>
            <input
              required
              className='admin-login-card__password-container_input'
              id='password'
              placeholder='Password'
              type={visible ? 'input' : 'password'}
              value={password}
              onChange={this.handleChange}
            ></input>
            <div onClick={this.toggleVisibility}>
              {visible ?
                <VisibilityOff className='admin-login-card__password_icon' />
                : <Visibility className='admin-login-card__password_icon' />
              }
            </div>
          </div>
        </div>
        <button
          className='admin-login-card__button admin-login-card__text'
          type='submit'
        >
          Login
        </button>
        {loginError && <div className='admin-login-card__error'>{loginError}</div>}
      </form>
    )
  }
}

Login.propTypes = {
  loggedIn: PropTypes.object,
  loginError: PropTypes.string,
  login: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  loggedIn: selectors.getUser(state),
  loginError: selectors.getLoginError(state)
})

const mapDispatchToProps = {
  ...actions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)