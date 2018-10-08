import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Applicant from './Applicant'

export class ApplicationState extends Component {

  render() {
    const { applicants } = this.props

    return (
      <div className='application-state'>
        <div className='application-state__title'>Applied</div>
        {applicants.map(applicant =>
          <Applicant
            key={applicant.id}
            applicant={applicant}
          />
        )}
      </div>
    )
  }
}

ApplicationState.propTypes = {
  jobPosting: PropTypes.object,
  applicants: PropTypes.array
}

const mapStateToProps = (state) => ({
  jobPosting: state.postingReducer.jobPosting,
  applicants: state.postingReducer.applicants
})

export default connect(
  mapStateToProps,
  null
)(ApplicationState)