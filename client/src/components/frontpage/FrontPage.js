import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

import { fetchJobPostings } from '../../redux/actions/actions'
import JobPostingListing from './JobPostingListing'

class FrontPage extends Component {

  componentDidMount() {
    const { fetchJobPostings } = this.props
    fetchJobPostings(this.props.loggedIn)
    console.log(this.props.jobPostings)
  }

  render() {
    const titleStyle = {
      color: '#002234'
    }
    return (
      <div className='frontpage'>
        <Typography variant='display1' align='center' className='job-postings__title' style={titleStyle}>
          Open positions
        </Typography>
        <div className='job-postings'>
          <div className='job-postings__list' >
            {this.props.jobPostings !== undefined && this.props.jobPostings.map(posting =>
              <JobPostingListing key={posting.id} data={posting} onClick={() => this.handleJobPostingClick(posting.id)} />
            )}
          </div>
        </div>
      </div>
    )
  }
}

FrontPage.propTypes = {
  jobPostings: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
  jobPostings: state.jobPostingReducer.jobPostings,
  loggedIn: state.loginReducer.loggedIn
})

const mapDispatchToProps = {
  fetchJobPostings
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FrontPage)