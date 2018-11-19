import React, { Component } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../../redux/actions/actions'
import { Link } from 'react-router-dom'

import ApplicationStage from './ApplicationStage'
import ApplicantModal from './ApplicantModal'

export class Applicants extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false,
      modalApplicant: ''
    }
  }

  componentDidMount() {
    const { fetchApplicants, loggedIn, adminView } = this.props
    const postingId = window.location.href.split('/')[4]
    if (loggedIn && !adminView) {
      fetchApplicants(postingId)
      this.setState({ isLoaded: true })
    }
  }

  componentWillReceiveProps(nProps) {
    const { fetchApplicants, fetchJobPosting, adminView } = this.props
    const postingId = window.location.href.split('/')[4]
    if (nProps.loggedIn && !this.state.isLoaded && !adminView) {
      fetchJobPosting(postingId, nProps.loggedIn)
      fetchApplicants(postingId)
      this.setState({ isLoaded: true })
    }
  }

  componentWillUnmount() {
    this.props.emptyJobPosting()
  }

  handleCopyJobPosting = () => {
    const { jobPosting, stages, copyJobPosting } = this.props

    const copiedJobPosting = {
      title: jobPosting.title,
      content: jobPosting.content,
      showFrom: jobPosting.showFrom,
      showTo: jobPosting.showTo
    }
    copyJobPosting(copiedJobPosting, stages)
  }

  onDrop = (result) => {
    const { destination, source, draggableId } = result

    if (!destination) { return }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    this.props.moveApplicant(
      parseInt(draggableId, 10),
      parseInt(destination.droppableId, 10),
      parseInt(source.droppableId, 10),
      source.index,
      this.props.stages
    )
  }

  toggleShowModal = (applicant) => {
    this.setState({
      modalApplicant: applicant
    })
  }

  render() {
    let { stages, jobPosting, applicants, adminView } = this.props
    if (applicants) {
      stages = applicants
    }

    return (
      <div className='applicants'>
        <div className='applicants__title'>
          {applicants ? 'All applicants' : jobPosting.title}
        </div>
        {!adminView &&
          <Link
            to={{ pathname: '/position/new', state: { mode: 'copy' } }}
            style={{ textDecoration: 'none' }}
          >
            <button className='applicants__button' onClick={this.handleCopyJobPosting}>
              Copy Position
            </button>
          </Link>
        }
        <DragDropContext onDragEnd={this.onDrop}>
          <div className='application-stages'>
            {stages
              .sort((a, b) => a.orderNumber - b.orderNumber)
              .map(stage =>
                <ApplicationStage
                  stage={stage}
                  key={stage.id}
                  adminView={adminView}
                  toggleShowModal={this.toggleShowModal}
                />
              )}
          </div>
        </DragDropContext>
        {this.state.modalApplicant &&
          <ApplicantModal
            applicant={this.state.modalApplicant}
            closeModal={this.toggleShowModal}
          />
        }
      </div>
    )
  }
}

Applicants.propTypes = {
  loggedIn: PropTypes.object,
  jobPosting: PropTypes.object,
  stages: PropTypes.array
}

const mapStateToProps = (state) => ({
  loggedIn: state.loginReducer.loggedIn,
  jobPosting: state.postingReducer.jobPosting,
  stages: state.postingReducer.stages
})

const mapDispatchToProps = {
  ...actions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Applicants)