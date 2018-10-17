import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchApplicants }  from '../../redux/actions/actions'

import ApplicationStages from './ApplicationStages'

export class Applicants extends Component {
  constructor(props) {
    super(props)
    this.state = { isLoaded: false }
  }

  componentDidMount() {
    const { fetchApplicants, loggedIn } = this.props
    const postingId = window.location.href.split('/')[4]
    if (loggedIn) {
      fetchApplicants(postingId)
      this.setState({ isLoaded: true })
    }
  }

  componentWillReceiveProps(nProps) {
    const { fetchApplicants } = this.props
    const postingId = window.location.href.split('/')[4]
    if (nProps.loggedIn && !this.state.isLoaded) {
      fetchApplicants(postingId)
      this.setState({ isLoaded: true })
    }
  }

  render() {
    const { stages } = this.props
    return (
      <div className='applicantion-stages'>
        {stages.map(stage =>
          <ApplicationStages
            stage={stage}
            key={stage.id}
          />
        )}
      </div>
    )
  }
}

Applicants.propTypes = {
  loggedIn: PropTypes.object,
  jobPosting: PropTypes.object,
  stages: PropTypes.array,
  fetchApplicants: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  loggedIn: state.loginReducer.loggedIn,
  jobPosting: state.postingReducer.jobPosting,
  stages: state.postingReducer.stages
})

const mapDispatchToProps = {
  fetchApplicants
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Applicants)