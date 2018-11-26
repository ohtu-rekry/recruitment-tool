import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import Clear from '@material-ui/icons/Clear'
import Person from '@material-ui/icons/Person'
import Email from '@material-ui/icons/Email'
import CalendarToday from '@material-ui/icons/CalendarToday'
import ApplicantModalDropzone from './ApplicantModalDropzone'

class ApplicantModal extends React.Component {

  handleClose = () => {
    this.props.closeModal(null)
  }

  render() {
    const { id, applicantName, applicantEmail, createdAt, jobPosting } = this.props.applicant

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
          <ApplicantModalDropzone applicationId={id} />
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