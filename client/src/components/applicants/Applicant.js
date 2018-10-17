import React from 'react'
import PropTypes from 'prop-types'

export const Applicant = (props) => {
  const { applicantName, applicantEmail, createdAt } = props.applicant
  let dateTime = new Date(createdAt).toLocaleString([], {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute:'2-digit'
  })
  return (
    <div className='applicant'>
      <div className='applicant__name'>
        {applicantName}
      </div>
      <div className='applicant__email'>
        {applicantEmail}
      </div>
      <div className='applicant__date'>Application sent: {dateTime}</div>
    </div>
  )
}

Applicant.propTypes = {
  applicant: PropTypes.object.isRequired
}

export default Applicant