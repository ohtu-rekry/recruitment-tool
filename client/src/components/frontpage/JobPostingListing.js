import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'

const JobPostingListing = (props) => {
  const titleStyle = {
    color: '#002234',
    fontSize: '22px',
    padding: '20px 0px'
  }

  return (
    <Link
      to={`/jobposting/${props.data.id}`}
      key={props.data.id}
      className='job-posting-listing__link' >
      <div className='job-posting-listing'>
        <div className='job-posting-listing__title'>
          <Typography variant='headline' style={titleStyle}>{props.data.title}</Typography>
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