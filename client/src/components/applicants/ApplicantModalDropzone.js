import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { addComment } from '../../redux/actions/actions'
import { Button, Chip, TextField } from '@material-ui/core'
import { AttachFile } from '@material-ui/icons'
import Dropzone from 'react-dropzone'

class ApplicantModalDropzone extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      inputError: null,
      comment: '',
      attachments: []
    }
  }

  handleSubmit = () => {
    if (!this.state.comment.trim()) {
      this.setState({ inputError: 'Cannot send empty comment' })
    } else {
      this.props.addComment(this.state.comment, this.props.applicant.id, this.state.attachments)
      this.setState({ comment: '', inputError: null, attachments: [] })
    }
  }

  handleCommentChange = (event) => {
    this.setState({ comment: event.target.value, inputError: null })
  }

  handleCommentFocus = () => {
    this.setState({ inputError: null })
  }

  handleCommentKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      this.handleSubmit()
    }
  }

  handleDropAttachment = (e) => {
    this.setState({
      attachments: this.state.attachments.concat(e),
      inputError: null
    })
  }

  handleAttachmentReject = () => {
    this.setState({ inputError: 'Only .pdf and .zip files are accepted' })
  }

  handleAttachmentDelete = (deleteIndex) => {
    const attachments = this.state.attachments
      .filter((attachment, index) => index !== deleteIndex)

    this.setState({ attachments, inputError: null })
  }

  handleDropzoneClick = (e) => {
    if (!e.openBrowse) {
      e.preventDefault()
    }
    e.openBrowse = false
  }

  handleAttachmentButtonClick = (e) => {
    e.openBrowse = true
  }

  render() {
    const { comment, inputError, attachments } = this.state
    let error, helperText
    if (inputError) {
      error = true
      helperText = inputError
    } else {
      error = false
      helperText = 'Markdown syntax supported'
    }

    return (
      <Dropzone
        onDropAccepted={this.handleDropAttachment}
        onDropRejected={this.handleAttachmentReject}
        accept='.pdf, .zip'
        className='applicant-modal__card__attachment-dropzone'
        acceptClassName='applicant-modal__card__attachment-dropzone__visible'
        onClick={this.handleDropzoneClick}
      >
        <div className='applicant-modal__card__comment-input'>
          <TextField
            multiline
            required
            fullWidth
            id='comment'
            type='text'
            value={comment}
            label='Comment'
            helperText={helperText}
            onChange={this.handleCommentChange}
            error={error}
            onFocus={this.handleCommentFocus}
            onKeyPress={this.handleCommentKeyPress}
          />
        </div>
        <div className='applicant-modal__card__comment-buttons'>
          <Button
            className='applicant-modal__card__comment-button'
            aria-label='Add attachment'
            id='attachment-button'
            onClick={this.handleAttachmentButtonClick}
          >
            <AttachFile id='attachment-icon' />
          </Button>
          <Button
            className='applicant-modal__card__comment-button'
            aria-label='Send comment'
            onClick={this.handleSubmit}
          >
            Send
          </Button>
        </div>
        <div className='applicant-modal__card__attachment-list'>
          {attachments.map((attachment, index) =>
            <Chip
              key={index}
              className='applicant-modal__card__attachment-chip'
              label={attachment.name}
              onDelete={() => this.handleAttachmentDelete(index)}
            />
          )}
        </div>
      </Dropzone>
    )
  }
}

ApplicantModalDropzone.PropTypes = {
  addComment: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  addComment
}

export default connect(
  null,
  mapDispatchToProps
)(ApplicantModalDropzone)