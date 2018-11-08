import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

class ApplicantModal extends React.Component {

  componentWillMount() {
    window.addEventListener('keyup', this.handleKeyPress)
    document.addEventListener('click', this.handleClick)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyPress)
    document.removeEventListener('click', this.handleClick)
  }

  handleKeyPress = (event) => {
    console.log(event.key)
    if (event.key === 'Escape') {
      this.props.toggleShowModal()
      window.removeEventListener('keyup', this.handleKeyPress)
    }
  }

  handleClick = (event) => {
    if (!this.modalCard.contains(event.target)) {
      this.props.toggleShowModal()
      document.removeEventListener('click', this.handleClick)
    }
  }

  render() {
    const { applicantName, applicantEmail, createdAt } = this.props.applicant

    let dateTime = new Date(createdAt).toLocaleString([], {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })

    return (
      <div className='applicant-modal'>
        <div
          className='applicant-modal__card'
          ref={node => this.modalCard = node}
        >
          <div className='applicant-modal__card__name'>
            {applicantName}
          </div>
          <div className='applicant-modal__card__email'>
            {applicantEmail}
          </div>
          <div className='applicant-modal__card__date'>
            Application sent: {dateTime}
          </div>
          <Button
            mini
            variant="fab"
            color="inherit"
            aria-label="X"
            onClick={this.props.toggleShowModal}
          >
            <AddIcon />
          </Button>
        </div>
      </div>
    )
  }
}

ApplicantModal.propTypes = {
  applicant: PropTypes.object.isRequired,
  toggleShowModal: PropTypes.func.isRequired
}

export default ApplicantModal