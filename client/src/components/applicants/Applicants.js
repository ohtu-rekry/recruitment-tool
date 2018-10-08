import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchApplicants }  from '../../redux/actions/actions'

import ApplicationState from './ApplicationState'

export class Applicants extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    const { fetchApplicants } = this.props
    const postingId = window.location.href.split('/')[4]
    fetchApplicants(postingId)
  }

  componentWillReceiveProps(nProps) {
    const { fetchApplicants } = this.props
    if (nProps.loggedIn.token) {
      const postingId = window.location.href.split('/')[4]
      fetchApplicants(postingId)
    }
  }

  render() {
    return (
      <React.Fragment>
        <ApplicationState />
      </React.Fragment>
    )
  }
}

Applicants.propTypes = {
  loggedIn: PropTypes.object,
  jobPosting: PropTypes.object,
  fetchApplicants: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  loggedIn: state.loginReducer.loggedIn,
  jobPosting: state.postingReducer.jobPosting
})

const mapDispatchToProps = {
  fetchApplicants
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Applicants)