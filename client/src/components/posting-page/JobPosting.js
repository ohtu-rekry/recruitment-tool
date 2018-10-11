import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions/actions'
import PropTypes from 'prop-types'
import { LinkButton } from '../Buttons'
import EmailValidator from 'email-validator'
import ReactMarkdown from 'react-markdown'

export class JobPosting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jobPosting: this.props.jobPosting,
      applicantName: '',
      applicantEmail: '',
      inputError: null
    }
  }

  componentDidMount() {
    const jobPostingId = window.location.href.split('/')[4]
    this.props.fetchJobPosting(jobPostingId)
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
      inputError: null
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { applicantName, applicantEmail } = this.state

    if (!EmailValidator.validate(applicantEmail)) {
      this.setState({ inputError: 'Please enter a valid email' })
      return
    }

    const jobPostingId = window.location.href.split('/')[4]
    this.props.sendApplication(applicantName, applicantEmail, jobPostingId)

    this.setState({
      applicantName: '',
      applicantEmail: ''
    })
  }

  render() {
    const { applicantName, applicantEmail, inputError } = this.state
    const { errorMessage, jobPosting, loggedIn } = this.props

    return (
      <div className='job-posting'>
        <h2 className='job-posting__title'>{jobPosting.title}</h2>
        {loggedIn &&
          <LinkButton
            link={`/posting/${jobPosting.id}/applicants`}
            text='Show applicants'
          />}

        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        <p className='job-posting__content'>
          <ReactMarkdown source={jobPosting.content} />
        </p>
        <form className='job-posting__form' onSubmit={this.handleSubmit}>
          <div className='job-posting__form-container'>
            <input
              required
              className='job-posting__form-input'
              id='applicantName'
              placeholder='Full name'
              value={applicantName}
              onChange={this.handleChange}
            ></input>
            <input
              required
              className='job-posting__form-input'
              id='applicantEmail'
              placeholder='Email'
              value={applicantEmail}
              onChange={this.handleChange}
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
  loggedIn: PropTypes.object
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