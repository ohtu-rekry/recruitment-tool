import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Applicant from './Applicant'

export class ApplicationStages extends Component {

  render() {
    const { stage } = this.props

    return (
      <div className='application-stage'>
        <div className='application-stage__title'>
          {stage.stageName}
        </div>
        <div className='application-stage__content'>
          {stage.applicants && stage.applicants.map(applicant =>
            <Applicant
              key={applicant.id}
              applicant={applicant}
            />
          )}
        </div>
      </div>
    )
  }
}

ApplicationStages.propTypes = {
  stage: PropTypes.object.isRequired
}

export default ApplicationStages