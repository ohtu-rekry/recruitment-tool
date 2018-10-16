import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Applicant from './Applicant'

export class ApplicationStages extends Component {

  render() {
    const { stage } = this.props

    return (
      <div className='application-stage'>
        <div className='application-stage__title'>{stage.stageName}</div>
        {stage.applicants && stage.applicants.map(applicant =>
          <Applicant
            key={applicant.id}
            applicant={applicant}
          />
        )}
      </div>
    )
  }
}

ApplicationStages.propTypes = {
  jobPosting: PropTypes.object,
  stage: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  jobPosting: state.postingReducer.jobPosting
})

export default connect(
  mapStateToProps,
  null
)(ApplicationStages)