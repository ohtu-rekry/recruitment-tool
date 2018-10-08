import React from 'react'

export const Applicant = (props) => {
  return (
    <div className='applicant'>
      <div className='applicant__name'>{props.applicant.applicantName}</div>
      <div className='applicant__email'>{props.applicant.applicantEmail}</div>
    </div>
  )
}

export default Applicant