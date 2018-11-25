import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions/actions'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import { Button, Chip } from '@material-ui/core/'
import EmailValidator from 'email-validator'
import ReactMarkdown from 'react-markdown'
import Dropzone from 'react-dropzone'


export class JobPosting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      applicantName: '',
      applicantEmail: '',
      inputError: null,
      attachments: []
    }
  }

  componentDidMount() {
    const jobPostingId = window.location.href.split('/')[4]
    this.props.fetchJobPosting(jobPostingId, this.props.loggedIn)
  }

  componentWillUnmount() {
    this.props.emptyJobPosting()
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
      inputError: null
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { applicantName, applicantEmail, attachments } = this.state

    if (!applicantName.trim()) {
      this.setState({ inputError: 'Please enter a name' })
      return
    }

    if (!EmailValidator.validate(applicantEmail)) {
      this.setState({ inputError: 'Please enter a valid email' })
      return
    }

    const jobPostingId = window.location.href.split('/')[4]
    this.props.sendApplication(applicantName, applicantEmail, jobPostingId, attachments)

    this.setState({
      applicantName: '',
      applicantEmail: ''
    })

    this.props.history.push('/success')
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

  render() {
    const { applicantName, applicantEmail, inputError, attachments } = this.state
    const { errorMessage, jobPosting, loggedIn } = this.props

    return (
      <div className='job-posting'>
        {loggedIn &&
          <AdminButtons id={jobPosting.id} />
        }
        <h2 className='job-posting__title'>{jobPosting.title}</h2>
        {jobPosting.isHidden && <HiddenNotification jobPosting={jobPosting} />}
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
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
                  <br/>
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
      </div>
    )
  }
}

const AdminButtons = ({ id }) => {
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
        component={LinkToEditPage}>
        Edit
      </Button>
    </div>
  )
}

const ErrorMessage = ({ errorMessage }) => {
  return (
    <div className='job-posting__error-message'>
      {errorMessage}
    </div>
  )
}

const HiddenNotification = ({ jobPosting }) => {
  return (
    <div className='job-posting__hidden-notification'>
      Visible from {jobPosting.showFrom} to {jobPosting.showTo}
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
  fetchJobPosting: PropTypes.func.isRequired
}

InputErrorMessage.propTypes = {
  errorMessage: PropTypes.string
}

const mapStateToProps = (state) => ({
  errorMessage: state.postingReducer.errorMessage,
  jobPosting: state.postingReducer.jobPosting,
  loggedIn: state.loginReducer.loggedIn
})

const mapDispatchToProps = {
  ...actions
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPosting))