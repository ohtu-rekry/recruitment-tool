import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

// import Login from '../admin/Login'
import App from '../App'
import JobOpening from '../opening-page/JobOpening'

class Routes extends Component {
  render() {
    const { loggedIn } = this.props

    return (
      <Router>
        <Switch>
          <Route path="/admin/login" render={() =>
            loggedIn
              ? <Redirect to="/" />
              : <App />
           }/>
          <Route exact path="/opening" render={() => <JobOpening />} />
          <Route exact path="/" render={() => <App />} />
        </Switch>
      </Router>
    )
  }
}


const mapStateToProps = (state) => ({
  loggedIn: state.reducer.loggedIn
})

export default connect(
  mapStateToProps,
  null
)(Routes)