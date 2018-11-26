import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Menu, ExitToApp } from '@material-ui/icons'
import * as actions from '../redux/actions/actions'

export class MobileMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEnlarged: false
    }
  }

  componentDidUpdate(pProps) {
    if (pProps.location !== this.props.location) {
      this.setState({ isEnlarged: false })
    }
  }

  onMenuClick = () => {
    this.setState((prevState) => ({
      isEnlarged: !prevState.isEnlarged
    }))
  }

  render() {
    const { isEnlarged } = this.state
    const { loggedIn } = this.props

    return (
      <div>
        <button
          className='navigation-bar__hamburger-menu'
          onClick={this.onMenuClick}
        >
          <Menu style={{ fontSize: 35 }}/>
        </button>

        {isEnlarged &&
          <div className='navigation-bar__drop-down-menu'>
            <NavLink
              to='/positions'
              className='navigation-bar__drop-down-menu-item'
              activeClassName='navigation-bar__drop-down-menu-item active'
            >
              All postings
            </NavLink>
            {loggedIn &&
            <React.Fragment>
              <NavLink
                to='/position/new'
                className='navigation-bar__drop-down-menu-item'
                activeClassName='navigation-bar__drop-down-menu-item active'
              >
                New posting
              </NavLink>
              <button
                className='navigation-bar__drop-down-menu-item'
                onClick={this.props.logout}
              >
                Log Out <ExitToApp style={{ fontSize: 20, marginLeft: 5 }}/>
              </button>
            </React.Fragment>
            }
          </div>
        }
      </div>
    )
  }
}

MobileMenu.propTypes = {
  loggedIn: PropTypes.object,
  logout: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  loggedIn: state.loginReducer.loggedIn
})

const mapDispatchToProps = {
  ...actions
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileMenu))