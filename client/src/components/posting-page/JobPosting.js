import React ,{ Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions/actions'
import PropTypes from 'prop-types'

export class JobPosting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jobPosting: this.props.jobPosting,
      applicantName: '',
      applicantEmail: '',
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

  render() {
    const { applicantName, applicantEmail } = this.state
    const { errorMessage, jobPosting } = this.props

    return (
      <div className='posting'>
        <h2 className='posting__title'>{jobPosting.title}</h2>
        {errorMessage ? <ErrorMessage errorMessage={ errorMessage }/> : null}
        <p className='posting__description'>{jobPosting.content}</p>
        <form className='posting__form' onSubmit={this.handleSubmit}>
          <div className='posting__form-container'>
            <input
              required
              className='posting__form-input'
              id='applicantName'
              placeholder='Full name'
              value={applicantName}
              onChange={this.handleChange}
            ></input>
            <input
              required
              className='posting__form-input'
              id='applicantEmail'
              placeholder='Email'
              value={applicantEmail}
              onChange={this.handleChange}
            ></input>
            <button
              className='posting__submit-button'
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
    <div className='posting__error-message'>
      {errorMessage}
    </div>
  )
}

JobPosting.propTypes = {
  errorMessage: PropTypes.string,
  jobPosting: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  errorMessage: state.postingReducer.errorMessage,
  jobPosting: state.postingReducer.jobPosting
})

const mapDispatchToProps = {
  ...actions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPosting)