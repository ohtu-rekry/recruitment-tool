import React from 'react'

const JobPosting = (props) => {
  const { onClick } = props
  return (
    <div className='job-posting' onClick={onClick}>
      <div className='job-posting__title'>
        <h2>{props.data.title}</h2>
      </div>
      <div className='job-posting__content'>
      </div>
    </div>
  )
}

export default JobPosting