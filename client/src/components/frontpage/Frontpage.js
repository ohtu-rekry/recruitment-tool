import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

import { fetchJobPostings } from '../../redux/actions/actions'
import Header from './Header'
import JobPosting from './JobPosting'

class FrontPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fireRedirect: false,
      jobPostingId: null
    }
    this.handleJobPostingClick = this.handleJobPostingClick.bind(this)
  }

  componentDidMount() {
    const { fetchJobPostings } = this.props
    fetchJobPostings()
  }

  handleJobPostingClick(id) {
    this.setState({
      fireRedirect: true,
      jobPostingId: id
    })
  }

  render() {
    if (this.state.fireRedirect) {
      return <Redirect to={`/jobposting/${this.state.jobPostingId}`} />
    }
    return (
      <div className='frontpage'>
        <Header />
        <div className='job-postings'>
          <div className='job-postings__list' >
            {this.props.jobPostings.map(posting =>
              <JobPosting key={posting.id} data={posting} onClick={() => this.handleJobPostingClick(posting.id)} />
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