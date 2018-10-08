import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions/actions'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { Redirect } from 'react-router-dom'
import { LinkButton } from '../Buttons'

export class JobPosting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jobPosting: this.props.jobPosting,
      applicantName: '',
      applicantEmail: '',
      fireRedirect: false
    }
  }

  componentDidMount() {
    const postingId = window.location.href.split('/')[4]
    this.props.fetchJobPosting(postingId)
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { applicantName, applicantEmail } = this.state
    this.props.sendApplication(applicantName, applicantEmail)

    this.setState({
      applicantName: '',
      applicantEmail: ''
    })
  }

  handleJobPostingClick = () => {
    this.setState({
      fireRedirect: true
    })
  }

  render() {
    const { applicantName, applicantEmail } = this.state
    const { errorMessage, jobPosting, loggedIn } = this.props

    if (this.state.fireRedirect) {
      return <Redirect to={`/jobposting/${this.props.jobPosting.id}/applicants`} />
    }

    return (
      <div className='job-posting'>
        <h2 className='job-posting__title'>{jobPosting.title}</h2>
        {loggedIn &&
            <Button
              onClick={this.handleJobPostingClick}
            >
            Show applicants
            </Button>
        }
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        <p className='job-posting__content'>{jobPosting.content}</p>
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

JobPosting.propTypes = {
  errorMessage: PropTypes.string,
  jobPosting: PropTypes.object.isRequired,
  loggedIn: PropTypes.object
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