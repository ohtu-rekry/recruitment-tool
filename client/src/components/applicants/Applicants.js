import React, { Component } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../../redux/actions/actions'
import { Link } from 'react-router-dom'

import ApplicationStages from './ApplicationStages'
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
      fetchJobPosting(postingId)
      fetchApplicants(postingId)
      this.setState({ isLoaded: true })
    }
  }

  componentWillUnmount() {
    this.props.emptyJobPosting()
  }

  handleCopyStages = () => {
    const { stages, copyStages } = this.props
    copyStages(stages)
  }

  onDrop = async (result) => {
    const { destination, source, draggableId } = result

    if (!destination) { return }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    await this.props.moveApplicant(
      parseInt(draggableId, 10),
      parseInt(destination.droppableId, 10),
      parseInt(source.droppableId, 10),
      source.index
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
          <Link to='/position/new' style={{ textDecoration: 'none' }}>
            <button className='applicants__button' onClick={this.handleCopyStages}>
              Copy Templates
            </button>
          </Link>
        }
        <DragDropContext onDragEnd={this.onDrop}>
          <div className='application-stages'>
            {stages
              .sort((a, b) => a.orderNumber - b.orderNumber)
              .map(stage =>
                <ApplicationStages
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