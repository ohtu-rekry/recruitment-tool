import React from 'react'
import PropTypes from 'prop-types'

class ApplicationComment extends React.Component {
  render() {
    const { createdAt, recruiterUsername, comment } = this.props.comment

    const date = new Date(createdAt).toLocaleString([], {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    return (
      <div className='comment'>
        <div className='comment__metadata'>
          <div className='comment__recruiter'>{recruiterUsername}</div>
          <div className='comment__date'>{date}</div>
        </div>
        <div className='comment__content'>{comment}</div>
      </div>
    )
  }
}

ApplicationComment.propTypes = {
  comment: PropTypes.object.isRequired
}

export default ApplicationComment