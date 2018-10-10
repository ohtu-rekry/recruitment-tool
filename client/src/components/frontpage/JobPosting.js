import React from 'react'
import PropTypes from 'prop-types'

const JobPosting = (props) => {
  return (
    <div className='job-posting'>
      <div className='job-posting__title'>
        <h2>{props.data.title}</h2>
      </div>
      <div className='job-posting__content'>
      </div>
    </div>
  )
}

JobPosting.propTypes = {
  data: PropTypes.object.isRequired
}


export default JobPosting