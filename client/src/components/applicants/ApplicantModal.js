import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import Modal from '@material-ui/core/Modal'
import Clear from '@material-ui/icons/Clear'
import Person from '@material-ui/icons/Person'
import Email from '@material-ui/icons/Email'
import Calendar from '@material-ui/icons/CalendarToday'

class ApplicantModal extends React.Component {

  render() {
    const { applicantName, applicantEmail, createdAt, jobPosting } = this.props.applicant

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
        onClose={this.props.closeModal}
      >
        <div className='applicant-modal__card' >
          <Button
            style={buttonStyle}
            mini
            variant="fab"
            color="inherit"
            aria-label="Close"
            onClick={this.props.closeModal}
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
            <Calendar className='applicant-modal__card__icon' />
            <div className='applicant-modal__card__date'>
              {dateTime}
            </div>
          </div>
          {jobPosting && <div className='applicant-modal__card__date'>Applied for: {jobPosting}</div>}
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