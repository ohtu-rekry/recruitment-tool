import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import * as actions from '../../redux/actions/actions'
import Applicants from '../applicants/Applicants'

class AdminFrontPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false
    }
  }

  componentDidMount() {
    const { getApplicants, loggedIn } = this.props
    if (loggedIn) {
      getApplicants()
      this.setState({ isLoaded: true })
    }
  }

  componentWillReceiveProps(nProps) {
    const { getApplicants } = this.props
    if (nProps.loggedIn && !this.state.isLoaded) {
      getApplicants()
      this.setState({ isLoaded: true })
    }
  }

  render() {
    return (
      <div className='admin-frontpage'>
        <Applicants
          applicants={this.props.applicants}
          adminView={true}
        />
      </div>
    )
  }
}

AdminFrontPage.propTypes = {
  loggedIn: PropTypes.object,
  applicants: PropTypes.array.isRequired
}


const mapStateToProps = (state) => ({
  applicants: state.postingReducer.applicants,
  loggedIn: state.loginReducer.loggedIn
})

const mapDispatchToProps = {
  ...actions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminFrontPage)