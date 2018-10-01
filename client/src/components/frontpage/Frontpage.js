import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { LinkButton } from '../Buttons'

class FrontPage extends Component {

  render() {
    const { loggedIn } = this.props

    return(
      <div>
        Welcome to the frontpage!
        {loggedIn && <LinkButton link='/jobpostings/new' text='Add new job posting' />}
      </div>
    )
  }
}

FrontPage.propTypes = {
  loggedIn: PropTypes.object
}

const mapStateToProps = (state) => ({
  loggedIn : state.loginReducer.loggedIn
})

const mapDispatchToProps = {

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FrontPage)