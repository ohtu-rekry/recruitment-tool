import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

import { fetchJobPostings, emptyTokenExpired } from '../../redux/actions/actions'
import JobPostingListing from './JobPostingListing'
import LogoutSnackbar from './LogoutSnackbar'

class FrontPage extends Component {

  componentDidMount() {
    const { fetchJobPostings } = this.props
    fetchJobPostings(this.props.loggedIn)
  }

  handleCloseSnackbar = () => {
    this.props.emptyTokenExpired()
  }

  componentDidUpdate(pProps) {
    const { fetchJobPostings, loggedIn } = this.props
    if (pProps.loggedIn !== loggedIn) {
      fetchJobPostings(loggedIn)
    }
  }

  render() {
    const titleStyle = {
      color: '#002234'
    }
    return (
      <div className='frontpage'>
        {this.props.tokenExpired &&
          <LogoutSnackbar handleCloseSnackbar={this.handleCloseSnackbar} />
        }
        <Typography variant='display1' align='center' className='job-postings__title' style={titleStyle}>
          Open positions
        </Typography>
        <div className='job-postings'>
          <div className='job-postings__list' >
            {this.props.jobPostings !== undefined && this.props.jobPostings.map(posting =>
              <JobPostingListing key={posting.id} data={posting} />
            )}
          </div>
        </div>
      </div>
    )
  }
}

FrontPage.propTypes = {
  jobPostings: PropTypes.array.isRequired,
  tokenExpired: PropTypes.bool,
  emptyTokenExpired: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  jobPostings: state.jobPostingReducer.jobPostings,
  loggedIn: state.loginReducer.loggedIn,
  tokenExpired: state.loginReducer.tokenExpired
})

const mapDispatchToProps = {
  fetchJobPostings,
  emptyTokenExpired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FrontPage)