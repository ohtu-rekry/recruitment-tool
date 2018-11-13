import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../../redux/actions/actions'
import { Link } from 'react-router-dom'

import ApplicationStages from './ApplicationStages'

export class Applicants extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false,
      selectedApplicant: ''
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

  onDrag = (event, applicant) => {
    if (!this.props.adminView) {
      event.dataTransfer.setData('text', event.target.id)
      this.setState({
        selectedApplicant: applicant
      })
    }
  }

  onDrop = (stage) => {
    if (!this.props.adminView) {
      const { selectedApplicant } = this.state
      this.props.moveApplicant(selectedApplicant, stage)
      this.setState({
        selectedApplicant: ''
      })
    }
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
          <Link to='/jobposting/new' style={{ textDecoration: 'none' }}>
            <button className='applicants__button' onClick={this.handleCopyStages}>
              Copy Templates
            </button>
          </Link>
        }
        <div className='application-stages'>
          {stages
            .sort((a, b) => a.orderNumber - b.orderNumber)
            .map(stage =>
              <ApplicationStages
                stage={stage}
                key={stage.id}
                onDrag={this.onDrag}
                onDrop={this.onDrop}
                adminView={adminView}
              />
            )}
        </div>
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