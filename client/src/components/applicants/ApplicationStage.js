import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Applicant from './Applicant'
import { Droppable, Draggable } from 'react-beautiful-dnd'

import * as actions from '../../redux/actions/actions'

export class ApplicationStage extends Component {

  componentDidUpdate(pProps) {
    if (pProps.stage.applicants !== this.props.stage.applicants) {
      const contentDiv = document.getElementById('application-stage__content')
      contentDiv.scrollTop = 0
    }
  }

  validateDrag = () => {
    const { adminView, stage } = this.props
    const name = stage.stageName.toLowerCase().trim()

    if (adminView) return true
    if (
      name === 'applied' ||
      name === 'accepted' ||
      name === 'rejected'
    ) return true
    return false
  }

  render() {
    const { stage, adminView, index } = this.props
    const stageIdString = '' + stage.id
    const dragDisabled = this.validateDrag()

    return (
      <Draggable
        draggableId={'stage' + stageIdString}
        index={index}
        isDragDisabled={dragDisabled}
        disableInteractiveElementBlocking
      >
        {(provided) => (
          <div
            className="application-stage-wrapper"
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <div className='application-stage'>
              <div
                className='application-stage__title'
                {...provided.dragHandleProps}
              >
                {stage.stageName}
              </div>
              <Droppable
                droppableId={stageIdString}
                id={stage.id}
                type='applicant'
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
          </div>
        )}
      </Draggable>
    )
  }
}

ApplicationStage.propTypes = {
  stage: PropTypes.object.isRequired,
  adminView: PropTypes.bool,
  index: PropTypes.number.isRequired,
  toggleShowModal: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  ...actions
}

export default connect(
  null,
  mapDispatchToProps
)(ApplicationStage)