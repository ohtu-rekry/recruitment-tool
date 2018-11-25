import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Applicant from './Applicant'
import { Droppable } from 'react-beautiful-dnd'

import * as actions from '../../redux/actions/actions'

export class ApplicationStage extends Component {

  componentDidUpdate(pProps) {
    if (pProps.stage.applicants !== this.props.stage.applicants) {
      const contentDiv = document.getElementById('application-stage__content')
      contentDiv.scrollTop = 0
    }
  }

  render() {
    const { stage, adminView } = this.props
    const stageIdString = '' + stage.id

    return (
      <div
        className='application-stage'
      >
        <div className='application-stage__title'>
          {stage.stageName}
        </div>
        <Droppable
          droppableId={stageIdString}
          id={stage.id}
        >
          {(provided) => (
            <div
              id='application-stage__content'
              className='application-stage__content'
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {stage.applicants && stage.applicants
                .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .map((applicant, index) =>
                  <Applicant
                    key={applicant.id}
                    applicant={applicant}
                    index={index}
                    adminView={adminView}
                    toggleShowModal={this.props.toggleShowModal}
                  />
                )
              }
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    )
  }
}

ApplicationStage.propTypes = {
  stage: PropTypes.object.isRequired,
  toggleShowModal: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  ...actions
}

export default connect(
  null,
  mapDispatchToProps
)(ApplicationStage)