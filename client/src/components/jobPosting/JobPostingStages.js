import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, Button, Chip } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import PropTypes from 'prop-types'

import { addNewStageForJobPosting, removeStageInJobPosting, clearCopiedStages, clearStages, renamePostingStage } from '../../redux/actions/actions'

export class JobPostingStages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newStageName: '',
      helperText: '',
      error: false,
      stageUnderEdit: ''
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
      if (stage.stageName !== 'Applied' && stage.stageName !== 'Rejected' && stage.stageName !== 'Accepted') {
        this.props.addNewStageForJobPosting({ stageName: stage.stageName, canRemove: true })
      }
    })
    await this.props.clearCopiedStages()
  }

  addNewStage = () => {
    if (verifyStageName(this.state.newStageName)) {
      this.setState({ error: true })
      return
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
      newStageName: e.target.value,
      error: false
    })
  }

  handleStageClick = (jobPostingStage) => {
    document.getElementById(jobPostingStage.stageName).style.display = 'block'
  }

  handleStageRenameChange = (e) => {
    this.setState({
      stageUnderEdit: e.target.value
    })
  }

  handleStageRename = (e, jobPostingStage) => {
    e.preventDefault()
    if (verifyStageName(this.state.stageUnderEdit)) {
      this.props.renamePostingStage(jobPostingStage, this.state.stageUnderEdit)
      document.getElementById(jobPostingStage.stageName).style.display = 'none'
      this.setState({
        stageUnderEdit: ''
      })
    } else {
      this.setState({
        error: true
      })
    }
  }

  handleStageDelete = (stage) => {
    this.props.removeStageInJobPosting(stage)
  }

  render() {
    const error = this.state.error
    const helperText = error ? 'Invalid stage name. Stage was not added' : this.state.helperText

    const classNames = 'job-posting-form-stages'
    return (
      <div className={classNames}>
        <h3>Define stages for this job posting</h3>
        <div className={classNames + '__new-stage-name'}>
          <TextField
            fullWidth
            id="stageName"
            type="text"
            value={this.state.newStageName}
            label={`Add ${this.props.jobPostingStages.length - 1}. stage (optional)`}
            onChange={this.handleNameChange}
            onKeyPress={this.handleKeyPress}
            variant="outlined"
            helperText={helperText}
            error={error}
          />
        </div>
        <div className={classNames + '__new-stage-add-button'}>
          <Button mini variant="fab" color="inherit" aria-label="Add" onClick={() => this.addNewStage()}>
            <AddIcon />
          </Button>
        </div>
        <div className={classNames + '__stage-list'}>
          {this.props.jobPostingStages.map((jobPostingStage, index) => (
            <div key={index} className={classNames + '__single-stage'}>
              {jobPostingStage.canRemove === true &&
                <div className={classNames + '__single-stage-editable'}>
                  <Chip
                    label={index + 1 + '. ' + jobPostingStage.stageName}
                    onClick={() => this.handleStageClick(jobPostingStage)}
                    onDelete={() => this.handleStageDelete(jobPostingStage)} />
                  <form id={jobPostingStage.stageName} onChange={this.handleStageRenameChange} onSubmit={(e) => this.handleStageRename(e, jobPostingStage)} className={classNames + '__stage-name-edit'}>
                    <input className={classNames + '__stage-name-edit__input'} type="text"></input>
                  </form>
                </div>
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

const verifyStageName = (stageName) => {
  if (!stageName.trim() || stageName.length === 0 || stageName.length > 255
    || stageName === 'Applied' || stageName === 'Rejected' || stageName === 'Accepted') {
    return false
  }
  return true
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
  clearCopiedStages,
  clearStages,
  renamePostingStage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPostingStages)
