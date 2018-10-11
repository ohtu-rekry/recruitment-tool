import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const JobPostingListing = (props) => {
  return (
    <Link
      to={`/jobposting/${props.data.id}`}
      key={props.data.id}
      className='job-posting__link' >

      <div className='job-posting-listing'>
        <div className='job-posting-listing__title'>
          <h2>{props.data.title}</h2>
        </div>
        <div className='job-posting-listing__content'>
        </div>
      </div>

    </Link>
  )
}

JobPostingListing.propTypes = {
  data: PropTypes.object.isRequired
}


export default JobPostingListing