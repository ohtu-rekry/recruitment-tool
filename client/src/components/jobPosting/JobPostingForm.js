import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import Typography from '@material-ui/core/Typography'

import TimespanPicker from './TimespanPicker'
import JobPostingStages from './JobPostingStages'
import { submitJobPosting, fetchJobPostingWithStages, emptyJobPosting, setStages } from '../../redux/actions/actions'

export class JobPostingForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      mode: props.mode,
      id: null,
      title: '',
      content: '',
      error: false
    }
  }

  componentDidMount() {
    if (this.state.mode === 'edit') {
      const jobPostingId = window.location.href.split('/')[4]
      this.setState({ id: jobPostingId })
      this.props.fetchJobPostingWithStages(jobPostingId)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.state.mode === 'edit' && this.props.jobPostingToEdit.id && this.props.jobPostingToEdit !== prevProps.jobPostingToEdit) {
      const jobPosting = this.props.jobPostingToEdit
      this.setState({
        title: jobPosting.title,
        content: jobPosting.content
      })
      const stages = jobPosting.postingStages
      this.props.setStages(stages)
    }
  }

  componentWillUnmount() {
    this.props.emptyJobPosting()
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
      error: false
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const { title, content, mode, id } = this.state
    const recruiter = this.props.loggedIn
    const stages = this.props.jobPostingStages
    const showFrom = this.props.showFrom
    const showTo = this.props.showTo

    const notOnlyWhitespaceRegex = /\S/
    if (!(notOnlyWhitespaceRegex.test(title) && notOnlyWhitespaceRegex.test(content))) {
      this.setState({
        error: true
      })
      return
    }

    this.props.submitJobPosting(title, content, recruiter, stages, showFrom, showTo, mode, id)
  }

  render() {
    const { title, content, error, mode } = this.state
    const helperText = error ? 'Required field cannot be empty' : '* is a required field'
    const headline = mode === 'edit' ? 'Edit job posting' : 'Add new job posting'
    const buttonText = mode === 'edit' ? 'Update job posting' : 'Create job posting'
    const { creationRequestStatus, loggedIn } = this.props

    let fireRedirect = false
    if (creationRequestStatus && creationRequestStatus.type === 'success') fireRedirect = true

    let snackbarId
    if (creationRequestStatus) snackbarId = 'snackbar-' + creationRequestStatus.type

    return (
      <div>
        {creationRequestStatus
          && <Snackbar
            id={snackbarId}
            open={creationRequestStatus !== null}
            message={<span>{creationRequestStatus.message}</span>} />
        }

        <Paper className='job-posting-form'>
          <Typography className='job-posting-form__headline' variant='display1' color='inherit' gutterBottom>{headline}</Typography>
          <form className='job-posting-form__form' id='job-posting-form' onSubmit={this.handleSubmit}>
            <TextField
              required
              fullWidth
              id="title"
              type="text"
              value={title || ''}
              label="Title"
              onChange={this.handleChange}
              error={error}
              inputProps={{ maxLength: 255 }}
              disabled={!loggedIn}
            />
            <br />
            <TextField
              multiline
              rows="10"
              helperText={helperText}
              required
              fullWidth
              id="content"
              type="text"
              value={content}
              label="Content (Markdown syntax supported)"
              onChange={this.handleChange}
              error={error}
              disabled={!loggedIn}
            />
            <br />
            <TimespanPicker/>
          </form>
          <div className='job-posting-form__form'>
            <JobPostingStages />
          </div>
          <div className='job-posting-form-submit-button'>
            <Button id='button-submit'
              color='inherit'
              type='submit'
              form='job-posting-form'
              variant='contained'
              disabled={!loggedIn}
            >{buttonText}</Button>
          </div>
        </Paper>
        <div>
          {fireRedirect && (
            <Redirect to='/' />
          )}
        </div>
      </div >
    )
  }
}


JobPostingForm.propTypes = {
  creationRequestStatus: PropTypes.object,
  loggedIn: PropTypes.object,
  jobPostingStages: PropTypes.array,
  showFrom: PropTypes.object,
  showTo: PropTypes.object,
  jobPostingToEdit: PropTypes.object,
  submitJobPosting: PropTypes.func.isRequired,
  fetchJobPostingWithStages: PropTypes.func.isRequired,
  emptyJobPosting: PropTypes.func.isRequired,
  setStages: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  creationRequestStatus: state.jobPostingReducer.creationRequestStatus,
  loggedIn: state.loginReducer.loggedIn,
  jobPostingStages: state.jobPostingReducer.jobPostingStages,
  showFrom: state.jobPostingReducer.showFrom,
  showTo: state.jobPostingReducer.showTo,
  jobPostingToEdit: state.postingReducer.jobPosting
})

const mapDispatchToProps = {
  submitJobPosting,
  fetchJobPostingWithStages,
  emptyJobPosting,
  setStages
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPostingForm)
