import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import Tooltip from '@material-ui/core/Tooltip'
import Clear from '@material-ui/icons/Clear'
import Person from '@material-ui/icons/Person'
import Email from '@material-ui/icons/Email'
import CalendarToday from '@material-ui/icons/CalendarToday'
import Work from '@material-ui/icons/Work'
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
      jobPostingId
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

    console.log(applicant)


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
              return (
                <Tooltip key={index} title={attachment.path.substring(57)}>
                  <Chip
                    key={index}
                    label={this.truncateString(attachment.path.substring(57), 10)}
                    clickable={true}
                    onClick={() => window.open(attachment.path)} />
                </Tooltip>
              )
            })}
          </div>
          <Work className='applicant-modal__icon' />
          <Link to={`/position/${jobPostingId}`} className='applicant-modal__link'>
            <Button
              style={buttonStyle}
              color='inherit'
            >
              {jobPosting}
            </Button>
          </Link>
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

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicantModal))
