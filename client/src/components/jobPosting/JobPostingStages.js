import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, Button, Chip } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import PropTypes from 'prop-types'

import { addNewStageForJobPosting, removeStageInJobPosting, clearCopiedStages, clearStages } from '../../redux/actions/actions'

export class JobPostingStages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newStageName: '',
      helperText: props.helperText,
      error: false
    }
  }

  componentDidMount() {
    if (this.props.stages !== null) {
      this.addCopiedStagesToNewJobPosting()
    }
  }

  componentWillUnmount() {
    this.props.clearStages()
  }

  async addCopiedStagesToNewJobPosting() {
    await this.props.stages.forEach((stage) => {
      if (!this.props.defaultStageNames.includes(stage.stageName)) {
        this.props.addNewStageForJobPosting({ stageName: stage.stageName, canRemove: true })
      }
    })
    await this.props.clearCopiedStages()
  }

  addNewStage = () => {
    const newName = this.state.newStageName

    if (newName.length === 0
      || !newName.trim()
      || newName.length > 255
      || this.props.defaultStageNames.map(name =>
        name.toLowerCase()).includes(newName.trim().toLowerCase())
    ) {
      this.setState({ error: true })
      return
    }

    this.props.addNewStageForJobPosting({ stageName: newName, canRemove: true })
    this.setState({
      newStageName: ''
    })
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.addNewStage()
    }
  }

  handleNameChange = (e) => {
    this.setState({
      newStageName: e.target.value,
      error: false
    })
  }

  handleStageDelete = (stage) => {
    this.props.removeStageInJobPosting(stage)
  }

  render() {
    const error = this.state.error
    const helperText = error ? 'Invalid stage name. Stage was not added' : this.state.helperText

    return (
      <div className='job-posting-form-stages' onKeyPress={this.handleKeyPress}>
        <h3>Define stages for this job posting</h3>
        <div className='job-posting-form-stages__new-stage-name'>
          <TextField
            fullWidth
            id="stageName"
            type="text"
            value={this.state.newStageName}
            label={`Add ${this.props.jobPostingStages.length - 1}. stage (optional)`}
            onChange={this.handleNameChange}
            variant="outlined"
            helperText={helperText}
            error={error}
          />
        </div>
        <div className='job-posting-form-stages__new-stage-add-button'>
          <Button mini variant="fab" color="inherit" aria-label="Add" onClick={() => this.addNewStage()}>
            <AddIcon />
          </Button>
        </div>
        <div className='job-posting-form-stages__stage-list'>
          {this.props.jobPostingStages.map((jobPostingStage, index) => (
            <div key={index} className='job-posting-form-stages__single-stage'>
              {jobPostingStage.canRemove === true &&
                <Chip
                  label={index + 1 + '. ' + jobPostingStage.stageName}
                  onDelete={() => this.handleStageDelete(jobPostingStage)}
                />
              }
              {jobPostingStage.canRemove === false &&
                <Chip
                  label={index + 1 + '. ' + jobPostingStage.stageName}
                />
              }
            </div>
          ))}
        </div>
      </div>
    )
  }
}

JobPostingStages.propTypes = {
  jobPostingStages: PropTypes.array,
  defaultStageNames: PropTypes.array
}

const mapStateToProps = (state) => ({
  jobPostingStages: state.jobPostingReducer.jobPostingStages,
  stages: state.jobPostingReducer.copiedStages,
  defaultStageNames: state.jobPostingReducer.defaultStageNames
})

const mapDispatchToProps = {
  addNewStageForJobPosting,
  removeStageInJobPosting,
  clearCopiedStages,
  clearStages
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPostingStages)
