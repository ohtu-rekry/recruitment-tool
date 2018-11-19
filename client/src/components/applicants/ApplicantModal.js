import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Button, Modal, TextField } from '@material-ui/core'
import Clear from '@material-ui/icons/Clear'
import Person from '@material-ui/icons/Person'
import Email from '@material-ui/icons/Email'
import Calendar from '@material-ui/icons/CalendarToday'
import { addComment } from '../../redux/actions/actions'

class ApplicantModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      comment: '',
      commentError: false
    }
  }

  handleSubmit = () => {
    if (!this.state.comment.trim()) {
      this.setState({ commentError: true })
    } else {
      this.props.addComment(this.state.comment, this.props.applicant.id)
      this.setState({ comment: '', commentError: false })
    }
  }

  handleCommentChange = (event) => {
    this.setState({ comment: event.target.value, commentError: false })
  }

  handleCommentFocus = () => {
    this.setState({ commentError: false })
  }

  handleCommentKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      this.handleSubmit()
    }
  }

  handleClose = () => {
    this.props.closeModal(null)
  }

  render() {
    const { applicantName, applicantEmail, createdAt, jobPosting } = this.props.applicant
    const { comment, commentError } = this.state
    const helperText = commentError ? 'Cannot send empty comment' : 'Markdown syntax supported'

    let dateTime = new Date(createdAt).toLocaleString([], {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })

    const buttonStyle = {
      alignSelf: 'flex-end'
    }

    return (
      <Modal
        open={true}
        onClose={this.handleClose}
      >
        <div className='applicant-modal__card' >
          <Button
            style={buttonStyle}
            mini
            variant="fab"
            color="inherit"
            aria-label="Close"
            onClick={this.handleClose}
          >
            <Clear />
          </Button>
          <div>
            <Person className='applicant-modal__card__icon' />
            <div className='applicant-modal__card__name'>
              {applicantName}
            </div>
          </div>
          <div>
            <Email className='applicant-modal__card__icon' />
            <div className='applicant-modal__card__email'>
              {applicantEmail}
            </div>
          </div>
          <div>
            <Calendar className='applicant-modal__card__icon' />
            <div className='applicant-modal__card__date'>
              {dateTime}
            </div>
          </div>
          {jobPosting &&
            <div className='applicant-modal__card__date'>
              Applied for: {jobPosting}
            </div>}
          <div className='applicant-modal__card__comment-input'>
            <TextField
              multiline
              rowsMax='10'
              required
              fullWidth
              id='comment'
              type='text'
              value={comment}
              label='Comment'
              helperText={helperText}
              onChange={this.handleCommentChange}
              error={commentError}
              onFocus={this.handleCommentFocus}
              onKeyPress={this.handleCommentKeyPress}
            />
          </div>
          <div className='applicant-modal__card__comment-button'>
            <Button color='inherit' variant='contained' aria-label='Add' onClick={this.handleSubmit}>
              Send
            </Button>
          </div>
        </div>
      </Modal>
    )
  }
}

ApplicantModal.propTypes = {
  applicant: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  addComment
}

export default connect(
  null,
  mapDispatchToProps
)(ApplicantModal)