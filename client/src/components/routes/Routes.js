import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import * as actions from '../../redux/actions/actions'

import Login from '../admin/Login'
import App from '../App'

class Routes extends Component {
  componentDidMount() {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      this.props.loginSuccess()
    }
  }

  render() {
    const { loggedIn } = this.props

    return (
      <Router>
        <Switch>
          <Route path="/admin/login" render={() =>
            loggedIn
              ? <Redirect to="/" />
              : <Login />
          } />
          <Route exact path="/" render={() => <App />} />
        </Switch>
      </Router>
    )
  }
}


const mapStateToProps = (state) => ({
  loggedIn: state.loginReducer.loggedIn
})

const mapDispatchToProps = {
  ...actions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Routes)