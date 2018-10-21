import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, Button, Chip } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import PropTypes from 'prop-types'

import { addNewStageForJobPosting, removeStageInJobPosting, clearCopiedStages } from '../../redux/actions/actions'

export class JobPostingStages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newStageName: ''
    }
  }

  componentDidMount() {
    console.log(this.props.stages)
    if (this.props.stages !== null) {
      this.addCopiedStagesToNewJobPosting()
    }
  }

  async addCopiedStagesToNewJobPosting() {
    await this.props.stages.forEach((stage) => {
      if (stage.stageName !== 'Applied' && stage.stageName !== 'Rejected' && stage.stageName !== 'Accepted') {
        this.props.addNewStageForJobPosting({ stageName: stage.stageName, canRemove: true })
      }
    })
    await this.props.clearCopiedStages()
  }

  addNewStage = () => {
    if (this.state.newStageName.length === 0 || !this.state.newStageName.trim() || this.state.newStageName.length > 255) {
      return;
    }

    this.props.addNewStageForJobPosting({ stageName: this.state.newStageName, canRemove: true })
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
      newStageName: e.target.value
    })
  }

  handleStageDelete = (stage) => {
    this.props.removeStageInJobPosting(stage)
  }

  render() {
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
  jobPostingStages: PropTypes.array
}

const mapStateToProps = (state) => ({
  jobPostingStages: state.jobPostingReducer.jobPostingStages,
  stages: state.jobPostingReducer.copiedStages
})

const mapDispatchToProps = {
  addNewStageForJobPosting,
  removeStageInJobPosting,
  clearCopiedStages
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPostingStages)
