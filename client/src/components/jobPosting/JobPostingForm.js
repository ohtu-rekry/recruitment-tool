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
import { addJobPosting } from '../../redux/actions/actions'

export class JobPostingForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      title: '',
      content: '',
      error: false,
      fireRedirect: false
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
      error: false
    })
  }

  handleSubmit = async (event) => {

    const { title, content } = this.state
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
    await this.props.addJobPosting(title, content, recruiter, stages, showFrom, showTo)
    this.setState({ fireRedirect: true })
  }

  render() {
    const { title, content, error } = this.state
    const helperText = error ? 'Required field cannot be empty' : '* is a required field'
    const { creationRequestStatus, loggedIn } = this.props

    let snackbarId
    if (creationRequestStatus) {
      snackbarId = 'snackbar-' + creationRequestStatus.type
    }

    return (
      <div>
        {creationRequestStatus
          && <Snackbar
            id={snackbarId}
            open={creationRequestStatus !== null}
            message={<span>{creationRequestStatus.message}</span>} />
        }

        <Paper className='job-posting-form'>
          <Typography className='job-posting-form__headline' variant='display1' color='inherit' gutterBottom>Add new job posting</Typography>
          <form className='job-posting-form__form' id='job-posting-form' onSubmit={this.handleSubmit}>
            <TextField
              required
              fullWidth
              id="title"
              type="text"
              value={title}
              label="Title"
              onChange={this.handleChange}
              variant="outlined"
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
              variant="outlined"
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
            >Create job posting</Button>
          </div>
        </Paper>
        <div>
          {this.state.fireRedirect && (
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
  addJobPosting: PropTypes.func.isRequired,
  showFrom: PropTypes.object,
  showTo: PropTypes.object
}

const mapStateToProps = (state) => ({
  creationRequestStatus: state.jobPostingReducer.creationRequestStatus,
  loggedIn: state.loginReducer.loggedIn,
  jobPostingStages: state.jobPostingReducer.jobPostingStages,
  showFrom: state.jobPostingReducer.showFrom,
  showTo: state.jobPostingReducer.showTo
})

const mapDispatchToProps = {
  addJobPosting
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPostingForm)
