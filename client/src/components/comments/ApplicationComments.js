import React, { Component } from 'react'
import ApplicationComment from './ApplicationComment'

class ApplicationComments extends Component {
  render() {
    const { comments } = this.props
    return (
      <React.Fragment>
        <div className='applicant-modal__comments-title'>Comments ({comments.length})</div>
        {comments && <div className='applicant-modal__comments'>
          {comments
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(comment =>
              <ApplicationComment key={comment.id} comment={comment} />
            )}
        </div>}
      </React.Fragment>
    )
  }
}

export default ApplicationComments