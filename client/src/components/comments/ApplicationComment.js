import React from 'react'
import PropTypes from 'prop-types'


class ApplicationComment extends React.Component {


  render() {
    const { createdAt, recruiterId, comment } = this.props.comment

    const date = new Date(createdAt).toLocaleString([], {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })

    return (
      <div className='comment'>
        <div className='comment__metadata'>
          <div className='comment__recruiter'>{recruiterId}</div>
          <div className='comment__date'>{date}</div>
        </div>
        <div className='comment__content'>{comment}</div>
        <div className='comment__border'></div>
      </div>
    )
  }
}

ApplicationComment.propTypes = {
  applicant: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired
}

export default ApplicationComment