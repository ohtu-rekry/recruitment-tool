import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { fetchJobPostings } from '../../redux/actions/actions'
import Header from './Header'
import JobPosting from './JobPosting'

class FrontPage extends Component {

  componentDidMount() {
    const { fetchJobPostings } = this.props
    fetchJobPostings()
  }

  render() {
    return (
      <div className='frontpage'>
        <Header />
        <div className='job-postings'>
          <div className='job-postings__list' >
            {this.props.jobPostings.map(posting =>
              <Link
                to={`/jobposting/${posting.id}`}
                key={posting.id}
                className='job-posting__link' >

                <JobPosting data={posting} />

              </Link>
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