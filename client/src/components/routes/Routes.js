import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import * as actions from '../../redux/actions/actions'

import Header from '../Header'
import Login from '../admin/Login'
import AdminFrontPage from '../frontpage/AdminFrontPage'
import JobPostingForm from '../jobPosting/JobPostingForm'
import JobPosting from '../posting-page/JobPosting'
import Applicants from '../applicants/Applicants'
import App from '../App'
import ApplicationSuccess from '../applicationSuccess/ApplicationSuccess'

class Routes extends Component {
  constructor(props) {
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
            <Route exact path="/" render={() =>
              willBeLoggedIn || loggedIn
                ? <Redirect to='/applications' />
                : <Redirect to='/positions' />
            } />
            <Route path="/position/new" render={() =>
              willBeLoggedIn || loggedIn
                ? <JobPostingForm mode='create' />
                : <Redirect to='/positions' />
            } />
            <Route exact path="/position/:id/applicants" render={() =>
              willBeLoggedIn || loggedIn
                ? <Applicants adminView={false} />
                : <Redirect to="/positions" />
            } />
            <Route exact path="/position/:id/edit" render={() =>
              willBeLoggedIn || loggedIn
                ? <JobPostingForm mode='edit' />
                : <Redirect to='/positions' />
            } />
            <Route exact path="/position/:id" render={() => <JobPosting />} />
            <Route exact path="/applications" render={() =>
              willBeLoggedIn || loggedIn
                ? <AdminFrontPage />
                : <Redirect to='/positions' />
            } />
            <Route exact path="/positions" render={() => <App />} />
            <Route exact path="/success" render={() => <ApplicationSuccess />} />
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