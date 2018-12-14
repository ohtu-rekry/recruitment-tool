import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Clear from '@material-ui/icons/Clear'
import Person from '@material-ui/icons/Person'
import Email from '@material-ui/icons/Email'
import Attachment from '@material-ui/icons/Attachment'
import CalendarToday from '@material-ui/icons/CalendarToday'
import Work from '@material-ui/icons/Work'

import ApplicantModalDropzone from './ApplicantModalDropzone'
import ApplicationComments from '../../comments/ApplicationComments'
import ApplicantModalMetadataItem from './ApplicantModalMetadataItem'
import ApplicantModalAttachments from './ApplicantModalAttachments'
import * as actions from '../../../redux/actions/actions'

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

  render() {
    const { applicant, comments, classes } = this.props
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

    return (
      <Modal
        open={true}
        onClose={this.handleClose}
        classes={{ root: classes.root }}
      >
        <div className='applicant-modal'>
          <button
            onClick={this.handleClose}
            className='applicant-modal__close-button'
          >
            <Clear />
          </button>
          <div className='applicant-modal__metadata-container'>
            <ApplicantModalMetadataItem
              icon={<Person />}
              data={applicantName}
            />
            <ApplicantModalMetadataItem
              icon={<Email />}
              data={applicantEmail}
            />
            <ApplicantModalMetadataItem
              icon={<CalendarToday />}
              data={dateTime}
            />
            {jobPosting && <ApplicantModalMetadataItem
              icon={<Work />}
              data={
                <Link
                  to={`/position/${jobPostingId}`}
                  className='applicant-modal__link'
                >
                  {jobPosting}
                </Link>
              }
            />}
            {applicant.attachments &&
            <ApplicantModalMetadataItem
              icon={<Attachment />}
              data={<ApplicantModalAttachments applicant={applicant} />}
            />}
          </div>
          <ApplicantModalDropzone applicationId={id} />
          <ApplicationComments comments={comments} />
        </div>
      </Modal>
    )
  }
}

const styles = {
  root: {
    overflowY: 'scroll'
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
)(withStyles(styles)(ApplicantModal)))
