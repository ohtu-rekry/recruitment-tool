import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import App from '../App'
import Login from '../admin/Login'
import JobPosting from '../posting-page/JobPosting'

class Routes extends Component {
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