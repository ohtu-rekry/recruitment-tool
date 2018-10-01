import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import * as actions from '../../redux/actions/actions'

import Login from '../admin/Login'
import JobPostingForm from '../jobPosting/JobPostingForm'
import App from '../App'
import Login from '../admin/Login'
import JobPosting from '../posting-page/JobPosting'

class Routes extends Component {

  componentDidMount() {
    const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser'))

    if (loggedUser) {
      this.props.loginSuccess(loggedUser)
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
          }/>
          <Route exact path="/posting/:id" render={() => <JobPosting />} />
          <Route path="/jobpostings/new" render={() =>
            <JobPostingForm />
          }/>
          <Route exact path="/" render={() => <App />} />
        </Switch>
      </Router>
    )
  }
}


const mapStateToProps = (state) => ({
})

export default connect(
  mapStateToProps,
  null
)(Routes)