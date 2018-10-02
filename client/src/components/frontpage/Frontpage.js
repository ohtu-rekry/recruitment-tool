import React, { Component } from 'react'
import { connect } from 'react-redux'

class FrontPage extends Component {

  render() {
    return(
      <div>
        Welcome to the frontpage!
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  loggedIn: state.loginReducer.loggedIn
})

const mapDispatchToProps = {

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FrontPage)