import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { fetchJobPostings } from '../../redux/actions/actions'
import JobPostingListing from './JobPostingListing'

class FrontPage extends Component {

  componentDidMount() {
    const { fetchJobPostings } = this.props
    fetchJobPostings()
  }

  render() {
    return (
      <div className='frontpage'>
        <div className='job-postings'>
          <div className='job-postings__list' >
            {this.props.jobPostings.map(posting =>
              <JobPostingListing key={posting.id} data={posting} onClick={() => this.handleJobPostingClick(posting.id)} />
            )}
          </div>
        </div>
      </div>
    )
  }
}

FrontPage.protoTypes = {
  jobPostings: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
  jobPostings: state.jobPostingReducer.jobPostings
})

const mapDispatchToProps = {
  fetchJobPostings
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FrontPage)