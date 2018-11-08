import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Applicant from './Applicant'

import * as actions from '../../redux/actions/actions'

export class ApplicationStages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOver: false
    }
  }

  onDrag = (event, applicant) => {
    this.props.onDrag(event, applicant)
  }

  onDragOver = (event) => {
    this.setState({ isOver: true })
    event.preventDefault()
  }

  onDragLeave = (event) => {
    this.setState({ isOver: false })
    event.preventDefault()
  }

  onDrop = () => {
    this.setState({ isOver: false })
    this.props.onDrop(this.props.stage)
  }

  render() {
    const { stage } = this.props
    const { isOver } = this.state

    return (
      <div
        className='application-stage-container'
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        <div
          className='application-stage'
        >
          <div className='application-stage__title'>
            {stage.stageName}
          </div>
          <div
            id='application-stage__content'
            className='application-stage__content'
          >
            {stage.applicants && stage.applicants.map(applicant =>
              <Applicant
                key={applicant.id}
                applicant={applicant}
                onDrag={this.onDrag}
                toggleShowModal={this.props.toggleShowModal(applicant)}
              />
            )}
            <div
              style={{ display: !isOver && 'none' }}
              className='application-stage__placeholder'
            >
              Move applicant here
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ApplicationStages.propTypes = {
  stage: PropTypes.object.isRequired
}

const mapDispatchToProps = {
  ...actions
}

export default connect(
  null,
  mapDispatchToProps
)(ApplicationStages)