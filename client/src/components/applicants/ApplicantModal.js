import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Modal, Button, Chip } from '@material-ui/core'
import { Clear, Person, Email, CalendarToday } from '@material-ui/icons'
import ApplicantModalDropzone from './ApplicantModalDropzone'
import ApplicationComment from '../comments/ApplicationComment'
import * as actions from '../../redux/actions/actions'

class ApplicantModal extends React.Component {

  componentDidMount() {
    const { getComments, applicant } = this.props
    getComments(applicant.id)
  }

  componentWillUnmount() {
    this.props.emptyComments()
  }

  handleClose = () => {
    this.props.closeModal(null)
  }

  truncateString(str, length) {
    const dots = str.length > length ? '...' : ''
    return str.substring(0, length) + dots
  }

  render() {
    const { applicant, comments } = this.props
    const {
      id,
      applicantName,
      applicantEmail,
      createdAt,
      jobPosting,
    } = applicant


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
        <div className='applicant-modal' >
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
            <Person className='applicant-modal__icon' />
            <div className='applicant-modal__name'>
              {applicantName}
            </div>
          </div>
          <div>
            <Email className='applicant-modal__icon' />
            <div className='applicant-modal__email'>
              {applicantEmail}
            </div>
          </div>
          <div>
            <CalendarToday className='applicant-modal__icon' />
            <div className='applicant-modal__date'>
              {dateTime}
            </div>
          </div>
          {jobPosting &&
            <div>
              <h5>Applied for: {jobPosting}</h5>
            </div>}
          <div>
            <h5>Application's attachments</h5>
            {applicant.attachments.map((attachment, index) => {
              return <Chip
                key={index}
                label={this.truncateString(attachment.path.substring(44), 10)}
                clickable={true}
                onClick={() => window.open(attachment.path)} />
            })}
          </div>
          <ApplicantModalDropzone applicationId={id} />
          <div className='applicant-modal__comments-title'>Comments ({comments.length})</div>
          {comments && <div className='applicant-modal__comments'>
            {comments
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map(comment =>
                <ApplicationComment key={comment.id} comment={comment} />
              )}
          </div>}
        </div>
      </Modal>
    )
  }
}

ApplicantModal.propTypes = {
  applicant: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
  comments: state.postingReducer.comments
})

const mapDispatchToProps = {
  ...actions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicantModal)
