import React, { Component } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../../redux/actions/actions'
import { Link } from 'react-router-dom'

import NavigateBefore from '@material-ui/icons/NavigateBefore'

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
      fetchJobPosting(postingId)
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
    const { destination, source, draggableId, type } = result
    const { stages, moveStage, moveApplicant } = this.props

    if (!destination) { return }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    if (type === 'column') {
      if (
        destination.index === 0 ||
        destination.index === stages.length - 1 ||
        destination.index === stages.length - 2
      ) return

      moveStage(source.index, destination.index, stages)
      return
    }

    moveApplicant(
      parseInt(draggableId, 10),
      parseInt(destination.droppableId, 10),
      parseInt(source.droppableId, 10),
      source.index,
      stages
    )
  }

  toggleShowModal = (applicant) => {
    this.setState({
      modalApplicant: applicant
    })
  }

  render() {
    let { stages, jobPosting, applicants, adminView } = this.props
    let title = jobPosting.title
    if (applicants) {
      stages = applicants
      title = 'All applicants'
    }

    return (
      <div className='applicants'>
        <div className='applicants__title'>
          {!applicants &&
          <Link
            to={{ pathname: `/position/${jobPosting.id}` }}
            style={{ textDecoration: 'none' }}
          >
            <button className='applicants__navigate-back'>
              <NavigateBefore style={{ height: 18, width: 18 }}/>
            </button>
          </Link>
          }
          {title}
        </div>
        {!adminView &&
          <Link
            to={{ pathname: '/position/new', state: { mode: 'copy' } }}
            style={{ textDecoration: 'none' }}
          >
            <button className='applicants__button' onClick={this.handleCopyJobPosting}>
              Copy as template
            </button>
          </Link>
        }
        <DragDropContext onDragEnd={this.onDrop}>
          <Droppable
            droppableId='all-stages'
            direction='horizontal'
            type='column'
          >
            {(provided) => (
              <div
                className='application-stages'
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {stages
                  .sort((a, b) => a.orderNumber - b.orderNumber)
                  .map((stage, index) =>
                    <ApplicationStage
                      stage={stage}
                      key={stage.id}
                      index={index}
                      adminView={adminView}
                      toggleShowModal={this.toggleShowModal}
                    />
                  )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
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
  stages: PropTypes.array,
  adminView: PropTypes.bool
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