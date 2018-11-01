import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Applicant from './Applicant'

import * as actions from '../../redux/actions/actions'

export class ApplicationStages extends Component {

  onDrag = (event, applicant) => {
    event.preventDefault()
    this.props.onDrag(applicant)
  }

  onDragOver = (event) => {
    event.preventDefault()
  }

  onDrop = () => {
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
          className='application-stage__content'
          onDrop={event => this.onDrop(event)}
          onDragOver={(event => this.onDragOver(event))}
        >
          {stage.applicants && stage.applicants.map(applicant =>
            <Applicant
              key={applicant.id}
              applicant={applicant}
              onDrag={this.onDrag}
            />
          )}
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