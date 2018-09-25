import React, { Component } from 'react'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import { addJobPosting }  from '../../redux/actions/actions'

export class JobPostingForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      title : '',
      content : ''
    }
  }

  handleChange = ( event ) => {
    this.setState({
      [event.target.id] : event.target.value
    })
  }

  handleSubmit = ( event ) => {
    event.preventDefault()
    const { title, content } = this.state
    const recruiter = this.props.loggedIn

    const notOnlyWhitespaceRegex = /\S/
    if(!(notOnlyWhitespaceRegex.test(title) && notOnlyWhitespaceRegex.test(content))) {
      //inform user
      return
    }

    this.props.addJobPosting(title, content, recruiter)
  }

  //textfields variant="outlined" in 3.1.0(?)
  //helperText="* required" (preferably remove *)
  render() {
    const { title, content } = this.state
    const loggedIn = this.props.loggedIn
    const creationRequestStatus = this.props.creationRequestStatus
    let snackbarId
    if(creationRequestStatus) {
      snackbarId = 'snackbar-' + creationRequestStatus.type
    }

    return (
      !loggedIn
        ? <div>
          <a href="/admin/login">You need to log in first</a>
        </div>
        : <div>
          {creationRequestStatus
            && <Snackbar
              id={snackbarId}
              open={creationRequestStatus !== null}
              message={<span>{creationRequestStatus.message}</span>} />
          }

          <Paper>
            <form id='job-posting-form' onSubmit={this.handleSubmit} >
              <TextField
                required
                fullWidth
                id="title"
                type="text"
                value={title}
                label="Title"
                onChange={this.handleChange}
                variant="outlined"
              />
              <br />
              <TextField
                multiline
                rows="10"
                required
                fullWidth
                id="content"
                type="text"
                value={content}
                label="Content"
                onChange={this.handleChange}
                variant="outlined"
              />
              <br />
              <Button id='button-submit'
                type="submit"
                variant="contained"
              >Create job posting</Button>
            </form>
          </Paper>
        </div>
    )
  }
}

const mapStateToProps = (state) => ({
  creationRequestStatus : state.jobPostingReducer.creationRequestStatus,
  loggedIn : state.loginReducer.loggedIn
})

const mapDispatchToProps = {
  addJobPosting
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPostingForm)