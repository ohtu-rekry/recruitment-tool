import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions/actions'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import EmailValidator from 'email-validator'
import ReactMarkdown from 'react-markdown'

export class JobPosting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      applicantName: '',
      applicantEmail: '',
      inputError: null,
      applicationSuccess: false
    }
  }

  componentDidMount() {
    const jobPostingId = window.location.href.split('/')[4]
    this.props.fetchJobPosting(jobPostingId)
  }

  componentWillUnmount() {
    this.props.emptyJobPosting()
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
      inputError: null,
      applicationSuccess: false
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { applicantName, applicantEmail } = this.state

    const notOnlyWhitespaceRegex = /\S/
    if (!notOnlyWhitespaceRegex.test(applicantName)) {
      this.setState({ inputError: 'Please enter a name' })
      return
    }

    if (!EmailValidator.validate(applicantEmail)) {
      this.setState({ inputError: 'Please enter a valid email' })
      return
    }

    const jobPostingId = window.location.href.split('/')[4]
    this.props.sendApplication(applicantName, applicantEmail, jobPostingId)

    this.setState({
      applicantName: '',
      applicantEmail: '',
      applicationSuccess: 'Application was sent successfully!'
    })
  }

  render() {
    const { applicantName, applicantEmail, inputError, applicationSuccess } = this.state
    const { errorMessage, jobPosting, loggedIn } = this.props

    return (
      <div className='job-posting'>
        <h2 className='job-posting__title'>{jobPosting.title}</h2>
        {loggedIn &&
          <Link
            to={`/jobposting/${jobPosting.id}/applicants`}
            className='job-posting__link'
          >
            Show applicants
          </Link>
        }
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        {applicationSuccess && <SuccessMessage message={applicationSuccess} />}
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
            <button
              className='job-posting__submit-button'
              type='submit'>
              Send
            </button>
          </div>
          {inputError && <InputErrorMessage errorMessage={inputError}/>}
        </form>
      </div>
    )
  }
}

const ErrorMessage = ({ errorMessage }) => {
  return (
    <div className='job-posting__error-message'>
      {errorMessage}
    </div>
  )
}

const SuccessMessage = ({ message }) => {
  return (
    <div className='job-posting__success-message'>
      {message}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPosting)