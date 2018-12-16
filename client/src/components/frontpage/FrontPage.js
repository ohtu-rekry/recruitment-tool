import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

import * as actions from '../../redux/actions/actions'
import * as selectors from '../../redux/selectors/selectors'
import JobPostingListing from './JobPostingListing'
import LogoutSnackbar from './LogoutSnackbar'

class FrontPage extends Component {

  componentDidMount() {
    const { fetchJobPostings } = this.props
    fetchJobPostings()
  }

  handleCloseSnackbar = () => {
    this.props.emptyTokenExpired()
  }

  compareJobPostings = (a, b) => {
    return a.isHidden - b.isHidden || a.title.localeCompare(b.title)
  }

  componentDidUpdate(pProps) {
    const { fetchJobPostings, loggedIn } = this.props
    if (pProps.loggedIn !== loggedIn) {
      fetchJobPostings()
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
            {this.props.jobPostings !== undefined &&
            this.props.jobPostings
              .sort(this.compareJobPostings)
              .map(posting =>
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
  jobPostings: selectors.getPostings(state),
  loggedIn: selectors.getUser(state),
  tokenExpired: selectors.getTokenExpiredStatus(state)
})

const mapDispatchToProps = {
  ...actions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FrontPage)