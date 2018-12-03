import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Chip } from '@material-ui/core'

export class JobPostingStage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stageUnderEdit: '',
      chipHidden: false,
      inputClassName: '__hidden'
    }
    this.textInput = React.createRef()
  }

  handleStageClick = (jobPostingStage) => {
    this.setState({
      stageUnderEdit: jobPostingStage.stageName,
      chipHidden: true,
      inputClassName: '__visible'
    })
    this.textInput.current.focus()
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
      document.getElementById(jobPostingStage.stageName).style.display = 'none'
      const updatedCurrentStages = this.state.currentStages.map((stage) =>
        stage === jobPostingStage.stageName ? this.state.stageUnderEdit : jobPostingStage.stageName)
      this.setState({
        currentStages: updatedCurrentStages,
        stageUnderEdit: ''
      })
    } else {
      this.setState({
        error: true
      })
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
    console.log(this.props)
    return (
      <div>
        {
          jobPostingStage.canRemove === true &&
          <div className={className + '__single-stage-editable'}>
            <Chip
              style={{ display: chipClassName }}
              className={className + '__chip'}
              label={(this.props.index + 1) + '. ' + jobPostingStage.stageName}
              onClick={() => this.handleStageClick(jobPostingStage)}
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
            <form id={jobPostingStage.stageName} onChange={this.handleStageRenameChange} onSubmit={(e) => this.handleStageRename(e, jobPostingStage)} className={className + '__stage-name-edit'}>
              <input id={`${jobPostingStage.stageName}_input`} onBlur={() => this.handleStageHide(jobPostingStage)} className={className + '__stage-name-edit__input'} type="text"></input>
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
  stages: state.jobPostingReducer.copiedStages,
  defaultStageNames: state.jobPostingReducer.defaultStageNames
})

const mapDispatchToProps = {
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPostingStage)
