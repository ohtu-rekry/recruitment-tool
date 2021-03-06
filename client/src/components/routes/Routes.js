import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import * as actions from '../../redux/actions/actions'
import * as selectors from '../../redux/selectors/selectors'

import Header from '../header/Header'
import Login from '../admin/Login'
import AdminFrontPage from '../admin/AllApplicantsAdminView'
import JobPostingForm from '../jobPostingForm/JobPostingForm'
import JobPosting from '../jobPosting/JobPosting'
import Applicants from '../applicants/Applicants'
import FrontPage from '../jobPostings/JobPostings'
import ApplicationSuccess from '../jobPosting/redirect/ApplicationSuccess'

class Routes extends Component {
  constructor(props) {
    super(props)

    const willBeLoggedIn = (window.localStorage.getItem('loggedUser') !== null)
    this.state = { willBeLoggedIn }
  }

  componentDidMount = async () => {
    const loggedUser = await JSON.parse(window.localStorage.getItem('loggedUser'))

    if (loggedUser) {
      await this.props.loginSuccess(loggedUser)
      this.setState({ willBeLoggedIn: false })
    }
  }

  render() {
    const { loggedIn } = this.props
    const { willBeLoggedIn } = this.state

    return (
      <Router>
        <div>
          <Header/>
          <div className='container'>
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
                  : <Redirect to='/admin/login' />
              } />
              <Route exact path="/position/:id/applicants" render={() =>
                willBeLoggedIn || loggedIn
                  ? <Applicants adminView={false} />
                  : <Redirect to="/admin/login" />
              } />
              <Route exact path="/position/:id/edit" render={() =>
                willBeLoggedIn || loggedIn
                  ? <JobPostingForm mode='edit' />
                  : <Redirect to='/admin/login' />
              } />
              <Route exact path="/position/:id" render={() => <JobPosting />} />
              <Route exact path="/applications" render={() =>
                willBeLoggedIn || loggedIn
                  ? <AdminFrontPage />
                  : <Redirect to='/positions' />
              } />
              <Route exact path="/positions" render={() => <FrontPage />} />
              <Route exact path="/success" render={() => <ApplicationSuccess />} />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}


const mapStateToProps = (state) => ({
  loggedIn: selectors.getUser(state)
})

const mapDispatchToProps = {
  ...actions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Routes)