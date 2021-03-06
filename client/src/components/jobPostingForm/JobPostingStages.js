import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import PropTypes from 'prop-types'
import JobPostingStage from './JobPostingStage'

import * as actions from '../../redux/actions/actions'
import * as selectors from '../../redux/selectors/selectors'

export class JobPostingStages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStages: [],
      newStageName: ''
    }
  }

  componentDidMount() {
    const stageNames = this.props.jobPostingStages.map((stage) => stage.stageName)
    this.setState({
      currentStages: stageNames
    })
  }

  componentWillUnmount() {
    this.props.clearStages()
  }

  addNewStage = () => {
    if (!this.verifyStageName(this.state.newStageName)) {
      this.props.setStageError({ errorMessage: 'Invalid stage name. Stage was not added' })
      return
    }

    this.props.addNewStageForJobPosting({ stageName: this.state.newStageName, canRemove: true })
    this.props.setStageError({ errorMessage: '' })
    const newStageName = this.state.newStageName
    this.setState({
      currentStages: [...this.state.currentStages, newStageName],
      newStageName: ''
    })
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.addNewStage()
    }
  }

  handleNameChange = (e) => {
    if (this.props.stageError) {
      this.props.setStageError({ errorMessage: '' })
    }
    this.setState({
      newStageName: e.target.value,
    })
  }

  verifyStageName = (stageName) => {
    const currentStageNames = this.props.jobPostingStages.map((stage) => stage.stageName)
    if (!stageName.trim()
      || stageName.length > 255
      || currentStageNames.includes(stageName)) {
      return false
    }
    return true
  }

  render() {
    const error = this.props.stageError ? this.props.stageError : ''

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
            helperText={error}
            error={!!error}
          />
        </div>
        <div className={classNames + '__new-stage-add-button'}>
          <Button mini variant="fab" color="inherit" aria-label="Add" onClick={() => this.addNewStage()}>
            <AddIcon />
          </Button>
        </div>
        <div className={classNames + '__stage-list'}>
          {this.props.jobPostingStages.map((jobPostingStage, index) => (
            <div key={jobPostingStage.stageName} className={classNames + '__single-stage'}>
              <JobPostingStage jobPostingStage={jobPostingStage} index={index} className={classNames} />
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
  jobPostingStages: selectors.getJobPostingStages(state),
  defaultStageNames: selectors.getDefaultStageNames(state),
  stageError: selectors.getStageError(state)
})

const mapDispatchToProps = {
  ...actions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPostingStages)
