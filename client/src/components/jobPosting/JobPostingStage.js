import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Chip } from '@material-ui/core'

import { renamePostingStage, setStageError, removeStageInJobPosting } from '../../redux/actions/actions'

export class JobPostingStage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stageUnderEdit: '',
      chipHidden: false,
      inputClassName: '__hidden',
      currentStages: []
    }
    this.textInput = React.createRef()
  }

  componentDidMount() {
    const currentStageNames = this.props.jobPostingStages.map((stage) =>
      stage.stageName)
    this.setState({
      currentStages: currentStageNames
    })
  }

  handleStageDelete = (stage) => {
    this.props.removeStageInJobPosting(stage)
  }

  handleStageClick = async () => {
    await this.setState({
      stageUnderEdit: '',
      chipHidden: true,
      inputClassName: '__visible'
    })
    await this.textInput.current.focus()
  }

  handleStageHide = () => {
    this.textInput.current.blur()
    this.setState({
      chipHidden: false,
      inputClassName: '__hidden'
    })
  }

  handleStageRenameChange = (e) => {
    this.setState({
      stageUnderEdit: e.target.value
    })
  }

  handleStageRename = (e, jobPostingStage) => {
    e.preventDefault()
    if (this.verifyStageName(this.state.stageUnderEdit)) {
      this.props.renamePostingStage(jobPostingStage, this.state.stageUnderEdit)
      this.props.setStageError({ errorMessage: '' })
      const updatedCurrentStages = this.state.currentStages.map((stage) =>
        stage === jobPostingStage.stageName ? this.state.stageUnderEdit : jobPostingStage.stageName)
      this.setState({
        chipHidden: false,
        inputClassName: '__hidden',
        currentStages: updatedCurrentStages,
        stageUnderEdit: ''
      })
    } else {
      this.props.setStageError({ errorMessage: 'Invalid stage name. Stage was not renamed' })
    }
  }

  verifyStageName = (stageName) => {
    if (!stageName.trim()
      || stageName.length > 255
      || this.state.currentStages.includes(stageName)
      || this.props.defaultStageNames.includes(stageName)) {
      return false
    }
    return true
  }

  render() {
    const { jobPostingStage, className } = this.props
    const chipClassName = this.state.chipHidden ? 'none' : 'inline-flex'
    return (
      <div>
        {
          jobPostingStage.canRemove === true &&
          <div className={className + '__single-stage-editable'}>
            <Chip
              style={{ display: chipClassName }}
              className={className + '__chip'}
              label={(this.props.index + 1) + '. ' + jobPostingStage.stageName}
              onClick={() => this.handleStageClick()}
              onDelete={() => this.handleStageDelete(jobPostingStage)} />
            <form className={className + '__stage-name-edit' + this.state.inputClassName} onChange={this.handleStageRenameChange} onSubmit={(e) => this.handleStageRename(e, jobPostingStage)}>
              <input ref={this.textInput} onBlur={() => this.handleStageHide(jobPostingStage)} className={className + '__stage-name-edit__input'} type="text"></input>
            </form>
          </div>
        }
        {
          (jobPostingStage.canRemove === false
            && !this.props.defaultStageNames.includes(jobPostingStage.stageName)) &&
          <div>
            <Chip
              id={jobPostingStage.stageName + '_chip'}
              label={(this.props.index + 1) + '. ' + jobPostingStage.stageName}
              onClick={() => this.handleStageClick(jobPostingStage)}
            />
            <form className={className + '__stage-name-edit' + this.state.inputClassName} onChange={this.handleStageRenameChange} onSubmit={(e) => this.handleStageRename(e, jobPostingStage)}>
              <input ref={this.textInput} onBlur={() => this.handleStageHide(jobPostingStage)} className={className + '__stage-name-edit__input'} type="text"></input>
            </form>
          </div>
        }
        {
          (jobPostingStage.canRemove === false
            && this.props.defaultStageNames.includes(jobPostingStage.stageName)) &&
          <div>
            <Chip
              label={(this.props.index + 1) + '. ' + jobPostingStage.stageName}
            />
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  jobPostingStages: state.jobPostingReducer.jobPostingStages,
  defaultStageNames: state.jobPostingReducer.defaultStageNames
})

const mapDispatchToProps = {
  renamePostingStage,
  setStageError,
  removeStageInJobPosting
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPostingStage)
