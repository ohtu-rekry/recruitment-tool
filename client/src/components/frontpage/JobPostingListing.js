import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import JobPosting from './JobPosting'

const JobPostingListing = (props) => {
  return (
    <Link
      to={`/jobposting/${props.data.id}`}
      key={props.data.id}
      className='job-posting__link' >

      <JobPosting data={props.data} />

    </Link>
  )
}

JobPostingListing.propTypes = {
  data: PropTypes.object.isRequired
}


export default JobPostingListing