import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from '@material-ui/core'
import { Clear, Person, Email, CalendarToday } from '@material-ui/icons'
import ApplicantModalDropzone from './ApplicantModalDropzone'
import ApplicationComment from '../comments/ApplicationComment'

class ApplicantModal extends React.Component {

  handleClose = () => {
    this.props.closeModal(null)
  }

  render() {
    const {
      id,
      applicantName,
      applicantEmail,
      createdAt,
      jobPosting,
      applicationComments
    } = this.props.applicant

    let dateTime = new Date(createdAt).toLocaleString([], {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })

    const buttonStyle = {
      alignSelf: 'flex-end'
    }

    return (
      <Modal
        open={true}
        onClose={this.handleClose}
      >
        <div className='applicant-modal__card' >
          <Button
            style={buttonStyle}
            mini
            variant='fab'
            color='inherit'
            aria-label='Close'
            onClick={this.handleClose}
          >
            <Clear />
          </Button>
          <div>
            <Person className='applicant-modal__card__icon' />
            <div className='applicant-modal__card__name'>
              {applicantName}
            </div>
          </div>
          <div>
            <Email className='applicant-modal__card__icon' />
            <div className='applicant-modal__card__email'>
              {applicantEmail}
            </div>
          </div>
          <div>
            <CalendarToday className='applicant-modal__card__icon' />
            <div className='applicant-modal__card__date'>
              {dateTime}
            </div>
          </div>
          {jobPosting &&
            <div className='applicant-modal__card__date'>
              Applied for: {jobPosting}
            </div>}
          <ApplicantModalDropzone applicantId={id} />
          <div className='applicant-modal__card__comments-title'>Comments ({applicationComments.length})</div>
          {applicationComments && <div className='applicant-modal__card__comments'>
            {applicationComments
              .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map(comment =>
                <ApplicationComment key={comment.id} comment={comment}/>
              )}
          </div>}
        </div>
      </Modal>
    )
  }
}

ApplicantModal.propTypes = {
  applicant: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired
}

export default ApplicantModal