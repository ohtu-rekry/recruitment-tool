import React from 'react'
import PropTypes from 'prop-types'

const JobPosting = (props) => {
  return (
    <div className='job-posting-listing'>
      <div className='job-posting-listing__title'>
        <h2>{props.data.title}</h2>
      </div>
      <div className='job-posting-listing__content'>
      </div>
    </div>
  )
}

JobPosting.propTypes = {
  data: PropTypes.object.isRequired
}


export default JobPosting