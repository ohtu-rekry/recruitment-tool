import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Draggable } from 'react-beautiful-dnd'

class Applicant extends Component {

  handleOpenModal = () => {
    this.props.toggleShowModal(this.props.applicant)
  }

  render() {
    const { adminView, applicant } = this.props
    const { applicantName, applicantEmail, createdAt, jobPosting } = applicant
    const applicantIdString = '' + this.props.applicant.id
    let dateTime = new Date(createdAt).toLocaleString([], {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
    return (
      <Draggable
        draggableId={applicantIdString}
        index={this.props.index}
        id={this.props.applicant.id}
        isDragDisabled={adminView}
      >
        {(provided, snapshot) => (
          <div
            className={snapshot.isDragging ? 'applicant drag' : 'applicant'}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={this.handleOpenModal}
          >
            <div className='applicant__name'>
              {applicantName}
            </div>
            <div className='applicant__email'>
              {applicantEmail}
            </div>
            <div className='applicant__date'>Application sent: {dateTime}</div>
            {jobPosting && <div className='applicant__date'>Applied for: {jobPosting}</div>}
          </div>
        )}
      </Draggable>

    )
  }
}

Applicant.propTypes = {
  applicant: PropTypes.object.isRequired,
  toggleShowModal: PropTypes.func.isRequired
}

export default Applicant