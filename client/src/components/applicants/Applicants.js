import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchApplicants }  from '../../redux/actions/actions'

import ApplicationStages from './ApplicationStages'

export class Applicants extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
    const { fetchApplicants, loggedIn } = this.props
    const postingId = window.location.href.split('/')[4]
    fetchApplicants(postingId)
  }

  /*   componentWillReceiveProps(nProps) {
    const { fetchApplicants, stages } = this.props
    console.log(stages)
    console.log("nporp", nProps.stages);
    if (nProps.loggedIn.token || (stages !== nProps.stages)) {
      const postingId = window.location.href.split('/')[4]
      fetchApplicants(postingId)
    }
  }
 */
  render() {
    const { stages } = this.props
    return (
      <div className='applicantion-stages'>
        {stages.map(stage =>
          <ApplicationStages
            stage={stage}
            key={stage.id}
          />
        )}
      </div>
    )
  }
}

Applicants.propTypes = {
  loggedIn: PropTypes.object,
  jobPosting: PropTypes.object,
  fetchApplicants: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  loggedIn: state.loginReducer.loggedIn,
  jobPosting: state.postingReducer.jobPosting,
  stages: state.postingReducer.stages
})

const mapDispatchToProps = {
  fetchApplicants
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Applicants)