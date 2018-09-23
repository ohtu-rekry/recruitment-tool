import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import * as actions from '../../redux/actions/actions'

//import Login from '../admin/Login'
import ConnectedJobPostingForm from '../jobPosting/JobPostingForm'
import App from '../App'

class Routes extends Component {
/*   componentDidMount() {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      this.props.loginSuccess()
    }
  } */

  render() {
    const { loggedIn } = this.props

    return (
      <Router>
        <Switch>
          <Route path="/admin/login" render={() =>
            <App name="login" />
          }/>
          <Route path="/jobpostings/new" render={() =>
            loggedIn
              ? <ConnectedJobPostingForm />
              : <Redirect to="/admin/login" />
          }/>
          <Route exact path="/" render={() => <App name="app" />} />
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