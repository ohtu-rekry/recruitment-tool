import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../../redux/actions/actions'

import CopyStagesButton from './CopyStagesButton'
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
    const { fetchApplicants, fetchJobPosting } = this.props
    const postingId = window.location.href.split('/')[4]
    if (nProps.loggedIn && !this.state.isLoaded) {
      fetchJobPosting(postingId)
      fetchApplicants(postingId)
      this.setState({ isLoaded: true })
    }
  }

  render() {
    const { stages, jobPosting } = this.props
    return (
      <div className='applicants'>
        <div className='applicants__title'>{jobPosting.title}</div>
        <div className='applicants__button' onClick={() => this.props.copyStages(stages)}>
          <CopyStagesButton />
        </div>
        <div className='applicantion-stages'>
          {stages.map(stage =>
            <ApplicationStages
              stage={stage}
              key={stage.id}
            />
          )}
        </div>
      </div>
    )
  }
}

Applicants.propTypes = {
  loggedIn: PropTypes.object,
  jobPosting: PropTypes.object,
  stages: PropTypes.array
}

const mapStateToProps = (state) => ({
  loggedIn: state.loginReducer.loggedIn,
  jobPosting: state.postingReducer.jobPosting,
  stages: state.postingReducer.stages
})

const mapDispatchToProps = {
  ...actions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Applicants)