import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'

const JobPostingListing = (props) => {
  const titleColor = props.data.isHidden ? '#9a9a9a' : '#002234'
  const titleStyle = {
    color: titleColor,
    fontSize: '22px',
    padding: '20px 0px',
    display: 'inline-flex',
    marginRight: '10px'
  }

  return (
    <Link
      to={`/jobposting/${props.data.id}`}
      key={props.data.id}
      className='job-posting-listing__link' >
      <div className='job-posting-listing'>
        <div className='job-posting-listing__title'>
          <Typography variant='headline' style={titleStyle}>{props.data.title}</Typography>
          {props.data.isHidden && <span className='job-posting-listing__hidden'>Hidden</span>}
        </div>
      </div>
    </Link>
  )
}

JobPostingListing.propTypes = {
  data: PropTypes.object.isRequired
}


export default JobPostingListing