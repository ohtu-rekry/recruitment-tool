import React from 'react'
import PropTypes from 'prop-types'

const JobPosting = (props) => {
  const { onClick } = props
  return (
    <div className='job-posting-listing' onClick={onClick}>
      <div className='job-posting-listing__title'>
        <h2>{props.data.title}</h2>
      </div>
      <div className='job-posting-listing__content'>
      </div>
    </div>
  )
}

JobPosting.propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}


export default JobPosting