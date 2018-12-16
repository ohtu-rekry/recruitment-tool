import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import Typography from '@material-ui/core/Typography'

import TimespanPicker from './TimespanPicker'
import JobPostingStages from './JobPostingStages'
import * as actions from '../../redux/actions/actions'
import * as selectors from '../../redux/selectors/selectors'

export class JobPostingForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      mode: props.mode,
      id: null,
      title: '',
      content: '',
      error: false,
      fireRedirect: false
    }
  }

  componentDidMount() {
    if (this.state.mode === 'edit') {
      const jobPostingId = this.props.match.params.id ? this.props.match.params.id : window.location.href.split('/')[4]
      this.setState({ id: jobPostingId })
      this.props.fetchJobPostingWithStages(jobPostingId)
    }

    if (this.props.location.state && this.props.location.state.mode === 'copy') {

      if (this.props.jobPosting.title) {
        const jobPosting = this.props.jobPosting
        this.setState({
          title: jobPosting.title,
          content: jobPosting.content
        })
      } else {
        //if the copied job posting for some reason is not in store yet
        this.setState({
          mode: 'copy'
        })
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.state.mode === 'edit' && this.props.jobPosting.id && this.props.jobPosting !== prevProps.jobPosting) {
      const jobPosting = this.props.jobPosting
      this.setState({
        title: jobPosting.title,
        content: jobPosting.content
      })
    }

    if (this.state.mode === 'copy' && this.props.jobPosting.title) {
      const jobPosting = this.props.jobPosting
      this.setState({
        title: jobPosting.title,
        content: jobPosting.content,
        mode: 'create'
      })
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
    const stages = this.props.jobPostingStages
    const showFrom = this.props.showFrom
    const showTo = this.props.showTo

    if (!title.trim() || !content.trim()) {
      this.setState({
        error: true
      })
      return
    }

    this.props.submitJobPosting(title, content, stages, showFrom, showTo, mode, id)
  }


  render() {
    const { title, content, error, mode } = this.state
    const helperText = error ? 'Required field cannot be empty' : '* is a required field'
    const stageHelperText = mode === 'edit' ? 'Default stages and stages with applicants cannot be removed' : 'Default stages cannot be removed'
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
            <TimespanPicker isEditMode={this.state.mode === 'edit'} />
          </form>
          <div className='job-posting-form__form'>
            <JobPostingStages helperText={stageHelperText} />
          </div>
          <div className='job-posting-form-submit-button'>
            <Button id='button-submit'
              color='inherit'
              type='submit'
              form='job-posting-form'
              variant='contained'
            >{buttonText}</Button>
          </div>
        </Paper>
        <div>
          {fireRedirect && (
            <Redirect to='/positions' />
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
  showFrom: PropTypes.string,
  showTo: PropTypes.string,
  jobPosting: PropTypes.object,
  submitJobPosting: PropTypes.func.isRequired,
  fetchJobPostingWithStages: PropTypes.func.isRequired,
  emptyJobPosting: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  creationRequestStatus: selectors.getCreationRequestStatus(state),
  loggedIn: selectors.getUser(state),
  jobPostingStages: selectors.getJobPostingStages(state),
  showFrom: selectors.getShowFrom(state),
  showTo: selectors.getShowTo(state),
  jobPosting: selectors.getJobPosting(state)
})

const mapDispatchToProps = {
  ...actions
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPostingForm))
