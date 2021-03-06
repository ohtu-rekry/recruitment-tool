import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import EmailValidator from 'email-validator'
import ReactMarkdown from 'react-markdown'
import Dropzone from 'react-dropzone'

import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import Snackbar from '@material-ui/core/Snackbar'

import * as actions from '../../redux/actions/actions'
import * as selectors from '../../redux/selectors/selectors'
import { readFile } from '../../utils/readFile'


export class JobPosting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      applicantName: '',
      applicantEmail: '',
      inputError: null,
      attachments: [],
      showError: false
    }
  }

  componentDidMount() {
    const jobPostingId = this.props.match.params.id ? this.props.match.params.id : window.location.href.split('/')[4]
    this.props.fetchJobPosting(jobPostingId, this.props.loggedIn)
  }

  componentDidUpdate(pProps) {
    const { errorMessage, applicationSuccessful } = this.props
    if (pProps.errorMessage === null && errorMessage !== null) {
      this.setState({ showError: true })
    }

    if (applicationSuccessful) {
      this.setState({
        applicantName: '',
        applicantEmail: ''
      })

      this.props.history.push('/success')
    }
  }

  componentWillUnmount() {
    this.props.emptyJobPosting()
    this.props.clearErrorMessage()
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
      inputError: null
    })
  }


  handleClose = () => {
    this.setState({ showError: false })
    this.props.clearErrorMessage()
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    const { applicantName, applicantEmail, attachments } = this.state
    const { sendApplication } = this.props

    let promiseAttachments = []
    let attachmentObjectArray = []

    if (!applicantName.trim()) {
      this.setState({ inputError: 'Please enter a name' })
      return
    }

    if (!EmailValidator.validate(applicantEmail)) {
      this.setState({ inputError: 'Please enter a valid email' })
      return
    }

    const jobPostingId = this.props.match.params.id ? this.props.match.params.id : window.location.href.split('/')[4]
    if (attachments.length > 0) {
      promiseAttachments = attachments.map((attachment) => {
        return readFile(attachment)
      })
      let base64typeAttachments = await Promise.all(promiseAttachments)

      attachmentObjectArray = attachments.map((attachment, index) => {
        return {
          fileName: attachment.name,
          base64: base64typeAttachments[index]
        }
      })
    }


    sendApplication(applicantName, applicantEmail, jobPostingId, attachmentObjectArray)
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

  handleClickEdit = () => {
    const { setTimeSpan, jobPosting } = this.props
    setTimeSpan(jobPosting.showFrom, jobPosting.showTo)
  }

  render() {
    const { applicantName, applicantEmail, inputError, attachments, showError } = this.state
    const { errorMessage, jobPosting, loggedIn } = this.props

    return (
      <div className='job-posting'>
        {loggedIn &&
          <AdminButtons
            id={jobPosting.id}
            handleClickEdit={this.handleClickEdit}
          />
        }
        <h2 className='job-posting__title'>{jobPosting.title}</h2>
        {jobPosting.isHidden &&
          <HiddenNotification showFrom={jobPosting.showFrom} showTo={jobPosting.showTo} />
        }
        <div className='job-posting__content'>
          <ReactMarkdown source={jobPosting.content} />
        </div>
        <form className='job-posting__form' onSubmit={this.handleSubmit}>
          <div className='job-posting__form-container'>
            <input
              required
              className='job-posting__form-input'
              id='applicantName'
              placeholder='Full name'
              value={applicantName}
              onChange={this.handleChange}
              maxLength='255'
            ></input>
            <input
              required
              className='job-posting__form-input'
              id='applicantEmail'
              placeholder='Email'
              value={applicantEmail}
              onChange={this.handleChange}
              maxLength='255'
            ></input>
          </div>
          <div>
            <Dropzone
              onDropAccepted={this.handleDropAttachment}
              onDropRejected={this.handleAttachmentReject}
              accept='.pdf, .zip'
              className={'job-posting__attachment-dropzone'}
            >
              {attachments.length === 0 &&
                <div>
                  Drop attachments here, or click to select files to upload
                  <br />
                  Accepted file types are .zip and .pdf
                </div>}
              <div>
                <div className='job-posting__attachment-dropzone__list'>
                  {attachments.map((attachment, index) =>
                    <Chip
                      key={index}
                      className='job-posting__attachment-dropzone__attachment'
                      label={attachment.name}
                      onDelete={() => this.handleAttachmentDelete(index)}
                    />
                  )}
                </div>
              </div>
            </Dropzone>
            <button
              className='job-posting__submit-button'
              type='submit'>
              Send
            </button>
            {inputError && <InputErrorMessage errorMessage={inputError} />}
          </div>
        </form>
        {errorMessage &&
          <Snackbar
            onClose={this.handleClose}
            open={showError}
            message={<span>{errorMessage}</span>}
          />
        }
      </div>
    )
  }
}

const AdminButtons = ({ id, handleClickEdit }) => {
  const LinkToApplicants = props => <Link to={`/position/${id}/applicants`} {...props} />
  const LinkToEditPage = props => <Link to={`/position/${id}/edit`} {...props} />

  return (
    <div>
      <Button
        className='job-posting__link'
        component={LinkToApplicants}>
        See applicants
      </Button>
      <Button
        className='job-posting__link'
        component={LinkToEditPage}
        onClick={handleClickEdit}>
        Edit
      </Button>
    </div>
  )
}

const HiddenNotification = ({ showFrom, showTo }) => {
  let visibilityMessage = 'Permanently hidden'

  if (showFrom && !showTo) {

    visibilityMessage = `Visible from ${showFrom}`

  } else if (showFrom && showTo) {

    visibilityMessage = `Visible from ${showFrom} to ${showTo}`

  }

  return (
    <div className='job-posting__hidden-notification'>
      {visibilityMessage}
    </div>
  )
}

const InputErrorMessage = ({ errorMessage }) => {
  return (
    <div className='job-posting__form-input-error'>
      {errorMessage}
    </div>
  )
}

JobPosting.propTypes = {
  errorMessage: PropTypes.string,
  jobPosting: PropTypes.object.isRequired,
  loggedIn: PropTypes.object,
  emptyJobPosting: PropTypes.func.isRequired,
  fetchJobPosting: PropTypes.func.isRequired,
  setTimeSpan: PropTypes.func.isRequired
}

InputErrorMessage.propTypes = {
  errorMessage: PropTypes.string
}

HiddenNotification.propTypes = {
  showFrom: PropTypes.string,
  showTo: PropTypes.string
}

const mapStateToProps = (state) => ({
  errorMessage: selectors.getErrorMessage(state),
  jobPosting: selectors.getJobPosting(state),
  loggedIn: selectors.getUser(state),
  applicationSuccessful: selectors.getApplicationStatus(state)
})

const mapDispatchToProps = {
  ...actions
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPosting))
