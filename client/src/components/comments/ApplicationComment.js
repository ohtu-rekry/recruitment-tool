import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import { Chip, Tooltip } from '@material-ui/core'

class ApplicationComment extends Component {

  truncateString(str, length) {
    const dots = str.length > length ? '...' : ''
    return str.substring(0, length) + dots
  }

  render() {
    const { createdAt, recruiterUsername, comment, attachments } = this.props.comment

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
        <div className='comment__content'>
          <ReactMarkdown source={comment} />
        </div>
        <div className='comment__attachments'>
          {attachments.map((attachment, index) => {
            return (
              <div className='comment__attachment'>
                <Tooltip key={index} title={attachment.path.substring(57)}>
                  <Chip
                    key={index}
                    label={this.truncateString(attachment.path.substring(57), 10)}
                    clickable={true}
                    onClick={() => window.open(attachment.path)} />
                </Tooltip>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

ApplicationComment.propTypes = {
  comment: PropTypes.object.isRequired
}

export default ApplicationComment