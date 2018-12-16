import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Menu from '@material-ui/icons/Menu'
import ExitToApp from '@material-ui/icons/ExitToApp'
import * as actions from '../redux/actions/actions'
import * as selectors from '../redux/selectors/selectors'

export class MobileMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEnlarged: false
    }
    this.dropdownRef = React.createRef()
    this.menuRef = React.createRef()
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick)
  }

  componentDidUpdate(pProps) {
    if (pProps.location !== this.props.location) {
      this.setState({ isEnlarged: false })
    }
  }

  handleClick = (e) => {
    const iconElem = document.getElementById('navigation-bar__icon')

    if (
      this.menuRef.current === e.target ||
      iconElem === e.target ||
      (
        e.target &&
        this.dropdownRef.current &&
        this.dropdownRef.current.contains(e.target)
      )
    ) {
      return
    } else if (this.dropdownRef.current !== e.target) {
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
          ref={this.menuRef}
        >
          <Menu
            style={{ fontSize: 35 }}
            id='navigation-bar__icon'
          />
        </button>

        {isEnlarged &&
          <div
            className='navigation-bar__drop-down-menu'
            ref={this.dropdownRef}
          >
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
  loggedIn: selectors.getUser(state)
})

const mapDispatchToProps = {
  ...actions
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileMenu))