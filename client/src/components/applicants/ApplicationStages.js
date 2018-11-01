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
    let objDiv = document.getElementById('application-stage__content')
    objDiv.scrollTop = objDiv.scrollHeight
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

    return (
      <div className='application-stage'>
        <div className='application-stage__title'>
          {stage.stageName}
        </div>
        <div
          id='application-stage__content'
          className='application-stage__content'
          onDrop={event => this.onDrop(event)}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragLeave}
        >
          {stage.applicants && stage.applicants.map(applicant =>
            <Applicant
              key={applicant.id}
              applicant={applicant}
              onDrag={this.onDrag}
            />
          )}
          {this.state.isOver &&
            <div className='application-stage__placeholder'>
              Move applicant here
            </div>
          }
        </div>
      </div>
    )
  }
}

ApplicationStages.propTypes = {
  stage: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  loggedIn: state.loginReducer.loggedIn,
  loginError: state.loginReducer.loginError
})

const mapDispatchToProps = {
  ...actions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationStages)