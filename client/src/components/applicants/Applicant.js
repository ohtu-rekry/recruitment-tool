import React from 'react'
import PropTypes from 'prop-types'

export const Applicant = (props) => {
  console.log(props)
  return (
    <div className='applicant'>
      <div className='applicant__name'>{props.applicant.applicantName}</div>
      <div className='applicant__email'>{props.applicant.applicantEmail}</div>
    </div>
  )
}

Applicant.propTypes = {
  applicant: PropTypes.object.isRequired
}

export default Applicant