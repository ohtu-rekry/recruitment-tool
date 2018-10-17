import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import * as actions from '../../redux/actions/actions'

import Header from '../Header'
import Login from '../admin/Login'
import JobPostingForm from '../jobPosting/JobPostingForm'
import JobPosting from '../posting-page/JobPosting'
import Applicants from '../applicants/Applicants'
import App from '../App'

class Routes extends Component {
  constructor( props ) {
    super(props)

    const willBeLoggedIn = (window.localStorage.getItem('loggedUser') !== null)
    this.state = { willBeLoggedIn }
  }

  componentDidMount() {
    const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser'))

    if (loggedUser) {
      this.props.loginSuccess(loggedUser)
      this.setState({ willBeLoggedIn: false })
    }
  }

  render() {
    const { loggedIn } = this.props
    const { willBeLoggedIn } = this.state

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
            <Route path="/jobposting/new" render={() =>
              willBeLoggedIn || loggedIn
                ? <JobPostingForm />
                : <Redirect to='/admin/login' />
            } />
            <Route exact path="/jobposting/:id/applicants" render={() =>
              willBeLoggedIn || loggedIn
                ? <Applicants/>
                : <Redirect to="/admin/login" />
            } />
            <Route exact path="/jobposting/:id" render={() => <JobPosting />} />
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