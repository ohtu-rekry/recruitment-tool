import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import * as actions from '../../redux/actions/actions'

import Header from '../Header'
import Login from '../admin/Login'
import JobPostingForm from '../jobPosting/JobPostingForm'
import App from '../App'
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
        <div>
          <Header />
          <Switch>
            <Route path="/admin/login" render={() =>
              loggedIn
                ? <Redirect to="/" />
                : <Login />
            } />
            <Route exact path="/posting/:id" render={() => <JobPosting />} />
            <Route path="/jobpostings/new" render={() =>
              <JobPostingForm />
            } />
            <Route exact path="/" render={() => <App />} />
          </Switch>
        </div>
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